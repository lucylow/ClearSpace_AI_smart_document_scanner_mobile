export const CLEANUP_UNDO_WINDOW_SECONDS = 8;

export function nextUndoSeconds(seconds: number) {
  return Math.max(0, seconds - 1);
}

export function canStartCleanup(isBusy: boolean, selectedCount: number) {
  return !isBusy && selectedCount > 0;
}

export function cleanupExpiryNotice() {
  return 'Undo window expired. Cleanup is complete.';
}

export type RecoveryWindowMessageLabels = {
  expired: string;
  seconds: (seconds: number) => string;
};

const DEFAULT_RECOVERY_WINDOW_MESSAGE_LABELS: RecoveryWindowMessageLabels = {
  expired: 'Recovery window expired',
  seconds: seconds => `${seconds} second${seconds === 1 ? '' : 's'} left to restore removed documents`,
};

export const RECOVERY_WINDOW_MESSAGE_LABELS_BY_LOCALE: Record<string, RecoveryWindowMessageLabels> = {
  es: {
    expired: 'La ventana de restauración expiró',
    seconds: seconds => `${seconds === 1 ? 'Queda' : 'Quedan'} ${seconds} segundo${seconds === 1 ? '' : 's'} para restaurar los documentos eliminados`,
  },
};

function recoveryWindowLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, RecoveryWindowMessageLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_RECOVERY_WINDOW_MESSAGE_LABELS;
}

export function cleanupExpiryNoticeForLocale(locale: string | undefined, labelsByLocale: Record<string, RecoveryWindowMessageLabels> = RECOVERY_WINDOW_MESSAGE_LABELS_BY_LOCALE) {
  return `${recoveryWindowLabelsForLocale(locale, labelsByLocale).expired}. Cleanup is complete.`;
}

export type CleanupNoticeLabels = {
  partial: (removedCount: number, totalCount: number) => string;
  retry: (title: string) => string;
  restored: (title: string) => string;
  manyRestored: (restoredCount: number, totalCount: number) => string;
  expiry: string;
  retryFailed: (detail: string) => string;
  restoreFailed: (detail: string) => string;
  cleanupFailed: (detail: string) => string;
};

const DEFAULT_CLEANUP_NOTICE_LABELS: CleanupNoticeLabels = {
  partial: (removedCount, totalCount) => `${removedCount} of ${totalCount} selected documents were removed. Undo is available for the removed documents.`,
  retry: title => `${title} removed successfully. You can undo this cleanup below.`,
  restored: title => `${title} restored to your document library.`,
  manyRestored: (restoredCount, totalCount) => restoredCount === totalCount
    ? `${restoredCount} removed document${restoredCount === 1 ? '' : 's'} restored.`
    : `${restoredCount} of ${totalCount} removed documents restored. The remaining documents are still recoverable.`,
  expiry: 'Undo window expired. Cleanup is complete.',
  retryFailed: detail => `Retry failed. ${detail}`,
  restoreFailed: detail => `Restore failed. ${detail}`,
  cleanupFailed: detail => `Cleanup could not be completed. ${detail}`,
};

export const CLEANUP_NOTICE_LABELS_BY_LOCALE: Record<string, CleanupNoticeLabels> = {
  es: {
    partial: (removedCount, totalCount) => `Se eliminaron ${removedCount} de ${totalCount} documentos seleccionados. Puedes deshacer la limpieza de los documentos eliminados.`,
    retry: title => `${title} se eliminó correctamente. Puedes deshacer esta limpieza abajo.`,
    restored: title => `${title} se restauró en tu biblioteca de documentos.`,
    manyRestored: (restoredCount, totalCount) => restoredCount === totalCount
      ? `Se restauraron ${restoredCount} documento${restoredCount === 1 ? '' : 's'} eliminado${restoredCount === 1 ? '' : 's'}.`
      : `Se restauraron ${restoredCount} de ${totalCount} documentos eliminados. Los documentos restantes aún se pueden recuperar.`,
    expiry: 'La ventana para deshacer expiró. La limpieza se completó.',
    retryFailed: detail => `El reintento falló. ${detail}`,
    restoreFailed: detail => `La restauración falló. ${detail}`,
    cleanupFailed: detail => `No se pudo completar la limpieza. ${detail}`,
  },
};

function cleanupNoticeLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, CleanupNoticeLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_CLEANUP_NOTICE_LABELS;
}

export function cleanupExpiryNoticeForLocaleFromRegistry(locale?: string, labelsByLocale: Record<string, CleanupNoticeLabels> = CLEANUP_NOTICE_LABELS_BY_LOCALE) {
  return cleanupNoticeLabelsForLocale(locale, labelsByLocale).expiry;
}

export function cleanupErrorNotice(kind: 'retryFailed' | 'restoreFailed' | 'cleanupFailed', detail: string, locale?: string, labelsByLocale: Record<string, CleanupNoticeLabels> = CLEANUP_NOTICE_LABELS_BY_LOCALE) {
  return cleanupNoticeLabelsForLocale(locale, labelsByLocale)[kind](detail);
}

export type BackupNoticeLabels = {
  deleteTitle: string;
  deleteMessage: string;
  restoreTitle: string;
  cancel: string;
  delete: string;
  restore: string;
  refreshed: string;
  deleted: string;
  restored: string;
  unavailable: string;
  readFailed: (detail: string) => string;
  restoreFailed: (detail: string) => string;
  deleteFailed: (detail: string) => string;
  refreshFailed: (detail: string) => string;
};

const DEFAULT_BACKUP_NOTICE_LABELS: BackupNoticeLabels = {
  deleteTitle: 'Delete local backup?',
  deleteMessage: 'This removes the recovery copy but does not delete your current document library.',
  restoreTitle: 'Restore local backup?',
  cancel: 'Cancel',
  delete: 'Delete backup',
  restore: 'Restore',
  refreshed: 'Local recovery copy refreshed from your current library.',
  deleted: 'Local backup deleted. Your current library is unchanged.',
  restored: 'Local backup restored. Your previous library is now protected by a fresh backup.',
  unavailable: 'No usable local backup is available. Tap Refresh Settings and try again.',
  readFailed: detail => `Backup could not be read. ${detail}`,
  restoreFailed: detail => `Backup restore failed. ${detail}`,
  deleteFailed: detail => `Backup deletion failed. ${detail}`,
  refreshFailed: detail => `Backup refresh failed. ${detail}`,
};

export const BACKUP_NOTICE_LABELS_BY_LOCALE: Record<string, BackupNoticeLabels> = {
  es: {
    deleteTitle: '¿Eliminar la copia de seguridad local?',
    deleteMessage: 'Esto elimina la copia de recuperación, pero no elimina tu biblioteca de documentos actual.',
    restoreTitle: '¿Restaurar la copia de seguridad local?',
    cancel: 'Cancelar',
    delete: 'Eliminar copia',
    restore: 'Restaurar',
    refreshed: 'La copia de recuperación local se actualizó desde tu biblioteca actual.',
    deleted: 'Copia de seguridad local eliminada. Tu biblioteca actual no cambió.',
    restored: 'Copia de seguridad local restaurada. Tu biblioteca anterior ahora está protegida con una copia nueva.',
    unavailable: 'No hay una copia de seguridad local utilizable. Toca Actualizar ajustes e inténtalo de nuevo.',
    readFailed: detail => `No se pudo leer la copia de seguridad. ${detail}`,
    restoreFailed: detail => `No se pudo restaurar la copia de seguridad. ${detail}`,
    deleteFailed: detail => `No se pudo eliminar la copia de seguridad. ${detail}`,
    refreshFailed: detail => `No se pudo actualizar la copia de seguridad. ${detail}`,
  },
};

function backupNoticeLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, BackupNoticeLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_BACKUP_NOTICE_LABELS;
}

export function backupDialogLabel(key: keyof Pick<BackupNoticeLabels, 'deleteTitle' | 'deleteMessage' | 'restoreTitle' | 'cancel' | 'delete' | 'restore'>, locale?: string, labelsByLocale: Record<string, BackupNoticeLabels> = BACKUP_NOTICE_LABELS_BY_LOCALE) {
  return backupNoticeLabelsForLocale(locale, labelsByLocale)[key];
}

export function backupNotice(kind: 'refreshed' | 'deleted' | 'restored' | 'unavailable', locale?: string, labelsByLocale: Record<string, BackupNoticeLabels> = BACKUP_NOTICE_LABELS_BY_LOCALE) {
  return backupNoticeLabelsForLocale(locale, labelsByLocale)[kind];
}

export function backupErrorNotice(kind: 'readFailed' | 'restoreFailed' | 'deleteFailed' | 'refreshFailed', detail: string, locale?: string, labelsByLocale: Record<string, BackupNoticeLabels> = BACKUP_NOTICE_LABELS_BY_LOCALE) {
  return backupNoticeLabelsForLocale(locale, labelsByLocale)[kind](detail);
}

