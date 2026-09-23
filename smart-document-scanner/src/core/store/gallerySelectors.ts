import { ScanRecord } from '../types';
export function filterAndSortScans(scans:ScanRecord[],query:string,favoritesOnly:boolean,newestFirst:boolean){return scans.filter(scan=>scan.title.toLowerCase().includes(query.trim().toLowerCase())).filter(scan=>!favoritesOnly||Boolean(scan.favorite)).slice().sort((a,b)=>(newestFirst?b.updatedAt-a.updatedAt:a.updatedAt-b.updatedAt))}
