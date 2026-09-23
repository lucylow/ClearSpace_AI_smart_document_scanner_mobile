import { normalizeAppLanguage } from '../i18n/localePreference';

const LABELS = {
  en: 'Compatibility check is now more than one minute old.',
  es: 'La comprobación de compatibilidad tiene ahora más de un minuto.',
  fr: 'La vérification de compatibilité date maintenant de plus d’une minute.',
  pt: 'A verificação de compatibilidade tem agora mais de um minuto.',
} as const;

export function expoCompatibilityAgeThresholdAnnouncement(previousTimestamp: number, nextTimestamp: number, checkedAt: number, locale: string): string | null {
  if (![previousTimestamp, nextTimestamp, checkedAt].every(value => Number.isFinite(value) && value >= 0)) return null;
  const previousAge = Math.max(0, previousTimestamp - checkedAt);
  const nextAge = Math.max(0, nextTimestamp - checkedAt);
  if (previousAge < 60_000 && nextAge >= 60_000) {
    const language = normalizeAppLanguage(locale) ?? 'en';
    return LABELS[language] ?? LABELS.en;
  }
  return null;
}
