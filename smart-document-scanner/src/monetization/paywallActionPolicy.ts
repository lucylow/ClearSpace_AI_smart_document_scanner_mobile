export type PaywallAction = 'purchase' | 'restore';

export function canStartPaywallAction(active: PaywallAction | null, requested: PaywallAction): boolean {
  return active === null || active === requested;
}

export function canStartExclusivePaywallAction(active: PaywallAction | null): boolean {
  return active === null;
}

export function paywallActionAccessibilityState(active: PaywallAction | null, action: PaywallAction): { busy: boolean; disabled: boolean } {
  return { busy: active === action, disabled: active !== null };
}
