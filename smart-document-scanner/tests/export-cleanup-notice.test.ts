import { describe, expect, it } from 'vitest';
import { exportCleanupFailureGuidance } from '../src/core/services/exportCleanupNotice';

describe('export cleanup failure guidance', () => {
  it('localizes retry guidance across supported languages', () => {
    expect(exportCleanupFailureGuidance('en-US')).toContain('temporary PDF');
    expect(exportCleanupFailureGuidance('es-MX')).toContain('PDF temporal');
    expect(exportCleanupFailureGuidance('fr-FR')).toContain('PDF temporaire');
    expect(exportCleanupFailureGuidance('pt-BR')).toContain('PDF temporário');
  });

  it('falls back safely for unsupported locales', () => {
    expect(exportCleanupFailureGuidance('de-DE')).toContain('temporary PDF');
  });
});
