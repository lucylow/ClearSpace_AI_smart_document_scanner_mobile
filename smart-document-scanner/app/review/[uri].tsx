import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '@/components/screen-container';
import { FilterBar } from '@/src/modules/scanner/components/FilterBar';
import { ImageProcessingService } from '@/src/core/services/ImageProcessingService';
import { ExportProgress, PDFExportService } from '@/src/core/services/PDFExportService';
import { ExportCancelledError } from '@/src/core/services/exportCancellation';
import { useScanStore } from '@/src/core/store/scanStore';
import { makeId } from '@/src/core/utils/id';
import { ScanFilter } from '@/src/core/types';
import { isDemoUri } from '@/src/core/services/UriService';
import { moveReviewPage } from '@/src/core/services/reviewPages';
import { ReviewCameraModal } from '@/src/modules/scanner/components/ReviewCameraModal';
import { DiagnosticsPanel, ExportProgressPanel, RecoveryToast } from '@/components/review-feedback';
import { RecoveryStatus } from '@/components/recovery-status';
import { asyncStorageAdapter } from '@/src/core/storage/StorageAdapter';
import { createScanPersistence } from '@/src/core/storage/scanPersistence';
import { summarizeStorage } from '@/src/core/services/storageQuota';
import { safeErrorMessage } from '@/src/core/errors/errorMessage';
import { documentUiLabelsForLocale, DOCUMENT_UI_LABELS_BY_LOCALE } from '@/src/core/storage/cleanupRecovery';
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { reviewFallbackCopy } from '@/src/core/i18n/localePreference';
import { abortActiveExport } from '@/src/core/services/exportLifecycle';
import { cleanupGeneratedExport } from '@/src/core/services/exportArtifactCleanup';
import { exportCleanupFailureGuidance } from '@/src/core/services/exportCleanupNotice';
import { exportRetryAccessibilityCopy } from '@/src/core/services/exportRetryAccessibility';

type ReviewPage = { source: string; preview: string; filter: ScanFilter };
const scanPersistence = createScanPersistence(asyncStorageAdapter);

