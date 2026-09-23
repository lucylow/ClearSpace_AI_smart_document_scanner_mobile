import AsyncStorage from '@react-native-async-storage/async-storage';
export interface StorageAdapter{get(key:string):Promise<string|null>;set(key:string,value:string):Promise<void>;remove(key:string):Promise<void>}
export const asyncStorageAdapter:StorageAdapter={get:(key)=>AsyncStorage.getItem(key),set:(key,value)=>AsyncStorage.setItem(key,value),remove:(key)=>AsyncStorage.removeItem(key)};
export function createMemoryStorage(initial:Record<string,string>={}):StorageAdapter{const values=new Map(Object.entries(initial));return{get:async(key)=>values.get(key)??null,set:async(key,value)=>{values.set(key,value)},remove:async(key)=>{values.delete(key)}}}
