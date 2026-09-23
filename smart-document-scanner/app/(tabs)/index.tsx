import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '@/components/screen-container';
import { EdgeOverlay } from '@/src/modules/scanner/components/EdgeOverlay';
import { ShutterButton } from '@/src/modules/scanner/components/ShutterButton';
import { CreditCounter } from '@/src/modules/scanner/components/CreditCounter';
import { useDocumentDetector } from '@/src/modules/scanner/hooks/useDocumentDetector';
import { useUserStore } from '@/src/core/store/userStore';
import { safeErrorMessage } from '@/src/core/errors/errorMessage';
import { useScanStore } from '@/src/core/store/scanStore';
import { formatBytes, summarizeStorage } from '@/src/core/services/storageQuota';
import { selectCleanupCandidates } from '@/src/core/services/cleanupCandidates';
import { recentScanAccessibilityLabel, scannerQualityMessage, scannerStorageWarning, securityLabel, PAYWALL_LABELS_BY_LOCALE } from '@/src/core/storage/cleanupRecovery';
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { announceBeforeNavigation } from '@/src/modules/scanner/services/captureAnnouncement';

export default function ScanScreen() {
  const cameraRef = useRef<CameraView>(null);
  const { locale } = useAppLocale();
  const label = useCallback((kind: Parameters<typeof securityLabel>[0]) => securityLabel(kind, locale, PAYWALL_LABELS_BY_LOCALE) as string, [locale]);
  const [permission, requestPermission] = useCameraPermissions();
  const { edges, detect, quality } = useDocumentDetector();
  const consume = useUserStore((state) => state.consumeCredit);
  const scans = useScanStore((state) => state.scans);
  const recentScans = [...scans].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 2);
  const storage = summarizeStorage(scans);
  const cleanupCandidates = selectCleanupCandidates(scans);
  const cleanupBytes = summarizeStorage(cleanupCandidates).usedBytes;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [captureNotice, setCaptureNotice] = useState('');
  const [facing] = useState<'back' | 'front'>('back');

  useEffect(() => {
    if (Platform.OS !== 'web' && permission && !permission.granted) {
      void requestPermission().catch((reason) => setError(`${label('cameraPermissionError')} ${safeErrorMessage(reason, label('tryAgain'))}`));
    }
  }, [label, permission, requestPermission]);

  const navigateSafely = useCallback((path: string) => { try { router.push(path as any); } catch (reason) { setError(`${label('captureFailed')} ${safeErrorMessage(reason, label('tryAgain'))}`); } }, [label]);
  const openSettings = useCallback(() => navigateSafely('/(tabs)/settings'), [navigateSafely]);
  const openDocument = useCallback((id: string) => { try { router.push({ pathname: '/document/[id]', params: { id } } as any); } catch (reason) { setError(`${label('captureFailed')} ${safeErrorMessage(reason, label('tryAgain'))}`); } }, [label]);

  const openReview = useCallback(async (uri: string) => {
    if (!uri || busy) return;
    if (!consume()) {
      openSettings();
      return;
    }
    setError('');
    setBusy(true);
    try {
      const detected = await detect(uri);
      if (!detected) {
        setError(label('edgeNotFound'));
        return;
      }
      await announceBeforeNavigation({
        announce: () => setCaptureNotice(label('captureAccepted')),
        navigate: () => router.push({ pathname: '/review/[uri]', params: { uri: encodeURIComponent(uri) } } as any),
      });
    } catch (reason) {
      setError(`${label('captureFailed')} ${safeErrorMessage(reason, label('tryAgain'))}`);
    } finally {
      setBusy(false);
    }
  }, [busy, consume, detect, label, openSettings]);

  const capture = useCallback(async () => {
    if (busy) return;
    if (storage.percent >= 95) { setError(`${label('storageNearlyFull')} (${storage.label}). Remove an older document in Settings before capturing another page.`); return; }
    try {
      if (Platform.OS === 'web') {
        await openReview(`demo://scan-${Date.now()}`);
        return;
      }
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.9, skipProcessing: false });
      if (photo?.uri) await openReview(photo.uri);
      else setError(label('noPhoto'));
    } catch (reason) {
      setError(`${label('captureFailed')} ${safeErrorMessage(reason, label('tryAgain'))}`);
    }
  }, [busy, label, openReview, storage.label, storage.percent]);

  const pickFromLibrary = useCallback(async () => {
    if (busy) return;
    if (storage.percent >= 95) { setError(`${label('storageNearlyFull')} (${storage.label}). Remove an older document in Settings before importing another page.`); return; }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
      if (result.canceled) return;
      const uri = result.assets[0]?.uri;
      if (uri) await openReview(uri);
      else setError(label('photoReadFailed'));
    } catch (reason) {
      setError(`${label('photoImportFailed')} ${safeErrorMessage(reason, label('photoPermissionHint'))}`);
    }
  }, [busy, label, openReview, storage.label, storage.percent]);

  if (Platform.OS !== 'web' && !permission) return <ScreenContainer edges={['top', 'bottom', 'left', 'right']} containerClassName="bg-black"><View style={styles.center}><Text style={styles.permissionTitle}>{label('preparingCamera')}</Text><Text style={styles.permissionText}>{label('cameraReadyMessage')}</Text></View></ScreenContainer>;
  if (Platform.OS !== 'web' && permission && !permission.granted) return <ScreenContainer className="p-6"><View style={styles.center}><View style={styles.permissionIcon}><Text style={styles.permissionIconText}>⌕</Text></View><Text style={styles.permissionTitle}>{label('cameraAccessNeeded')}</Text><Text style={styles.permissionText}>{label('cameraAccessDescription')}</Text><Pressable accessibilityRole="button" accessibilityLabel={label('allowCamera')} style={styles.permissionButton} onPress={() => void requestPermission().catch((reason) => setError(`${label('cameraPermissionError')} ${safeErrorMessage(reason, label('tryAgain'))}`))}><Text style={styles.permissionButtonText}>{label('allowCamera')}</Text></Pressable>{error ? <Text style={styles.permissionError}>{error}</Text> : null}</View></ScreenContainer>;

  return <ScreenContainer edges={['top', 'bottom', 'left', 'right']} containerClassName="bg-black"><View style={styles.root}>{Platform.OS !== 'web' ? <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mute /> : <View style={styles.webPreview}><View style={styles.webBadge}><Text style={styles.webBadgeText}>{label('webDemoMode')}</Text></View><Text style={styles.cameraLabel}>Document scanner</Text><Text style={styles.cameraSub}>{label('cameraPreviewSimulated')}</Text></View>}<View style={styles.scrimTop} /><View style={styles.overlay}><View style={styles.top}>{captureNotice ? <Text accessibilityLiveRegion="polite" style={styles.captureNotice}>{captureNotice}</Text> : null}{error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><Pressable accessibilityRole="button" onPress={() => setError('')}><Text style={styles.dismiss}>{label('dismiss')}</Text></Pressable>{storage.percent >= 95 ? <Pressable accessibilityRole="button" accessibilityLabel={label('openStorageCleanup')} onPress={openSettings}><Text style={styles.dismiss}>{label('openStorageCleanup')}</Text></Pressable> : null}</View> : null}<View style={styles.scanState}><View style={styles.scanDot} /><Text style={styles.scanStateText}>{quality.confidence > 0.65 ? label('documentDetected') : label('readyToScan')}</Text><Text style={styles.scanStateValue}>{Math.round(quality.confidence * 100)}%</Text></View><CreditCounter/><View style={styles.guidance}><Text style={styles.hint}>{label('alignDocument')}</Text><Text accessibilityLiveRegion="polite" style={styles.sub}>{scannerQualityMessage(quality.message, locale)}</Text>{storage.percent >= 75 ? <><Text accessibilityLiveRegion="polite" style={styles.storageWarning}>{scannerStorageWarning(storage.percent >= 90 ? 'nearlyFull' : 'usageElevated', storage.label, cleanupCandidates.length, formatBytes(cleanupBytes), locale)}</Text><Pressable accessibilityRole="button" accessibilityLabel={label('reviewCleanup')} onPress={openSettings}><Text style={styles.storageAction}>{label('reviewCleanup')}</Text></Pressable></> : null}</View></View><EdgeOverlay points={edges} /><View style={styles.bottom}><View style={styles.bottomPanel}><View style={styles.actionTray}><Pressable accessibilityRole="button" accessibilityLabel={label('importPhoto')} onPress={() => void pickFromLibrary()} style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}><Text style={styles.secondaryText}>{label('importPhoto')}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={label('advancedScan')} onPress={() => navigateSafely('/advanced-scan')} style={({ pressed }) => [styles.advancedAction, pressed && styles.pressed]}><Text style={styles.advanced}>{label('advancedScan')}</Text></Pressable></View><ShutterButton onPress={() => void capture()} disabled={busy} /><Text style={styles.status}>{busy ? label('processingScan') : quality.confidence > 0.65 ? `${label('documentReady')} · ${label('tapToCapture')}` : label('tapToCapture')}</Text></View>{recentScans.length ? <View style={styles.recentPanel}><View style={styles.recentHeader}><Text style={styles.recentTitle}>{label('recentScans')}</Text><Pressable accessibilityRole="button" accessibilityLabel={label('openDocumentLibrary')} onPress={() => navigateSafely('/(tabs)/gallery')}><Text style={styles.recentLink}>{label('viewAll')}</Text></Pressable></View>{recentScans.map((scan) => <Pressable key={scan.id} accessibilityRole="button" accessibilityLabel={recentScanAccessibilityLabel(scan.title, locale, PAYWALL_LABELS_BY_LOCALE)} onPress={() => openDocument(scan.id)} style={styles.recentRow}><View style={styles.recentIcon}><Text style={styles.recentIconText}>▤</Text></View><View style={styles.recentCopy}><Text style={styles.recentName} numberOfLines={1}>{scan.title}</Text><Text style={styles.recentMeta}>{scan.pages.length} {scan.pages.length === 1 ? label('pageSingular') : label('pagePlural')} · {new Date(scan.updatedAt).toLocaleDateString(locale)}</Text></View><Text style={styles.recentChevron}>›</Text></Pressable>)}</View> : null}</View></View></View></ScreenContainer>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1220' },
  webPreview: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111C2F' },
  webBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, backgroundColor: '#25345B', marginBottom: 18 },
  webBadgeText: { color: '#C7D2FE', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  cameraLabel: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  cameraSub: { color: '#A5B4FC', marginTop: 8 },
  scrimTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 180, backgroundColor: '#02061766' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  top: { alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingTop: 24 }, scanState:{flexDirection:'row',alignItems:'center',gap:7,backgroundColor:'#02061799',borderRadius:99,paddingHorizontal:11,paddingVertical:7},scanDot:{width:7,height:7,borderRadius:7,backgroundColor:'#34D399'},scanStateText:{color:'#F8FAFC',fontSize:12,fontWeight:'800'},scanStateValue:{color:'#C7D2FE',fontSize:12,fontWeight:'800'},guidance:{alignItems:'center',gap:5},
  hint: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', textAlign: 'center' },
  sub: { color: '#D0D5DD', fontSize: 13 },
  storageWarning: { color: '#FDE68A', fontSize: 12, fontWeight: '800', textAlign: 'center', maxWidth: 320 },
  storageAction: { color: '#C7D2FE', fontSize: 12, fontWeight: '900', textDecorationLine: 'underline' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  permissionIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  permissionIconText: { color: '#4F46E5', fontSize: 34, fontWeight: '800' },
  permissionTitle: { fontSize: 25, fontWeight: '800', color: '#122033', textAlign: 'center' },
  permissionText: { color: '#667085', lineHeight: 21, textAlign: 'center', marginTop: 10, maxWidth: 320 },
  permissionButton: { backgroundColor: '#4F46E5', borderRadius: 14, paddingHorizontal: 22, paddingVertical: 14, marginTop: 22 },
  permissionButtonText: { color: '#fff', fontWeight: '800' },
  permissionError: { color: '#B42318', textAlign: 'center', marginTop: 14 },
  bottom: { alignItems: 'center', paddingHorizontal: 18, paddingBottom: 24 }, bottomPanel:{alignItems:'center',gap:14,paddingHorizontal:12,paddingTop:12,paddingBottom:14,borderRadius:24,backgroundColor:'#02061799',width:'100%'},
  actionTray: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 6, borderRadius: 20, backgroundColor: '#02061799' },
  secondaryAction: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 },
  secondaryText: { color: '#122033', fontWeight: '800' },
  advancedAction: { paddingHorizontal: 12, paddingVertical: 10 },
  advanced: { color: '#C7D2FE', fontWeight: '800' },
  status: { color: '#E4E7EC', fontSize: 13, fontWeight: '600' }, captureNotice: { color: '#D1FAE5', fontSize: 13, fontWeight: '800', textAlign: 'center' }, recentPanel:{width:'100%',backgroundColor:'#FFFFFF',borderRadius:18,padding:12,marginTop:2},recentHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},recentTitle:{color:'#122033',fontSize:13,fontWeight:'900'},recentLink:{color:'#4F46E5',fontSize:12,fontWeight:'900'},recentRow:{flexDirection:'row',alignItems:'center',gap:9,paddingVertical:9,paddingHorizontal:6,borderRadius:12},recentIcon:{width:30,height:30,borderRadius:9,backgroundColor:'#EEF2FF',alignItems:'center',justifyContent:'center'},recentIconText:{color:'#4F46E5',fontSize:16},recentCopy:{flex:1},recentName:{color:'#344054',fontWeight:'800',fontSize:13},recentMeta:{color:'#98A2B3',fontSize:11,marginTop:2},recentChevron:{fontSize:22,color:'#4F46E5',fontWeight:'700'},
  pressed: { opacity: 0.72 },
  errorBox: { backgroundColor: '#7F1D1D', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, alignItems: 'center', maxWidth: 340 },
  errorText: { color: '#FFF1F2', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  dismiss: { color: '#FECDD3', fontWeight: '800', marginTop: 5 },
});
