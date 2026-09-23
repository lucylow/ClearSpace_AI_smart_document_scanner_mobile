import type { StorageAdapter } from '../storage/StorageAdapter';

export const EXPO_COMPATIBILITY_TIMESTAMP_KEY = '@smart-document-scanner/expo-compatibility-checked-at';

export async function loadExpoCompatibilityCheckedAt(storage: StorageAdapter): Promise<number | null> {
  const raw = await storage.get(EXPO_COMPATIBILITY_TIMESTAMP_KEY);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function saveExpoCompatibilityCheckedAt(storage: StorageAdapter, timestamp: number): Promise<void> {
  if (!Number.isFinite(timestamp) || timestamp < 0) throw new Error('Invalid compatibility timestamp');
  await storage.set(EXPO_COMPATIBILITY_TIMESTAMP_KEY, String(Math.floor(timestamp)));
}
