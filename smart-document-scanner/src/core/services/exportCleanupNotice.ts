import { normalizeAppLanguage, type AppLanguage } from '../i18n/localePreference';

const CLEANUP_FAILURE_GUIDANCE: Record<AppLanguage, string> = {
  en: 'The temporary PDF could not be removed. Try the export again after checking available storage.',
  es: 'No se pudo eliminar el PDF temporal. Intenta exportar de nuevo después de comprobar el espacio disponible.',
  fr: 'Le PDF temporaire n’a pas pu être supprimé. Réessayez après avoir vérifié l’espace disponible.',
  pt: 'Não foi possível remover o PDF temporário. Tente exportar novamente após verificar o espaço disponível.',
};

export function exportCleanupFailureGuidance(locale: string): string {
  return CLEANUP_FAILURE_GUIDANCE[normalizeAppLanguage(locale) ?? 'en'] ?? CLEANUP_FAILURE_GUIDANCE.en;
}
