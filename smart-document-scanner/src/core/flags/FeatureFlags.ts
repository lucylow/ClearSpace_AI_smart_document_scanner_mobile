export interface FeatureFlags { ocr:boolean; cloudBackup:boolean; biometricLock:boolean; batchScan:boolean; experimentalCrop:boolean }
export const DEFAULT_FLAGS:FeatureFlags={ocr:true,cloudBackup:false,biometricLock:false,batchScan:true,experimentalCrop:false}
let flags:FeatureFlags={...DEFAULT_FLAGS}
export function getFlags():FeatureFlags{return {...flags}}
export function setFlags(next:Partial<FeatureFlags>):FeatureFlags{flags={...flags,...next};return getFlags()}
export function resetFlags():FeatureFlags{flags={...DEFAULT_FLAGS};return getFlags()}
