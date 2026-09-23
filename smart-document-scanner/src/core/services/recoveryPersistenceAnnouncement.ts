import { settingsDiagnosticCopy } from '../i18n/localePreference';

export type RecoveryPersistenceOutcome =
  | { status: 'saved' }
  | { status: 'failed'; detail: string };

export function recoveryPersistenceAnnouncement(
  locale: string,
  outcome: RecoveryPersistenceOutcome,
): string {
  const copy = settingsDiagnosticCopy(locale);
  return outcome.status === 'saved'
    ? copy.saveSucceeded
    : copy.savePreferenceFailed(outcome.detail);
}
