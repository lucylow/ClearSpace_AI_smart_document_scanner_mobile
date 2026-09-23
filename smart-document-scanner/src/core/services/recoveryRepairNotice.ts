import { normalizeAppLanguage } from '../i18n/localePreference';

const DISMISS = { en: 'Dismiss', es: 'Descartar', fr: 'Fermer', pt: 'Dispensar' } as const;

const COPY = {
  en: (count: number) => `${count} recovery entr${count === 1 ? 'y was' : 'ies were'} skipped because the saved history was invalid. Your documents are unchanged.`,
  es: (count: number) => `Se omitieron ${count} entrada${count === 1 ? '' : 's'} de recuperación porque el historial guardado no era válido. Tus documentos no han cambiado.`,
  fr: (count: number) => `${count} entrée${count === 1 ? '' : 's'} de récupération ont été ignorée${count === 1 ? '' : 's'} car l’historique enregistré était invalide. Vos documents sont inchangés.`,
  pt: (count: number) => `${count} entrada${count === 1 ? '' : 's'} de recuperação foi${count === 1 ? '' : 'ram'} ignorada${count === 1 ? '' : 's'} porque o histórico salvo era inválido. Seus documentos não foram alterados.`,
} as const;

export function recoveryRepairDismissLabel(locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  return DISMISS[language] ?? DISMISS.en;
}

export function recoveryRepairNotice(count: number, locale: string): string {
  if (!Number.isFinite(count) || count <= 0) return '';
  const language = normalizeAppLanguage(locale) ?? 'en';
  return (COPY[language] ?? COPY.en)(Math.floor(count));
}