export type MonetizationNoticeLabels = {
  processing: string;
  purchaseComplete: string;
  alreadyOwned: string;
  purchaseUnavailable: string;
  restoring: string;
  restored: string;
  alreadyActive: string;
  noneFound: string;
  refreshing: string;
  refreshed: string;
  statusUnavailable: string;
  purchaseFailed: (detail: string) => string;
  restoreFailed: (detail: string) => string;
  refreshFailed: (detail: string) => string;
};

const DEFAULT_MONETIZATION_NOTICE_LABELS: MonetizationNoticeLabels = {
  processing: 'Processing purchase…',
  purchaseComplete: 'Purchase complete. Pro features are enabled.',
  alreadyOwned: 'This offer is already active.',
  purchaseUnavailable: 'Purchase could not be completed. Try again or restore purchases.',
  restoring: 'Restoring purchases…',
  restored: 'Restored Pro access.',
  alreadyActive: 'Pro access is already active.',
  noneFound: 'No previous Pro purchase was found.',
  refreshing: 'Refreshing subscription status…',
  refreshed: 'Subscription status refreshed.',
  statusUnavailable: 'Subscription status unavailable · Restore purchases to refresh access',
  purchaseFailed: detail => `Purchase failed. ${detail}`,
  restoreFailed: detail => `Restore failed. ${detail}`,
  refreshFailed: detail => `Subscription refresh failed. ${detail}`,
};

export const MONETIZATION_NOTICE_LABELS_BY_LOCALE: Record<string, MonetizationNoticeLabels> = {
  es: {
    processing: 'Procesando la compra…',
    purchaseComplete: 'Compra completada. Las funciones Pro están activadas.',
    alreadyOwned: 'Esta oferta ya está activa.',
    purchaseUnavailable: 'No se pudo completar la compra. Inténtalo de nuevo o restaura tus compras.',
    restoring: 'Restaurando compras…',
    restored: 'Acceso Pro restaurado.',
    alreadyActive: 'El acceso Pro ya está activo.',
    noneFound: 'No se encontró ninguna compra Pro anterior.',
    refreshing: 'Actualizando el estado de la suscripción…',
    refreshed: 'Estado de la suscripción actualizado.',
    statusUnavailable: 'Estado de la suscripción no disponible · Restaura tus compras para actualizar el acceso',
    purchaseFailed: detail => `La compra falló. ${detail}`,
    restoreFailed: detail => `La restauración falló. ${detail}`,
    refreshFailed: detail => `Falló la actualización de la suscripción. ${detail}`,
  },
};

function monetizationNoticeLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, MonetizationNoticeLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_MONETIZATION_NOTICE_LABELS;
}

export function monetizationNotice(kind: Exclude<keyof MonetizationNoticeLabels, 'purchaseFailed' | 'restoreFailed' | 'refreshFailed'>, locale?: string, labelsByLocale: Record<string, MonetizationNoticeLabels> = MONETIZATION_NOTICE_LABELS_BY_LOCALE) {
  return monetizationNoticeLabelsForLocale(locale, labelsByLocale)[kind];
}

export function monetizationPurchaseSuccess(alreadyOwned: boolean, locale?: string, labelsByLocale: Record<string, MonetizationNoticeLabels> = MONETIZATION_NOTICE_LABELS_BY_LOCALE) {
  const labels = monetizationNoticeLabelsForLocale(locale, labelsByLocale);
  return alreadyOwned ? labels.alreadyOwned : labels.purchaseComplete;
}

export function monetizationErrorNotice(kind: 'purchaseFailed' | 'restoreFailed' | 'refreshFailed', detail: string, locale?: string, labelsByLocale: Record<string, MonetizationNoticeLabels> = MONETIZATION_NOTICE_LABELS_BY_LOCALE) {
  return monetizationNoticeLabelsForLocale(locale, labelsByLocale)[kind](detail);
}

export type PaywallLabels = {
  proIncludes: string;
  proStartsAt: (price: string) => string;
  productPrice: (price: string, interval: 'month' | 'year') => string;
  creditsRemaining: (count: number) => string;
  watchAd: string;
  upgrade: string;
  restorePurchases: string;
  refreshSubscription: string;
  switchFreeTitle: string;
  switchFreeMessage: string;
  cancel: string;
  confirmFree: string;
  yourPlan: string;
  proPlan: string;
  freePlan: string;
  unlimitedExports: string;
  ocrWatermarkFree: string;
  billingLocal: string;
  biometricChecking: string;
  biometricAvailable: (kind: string) => string;
  biometricWebFallback: string;
  biometricUnavailable: string;
  migration: (source: number, target: number, kept: number, seen: number, repaired: number) => string;
  migrationDiagnostics: (source: number, target: number, kept: number, seen: number, repaired: number, dropped: number) => string;
  privacy: string;
  lockNow: string;
  lockNotice: string;
  biometricLock: string;
  biometricLockDescription: string;
  timeout: string;
  fallback: string;
  requireBiometrics: string;
  allowDevicePasscode: string;
  devicePasscode: string;
  localProcessing: string;
  version: string;
  timeoutValue: (value: number, unit: 'seconds' | 'minutes') => string;
  batchScanning: string;
  experimentalCrop: string;
  openBatchScan: string;
  scannerFeatures: string;
  ocrTextRecognition: string;
  documentProcessing: string;
  scanQuality: string;
  documentDetected: string;
  readyToScan: string;
  alignDocument: string;
  storageNearlyFull: string;
  storageUsageElevated: string;
  noCleanupCandidates: string;
  reviewCleanup: string;
  importPhoto: string;
  advancedScan: string;
  processingScan: string;
  documentReady: string;
  tapToCapture: string;
  recentScans: string;
  viewAll: string;
  preparingCamera: string;
  cameraReadyMessage: string;
  cameraAccessNeeded: string;
  cameraAccessDescription: string;
  allowCamera: string;
  cameraPermissionError: string;
  edgeNotFound: string;
  captureFailed: string;
  noPhoto: string;
  photoReadFailed: string;
  photoImportFailed: string;
  photoPermissionHint: string;
  dismiss: string;
  openStorageCleanup: string;
  webDemoMode: string;
  cameraPreviewSimulated: string;
  openDocumentLibrary: string;
  openRecentScan: (title: string) => string;
  pageSingular: string;
  pagePlural: string;
  tryAgain: string;
  advancedScanner: string;
  advancedScannerDescription: string;
  lighting: string;
  edgeConfidence: string;
  stability: string;
  goodQuality: string;
  evaluateFrame: string;
  captureAccepted: string;
  backToScan: string;
};

const DEFAULT_PAYWALL_LABELS: PaywallLabels = {
  proIncludes: 'Pro includes unlimited exports, OCR, cloud backup, and watermark-free PDFs.',
  proStartsAt: price => `Pro starts at ${price} per month.`,
  productPrice: (price, interval) => `${price} / ${interval}`,
  creditsRemaining: count => `${count} export credit${count === 1 ? '' : 's'} remaining`,
  watchAd: 'Watch ad for 3 credits',
  upgrade: 'Upgrade to Pro',
  restorePurchases: 'Restore purchases',
  refreshSubscription: 'Refresh subscription status',
  switchFreeTitle: 'Switch to Free plan?',
  switchFreeMessage: 'Production billing is not connected; plan changes are unavailable.',
  cancel: 'Cancel',
  confirmFree: 'Confirm switch to Free plan',
  yourPlan: 'Your plan',
  proPlan: 'Pro',
  freePlan: 'Free',
  unlimitedExports: 'Unlimited exports',
  ocrWatermarkFree: 'OCR and watermark-free exports enabled',
  billingLocal: 'Local billing provider',
  biometricChecking: 'Checking biometric availability…',
  biometricAvailable: kind => `Available: ${kind}`,
  biometricWebFallback: 'Web fallback enabled',
  biometricUnavailable: 'Not available on this device',
  migration: (source, target, kept, seen, repaired) => `Storage migration: v${source} → v${target} · ${kept}/${seen} records retained · ${repaired} pages repaired`,
  migrationDiagnostics: (source, target, kept, seen, repaired, dropped) => `Migration v${source} → v${target}\nRecords retained: ${kept}/${seen}\nPages repaired: ${repaired}\nHistory entries dropped: ${dropped}`,
  privacy: 'Privacy',
  lockNow: 'Lock now',
  lockNotice: 'App locked. Unlock from the lock screen to continue.',
  biometricLock: 'Biometric lock',
  biometricLockDescription: 'Auto-lock when the app returns after being inactive.',
  timeout: 'Timeout',
  fallback: 'Fallback',
  requireBiometrics: 'Require biometrics',
  allowDevicePasscode: 'Allow device passcode',
  devicePasscode: 'Device passcode',
  localProcessing: 'Scans are processed locally by default. Nothing is uploaded unless you explicitly add cloud backup later.',
  version: 'Version',
  timeoutValue: (value, unit) => `${value} ${unit}`,
  batchScanning: 'Batch scanning',
  experimentalCrop: 'Experimental crop',
  openBatchScan: 'Open batch scan',
  scannerFeatures: 'Scanner features',
  ocrTextRecognition: 'OCR text recognition',
  documentProcessing: 'Document processing',
  scanQuality: 'Scan quality',
  documentDetected: 'Document detected',
  readyToScan: 'Ready to scan',
  alignDocument: 'Align the document inside the frame',
  storageNearlyFull: 'nearly full',
  storageUsageElevated: 'usage elevated',
  noCleanupCandidates: 'No cleanup candidates found',
  reviewCleanup: 'Review cleanup',
  importPhoto: 'Import photo',
  advancedScan: 'Advanced scan',
  processingScan: 'Processing your scan…',
  documentReady: 'Document ready',
  tapToCapture: 'Tap to capture',
  recentScans: 'Recent scans',
  viewAll: 'View all',
  preparingCamera: 'Preparing your camera',
  cameraReadyMessage: 'One moment while we get the scanner ready.',
  cameraAccessNeeded: 'Camera access is needed',
  cameraAccessDescription: 'Smart Document Scanner only uses the camera when you capture a document.',
  allowCamera: 'Allow camera',
  cameraPermissionError: 'Camera permission could not be requested.',
  edgeNotFound: 'We could not find document edges. Try better lighting and a flatter angle.',
  captureFailed: 'Capture failed.',
  noPhoto: 'No photo was captured. Please try again.',
  photoReadFailed: 'The selected photo could not be read. Please choose another image.',
  photoImportFailed: 'Photo import failed.',
  photoPermissionHint: 'Please check photo permissions and try again.',
  dismiss: 'Dismiss',
  openStorageCleanup: 'Open storage cleanup',
  webDemoMode: 'WEB DEMO MODE',
  cameraPreviewSimulated: 'Camera preview is simulated on web',
  openDocumentLibrary: 'Open document library',
  openRecentScan: title => `Open recent scan ${title}`,
  pageSingular: 'page',
  pagePlural: 'pages',
  tryAgain: 'Please try again.',
  advancedScanner: 'Advanced scanner',
  advancedScannerDescription: 'Automatic capture evaluates stability, edge confidence, sharpness, and lighting before accepting a frame.',
  lighting: 'Lighting',
  edgeConfidence: 'Edge confidence',
  stability: 'Stability',
  goodQuality: 'Good',
  evaluateFrame: 'Evaluate frame',
  captureAccepted: 'Capture accepted.',
  backToScan: 'Back to scan',
};

