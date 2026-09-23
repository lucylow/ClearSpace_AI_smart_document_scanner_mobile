import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { purchase, restore, setPro, announce, loadPending, loadEntitlement, reconcile, appListeners } = vi.hoisted(() => ({
  purchase: vi.fn(),
  restore: vi.fn(),
  setPro: vi.fn(),
  announce: vi.fn(),
  loadPending: vi.fn(),
  loadEntitlement: vi.fn(),
  reconcile: vi.fn(),
  appListeners: new Set<(state: string) => void>(),
}));

vi.mock('react-native', () => ({
  AccessibilityInfo: { announceForAccessibility: announce },
  AppState: { addEventListener: (_event: string, listener: (state: string) => void) => { appListeners.add(listener); return { remove: () => appListeners.delete(listener) }; } },
  ScrollView: ({ children }: { children: React.ReactNode }) => React.createElement('scroll', null, children),
  StyleSheet: { create: (styles: unknown) => styles },
  Text: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement('text', props, children),
  View: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement('view', props, children),
}));
vi.mock('react-native-paper', () => { const Card = ({ children }: { children: React.ReactNode }) => React.createElement('card', null, children); Card.Content = ({ children }: { children: React.ReactNode }) => React.createElement('content', null, children); return { Button: ({ children, onPress, ...props }: { children: React.ReactNode; onPress?: () => void; [key: string]: unknown }) => React.createElement('button', { ...props, onPress }, children), Card }; });
vi.mock('expo-router', () => ({ useLocalSearchParams: () => ({}), router: { back: vi.fn(), push: vi.fn() } }));
vi.mock('@/components/screen-container', () => ({ ScreenContainer: ({ children }: { children: React.ReactNode }) => React.createElement('screen', null, children) }));
vi.mock('@/src/core/i18n/localePreference', () => ({ paywallErrorCopy: () => ({ restoreStateFailed: (detail: string) => `restore-failed ${detail}`, pendingCheckFailed: (detail: string) => `pending-failed ${detail}`, alreadyActive: 'Already active', unlocked: 'Unlocked', purchaseFailed: (detail: string) => `purchase-failed ${detail}`, restoring: 'Restoring', storeRefreshFailed: (detail: string) => `refresh-failed ${detail}`, selectionSaveFailed: (detail: string) => `selection-failed ${detail}`, retryGuidance: 'Try again' }), paywallSurfaceCopy: () => ({ ocrTitle: 'OCR', ocrSubtitle: 'OCR', creditsTitle: 'Credits', creditsSubtitle: 'Credits', defaultTitle: 'Go Pro', defaultSubtitle: 'More', yearlyPro: 'Yearly Pro', selectYearlyA11y: 'Select yearly', selectYearly: 'Select yearly', lifetimePro: 'Lifetime Pro', monthlyPro: 'Monthly Pro', selected: 'Selected', choose: 'Choose', selection: 'Selection', confirm: 'Confirm', confirmPurchase: 'Confirm purchase', cancel: 'Cancel', continueWith: (tier: string) => `Continue with ${tier}`, pendingPurchase: (id: string) => `Pending ${id}`, retryPurchase: 'Retry purchase', pendingRecoveryEscalation: 'Retry limit reached', pendingRecoverySupport: 'Open diagnostics', restorePurchases: 'Restore purchases', refreshStore: 'Refresh store', notNow: 'Not now' }) }));
vi.mock('@/src/core/storage/cleanupRecovery', () => ({ paywallLabel: () => 'Pro includes', paywallPlanLabel: (key: string) => key, paywallProductPrice: (price: string) => price }));
vi.mock('@/src/monetization/core', () => ({ PRODUCT_CATALOG: [{ id: 'pro_yearly', tier: 'yearly', priceMicros: 999, interval: 'year' }, { id: 'pro_monthly', tier: 'monthly', priceMicros: 99, interval: 'month' }], featuredPaywallOffer: () => ({ id: 'pro_yearly', tier: 'yearly', priceMicros: 999, interval: 'year' }), paywallOffers: () => [{ id: 'pro_yearly', tier: 'yearly', priceMicros: 999, interval: 'year' }, { id: 'pro_monthly', tier: 'monthly', priceMicros: 99, interval: 'month' }], formatMoney: (micros: number) => `$${micros}` }));
vi.mock('@/src/monetization/offerPresentation', () => ({ annualSavingsPercent: () => 20, offerComparisonCopy: () => 'Best value', trialCopy: () => 'Trial' }));
vi.mock('@/src/monetization/purchaseSummary', () => ({ purchaseSummary: () => 'Purchase summary' }));
vi.mock('@/src/monetization/eligibility', () => ({ checkoutTerms: () => 'Terms', offerEligibility: () => ({ reason: 'eligible' }) }));
vi.mock('@/src/monetization/receiptRecovery', () => ({ receiptRecoveryCopy: (key: string) => key }));
vi.mock('@/src/monetization/purchaseRecovery', () => ({ canRefreshStore: () => true, pendingPurchaseCopy: (id: string) => `Pending ${id}`, refreshWaitCopy: () => 'Please wait' }));
vi.mock('@/src/monetization/pendingDiagnostics', () => ({ isPendingOfferExpired: () => false }));
vi.mock('@/src/monetization/subscriptionLifecycle', () => ({ providerReadiness: () => ({ label: 'Ready' }) }));
vi.mock('@/src/core/i18n/AppLocaleProvider', () => ({ useAppLocale: () => ({ locale: 'en-US' }) }));
vi.mock('@/src/core/errors/errorMessage', () => ({ safeErrorMessage: (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback }));
vi.mock('@/src/monetization/paywallActionPolicy', () => ({ canStartPaywallAction: (active: string | null) => active === null, paywallActionAccessibilityState: (active: string | null, action: string) => ({ busy: active === action, disabled: active !== null }) }));
vi.mock('@/src/monetization/pendingRecoveryRetryPolicy', () => ({ pendingRecoveryRetryState: () => ({ canRetry: true, showEscalation: false }) }));
vi.mock('@/src/monetization/PaywallActionButton', () => ({ PaywallActionButton: ({ label, onPress, ...props }: { label: string; onPress: () => void; [key: string]: unknown }) => React.createElement('button', { ...props, onPress }, label) }));
vi.mock('@/src/monetization/PendingPurchaseRecoveryCard', () => ({ PendingPurchaseRecoveryCard: ({ message, retryLabel, supportLabel, onRetry, onSupport }: { message: string; retryLabel: string; supportLabel: string; onRetry: () => void; onSupport: () => void }) => React.createElement('recovery-card', null, React.createElement('text', null, message), React.createElement('button', { onPress: onRetry }, retryLabel), React.createElement('button', { onPress: onSupport }, supportLabel)) }));
vi.mock('@/src/core/store/userStore', () => ({ useUserStore: (selector: (state: { setPro: typeof setPro }) => unknown) => selector({ setPro }) }));
vi.mock('@/src/monetization/BillingProvider', () => ({ LocalBillingProvider: class { purchase = purchase; restore = restore; } }));
vi.mock('@/src/monetization/entitlementCache', () => ({ loadEntitlementCache: loadEntitlement }));
vi.mock('@/src/monetization/selectedOfferPersistence', () => ({ loadSelectedOffer: vi.fn().mockResolvedValue('pro_yearly'), saveSelectedOffer: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/src/monetization/pendingOfferPersistence', () => ({ loadPendingOffer: loadPending, savePendingOffer: vi.fn().mockResolvedValue({ productId: 'pro_yearly', startedAt: 1 }), clearPendingOffer: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/src/monetization/transactionReconciliation', () => ({ reconcilePendingPurchase: reconcile }));
vi.mock('@/src/core/storage/StorageAdapter', () => ({ asyncStorageAdapter: {} }));

import Paywall from '../app/paywall';

describe('Paywall renderer', () => {
  beforeEach(() => { purchase.mockReset(); restore.mockReset(); setPro.mockReset(); announce.mockReset(); loadPending.mockReset(); loadEntitlement.mockReset(); reconcile.mockReset(); appListeners.clear(); loadPending.mockResolvedValue(null); loadEntitlement.mockResolvedValue(null); purchase.mockResolvedValue({ status: 'success', productId: 'pro_yearly' }); restore.mockResolvedValue({ status: 'restored', state: {}, products: ['pro_yearly'] }); });

  it('renders the paywall and exposes restore outcome feedback', async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    const buttons = renderer!.root.findAllByType('button');
    const restoreButton = buttons.find(button => String(button.children.join('')).toLowerCase().includes('restore'))!;
    await act(async () => { restoreButton.props.onPress(); await Promise.resolve(); });
    expect(setPro).toHaveBeenCalledWith(true);
    expect(announce).toHaveBeenCalled();
  });

  it('announces an interrupted purchase and keeps retry available', async () => {
    purchase.mockResolvedValueOnce({ status: 'interrupted', productId: 'pro_yearly' });
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    const continueButton = renderer!.root.findAllByType('button').find(button => String(button.children.join('')).toLowerCase().includes('continue'))!;
    await act(async () => { continueButton.props.onPress(); });
    const buyButton = renderer!.root.findAllByType('button').find(button => String(button.children.join('')).toLowerCase().includes('confirm'))!;
    await act(async () => { buyButton.props.onPress(); await Promise.resolve(); });
    expect(announce).toHaveBeenCalled();
    expect(renderer!.root.findAllByType('button').some(button => String(button.children.join('')).toLowerCase().includes('retry'))).toBe(true);
  });
});

  it('reconciles a pending purchase once on foreground and announces success', async () => {
    loadPending.mockResolvedValue({ productId: 'pro_yearly', startedAt: 1 });
    let resolveReconcile!: (value: { status: 'reconciled' }) => void;
    reconcile.mockImplementation(() => new Promise(resolve => { resolveReconcile = resolve; }));
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    await act(async () => { const listener = [...appListeners][0]; listener?.('active'); listener?.('active'); });
    expect(reconcile).toHaveBeenCalledTimes(1);
    await act(async () => { resolveReconcile({ status: 'reconciled' }); await Promise.resolve(); });
    expect(setPro).toHaveBeenCalledWith(true);
    expect(announce).toHaveBeenCalledWith('Pending purchase reconciled. Pro access is active.');
    await act(async () => { renderer!.unmount(); });
  });

  it('announces pending-purchase reconciliation failure for retry guidance', async () => {
    loadPending.mockResolvedValue({ productId: 'pro_yearly', startedAt: 1 });
    reconcile.mockRejectedValue(new Error('store unavailable'));
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    await act(async () => { appListeners.forEach(listener => listener('active')); await Promise.resolve(); });
    expect(announce).toHaveBeenCalledWith('pending-failed store unavailable');
    await act(async () => { renderer!.unmount(); });
  });

  it('renders cached upcoming-renewal guidance with an accessible summary', async () => {
    loadEntitlement.mockResolvedValue({ state: { tier: 'yearly', renewalAt: Date.now() + 2 * 24 * 60 * 60 * 1000 }, cachedAt: Date.now(), expiresAt: Date.now() + 60 * 60 * 1000 });
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    await act(async () => { await Promise.resolve(); });
    const summaries = renderer!.root.findAllByProps({ accessibilityRole: 'summary' });
    expect(summaries.some(summary => String(summary.props.accessibilityLabel).includes('renewal coming up'))).toBe(true);
    expect(renderer!.root.findAllByType('text').some(node => String(node.children.join('')).includes('Renewal coming up'))).toBe(true);
    await act(async () => { renderer!.unmount(); });
  });

  it('exposes a direct diagnostics action from pending-purchase recovery', async () => {
    loadPending.mockResolvedValue({ productId: 'pro_yearly', startedAt: 1 });
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    await act(async () => { await Promise.resolve(); });
    const support = renderer!.root.findAllByType('button').find(button => String(button.children.join('')).toLowerCase().includes('diagnostics'))!;
    await act(async () => { support.props.onPress(); });
    expect(announce).toHaveBeenCalledWith('Open diagnostics');
    await act(async () => { renderer!.unmount(); });
  });

  it('exposes a direct pending-purchase retry action', async () => {
    loadPending.mockResolvedValue({ productId: 'pro_yearly', startedAt: 1 });
    reconcile.mockResolvedValue({ status: 'reconciled' });
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<Paywall />); });
    const retry = renderer!.root.findAllByType('button').find(button => String(button.children.join('')).toLowerCase().includes('retry'))!;
    await act(async () => { retry.props.onPress(); await Promise.resolve(); });
    expect(reconcile).toHaveBeenCalled();
    expect(setPro).toHaveBeenCalledWith(true);
    await act(async () => { renderer!.unmount(); });
  });
