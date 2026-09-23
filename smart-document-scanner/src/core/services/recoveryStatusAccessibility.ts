import { formatRecoveryAge, type RecoveryAgeDisplay } from './recoveryAgePreference';

export function getRecoveryStatusAccessibility(
  locale: string,
  savedAt: number | null,
  now: number,
  display: RecoveryAgeDisplay = 'relative',
): { savedLabel: string } {
  return { savedLabel: formatRecoveryAge(savedAt, now, locale, display) };
}
