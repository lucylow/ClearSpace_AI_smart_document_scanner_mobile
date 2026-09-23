import { beforeEach, describe, expect, it, vi } from 'vitest';

const { readDirectoryAsync } = vi.hoisted(() => ({ readDirectoryAsync: vi.fn() }));
vi.mock('expo-file-system/legacy', () => ({ documentDirectory: 'file:///documents/', readDirectoryAsync }));
vi.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

import { auditOrphanedGeneratedPdfs } from '../src/core/services/orphanedPdfAudit';

describe('orphaned generated PDF audit', () => {
  beforeEach(() => readDirectoryAsync.mockReset().mockResolvedValue([
    'scan_100.pdf', 'batch_200.pdf', 'user-document.pdf', 'scan_invalid.pdf', 'notes.txt',
  ]));

  it('filters generated names and excludes known document-owned PDFs', async () => {
    await expect(auditOrphanedGeneratedPdfs(['file:///documents/scan_100.pdf'])).resolves.toEqual({
      supported: true,
      scanned: 2,
      orphanedUris: ['file:///documents/batch_200.pdf'],
      truncated: false,
      error: false,
    });
  });

  it('bounds the scan and reports truncation', async () => {
    readDirectoryAsync.mockResolvedValue(Array.from({ length: 4 }, (_, index) => `scan_${index}.pdf`));
    await expect(auditOrphanedGeneratedPdfs([], 2)).resolves.toMatchObject({ scanned: 2, truncated: true });
  });

  it('fails closed when the directory response is malformed', async () => {
    readDirectoryAsync.mockResolvedValue(null as never);
    const result = await auditOrphanedGeneratedPdfs();
    expect(result).toEqual({ supported: true, scanned: 0, orphanedUris: [], truncated: false, error: true });
  });
});
