import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { reviewFeedbackCopy } from '@/src/core/i18n/localePreference';

export function RecoveryToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { locale } = useAppLocale();
  const copy = useMemo(() => reviewFeedbackCopy(locale), [locale]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3600);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);
  if (!message) return null;
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={copy.dismiss} onPress={onDismiss} hitSlop={10}><Text style={styles.dismiss}>{copy.dismiss}</Text></Pressable>
    </View>
  );
}

export function ExportProgressPanel({ completed, total, stage, onCancel, onRetry }: { completed: number; total: number; stage: string; onCancel?: () => void; onRetry?: () => void }) {
  const { locale } = useAppLocale();
  const copy = useMemo(() => reviewFeedbackCopy(locale), [locale]);
  const ratio = total > 0 ? Math.max(0, Math.min(1, completed / total)) : 0;
  const terminal = stage === 'failed' || stage === 'cancelled';
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.panelTitle}>{stage === 'cancelled' ? copy.cancelled : stage === 'failed' ? copy.failed : copy.preparing}</Text>
      <Text accessibilityLiveRegion="polite" style={styles.panelSub}>{terminal ? copy.available : copy.processed(completed, total)}</Text>
      <View style={styles.track}><View style={[styles.fill, { width: `${ratio * 100}%` }]} /></View>
      {!terminal && onCancel ? <Pressable accessibilityRole="button" accessibilityLabel={copy.cancel} onPress={onCancel} style={styles.secondary}><Text style={styles.secondaryText}>{copy.cancel}</Text></Pressable> : null}
      {terminal && onRetry ? <Pressable accessibilityRole="button" accessibilityLabel={copy.retry} onPress={onRetry} style={styles.primary}><Text style={styles.primaryText}>{copy.retry}</Text></Pressable> : null}
    </View>
  );
}

export function DiagnosticsPanel({ summary, onCopy, onClose }: { summary: string; onCopy: () => void; onClose: () => void }) {
  const { locale } = useAppLocale();
  const copy = useMemo(() => reviewFeedbackCopy(locale), [locale]);
  return (
    <View style={styles.diagnostics}>
      <View style={styles.diagnosticsHeader}><Text accessibilityRole="header" style={styles.panelTitle}>{copy.diagnostics}</Text><Pressable accessibilityRole="button" accessibilityLabel={copy.close} onPress={onClose}><Text style={styles.dismiss}>{copy.close}</Text></Pressable></View>
      <Text selectable style={styles.diagnosticsText}>{summary}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={copy.copyDiagnostics} onPress={onCopy} style={styles.secondary}><Text style={styles.secondaryText}>{copy.copyDiagnostics}</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { position: 'absolute', top: 8, left: 16, right: 16, zIndex: 10, padding: 12, borderRadius: 12, backgroundColor: '#166534', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  toastText: { flex: 1, color: '#FFF', fontWeight: '700' },
  dismiss: { color: '#4F46E5', fontWeight: '800' },
  panel: { padding: 14, borderRadius: 14, backgroundColor: '#EEF2FF', marginBottom: 12 },
  panelTitle: { color: '#122033', fontWeight: '800', fontSize: 16 },
  panelSub: { color: '#667085', marginTop: 4 },
  track: { height: 8, borderRadius: 8, backgroundColor: '#D0D5DD', overflow: 'hidden', marginVertical: 12 },
  fill: { height: '100%', borderRadius: 8, backgroundColor: '#4F46E5' },
  primary: { padding: 10, borderRadius: 10, backgroundColor: '#4F46E5', alignItems: 'center' },
  primaryText: { color: '#FFF', fontWeight: '800' },
  secondary: { padding: 10, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', marginTop: 8 },
  secondaryText: { color: '#344054', fontWeight: '800' },
  diagnostics: { padding: 14, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', marginBottom: 12 },
  diagnosticsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  diagnosticsText: { color: '#475467', fontFamily: 'monospace', fontSize: 12, lineHeight: 18, marginVertical: 10 },
});
