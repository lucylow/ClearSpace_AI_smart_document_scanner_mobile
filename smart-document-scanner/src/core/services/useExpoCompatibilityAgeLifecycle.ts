import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, type AppStateStatus } from 'react-native';

import { shouldRefreshExpoCompatibilityAge } from './expoCompatibilityAgeRefresh';
import { expoCompatibilityAgeThresholdAnnouncement } from './expoCompatibilityAgeAnnouncement';

export interface ExpoCompatibilityAgeLifecycleOptions {
  checkedAt: number | null;
  locale: string;
  now?: () => number;
  intervalMs: number;
}

export function useExpoCompatibilityAgeLifecycle({ checkedAt, locale, now = Date.now, intervalMs }: ExpoCompatibilityAgeLifecycleOptions) {
  const [appIsActive, setAppIsActive] = useState(AppState.currentState === 'active');
  const [ageNow, setAgeNow] = useState(now);
  const [announcement, setAnnouncement] = useState('');
  const previousNowRef = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const active = nextState === 'active';
      setAppIsActive(active);
      if (active) setAgeNow(now());
    });
    return () => subscription.remove();
  }, [now]);

  useEffect(() => {
    if (!shouldRefreshExpoCompatibilityAge({ checkedAt, now: now(), appIsActive })) return;

    const refresh = () => {
      const current = now();
      const previous = previousNowRef.current;
      if (previous !== null && checkedAt !== null) {
        const nextAnnouncement = expoCompatibilityAgeThresholdAnnouncement(previous, current, checkedAt, locale);
        if (nextAnnouncement) setAnnouncement(nextAnnouncement);
      }
      previousNowRef.current = current;
      setAgeNow(current);
    };

    refresh();
    const timer = setInterval(refresh, intervalMs);
    return () => clearInterval(timer);
  }, [appIsActive, checkedAt, intervalMs, locale, now]);

  useEffect(() => {
    if (!announcement) return;
    AccessibilityInfo.announceForAccessibility?.(announcement);
  }, [announcement]);

  return { appIsActive, ageNow, announcement };
}
