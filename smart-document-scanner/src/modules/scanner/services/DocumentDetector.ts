import { EdgePoints } from '@/src/core/types';
export interface DocumentDetector{detect(uri:string):Promise<EdgePoints|null>}
export class HeuristicDocumentDetector implements DocumentDetector{async detect(_uri:string){return{topLeft:{x:.12,y:.12},topRight:{x:.88,y:.12},bottomRight:{x:.88,y:.88},bottomLeft:{x:.12,y:.88}}}}
export class NativeDocumentDetector implements DocumentDetector{constructor(private readonly fallback:DocumentDetector=new HeuristicDocumentDetector()){}async detect(uri:string){return this.fallback.detect(uri)}}
