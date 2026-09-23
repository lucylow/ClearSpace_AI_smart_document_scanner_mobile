import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const { addScan, cleanupGeneratedExport, generatePDF } = vi.hoisted(() => ({
  addScan: vi.fn(),
  cleanupGeneratedExport: vi.fn(),
  generatePDF: vi.fn(),
}));

const labels = {
  pagePlural: 'pages', pageSingular: 'page', reviewWorkspace: 'REVIEW WORKSPACE', reviewScan: 'Review scan', reviewSubtitle: 'Review',
  localStorage: 'Local storage', nearlyFull: 'Nearly full', usageElevated: 'Elevated', healthy: 'Healthy', previous: 'Previous', next: 'Next',
  photoPage: 'Add photo', cameraPage: 'Camera', moveEarlier: 'Move earlier', moveLater: 'Move later', removePage: 'Remove page', noPages: 'No pages',
  startOver: 'Start over', addPhotoOrCamera: 'Add a photo or camera page', exportSavePdf: 'Save PDF', exportPreparing: (count: number) => `Preparing ${count}`,
  exportSuccess: 'Export saved', exportCancelled: 'Export cancelled', diagnostics: 'Diagnostics', retryExport: 'Retry export', exportFailed: 'Export failed',
};

vi.mock('react-native', () => ({
  AccessibilityInfo: { announceForAccessibility: vi.fn() },
  Image: 'image', Pressable: 'pressable', StyleSheet: { create: (styles: unknown) => styles }, Text: 'text', View: 'view',
}));
vi.mock('react-native-paper', () => ({
  Button: ({ children, onPress, disabled, ...props }: any) => React.createElement('button', { ...props, onPress, disabled }, children),
}));
vi.mock('expo-router', () => ({ router: { back: vi.fn(), replace: vi.fn() }, useLocalSearchParams: () => ({ uri: encodeURIComponent('demo://scan') }) }));
vi.mock('expo-image-picker', () => ({ launchImageLibraryAsync: vi.fn() }));
vi.mock('expo-clipboard', () => ({ setStringAsync: vi.fn() }));
vi.mock('@/components/screen-container', () => ({ ScreenContainer: ({ children }: any) => React.createElement('screen', null, children) }));
vi.mock('@/src/modules/scanner/components/FilterBar', () => ({ FilterBar: () => null }));
vi.mock('@/src/modules/scanner/components/ReviewCameraModal', () => ({ ReviewCameraModal: () => null }));
vi.mock('@/components/review-feedback', () => ({ DiagnosticsPanel: () => null, ExportProgressPanel: () => null, RecoveryToast: () => null }));
vi.mock('@/components/recovery-status', () => ({ RecoveryStatus: () => null }));
vi.mock('@/src/core/i18n/AppLocaleProvider', () => ({ useAppLocale: () => ({ locale: 'en-US' }) }));
vi.mock('@/src/core/storage/cleanupRecovery', () => ({ documentUiLabelsForLocale: () => labels, DOCUMENT_UI_LABELS_BY_LOCALE: {} }));
vi.mock('@/src/core/services/ImageProcessingService', () => ({ ImageProcessingService: { filter: vi.fn() } }));
vi.mock('@/src/core/services/PDFExportService', () => ({ PDFExportService: { generatePDF, sharePDF: vi.fn() } }));
vi.mock('@/src/core/services/exportCancellation', () => ({ ExportCancelledError: class ExportCancelledError extends Error {} }));
vi.mock('@/src/core/services/exportLifecycle', () => ({ abortActiveExport: vi.fn() }));
vi.mock('@/src/core/services/exportArtifactCleanup', () => ({ cleanupGeneratedExport }));
vi.mock('@/src/core/services/exportCleanupNotice', () => ({ exportCleanupFailureGuidance: () => 'Cleanup retry guidance' }));
vi.mock('@/src/core/services/exportRetryAccessibility', () => ({ exportRetryAccessibilityCopy: () => ({ started: 'Retry started', succeeded: 'Retry succeeded', failed: 'Retry failed' }) }));
vi.mock('@/src/core/store/scanStore', () => ({ useScanStore: (selector: (state: any) => unknown) => selector({ add: addScan, scans: [] }) }));
vi.mock('@/src/core/storage/StorageAdapter', () => ({ asyncStorageAdapter: {} }));
vi.mock('@/src/core/storage/scanPersistence', () => ({ createScanPersistence: () => ({ getBackupInfo: vi.fn().mockResolvedValue({ available: false, savedAt: null }) }) }));
vi.mock('@/src/core/services/storageQuota', () => ({ summarizeStorage: () => ({ percent: 0, label: '0 KB' }) }));
vi.mock('@/src/core/errors/errorMessage', () => ({ safeErrorMessage: (reason: unknown) => reason instanceof Error ? reason.message : 'failure', isAbortError: () => false }));
vi.mock('@/src/core/services/UriService', () => ({ isDemoUri: (uri: string) => uri.startsWith('demo://') }));
vi.mock('@/src/core/utils/id', () => ({ makeId: () => 'scan-id' }));
vi.mock('@/src/core/services/reviewPages', () => ({ moveReviewPage: (pages: unknown[]) => pages }));
vi.mock('@/src/core/i18n/localePreference', () => ({ reviewFallbackCopy: () => ({ copySuccess: 'Copied', copyFallback: 'Copy failed', noReadableImage: 'No image', cameraNoImage: 'No camera image', storageFull: () => 'Storage full', exportPaused: 'Export paused', noPdf: 'No PDF', exportFailed: 'Export failed', exportCancelled: 'Export cancelled', retryExport: 'Retry export' }) }));

import Review from '../app/review/[uri]';

describe('Review export persistence renderer', () => {
  beforeEach(() => {
    addScan.mockReset().mockRejectedValue(new Error('storage unavailable'));
    cleanupGeneratedExport.mockReset().mockResolvedValue(false);
    generatePDF.mockReset().mockResolvedValue('file:///documents/generated.pdf');
  });

  it('cleans the generated PDF and exposes the persistence error', async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Review />); });
    const exportButton = renderer!.root.findAllByType('button').find((button) => button.props.children === labels.exportSavePdf);
    expect(exportButton).toBeDefined();

    await act(async () => { await exportButton!.props.onPress(); });

    expect(cleanupGeneratedExport).toHaveBeenCalledWith('file:///documents/generated.pdf');
    expect(renderer!.root.findAllByType('text').some((node) => node.children.join('').includes('Export failed'))).toBe(true);
    expect(renderer!.root.findAllByType('text').some((node) => node.children.join('').includes('Cleanup retry guidance'))).toBe(true);
    const retryButton = renderer!.root.findAllByType('button').find((button) => button.props.children === labels.retryExport);
    expect(retryButton).toBeDefined();
    await act(async () => { await retryButton!.props.onPress(); });
    expect(generatePDF).toHaveBeenCalledTimes(2);
    act(() => renderer!.unmount());
  });
});
