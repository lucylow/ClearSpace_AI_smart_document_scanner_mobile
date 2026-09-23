import { describe, expect, it } from 'vitest';
import { EXPO_COMPATIBILITY_AGE_REFRESH_INTERVAL_MS, shouldRefreshExpoCompatibilityAge } from '../src/core/services/expoCompatibilityAgeRefresh';

describe('Expo compatibility age refresh policy', () => {
  it('refreshes only with a valid timestamp while the app is active', () => {
    expect(shouldRefreshExpoCompatibilityAge({ checkedAt: 100, now: 200, appIsActive: true })).toBe(true);
    expect(shouldRefreshExpoCompatibilityAge({ checkedAt: 100, now: 200, appIsActive: false })).toBe(false);
    expect(shouldRefreshExpoCompatibilityAge({ checkedAt: null, now: 200, appIsActive: true })).toBe(false);
    expect(shouldRefreshExpoCompatibilityAge({ checkedAt: -1, now: 200, appIsActive: true })).toBe(false);
  });

  it('uses a bounded one-minute refresh interval', () => {
    expect(EXPO_COMPATIBILITY_AGE_REFRESH_INTERVAL_MS).toBe(60_000);
  });
});
