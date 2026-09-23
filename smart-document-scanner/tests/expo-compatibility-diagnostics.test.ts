import { describe, expect, it } from 'vitest';
import { expoCompatibilityCheckedAgeLabel, expoCompatibilityCheckedAtLabel, expoCompatibilityDiagnostic, expoCompatibilityRefreshLabel, expoCompatibilityRetryLabel, expoCompatibilityTimestampFailureNotice } from '../src/core/services/expoCompatibilityDiagnostics';

describe('Expo compatibility diagnostics', () => {
  it('formats localized up-to-date status', () => {
    expect(expoCompatibilityDiagnostic('up-to-date', 'en-US')).toBe('Expo compatibility: up to date');
    expect(expoCompatibilityDiagnostic('outdated', 'es-MX')).toBe('Compatibilidad de Expo: requiere revisión');
    expect(expoCompatibilityDiagnostic('unknown', 'fr-FR')).toBe('Compatibilité Expo : non vérifiée');
    expect(expoCompatibilityDiagnostic('up-to-date', 'pt-BR')).toBe('Compatibilidade do Expo: atualizada');
  });

  it('formats localized last-checked ages and safe fallbacks', () => {
    const now = Date.UTC(2026, 0, 2, 3, 4);
    expect(expoCompatibilityCheckedAgeLabel(now - 30_000, now, 'en-US')).toBe('Last checked just now');
    expect(expoCompatibilityCheckedAgeLabel(now - 5 * 60_000, now, 'es-MX')).toBe('Última comprobación 5 minutes ago');
    expect(expoCompatibilityCheckedAgeLabel(now - 2 * 3_600_000, now, 'fr-FR')).toBe('Dernière vérification 2 hours ago');
    expect(expoCompatibilityCheckedAgeLabel(now - 2 * 86_400_000, now, 'pt-BR')).toBe('Última verificação 2 days ago');
    expect(expoCompatibilityCheckedAgeLabel(Number.NaN, now, 'xx-XX')).toBe('Last checked time unavailable');
  });

  it('formats localized refresh states', () => {
    expect(expoCompatibilityRefreshLabel('idle', 'en-US')).toBe('Refresh compatibility status');
    expect(expoCompatibilityRefreshLabel('refreshing', 'es-MX')).toBe('Comprobando compatibilidad…');
    expect(expoCompatibilityRefreshLabel('success', 'fr-FR')).toBe('État de compatibilité actualisé');
    expect(expoCompatibilityRefreshLabel('failure', 'pt-BR')).toBe('Compatibilidade indisponível');
  });

  it('formats localized retry labels and sanitized persistence failure feedback', () => {
    expect(expoCompatibilityRetryLabel('en-US')).toBe('Retry saving compatibility status');
    expect(expoCompatibilityRetryLabel('es-MX')).toBe('Reintentar guardar el estado de compatibilidad');
    expect(expoCompatibilityTimestampFailureNotice('fr-FR')).toBe('Compatibilité indisponible');
    expect(expoCompatibilityRetryLabel('xx-XX')).toBe('Retry saving compatibility status');
  });

  it('formats a localized checked-at timestamp', () => {
    expect(expoCompatibilityCheckedAtLabel(Date.UTC(2026, 0, 2, 3, 4), 'en-US')).toContain('Checked');
    expect(expoCompatibilityCheckedAtLabel(Date.UTC(2026, 0, 2, 3, 4), 'fr-FR')).toContain('Vérifiée');
  });

  it('uses a safe localized fallback for invalid checked-at times', () => {
    expect(expoCompatibilityCheckedAtLabel(Number.NaN, 'pt-BR')).toBe('Verificada time unavailable');
    expect(expoCompatibilityCheckedAtLabel(-1, 'xx-XX')).toBe('Checked time unavailable');
  });

  it('falls back to English without exposing raw checker output', () => {
    const diagnostic = expoCompatibilityDiagnostic('outdated', 'xx-XX');
    expect(diagnostic).toBe('Expo compatibility: review required');
    expect(diagnostic).not.toContain('Found outdated dependencies');
  });
});
