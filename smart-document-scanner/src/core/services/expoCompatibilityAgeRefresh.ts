export const EXPO_COMPATIBILITY_AGE_REFRESH_INTERVAL_MS = 60_000;

export function shouldRefreshExpoCompatibilityAge(input: { checkedAt: number | null; now: number; appIsActive: boolean }): boolean {
  return input.appIsActive && input.checkedAt !== null && Number.isFinite(input.checkedAt) && input.checkedAt >= 0 && Number.isFinite(input.now) && input.now >= 0;
}
