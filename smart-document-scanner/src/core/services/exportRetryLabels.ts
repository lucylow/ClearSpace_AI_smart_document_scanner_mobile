import { normalizeAppLanguage, type AppLanguage } from '../i18n/localePreference';

const EXPORT_RETRY_LABELS: Record<AppLanguage, string> = {
  en: 'Retry export',
  es: 'Reintentar exportación',
  fr: 'Réessayer l’exportation',
  pt: 'Tentar exportar novamente',
};

export function exportRetryLabel(locale: string): string {
  return EXPORT_RETRY_LABELS[normalizeAppLanguage(locale) ?? 'en'] ?? EXPORT_RETRY_LABELS.en;
}
