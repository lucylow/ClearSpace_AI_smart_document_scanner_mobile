import { describe, expect, it, vi } from 'vitest';

const { deleteAsync } = vi.hoisted(() => ({ deleteAsync: vi.fn() }));

vi.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
vi.mock('expo-file-system/legacy', () => ({ deleteAsync }));

import { cleanupGeneratedExport } from '../src/core/services/exportArtifactCleanup';

describe('generated export cleanup', () => {
  it('deletes native file exports idempotently', async () => {
    deleteAsync.mockResolvedValue(undefined);
    await expect(cleanupGeneratedExport('file:///documents/scan.pdf')).resolves.toBe(true);
    expect(deleteAsync).toHaveBeenCalledWith('file:///documents/scan.pdf', { idempotent: true });
  });

  it('does not attempt to delete web, non-file, or empty values', async () => {
    deleteAsync.mockReset();
    await expect(cleanupGeneratedExport('demo://scan.pdf')).resolves.toBe(false);
    await expect(cleanupGeneratedExport(null)).resolves.toBe(false);
    expect(deleteAsync).not.toHaveBeenCalled();
  });

  it('contains filesystem deletion failures', async () => {
    deleteAsync.mockRejectedValue(new Error('already removed'));
    await expect(cleanupGeneratedExport('file:///documents/scan.pdf')).resolves.toBe(false);
  });
});
