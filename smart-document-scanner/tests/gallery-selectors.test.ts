import { describe,expect,it } from 'vitest';
import { filterAndSortScans } from '../src/core/store/gallerySelectors';
const scans=[{id:'a',title:'Alpha',createdAt:1,updatedAt:10,thumbnailUri:'a',isSynced:false,pages:[],favorite:false},{id:'b',title:'Beta',createdAt:2,updatedAt:20,thumbnailUri:'b',isSynced:false,pages:[],favorite:true}];
describe('gallery selectors',()=>{it('filters by query and favorites',()=>{expect(filterAndSortScans(scans,'bet',true,true).map(x=>x.id)).toEqual(['b']);expect(filterAndSortScans(scans,'',false,true).map(x=>x.id)).toEqual(['b','a'])});it('supports oldest-first sorting',()=>{expect(filterAndSortScans(scans,'',false,false).map(x=>x.id)).toEqual(['a','b'])})});
