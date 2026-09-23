export type ReviewPageState={source:string;preview:string;filter:string}
export function removeReviewPage<T extends ReviewPageState>(pages:T[],index:number){if(pages.length<=1)return pages;return pages.filter((_,pageIndex)=>pageIndex!==index)}
export function appendReviewPage<T extends ReviewPageState>(pages:T[],page:T){return [...pages,page]}
export function selectedPageIndex<T>(pages:T[],index:number){return pages.length?Math.max(0,Math.min(index,pages.length-1)):0}
export function moveReviewPage<T>(pages:T[],from:number,to:number){if(from<0||to<0||from>=pages.length||to>=pages.length||from===to)return pages;const next=[...pages];const [item]=next.splice(from,1);next.splice(to,0,item);return next}
