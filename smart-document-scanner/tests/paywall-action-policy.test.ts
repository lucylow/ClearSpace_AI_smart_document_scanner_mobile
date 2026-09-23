import { describe, expect, it } from 'vitest';
import { canStartExclusivePaywallAction, canStartPaywallAction, paywallActionAccessibilityState } from '../src/monetization/paywallActionPolicy';

describe('paywall action policy', () => {
  it('allows a new action only when no different action is active', () => {
    expect(canStartPaywallAction(null, 'purchase')).toBe(true);
    expect(canStartPaywallAction('purchase', 'purchase')).toBe(true);
    expect(canStartPaywallAction('purchase', 'restore')).toBe(false);
    expect(canStartPaywallAction('restore', 'purchase')).toBe(false);
  });

  it('blocks duplicate same-action triggers for exclusive Settings billing flows', () => {
    expect(canStartExclusivePaywallAction(null)).toBe(true);
    expect(canStartExclusivePaywallAction('purchase')).toBe(false);
    expect(canStartExclusivePaywallAction('restore')).toBe(false);
  });

  it('exposes busy and disabled semantics for assistive technology', () => {
    expect(paywallActionAccessibilityState('purchase', 'purchase')).toEqual({ busy: true, disabled: true });
    expect(paywallActionAccessibilityState('purchase', 'restore')).toEqual({ busy: false, disabled: true });
    expect(paywallActionAccessibilityState(null, 'restore')).toEqual({ busy: false, disabled: false });
  });
});
