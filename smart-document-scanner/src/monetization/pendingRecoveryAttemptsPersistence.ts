import type { StorageAdapter } from '../core/storage/StorageAdapter';

const KEY = 'smart-scanner-pending-recovery-attempts';

function normalizeAttempts(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export async function loadPendingRecoveryAttempts(storage: StorageAdapter): Promise<number> {
  try {
    const raw = await storage.get(KEY);
    if (!raw) return 0;
    return normalizeAttempts(JSON.parse(raw));
  } catch {
    return 0;
  }
}

export async function savePendingRecoveryAttempts(attempts: number, storage: StorageAdapter): Promise<void> {
  await storage.set(KEY, JSON.stringify(normalizeAttempts(attempts)));
}

export async function clearPendingRecoveryAttempts(storage: StorageAdapter): Promise<void> {
  try {
    await storage.remove(KEY);
  } catch {
    // Recovery cleanup is best-effort and must not block entitlement activation.
  }
}
