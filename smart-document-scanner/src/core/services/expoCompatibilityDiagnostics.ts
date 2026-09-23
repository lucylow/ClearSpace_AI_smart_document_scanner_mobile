import { normalizeAppLanguage } from '../i18n/localePreference';

export type ExpoCompatibilityStatus = 'up-to-date' | 'outdated' | 'unknown';
export type ExpoCompatibilityRefreshState = 'idle' | 'refreshing' | 'success' | 'failure';

const LABELS = {
  en: { upToDate: 'Expo compatibility: up to date', outdated: 'Expo compatibility: review required', unknown: 'Expo compatibility: not checked', checkedAt: (value: string) => `Checked ${value}`, checkedAge: (value: string) => `Last checked ${value}`, refresh: 'Refresh compatibility status', retry: 'Retry saving compatibility status', refreshing: 'Checking compatibility…', refreshed: 'Compatibility status refreshed', failed: 'Compatibility check unavailable' },
  es: { upToDate: 'Compatibilidad de Expo: actualizada', outdated: 'Compatibilidad de Expo: requiere revisión', unknown: 'Compatibilidad de Expo: no comprobada', checkedAt: (value: string) => `Comprobada ${value}`, checkedAge: (value: string) => `Última comprobación ${value}`, refresh: 'Actualizar estado de compatibilidad', retry: 'Reintentar guardar el estado de compatibilidad', refreshing: 'Comprobando compatibilidad…', refreshed: 'Estado de compatibilidad actualizado', failed: 'No se pudo comprobar la compatibilidad' },
  fr: { upToDate: 'Compatibilité Expo : à jour', outdated: 'Compatibilité Expo : vérification requise', unknown: 'Compatibilité Expo : non vérifiée', checkedAt: (value: string) => `Vérifiée ${value}`, checkedAge: (value: string) => `Dernière vérification ${value}`, refresh: 'Actualiser la compatibilité', retry: 'Réessayer d’enregistrer la compatibilité', refreshing: 'Vérification de la compatibilité…', refreshed: 'État de compatibilité actualisé', failed: 'Compatibilité indisponible' },
  pt: { upToDate: 'Compatibilidade do Expo: atualizada', outdated: 'Compatibilidade do Expo: requer revisão', unknown: 'Compatibilidade do Expo: não verificada', checkedAt: (value: string) => `Verificada ${value}`, checkedAge: (value: string) => `Última verificação ${value}`, refresh: 'Atualizar estado de compatibilidade', retry: 'Tentar salvar o estado de compatibilidade novamente', refreshing: 'Verificando compatibilidade…', refreshed: 'Estado de compatibilidade atualizado', failed: 'Compatibilidade indisponível' },
} as const;

export function expoCompatibilityCheckedAtLabel(timestamp: number, locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  const copy = LABELS[language] ?? LABELS.en;
  if (!Number.isFinite(timestamp) || timestamp < 0) return copy.checkedAt('time unavailable');
  try {
    const date = new Date(timestamp);
    if (!Number.isFinite(date.getTime())) return copy.checkedAt('time unavailable');
    return copy.checkedAt(new Intl.DateTimeFormat(locale || 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(date));
  } catch {
    return copy.checkedAt('time unavailable');
  }
}

export function expoCompatibilityCheckedAgeLabel(timestamp: number, now: number, locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  const copy = LABELS[language] ?? LABELS.en;
  if (!Number.isFinite(timestamp) || timestamp < 0 || !Number.isFinite(now) || now < 0) return copy.checkedAge('time unavailable');
  const elapsed = Math.max(0, now - timestamp);
  const value = elapsed < 60_000 ? 'just now' : elapsed < 3_600_000 ? `${Math.floor(elapsed / 60_000)} minutes ago` : elapsed < 86_400_000 ? `${Math.floor(elapsed / 3_600_000)} hours ago` : `${Math.floor(elapsed / 86_400_000)} days ago`;
  return copy.checkedAge(value);
}

export function expoCompatibilityRetryLabel(locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  const copy = LABELS[language] ?? LABELS.en;
  return copy.retry;
}

export function expoCompatibilityTimestampFailureNotice(locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  const copy = LABELS[language] ?? LABELS.en;
  return copy.failed;
}

export function expoCompatibilityRefreshLabel(state: ExpoCompatibilityRefreshState, locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  const copy = LABELS[language] ?? LABELS.en;
  return state === 'refreshing' ? copy.refreshing : state === 'success' ? copy.refreshed : state === 'failure' ? copy.failed : copy.refresh;
}

export function expoCompatibilityDiagnostic(status: ExpoCompatibilityStatus, locale: string): string {
  const language = normalizeAppLanguage(locale) ?? 'en';
  const copy = LABELS[language] ?? LABELS.en;
  return status === 'up-to-date' ? copy.upToDate : status === 'outdated' ? copy.outdated : copy.unknown;
}
