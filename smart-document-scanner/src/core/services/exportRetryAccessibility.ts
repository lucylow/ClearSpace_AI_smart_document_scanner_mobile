import { normalizeAppLanguage, type AppLanguage } from '../i18n/localePreference';

type ExportRetryAccessibilityCopy = { started: string; succeeded: string; failed: string };

const COPY: Record<AppLanguage, ExportRetryAccessibilityCopy> = {
  en: { started: 'Export retry started.', succeeded: 'Export retry completed.', failed: 'Export retry failed. Review the error message and try again.' },
  es: { started: 'Se inició el reintento de exportación.', succeeded: 'El reintento de exportación terminó.', failed: 'Falló el reintento de exportación. Revisa el mensaje de error e inténtalo de nuevo.' },
  fr: { started: 'La nouvelle tentative d’exportation a commencé.', succeeded: 'La nouvelle tentative d’exportation est terminée.', failed: 'La nouvelle tentative d’exportation a échoué. Consultez le message d’erreur et réessayez.' },
  pt: { started: 'A nova tentativa de exportação começou.', succeeded: 'A nova tentativa de exportação foi concluída.', failed: 'A nova tentativa de exportação falhou. Verifique a mensagem de erro e tente novamente.' },
};

export function exportRetryAccessibilityCopy(locale: string): ExportRetryAccessibilityCopy {
  return COPY[normalizeAppLanguage(locale) ?? 'en'] ?? COPY.en;
}
