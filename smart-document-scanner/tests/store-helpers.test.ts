import { describe,expect,it } from 'vitest';
import { addCredits,canConsumeCredit,consumeCredits } from '../src/core/store/credits';
describe('credit helpers',()=>{it('blocks exhausted free accounts',()=>{expect(canConsumeCredit(false,0)).toBe(false)});it('keeps pro exports unlimited',()=>{expect(canConsumeCredit(true,0)).toBe(true);expect(consumeCredits(true,0)).toBe(0)});it('adds and consumes balances safely',()=>{expect(consumeCredits(false,3)).toBe(2);expect(addCredits(2,3)).toBe(5);expect(addCredits(0,-4)).toBe(0)})});
