import { asyncStorageAdapter,StorageAdapter } from '../storage/StorageAdapter'
import { AppLockModel,initialLockModel } from './AppLock'
const KEY='smart-scanner.app-lock.v1'
export async function loadAppLock(storage:StorageAdapter=asyncStorageAdapter){try{const raw=await storage.get(KEY);if(!raw)return initialLockModel;const parsed=JSON.parse(raw) as Partial<AppLockModel>;return{...initialLockModel,...parsed}}catch{return initialLockModel}}
export async function saveAppLock(model:AppLockModel,storage:StorageAdapter=asyncStorageAdapter){await storage.set(KEY,JSON.stringify(model));return model}
