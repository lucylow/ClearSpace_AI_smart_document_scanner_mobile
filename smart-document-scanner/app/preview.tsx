import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import { ScreenContainer } from '@/components/screen-container';
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { previewCopy } from '@/src/core/i18n/localePreference';
import { useScanStore } from '@/src/core/store/scanStore';
import { PDFExportService } from '@/src/core/services/PDFExportService';

export default function Preview() {
  const { locale } = useAppLocale();
  const copy = useMemo(() => previewCopy(locale), [locale]);
  const scan = useScanStore((state) => state.activeScan);
  if (!scan) {
    return <ScreenContainer className="p-6"><View style={styles.center}><Text accessibilityRole="header" style={styles.title}>{copy.noDocument}</Text><Button accessibilityLabel={copy.startScan} mode="contained" onPress={() => router.replace('/')}>{copy.startScan}</Button></View></ScreenContainer>;
  }
  return <ScreenContainer className="p-6"><View style={styles.center}><Text accessibilityLabel={copy.ready} style={styles.check}>✓</Text><Text accessibilityRole="header" style={styles.title}>{copy.ready}</Text><Text style={styles.sub}>{scan.title} · {copy.page(scan.pages.length)}</Text><Button accessibilityLabel={copy.share} mode="contained" onPress={() => scan.pdfUri && PDFExportService.sharePDF(scan.pdfUri)} disabled={!scan.pdfUri}>{copy.share}</Button><Button accessibilityLabel={copy.newScan} onPress={() => router.replace('/')}>{copy.newScan}</Button></View></ScreenContainer>;
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, check: { fontSize: 64, color: '#13B981', fontWeight: '800' }, title: { fontSize: 26, fontWeight: '800', color: '#122033' }, sub: { color: '#667085', marginBottom: 12 } });
