export type LockState='disabled'|'locked'|'unlocked'|'unavailable'
export type FallbackPolicy='allow-device-passcode'|'allow-web-fallback'|'deny'
export interface AppLockModel{enabled:boolean;state:LockState;lastUnlockedAt?:number;timeoutMs:number;fallbackPolicy:FallbackPolicy}
export const initialLockModel:AppLockModel={enabled:false,state:'disabled',timeoutMs:5*60*1000,fallbackPolicy:'allow-device-passcode'}
export function enableLock(model:AppLockModel):AppLockModel{return{...model,enabled:true,state:'locked'}}
export function disableLock(model:AppLockModel):AppLockModel{return{...model,enabled:false,state:'disabled'}}
export function lock(model:AppLockModel):AppLockModel{return model.enabled?{...model,state:'locked'}:model}
export function unlock(model:AppLockModel,now=Date.now()):AppLockModel{return model.enabled?{...model,state:'unlocked',lastUnlockedAt:now}:model}
export function markUnavailable(model:AppLockModel):AppLockModel{return{...model,state:model.enabled?'unavailable':'disabled'}}
export function isExpired(model:AppLockModel,now=Date.now()):boolean{return model.enabled&&model.state==='unlocked'&&Boolean(model.lastUnlockedAt)&&now-model.lastUnlockedAt!>=model.timeoutMs}
export function setTimeoutMs(model:AppLockModel,timeoutMs:number):AppLockModel{return{...model,timeoutMs:Math.max(0,timeoutMs)}}
export function setFallbackPolicy(model:AppLockModel,fallbackPolicy:FallbackPolicy):AppLockModel{return{...model,fallbackPolicy}}
