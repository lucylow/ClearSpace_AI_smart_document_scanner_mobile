import type { StorageAdapter } from '../storage/StorageAdapter';
import type { RecoveryHistoryHydrationSummary } from '../storage/recoveryHistory';

export const RECOVERY_REPAIR_NOTICE_MARKER_KEY = 'scanner.recovery.repair-notice.v1';

export function recoveryRepairSignature(summary: RecoveryHistoryHydrationSummary): string {
  const entries = summary.entries.map(entry => `${entry.at}:${entry.count}:${entry.kind}`).join('|');
  return `${Math.max(0, Math.floor(summary.discardedCount))}:${entries}`;
}

export async function loadRecoveryRepairMarker(storage: StorageAdapter, key = RECOVERY_REPAIR_NOTICE_MARKER_KEY): Promise<string | null> {
  try {
    return await storage.get(key);
  } catch {
    return null;
  }
}

export async function saveRecoveryRepairMarker(storage: StorageAdapter, signature: string, key = RECOVERY_REPAIR_NOTICE_MARKER_KEY): Promise<boolean> {
  try {
    await storage.set(key, signature);
    return true;
  } catch {
    return false;
  }
}

export function shouldShowRecoveryRepairNotice(summary: RecoveryHistoryHydrationSummary, acknowledgedSignature: string | null): boolean {
  return summary.discardedCount > 0 && recoveryRepairSignature(summary) !== acknowledgedSignature;
}
