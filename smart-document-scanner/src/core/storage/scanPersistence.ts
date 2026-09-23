import { asyncStorageAdapter, StorageAdapter } from './StorageAdapter';
import { sanitizeEditHistory } from '../services/editHistory';
import type { ScanFilter, ScanPage, ScanRecord } from '../types';

const KEY = 'smart-scanner-scans';
const BACKUP_KEY = 'smart-scanner-scans-backup';
const BACKUP_META_KEY = 'smart-scanner-scans-backup-meta';
export const PERSISTENCE_VERSION = 1;
const filters: ScanFilter[] = ['original', 'bw', 'grayscale', 'enhanced'];

export type MigrationSummary = { sourceVersion: number; targetVersion: number; recordsSeen: number; recordsKept: number; pagesRepaired: number; historyEntriesDropped: number };
let lastMigrationSummary: MigrationSummary = { sourceVersion: PERSISTENCE_VERSION, targetVersion: PERSISTENCE_VERSION, recordsSeen: 0, recordsKept: 0, pagesRepaired: 0, historyEntriesDropped: 0 };

export function getLastMigrationSummary(): MigrationSummary { return lastMigrationSummary; }
export type BackupInfo = { available: boolean; savedAt: number | null };


function normalizePage(value: unknown, index: number, now: number, onRepair: () => void): ScanPage | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Partial<ScanPage>;
  const originalUri = typeof raw.originalUri === 'string' ? raw.originalUri : raw.processedUri;
  const processedUri = typeof raw.processedUri === 'string' ? raw.processedUri : originalUri;
  if (!originalUri || !processedUri) return null;
  const repaired = typeof raw.id !== 'string' || !filters.includes(raw.filter as ScanFilter) || typeof raw.width !== 'number' || typeof raw.height !== 'number' || typeof raw.createdAt !== 'number';
  if (repaired) onRepair();
  return { id: typeof raw.id === 'string' ? raw.id : `page-${index + 1}`, originalUri, processedUri, filter: filters.includes(raw.filter as ScanFilter) ? (raw.filter as ScanFilter) : 'original', width: typeof raw.width === 'number' && raw.width > 0 ? raw.width : 1, height: typeof raw.height === 'number' && raw.height > 0 ? raw.height : 1, createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : now, ...(typeof raw.ocrText === 'string' ? { ocrText: raw.ocrText } : {}) };
}

export function normalizeScans(value: unknown, now = Date.now()): ScanRecord[] {
  const legacy = Array.isArray(value);
  const envelope = !legacy && value && typeof value === 'object' ? value as { version?: unknown; scans?: unknown } : null;
  const sourceVersion = legacy ? 0 : typeof envelope?.version === 'number' ? envelope.version : 0;
  const records = legacy ? value : envelope?.scans;
  const summary: MigrationSummary = { sourceVersion, targetVersion: PERSISTENCE_VERSION, recordsSeen: Array.isArray(records) ? records.length : 0, recordsKept: 0, pagesRepaired: 0, historyEntriesDropped: 0 };
  const normalized = Array.isArray(records) ? records.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const raw = item as Partial<ScanRecord>;
    if (typeof raw.id !== 'string') return [];
    const pages = Array.isArray(raw.pages) ? raw.pages.map((page, index) => normalizePage(page, index, now, () => { summary.pagesRepaired += 1; })).filter((page): page is ScanPage => Boolean(page)) : [];
    const historyBefore = Array.isArray(raw.editHistory) ? raw.editHistory.length : 0;
    const history = sanitizeEditHistory(raw.editHistory);
    summary.historyEntriesDropped += Math.max(0, historyBefore - (history?.length ?? 0));
    const createdAt = typeof raw.createdAt === 'number' ? raw.createdAt : now;
    summary.recordsKept += 1;
    return [{ id: raw.id, title: typeof raw.title === 'string' && raw.title.trim() ? raw.title : 'Untitled document', createdAt, updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : createdAt, thumbnailUri: typeof raw.thumbnailUri === 'string' ? raw.thumbnailUri : pages[0]?.processedUri ?? '', isSynced: Boolean(raw.isSynced), pages, ...(typeof raw.pdfUri === 'string' ? { pdfUri: raw.pdfUri } : {}), ...(typeof raw.favorite === 'boolean' ? { favorite: raw.favorite } : {}), ...(Array.isArray(raw.tags) ? { tags: raw.tags.filter((tag): tag is string => typeof tag === 'string') } : {}), ...(history?.length ? { editHistory: history } : {}) }];
  }) : [];
  lastMigrationSummary = summary;
  return normalized;
}

export function createScanPersistence(storage: StorageAdapter = asyncStorageAdapter) {
  return {
    load: async (): Promise<ScanRecord[]> => { const raw = await storage.get(KEY); if (!raw) return []; try { return normalizeScans(JSON.parse(raw)); } catch { return []; } },
    save: async (scans: ScanRecord[]) => { const previous = await storage.get(KEY); if (previous) { await storage.set(BACKUP_KEY, previous); await storage.set(BACKUP_META_KEY, JSON.stringify({ savedAt: Date.now() })); } await storage.set(KEY, JSON.stringify({ version: PERSISTENCE_VERSION, scans })); },
    restoreBackup: async (): Promise<ScanRecord[]> => { const raw = await storage.get(BACKUP_KEY); if (!raw) return []; try { return normalizeScans(JSON.parse(raw)); } catch { return []; } },
    getBackupInfo: async (): Promise<BackupInfo> => { const raw = await storage.get(BACKUP_META_KEY); if (!raw) return { available: Boolean(await storage.get(BACKUP_KEY)), savedAt: null }; try { const parsed = JSON.parse(raw) as { savedAt?: unknown }; return { available: Boolean(await storage.get(BACKUP_KEY)), savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : null }; } catch { return { available: Boolean(await storage.get(BACKUP_KEY)), savedAt: null }; } },
    deleteBackup: async () => { await storage.remove(BACKUP_KEY); await storage.remove(BACKUP_META_KEY); },
    clear: async () => { await storage.remove(KEY); await storage.remove(BACKUP_KEY); await storage.remove(BACKUP_META_KEY); },
  };
}
