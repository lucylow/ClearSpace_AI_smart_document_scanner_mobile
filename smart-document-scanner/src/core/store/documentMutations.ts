import { ScanRecord } from '../types';
export function renameDocument(scans:ScanRecord[],id:string,title:string){const next=title.trim();if(!next)return scans;return scans.map(scan=>scan.id===id?{...scan,title:next,updatedAt:Date.now()}:scan)}
export function toggleDocumentFavorite(scans:ScanRecord[],id:string){return scans.map(scan=>scan.id===id?{...scan,favorite:!scan.favorite,updatedAt:Date.now()}:scan)}
export function deleteDocument(scans:ScanRecord[],id:string){return scans.filter(scan=>scan.id!==id)}
