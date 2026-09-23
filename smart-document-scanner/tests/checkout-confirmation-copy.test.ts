import { describe, expect, it } from 'vitest';
import { checkoutConfirmationCopy } from '../src/monetization/checkoutConfirmationCopy';

describe('checkout confirmation copy', () => {
  const creditPack = { id: 'credits_10', kind: 'credit_pack' as const, tier: 'free' as const, priceMicros: 1, currency: 'USD' };
  const yearly = { id: 'pro_yearly', kind: 'subscription' as const, tier: 'yearly' as const, priceMicros: 1, currency: 'USD', interval: 'year' as const };

  it('explains a repeatable credit-pack purchase in English', () => {
    const copy = checkoutConfirmationCopy(creditPack, '$0.01', 'en-US');
    expect(copy.message).toContain('10 export credits');
    expect(copy.message).toContain('$0.01');
    expect(copy.accessibilityLabel).toContain('10 credits');
  });

  it('localizes subscription confirmation and cancellation labels', () => {
    const copy = checkoutConfirmationCopy(yearly, '€39.99', 'fr-FR');
    expect(copy.title).toContain('abonnement');
    expect(copy.confirm).toBe('Continuer');
    expect(copy.cancel).toBe('Annuler');
  });

  it('falls back safely for unsupported locales', () => {
    expect(checkoutConfirmationCopy(creditPack, '$1', 'de-DE').title).toBe('Confirm purchase');
  });
});
