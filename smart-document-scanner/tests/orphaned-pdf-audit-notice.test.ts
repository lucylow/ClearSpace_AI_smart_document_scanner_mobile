import { describe, expect, it } from 'vitest';
import { orphanedPdfAuditNotice } from '../src/core/services/orphanedPdfAuditNotice';
import type { OrphanedPdfAuditResult } from '../src/core/services/orphanedPdfAudit';

const base: OrphanedPdfAuditResult = { supported: true, scanned: 2, orphanedUris: [], truncated: false, error: false };

describe('orphaned PDF audit notices', () => {
  it('formats localized clean and found results', () => {
    expect(orphanedPdfAuditNotice(base, 'en-US')).toContain('found no orphaned');
    expect(orphanedPdfAuditNotice({ ...base, orphanedUris: ['file:///documents/scan_1.pdf'] }, 'es-MX')).toContain('huérfano');
    expect(orphanedPdfAuditNotice({ ...base, orphanedUris: ['file:///documents/scan_1.pdf'], truncated: true }, 'fr-FR')).toContain('sécurité');
  });

  it('uses safe localized fallback states', () => {
    expect(orphanedPdfAuditNotice({ ...base, supported: false }, 'pt-BR')).toContain('dispositivos nativos');
    expect(orphanedPdfAuditNotice({ ...base, error: true }, 'de-DE')).toContain('could not read');
  });
});
