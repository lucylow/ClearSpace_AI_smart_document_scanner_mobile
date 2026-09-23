import { describe, expect, it } from 'vitest';
import { LocalBillingProvider } from '../src/monetization/BillingProvider';
import { creditPackAmount, creditPackCopy } from '../src/monetization/creditPackPresentation';

describe('credit-pack monetization', () => {
  it('maps supported credit-pack products to safe amounts', () => {
    expect(creditPackAmount('credits_10')).toBe(10);
    expect(creditPackAmount('credits_50')).toBe(50);
    expect(creditPackAmount('unknown')).toBe(0);
  });

  it('localizes credit-pack copy with locale fallback', () => {
    expect(creditPackCopy('fr-FR').purchased(10)).toContain('10 crédits');
    expect(creditPackCopy('pt-BR').title).toContain('Créditos');
    expect(creditPackCopy('de-DE').description(10, '$1')).toContain('10 export credits');
  });

  it('allows repeat purchases for consumable packs but not Pro ownership', async () => {
    const provider = new LocalBillingProvider([
      { id: 'credits_10', kind: 'credit_pack', tier: 'free', priceMicros: 1, currency: 'USD' },
      { id: 'pro_monthly', kind: 'subscription', tier: 'monthly', priceMicros: 1, currency: 'USD', interval: 'month' },
    ]);
    expect((await provider.purchase('credits_10')).status).toBe('success');
    expect((await provider.purchase('credits_10')).status).toBe('success');
    expect((await provider.purchase('pro_monthly')).status).toBe('success');
    expect((await provider.purchase('pro_monthly')).error).toBe('already_owned');
  });
});