export const PAYWALL_LABELS_BY_LOCALE: Record<string, PaywallLabels> = {
  es: {
    proIncludes: 'Pro incluye exportaciones ilimitadas, OCR, copia de seguridad en la nube y PDF sin marca de agua.',
    proStartsAt: price => `Pro comienza desde ${price} al mes.`,
    productPrice: (price, interval) => `${price} / ${interval === 'year' ? 'año' : 'mes'}`,
    creditsRemaining: count => `Quedan ${count} crédito${count === 1 ? '' : 's'} de exportación`,
    watchAd: 'Ver anuncio para obtener 3 créditos',
    upgrade: 'Actualizar a Pro',
    restorePurchases: 'Restaurar compras',
    refreshSubscription: 'Actualizar el estado de la suscripción',
    switchFreeTitle: '¿Cambiar al plan Gratis?',
    switchFreeMessage: 'La facturación de producción no está conectada; los cambios de plan no están disponibles.',
    cancel: 'Cancelar',
    confirmFree: 'Confirmar cambio al plan Gratis',
    yourPlan: 'Tu plan',
    proPlan: 'Pro',
    freePlan: 'Gratis',
    unlimitedExports: 'Exportaciones ilimitadas',
    ocrWatermarkFree: 'OCR y exportaciones sin marca de agua activados',
    billingLocal: 'Proveedor de facturación local',
    biometricChecking: 'Comprobando la disponibilidad de datos biométricos…',
    biometricAvailable: kind => `Disponible: ${kind}`,
    biometricWebFallback: 'Respaldo web activado',
    biometricUnavailable: 'No disponible en este dispositivo',
    migration: (source, target, kept, seen, repaired) => `Migración de almacenamiento: v${source} → v${target} · ${kept}/${seen} registros conservados · ${repaired} páginas reparadas`,
    migrationDiagnostics: (source, target, kept, seen, repaired, dropped) => `Migración v${source} → v${target}\nRegistros conservados: ${kept}/${seen}\nPáginas reparadas: ${repaired}\nEntradas de historial descartadas: ${dropped}`,
    privacy: 'Privacidad',
    lockNow: 'Bloquear ahora',
    lockNotice: 'Aplicación bloqueada. Desbloquéala desde la pantalla de bloqueo para continuar.',
    biometricLock: 'Bloqueo biométrico',
    biometricLockDescription: 'Bloquea automáticamente la aplicación al volver después de estar inactiva.',
    timeout: 'Tiempo de espera',
    fallback: 'Alternativa',
    requireBiometrics: 'Requerir datos biométricos',
    allowDevicePasscode: 'Permitir código del dispositivo',
    devicePasscode: 'Código del dispositivo',
    localProcessing: 'Los escaneos se procesan localmente de forma predeterminada. No se sube nada a menos que añadas una copia de seguridad en la nube.',
    version: 'Versión',
    timeoutValue: (value, unit) => `${value} ${unit === 'minutes' ? 'minutos' : 'segundos'}`,
    batchScanning: 'Escaneo por lotes',
    experimentalCrop: 'Recorte experimental',
    openBatchScan: 'Abrir escaneo por lotes',
    scannerFeatures: 'Funciones del escáner',
    ocrTextRecognition: 'Reconocimiento de texto OCR',
    documentProcessing: 'Procesamiento de documentos',
    scanQuality: 'Calidad del escaneo',
    documentDetected: 'Documento detectado',
    readyToScan: 'Listo para escanear',
    alignDocument: 'Alinea el documento dentro del marco',
    storageNearlyFull: 'casi lleno',
    storageUsageElevated: 'uso elevado',
    noCleanupCandidates: 'No se encontraron documentos para limpiar',
    reviewCleanup: 'Revisar limpieza',
    importPhoto: 'Importar foto',
    advancedScan: 'Escaneo avanzado',
    processingScan: 'Procesando tu escaneo…',
    documentReady: 'Documento listo',
    tapToCapture: 'Toca para capturar',
    recentScans: 'Escaneos recientes',
    viewAll: 'Ver todo',
    preparingCamera: 'Preparando la cámara',
    cameraReadyMessage: 'Espera un momento mientras preparamos el escáner.',
    cameraAccessNeeded: 'Se necesita acceso a la cámara',
    cameraAccessDescription: 'Smart Document Scanner solo usa la cámara cuando capturas un documento.',
    allowCamera: 'Permitir cámara',
    cameraPermissionError: 'No se pudo solicitar el permiso de cámara.',
    edgeNotFound: 'No pudimos encontrar los bordes del documento. Prueba con mejor iluminación y un ángulo más plano.',
    captureFailed: 'La captura falló.',
    noPhoto: 'No se capturó ninguna foto. Inténtalo de nuevo.',
    photoReadFailed: 'No se pudo leer la foto seleccionada. Elige otra imagen.',
    photoImportFailed: 'La importación de fotos falló.',
    photoPermissionHint: 'Comprueba los permisos de fotos e inténtalo de nuevo.',
    dismiss: 'Cerrar',
    openStorageCleanup: 'Abrir limpieza de almacenamiento',
    webDemoMode: 'MODO DEMO WEB',
    cameraPreviewSimulated: 'La vista previa de la cámara está simulada en la web',
    openDocumentLibrary: 'Abrir biblioteca de documentos',
    openRecentScan: title => `Abrir escaneo reciente ${title}`,
    pageSingular: 'página',
    pagePlural: 'páginas',
    tryAgain: 'Inténtalo de nuevo.',
    advancedScanner: 'Escáner avanzado',
    advancedScannerDescription: 'La captura automática evalúa la estabilidad, la confianza de los bordes, la nitidez y la iluminación antes de aceptar un fotograma.',
    lighting: 'Iluminación',
    edgeConfidence: 'Confianza de los bordes',
    stability: 'Estabilidad',
    goodQuality: 'Buena',
    evaluateFrame: 'Evaluar fotograma',
    captureAccepted: 'Captura aceptada.',
    backToScan: 'Volver al escáner',
  },
  fr: {
    ...DEFAULT_PAYWALL_LABELS,
    proIncludes: 'Pro comprend les exportations illimitées, la reconnaissance OCR, la sauvegarde cloud et les PDF sans filigrane.',
    productPrice: (price, interval) => `${price} / ${interval === 'year' ? 'an' : 'mois'}`,
    unlimitedExports: 'Exportations illimitées',
    ocrWatermarkFree: 'OCR et exportations sans filigrane activés',
    documentDetected: 'Document détecté', readyToScan: 'Prêt à numériser', alignDocument: 'Alignez le document dans le cadre', storageNearlyFull: 'presque plein', storageUsageElevated: 'utilisation élevée', noCleanupCandidates: 'Aucun document à nettoyer', reviewCleanup: 'Vérifier le nettoyage', importPhoto: 'Importer une photo', advancedScan: 'Scan avancé', processingScan: 'Traitement de votre scan…', documentReady: 'Document prêt', tapToCapture: 'Touchez pour capturer', recentScans: 'Scans récents', viewAll: 'Tout afficher', preparingCamera: 'Préparation de l’appareil photo', cameraReadyMessage: 'Un instant pendant la préparation du scanner.', cameraAccessNeeded: 'L’accès à l’appareil photo est requis', cameraAccessDescription: 'Smart Document Scanner utilise l’appareil photo uniquement lors de la capture d’un document.', allowCamera: 'Autoriser l’appareil photo', cameraPermissionError: 'La demande d’autorisation de l’appareil photo a échoué.', edgeNotFound: 'Les bords du document sont introuvables. Essayez avec un meilleur éclairage et un angle plus plat.', captureFailed: 'Échec de la capture.', noPhoto: 'Aucune photo n’a été capturée. Réessayez.', photoReadFailed: 'La photo sélectionnée n’a pas pu être lue. Choisissez une autre image.', photoImportFailed: 'Échec de l’importation de la photo.', photoPermissionHint: 'Vérifiez les autorisations des photos et réessayez.', dismiss: 'Fermer', openStorageCleanup: 'Ouvrir le nettoyage du stockage', webDemoMode: 'MODE DÉMO WEB', cameraPreviewSimulated: 'L’aperçu de l’appareil photo est simulé sur le Web', openDocumentLibrary: 'Ouvrir la bibliothèque de documents', openRecentScan: title => `Ouvrir le scan récent ${title}`, pageSingular: 'page', pagePlural: 'pages', tryAgain: 'Veuillez réessayer.', advancedScanner: 'Scanner avancé', advancedScannerDescription: 'La capture automatique évalue la stabilité, la confiance des bords, la netteté et l’éclairage avant d’accepter une image.', lighting: 'Éclairage', edgeConfidence: 'Confiance des bords', stability: 'Stabilité', goodQuality: 'Bonne', evaluateFrame: 'Évaluer l’image', captureAccepted: 'Capture acceptée.', backToScan: 'Retour au scan',
  },
  pt: {
    ...DEFAULT_PAYWALL_LABELS,
    proIncludes: 'O Pro inclui exportações ilimitadas, OCR, backup na nuvem e PDFs sem marca d’água.',
    productPrice: (price, interval) => `${price} / ${interval === 'year' ? 'ano' : 'mês'}`,
    unlimitedExports: 'Exportações ilimitadas',
    ocrWatermarkFree: 'OCR e exportações sem marca d’água ativados',
    documentDetected: 'Documento detectado', readyToScan: 'Pronto para digitalizar', alignDocument: 'Alinhe o documento dentro da moldura', storageNearlyFull: 'quase cheio', storageUsageElevated: 'uso elevado', noCleanupCandidates: 'Nenhum documento para limpar', reviewCleanup: 'Revisar limpeza', importPhoto: 'Importar foto', advancedScan: 'Digitalização avançada', processingScan: 'Processando sua digitalização…', documentReady: 'Documento pronto', tapToCapture: 'Toque para capturar', recentScans: 'Digitalizações recentes', viewAll: 'Ver tudo', preparingCamera: 'Preparando sua câmera', cameraReadyMessage: 'Aguarde enquanto preparamos o scanner.', cameraAccessNeeded: 'O acesso à câmera é necessário', cameraAccessDescription: 'O Smart Document Scanner usa a câmera somente quando você captura um documento.', allowCamera: 'Permitir câmera', cameraPermissionError: 'Não foi possível solicitar a permissão da câmera.', edgeNotFound: 'Não encontramos as bordas do documento. Tente melhorar a iluminação e usar um ângulo mais plano.', captureFailed: 'Falha na captura.', noPhoto: 'Nenhuma foto foi capturada. Tente novamente.', photoReadFailed: 'Não foi possível ler a foto selecionada. Escolha outra imagem.', photoImportFailed: 'Falha ao importar a foto.', photoPermissionHint: 'Verifique as permissões de fotos e tente novamente.', dismiss: 'Fechar', openStorageCleanup: 'Abrir limpeza do armazenamento', webDemoMode: 'MODO DE DEMONSTRAÇÃO WEB', cameraPreviewSimulated: 'A prévia da câmera é simulada na web', openDocumentLibrary: 'Abrir biblioteca de documentos', openRecentScan: title => `Abrir digitalização recente ${title}`, pageSingular: 'página', pagePlural: 'páginas', tryAgain: 'Tente novamente.', advancedScanner: 'Scanner avançado', advancedScannerDescription: 'A captura automática avalia estabilidade, confiança das bordas, nitidez e iluminação antes de aceitar um quadro.', lighting: 'Iluminação', edgeConfidence: 'Confiança das bordas', stability: 'Estabilidade', goodQuality: 'Boa', evaluateFrame: 'Avaliar quadro', captureAccepted: 'Captura aceita.', backToScan: 'Voltar para digitalização',
  },
};

function paywallLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, PaywallLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_PAYWALL_LABELS;
}

export function paywallLabel(kind: keyof Pick<PaywallLabels, 'proIncludes' | 'watchAd' | 'upgrade' | 'restorePurchases' | 'refreshSubscription' | 'switchFreeTitle' | 'switchFreeMessage' | 'cancel' | 'confirmFree'>, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale)[kind];
}

export function paywallProStartsAt(price: string, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale).proStartsAt(price);
}

export function paywallProductPrice(price: string, interval: 'month' | 'year', locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale).productPrice(price, interval);
}

export function paywallCreditsRemaining(count: number, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale).creditsRemaining(count);
}

export function paywallPlanLabel(kind: 'yourPlan' | 'proPlan' | 'freePlan' | 'unlimitedExports' | 'ocrWatermarkFree' | 'billingLocal', locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale)[kind];
}

export function biometricStatusLabel(kind: 'checking' | 'available' | 'webFallback' | 'unavailable', value?: string, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  const labels = paywallLabelsForLocale(locale, labelsByLocale);
  if (kind === 'checking') return labels.biometricChecking;
  if (kind === 'available') return labels.biometricAvailable(value ?? '');
  return kind === 'webFallback' ? labels.biometricWebFallback : labels.biometricUnavailable;
}

export function storageMigrationLabel(kind: 'summary' | 'diagnostics', source: number, target: number, kept: number, seen: number, repaired: number, dropped = 0, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  const labels = paywallLabelsForLocale(locale, labelsByLocale);
  return kind === 'summary' ? labels.migration(source, target, kept, seen, repaired) : labels.migrationDiagnostics(source, target, kept, seen, repaired, dropped);
}

export function securityLabel(kind: Exclude<keyof PaywallLabels, 'proIncludes' | 'proStartsAt' | 'productPrice' | 'creditsRemaining' | 'watchAd' | 'upgrade' | 'restorePurchases' | 'refreshSubscription' | 'switchFreeTitle' | 'switchFreeMessage' | 'cancel' | 'confirmFree' | 'yourPlan' | 'proPlan' | 'freePlan' | 'unlimitedExports' | 'ocrWatermarkFree' | 'billingLocal' | 'biometricChecking' | 'biometricAvailable' | 'biometricWebFallback' | 'biometricUnavailable' | 'migration' | 'migrationDiagnostics' | 'timeoutValue' | 'openRecentScan'>, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale)[kind];
}

type ScannerLanguage = 'en' | 'es' | 'fr' | 'pt';
type ScannerStatusCopy = { quality: (message: string) => string; storageWarning: (level: 'nearlyFull' | 'usageElevated', storageLabel: string, candidates: number, bytes: string) => string };
function scannerLanguage(locale?: string): ScannerLanguage { const language = locale?.trim().toLowerCase().split('-')[0]; return language === 'es' || language === 'fr' || language === 'pt' ? language : 'en'; }
const SCANNER_STATUS_COPY_BY_LOCALE: Record<ScannerLanguage, ScannerStatusCopy> = {
  en: { quality: message => message === 'Document detected' ? 'Document detected' : message === 'Document edges detected' ? 'Document edges detected' : message === 'Move the document inside the frame' ? 'Move the document inside the frame' : 'Document not detected', storageWarning: (level, storageLabel, candidates, bytes) => `Storage ${level === 'nearlyFull' ? 'nearly full' : 'usage elevated'} · ${storageLabel}${candidates ? ` · ${candidates} older document${candidates === 1 ? '' : 's'} can be removed (${bytes})` : ' · No cleanup candidates found'}` },
  es: { quality: message => message === 'Document detected' ? 'Documento detectado' : message === 'Document edges detected' ? 'Bordes del documento detectados' : message === 'Move the document inside the frame' ? 'Mueve el documento dentro del marco' : 'Documento no detectado', storageWarning: (level, storageLabel, candidates, bytes) => `Almacenamiento ${level === 'nearlyFull' ? 'casi lleno' : 'uso elevado'} · ${storageLabel}${candidates ? ` · ${candidates} documento${candidates === 1 ? '' : 's'} antiguos se pueden eliminar (${bytes})` : ' · No se encontraron documentos para limpiar'}` },
  fr: { quality: message => message === 'Document detected' ? 'Document détecté' : message === 'Document edges detected' ? 'Bords du document détectés' : message === 'Move the document inside the frame' ? 'Déplacez le document dans le cadre' : 'Document non détecté', storageWarning: (level, storageLabel, candidates, bytes) => `Stockage ${level === 'nearlyFull' ? 'presque plein' : 'utilisation élevée'} · ${storageLabel}${candidates ? ` · ${candidates} ancien${candidates === 1 ? '' : 's'} document${candidates === 1 ? '' : 's'} peuvent être supprimés (${bytes})` : ' · Aucun document à nettoyer'}` },
  pt: { quality: message => message === 'Document detected' ? 'Documento detectado' : message === 'Document edges detected' ? 'Bordas do documento detectadas' : message === 'Move the document inside the frame' ? 'Mova o documento para dentro da moldura' : 'Documento não detectado', storageWarning: (level, storageLabel, candidates, bytes) => `Armazenamento ${level === 'nearlyFull' ? 'quase cheio' : 'uso elevado'} · ${storageLabel}${candidates ? ` · ${candidates} documento${candidates === 1 ? '' : 's'} antigos podem ser removidos (${bytes})` : ' · Nenhum documento para limpar'}` },
};
export function scannerQualityMessage(message: string, locale?: string) { const key = scannerLanguage(locale); return (SCANNER_STATUS_COPY_BY_LOCALE[key] ?? SCANNER_STATUS_COPY_BY_LOCALE.en).quality(message); }
export function scannerStorageWarning(level: 'nearlyFull' | 'usageElevated', storageLabel: string, candidates: number, bytes: string, locale?: string) { const key = scannerLanguage(locale); return (SCANNER_STATUS_COPY_BY_LOCALE[key] ?? SCANNER_STATUS_COPY_BY_LOCALE.en).storageWarning(level, storageLabel, candidates, bytes); }

