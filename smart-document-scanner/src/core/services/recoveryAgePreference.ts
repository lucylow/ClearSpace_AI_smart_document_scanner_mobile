import { asyncStorageAdapter, type StorageAdapter } from '../storage/StorageAdapter';
import { normalizeAppLanguage, recoveryLastSavedLabel } from '../i18n/localePreference';

export const RECOVERY_AGE_DISPLAY_KEY = 'smart-document-scanner.recovery-age-display';
export const RECOVERY_AGE_REFRESH_INTERVAL_MS = 60_000;

export function shouldRefreshRecoveryAge(display: RecoveryAgeDisplay, savedAt: number | null, appIsActive = true): boolean {
  return appIsActive && display === 'relative' && savedAt !== null;
}
export type RecoveryAgeDisplay = 'relative' | 'absolute';

export const RECOVERY_AGE_COPY = {
  en: { title: 'Recovery timestamp', description: 'Choose how the latest recovery save is shown.', relative: 'Relative age', absolute: 'Date and time', justNow: 'Updated just now', relativeMinutes: (n: number) => `${n} minute${n === 1 ? '' : 's'} ago`, relativeHours: (n: number) => `${n} hour${n === 1 ? '' : 's'} ago`, relativeDays: (n: number) => `${n} day${n === 1 ? '' : 's'} ago`, unavailable: 'No recovery copy is available yet.' },
  es: { title: 'Marca de recuperación', description: 'Elige cómo se muestra el último guardado de recuperación.', relative: 'Antigüedad relativa', absolute: 'Fecha y hora', justNow: 'Actualizado hace un momento', relativeMinutes: (n: number) => `Hace ${n} minuto${n === 1 ? '' : 's'}`, relativeHours: (n: number) => `Hace ${n} hora${n === 1 ? '' : 's'}`, relativeDays: (n: number) => `Hace ${n} día${n === 1 ? '' : 's'}`, unavailable: 'Todavía no hay una copia de recuperación disponible.' },
  fr: { title: 'Horodatage de récupération', description: 'Choisissez comment afficher le dernier enregistrement de récupération.', relative: 'Âge relatif', absolute: 'Date et heure', justNow: 'Mis à jour à l’instant', relativeMinutes: (n: number) => `Il y a ${n} minute${n === 1 ? '' : 's'}`, relativeHours: (n: number) => `Il y a ${n} heure${n === 1 ? '' : 's'}`, relativeDays: (n: number) => `Il y a ${n} jour${n === 1 ? '' : 's'}`, unavailable: 'Aucune copie de récupération n’est disponible pour le moment.' },
  pt: { title: 'Data da recuperação', description: 'Escolha como o último salvamento de recuperação será exibido.', relative: 'Idade relativa', absolute: 'Data e hora', justNow: 'Atualizado agora', relativeMinutes: (n: number) => `Há ${n} minuto${n === 1 ? '' : 's'}`, relativeHours: (n: number) => `Há ${n} hora${n === 1 ? '' : 's'}`, relativeDays: (n: number) => `Há ${n} dia${n === 1 ? '' : 's'}`, unavailable: 'Nenhuma cópia de recuperação está disponível ainda.' },
} as const;

export function recoveryAgeCopy(locale: string) {
  return RECOVERY_AGE_COPY[normalizeAppLanguage(locale) ?? 'en'] ?? RECOVERY_AGE_COPY.en;
}

export function formatRecoveryAge(savedAt: number | null, now: number, locale: string, display: RecoveryAgeDisplay): string {
  const copy = recoveryAgeCopy(locale);
  if (savedAt === null || !Number.isFinite(savedAt) || savedAt <= 0) return copy.unavailable;
  const safeNow = Number.isFinite(now) ? now : savedAt;
  if (display === 'absolute') return recoveryLastSavedLabel(savedAt, locale);
  const ageMs = Math.max(0, safeNow - savedAt);
  if (ageMs < 60_000) return copy.justNow;
  const minutes = Math.floor(ageMs / 60000);
  if (minutes < 1) return copy.relativeMinutes(1);
  if (minutes < 60) return copy.relativeMinutes(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return copy.relativeHours(hours);
  return copy.relativeDays(Math.floor(hours / 24));
}

export async function loadRecoveryAgeDisplay(storage: StorageAdapter = asyncStorageAdapter): Promise<RecoveryAgeDisplay> {
  const value = await storage.get(RECOVERY_AGE_DISPLAY_KEY);
  return value === 'absolute' ? 'absolute' : 'relative';
}

export function saveRecoveryAgeDisplay(display: RecoveryAgeDisplay, storage: StorageAdapter = asyncStorageAdapter): Promise<void> {
  return storage.set(RECOVERY_AGE_DISPLAY_KEY, display);
}
