export type ScanSessionStatus='idle'|'capturing'|'processing'|'ready'|'failed';
export type ScanSession={status:ScanSessionStatus;uri?:string;error?:string}
export function beginCapture():ScanSession{return{status:'capturing'}}
export function beginProcessing(uri:string):ScanSession{return{status:'processing',uri}}
export function completeProcessing(uri:string):ScanSession{return{status:'ready',uri}}
export function failProcessing(error:string):ScanSession{return{status:'failed',error}}
export function resetSession():ScanSession{return{status:'idle'}}