export default function Review() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const { locale } = useAppLocale();
  const labels = documentUiLabelsForLocale(locale, DOCUMENT_UI_LABELS_BY_LOCALE);
  const fallback = reviewFallbackCopy(locale);
  const retryAccessibility = exportRetryAccessibilityCopy(locale);
  const source = useMemo(() => {
    if (!uri) return '';
    try { return decodeURIComponent(uri); } catch { return uri; }
  }, [uri]);
  const [pages, setPages] = useState<ReviewPage[]>(() => source ? [{ source, preview: source, filter: 'original' }] : []);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lastFailure, setLastFailure] = useState('');
  const [toast, setToast] = useState('');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [backupInfo, setBackupInfo] = useState<{ available: boolean; savedAt: number | null }>({ available: false, savedAt: null });
  const [progress, setProgress] = useState<ExportProgress>({ completed: 0, total: pages.length, stage: 'preparing' });
  const controllerRef = useRef<AbortController | null>(null);
  const add = useScanStore((state) => state.add);
  const scans = useScanStore((state) => state.scans);
  const storage = useMemo(() => summarizeStorage(scans), [scans]);
  const page = pages[selected];
  useEffect(() => { let mounted = true; void scanPersistence.getBackupInfo().then((info) => { if (mounted) setBackupInfo(info); }).catch(() => undefined); return () => { mounted = false; abortActiveExport(controllerRef.current); }; }, []);

  const diagnostics = useMemo(() => [
    'Document Scanner diagnostics',
    `${labels.pagePlural}: ${pages.length}`,
    `${labels.pageSingular}: ${pages.length ? selected + 1 : 0}`,
    `Export stage: ${progress.stage}`,
    `Export progress: ${progress.completed}/${progress.total}`,
    `Last failure: ${lastFailure || 'none'}`,
    'Sensitive receipt, transaction, file, and credential values are excluded.',
  ].join('\n'), [lastFailure, labels.pagePlural, labels.pageSingular, pages.length, progress, selected]);

  const copyDiagnostics = async () => {
    try {
      await Clipboard.setStringAsync(diagnostics);
      setToast(fallback.copySuccess);
    } catch (reason) {
      setToast(`Could not copy diagnostics. ${safeErrorMessage(reason, fallback.copyFallback)}`);
    }
  };

  const apply = async (filter: ScanFilter) => {
    if (!page || busy) return;
    setBusy(true); setError('');
    try {
      const next = await ImageProcessingService.filter(page.source, filter);
      if (!next) throw new Error('No preview was produced');
      setPages((current) => current.map((item, index) => index === selected ? { ...item, preview: next, filter } : item));
      setToast(labels.exportSuccess);
    } catch (reason) {
      const message = `This filter could not be applied. ${safeErrorMessage(reason, 'Retry or use the original image.')}`;
      setLastFailure(message); setError(message); setDiagnosticsOpen(true);
    } finally { setBusy(false); }
  };

  const addPage = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
      if (result.canceled) return;
      const next = result.assets[0]?.uri;
      if (!next) { setError(fallback.noReadableImage); return; }
      setPages((current) => [...current, { source: next, preview: next, filter: 'original' }]);
      setSelected(pages.length); setToast(labels.photoPage);
    } catch (reason) {
      const message = `Unable to add that image as a page. ${safeErrorMessage(reason, fallback.noReadableImage)}`;
      setLastFailure(message); setError(message); setDiagnosticsOpen(true);
    } finally { setBusy(false); }
  };

  const addCameraPage = (next: string) => {
    if (!next) { setError(fallback.cameraNoImage); return; }
    setPages((current) => [...current, { source: next, preview: next, filter: 'original' }]);
    setSelected(pages.length); setCameraOpen(false); setToast(labels.cameraPage);
  };

  const removePage = () => {
    if (pages.length <= 1) { setError(`${labels.noPages}. ${labels.startOver}.`); return; }
    setPages((current) => current.filter((_, index) => index !== selected));
    setSelected((index) => Math.max(0, Math.min(index, pages.length - 2))); setToast(labels.removePage);
  };

  const movePage = (to: number) => {
    if (to < 0 || to >= pages.length || busy) return;
    setPages((current) => moveReviewPage(current, selected, to)); setSelected(to); setToast(`${labels.pageSingular} order updated.`);
  };

  const exportPdf = async (isRetry = false) => {
    if (!pages.length || busy) return;
    if (storage.percent >= 95) { const message = fallback.storageFull(storage.label); setError(message); setLastFailure(message); setToast(fallback.exportPaused); return; }
    setToast(labels.exportPreparing(pages.length));
    setBusy(true); setError(''); setDiagnosticsOpen(false); if (isRetry) AccessibilityInfo.announceForAccessibility(retryAccessibility.started);
    const controller = new AbortController(); controllerRef.current = controller;
    setProgress({ completed: 0, total: pages.length, stage: 'preparing' });
    try {
      const pdf = await PDFExportService.generatePDF(pages.map((item) => item.preview), `scan_${Date.now()}`, { signal: controller.signal, onProgress: setProgress });
      if (!pdf) throw new Error(fallback.noPdf);
      const now = Date.now();
      const scanId = makeId('scan');
      try {
        await add({ id: scanId, title: `Scan ${new Date(now).toLocaleDateString()}`, createdAt: now, updatedAt: now, thumbnailUri: pages[0].preview, isSynced: false, pages: pages.map((item) => ({ id: makeId('page'), originalUri: item.source, processedUri: item.preview, filter: item.filter, width: 1080, height: 1440, createdAt: now })), pdfUri: pdf });
      } catch (persistenceError) {
        const cleanupSucceeded = await cleanupGeneratedExport(pdf);
        if (!cleanupSucceeded && pdf.startsWith('file://')) {
          throw new Error(`${safeErrorMessage(persistenceError, fallback.exportFailed)} ${exportCleanupFailureGuidance(locale)}`);
        }
        throw persistenceError;
      }
      setToast(labels.exportSuccess); if (isRetry) AccessibilityInfo.announceForAccessibility(retryAccessibility.succeeded);
      router.replace({ pathname: '/document/[id]', params: { id: scanId, from: 'export' } } as any);
    } catch (reason) {
      if (reason instanceof ExportCancelledError) { setToast(labels.exportCancelled); return; }
      const message = `${fallback.exportFailed} ${safeErrorMessage(reason, fallback.exportFailed)}`;
      setLastFailure(message); setError(message); setProgress((current) => ({ ...current, stage: 'failed' })); setDiagnosticsOpen(true); if (isRetry) AccessibilityInfo.announceForAccessibility(retryAccessibility.failed);
    } finally { controllerRef.current = null; setBusy(false); }
  };

  const cancelExport = () => { abortActiveExport(controllerRef.current); };

  return <>
    <RecoveryToast message={toast} onDismiss={() => setToast('')} />
    <ReviewCameraModal visible={cameraOpen} onClose={() => setCameraOpen(false)} onCaptured={addCameraPage} />
    <ScreenContainer className="p-4">
      <View style={styles.headerRow}><View><Text style={styles.eyebrow}>{labels.reviewWorkspace}</Text><Text style={styles.title}>{labels.reviewScan}</Text><Text style={styles.sub}>{labels.reviewSubtitle}</Text></View><View style={styles.pagePill}><Text style={styles.pagePillText}>{pages.length} {pages.length === 1 ? labels.pageSingular : labels.pagePlural}</Text></View></View>
      <RecoveryStatus available={backupInfo.available} savedAt={backupInfo.savedAt} />
      <Text style={styles.storageHint}>{labels.localStorage}: {storage.label} · {storage.percent >= 90 ? labels.nearlyFull : storage.percent >= 75 ? labels.usageElevated : labels.healthy}</Text>
      {busy || progress.stage === 'failed' || progress.stage === 'cancelled' ? <ExportProgressPanel {...progress} onCancel={busy ? cancelExport : undefined} onRetry={!busy && progress.stage !== 'complete' ? exportPdf : undefined} /> : null}
      {diagnosticsOpen ? <DiagnosticsPanel summary={diagnostics} onCopy={() => void copyDiagnostics()} onClose={() => setDiagnosticsOpen(false)} /> : null}
      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><View style={styles.errorActions}><Button compact mode="text" onPress={() => setError('')}>Dismiss</Button><Button compact mode="text" onPress={() => setDiagnosticsOpen(true)}>{labels.diagnostics}</Button>{progress.stage === 'failed' && !busy ? <Button compact mode="contained" disabled={busy} accessibilityRole="button" accessibilityState={{ busy }} accessibilityLabel={labels.retryExport} onPress={() => void exportPdf(true)}>{labels.retryExport}</Button> : null}</View></View> : null}
      {page ? <View style={styles.previewCard}><View style={styles.previewBadge}><Text style={styles.previewBadgeText}>PAGE {selected + 1}</Text></View><Image source={{ uri: page.preview }} style={styles.image} resizeMode="contain" /></View> : <View style={styles.empty}><Text style={styles.emptyTitle}>{labels.noPages}</Text><Text style={styles.emptyText}>{labels.addPhotoOrCamera}</Text></View>}
      <View style={styles.pageControls}><Pressable accessibilityRole="button" accessibilityLabel={labels.previous} disabled={selected === 0 || busy} onPress={() => setSelected((index) => Math.max(0, index - 1))}><Text style={[styles.control, (selected === 0 || busy) && styles.disabled]}>{labels.previous}</Text></Pressable><Text style={styles.counter}>{pages.length ? `${selected + 1} / ${pages.length}` : '0 / 0'}</Text><Pressable accessibilityRole="button" accessibilityLabel={labels.next} disabled={selected === pages.length - 1 || busy} onPress={() => setSelected((index) => Math.min(pages.length - 1, index + 1))}><Text style={[styles.control, (selected === pages.length - 1 || busy) && styles.disabled]}>{labels.next}</Text></Pressable></View>
      <View style={styles.utilityRow}><Button mode="outlined" onPress={() => void addPage()} disabled={busy}>{labels.photoPage}</Button><Button mode="outlined" onPress={() => setCameraOpen(true)} disabled={busy}>{labels.cameraPage}</Button><Button mode="outlined" onPress={() => movePage(selected - 1)} disabled={selected === 0 || busy}>{labels.moveEarlier}</Button><Button mode="outlined" onPress={() => movePage(selected + 1)} disabled={selected === pages.length - 1 || busy}>{labels.moveLater}</Button><Button mode="outlined" onPress={removePage} disabled={pages.length <= 1 || busy}>{labels.removePage}</Button></View>
      {page ? <FilterBar value={page.filter} onChange={(filter) => void apply(filter)} /> : null}
      <View style={styles.actions}><Button mode="outlined" onPress={() => router.back()} disabled={busy}>{labels.startOver}</Button><Button mode="contained" loading={busy} disabled={busy || !pages.length || Boolean(isDemoUri(pages[0].source) && !pages[0].preview)} onPress={() => void exportPdf()}>{labels.exportSavePdf}</Button></View>
    </ScreenContainer>
  </>;
}

