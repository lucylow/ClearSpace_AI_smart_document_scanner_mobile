import { useCallback, useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as ImageManipulator from "expo-image-manipulator";
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
import { ScreenContainer } from "@/components/screen-container";
import { RecoveryStatus } from "@/components/recovery-status";
import { asyncStorageAdapter } from "@/src/core/storage/StorageAdapter";
import { createScanPersistence } from "@/src/core/storage/scanPersistence";
import { useScanStore } from "@/src/core/store/scanStore";
import { PDFExportService } from "@/src/core/services/PDFExportService";
import { useAppLocale } from "@/src/core/i18n/AppLocaleProvider";
import { documentUiLabelsForLocale, DOCUMENT_UI_LABELS_BY_LOCALE } from "@/src/core/storage/cleanupRecovery";
import { actionCopy, ACTION_COPY_BY_LOCALE, historyCopy, HISTORY_COPY_BY_LOCALE, documentMetaCopy, DOCUMENT_META_COPY_BY_LOCALE, documentNoticeCopy, DOCUMENT_NOTICE_COPY_BY_LOCALE, documentPresentationCopy, DOCUMENT_PRESENTATION_COPY_BY_LOCALE, inspectorCopy, INSPECTOR_COPY_BY_LOCALE, localizedFilterName } from "@/src/core/i18n/localePreference";
import { ImageProcessingService } from "@/src/core/services/ImageProcessingService";
import type { ScanFilter } from "@/src/core/types";
import { clampCropDraft, cropRectFromDraft, filterLabel, type CropDraft } from "@/src/core/services/editingHelpers";
import { editKindLabel, pushEditSnapshot } from "@/src/core/services/editHistory";
import { safeErrorMessage } from "@/src/core/errors/errorMessage";

const scanPersistence = createScanPersistence(asyncStorageAdapter);

export default function Document() {
  const { locale } = useAppLocale();
  const labels = documentUiLabelsForLocale(locale, DOCUMENT_UI_LABELS_BY_LOCALE);
  const actions = actionCopy(locale, ACTION_COPY_BY_LOCALE);
  const inspector = inspectorCopy(locale, INSPECTOR_COPY_BY_LOCALE);
  const historyLabels = historyCopy(locale, HISTORY_COPY_BY_LOCALE);
  const documentMeta = documentMetaCopy(locale, DOCUMENT_META_COPY_BY_LOCALE);
  const presentation = documentPresentationCopy(locale, DOCUMENT_PRESENTATION_COPY_BY_LOCALE);
  const notices = documentNoticeCopy(locale, DOCUMENT_NOTICE_COPY_BY_LOCALE);
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const scan = useScanStore((state) =>
    state.scans.find((item) => item.id === id),
  );
  const rename = useScanStore((state) => state.rename);
  const toggleFavorite = useScanStore((state) => state.toggleFavorite);
  const remove = useScanStore((state) => state.remove);
  const update = useScanStore((state) => state.update);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(scan?.title ?? "");
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [editingPage, setEditingPage] = useState(false);
  const [filterPreviewUri, setFilterPreviewUri] = useState<string | null>(null);
  const [filterPreview, setFilterPreview] = useState<ScanFilter | null>(null);
  const [cropDraft, setCropDraft] = useState<CropDraft | null>(null);
  const [restoringEdit, setRestoringEdit] = useState(false);
  const [backupInfo, setBackupInfo] = useState<{ available: boolean; savedAt: number | null }>({ available: false, savedAt: null });
  const [backupNotice, setBackupNotice] = useState('');
  const justExported = from === "export";
  useEffect(() => { let mounted = true; void scanPersistence.getBackupInfo().then((info) => { if (mounted) setBackupInfo(info); }).catch(() => undefined); return () => { mounted = false; }; }, []);
  const refreshRecoveryCopy = async () => { try { await scanPersistence.save(useScanStore.getState().scans); setBackupInfo(await scanPersistence.getBackupInfo()); setBackupNotice(notices.recoveryRefreshed); } catch (error) { setBackupNotice(notices.recoveryFailed(safeErrorMessage(error, 'Your document is unchanged. Try again.'))); } };
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pinchStart = useSharedValue(1);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const resetInspectorView = useCallback(() => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  }, [scale, translateX, translateY]);
  const moveToPage = (delta: number) =>
    setSelectedPage((current) =>
      current === null
        ? null
        : Math.min(
            scan?.pages.length ? scan.pages.length - 1 : 0,
            Math.max(0, current + delta),
          ),
    );
  const inspectorGesture = Gesture.Simultaneous(
    Gesture.Pinch()
      .onStart(() => {
        pinchStart.value = scale.value;
      })
      .onUpdate((event) => {
        scale.value = Math.min(4, Math.max(1, pinchStart.value * event.scale));
      })
      .onEnd(() => {
        if (scale.value < 1.08) resetInspectorView();
      }),
    Gesture.Pan()
      .onStart(() => {
        panStartX.value = translateX.value;
        panStartY.value = translateY.value;
      })
      .onUpdate((event) => {
        if (scale.value > 1.02) {
          translateX.value = panStartX.value + event.translationX;
          translateY.value = panStartY.value + event.translationY;
        }
      })
      .onEnd((event) => {
        if (
          scale.value <= 1.02 &&
          Math.abs(event.translationX) > 60 &&
          Math.abs(event.translationX) > Math.abs(event.translationY)
        )
          runOnJS(moveToPage)(event.translationX < 0 ? 1 : -1);
      }),
    Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        if (scale.value > 1.1) resetInspectorView();
        else scale.value = withTiming(2);
      }),
  );
  const inspectorImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  useEffect(() => {
    resetInspectorView();
  }, [resetInspectorView, selectedPage]);
  if (!scan)
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View style={styles.center}>
          <View style={styles.notFoundIcon}>
            <Text style={styles.notFoundIconText}>?</Text>
          </View>
          <Text style={styles.notFoundTitle}>Document not found</Text>
          <Text style={styles.notFoundText}>
            It may have been removed or is no longer available on this device.
          </Text>
          <Button mode="contained" onPress={() => router.back()}>
            {historyLabels.backToDocuments}
          </Button>
        </View>
      </ScreenContainer>
    );
  const saveEdit = async (patch: { pages: typeof scan.pages; thumbnailUri: string }, kind: "rotate" | "crop" | "filter") => { const history = pushEditSnapshot(scan.editHistory, { pages: scan.pages, thumbnailUri: scan.thumbnailUri, kind }); await update(scan.id, { ...patch, editHistory: history }); setBackupNotice(notices.editSaved); };
  const restoreHistoryEntry = async (index: number) => { const history = scan.editHistory ?? []; const snapshot = history[index]; if (!snapshot) return; setRestoringEdit(true); try { await update(scan.id, { pages: snapshot.pages, thumbnailUri: snapshot.thumbnailUri, editHistory: history.slice(index + 1) }); } catch (error) { setBackupNotice(notices.restoreFailed(safeErrorMessage(error, 'Your current document is unchanged. Try again.'))); Alert.alert(historyLabels.restoreUnavailableTitle, historyLabels.restoreUnavailableMessage); } finally { setRestoringEdit(false); } };
  const requestRestoreHistoryEntry = (index: number) => { const entry = scan.editHistory?.[index]; if (!entry) return; Alert.alert(historyLabels.restoreSavedTitle, `${editKindLabel(entry.kind)} · ${new Date(entry.savedAt).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })} · ${entry.pages.length} page${entry.pages.length === 1 ? "" : "s"}. ${historyLabels.restoreSavedMessage}`, [{ text: actions.cancel, style: "cancel" }, { text: actions.restore, onPress: () => void restoreHistoryEntry(index) }]); };
  const revertLastEdit = async () => requestRestoreHistoryEntry(0);
  const saveTitle = async () => {
    const next = title.trim();
    if (!next) return;
    try {
      await rename(scan.id, next);
      setEditing(false);
      setBackupNotice(notices.renamed);
    } catch (error) {
      setBackupNotice(notices.renameFailed(safeErrorMessage(error, 'Your document is unchanged. Try again.')));
    }
  };
  const confirmDelete = () =>
    Alert.alert(actions.deleteTitle, actions.deleteMessage, [
      { text: actions.cancel, style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await remove(scan.id);
            router.back();
          } catch (error) {
            setBackupNotice(notices.deleteFailed(safeErrorMessage(error, 'Your document is still available. Try again.')));
          }
        },
      },
    ]);
  const previewFilter = async (filter: ScanFilter) => { if (selectedPage === null) return; const page = scan.pages[selectedPage]; if (!page?.processedUri) return; setEditingPage(true); try { const uri = await ImageProcessingService.filter(page.processedUri, filter); setFilterPreviewUri(uri); setFilterPreview(filter); } catch { Alert.alert(inspector.previewError, inspector.filterError); } finally { setEditingPage(false); } };
  const cancelFilterPreview = () => { setFilterPreviewUri(null); setFilterPreview(null); };
  const saveFilterPreview = async () => { if (selectedPage === null || !filterPreviewUri || !filterPreview) return; const page = scan.pages[selectedPage]; if (!page) return; setEditingPage(true); try { await saveEdit({ pages: scan.pages.map((item, index) => index === selectedPage ? { ...item, processedUri: filterPreviewUri, filter: filterPreview } : item), thumbnailUri: selectedPage === 0 ? filterPreviewUri : scan.thumbnailUri }, "filter"); cancelFilterPreview(); } catch (error) { setBackupNotice(notices.editFailed(safeErrorMessage(error, 'Your current page is unchanged. Try again.'))); Alert.alert(inspector.filterError, inspector.editError); } finally { setEditingPage(false); } };
  const beginCrop = () => setCropDraft({ left: 0.08, top: 0.08, right: 0.92, bottom: 0.92 });
  const cancelCrop = () => setCropDraft(null);
  const updateCropHandle = (handle: "topLeft" | "topRight" | "bottomLeft" | "bottomRight", dx: number, dy: number) => setCropDraft((current) => { if (!current) return current; const x = dx / 320; const y = dy / 500; const next = { ...current }; if (handle.includes("Left")) next.left += x; else next.right += x; if (handle.includes("top")) next.top += y; else next.bottom += y; return clampCropDraft(next); });
  const cropHandleGesture = (handle: "topLeft" | "topRight" | "bottomLeft" | "bottomRight") => Gesture.Pan().onEnd((event) => runOnJS(updateCropHandle)(handle, event.translationX, event.translationY));
  const saveCrop = async () => { if (selectedPage === null || !cropDraft) return; const page = scan.pages[selectedPage]; if (!page?.processedUri) return; setEditingPage(true); try { const crop = cropRectFromDraft(cropDraft, page.width, page.height); const result = await ImageManipulator.manipulateAsync(page.processedUri, [{ crop }], { compress: 0.92, format: ImageManipulator.SaveFormat.JPEG }); await saveEdit({ pages: scan.pages.map((item, index) => index === selectedPage ? { ...item, processedUri: result.uri, width: crop.width, height: crop.height } : item), thumbnailUri: selectedPage === 0 ? result.uri : scan.thumbnailUri }, "crop"); cancelCrop(); } catch (error) { setBackupNotice(notices.editFailed(safeErrorMessage(error, 'Your current page is unchanged. Try again.'))); Alert.alert(inspector.cropError, inspector.editError); } finally { setEditingPage(false); } };
  const applyPageEdit = async (
    kind: "rotate" | "crop" | "filter",
    filter?: ScanFilter,
  ) => {
    if (selectedPage === null) return;
    const page = scan.pages[selectedPage];
    if (!page?.processedUri) return;
    setEditingPage(true);
    try {
      let uri = page.processedUri;
      let nextFilter = page.filter;
      if (kind === "rotate") uri = await ImageProcessingService.rotate(uri, 90);
      if (kind === "filter" && filter) {
        uri = await ImageProcessingService.filter(uri, filter);
        nextFilter = filter;
      }
      if (kind === "crop") {
        const width = Math.max(1, Math.floor(page.width * 0.9));
        const height = Math.max(1, Math.floor(page.height * 0.9));
        const originX = Math.floor((page.width - width) / 2);
        const originY = Math.floor((page.height - height) / 2);
        const result = await ImageManipulator.manipulateAsync(
          uri,
          [{ crop: { originX, originY, width, height } }],
          { compress: 0.92, format: ImageManipulator.SaveFormat.JPEG },
        );
        uri = result.uri;
      }
      await saveEdit({ pages: scan.pages.map((item, index) => index === selectedPage ? { ...item, processedUri: uri, filter: nextFilter } : item), thumbnailUri: selectedPage === 0 ? uri : scan.thumbnailUri }, kind);
    } catch (error) {
      setBackupNotice(notices.editFailed(safeErrorMessage(error, 'Your current page is unchanged. Try again.')));
      Alert.alert(
        inspector.previewError,
        inspector.editError,
      );
    } finally {
      setEditingPage(false);
    }
  };
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="p-4">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>{presentation.eyebrow}</Text>
        <View style={styles.header}>
          {editing ? (
            <TextInput
              accessibilityLabel={documentMeta.titleInput}
              value={title}
              onChangeText={setTitle}
              autoFocus
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={() => void saveTitle()}
            />
          ) : (
            <Text style={styles.title}>{scan.title}</Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              editing ? documentMeta.saveTitle : documentMeta.renameTitle
            }
            onPress={() => void (editing ? saveTitle() : setEditing(true))}
          >
            <Text style={styles.action}>{editing ? historyLabels.save : documentMeta.renameTitle}</Text>
          </Pressable>
        </View>
        {justExported ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <View style={styles.successCopy}>
              <Text style={styles.successTitle}>{presentation.readyTitle}</Text>
              <Text style={styles.successText}>
                {presentation.readyMessage(scan.pages.length)}
              </Text>
            </View>
            <View style={styles.successActions}>
              <Button
                compact
                mode="contained"
                accessibilityLabel={actions.sharePdf}
                onPress={() => {
                  if (scan.pdfUri) void PDFExportService.sharePDF(scan.pdfUri).then(() => setBackupNotice(notices.pdfShared)).catch(error => setBackupNotice(notices.pdfShareFailed(safeErrorMessage(error, 'Try again.'))));
                }}
                disabled={!scan.pdfUri}
              >
                {actions.sharePdf}
              </Button>
              <Button
                compact
                mode="text"
                accessibilityLabel={actions.scanAnother}
                onPress={() => router.replace("/(tabs)" as any)}
              >
                {actions.scanAnother}
              </Button>
              <Button compact mode="text" accessibilityLabel={actions.refreshRecovery} onPress={() => void refreshRecoveryCopy()}>{actions.refreshRecovery}</Button>
              {backupNotice ? <Text style={styles.successText}>{backupNotice}</Text> : null}
            </View>
          </View>
        ) : null}
        <View style={styles.metaCard}>
          <View style={styles.metaCopy}>
            <Text style={styles.metaLabel}>{historyLabels.lastUpdated}</Text>
            <Text style={styles.meta}>
              {new Date(scan.updatedAt ?? scan.createdAt).toLocaleString(locale)}
            </Text>
            <Text style={styles.metaSub}>
              {scan.pages.length} {scan.pages.length === 1 ? labels.pageSingular : labels.pagePlural} ·
              {labels.localStorage}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              scan.favorite ? "Remove from favorites" : "Add to favorites"
            }
            onPress={() => void toggleFavorite(scan.id)}
            style={styles.favoriteButton}
          >
            <Text style={styles.favorite}>{scan.favorite ? "★" : "☆"}</Text>
            <Text style={styles.favoriteLabel}>
              {scan.favorite ? historyLabels.favorite : historyLabels.save}
            </Text>
          </Pressable>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{documentMeta.pages}</Text>
          <Text style={styles.sectionMeta}>{scan.pages.length} {documentMeta.total}</Text>
        </View>
        {scan.pages.map((page, index) => (
          <Pressable
            key={page.id}
            accessibilityRole="button"
            accessibilityLabel={documentMeta.inspectPage(index + 1)}
            onPress={() => setSelectedPage(index)}
            style={({ pressed }) => [
              styles.page,
              pressed && styles.pagePressed,
            ]}
          >
            <View style={styles.pagePreview}>
              {page.processedUri ? (
                <Image
                  accessibilityLabel={documentMeta.previewPage(index + 1)}
                  source={{ uri: page.processedUri }}
                  style={styles.pageImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.pageNumber}>{index + 1}</Text>
              )}
              <View style={styles.pageBadge}>
                <Text style={styles.pageBadgeText}>{index + 1}</Text>
              </View>
            </View>
            <View style={styles.pageCopy}>
              <Text style={styles.pageLabel}>{documentMeta.pageLabel(index + 1)}</Text>
              <Text style={styles.pageUri} numberOfLines={1}>
                {page.processedUri}
              </Text>
              <Text style={styles.pageMeta}>
                {page.filter === "original"
                  ? documentMeta.originalCapture
                  : documentMeta.filterName(localizedFilterName(page.filter, locale))}
              </Text>
            </View>
            <Text style={styles.pageChevron}>›</Text>
          </Pressable>
        ))}
        {scan.editHistory?.length ? <View style={styles.historyCard}><View style={styles.historyHeader}><View style={styles.historyCopy}><Text style={styles.historyTitle}>{historyLabels.title}</Text><Text style={styles.historyText}>{historyLabels.text}</Text></View><Button compact mode="outlined" disabled={restoringEdit} onPress={() => revertLastEdit()} accessibilityLabel={historyLabels.revertLatest}>{restoringEdit ? historyLabels.restoring : historyLabels.revertLatest}</Button></View><View style={styles.historyTimeline}>{scan.editHistory.map((entry, index) => <View key={`${entry.savedAt}-${index}`} style={styles.historyRow}><View style={[styles.historyDot, index === 0 && styles.historyDotActive]} /><View style={styles.historyRowCopy}><Text style={styles.historyRowTitle}>{editKindLabel(entry.kind)}</Text><Text style={styles.historyRowMeta}>{new Date(entry.savedAt).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })} · {entry.pages.length} page{entry.pages.length === 1 ? "" : "s"}</Text></View>{index === 0 ? <Text style={styles.historyLatest}>{historyLabels.latest}</Text> : <Button compact mode="text" disabled={restoringEdit} onPress={() => requestRestoreHistoryEntry(index)} accessibilityLabel={`${actions.restore} ${editKindLabel(entry.kind)} ${new Date(entry.savedAt).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`}>{actions.restore}</Button>}</View>)}</View></View> : null}
        <RecoveryStatus available={backupInfo.available} savedAt={backupInfo.savedAt} />
        <View style={styles.primaryActions}>
          <Button
            mode="contained"
            onPress={() => {
              if (scan.pdfUri) void PDFExportService.sharePDF(scan.pdfUri).then(() => setBackupNotice(notices.pdfShared)).catch(error => setBackupNotice(notices.pdfShareFailed(safeErrorMessage(error, 'Try again.'))));
            }}
            disabled={!scan.pdfUri}
          >
            {actions.sharePdf}
          </Button>
          <Button mode="outlined" onPress={() => router.back()}>
            {historyLabels.backToDocuments}
          </Button>
        </View>
        <View style={styles.dangerSection}>
          <Text style={styles.dangerLabel}>{documentMeta.danger}</Text>
          <Text style={styles.dangerText}>
            {documentMeta.deleteLocalWarning}
          </Text>
          <Button textColor="#B42318" onPress={confirmDelete}>
            {actions.deleteDocument}
          </Button>
        </View>
      </ScrollView>
      <Modal
        visible={selectedPage !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPage(null)}
      >
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(180)}
          style={styles.viewer}
        >
          <View style={styles.viewerHeader}>
            <Text style={styles.viewerTitle}>
              {selectedPage === null
                ? ""
                : actions.pageOf(selectedPage + 1, scan.pages.length)}
            </Text>
            {selectedPage !== null ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={actions.resetView}
                onPress={resetInspectorView}
                style={({ pressed }) => [
                  styles.viewerReset,
                  pressed && styles.viewerPressed,
                ]}
              >
                <Text style={styles.viewerResetText}>{actions.resetView}</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={actions.close}
              onPress={() => setSelectedPage(null)}
              style={({ pressed }) => [
                styles.viewerCloseButton,
                pressed && styles.viewerPressed,
              ]}
            >
              <Text style={styles.viewerClose}>{actions.close}</Text>
            </Pressable>
          </View>
          {selectedPage !== null ? (
            <View style={styles.viewerBody}>
              <GestureDetector gesture={inspectorGesture}>
                <View style={styles.viewerImageFrame}>
                  {scan.pages[selectedPage]?.processedUri ? (
                    <Animated.Image
                      accessibilityLabel={`Full preview of page ${selectedPage + 1}`}
                      source={{ uri: filterPreviewUri ?? scan.pages[selectedPage].processedUri }}
                      style={[styles.viewerImage, inspectorImageStyle]}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.viewerFallback}>
                      <Text style={styles.viewerFallbackNumber}>
                        {selectedPage + 1}
                      </Text>
                      <Text style={styles.viewerFallbackText}>
                        {inspector.previewError}
                      </Text>
                    </View>
                  )}
                </View>
              </GestureDetector>
              <Text style={styles.viewerHint}>
                {inspector.guidance}
              </Text>
              {cropDraft ? <View style={styles.cropOverlay}><View style={[styles.cropWindow, { left: `${cropDraft.left * 100}%`, top: `${cropDraft.top * 100}%`, width: `${(cropDraft.right - cropDraft.left) * 100}%`, height: `${(cropDraft.bottom - cropDraft.top) * 100}%` }]}><GestureDetector gesture={cropHandleGesture("topLeft")}><View style={[styles.cropHandle, styles.handleTopLeft]} /></GestureDetector><GestureDetector gesture={cropHandleGesture("topRight")}><View style={[styles.cropHandle, styles.handleTopRight]} /></GestureDetector><GestureDetector gesture={cropHandleGesture("bottomLeft")}><View style={[styles.cropHandle, styles.handleBottomLeft]} /></GestureDetector><GestureDetector gesture={cropHandleGesture("bottomRight")}><View style={[styles.cropHandle, styles.handleBottomRight]} /></GestureDetector></View></View> : null}
              <View style={styles.editorToolbar}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${actions.rotate} page 90 degrees`}
                  disabled={editingPage}
                  onPress={() => void applyPageEdit("rotate")}
                  style={({ pressed }) => [
                    styles.editorButton,
                    pressed && styles.viewerPressed,
                  ]}
                >
                  <Text style={styles.editorIcon}>↻</Text>
                  <Text style={styles.editorLabel}>{actions.rotate}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${actions.crop} page`}
                  disabled={editingPage}
                  onPress={beginCrop}
                  style={({ pressed }) => [
                    styles.editorButton,
                    pressed && styles.viewerPressed,
                  ]}
                >
                  <Text style={styles.editorIcon}>⌗</Text>
                  <Text style={styles.editorLabel}>{actions.crop}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={actions.enhance}
                  disabled={editingPage}
                  onPress={() => void previewFilter("enhanced")}
                  style={({ pressed }) => [
                    styles.editorButton,
                    pressed && styles.viewerPressed,
                  ]}
                >
                  <Text style={styles.editorIcon}>✦</Text>
                  <Text style={styles.editorLabel}>
                    {editingPage ? `${actions.filterPreview}…` : actions.enhance}
                  </Text>
                </Pressable>
              </View>{filterPreviewUri ? <View style={styles.previewActions}><Text style={styles.previewLabel}>{filterPreview ? `${filterLabel(filterPreview)} ${actions.filterPreview.toLowerCase()}` : actions.filterPreview}</Text><Pressable accessibilityRole="button" accessibilityLabel={actions.cancel} onPress={cancelFilterPreview} style={styles.previewCancel}><Text style={styles.previewCancelText}>{actions.cancel}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`${actions.saveFilter} ${actions.filterPreview.toLowerCase()}`} onPress={() => void saveFilterPreview()} style={styles.previewSave}><Text style={styles.previewSaveText}>{actions.saveFilter}</Text></Pressable></View> : null}{cropDraft ? <View style={styles.previewActions}><Text style={styles.previewLabel}>{actions.adjustCrop}</Text><Pressable accessibilityRole="button" accessibilityLabel={actions.cancel} onPress={cancelCrop} style={styles.previewCancel}><Text style={styles.previewCancelText}>{actions.cancel}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={actions.saveCrop} onPress={() => void saveCrop()} style={styles.previewSave}><Text style={styles.previewSaveText}>{actions.saveCrop}</Text></Pressable></View> : null}
              <View style={styles.viewerControls}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={actions.previousPage}
                  disabled={selectedPage === 0}
                  onPress={() =>
                    setSelectedPage((current) =>
                      current === null ? null : Math.max(0, current - 1),
                    )
                  }
                  style={({ pressed }) => [
                    styles.viewerButton,
                    selectedPage === 0 && styles.viewerButtonDisabled,
                    pressed && styles.viewerPressed,
                  ]}
                >
                  <Text style={styles.viewerButtonText}>{`‹ ${actions.previousPage}`}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={actions.nextPage}
                  disabled={selectedPage === scan.pages.length - 1}
                  onPress={() =>
                    setSelectedPage((current) =>
                      current === null
                        ? null
                        : Math.min(scan.pages.length - 1, current + 1),
                    )
                  }
                  style={({ pressed }) => [
                    styles.viewerButton,
                    selectedPage === scan.pages.length - 1 &&
                      styles.viewerButtonDisabled,
                    pressed && styles.viewerPressed,
                  ]}
                >
                  <Text style={styles.viewerButtonText}>{`${actions.nextPage} ›`}</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </Animated.View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 30, gap: 14 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#667085",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: { fontSize: 29, fontWeight: "900", color: "#122033", flex: 1 },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 20,
    color: "#122033",
  },
  action: { color: "#4F46E5", fontWeight: "900" },
  successCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    gap: 10,
  },
  successIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },
  successIconText: { color: "#FFF", fontSize: 18, fontWeight: "900" },
  successCopy: { gap: 3 },
  successTitle: { color: "#312E81", fontSize: 16, fontWeight: "900" },
  successText: { color: "#4338CA", fontSize: 12, lineHeight: 18 },
  historyCard: { gap: 10, padding: 14, borderRadius: 16, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E0E7FF" },
  historyHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  historyCopy: { flex: 1, gap: 3 },
  historyTimeline: { marginTop: 12, gap: 9, borderTopWidth: 1, borderTopColor: "#E0E7FF", paddingTop: 10 },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#CBD5E1" },
  historyDotActive: { backgroundColor: "#4F46E5" },
  historyRowCopy: { flex: 1, gap: 1 },
  historyRowTitle: { color: "#344054", fontSize: 12, fontWeight: "800" },
  historyRowMeta: { color: "#98A2B3", fontSize: 10 },
  historyLatest: { color: "#4F46E5", fontSize: 10, fontWeight: "900" },
  historyTitle: { color: "#312E81", fontSize: 14, fontWeight: "900" },
  historyText: { color: "#667085", fontSize: 11, lineHeight: 16 },
  successActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  metaCopy: { flex: 1 },
  metaLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#98A2B3",
  },
  meta: { color: "#344054", fontWeight: "800", marginTop: 5 },
  metaSub: { color: "#667085", fontSize: 12, marginTop: 4 },
  favoriteButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 62,
  },
  favorite: { fontSize: 26, color: "#4F46E5", lineHeight: 29 },
  favoriteLabel: { fontSize: 11, color: "#4F46E5", fontWeight: "800" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#122033" },
  sectionMeta: { fontSize: 12, color: "#98A2B3" },
  page: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAECF0",
    backgroundColor: "#FFF",
  },
  pagePressed: { backgroundColor: "#F8FAFC", borderColor: "#C7D2FE" },
  pageChevron: { fontSize: 24, color: "#4F46E5", fontWeight: "700" },
  pagePreview: {
    width: 58,
    height: 70,
    borderRadius: 9,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  pageImage: { width: "100%", height: "100%" },
  pageBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  pageNumber: { fontSize: 22, fontWeight: "900", color: "#4F46E5" },
  pageCopy: { flex: 1 },
  pageLabel: { fontSize: 15, fontWeight: "900", color: "#344054" },
  pageUri: { fontSize: 11, color: "#98A2B3", marginTop: 4 },
  pageMeta: { fontSize: 12, color: "#667085", marginTop: 4 },
  primaryActions: { gap: 8, marginTop: 4 },
  dangerSection: {
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFF7F7",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#B42318",
  },
  dangerText: { fontSize: 13, color: "#7F1D1D", lineHeight: 19, marginTop: 5 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  notFoundIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  notFoundIconText: { fontSize: 25, fontWeight: "900", color: "#4F46E5" },
  notFoundTitle: { fontSize: 21, fontWeight: "900", color: "#122033" },
  notFoundText: {
    textAlign: "center",
    color: "#667085",
    lineHeight: 20,
    marginVertical: 8,
  },
  viewer: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  viewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  viewerTitle: { color: "#F8FAFC", fontSize: 18, fontWeight: "900" },
  viewerReset: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 10 },
  viewerResetText: { color: "#C7D2FE", fontSize: 12, fontWeight: "900" },
  viewerCloseButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewerClose: { color: "#C7D2FE", fontSize: 14, fontWeight: "900" },
  viewerPressed: { opacity: 0.7 },
  viewerBody: { flex: 1, justifyContent: "center", gap: 12 },
  viewerImageFrame: {
    height: "72%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerImage: { width: "100%", height: "100%" },
  viewerHint: { color: "#98A2B3", fontSize: 11, textAlign: "center" },
  editorToolbar: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 2 },
  editorButton: { minWidth: 78, alignItems: "center", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: "#17233A", borderWidth: 1, borderColor: "#334155" },
  editorIcon: { color: "#C7D2FE", fontSize: 18, lineHeight: 20 },
  editorLabel: { color: "#E0E7FF", fontSize: 11, fontWeight: "800", marginTop: 2 },
  previewActions: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8, borderRadius: 12, backgroundColor: "#17233A" },
  previewLabel: { flex: 1, color: "#E0E7FF", fontSize: 11, fontWeight: "800" },
  previewCancel: { paddingHorizontal: 8, paddingVertical: 6 },
  previewCancelText: { color: "#C7D2FE", fontSize: 11, fontWeight: "800" },
  previewSave: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9, backgroundColor: "#4F46E5" },
  previewSaveText: { color: "#FFF", fontSize: 11, fontWeight: "900" },
  cropOverlay: { ...StyleSheet.absoluteFillObject, pointerEvents: "box-none" },
  cropWindow: { position: "absolute", borderWidth: 2, borderColor: "#A5B4FC", backgroundColor: "rgba(79,70,229,0.12)" },
  cropHandle: { position: "absolute", width: 24, height: 24, borderRadius: 12, backgroundColor: "#FFF", borderWidth: 3, borderColor: "#4F46E5" },
  handleTopLeft: { left: -12, top: -12 },
  handleTopRight: { right: -12, top: -12 },
  handleBottomLeft: { left: -12, bottom: -12 },
  handleBottomRight: { right: -12, bottom: -12 },
  viewerFallback: {
    height: "72%",
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerFallbackNumber: { color: "#4F46E5", fontSize: 58, fontWeight: "900" },
  viewerFallbackText: { color: "#667085", marginTop: 8 },
  viewerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  viewerButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
  },
  viewerButtonDisabled: { opacity: 0.4 },
  viewerButtonText: { color: "#FFF", fontWeight: "900" },
});
