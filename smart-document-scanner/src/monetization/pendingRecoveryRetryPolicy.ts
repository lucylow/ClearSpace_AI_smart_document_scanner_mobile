export const MAX_PENDING_RECOVERY_ATTEMPTS = 3;

export function pendingRecoveryRetryState(attempts: number): { canRetry: boolean; showEscalation: boolean } {
  const safeAttempts = Number.isFinite(attempts) ? Math.max(0, Math.floor(attempts)) : 0;
  return { canRetry: safeAttempts < MAX_PENDING_RECOVERY_ATTEMPTS, showEscalation: safeAttempts >= MAX_PENDING_RECOVERY_ATTEMPTS };
}
