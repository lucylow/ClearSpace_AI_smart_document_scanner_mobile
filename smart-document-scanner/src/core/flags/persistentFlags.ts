import { asyncStorageAdapter,StorageAdapter } from '../storage/StorageAdapter'
import { DEFAULT_FLAGS,FeatureFlags,getFlags,setFlags } from './FeatureFlags'
const KEY='smart-scanner.feature-flags.v1'
export async function loadPersistentFlags(storage:StorageAdapter=asyncStorageAdapter){try{const raw=await storage.get(KEY);if(!raw)return getFlags();const parsed=JSON.parse(raw) as Partial<FeatureFlags>;return setFlags(parsed)}catch{return getFlags()}}
export async function savePersistentFlags(flags:Partial<FeatureFlags>,storage:StorageAdapter=asyncStorageAdapter){const next=setFlags(flags);await storage.set(KEY,JSON.stringify(next));return next}
export async function resetPersistentFlags(storage:StorageAdapter=asyncStorageAdapter){const next=setFlags(DEFAULT_FLAGS);await storage.remove(KEY);return next}
