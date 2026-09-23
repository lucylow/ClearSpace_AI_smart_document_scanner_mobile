export interface CleanupCandidate{ id:string;title:string;updatedAt:number;favorite?:boolean }
export function selectCleanupCandidates<T extends CleanupCandidate>(documents:T[],limit=10){return documents.filter(document=>!document.favorite).sort((a,b)=>a.updatedAt-b.updatedAt).slice(0,Math.max(0,limit))}
