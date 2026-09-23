import { describe,expect,it } from 'vitest';
import { deleteDocument,renameDocument,toggleDocumentFavorite } from '../src/core/store/documentMutations';
import { fileNameFromUri,isDemoUri,isUsableImageUri } from '../src/core/services/UriService';
const scan={id:'1',title:'Draft',createdAt:1,updatedAt:1,thumbnailUri:'file:///tmp/a.jpg',isSynced:false,pages:[],favorite:false};
describe('document mutations',()=>{it('renames only the matching document',()=>{const result=renameDocument([scan],scan.id,'  Final  ');expect(result[0].title).toBe('Final');});it('toggles favorite without changing other documents',()=>{expect(toggleDocumentFavorite([scan],scan.id)[0].favorite).toBe(true)});it('deletes by id',()=>{expect(deleteDocument([scan],scan.id)).toHaveLength(0)})});
describe('uri helpers',()=>{it('identifies demo and usable image URIs',()=>{expect(isDemoUri('demo://scan')).toBe(true);expect(isUsableImageUri('file:///tmp/a.jpg')).toBe(true);expect(isUsableImageUri('demo://scan')).toBe(false)});it('sanitizes names',()=>{expect(fileNameFromUri('file:///tmp/My Scan.jpg?x=1')).toBe('My_Scan.jpg')})});
