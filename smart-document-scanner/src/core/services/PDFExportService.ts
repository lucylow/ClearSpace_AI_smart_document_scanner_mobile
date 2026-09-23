import { Platform, Share } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import { EventBus } from '../events/EventBus';
import { isValidExportUri, safeExportName } from './exportResult';
import { canSharePdf } from './shareResult';
import { ExportCancelledError } from './exportCancellation';

export type ExportStage = 'preparing' | 'processing' | 'writing' | 'complete' | 'cancelled' | 'failed';
export type ExportProgress = { completed: number; total: number; stage: ExportStage };
export type ExportOptions = { signal?: AbortSignal; onProgress?: (progress: ExportProgress) => void };

function isDemo(uri: string) {
  return uri.startsWith('demo://') || uri.startsWith('data:demo');
}

async function imageSource(uri: string) {
  if (uri.startsWith('data:')) return uri;
  if (Platform.OS === 'web') return uri;
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return `data:image/jpeg;base64,${base64}`;
  } catch {
    return uri;
  }
}

function emitExport(event: { type: 'export_started' | 'export_completed'; payload: Record<string, unknown> }) {
  try {
    EventBus.emit(event as never);
  } catch {
    // Analytics must never turn a completed or failed export into a second failure.
  }
}

function report(options: ExportOptions, progress: ExportProgress) {
  try {
    options.onProgress?.(progress);
  } catch {
    // UI progress callbacks must never break the export itself.
  }
}

function throwIfCancelled(signal?: AbortSignal) {
  if (signal?.aborted) throw new ExportCancelledError();
}

export class PDFExportService {
  static async generatePDF(uris: string[], name: string, options: ExportOptions = {}) {
    const valid = uris.filter(Boolean);
    if (valid.length === 0) throw new Error('No document pages are available to export.');
    if (Platform.OS === 'web' && valid.some(isDemo)) {
      report(options, { completed: valid.length, total: valid.length, stage: 'complete' });
      return valid[0];
    }

    const exportName = safeExportName(name);
    emitExport({ type: 'export_started', payload: { pages: valid.length, name: exportName } });
    report(options, { completed: 0, total: valid.length, stage: 'preparing' });

    try {
      const sources: string[] = [];
      for (let index = 0; index < valid.length; index += 1) {
        throwIfCancelled(options.signal);
        sources.push(await imageSource(valid[index]));
        report(options, { completed: index + 1, total: valid.length, stage: 'processing' });
      }
      throwIfCancelled(options.signal);
      report(options, { completed: valid.length, total: valid.length, stage: 'writing' });
      const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>@page{margin:0}body{margin:0;background:#fff}.page{width:100%;page-break-after:always;display:flex;align-items:center;justify-content:center;min-height:100vh}.page:last-child{page-break-after:auto}img{max-width:100%;max-height:100vh;object-fit:contain}</style></head><body>${sources.map((src) => `<section class="page"><img src="${src}" /></section>`).join('')}</body></html>`;
      const result = await Print.printToFileAsync({ html, width: 612, height: 792, margins: { top: 0, bottom: 0, left: 0, right: 0 } });
      throwIfCancelled(options.signal);
      const generated = isValidExportUri(result.uri) ? result.uri : '';
      if (!generated) throw new Error('The PDF service returned no usable file.');

      let uri = generated;
      if (FileSystem.documentDirectory) {
        const target = `${FileSystem.documentDirectory}${exportName}_${Date.now()}.pdf`;
        try {
          await FileSystem.moveAsync({ from: generated, to: target });
          uri = target;
        } catch {
          uri = generated;
        }
      }

      report(options, { completed: valid.length, total: valid.length, stage: 'complete' });
      emitExport({ type: 'export_completed', payload: { name: exportName, pages: valid.length, failed: false } });
      return uri;
    } catch (error) {
      const cancelled = error instanceof ExportCancelledError;
      report(options, { completed: 0, total: valid.length, stage: cancelled ? 'cancelled' : 'failed' });
      emitExport({ type: 'export_completed', payload: { name: exportName, pages: 0, failed: true, cancelled } });
      if (cancelled) throw error;
      throw new Error('PDF export failed. Please try again.');
    }
  }

  static async sharePDF(uri: string) {
    if (!canSharePdf(uri, Platform.OS === 'web' ? 'web' : Platform.OS === 'ios' ? 'ios' : 'android')) {
      throw new Error('PDF cannot be shared.');
    }
    if (Platform.OS !== 'web') await Share.share({ url: uri, message: 'Scanned document' });
    else await Share.share({ message: `Scanned document: ${uri}` });
  }
}
