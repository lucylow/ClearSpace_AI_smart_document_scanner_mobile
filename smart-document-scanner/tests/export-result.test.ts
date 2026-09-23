import { describe,expect,it } from 'vitest';
import { isValidExportUri,safeExportName } from '../src/core/services/exportResult';
describe('export result helpers',()=>{it('sanitizes unsafe export names',()=>{expect(safeExportName('  invoice/2026?.pdf ')).toBe('invoice_2026_.pdf');expect(safeExportName('...')).toBe('scan')});it('validates generated URIs',()=>{expect(isValidExportUri('file:///tmp/scan.pdf')).toBe(true);expect(isValidExportUri('')).toBe(false);expect(isValidExportUri('error:pdf')).toBe(false)})});
