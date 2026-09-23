import React from 'react';
import { Button } from 'react-native-paper';
import { paywallActionAccessibilityState, type PaywallAction } from './paywallActionPolicy';

export function PaywallActionButton({ label, action, active, onPress, mode = 'text', loading = false }: { label: string; action: PaywallAction; active: PaywallAction | null; onPress: () => void; mode?: 'text' | 'outlined' | 'contained'; loading?: boolean }) {
  const state = paywallActionAccessibilityState(active, action);
  return <Button mode={mode} loading={loading || state.busy} disabled={state.disabled} accessibilityState={state} onPress={onPress}>{label}</Button>;
}
