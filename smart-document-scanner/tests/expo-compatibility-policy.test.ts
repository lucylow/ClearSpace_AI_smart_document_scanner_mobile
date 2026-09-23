import { describe, expect, it } from 'vitest';
import { compatibilityCheckFailure, compatibilityCheckResult, compatibilityCheckSummary } from '../scripts/expo-compatibility-policy.mjs';

describe('Expo compatibility policy', () => {
  it('passes clean output with a zero exit status', () => {
    expect(compatibilityCheckFailure(0, 'Dependencies are up to date')).toBe(false);
    expect(compatibilityCheckSummary(0, 'Dependencies are up to date')).toContain('passed');
  });

  it('returns a concise machine-readable pass result', () => {
    expect(compatibilityCheckResult(0, 'Dependencies are up to date')).toEqual({
      ok: true,
      status: 0,
      reason: 'up-to-date',
      summary: 'Expo compatibility check passed without modifying dependencies.',
    });
  });

  it('returns a concise machine-readable failure result', () => {
    expect(compatibilityCheckResult(1, 'Found outdated dependencies')).toMatchObject({
      ok: false,
      status: 1,
      reason: 'outdated-or-incompatible-dependencies',
    });
  });

  it('fails when Expo reports outdated dependencies', () => {
    const output = 'Found outdated dependencies';
    expect(compatibilityCheckFailure(1, output)).toBe(true);
    expect(compatibilityCheckSummary(1, output)).toContain('failed');
  });

  it('fails when the project may not work correctly even if the process status is zero', () => {
    const output = 'Your project may not work correctly until you install the expected versions of the packages.';
    expect(compatibilityCheckFailure(0, output)).toBe(true);
  });
});
