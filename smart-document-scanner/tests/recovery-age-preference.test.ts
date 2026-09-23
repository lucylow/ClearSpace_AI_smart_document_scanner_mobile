import { describe, expect, it } from 'vitest';
import { createMemoryStorage } from '../src/core/storage/StorageAdapter';
import { formatRecoveryAge, loadRecoveryAgeDisplay, RECOVERY_AGE_REFRESH_INTERVAL_MS, saveRecoveryAgeDisplay, shouldRefreshRecoveryAge } from '../src/core/services/recoveryAgePreference';

describe('recovery age preference', () => {
  const now = Date.UTC(2026, 0, 15, 13, 30);

  it('formats relative ages with localized recent-save and plural-aware copy', () => {
    expect(formatRecoveryAge(now - 10_000, now, 'en-US', 'relative')).toBe('Updated just now');
    expect(formatRecoveryAge(now - 5 * 60_000, now, 'en-US', 'relative')).toBe('5 minutes ago');
    expect(formatRecoveryAge(now - 10_000, now, 'es-MX', 'relative')).toBe('Actualizado hace un momento');
    expect(formatRecoveryAge(now - 60 * 60_000, now, 'fr-CA', 'relative')).toBe('Il y a 1 heure');
    expect(formatRecoveryAge(now - 2 * 24 * 60 * 60_000, now, 'pt-BR', 'relative')).toBe('Há 2 dias');
  });

  it('refreshes only relative ages with a bounded interval', () => {
    expect(RECOVERY_AGE_REFRESH_INTERVAL_MS).toBe(60_000);
    expect(shouldRefreshRecoveryAge('relative', now - 1_000)).toBe(true);
    expect(shouldRefreshRecoveryAge('relative', now - 1_000, false)).toBe(false);
    expect(shouldRefreshRecoveryAge('absolute', now - 1_000)).toBe(false);
    expect(shouldRefreshRecoveryAge('relative', null)).toBe(false);
  });

  it('keeps absolute formatting available and handles missing recovery data', () => {
    expect(formatRecoveryAge(now - 5 * 60_000, now, 'en-US', 'absolute')).toContain('Last saved:');
    expect(formatRecoveryAge(null, now, 'es-MX', 'relative')).toBe('Todavía no hay una copia de recuperación disponible.');
  });

  it('defaults safely and persists the selected display mode', async () => {
    const storage = createMemoryStorage();
    expect(await loadRecoveryAgeDisplay(storage)).toBe('relative');
    await saveRecoveryAgeDisplay('absolute', storage);
    expect(await loadRecoveryAgeDisplay(storage)).toBe('absolute');
  });
});
