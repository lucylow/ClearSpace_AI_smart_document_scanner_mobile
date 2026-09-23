export type UUID=string
export type ISODate=string
export type SyncState='local'|'pending'|'synced'|'conflict'|'error'
export interface PageEntity{id:UUID;documentId:UUID;uri:string;order:number;createdAt:ISODate;updatedAt:ISODate;checksum?:string;ocrText?:string}
export interface DocumentEntity{id:UUID;title:string;folderId?:UUID;tags:string[];pages:PageEntity[];createdAt:ISODate;updatedAt:ISODate;syncState:SyncState;revision:number}
export interface DocumentPatch{title?:string;folderId?:UUID;tags?:string[];updatedAt:ISODate;revision:number}
export const cloneDocument=(document:DocumentEntity):DocumentEntity=>({...document,tags:[...document.tags],pages:document.pages.map(page=>({...page}))})
