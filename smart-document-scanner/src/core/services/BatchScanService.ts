import { ImageProcessingService } from './ImageProcessingService'
import { EdgePoints } from '../types'
export interface BatchItem{id:string;uri:string;edges?:EdgePoints;resultUri?:string;error?:string}
export class BatchScanService{async process(items:BatchItem[],enhance=true){const results:BatchItem[]=[];for(const item of items){try{const warped=item.edges?await ImageProcessingService.applyWarp(item.uri,item.edges):item.uri;const output=enhance?await ImageProcessingService.enhanceImage(warped):warped;results.push({...item,resultUri:output})}catch(error){results.push({...item,error:error instanceof Error?error.message:'Unknown processing error'})}}return results}}
