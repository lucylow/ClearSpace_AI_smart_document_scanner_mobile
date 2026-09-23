import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';
import { ScanFilter,EdgePoints } from '../types';
import { isUsableImageUri } from './UriService';
const MAX_WIDTH=1800;
function isProcessable(uri:string){return isUsableImageUri(uri)}
async function run(uri:string,actions:ImageManipulator.Action[],compress=.86){if(!isProcessable(uri))return uri;try{const result=await ImageManipulator.manipulateAsync(uri,actions,{compress,format:ImageManipulator.SaveFormat.JPEG});return result.uri}catch{return uri}}
export class ImageProcessingService{
 static async filter(uri:string,filter:ScanFilter){
  if(filter==='original')return uri;
  if(filter==='enhanced')return this.enhanceImage(uri);
  if(filter==='bw'||filter==='grayscale')return run(uri,[{resize:{width:MAX_WIDTH}}],.92);
  return uri;
 }
 static async applyWarp(uri:string,edges:EdgePoints){
  if(!isProcessable(uri))return uri;
  try{const size=await new Promise<{width:number;height:number}>((resolve,reject)=>Image.getSize(uri,(width,height)=>resolve({width,height}),reject));const left=Math.max(0,Math.floor(Math.min(edges.topLeft.x,edges.bottomLeft.x)*size.width));const top=Math.max(0,Math.floor(Math.min(edges.topLeft.y,edges.topRight.y)*size.height));const right=Math.min(size.width,Math.ceil(Math.max(edges.topRight.x,edges.bottomRight.x)*size.width));const bottom=Math.min(size.height,Math.ceil(Math.max(edges.bottomLeft.y,edges.bottomRight.y)*size.height));if(right<=left||bottom<=top)return uri;return run(uri,[{crop:{originX:left,originY:top,width:right-left,height:bottom-top}},{resize:{width:MAX_WIDTH}}],.9)}catch{return uri}
 }
 static async enhanceImage(uri:string){return run(uri,[{resize:{width:MAX_WIDTH}}],.9)}
 static async rotate(uri:string,degrees:number){return run(uri,[{rotate:degrees}],.92)}
}
