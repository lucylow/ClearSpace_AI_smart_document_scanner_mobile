import { ScanRecord } from '../types'
export interface LegacyScan{id:string;title?:string;createdAt:number;thumbnailUri:string}
export interface MigrationResult{migrated:ScanRecord[];skipped:number}
function makeId(seed:string){let hash=0;for(let index=0;index<seed.length;index++)hash=((hash<<5)-hash)+seed.charCodeAt(index)|0;return `migrated-${Math.abs(hash)}`}
export function migrateLegacyScans(scans:LegacyScan[]):MigrationResult{const migrated:ScanRecord[]=[];let skipped=0;for(const scan of scans){if(!scan.id||!scan.thumbnailUri){skipped++;continue}const title=(scan.title||'Imported scan').trim()||'Imported scan';migrated.push({id:makeId(scan.id),title,createdAt:scan.createdAt,updatedAt:scan.createdAt,thumbnailUri:scan.thumbnailUri,isSynced:false,pages:[{id:`${makeId(scan.id)}-page`,originalUri:scan.thumbnailUri,processedUri:scan.thumbnailUri,filter:'original',width:1080,height:1440,createdAt:scan.createdAt}],favorite:false,tags:['imported']})}return{migrated,skipped}}
