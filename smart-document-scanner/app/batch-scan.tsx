import React, { useState } from 'react';
import { AccessibilityInfo, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, ProgressBar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { BatchScanService } from '@/src/core/services/BatchScanService';
import { getFlags } from '@/src/core/flags/FeatureFlags';
import { PDFExportService } from '@/src/core/services/PDFExportService';
import { useScanStore } from '@/src/core/store/scanStore';
import { makeId } from '@/src/core/utils/id';
import { safeErrorMessage, isAbortError } from '@/src/core/errors/errorMessage';
import { batchCopy } from '@/src/core/i18n/localePreference';
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { cleanupGeneratedExport } from '@/src/core/services/exportArtifactCleanup';
import { exportCleanupFailureGuidance } from '@/src/core/services/exportCleanupNotice';
import { exportRetryLabel } from '@/src/core/services/exportRetryLabels';
import { exportRetryAccessibilityCopy } from '@/src/core/services/exportRetryAccessibility';

type Item = { id: string; uri: string; resultUri?: string; error?: string };

export default function BatchScan() {
  const { locale } = useAppLocale();
  const copy = batchCopy(locale);
  const retryAccessibility = exportRetryAccessibilityCopy(locale);
  const [items, setItems] = useState<Item[]>([]); const [running, setRunning] = useState(false); const [done, setDone] = useState(0); const [message, setMessage] = useState(''); const [exportFailedState, setExportFailedState] = useState(false); const add = useScanStore((state) => state.add);
  const choose = async () => { if (!getFlags().batchScan) { setMessage(copy.disabled); return; } try { const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 1 }); if (result.canceled) return; const assets = result.assets.filter((asset) => Boolean(asset.uri)); if (!assets.length) { setMessage(copy.noReadablePhotos); return; } setItems(assets.map((asset, index) => ({ id: `batch-${index}-${Date.now()}`, uri: asset.uri }))); setMessage(copy.readyToProcess(assets.length)); } catch (reason) { if (!isAbortError(reason)) setMessage(copy.chooseFailed(safeErrorMessage(reason, copy.permissionFallback))); } };
  const process = async (selected: Item[]) => { if (!selected.length) { setMessage(copy.selectBeforeProcess); return; } setRunning(true); setDone(0); setMessage(''); try { const output = await new BatchScanService().process(selected, false); setItems((current) => current.map((item) => output.find((result) => result.id === item.id) || item)); setDone(output.length); setMessage(output.some((item) => item.error) ? copy.attention : copy.complete); } catch (reason) { setMessage(copy.processFailed(safeErrorMessage(reason, copy.processFallback))); } finally { setRunning(false); } };
  const retryFailed = () => { const failed = items.filter((item) => item.error); if (!failed.length) { setMessage(copy.noFailedPages); return; } void process(failed); };
  const exportSuccessful = async (isRetry = false) => { const successful = items.filter((item) => item.resultUri); if (!successful.length) { setMessage(copy.processBeforeExport); return; } setRunning(true); setExportFailedState(false); if (isRetry) AccessibilityInfo.announceForAccessibility(retryAccessibility.started); let pdf: string | null = null; try { pdf = await PDFExportService.generatePDF(successful.map((item) => item.resultUri!), `batch_${Date.now()}`); if (!pdf) throw new Error('PDF unavailable'); const now = Date.now(); try { await add({ id: makeId('batch'), title: `Batch scan ${new Date(now).toLocaleDateString()}`, createdAt: now, updatedAt: now, thumbnailUri: successful[0].resultUri!, isSynced: false, pages: successful.map((item) => ({ id: makeId('page'), originalUri: item.uri, processedUri: item.resultUri!, filter: 'original', width: 1080, height: 1440, createdAt: now })), pdfUri: pdf });       } catch (persistenceError) { const cleanupSucceeded = await cleanupGeneratedExport(pdf); if (!cleanupSucceeded && pdf.startsWith('file://')) throw new Error(`${safeErrorMessage(persistenceError, copy.exportFallback)} ${exportCleanupFailureGuidance(locale)}`); throw persistenceError; } setMessage(copy.exported); if (isRetry) AccessibilityInfo.announceForAccessibility(retryAccessibility.succeeded); } catch (reason) { setExportFailedState(true); setMessage(copy.exportFailed(safeErrorMessage(reason, copy.exportFallback))); if (isRetry) AccessibilityInfo.announceForAccessibility(retryAccessibility.failed); } finally { setRunning(false); } };
  const progress = items.length ? done / items.length : 0;
  const failedCount = items.filter((item) => item.error).length;
  const readyCount = items.filter((item) => item.resultUri).length;
  const queueContent = items.length ? (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <View style={styles.rowIcon}><Text style={styles.rowIconText}>▤</Text></View>
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>{copy.page(index + 1)}</Text>
            <Text style={styles.rowSubtitle}>{item.error ? copy.needsAttention : item.resultUri ? copy.processed : copy.waiting}</Text>
          </View>
          <Text style={item.error ? styles.error : item.resultUri ? styles.ok : styles.queued}>{item.error ? copy.error : item.resultUri ? copy.ready : copy.queued}</Text>
        </View>
      )}
    />
  ) : (
    <View style={styles.empty}><Text style={styles.emptyTitle}>{copy.emptyTitle}</Text><Text style={styles.emptyText}>{copy.emptyDescription}</Text></View>
  );
  return (
    <ScreenContainer className="p-4">
      <Text style={styles.eyebrow}>POWER WORKFLOW</Text>
      <View style={styles.headerRow}><View><Text style={styles.title}>{copy.title}</Text><Text style={styles.sub}>{copy.subtitle}</Text></View><View style={styles.countPill}><Text style={styles.countPillText}>{copy.pages(items.length)}</Text></View></View>
      <Card style={styles.card}><Card.Content>
        <View style={styles.stepRow}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View><View><Text style={styles.stepTitle}>{copy.choosePages}</Text><Text style={styles.stepText}>{copy.chooseDescription}</Text></View></View>
        <Button accessibilityLabel={copy.choosePhotos} mode="outlined" onPress={() => void choose()} disabled={running}>{copy.choosePhotos}</Button>
        <View style={styles.summaryRow}><Text style={styles.summary}>{copy.selected(items.length)}</Text><Text style={styles.summaryAccent}>{copy.ready} · {readyCount}</Text></View>
        {running ? <><Text style={styles.progressLabel}>{copy.progress(done, items.length)}</Text><ProgressBar progress={progress} style={styles.progress} color="#4F46E5" /></> : null}
        <View style={styles.actions}><Button mode="contained" onPress={() => void process(items)} disabled={!items.length || running} loading={running}>{copy.process}</Button><Button mode="outlined" onPress={retryFailed} disabled={!failedCount || running}>{copy.retry}</Button></View>
        <Button mode="outlined" onPress={() => void exportSuccessful()} disabled={running || !readyCount}>{copy.export(readyCount)}</Button>
        {message ? <View style={styles.messageBox}><Text style={styles.message}>{message}</Text>{exportFailedState && readyCount ? <Button mode="contained" compact disabled={running} accessibilityRole="button" accessibilityState={{ busy: running }} accessibilityLabel={exportRetryLabel(locale)} onPress={() => void exportSuccessful(true)}>{exportRetryLabel(locale)}</Button> : null}</View> : null}
      </Card.Content></Card>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{copy.queue}</Text><Text style={styles.sectionMeta}>{failedCount ? `${failedCount} · ${copy.needsAttention}` : items.length ? copy.reviewReady : copy.noPages}</Text></View>
      {queueContent}
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>{copy.back}</Text></Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ eyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1.5,color:'#667085'}, headerRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}, title:{fontSize:30,fontWeight:'900',color:'#122033',marginTop:4}, sub:{color:'#667085',lineHeight:20,marginTop:6,maxWidth:280}, countPill:{backgroundColor:'#EEF2FF',borderRadius:99,paddingHorizontal:10,paddingVertical:8}, countPillText:{color:'#4338CA',fontSize:12,fontWeight:'900'}, card:{borderRadius:18,borderWidth:1,borderColor:'#EAECF0',backgroundColor:'#FFF',boxShadow:'0px 4px 10px rgba(16,24,40,0.05)'}, stepRow:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14}, stepNumber:{width:30,height:30,borderRadius:15,backgroundColor:'#E0E7FF',alignItems:'center',justifyContent:'center'}, stepNumberText:{color:'#4338CA',fontWeight:'900'}, stepTitle:{color:'#122033',fontSize:16,fontWeight:'900'}, stepText:{color:'#667085',fontSize:12,marginTop:2}, summaryRow:{flexDirection:'row',justifyContent:'space-between',marginTop:14}, summary:{color:'#667085',fontSize:13,fontWeight:'700'}, summaryAccent:{color:'#4F46E5',fontSize:13,fontWeight:'800'},progressLabel:{color:'#475467',fontSize:12,fontWeight:'700',marginTop:14},progress:{marginTop:7,height:8,borderRadius:8},actions:{flexDirection:'row',justifyContent:'space-between',gap:8,marginTop:14},messageBox:{backgroundColor:'#F5F3FF',borderRadius:12,padding:10,marginTop:12},message:{color:'#4338CA',fontWeight:'700',lineHeight:19},sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:20,marginBottom:8},sectionTitle:{fontSize:18,fontWeight:'900',color:'#122033'},sectionMeta:{fontSize:12,color:'#98A2B3'},list:{paddingBottom:6},row:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#EEF1F5'},rowIcon:{width:34,height:34,borderRadius:10,backgroundColor:'#EEF2FF',alignItems:'center',justifyContent:'center'},rowIconText:{color:'#4F46E5',fontSize:18},rowCopy:{flex:1},rowTitle:{color:'#344054',fontWeight:'800'},rowSubtitle:{color:'#98A2B3',fontSize:12,marginTop:3},ok:{color:'#067647',fontSize:12,fontWeight:'800'},queued:{color:'#667085',fontSize:12,fontWeight:'800'},error:{color:'#B42318',fontSize:12,fontWeight:'800'},empty:{alignItems:'center',padding:24,backgroundColor:'#F8FAFC',borderRadius:16,marginTop:6},emptyTitle:{color:'#122033',fontSize:17,fontWeight:'900'},emptyText:{color:'#667085',textAlign:'center',lineHeight:19,marginTop:5},back:{alignItems:'center',paddingVertical:16},backText:{color:'#4F46E5',fontWeight:'800'}});
