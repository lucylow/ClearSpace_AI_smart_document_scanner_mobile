import { describe, expect, it } from 'vitest';
import { orphanedPdfAuditActionLabel } from '../src/core/services/orphanedPdfAuditActionLabel';

describe('orphaned PDF audit action label', () => {
  it('localizes the Settings action', () => {
    expect(orphanedPdfAuditActionLabel('en-US')).toBe('Audit temporary PDFs');
    expect(orphanedPdfAuditActionLabel('es-MX')).toContain('Auditar');
    expect(orphanedPdfAuditActionLabel('fr-FR')).toContain('Auditer');
    expect(orphanedPdfAuditActionLabel('pt-BR')).toContain('Auditar');
  });

  it('falls back to English safely', () => {
    expect(orphanedPdfAuditActionLabel('de-DE')).toBe('Audit temporary PDFs');
  });
});
