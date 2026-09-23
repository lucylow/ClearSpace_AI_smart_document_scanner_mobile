import { describe, expect, it } from 'vitest';
import { createMemoryStorage, type StorageAdapter } from '../src/core/storage/StorageAdapter';
import { loadExpoCompatibilityCheckedAt, saveExpoCompatibilityCheckedAt } from '../src/core/services/expoCompatibilityTimestampPersistence';

describe('Expo compatibility timestamp persistence', () => {
  it('round trips a sanitized timestamp', async () => {
    const storage = createMemoryStorage();
    await saveExpoCompatibilityCheckedAt(storage, 1_777_000_123.9);
    expect(await loadExpoCompatibilityCheckedAt(storage)).toBe(1_777_000_123);
  });

  it('ignores malformed stored values and rejects invalid writes', async () => {
    const storage = createMemoryStorage({ '@smart-document-scanner/expo-compatibility-checked-at': 'not-a-time' });
    expect(await loadExpoCompatibilityCheckedAt(storage)).toBeNull();
    await expect(saveExpoCompatibilityCheckedAt(storage, -1)).rejects.toThrow('Invalid compatibility timestamp');
    await expect(saveExpoCompatibilityCheckedAt(storage, Number.NaN)).rejects.toThrow('Invalid compatibility timestamp');
  });

  it('propagates storage failures without losing the previous value', async () => {
    const failingStorage: StorageAdapter = {
      get: async () => null,
      set: async () => { throw new Error('storage unavailable'); },
      remove: async () => undefined,
    };
    await expect(saveExpoCompatibilityCheckedAt(failingStorage, 123)).rejects.toThrow('storage unavailable');
  });
});