const styles = StyleSheet.create({ headerRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10},storageHint:{fontSize:12,color:'#667085',marginBottom:8}, eyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1.4,color:'#667085'}, title:{fontSize:28,fontWeight:'900',color:'#122033',marginTop:4}, sub:{color:'#667085',lineHeight:20,marginTop:4}, pagePill:{backgroundColor:'#EEF2FF',borderRadius:99,paddingHorizontal:11,paddingVertical:8}, pagePillText:{color:'#4338CA',fontSize:12,fontWeight:'900'}, previewCard:{borderRadius:20,padding:8,backgroundColor:'#FFF',borderWidth:1,borderColor:'#EAECF0',boxShadow:'0 4px 10px rgba(16,24,40,0.06)'},previewBadge:{position:'absolute',top:16,left:16,zIndex:2,backgroundColor:'#122033CC',borderRadius:99,paddingHorizontal:9,paddingVertical:5},previewBadgeText:{color:'#FFF',fontSize:10,fontWeight:'900',letterSpacing:1},image:{height:360,width:'100%',borderRadius:15,backgroundColor:'#F2F4F7'},empty:{height:360,alignItems:'center',justifyContent:'center',backgroundColor:'#F2F4F7',borderRadius:18},emptyTitle:{fontSize:18,fontWeight:'900',color:'#122033'},emptyText:{color:'#667085',marginTop:6},pageControls:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:8},control:{color:'#4F46E5',fontWeight:'900'},disabled:{color:'#B8C2D9'},counter:{color:'#667085',fontWeight:'800'},utilityRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:10},actions:{flexDirection:'row',justifyContent:'space-between',gap:8,marginTop:16},errorBox:{backgroundColor:'#FFF1F2',borderWidth:1,borderColor:'#FECDD3',borderRadius:14,padding:10,marginBottom:10},errorText:{color:'#9F1239',lineHeight:19},errorActions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:4,marginTop:4}});
