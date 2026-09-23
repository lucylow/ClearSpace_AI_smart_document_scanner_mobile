import { describe, expect, it } from 'vitest';
import { exportRetryAccessibilityCopy } from '../src/core/services/exportRetryAccessibility';

describe('export retry accessibility copy', () => {
  it('localizes retry lifecycle announcements', () => {
    expect(exportRetryAccessibilityCopy('en-US').started).toContain('started');
    expect(exportRetryAccessibilityCopy('es-MX').succeeded).toContain('terminó');
    expect(exportRetryAccessibilityCopy('fr-FR').failed).toContain('échoué');
    expect(exportRetryAccessibilityCopy('pt-BR').started).toContain('começou');
  });

  it('falls back to English for unsupported locales', () => {
    expect(exportRetryAccessibilityCopy('de-DE').failed).toContain('failed');
  });
});
