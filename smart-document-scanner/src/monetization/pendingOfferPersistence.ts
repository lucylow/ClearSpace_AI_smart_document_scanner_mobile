import type { StorageAdapter } from '../core/storage/StorageAdapter'
const KEY='smart-scanner-pending-offer'
export type PendingOffer={productId:string;startedAt:number}
export async function loadPendingOffer(storage:StorageAdapter):Promise<PendingOffer|null>{const raw=await storage.get(KEY);if(!raw)return null;try{const parsed=JSON.parse(raw) as Partial<PendingOffer>;return typeof parsed.productId==='string'&&typeof parsed.startedAt==='number'?{productId:parsed.productId,startedAt:parsed.startedAt}:null}catch{return null}}
export async function savePendingOffer(productId:string,storage:StorageAdapter,startedAt=Date.now()){const marker={productId,startedAt};await storage.set(KEY,JSON.stringify(marker));return marker}
export async function clearPendingOffer(storage:StorageAdapter){await storage.remove(KEY)}
