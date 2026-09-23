import { PRODUCT_CATALOG } from './core'
import type { StorageAdapter } from '../core/storage/StorageAdapter'
const KEY='smart-scanner-selected-offer'
const fallback=PRODUCT_CATALOG.find(product=>product.id==='pro_yearly')?.id??'pro_yearly'
export async function loadSelectedOffer(storage:StorageAdapter):Promise<string>{const value=await storage.get(KEY);return value&&PRODUCT_CATALOG.some(product=>product.id===value)?value:fallback}
export async function saveSelectedOffer(id:string,storage:StorageAdapter):Promise<string>{const valid=PRODUCT_CATALOG.some(product=>product.id===id)?id:fallback;await storage.set(KEY,valid);return valid}
