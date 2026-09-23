import { describe, expect, it } from 'vitest';
import { getRecoveryStatusAccessibility } from '../src/core/services/recoveryStatusAccessibility';

describe('RecoveryStatus accessibility output', () => {
  const now = Date.UTC(2026, 0, 15, 13, 30);

  it('announces localized just-now status for recent saves', () => {
    expect(getRecoveryStatusAccessibility('en-US', now - 10_000, now).savedLabel).toBe('Updated just now');
    expect(getRecoveryStatusAccessibility('pt-BR', now - 10_000, now).savedLabel).toBe('Atualizado agora');
  });

  it('switches from just-now to minute age at the threshold', () => {
    expect(getRecoveryStatusAccessibility('en-US', now - 59_999, now).savedLabel).toBe('Updated just now');
    expect(getRecoveryStatusAccessibility('en-US', now - 60_000, now).savedLabel).toBe('1 minute ago');
  });

  it('handles missing saves, clock skew, and invalid clock values safely', () => {
    expect(getRecoveryStatusAccessibility('en-US', null, now).savedLabel).toBe('No recovery copy is available yet.');
    expect(getRecoveryStatusAccessibility('en-US', now + 5_000, now).savedLabel).toBe('Updated just now');
    expect(getRecoveryStatusAccessibility('en-US', now - 10_000, Number.NaN).savedLabel).toBe('Updated just now');
  });

  it('falls back safely for unsupported locales', () => {
    expect(getRecoveryStatusAccessibility('xx-XX', now - 10_000, now).savedLabel).toBe('Updated just now');
    expect(getRecoveryStatusAccessibility('xx-XX', now - 10_000, now, 'absolute').savedLabel).toContain('Last saved:');
  });

  it('keeps absolute accessibility output separate from relative copy', () => {
    expect(getRecoveryStatusAccessibility('fr-FR', now - 10_000, now, 'absolute').savedLabel).toContain('Dernier enregistrement:');
  });
});
