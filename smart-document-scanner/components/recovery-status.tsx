import { useEffect, useMemo, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { getRecoveryStatusPresentation } from '@/src/core/services/recoveryStatusPresentation';
import { getRecoveryStatusAccessibility } from '@/src/core/services/recoveryStatusAccessibility';
import { RECOVERY_AGE_REFRESH_INTERVAL_MS, shouldRefreshRecoveryAge, type RecoveryAgeDisplay } from '@/src/core/services/recoveryAgePreference';

export function RecoveryStatus({ available, savedAt, display = 'relative', onRestore, onDelete, onRefresh, now }: { available: boolean; savedAt: number | null; display?: RecoveryAgeDisplay; onRestore?: () => void; onDelete?: () => void; onRefresh?: () => void; now?: number }) {
  const { locale } = useAppLocale();
  const [liveNow, setLiveNow] = useState(now ?? Date.now());
  const [appIsActive, setAppIsActive] = useState(AppState.currentState === 'active' || AppState.currentState === null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const active = nextState === 'active';
      setAppIsActive(active);
      if (active && now === undefined) setLiveNow(Date.now());
    });
    return () => subscription.remove();
  }, [now]);
  useEffect(() => {
    const initialNow = now ?? Date.now();
    setLiveNow(initialNow);
    if (!shouldRefreshRecoveryAge(display, savedAt, appIsActive)) return;
    const timer = setInterval(() => setLiveNow(Date.now()), RECOVERY_AGE_REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [appIsActive, display, now, savedAt]);
  const currentTime = now ?? liveNow;
  const presentation = useMemo(() => getRecoveryStatusPresentation(locale, available, savedAt, currentTime), [available, currentTime, locale, savedAt]);
  const savedLabel = getRecoveryStatusAccessibility(locale, savedAt, currentTime, display).savedLabel;
  return <View style={styles.card} accessibilityLabel={presentation.cardLabel}>
    <View style={styles.copy}>
      <Text accessibilityRole="header" style={styles.title}>{presentation.title}</Text>
      <Text accessibilityLiveRegion="polite" accessibilityLabel={savedLabel} style={styles.meta}>{savedLabel}</Text>
      {presentation.staleWarning ? <Text style={styles.warning}>{presentation.staleWarning}</Text> : null}
    </View>
    {available || onRefresh ? <View style={styles.actions}>{available && onRestore ? <Button compact mode="outlined" onPress={onRestore} accessibilityLabel={presentation.restoreLabel}>{presentation.restoreLabel}</Button> : null}{available && onDelete ? <Button compact mode="text" textColor="#B42318" onPress={onDelete} accessibilityLabel={presentation.deleteLabel}>{presentation.deleteLabel}</Button> : null}{onRefresh ? <Button compact mode="text" onPress={onRefresh} accessibilityLabel={presentation.refreshLabel}>{presentation.refreshLabel}</Button> : null}</View> : null}
  </View>;
}

const styles = StyleSheet.create({ card: { gap: 8, padding: 12, marginTop: 10, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E0E7FF' }, copy: { gap: 3 }, title: { color: '#312E81', fontSize: 13, fontWeight: '900' }, meta: { color: '#667085', fontSize: 12 }, warning: { color: '#B54708', fontSize: 11, lineHeight: 16 }, actions: { flexDirection: 'row', gap: 8 } });
