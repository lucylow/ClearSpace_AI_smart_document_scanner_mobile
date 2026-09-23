export type ScanFilter = 'original' | 'bw' | 'grayscale' | 'enhanced';
export type EdgePoints = { topLeft:{x:number;y:number}; topRight:{x:number;y:number}; bottomRight:{x:number;y:number}; bottomLeft:{x:number;y:number} };
export type ScanPage = { id:string; originalUri:string; processedUri:string; filter:ScanFilter; width:number; height:number; createdAt:number; ocrText?:string };
export type EditSnapshot = { pages: ScanPage[]; thumbnailUri: string; savedAt: number; kind?: 'rotate' | 'crop' | 'filter' };
export type ScanRecord = { id:string; title:string; createdAt:number; updatedAt:number; thumbnailUri:string; isSynced:boolean; pages:ScanPage[]; pdfUri?:string; favorite?:boolean; tags?:string[]; editHistory?:EditSnapshot[] };
