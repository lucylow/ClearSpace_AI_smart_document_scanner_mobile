import { deriveEntitlements,EntitlementState,BillingTier } from './core'
import { isFresh,withExpiry,CachedEntitlements } from './safety'
import { StorageAdapter,asyncStorageAdapter } from '../core/storage/StorageAdapter'
const KEY='smart-scanner-entitlements'
type Persisted={state:{tier:BillingTier;credits:number;source:EntitlementState['source'];renewalAt?:number};cachedAt:number;expiresAt:number}
export async function saveEntitlementCache(state:EntitlementState,storage:StorageAdapter=asyncStorageAdapter,ttlMs=21600000){const cached=withExpiry(state,ttlMs);const value:Persisted={state:{tier:state.tier,credits:state.credits,source:state.source,renewalAt:state.renewalAt},cachedAt:cached.cachedAt,expiresAt:cached.expiresAt};await storage.set(KEY,JSON.stringify(value))}
export async function loadEntitlementCache(storage:StorageAdapter=asyncStorageAdapter,now=Date.now()):Promise<CachedEntitlements|null>{const raw=await storage.get(KEY);if(!raw)return null;try{const value=JSON.parse(raw) as Persisted;const state={...deriveEntitlements(value.state.tier,value.state.credits,value.state.source),renewalAt:value.state.renewalAt};const cached={state,cachedAt:value.cachedAt,expiresAt:value.expiresAt};return isFresh(cached,now)?cached:null}catch{return null}}
