import { isBackupStale } from './recoveryStatus';
import { recoveryBackupAgeLabel, recoveryStatusCopy } from '../i18n/localePreference';

export type RecoveryStatusPresentation = {
  cardLabel: string;
  title: string;
  savedLabel: string;
  staleWarning: string | null;
  restoreLabel: string;
  deleteLabel: string;
  refreshLabel: string;
};

export function getRecoveryStatusPresentation(
  locale: string,
  available: boolean,
  savedAt: number | null,
  now: number,
): RecoveryStatusPresentation {
  const copy = recoveryStatusCopy(locale);
  return {
    cardLabel: copy.label,
    title: copy.title,
    savedLabel: recoveryBackupAgeLabel(savedAt, now, locale),
    staleWarning: available && isBackupStale(savedAt, now) ? copy.stale : null,
    restoreLabel: copy.restore,
    deleteLabel: copy.delete,
    refreshLabel: copy.refresh,
  };
}
