import { normalizeAppLanguage, type AppLanguage } from '../i18n/localePreference';

const LABELS: Record<AppLanguage, string> = {
  en: 'Audit temporary PDFs',
  es: 'Auditar PDF temporales',
  fr: 'Auditer les PDF temporaires',
  pt: 'Auditar PDFs temporários',
};

export function orphanedPdfAuditActionLabel(locale: string): string {
  return LABELS[normalizeAppLanguage(locale) ?? 'en'] ?? LABELS.en;
}
