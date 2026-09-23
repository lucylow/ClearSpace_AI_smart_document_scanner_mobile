import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import { ScreenContainer } from '@/components/screen-container';
import { createFrameThrottle } from '@/src/modules/scanner/camera/frameThrottle';
import { shouldAutoCapture } from '@/src/modules/scanner/capture/capturePolicy';
import { brightnessHint } from '@/src/modules/scanner/brightness';
import { securityLabel, PAYWALL_LABELS_BY_LOCALE } from '@/src/core/storage/cleanupRecovery';

export default function AdvancedScanScreen() {
  const [captured, setCaptured] = useState(false);
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const label = (kind: Parameters<typeof securityLabel>[0]) =>
    securityLabel(kind, locale, PAYWALL_LABELS_BY_LOCALE) as string;
  const throttle = useMemo(() => createFrameThrottle(66), []);
  const good = shouldAutoCapture({ stableMs: 620, edgeConfidence: 0.93, blurScore: 0.84 });
  const hint = brightnessHint(0.52);
  const sampleFrame = () => {
    if (throttle() && good) setCaptured(true);
  };

  return (
    <ScreenContainer className="p-6">
      <View style={styles.root}>
        <Text style={styles.title}>{label('advancedScanner')}</Text>
        <Text style={styles.sub}>{label('advancedScannerDescription')}</Text>
        <View style={styles.card}>
          <Text style={styles.metric}>{label('lighting')}</Text>
          <Text style={styles.value}>{hint}</Text>
          <Text style={styles.metric}>{label('edgeConfidence')}</Text>
          <Text style={styles.value}>93%</Text>
          <Text style={styles.metric}>{label('stability')}</Text>
          <Text style={styles.value}>{label('goodQuality')}</Text>
        </View>
        <Button mode="contained" onPress={sampleFrame}>
          {label('evaluateFrame')}
        </Button>
        {captured ? <Text style={styles.success}>{label('captureAccepted')}</Text> : null}
        <Button onPress={() => router.back()}>{label('backToScan')}</Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', gap: 16 },
  title: { fontSize: 30, fontWeight: '800', color: '#122033' },
  sub: { color: '#667085', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E4EAF2', gap: 5 },
  metric: { fontSize: 13, color: '#667085' },
  value: { fontSize: 18, fontWeight: '800', color: '#4F46E5', marginBottom: 8 },
  success: { color: '#13B981', fontWeight: '700', textAlign: 'center' },
});

