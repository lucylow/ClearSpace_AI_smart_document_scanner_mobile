import { describe,expect,it } from 'vitest';
import { createMemoryStorage } from '../src/core/storage/StorageAdapter';
import { createScanPersistence } from '../src/core/storage/scanPersistence';
import { HeuristicDocumentDetector } from '../src/modules/scanner/services/DocumentDetector';
const scan={id:'scan-1',title:'Test',createdAt:1,updatedAt:1,thumbnailUri:'file:///tmp/a.jpg',isSynced:false,pages:[]};
describe('scan persistence',()=>{it('round-trips scan records',async()=>{const persistence=createScanPersistence(createMemoryStorage());await persistence.save([scan]);expect((await persistence.load())[0].title).toBe('Test')});it('recovers from malformed stored data',async()=>{const storage=createMemoryStorage({'smart-scanner-scans':'not-json'});expect(await createScanPersistence(storage).load()).toEqual([])})});
describe('document detector',()=>{it('returns normalized quadrilateral geometry',async()=>{const edges=await new HeuristicDocumentDetector().detect('demo://scan');expect(edges?.topLeft.x).toBeGreaterThan(0);expect(edges?.bottomRight.x).toBeLessThan(1)})});
