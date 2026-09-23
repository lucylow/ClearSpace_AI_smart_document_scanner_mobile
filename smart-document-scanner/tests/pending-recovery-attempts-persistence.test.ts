import { describe, expect, it } from 'vitest';
import { clearPendingRecoveryAttempts, loadPendingRecoveryAttempts, savePendingRecoveryAttempts } from '../src/monetization/pendingRecoveryAttemptsPersistence';
import { createMemoryStorage } from '../src/core/storage/StorageAdapter';

describe('pending recovery attempts persistence', () => {
  it('persists normalized retry counts across loads', async () => {
    const storage = createMemoryStorage();
    await savePendingRecoveryAttempts(2.9, storage);
    expect(await loadPendingRecoveryAttempts(storage)).toBe(2);
  });

  it('fails closed on missing and malformed values', async () => {
    const storage = createMemoryStorage();
    expect(await loadPendingRecoveryAttempts(storage)).toBe(0);
    await storage.set('smart-scanner-pending-recovery-attempts', '{bad');
    expect(await loadPendingRecoveryAttempts(storage)).toBe(0);
    await storage.set('smart-scanner-pending-recovery-attempts', JSON.stringify(-4));
    expect(await loadPendingRecoveryAttempts(storage)).toBe(0);
  });

  it('clears the counter after successful reconciliation', async () => {
    const storage = createMemoryStorage();
    await savePendingRecoveryAttempts(3, storage);
    await clearPendingRecoveryAttempts(storage);
    expect(await loadPendingRecoveryAttempts(storage)).toBe(0);
  });
});