export function recentScanAccessibilityLabel(title: string, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  return paywallLabelsForLocale(locale, labelsByLocale).openRecentScan(title);
}

export function securityTimeoutLabel(milliseconds: number, locale?: string, labelsByLocale: Record<string, PaywallLabels> = PAYWALL_LABELS_BY_LOCALE) {
  const labels = paywallLabelsForLocale(locale, labelsByLocale);
  const isSubMinute = milliseconds < 60000;
  const value = isSubMinute ? Math.round(milliseconds / 1000) : Math.round(milliseconds / 60000);
  return labels.timeoutValue(value, isSubMinute ? 'seconds' : 'minutes');
}

export function partialCleanupNotice(removedCount: number, totalCount: number) {
  return DEFAULT_CLEANUP_NOTICE_LABELS.partial(removedCount, totalCount);
}

export function partialCleanupNoticeForLocale(removedCount: number, totalCount: number, locale?: string, labelsByLocale: Record<string, CleanupNoticeLabels> = CLEANUP_NOTICE_LABELS_BY_LOCALE) {
  return cleanupNoticeLabelsForLocale(locale, labelsByLocale).partial(removedCount, totalCount);
}

export function retryCleanupNotice(title: string) {
  return DEFAULT_CLEANUP_NOTICE_LABELS.retry(title);
}

export function retryCleanupNoticeForLocale(title: string, locale?: string, labelsByLocale: Record<string, CleanupNoticeLabels> = CLEANUP_NOTICE_LABELS_BY_LOCALE) {
  return cleanupNoticeLabelsForLocale(locale, labelsByLocale).retry(title);
}

export function restoreCleanupNotice(title: string) {
  return DEFAULT_CLEANUP_NOTICE_LABELS.restored(title);
}

export function restoreCleanupNoticeForLocale(title: string, locale?: string, labelsByLocale: Record<string, CleanupNoticeLabels> = CLEANUP_NOTICE_LABELS_BY_LOCALE) {
  return cleanupNoticeLabelsForLocale(locale, labelsByLocale).restored(title);
}

export function restoreManyCleanupNotice(restoredCount: number, totalCount: number) {
  return DEFAULT_CLEANUP_NOTICE_LABELS.manyRestored(restoredCount, totalCount);
}

export function restoreManyCleanupNoticeForLocale(restoredCount: number, totalCount: number, locale?: string, labelsByLocale: Record<string, CleanupNoticeLabels> = CLEANUP_NOTICE_LABELS_BY_LOCALE) {
  return cleanupNoticeLabelsForLocale(locale, labelsByLocale).manyRestored(restoredCount, totalCount);
}

export type RecoveryAnnouncementLabels = {
  progress: (completed: number, total: number) => string;
  cancellation: (restoredCount: number, remainingCount: number) => string;
  cancellationAnnouncement: (restoredCount: number, remainingCount: number) => string;
};

const DEFAULT_RECOVERY_ANNOUNCEMENT_LABELS: RecoveryAnnouncementLabels = {
  progress: (completed, total) => `Restoring documents… ${completed}/${total}`,
  cancellation: (restoredCount, remainingCount) => `${restoredCount} restored, ${remainingCount} remaining and recoverable.`,
  cancellationAnnouncement: (restoredCount, remainingCount) => `Restore cancelled. ${restoredCount} restored, ${remainingCount} remaining and recoverable.`,
};

export const RECOVERY_ANNOUNCEMENT_LABELS_BY_LOCALE: Record<string, RecoveryAnnouncementLabels> = {
  es: {
    progress: (completed, total) => `Restaurando documentos… ${completed}/${total}`,
    cancellation: (restoredCount, remainingCount) => `${restoredCount} restaurado${restoredCount === 1 ? '' : 's'}, ${remainingCount} restante${remainingCount === 1 ? '' : 's'} y recuperable${remainingCount === 1 ? '' : 's'}.`,
    cancellationAnnouncement: (restoredCount, remainingCount) => `Restauración cancelada. ${restoredCount} restaurado${restoredCount === 1 ? '' : 's'}, ${remainingCount} restante${remainingCount === 1 ? '' : 's'} y recuperable${remainingCount === 1 ? '' : 's'}.`,
  },
};

function recoveryAnnouncementLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, RecoveryAnnouncementLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_RECOVERY_ANNOUNCEMENT_LABELS;
}

export function restoreProgressLabel(completed: number, total: number) {
  return DEFAULT_RECOVERY_ANNOUNCEMENT_LABELS.progress(completed, total);
}

export function restoreProgressLabelForLocale(completed: number, total: number, locale: string | undefined, labelsByLocale: Record<string, RecoveryAnnouncementLabels> = RECOVERY_ANNOUNCEMENT_LABELS_BY_LOCALE) {
  return recoveryAnnouncementLabelsForLocale(locale, labelsByLocale).progress(completed, total);
}

export function restoreCancellationNotice(restoredCount: number, totalCount: number) {
  return DEFAULT_RECOVERY_ANNOUNCEMENT_LABELS.cancellation(restoredCount, Math.max(totalCount - restoredCount, 0));
}

export function restoreCancellationNoticeForLocale(restoredCount: number, totalCount: number, locale: string | undefined, labelsByLocale: Record<string, RecoveryAnnouncementLabels> = RECOVERY_ANNOUNCEMENT_LABELS_BY_LOCALE) {
  return recoveryAnnouncementLabelsForLocale(locale, labelsByLocale).cancellation(restoredCount, Math.max(totalCount - restoredCount, 0));
}

export function restoreCancellationAnnouncement(restoredCount: number, totalCount: number) {
  return DEFAULT_RECOVERY_ANNOUNCEMENT_LABELS.cancellationAnnouncement(restoredCount, Math.max(totalCount - restoredCount, 0));
}

export function restoreCancellationAnnouncementForLocale(restoredCount: number, totalCount: number, locale: string | undefined, labelsByLocale: Record<string, RecoveryAnnouncementLabels> = RECOVERY_ANNOUNCEMENT_LABELS_BY_LOCALE) {
  return recoveryAnnouncementLabelsForLocale(locale, labelsByLocale).cancellationAnnouncement(restoredCount, Math.max(totalCount - restoredCount, 0));
}

export type RecoveryHistoryLabelKey = 'all' | 'completed' | 'cancelled' | 'failed';

export type RecoveryHistoryLabels = {
  filters: Record<RecoveryHistoryLabelKey, string>;
  emptyAll: string;
  emptyFiltered: (filter: string) => string;
  status: Record<RecoveryHistoryLabelKey, string>;
  expiredCancelled: string;
};

const DEFAULT_RECOVERY_HISTORY_LABELS: RecoveryHistoryLabels = {
  filters: { all: 'All', completed: 'Completed', cancelled: 'Cancelled', failed: 'Failed' },
  emptyAll: 'No recovery history yet.',
  emptyFiltered: filter => `No ${filter.toLowerCase()} recovery events match this filter.`,
  status: { all: 'all', completed: 'completed', cancelled: 'cancelled', failed: 'failed' },
  expiredCancelled: 'Cancelled · Expired',
};

