import { ScanRecord } from '../types';
import { create } from 'zustand';
import { EventBus } from '../events/EventBus';
import { deleteDocument, renameDocument, toggleDocumentFavorite } from './documentMutations';
import { createScanPersistence } from '../storage/scanPersistence';

const persistence = createScanPersistence();

type State = {
  scans: ScanRecord[];
  activeScan: ScanRecord | null;
  hydrate: () => Promise<void>;
  add: (scan: ScanRecord) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setActive: (scan: ScanRecord | null) => void;
  update: (id: string, patch: Partial<ScanRecord>) => Promise<void>;
  rename: (id: string, title: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  replaceAll: (scans: ScanRecord[]) => Promise<void>;
};

async function persist(scans: ScanRecord[]) {
  await persistence.save(scans);
}

export const useScanStore = create<State>((set, get) => {
  const transition = async (
    previousScans: ScanRecord[],
    nextScans: ScanRecord[],
    previousActive: ScanRecord | null,
    nextActive: ScanRecord | null,
  ) => {
    set({ scans: nextScans, activeScan: nextActive });
    try {
      await persist(nextScans);
    } catch (error) {
      set({ scans: previousScans, activeScan: previousActive });
      throw error;
    }
  };

  return {
    scans: [],
    activeScan: null,
    hydrate: async () => {
      try {
        set({ scans: await persistence.load() });
      } catch {
        set({ scans: [] });
      }
    },
    add: async (scan: ScanRecord) => {
      const previousScans = get().scans;
      const previousActive = get().activeScan;
      const nextScans = [scan, ...previousScans];
      await transition(previousScans, nextScans, previousActive, scan);
      try {
        EventBus.emit({ type: 'scan_completed', payload: { id: scan.id, pages: scan.pages.length } });
      } catch {
        // Analytics/event delivery must never invalidate a successfully persisted scan.
      }
    },
    remove: async (id: string) => {
      const previousScans = get().scans;
      const previousActive = get().activeScan;
      const nextScans = deleteDocument(previousScans, id);
      const nextActive = previousActive?.id === id ? null : previousActive;
      await transition(previousScans, nextScans, previousActive, nextActive);
    },
    setActive: (activeScan) => set({ activeScan }),
    update: async (id, patch) => {
      const previousScans = get().scans;
      const previousActive = get().activeScan;
      const now = Date.now();
      const nextScans = previousScans.map((scan) =>
        scan.id === id ? { ...scan, ...patch, updatedAt: now } : scan,
      );
      const nextActive = previousActive?.id === id
        ? { ...previousActive, ...patch, updatedAt: now }
        : previousActive;
      await transition(previousScans, nextScans, previousActive, nextActive);
    },
    rename: async (id: string, title: string) => {
      const previousScans = get().scans;
      const previousActive = get().activeScan;
      const nextScans = renameDocument(previousScans, id, title);
      const nextActive = previousActive?.id === id
        ? nextScans.find((scan) => scan.id === id) ?? null
        : previousActive;
      await transition(previousScans, nextScans, previousActive, nextActive);
    },
    toggleFavorite: async (id: string) => {
      const previousScans = get().scans;
      const previousActive = get().activeScan;
      const nextScans = toggleDocumentFavorite(previousScans, id);
      const nextActive = previousActive?.id === id
        ? nextScans.find((scan) => scan.id === id) ?? null
        : previousActive;
      await transition(previousScans, nextScans, previousActive, nextActive);
    },
    replaceAll: async (scans: ScanRecord[]) => {
      const previousScans = get().scans;
      const previousActive = get().activeScan;
      await transition(previousScans, scans, previousActive, null);
    },
  };
});
