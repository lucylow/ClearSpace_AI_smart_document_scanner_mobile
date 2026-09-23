from pathlib import Path

ROOT = Path('/home/ubuntu/smart-document-scanner')
FILES = {
'src/core/types.ts': '''export type ScanFilter = 'original' | 'bw' | 'grayscale' | 'enhanced';
export type EdgePoints = { topLeft:{x:number;y:number}; topRight:{x:number;y:number}; bottomRight:{x:number;y:number}; bottomLeft:{x:number;y:number} };
export type ScanPage = { id:string; originalUri:string; processedUri:string; filter:ScanFilter; width:number; height:number; createdAt:number };
export type ScanRecord = { id:string; title:string; createdAt:number; updatedAt:number; thumbnailUri:string; isSynced:boolean; pages:ScanPage[]; pdfUri?:string; favorite?:boolean; tags?:string[] };
''',
'src/core/utils/id.ts': '''export function makeId(prefix='id'){ return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }\n''',
'src/core/store/scanStore.ts': '''import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { ScanRecord } from '../types';
const KEY='smart-scanner-scans';
type State={ scans:ScanRecord[]; activeScan:ScanRecord|null; hydrate:()=>Promise<void>; add:(scan:ScanRecord)=>Promise<void>; remove:(id:string)=>Promise<void>; setActive:(scan:ScanRecord|null)=>void; update:(id:string,patch:Partial<ScanRecord>)=>Promise<void> };
async function persist(scans:ScanRecord[]){ await AsyncStorage.setItem(KEY,JSON.stringify(scans)); }
export const useScanStore=create<State>((set,get)=>({scans:[],activeScan:null,hydrate:async()=>{const raw=await AsyncStorage.getItem(KEY);set({scans:raw?JSON.parse(raw):[]});},add:async(scan)=>{const scans=[scan,...get().scans];set({scans,activeScan:scan});await persist(scans);},remove:async(id)=>{const scans=get().scans.filter(x=>x.id!==id);set({scans,activeScan:get().activeScan?.id===id?null:get().activeScan});await persist(scans);},setActive:(activeScan)=>set({activeScan}),update:async(id,patch)=>{const scans=get().scans.map(x=>x.id===id?{...x,...patch,updatedAt:Date.now()}:x);set({scans,activeScan:get().activeScan?.id===id?{...get().activeScan!,...patch,updatedAt:Date.now()}:get().activeScan});await persist(scans);}}));
''',
'src/core/store/userStore.ts': '''import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
const KEY='smart-scanner-user';
type State={isPro:boolean;subscriptionTier:string;credits:number;hydrate:()=>Promise<void>;consumeCredit:()=>boolean;addCredits:(n:number)=>Promise<void>;setPro:(value:boolean)=>Promise<void>};
export const useUserStore=create<State>((set,get)=>({isPro:false,subscriptionTier:'free',credits:5,hydrate:async()=>{const raw=await AsyncStorage.getItem(KEY);if(raw)set(JSON.parse(raw));},consumeCredit:()=>{if(get().isPro)return true;const next=get().credits-1;if(next<0)return false;set({credits:next});void AsyncStorage.setItem(KEY,JSON.stringify({...get(),credits:next}));return true;},addCredits:async(n)=>{const credits=get().credits+n;set({credits});await AsyncStorage.setItem(KEY,JSON.stringify({...get(),credits}));},setPro:async(isPro)=>{set({isPro,subscriptionTier:isPro?'pro':'free'});await AsyncStorage.setItem(KEY,JSON.stringify({...get(),isPro,subscriptionTier:isPro?'pro':'free'}));}}));
''',
'src/core/services/ImageProcessingService.ts': '''import { ScanFilter, EdgePoints } from '../types';
export class ImageProcessingService { static async filter(uri:string,_filter:ScanFilter){return uri;} static async applyWarp(uri:string,_edges:EdgePoints){return uri;} static async enhanceImage(uri:string){return uri;} }
''',
'src/core/services/PDFExportService.ts': '''import { Platform, Share } from 'react-native';
export class PDFExportService { static async generatePDF(uris:string[],_name:string){return uris[0] ?? ''; } static async sharePDF(uri:string){if(Platform.OS!=='web')await Share.share({url:uri,message:'Scanned document'});else await Share.share({message:`Scanned document: ${uri}`});} }
''',
'src/modules/scanner/hooks/useDocumentDetector.ts': '''import { useState } from 'react';
import { EdgePoints } from '@/src/core/types';
export function useDocumentDetector(){const [edges,setEdges]=useState<EdgePoints|null>(null);const detect=async(_uri:string)=>{setEdges({topLeft:{x:.12,y:.12},topRight:{x:.88,y:.12},bottomRight:{x:.88,y:.88},bottomLeft:{x:.12,y:.88}});return edges;};return {edges,detect};}
''',
'src/modules/scanner/components/EdgeOverlay.tsx': '''import React from 'react'; import { View,StyleSheet } from 'react-native'; import { EdgePoints } from '@/src/core/types';
export function EdgeOverlay({points}:{points:EdgePoints|null}){return <View pointerEvents="none" style={StyleSheet.absoluteFill}><View style={styles.frame}/></View>}; const styles=StyleSheet.create({frame:{position:'absolute',left:'10%',right:'10%',top:'20%',bottom:'20%',borderColor:'#8B9CFF',borderWidth:2,borderRadius:18}});
''',
'src/modules/scanner/components/ShutterButton.tsx': '''import React from 'react'; import { Pressable,View,StyleSheet } from 'react-native';
export function ShutterButton({onPress,disabled}:{onPress:()=>void;disabled?:boolean}){return <Pressable onPress={onPress} disabled={disabled} style={({pressed})=>[styles.outer,pressed&&styles.pressed,disabled&&styles.disabled]}><View style={styles.inner}/></Pressable>}; const styles=StyleSheet.create({outer:{width:82,height:82,borderRadius:41,borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center'},inner:{width:64,height:64,borderRadius:32,backgroundColor:'#fff'},pressed:{transform:[{scale:.96}]},disabled:{opacity:.5}});
''',
'src/modules/scanner/components/CreditCounter.tsx': '''import React from 'react'; import { Text,StyleSheet } from 'react-native'; import { useUserStore } from '@/src/core/store/userStore';
export function CreditCounter(){const pro=useUserStore(s=>s.isPro),credits=useUserStore(s=>s.credits);return <Text style={styles.text}>{pro?'PRO':'Credits'} · {pro?'∞':credits}</Text>}; const styles=StyleSheet.create({text:{color:'#fff',fontWeight:'700',backgroundColor:'#122033CC',paddingHorizontal:12,paddingVertical:7,borderRadius:16}});
''',
'src/modules/scanner/components/FilterBar.tsx': '''import React from 'react'; import { Pressable,Text,View,StyleSheet } from 'react-native'; import { ScanFilter } from '@/src/core/types';
const filters:ScanFilter[]=['original','bw','grayscale','enhanced']; export function FilterBar({value,onChange}:{value:ScanFilter;onChange:(f:ScanFilter)=>void}){return <View style={styles.row}>{filters.map(f=><Pressable key={f} onPress={()=>onChange(f)} style={[styles.item,value===f&&styles.active]}><Text style={[styles.label,value===f&&styles.activeLabel]}>{f}</Text></Pressable>)}</View>}; const styles=StyleSheet.create({row:{flexDirection:'row',gap:8},item:{paddingHorizontal:12,paddingVertical:9,borderRadius:14,backgroundColor:'#E8EDF5'},active:{backgroundColor:'#4F46E5'},label:{fontSize:12,color:'#667085',textTransform:'capitalize'},activeLabel:{color:'#fff',fontWeight:'700'}});
''',
'app/_layout.tsx': '''import 'react-native-reanimated'; import React,{useEffect} from 'react'; import { Stack } from 'expo-router'; import { ThemeProvider } from '@/lib/theme-provider'; import { useScanStore } from '@/src/core/store/scanStore'; import { useUserStore } from '@/src/core/store/userStore';
export default function RootLayout(){const hydrateScans=useScanStore(s=>s.hydrate),hydrateUser=useUserStore(s=>s.hydrate);useEffect(()=>{void hydrateScans();void hydrateUser();},[hydrateScans,hydrateUser]);return <ThemeProvider><Stack screenOptions={{headerShown:false}}><Stack.Screen name="(tabs)"/><Stack.Screen name="review/[uri]"/><Stack.Screen name="document/[id]"/><Stack.Screen name="preview"/></Stack></ThemeProvider>}
''',
'app/(tabs)/_layout.tsx': '''import React from 'react'; import { Tabs } from 'expo-router'; import { useColors } from '@/hooks/use-colors'; import { IconSymbol } from '@/components/ui/icon-symbol';
export default function TabLayout(){const colors=useColors();return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:colors.tint}}><Tabs.Screen name="index" options={{title:'Scan',tabBarIcon:({color})=><IconSymbol name="camera.fill" size={25} color={color}/>}}/><Tabs.Screen name="gallery" options={{title:'Documents',tabBarIcon:({color})=><IconSymbol name="doc.text.fill" size={24} color={color}/>}}/><Tabs.Screen name="settings" options={{title:'Pro',tabBarIcon:({color})=><IconSymbol name="sparkles" size={24} color={color}/>}}/></Tabs>}
''',
'app/(tabs)/index.tsx': '''import React,{useEffect,useRef,useState} from 'react'; import { Pressable,StyleSheet,Text,View } from 'react-native'; import { router } from 'expo-router'; import { ScreenContainer } from '@/components/screen-container'; import { EdgeOverlay } from '@/src/modules/scanner/components/EdgeOverlay'; import { ShutterButton } from '@/src/modules/scanner/components/ShutterButton'; import { CreditCounter } from '@/src/modules/scanner/components/CreditCounter'; import { useDocumentDetector } from '@/src/modules/scanner/hooks/useDocumentDetector'; import { useUserStore } from '@/src/core/store/userStore';
export default function ScanScreen(){const {edges,detect}=useDocumentDetector();const consume=useUserStore(s=>s.consumeCredit);const [busy,setBusy]=useState(false);const capture=async()=>{if(busy)return;if(!consume()){router.push('/settings');return;}setBusy(true);const uri=`demo://scan-${Date.now()}`;await detect(uri);router.push({pathname:'/review/[uri]',params:{uri:encodeURIComponent(uri)}});setBusy(false)};return <ScreenContainer edges={['top','bottom','left','right']} containerClassName="bg-black"><View style={styles.root}><View style={styles.top}><CreditCounter/><Text style={styles.hint}>Align the document inside the frame</Text><Text style={styles.sub}>Good lighting and a flat surface improve results.</Text></View><EdgeOverlay points={edges}/><View style={styles.center}><Text style={styles.cameraLabel}>CAMERA PREVIEW</Text><Text style={styles.cameraSub}>Ready to capture</Text></View><View style={styles.bottom}><Pressable onPress={()=>router.push('/advanced-scan')}><Text style={styles.advanced}>Advanced scan</Text></Pressable><ShutterButton onPress={capture} disabled={busy}/><Text style={styles.status}>{busy?'Processing…':'Tap to capture'}</Text></View></View></ScreenContainer>}; const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#0B1220'},top:{alignItems:'center',gap:10,paddingTop:24},hint:{color:'#fff',fontSize:16,fontWeight:'700'},sub:{color:'#B8C2D9',fontSize:13},center:{flex:1,alignItems:'center',justifyContent:'center'},cameraLabel:{color:'#8B9CFF',fontSize:15,fontWeight:'800',letterSpacing:1.5},cameraSub:{color:'#8290A8',marginTop:8},bottom:{alignItems:'center',gap:14,paddingBottom:24},advanced:{color:'#C7D2FE',fontWeight:'700'},status:{color:'#AEB9CC',fontSize:13}});
''',
}
for rel, text in FILES.items():
    path=ROOT/rel; path.parent.mkdir(parents=True,exist_ok=True); path.write_text(text)
print(f'Wrote {len(FILES)} files')
''
