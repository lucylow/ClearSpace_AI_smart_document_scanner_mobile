import { normalizeAppLanguage, type AppLanguage } from '../i18n/localePreference';
import type { OrphanedPdfAuditResult } from './orphanedPdfAudit';

type AuditCopy = { unsupported: string; failed: string; clean: (scanned: number) => string; found: (count: number, scanned: number) => string; truncated: string };

const COPY: Record<AppLanguage, AuditCopy> = {
  en: { unsupported: 'Storage audit is available on native devices only.', failed: 'Storage audit could not read temporary PDF files.', clean: scanned => `Storage audit checked ${scanned} generated PDF${scanned === 1 ? '' : 's'} and found no orphaned files.`, found: (count, scanned) => `Storage audit found ${count} orphaned generated PDF${count === 1 ? '' : 's'} among ${scanned} checked.`, truncated: ' The result was limited for safety; run the audit again to continue.' },
  es: { unsupported: 'La auditoría de almacenamiento solo está disponible en dispositivos nativos.', failed: 'La auditoría de almacenamiento no pudo leer los PDF temporales.', clean: scanned => `La auditoría revisó ${scanned} PDF generado${scanned === 1 ? '' : 's'} y no encontró archivos huérfanos.`, found: (count, scanned) => `La auditoría encontró ${count} PDF generado${count === 1 ? '' : 's'} huérfano${count === 1 ? '' : 's'} entre ${scanned} revisados.`, truncated: ' El resultado se limitó por seguridad; vuelve a ejecutar la auditoría para continuar.' },
  fr: { unsupported: 'L’audit du stockage est disponible uniquement sur les appareils natifs.', failed: 'L’audit du stockage n’a pas pu lire les PDF temporaires.', clean: scanned => `L’audit a vérifié ${scanned} PDF généré${scanned === 1 ? '' : 's'} et n’a trouvé aucun fichier orphelin.`, found: (count, scanned) => `L’audit a trouvé ${count} PDF généré${count === 1 ? '' : 's'} orphelin${count === 1 ? '' : 's'} parmi ${scanned} vérifiés.`, truncated: ' Le résultat a été limité par sécurité ; relancez l’audit pour continuer.' },
  pt: { unsupported: 'A auditoria de armazenamento está disponível apenas em dispositivos nativos.', failed: 'A auditoria de armazenamento não conseguiu ler os PDFs temporários.', clean: scanned => `A auditoria verificou ${scanned} PDF${scanned === 1 ? '' : 's'} gerado${scanned === 1 ? '' : 's'} e não encontrou arquivos órfãos.`, found: (count, scanned) => `A auditoria encontrou ${count} PDF${count === 1 ? '' : 's'} gerado${count === 1 ? '' : 's'} órfão${count === 1 ? '' : 's'} entre ${scanned} verificados.`, truncated: ' O resultado foi limitado por segurança; execute a auditoria novamente para continuar.' },
};

export function orphanedPdfAuditNotice(result: OrphanedPdfAuditResult, locale: string): string {
  const copy = COPY[normalizeAppLanguage(locale) ?? 'en'] ?? COPY.en;
  if (!result.supported) return copy.unsupported;
  if (result.error) return copy.failed;
  const message = result.orphanedUris.length ? copy.found(result.orphanedUris.length, result.scanned) : copy.clean(result.scanned);
  return result.truncated ? `${message}${copy.truncated}` : message;
}
