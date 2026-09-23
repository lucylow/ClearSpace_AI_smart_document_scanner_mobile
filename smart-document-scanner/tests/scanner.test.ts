import { describe,expect,it } from 'vitest';
import { shouldAutoCapture } from '../src/modules/scanner/capture/capturePolicy';
import { brightnessHint } from '../src/modules/scanner/brightness';
import { buildFolderTree } from '../src/core/domain/folder';
import { announceBeforeNavigation, CAPTURE_ANNOUNCEMENT_DELAY_MS } from '../src/modules/scanner/services/captureAnnouncement';
describe('scanner quality helpers',()=>{it('accepts a stable sharp frame',()=>{expect(shouldAutoCapture({stableMs:620,edgeConfidence:.93,blurScore:.84})).toBe(true)});it('flags dim lighting',()=>{expect(brightnessHint(.2)).toBe('Too dark')})});
describe('folder tree',()=>{it('nests children under roots',()=>{const tree=buildFolderTree([{id:'root',name:'Root',createdAt:1},{id:'child',name:'Child',parentId:'root',createdAt:2}]);expect(tree[0].children[0].name).toBe('Child')})});
describe('capture accessibility sequencing',()=>{
  it('announces success before navigating to Review using the configured delay',async()=>{
    const events:string[]=[];
    await announceBeforeNavigation({announce:()=>events.push('announce'),navigate:()=>events.push('navigate'),wait:(milliseconds)=>{expect(milliseconds).toBe(CAPTURE_ANNOUNCEMENT_DELAY_MS);events.push('wait');return Promise.resolve();}});
    expect(events).toEqual(['announce','wait','navigate']);
  });
  it('does not navigate when the announcement wait fails',async()=>{
    const events:string[]=[];
    await expect(announceBeforeNavigation({announce:()=>events.push('announce'),navigate:()=>events.push('navigate'),wait:async()=>{throw new Error('interrupted');}})).rejects.toThrow('interrupted');
    expect(events).toEqual(['announce']);
  });
});
