import { describe,expect,it } from 'vitest'
import { DEFAULT_FLAGS,getFlags,resetFlags,setFlags } from '../src/core/flags/FeatureFlags'
import { DocumentIndex } from '../src/core/services/DocumentIndex'
import { migrateLegacyScans } from '../src/core/services/DocumentMigration'
import { wireAnalytics } from '../src/core/analytics/Analytics'
import { EventBus } from '../src/core/events/EventBus'
const scan=(id:string,title:string)=>({id,title,createdAt:1,updatedAt:2,thumbnailUri:`file://${id}`,isSynced:false,pages:[],tags:['work'],favorite:id==='b'})
describe('continuation modules',()=>{
 it('updates and resets feature flags',()=>{setFlags({batchScan:false});expect(getFlags().batchScan).toBe(false);resetFlags();expect(getFlags()).toEqual(DEFAULT_FLAGS)})
 it('indexes title and tag suggestions',()=>{DocumentIndex.rebuild([scan('a','Invoice April'),scan('b','Receipt May')]);expect(DocumentIndex.query('work')).toHaveLength(2);expect(DocumentIndex.suggest('inv')).toEqual(['Invoice April'])})
 it('migrates valid legacy scans and counts skipped rows',()=>{const result=migrateLegacyScans([{id:'legacy-1',createdAt:10,thumbnailUri:'file://one'},{id:'',createdAt:10,thumbnailUri:''}]);expect(result.migrated).toHaveLength(1);expect(result.skipped).toBe(1)})
 it('wires analytics and can unsubscribe',()=>{const events:string[]=[];const cleanup=wireAnalytics({track(name){events.push(name)}});EventBus.emit({type:'scan_started'});cleanup();EventBus.emit({type:'scan_completed'});expect(events).toEqual(['scan_started'])})
})