export const RECOVERY_HISTORY_LABELS_BY_LOCALE: Record<string, RecoveryHistoryLabels> = {
  es: {
    filters: { all: 'Todos', completed: 'Completados', cancelled: 'Cancelados', failed: 'Fallidos' },
    emptyAll: 'Aún no hay historial de recuperación.',
    emptyFiltered: filter => `No hay eventos de recuperación ${filter.toLowerCase()} que coincidan con este filtro.`,
    status: { all: 'todos', completed: 'completado', cancelled: 'cancelado', failed: 'fallido' },
    expiredCancelled: 'Cancelado · Expirado',
  },
};

function recoveryHistoryLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, RecoveryHistoryLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_RECOVERY_HISTORY_LABELS;
}

export function recoveryHistoryFilterLabel(filter: RecoveryHistoryLabelKey, locale?: string, labelsByLocale: Record<string, RecoveryHistoryLabels> = RECOVERY_HISTORY_LABELS_BY_LOCALE) {
  return recoveryHistoryLabelsForLocale(locale, labelsByLocale).filters[filter];
}

export function recoveryHistoryEmptyStateLabel(filter: RecoveryHistoryLabelKey) {
  return filter === 'all' ? DEFAULT_RECOVERY_HISTORY_LABELS.emptyAll : DEFAULT_RECOVERY_HISTORY_LABELS.emptyFiltered(DEFAULT_RECOVERY_HISTORY_LABELS.filters[filter]);
}

export function recoveryHistoryEmptyStateLabelForLocale(filter: RecoveryHistoryLabelKey, locale?: string, labelsByLocale: Record<string, RecoveryHistoryLabels> = RECOVERY_HISTORY_LABELS_BY_LOCALE) {
  const labels = recoveryHistoryLabelsForLocale(locale, labelsByLocale);
  return filter === 'all' ? labels.emptyAll : labels.emptyFiltered(labels.filters[filter]);
}

export function restoreProgressPercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export function restoreProgressAnnouncement(completed: number, total: number, current: string | null, selected: boolean) {
  const prefix = selected ? 'Selected restore · ' : '';
  const currentLabel = current ? ` · ${current}` : '';
  return `${prefix}${restoreProgressLabel(completed, total)} · ${restoreProgressPercent(completed, total)}%${currentLabel}`;
}

export function restoreProgressAnnouncementForLocale(completed: number, total: number, current: string | null, selected: boolean, locale: string | undefined, labelsByLocale: Record<string, RecoveryAnnouncementLabels> = RECOVERY_ANNOUNCEMENT_LABELS_BY_LOCALE) {
  const prefix = selected ? 'Selected restore · ' : '';
  const currentLabel = current ? ` · ${current}` : '';
  return `${prefix}${restoreProgressLabelForLocale(completed, total, locale, labelsByLocale)} · ${restoreProgressPercent(completed, total)}%${currentLabel}`;
}

export function shouldRestoreResumeFocus(modalDismissed: boolean, hasTrigger: boolean) {
  return modalDismissed && hasTrigger;
}

export function canResumeCancelledHistoryEntry(kind: 'completed' | 'cancelled' | 'failed', isLatest: boolean, recoverableCount: number, undoAvailable: boolean) {
  return kind === 'cancelled' && isLatest && recoverableCount > 0 && undoAvailable;
}

export function recoveryHistoryStatusLabel(kind: 'completed' | 'cancelled' | 'failed', isLatestCancelled: boolean, undoAvailable: boolean) {
  return kind === 'cancelled' && isLatestCancelled && !undoAvailable ? DEFAULT_RECOVERY_HISTORY_LABELS.expiredCancelled : DEFAULT_RECOVERY_HISTORY_LABELS.status[kind];
}

export function recoveryHistoryStatusLabelForLocale(kind: 'completed' | 'cancelled' | 'failed', isLatestCancelled: boolean, undoAvailable: boolean, locale?: string, labelsByLocale: Record<string, RecoveryHistoryLabels> = RECOVERY_HISTORY_LABELS_BY_LOCALE) {
  const labels = recoveryHistoryLabelsForLocale(locale, labelsByLocale);
  return kind === 'cancelled' && isLatestCancelled && !undoAvailable ? labels.expiredCancelled : labels.status[kind];
}

export type RecoveryActionKey = 'continueRestoring' | 'restoreRemoved' | 'undoCleanup' | 'clearHistory' | 'showAllHistory' | 'cancelRestore' | 'restore';
export type RecoveryActionLabels = Record<RecoveryActionKey, string>;

const DEFAULT_RECOVERY_ACTION_LABELS: RecoveryActionLabels = {
  continueRestoring: 'Continue restoring',
  restoreRemoved: 'Restore removed',
  undoCleanup: 'Undo last cleanup',
  clearHistory: 'Clear recovery history',
  showAllHistory: 'Show all history',
  cancelRestore: 'Cancel restore',
  restore: 'Restore',
};

export const RECOVERY_ACTION_LABELS_BY_LOCALE: Record<string, RecoveryActionLabels> = {
  es: {
    continueRestoring: 'Continuar restaurando',
    restoreRemoved: 'Restaurar eliminados',
    undoCleanup: 'Deshacer última limpieza',
    clearHistory: 'Borrar historial de recuperación',
    showAllHistory: 'Mostrar todo el historial',
    cancelRestore: 'Cancelar restauración',
    restore: 'Restaurar',
  },
};

function recoveryActionLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, RecoveryActionLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_RECOVERY_ACTION_LABELS;
}

export function recoveryActionLabel(action: RecoveryActionKey, locale?: string, labelsByLocale: Record<string, RecoveryActionLabels> = RECOVERY_ACTION_LABELS_BY_LOCALE) {
  return recoveryActionLabelsForLocale(locale, labelsByLocale)[action];
}

export type RecoveryDialogLabels = {
  cancelRestoreTitle: string;
  cancelRestoreMessage: string;
  restoreRemovedTitle: string;
  restoreRemovedMessage: (count: number) => string;
  clearHistoryTitle: string;
  clearHistoryMessage: string;
  cancel: string;
};

const DEFAULT_RECOVERY_DIALOG_LABELS: RecoveryDialogLabels = {
  cancelRestoreTitle: 'Cancel restore?',
  cancelRestoreMessage: 'Documents already restored will stay in your library. The remaining documents will stay recoverable.',
  restoreRemovedTitle: 'Restore removed documents?',
  restoreRemovedMessage: count => `Restore ${count} document${count === 1 ? '' : 's'} to your library?`,
  clearHistoryTitle: 'Clear recovery history?',
  clearHistoryMessage: 'This removes status entries only. Your current library and recoverable documents remain unchanged.',
  cancel: 'Cancel',
};

export const RECOVERY_DIALOG_LABELS_BY_LOCALE: Record<string, RecoveryDialogLabels> = {
  es: {
    cancelRestoreTitle: '¿Cancelar la restauración?',
    cancelRestoreMessage: 'Los documentos ya restaurados permanecerán en tu biblioteca. Los documentos restantes seguirán siendo recuperables.',
    restoreRemovedTitle: '¿Restaurar documentos eliminados?',
    restoreRemovedMessage: count => `¿Restaurar ${count} documento${count === 1 ? '' : 's'} en tu biblioteca?`,
    clearHistoryTitle: '¿Borrar el historial de recuperación?',
    clearHistoryMessage: 'Solo se eliminarán las entradas de estado. Tu biblioteca actual y los documentos recuperables no cambiarán.',
    cancel: 'Cancelar',
  },
};

function recoveryDialogLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, RecoveryDialogLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_RECOVERY_DIALOG_LABELS;
}

export function recoveryDialogLabel<K extends keyof RecoveryDialogLabels>(key: K, locale?: string, labelsByLocale: Record<string, RecoveryDialogLabels> = RECOVERY_DIALOG_LABELS_BY_LOCALE) {
  return recoveryDialogLabelsForLocale(locale, labelsByLocale)[key];
}

export function recoveryRestoreDialogMessage(count: number, locale?: string, labelsByLocale: Record<string, RecoveryDialogLabels> = RECOVERY_DIALOG_LABELS_BY_LOCALE) {
  return recoveryDialogLabelsForLocale(locale, labelsByLocale).restoreRemovedMessage(count);
}

export type CleanupLabelKey = 'selectAll' | 'clearAll' | 'keep' | 'kept' | 'select' | 'selected' | 'deleteSelected' | 'noCandidates';
export type CleanupLabels = {
  actions: Record<CleanupLabelKey, string>;
  deleteSelected: (count: number) => string;
  selectionAccessibility: (state: 'keep' | 'select', title: string) => string;
  empty: string;
};

const DEFAULT_CLEANUP_LABELS: CleanupLabels = {
  actions: { selectAll: 'Select all', clearAll: 'Clear all', keep: 'Keep', kept: 'Kept', select: 'Select', selected: 'Selected', deleteSelected: 'Delete selected', noCandidates: 'No cleanup candidates found.' },
  deleteSelected: count => `Delete ${count} selected`,
  selectionAccessibility: (state, title) => `${state === 'keep' ? 'Keep' : 'Select'} ${title} for cleanup`,
  empty: 'No cleanup candidates found.',
};

