import type { StorageAdapter } from './StorageAdapter';

export const RECOVERY_HISTORY_KEY = 'scanner.recovery.history.v1';
export const RECOVERY_HISTORY_LIMIT = 5;

export type RecoveryHistoryKind = 'completed' | 'cancelled' | 'failed';

export type RecoveryHistoryEntry = {
  message: string;
  at: number;
  count: number;
  kind: RecoveryHistoryKind;
};

const KINDS: RecoveryHistoryKind[] = ['completed', 'cancelled', 'failed'];

function isRecoveryHistoryEntry(value: unknown): value is RecoveryHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<RecoveryHistoryEntry>;
  return typeof entry.message === 'string'
    && entry.message.length > 0
    && typeof entry.at === 'number'
    && Number.isFinite(entry.at)
    && entry.at >= 0
    && typeof entry.count === 'number'
    && Number.isFinite(entry.count)
    && entry.count >= 0
    && Number.isInteger(entry.count)
    && typeof entry.kind === 'string'
    && KINDS.includes(entry.kind as RecoveryHistoryKind);
}

export function normalizeRecoveryHistoryEntries(entries: RecoveryHistoryEntry[], limit = RECOVERY_HISTORY_LIMIT): RecoveryHistoryEntry[] {
  return entries
    .filter(isRecoveryHistoryEntry)
    .map(entry => ({ ...entry, message: entry.message.trim() }))
    .filter(entry => entry.message.length > 0)
    .sort((a, b) => b.at - a.at)
    .slice(0, Math.max(0, limit));
}

export type RecoveryHistoryHydrationSummary = { entries: RecoveryHistoryEntry[]; discardedCount: number };

export function summarizeRecoveryHistory(raw: string | null, limit = RECOVERY_HISTORY_LIMIT): RecoveryHistoryHydrationSummary {
  if (!raw) return { entries: [], discardedCount: 0 };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { entries: [], discardedCount: 1 };
    const valid = parsed.filter(isRecoveryHistoryEntry);
    const entries = normalizeRecoveryHistoryEntries(valid, limit);
    return { entries, discardedCount: Math.max(0, parsed.length - entries.length) };
  } catch {
    return { entries: [], discardedCount: 1 };
  }
}

export function sanitizeRecoveryHistory(raw: string | null, limit = RECOVERY_HISTORY_LIMIT): RecoveryHistoryEntry[] {
  return summarizeRecoveryHistory(raw, limit).entries;
}

export async function loadRecoveryHistoryWithSummary(storage: StorageAdapter, key = RECOVERY_HISTORY_KEY): Promise<RecoveryHistoryHydrationSummary> {
  try {
    return summarizeRecoveryHistory(await storage.get(key));
  } catch {
    return { entries: [], discardedCount: 0 };
  }
}

export async function loadRecoveryHistory(storage: StorageAdapter, key = RECOVERY_HISTORY_KEY): Promise<RecoveryHistoryEntry[]> {
  return (await loadRecoveryHistoryWithSummary(storage, key)).entries;
}

export async function saveRecoveryHistory(
  storage: StorageAdapter,
  entries: RecoveryHistoryEntry[],
  key = RECOVERY_HISTORY_KEY,
): Promise<boolean> {
  try {
    await saveRecoveryHistoryOrThrow(storage, entries, key);
    return true;
  } catch {
    return false;
  }
}

export async function saveRecoveryHistoryOrThrow(
  storage: StorageAdapter,
  entries: RecoveryHistoryEntry[],
  key = RECOVERY_HISTORY_KEY,
): Promise<void> {
  await storage.set(key, JSON.stringify(normalizeRecoveryHistoryEntries(entries)));
}
