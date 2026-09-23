import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export async function cleanupGeneratedExport(uri: string | null | undefined): Promise<boolean> {
  if (!uri || Platform.OS === 'web' || !uri.startsWith('file://')) return false;
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    return true;
  } catch {
    return false;
  }
}
