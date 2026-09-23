export type CreditReason='monthly_reset'|'export'|'rewarded_ad'|'purchase'|'promo'|'refund'
export interface CreditEntry{id:string;delta:number;reason:CreditReason;createdAt:number;reference?:string}
export class CreditLedger{private entries:CreditEntry[]=[];constructor(entries:CreditEntry[]=[]){this.entries=[...entries]}add(delta:number,reason:CreditReason,reference?:string){const entry={id:`cr_${Date.now()}_${this.entries.length}`,delta,reason,createdAt:Date.now(),reference};this.entries.push(entry);return entry}balance(){return this.entries.reduce((sum,entry)=>sum+entry.delta,0)}history(){return[...this.entries].reverse()}}
export interface CreditPolicy{monthlyFree:number;rewardedAd:number;maxAdRewardsPerDay:number;exportCost:number;maxBalance:number}
export const DEFAULT_CREDIT_POLICY:CreditPolicy={monthlyFree:5,rewardedAd:3,maxAdRewardsPerDay:3,exportCost:1,maxBalance:100}
export const canSpend=(balance:number,cost:number)=>cost>0&&balance>=cost
export const capBalance=(balance:number,policy=DEFAULT_CREDIT_POLICY)=>Math.min(balance,policy.maxBalance)
export interface AdPolicy{enabled:boolean;rewardCredits:number;dailyCap:number;cooldownMs:number}
export const DEFAULT_AD_POLICY:AdPolicy={enabled:true,rewardCredits:3,dailyCap:3,cooldownMs:30000}
export interface AdRewardState{day:string;count:number;lastRewardAt?:number}
export const canShowReward=(state:AdRewardState,policy=DEFAULT_AD_POLICY,now=Date.now())=>{const day=new Date(now).toISOString().slice(0,10);return policy.enabled&&(day===state.day?state.count:0)<policy.dailyCap&&(!state.lastRewardAt||now-state.lastRewardAt>=policy.cooldownMs)}
export interface RewardAttribution{placement:string;sessionId:string;rewardCredits:number;shownAt:number;completedAt?:number}
export const completeReward=(attribution:RewardAttribution)=>({...attribution,completedAt:Date.now()})
export const isValidReward=(attribution:RewardAttribution,maxAgeMs=600000)=>{const completedAt=attribution.completedAt;if(completedAt===undefined)return false;const age=completedAt-attribution.shownAt;return age>=0&&age<=maxAgeMs}
export type PurchaseStatus='idle'|'loading'|'success'|'cancelled'|'failed'
export interface PurchaseState{status:PurchaseStatus;productId?:string;error?:string;startedAt?:number;completedAt?:number}
export const idlePurchase:PurchaseState={status:'idle'}
export const beginPurchase=(productId:string):PurchaseState=>({status:'loading',productId,startedAt:Date.now()})
export const completePurchase=(state:PurchaseState):PurchaseState=>({...state,status:'success',completedAt:Date.now()})
export interface FriendlyPurchaseError{code:'cancelled'|'network'|'store_unavailable'|'already_owned'|'pending'|'unknown';title:string;message:string;retryable:boolean}
export const mapPurchaseError=(error:unknown):FriendlyPurchaseError=>{const code=String((error as {code?:unknown})?.code||'unknown');if(code.includes('cancel'))return{code:'cancelled',title:'Purchase cancelled',message:'No changes were made.',retryable:false};if(code.includes('network'))return{code:'network',title:'Connection problem',message:'Check your connection and try again.',retryable:true};return{code:'unknown',title:'Purchase failed',message:'Please try again or restore purchases.',retryable:true}}
export interface RestoreResult{restored:boolean;tier:'free'|'monthly'|'yearly'|'lifetime';products:string[]}
export const resolveRestoredProducts=(ids:string[]):RestoreResult=>ids.includes('pro_lifetime')?{restored:true,tier:'lifetime',products:ids}:ids.includes('pro_yearly')?{restored:true,tier:'yearly',products:ids}:ids.includes('pro_monthly')?{restored:true,tier:'monthly',products:ids}:{restored:false,tier:'free',products:ids}
export interface CachedEntitlements{state:import('./core').EntitlementState;cachedAt:number;expiresAt:number}
export const withExpiry=(state:CachedEntitlements['state'],ttlMs=21600000):CachedEntitlements=>{const now=Date.now();return{state,cachedAt:now,expiresAt:now+ttlMs}}
export const isFresh=(cache:CachedEntitlements,now=Date.now())=>now<cache.expiresAt
