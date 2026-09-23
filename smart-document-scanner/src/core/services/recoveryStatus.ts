export const BACKUP_STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export function formatBackupAge(savedAt: number | null, now = Date.now()): string {
  if (!savedAt) return 'No local backup yet';
  const age = Math.max(0, now - savedAt);
  if (age < 60 * 60 * 1000) return 'Saved less than an hour ago';
  const days = Math.floor(age / (24 * 60 * 60 * 1000));
  if (days > 0) return `Saved ${days} day${days === 1 ? '' : 's'} ago`;
  const hours = Math.floor(age / (60 * 60 * 1000));
  return `Saved ${hours} hour${hours === 1 ? '' : 's'} ago`;
}

export function isBackupStale(savedAt: number | null, now = Date.now()): boolean {
  return savedAt !== null && now - savedAt >= BACKUP_STALE_AFTER_MS;
}
