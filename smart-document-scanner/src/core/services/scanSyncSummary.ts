import { ScanRecord } from '../types'
export interface ScanSyncSummary{total:number;synced:number;pending:number;attention:number;label:string}
export function summarizeScanSync(scans:ScanRecord[]):ScanSyncSummary{const synced=scans.filter(scan=>scan.isSynced).length;const pending=scans.length-synced;const attention=scans.filter(scan=>Boolean(scan.pdfUri)&&!scan.isSynced).length;return{total:scans.length,synced,pending,attention,label:attention?'Some exports need sync review':pending?'Local changes pending':'All documents are current'}}
