import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const { addScan, cleanupGeneratedExport, generatePDF, launchImageLibraryAsync, processBatch } = vi.hoisted(() => ({
  addScan: vi.fn(),
  cleanupGeneratedExport: vi.fn(),
  generatePDF: vi.fn(),
  launchImageLibraryAsync: vi.fn(),
  processBatch: vi.fn(),
}));

const copy = {
  disabled: 'Batch disabled', noReadablePhotos: 'No photos', readyToProcess: (count: number) => `Ready ${count}`,
  chooseFailed: (reason: string) => `Choose failed: ${reason}`, permissionFallback: 'Permission fallback', selectBeforeProcess: 'Select before process',
  processFailed: (reason: string) => `Process failed: ${reason}`, processFallback: 'Process fallback', attention: 'Attention', complete: 'Complete',
  noFailedPages: 'No failed pages', processBeforeExport: 'Process before export', exportFailed: (reason: string) => `Export failed: ${reason}`,
  exportFallback: 'Export fallback', exported: 'Exported', page: (number: number) => `Page ${number}`, needsAttention: 'Needs attention', processed: 'Processed',
  waiting: 'Waiting', error: 'Error', ready: 'Ready', queued: 'Queued', title: 'Batch Scan', subtitle: 'Create a document', pages: (count: number) => `${count} pages`,
  choosePages: 'Choose pages', chooseDescription: 'Choose photos', choosePhotos: 'Choose photos', selected: (count: number) => `${count} selected`, progress: (done: number, total: number) => `${done}/${total}`,
  retry: 'Retry', process: 'Process', export: (count: number) => `Export ${count}`, queue: 'Queue', reviewReady: 'Review ready', noPages: 'No pages', emptyTitle: 'Empty', emptyDescription: 'Choose photos', back: 'Back',
};

vi.mock('react-native', () => ({ AccessibilityInfo: { announceForAccessibility: vi.fn() }, Pressable: 'pressable', StyleSheet: { create: (styles: unknown) => styles }, Text: 'text', View: 'view', FlatList: ({ data, renderItem, keyExtractor }: any) => React.createElement('flat-list', null, data.map((item: any, index: number) => React.cloneElement(renderItem({ item, index }), { key: keyExtractor?.(item, index) ?? index }))) }));
vi.mock('react-native-paper', () => ({
  Button: ({ children, onPress, disabled, ...props }: any) => React.createElement('button', { ...props, onPress, disabled }, children),
  Card: Object.assign(({ children }: any) => React.createElement('card', null, children), { Content: ({ children }: any) => React.createElement('card-content', null, children) }),
  ProgressBar: () => null,
}));
vi.mock('expo-image-picker', () => ({ launchImageLibraryAsync }));
vi.mock('expo-router', () => ({ router: { back: vi.fn() } }));
vi.mock('@/components/screen-container', () => ({ ScreenContainer: ({ children }: any) => React.createElement('screen', null, children) }));
vi.mock('@/src/core/services/BatchScanService', () => ({ BatchScanService: class { process = processBatch; } }));
vi.mock('@/src/core/services/PDFExportService', () => ({ PDFExportService: { generatePDF, sharePDF: vi.fn() } }));
vi.mock('@/src/core/services/exportArtifactCleanup', () => ({ cleanupGeneratedExport }));
vi.mock('@/src/core/services/exportCleanupNotice', () => ({ exportCleanupFailureGuidance: () => 'Cleanup retry guidance' }));
vi.mock('@/src/core/services/exportRetryAccessibility', () => ({ exportRetryAccessibilityCopy: () => ({ started: 'Retry started', succeeded: 'Retry succeeded', failed: 'Retry failed' }) }));
vi.mock('@/src/core/services/exportRetryLabels', () => ({ exportRetryLabel: () => 'Retry export' }));
vi.mock('@/src/core/store/scanStore', () => ({ useScanStore: (selector: (state: any) => unknown) => selector({ add: addScan }) }));
vi.mock('@/src/core/utils/id', () => ({ makeId: () => 'batch-id' }));
vi.mock('@/src/core/flags/FeatureFlags', () => ({ getFlags: () => ({ batchScan: true }) }));
vi.mock('@/src/core/i18n/AppLocaleProvider', () => ({ useAppLocale: () => ({ locale: 'en-US' }) }));
vi.mock('@/src/core/i18n/localePreference', () => ({ batchCopy: () => copy }));
vi.mock('@/src/core/errors/errorMessage', () => ({ safeErrorMessage: (reason: unknown) => reason instanceof Error ? reason.message : 'failure', isAbortError: () => false }));

import BatchScan from '../app/batch-scan';

describe('Batch Scan export persistence renderer', () => {
  beforeEach(() => {
    addScan.mockReset().mockRejectedValue(new Error('storage unavailable'));
    cleanupGeneratedExport.mockReset().mockResolvedValue(false);
    generatePDF.mockReset().mockResolvedValue('file:///documents/batch-generated.pdf');
    launchImageLibraryAsync.mockReset().mockResolvedValue({ canceled: false, assets: [{ uri: 'file:///photo.jpg' }] });
    processBatch.mockReset().mockImplementation(async (selected: Array<{ id: string; uri: string }>) => selected.map((item) => ({ ...item, resultUri: 'file:///processed.jpg' })));
  });

  it('cleans the generated PDF and exposes the batch export error', async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<BatchScan />); });

    const button = (label: string) => renderer!.root.findAllByType('button').find((node) => node.props.children === label);
    await act(async () => { await button(copy.choosePhotos)!.props.onPress(); });
    await act(async () => { await button(copy.process)!.props.onPress(); });
    await act(async () => { await button(copy.export(1))!.props.onPress(); });

    expect(cleanupGeneratedExport).toHaveBeenCalledWith('file:///documents/batch-generated.pdf');
    expect(renderer!.root.findAllByType('text').some((node) => node.children.join('').includes('Export failed'))).toBe(true);
    expect(renderer!.root.findAllByType('text').some((node) => node.children.join('').includes('Cleanup retry guidance'))).toBe(true);
    const retryButton = button('Retry export');
    expect(retryButton).toBeDefined();
    await act(async () => { await retryButton!.props.onPress(); });
    expect(generatePDF).toHaveBeenCalledTimes(2);
    act(() => renderer!.unmount());
  });
});