export const CLEANUP_LABELS_BY_LOCALE: Record<string, CleanupLabels> = {
  es: {
    actions: { selectAll: 'Seleccionar todos', clearAll: 'Borrar selección', keep: 'Conservar', kept: 'Conservado', select: 'Seleccionar', selected: 'Seleccionado', deleteSelected: 'Eliminar seleccionados', noCandidates: 'No hay documentos candidatos para limpiar.' },
    deleteSelected: count => `Eliminar ${count} seleccionados`,
    selectionAccessibility: (state, title) => `${state === 'keep' ? 'Conservar' : 'Seleccionar'} ${title} para la limpieza`,
    empty: 'No hay documentos candidatos para limpiar.',
  },
};

function cleanupLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, CleanupLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_CLEANUP_LABELS;
}

export function cleanupLabel<K extends keyof CleanupLabels['actions']>(key: K, locale?: string, labelsByLocale: Record<string, CleanupLabels> = CLEANUP_LABELS_BY_LOCALE) {
  return cleanupLabelsForLocale(locale, labelsByLocale).actions[key];
}

export function cleanupDeleteSelectedLabel(count: number, locale?: string, labelsByLocale: Record<string, CleanupLabels> = CLEANUP_LABELS_BY_LOCALE) {
  return cleanupLabelsForLocale(locale, labelsByLocale).deleteSelected(count);
}

export function cleanupSelectionAccessibilityLabel(state: 'keep' | 'select', title: string, locale?: string, labelsByLocale: Record<string, CleanupLabels> = CLEANUP_LABELS_BY_LOCALE) {
  return cleanupLabelsForLocale(locale, labelsByLocale).selectionAccessibility(state, title);
}

export type CleanupOutcomeStatus = 'removed' | 'restored' | 'failed';
export type CleanupOutcomeLabels = {
  removed: string;
  restored: string;
  failed: string;
  retry: string;
  detailSeparator: string;
};

const DEFAULT_CLEANUP_OUTCOME_LABELS: CleanupOutcomeLabels = {
  removed: 'Removed',
  restored: 'Restored',
  failed: 'Could not remove',
  retry: 'Retry',
  detailSeparator: ' · ',
};

export const CLEANUP_OUTCOME_LABELS_BY_LOCALE: Record<string, CleanupOutcomeLabels> = {
  es: {
    removed: 'Eliminado',
    restored: 'Restaurado',
    failed: 'No se pudo eliminar',
    retry: 'Reintentar',
    detailSeparator: ' · ',
  },
};

function cleanupOutcomeLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, CleanupOutcomeLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_CLEANUP_OUTCOME_LABELS;
}

export function cleanupOutcomeLabel(status: CleanupOutcomeStatus, locale?: string, labelsByLocale: Record<string, CleanupOutcomeLabels> = CLEANUP_OUTCOME_LABELS_BY_LOCALE) {
  return cleanupOutcomeLabelsForLocale(locale, labelsByLocale)[status];
}

export function cleanupOutcomeActionLabel(locale?: string, labelsByLocale: Record<string, CleanupOutcomeLabels> = CLEANUP_OUTCOME_LABELS_BY_LOCALE) {
  return cleanupOutcomeLabelsForLocale(locale, labelsByLocale).retry;
}

export function cleanupOutcomeDetailSeparator(locale?: string, labelsByLocale: Record<string, CleanupOutcomeLabels> = CLEANUP_OUTCOME_LABELS_BY_LOCALE) {
  return cleanupOutcomeLabelsForLocale(locale, labelsByLocale).detailSeparator;
}

export function expiredRecoveryEventCount(entries: {kind: 'completed' | 'cancelled' | 'failed'}[], undoAvailable: boolean) {
  const cancelledIndexes = entries.reduce<number[]>((indexes, entry, index) => entry.kind === 'cancelled' ? [...indexes, index] : indexes, []);
  return cancelledIndexes.filter((index, position) => !undoAvailable || position > 0).length;
}

export function recoveryWindowCountdownLabel(seconds: number, available: boolean) {
  if (!available || seconds <= 0) return DEFAULT_RECOVERY_WINDOW_MESSAGE_LABELS.expired;
  return DEFAULT_RECOVERY_WINDOW_MESSAGE_LABELS.seconds(seconds);
}

export function recoveryWindowCountdownLabelForLocale(seconds: number, available: boolean, locale: string | undefined, labelsByLocale: Record<string, RecoveryWindowMessageLabels> = RECOVERY_WINDOW_MESSAGE_LABELS_BY_LOCALE) {
  const labels = recoveryWindowLabelsForLocale(locale, labelsByLocale);
  return !available || seconds <= 0 ? labels.expired : labels.seconds(seconds);
}

export type DocumentUiLabels = {
  reviewWorkspace: string; reviewScan: string; reviewSubtitle: string; localStorage: string; healthy: string; nearlyFull: string; usageElevated: string;
  noPages: string; addPhotoOrCamera: string; previous: string; next: string; photoPage: string; cameraPage: string; moveEarlier: string; moveLater: string; removePage: string; startOver: string; exportSavePdf: string; retryExport: string; diagnostics: string; exportPreparing: (count: number) => string; exportSuccess: string; exportCancelled: string;
  yourLibrary: string; documents: string; privateScans: string; synced: string; deleteDocumentTitle: string; removeFromDevice: (title: string) => string; searchDocuments: string; searchByName: string; clearDocumentSearch: string; allDocuments: string; resultSingular: string; resultPlural: string; favorites: string; newestFirst: string; oldestFirst: string; noMatches: string; libraryEmpty: string; tryDifferentName: string; captureDocument: string; clearSearch: string; undo: string; dismiss: string; delete: string; favorite: string; unfavorite: string; openDocument: (title: string) => string; pageSingular: string; pagePlural: string;
};

const DEFAULT_DOCUMENT_UI_LABELS: DocumentUiLabels = {
  reviewWorkspace: 'DOCUMENT WORKSPACE', reviewScan: 'Review scan', reviewSubtitle: 'Make each page look its best before export.', localStorage: 'Local storage', healthy: 'Healthy', nearlyFull: 'Nearly full', usageElevated: 'Usage elevated', noPages: 'No pages to review', addPhotoOrCamera: 'Add a photo or use the camera to begin.', previous: 'Previous', next: 'Next', photoPage: 'Photo page', cameraPage: 'Camera page', moveEarlier: 'Move earlier', moveLater: 'Move later', removePage: 'Remove page', startOver: 'Start over', exportSavePdf: 'Export & Save PDF', retryExport: 'Retry export', diagnostics: 'Diagnostics', exportPreparing: count => `Preparing ${count}-page PDF…`, exportSuccess: 'PDF exported and saved successfully.', exportCancelled: 'Export cancelled. Your pages are still available.',
  yourLibrary: 'YOUR LIBRARY', documents: 'Documents', privateScans: 'Private scans, organized on this device.', synced: 'synced', deleteDocumentTitle: 'Delete document?', removeFromDevice: title => `Remove “${title}” from this device?`, searchDocuments: 'Search documents', searchByName: 'Search by document name', clearDocumentSearch: 'Clear document search', allDocuments: 'All documents', resultSingular: 'result', resultPlural: 'results', favorites: '★ Favorites', newestFirst: 'Newest first', oldestFirst: 'Oldest first', noMatches: 'No matches found', libraryEmpty: 'Your library is empty', tryDifferentName: 'Try a different name or clear your search.', captureDocument: 'Capture a document from the Scan tab and it will appear here.', clearSearch: 'Clear search', undo: 'Undo', dismiss: 'Dismiss', delete: 'Delete', favorite: 'Favorite', unfavorite: 'Unfavorite', openDocument: title => `Open ${title}`, pageSingular: 'page', pagePlural: 'pages',
};

