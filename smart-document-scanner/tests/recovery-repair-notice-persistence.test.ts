import { describe, expect, it } from 'vitest';
import { createMemoryStorage, type StorageAdapter } from '../src/core/storage/StorageAdapter';
import { loadRecoveryRepairMarker, recoveryRepairSignature, saveRecoveryRepairMarker, shouldShowRecoveryRepairNotice } from '../src/core/services/recoveryRepairNoticePersistence';
import type { RecoveryHistoryHydrationSummary } from '../src/core/storage/recoveryHistory';

const summary: RecoveryHistoryHydrationSummary = {
  entries: [{ message: 'safe', at: 100, count: 1, kind: 'completed' }],
  discardedCount: 2,
};

describe('recovery repair notice persistence', () => {
  it('creates a stable signature without message content', () => {
    const signature = recoveryRepairSignature(summary);
    expect(signature).toBe('2:100:1:completed');
    expect(signature).not.toContain('safe');
  });

  it('round trips an acknowledgement marker and suppresses the same notice', async () => {
    const storage = createMemoryStorage();
    const signature = recoveryRepairSignature(summary);
    expect(shouldShowRecoveryRepairNotice(summary, null)).toBe(true);
    await expect(saveRecoveryRepairMarker(storage, signature)).resolves.toBe(true);
    await expect(loadRecoveryRepairMarker(storage)).resolves.toBe(signature);
    expect(shouldShowRecoveryRepairNotice(summary, signature)).toBe(false);
  });

  it('does not claim acknowledgement when marker persistence fails', async () => {
    const storage: StorageAdapter = { get: async () => null, set: async () => { throw new Error('write failed'); }, remove: async () => undefined };
    await expect(saveRecoveryRepairMarker(storage, 'signature')).resolves.toBe(false);
    expect(shouldShowRecoveryRepairNotice(summary, null)).toBe(true);
  });
});
