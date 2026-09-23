export function pendingPurchaseCopy(productId:string){return`Your purchase for ${productId} is still being processed. Restore purchases before trying again.`}
export function canRefreshStore(now:number,lastRefreshAt:number|null,windowMs=30_000){return lastRefreshAt===null||now-lastRefreshAt>=windowMs}
export function refreshWaitCopy(windowMs=30_000){return`Store status was just refreshed. Try again in ${Math.ceil(windowMs/1000)} seconds.`}