export const DOCUMENT_UI_LABELS_BY_LOCALE: Record<string, DocumentUiLabels> = {
  es: {
    ...DEFAULT_DOCUMENT_UI_LABELS,
    reviewWorkspace: 'ESPACIO DE DOCUMENTOS', reviewScan: 'Revisar escaneo', reviewSubtitle: 'Haz que cada página se vea mejor antes de exportar.', localStorage: 'Almacenamiento local', healthy: 'Correcto', nearlyFull: 'Casi lleno', usageElevated: 'Uso elevado', noPages: 'No hay páginas para revisar', addPhotoOrCamera: 'Añade una foto o usa la cámara para comenzar.', previous: 'Anterior', next: 'Siguiente', photoPage: 'Página de foto', cameraPage: 'Página de cámara', moveEarlier: 'Mover antes', moveLater: 'Mover después', removePage: 'Eliminar página', startOver: 'Empezar de nuevo', exportSavePdf: 'Exportar y guardar PDF', retryExport: 'Reintentar exportación', diagnostics: 'Diagnóstico', exportPreparing: count => `Preparando PDF de ${count} página${count === 1 ? '' : 's'}…`, exportSuccess: 'PDF exportado y guardado correctamente.', exportCancelled: 'Exportación cancelada. Tus páginas siguen disponibles.', yourLibrary: 'TU BIBLIOTECA', documents: 'Documentos', privateScans: 'Escaneos privados, organizados en este dispositivo.', synced: 'sincronizados', deleteDocumentTitle: '¿Eliminar documento?', removeFromDevice: title => `¿Eliminar “${title}” de este dispositivo?`, searchDocuments: 'Buscar documentos', searchByName: 'Buscar por nombre de documento', clearDocumentSearch: 'Borrar búsqueda de documentos', allDocuments: 'Todos los documentos', resultSingular: 'resultado', resultPlural: 'resultados', favorites: '★ Favoritos', newestFirst: 'Más recientes primero', oldestFirst: 'Más antiguos primero', noMatches: 'No se encontraron coincidencias', libraryEmpty: 'Tu biblioteca está vacía', tryDifferentName: 'Prueba con otro nombre o borra la búsqueda.', captureDocument: 'Captura un documento desde la pestaña Escanear y aparecerá aquí.', clearSearch: 'Borrar búsqueda', undo: 'Deshacer', dismiss: 'Cerrar', delete: 'Eliminar', favorite: 'Añadir a favoritos', unfavorite: 'Quitar de favoritos', openDocument: title => `Abrir ${title}`, pageSingular: 'página', pagePlural: 'páginas',
  },
  fr: {
    ...DEFAULT_DOCUMENT_UI_LABELS,
    reviewWorkspace: 'ESPACE DOCUMENTAIRE', reviewScan: 'Vérifier le scan', reviewSubtitle: 'Optimisez chaque page avant l’exportation.', localStorage: 'Stockage local', healthy: 'Sain', nearlyFull: 'Presque plein', usageElevated: 'Utilisation élevée', noPages: 'Aucune page à vérifier', addPhotoOrCamera: 'Ajoutez une photo ou utilisez l’appareil photo pour commencer.', previous: 'Précédente', next: 'Suivante', photoPage: 'Page photo', cameraPage: 'Page caméra', moveEarlier: 'Déplacer plus tôt', moveLater: 'Déplacer plus tard', removePage: 'Supprimer la page', startOver: 'Recommencer', exportSavePdf: 'Exporter et enregistrer le PDF', retryExport: 'Réessayer l’exportation', diagnostics: 'Diagnostics', exportPreparing: count => `Préparation d’un PDF de ${count} page${count === 1 ? '' : 's'}…`, exportSuccess: 'PDF exporté et enregistré avec succès.', exportCancelled: 'Exportation annulée. Vos pages sont toujours disponibles.', yourLibrary: 'VOTRE BIBLIOTHÈQUE', documents: 'Documents', privateScans: 'Scans privés, organisés sur cet appareil.', synced: 'synchronisés', deleteDocumentTitle: 'Supprimer le document ?', removeFromDevice: title => `Supprimer « ${title} » de cet appareil ?`, searchDocuments: 'Rechercher des documents', searchByName: 'Rechercher par nom de document', clearDocumentSearch: 'Effacer la recherche de documents', allDocuments: 'Tous les documents', resultSingular: 'résultat', resultPlural: 'résultats', favorites: '★ Favoris', newestFirst: 'Plus récents', oldestFirst: 'Plus anciens', noMatches: 'Aucun résultat', libraryEmpty: 'Votre bibliothèque est vide', tryDifferentName: 'Essayez un autre nom ou effacez votre recherche.', captureDocument: 'Capturez un document depuis l’onglet Scan pour le voir ici.', clearSearch: 'Effacer la recherche', undo: 'Annuler', dismiss: 'Fermer', delete: 'Supprimer', favorite: 'Ajouter aux favoris', unfavorite: 'Retirer des favoris', openDocument: title => `Ouvrir ${title}`, pageSingular: 'page', pagePlural: 'pages',
  },
  pt: {
    ...DEFAULT_DOCUMENT_UI_LABELS,
    reviewWorkspace: 'ESPAÇO DE DOCUMENTOS', reviewScan: 'Revisar digitalização', reviewSubtitle: 'Deixe cada página com a melhor aparência antes de exportar.', localStorage: 'Armazenamento local', healthy: 'Saudável', nearlyFull: 'Quase cheio', usageElevated: 'Uso elevado', noPages: 'Não há páginas para revisar', addPhotoOrCamera: 'Adicione uma foto ou use a câmera para começar.', previous: 'Anterior', next: 'Próxima', photoPage: 'Página de foto', cameraPage: 'Página da câmera', moveEarlier: 'Mover para antes', moveLater: 'Mover para depois', removePage: 'Remover página', startOver: 'Recomeçar', exportSavePdf: 'Exportar e salvar PDF', retryExport: 'Tentar exportar novamente', diagnostics: 'Diagnóstico', exportPreparing: count => `Preparando PDF de ${count} página${count === 1 ? '' : 's'}…`, exportSuccess: 'PDF exportado e salvo com sucesso.', exportCancelled: 'Exportação cancelada. Suas páginas continuam disponíveis.', yourLibrary: 'SUA BIBLIOTECA', documents: 'Documentos', privateScans: 'Digitalizações privadas, organizadas neste dispositivo.', synced: 'sincronizados', deleteDocumentTitle: 'Excluir documento?', removeFromDevice: title => `Remover “${title}” deste dispositivo?`, searchDocuments: 'Pesquisar documentos', searchByName: 'Pesquisar por nome do documento', clearDocumentSearch: 'Limpar pesquisa de documentos', allDocuments: 'Todos os documentos', resultSingular: 'resultado', resultPlural: 'resultados', favorites: '★ Favoritos', newestFirst: 'Mais recentes primeiro', oldestFirst: 'Mais antigos primeiro', noMatches: 'Nenhuma correspondência encontrada', libraryEmpty: 'Sua biblioteca está vazia', tryDifferentName: 'Tente outro nome ou limpe a pesquisa.', captureDocument: 'Capture um documento na aba Digitalizar e ele aparecerá aqui.', clearSearch: 'Limpar pesquisa', undo: 'Desfazer', dismiss: 'Fechar', delete: 'Excluir', favorite: 'Adicionar aos favoritos', unfavorite: 'Remover dos favoritos', openDocument: title => `Abrir ${title}`, pageSingular: 'página', pagePlural: 'páginas',
  },
};

export function documentUiLabelsForLocale(locale?: string, labelsByLocale: Record<string, DocumentUiLabels> = DOCUMENT_UI_LABELS_BY_LOCALE) {
  const normalized = locale?.trim().toLowerCase();
  const language = normalized?.split('-')[0];
  return (normalized ? labelsByLocale[normalized] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_DOCUMENT_UI_LABELS;
}

export function recoveryWindowCountdownPercent(seconds: number, totalSeconds: number, available: boolean) {
  if (!available || totalSeconds <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((seconds / totalSeconds) * 100)));
}

export function recoveryWindowCountdownTone(seconds: number, totalSeconds: number, available: boolean) {
  if (!available || seconds <= 0 || totalSeconds <= 0) return 'expired' as const;
  return seconds <= Math.max(2, Math.ceil(totalSeconds * 0.25)) ? 'warning' as const : 'active' as const;
}

export function recoveryWindowCountdownPresentation(reduceMotion: boolean) {
  return reduceMotion ? 'static' as const : 'standard' as const;
}

export function recoveryWindowCountdownAccessibilityLabel(label: string, tone: 'active' | 'warning' | 'expired', reduceMotion: boolean) {
  return `${label} · ${tone}${reduceMotion ? ' · reduced motion' : ''}`;
}

export function recoveryWindowMotionStatusLabel(reduceMotion: boolean) {
  return reduceMotion ? 'Reduced motion enabled · countdown is static' : '';
}

export function recoveryWindowStatusLabel(available: boolean, seconds: number) {
  return available && seconds > 0 ? 'Recovery window active · documents can be restored' : 'Recovery window expired · documents cannot be restored from this action';
}

export function recoveryWindowStatusTone(available: boolean, seconds: number) {
  return available && seconds > 0 ? 'active' as const : 'expired' as const;
}

export function recoveryWindowStatusPresentation(highContrast: boolean) {
  return highContrast ? 'high-contrast' as const : 'standard' as const;
}

export type RecoveryWindowCueLabels = { active: string; warning: string; expired: string };

const DEFAULT_RECOVERY_WINDOW_CUE_LABELS: RecoveryWindowCueLabels = {
  active: 'Ready to restore',
  warning: 'Restore window closing',
  expired: 'Restore window closed',
};

export const RECOVERY_WINDOW_CUE_LABELS_BY_LOCALE: Record<string, RecoveryWindowCueLabels> = {
  es: {
    active: 'Listo para restaurar',
    warning: 'La ventana de restauración se está cerrando',
    expired: 'La ventana de restauración se cerró',
  },
};

export function recoveryWindowCountdownStateCue(tone: 'active' | 'warning' | 'expired', labels: RecoveryWindowCueLabels = DEFAULT_RECOVERY_WINDOW_CUE_LABELS) {
  return labels[tone];
}

export function recoveryWindowCountdownStateCueForLocale(tone: 'active' | 'warning' | 'expired', locale: string | undefined, labelsByLocale: Record<string, RecoveryWindowCueLabels> = {}) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  const labels = (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_RECOVERY_WINDOW_CUE_LABELS;
  return recoveryWindowCountdownStateCue(tone, labels);
}
