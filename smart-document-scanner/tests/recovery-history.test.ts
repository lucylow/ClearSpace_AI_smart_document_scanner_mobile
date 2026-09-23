import { describe, expect, it } from 'vitest';
import { createMemoryStorage, type StorageAdapter } from '../src/core/storage/StorageAdapter';
import {
  RECOVERY_HISTORY_KEY,
  loadRecoveryHistory,
  summarizeRecoveryHistory,
  sanitizeRecoveryHistory,
  saveRecoveryHistory,
  saveRecoveryHistoryOrThrow,
  type RecoveryHistoryEntry,
} from '../src/core/storage/recoveryHistory';

const validEntry = (overrides: Partial<RecoveryHistoryEntry> = {}): RecoveryHistoryEntry => ({
  message: '2 documents restored.',
  at: 1_700_000_000_000,
  count: 2,
  kind: 'completed',
  ...overrides,
});

describe('recovery-history persistence', () => {
  it('discards malformed records while preserving valid records and schema bounds', () => {
    const raw = JSON.stringify([
      validEntry(),
      { ...validEntry(), message: '' },
      { ...validEntry(), at: Number.NaN },
      { ...validEntry(), at: -1 },
      { ...validEntry(), count: 1.5 },
      { ...validEntry(), count: -1 },
      { ...validEntry(), kind: 'unknown' },
      null,
      'not an entry',
    ]);

    expect(sanitizeRecoveryHistory(raw)).toEqual([validEntry()]);
    expect(sanitizeRecoveryHistory('{broken json')).toEqual([]);
    expect(sanitizeRecoveryHistory(JSON.stringify({ entries: [validEntry()] }))).toEqual([]);
  });

  it('reports discarded malformed records without exposing their content', () => {
    const summary = summarizeRecoveryHistory(JSON.stringify([validEntry({ at: 300 }), { message: 'secret title', at: -1, count: 1, kind: 'failed' }]));
    expect(summary.entries).toHaveLength(1);
    expect(summary.discardedCount).toBe(1);
    expect(JSON.stringify(summary)).not.toContain('secret title');
  });

  it('trims messages and orders hydrated records by newest timestamp', () => {
    const raw = JSON.stringify([
      validEntry({ at: 100, message: '  older  ' }),
      validEntry({ at: 300, message: ' newest ' }),
      validEntry({ at: 200, message: ' middle ' }),
    ]);

    expect(sanitizeRecoveryHistory(raw)).toEqual([
      validEntry({ at: 300, message: 'newest' }),
      validEntry({ at: 200, message: 'middle' }),
      validEntry({ at: 100, message: 'older' }),
    ]);
  });

  it('retains only the five newest records and safely handles missing storage', async () => {
    const entries = Array.from({ length: 7 }, (_, index) => validEntry({ at: index, count: index, message: `Entry ${index}` }));
    const storage = createMemoryStorage({ [RECOVERY_HISTORY_KEY]: JSON.stringify(entries) });

    expect(await loadRecoveryHistory(storage)).toEqual(entries.slice().reverse().slice(0, 5));
    expect(await loadRecoveryHistory(createMemoryStorage())).toEqual([]);
  });

  it('does not throw when the storage read fails', async () => {
    const storage: StorageAdapter = {
      get: async () => { throw new Error('read failed'); },
      set: async () => undefined,
      remove: async () => undefined,
    };

    await expect(loadRecoveryHistory(storage)).resolves.toEqual([]);
  });

  it('reports storage-write failure without changing the caller-owned recovery entries', async () => {
    const entries = [validEntry()];
    const storage: StorageAdapter = {
      get: async () => null,
      set: async () => { throw new Error('write failed'); },
      remove: async () => undefined,
    };

    await expect(saveRecoveryHistory(storage, entries)).resolves.toBe(false);
    expect(entries).toEqual([validEntry()]);
  });

  it('propagates write failures through the retry-oriented save helper without mutating entries', async () => {
    const entries = [validEntry({ message: 'Retry me.' })];
    const storage: StorageAdapter = {
      get: async () => null,
      set: async () => { throw new Error('write failed twice'); },
      remove: async () => undefined,
    };

    await expect(saveRecoveryHistoryOrThrow(storage, entries)).rejects.toThrow('write failed twice');
    await expect(saveRecoveryHistoryOrThrow(storage, entries)).rejects.toThrow('write failed twice');
    expect(entries).toEqual([validEntry({ message: 'Retry me.' })]);
  });

  it('persists valid entries through the throwing helper in the bounded wire format', async () => {
    const storage = createMemoryStorage();
    const entries = Array.from({ length: 6 }, (_, index) => validEntry({ at: index }));

    await expect(saveRecoveryHistoryOrThrow(storage, entries)).resolves.toBeUndefined();
    await expect(loadRecoveryHistory(storage)).resolves.toEqual(entries.slice().reverse().slice(0, 5));
  });

  it('persists valid entries in the bounded wire format', async () => {
    const storage = createMemoryStorage();
    const entries = Array.from({ length: 6 }, (_, index) => validEntry({ at: index }));

    await expect(saveRecoveryHistory(storage, entries)).resolves.toBe(true);
    await expect(loadRecoveryHistory(storage)).resolves.toEqual(entries.slice().reverse().slice(0, 5));
  });
});
