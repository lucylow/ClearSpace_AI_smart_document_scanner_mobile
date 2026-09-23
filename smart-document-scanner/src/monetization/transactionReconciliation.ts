type BillingProviderLike={restore():Promise<{status:'restored'|'already_active'|'none';state:unknown;products:string[]}>}
type PendingOfferLike={productId:string;startedAt:number}
type RestoreResult=Awaited<ReturnType<BillingProviderLike['restore']>>
export type ReconciliationResult={status:'reconciled'|'still-pending'|'not-needed';restore:RestoreResult|null}
export async function reconcilePendingPurchase(provider:BillingProviderLike,pending:PendingOfferLike|null):Promise<ReconciliationResult>{if(!pending)return{status:'not-needed',restore:null};const restore=await provider.restore();if(restore.status!=='none')return{status:'reconciled',restore};return{status:'still-pending',restore}}
export function supportsBackgroundTransactionReconciliation(platform:'web'|'native'='native'){return platform!=='web'}
