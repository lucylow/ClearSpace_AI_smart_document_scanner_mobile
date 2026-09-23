import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const GENERATED_PDF_NAME = /^(?:scan|batch)_\d+.*\.pdf$/i;
const DEFAULT_MAX_CANDIDATES = 50;

export type OrphanedPdfAuditResult = {
  supported: boolean;
  scanned: number;
  orphanedUris: string[];
  truncated: boolean;
  error: boolean;
};

export async function auditOrphanedGeneratedPdfs(
  knownUris: readonly string[] = [],
  maxCandidates = DEFAULT_MAX_CANDIDATES,
): Promise<OrphanedPdfAuditResult> {
  if (Platform.OS === 'web' || !FileSystem.documentDirectory) {
    return { supported: false, scanned: 0, orphanedUris: [], truncated: false, error: false };
  }

  const safeMax = Number.isFinite(maxCandidates) ? Math.max(1, Math.floor(maxCandidates)) : DEFAULT_MAX_CANDIDATES;
  const known = new Set(knownUris.filter((uri) => typeof uri === 'string'));
  try {
    const names = await Promise.resolve(FileSystem.readDirectoryAsync(FileSystem.documentDirectory));
    const candidates = names.filter((name) => GENERATED_PDF_NAME.test(name));
    const selected = candidates.slice(0, safeMax);
    return {
      supported: true,
      scanned: selected.length,
      orphanedUris: selected.map((name) => `${FileSystem.documentDirectory}${name}`).filter((uri) => !known.has(uri)),
      truncated: candidates.length > safeMax,
      error: false,
    };
  } catch {
    return { supported: true, scanned: 0, orphanedUris: [], truncated: false, error: true };
  }
}
