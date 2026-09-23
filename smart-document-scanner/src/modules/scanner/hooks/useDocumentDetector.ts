import { useState } from 'react';
import { EdgePoints } from '@/src/core/types';
import { DocumentDetector,NativeDocumentDetector } from '../services/DocumentDetector';
import { assessDetectorQuality } from '../services/DetectorQuality';
import { beginProcessing,failProcessing,resetSession,ScanSession } from '../session/scanSession';
export function useDocumentDetector(detector:DocumentDetector=new NativeDocumentDetector()){const [edges,setEdges]=useState<EdgePoints|null>(null);const [session,setSession]=useState<ScanSession>(resetSession());const quality=assessDetectorQuality(edges);const detect=async(uri:string)=>{setSession(beginProcessing(uri));try{const next=await detector.detect(uri);setEdges(next);setSession(next?{status:'ready',uri}:failProcessing('Document edges were not found'));return next}catch(error){setSession(failProcessing(error instanceof Error?error.message:'Document detection failed'));return null}};return {edges,quality,session,detect};}
