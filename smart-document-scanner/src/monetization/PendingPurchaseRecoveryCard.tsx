import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { PaywallActionButton } from './PaywallActionButton';

export function PendingPurchaseRecoveryCard({ productId, active, message, retryLabel, escalation, supportLabel, retryDisabled = false, onRetry, onSupport }: { productId: string; active: 'purchase' | 'restore' | null; message: string; retryLabel: string; escalation?: string; supportLabel: string; retryDisabled?: boolean; onRetry: () => void; onSupport: () => void }) {
  return <Card accessibilityRole="summary"><Card.Content><View accessibilityLiveRegion="polite"><Text accessibilityRole="header">{message}</Text><Text accessibilityLabel={productId}>{productId}</Text>{escalation ? <Text accessibilityLiveRegion="polite">{escalation}</Text> : null}</View><PaywallActionButton mode="outlined" action="restore" active={active} label={retryLabel} onPress={onRetry} loading={retryDisabled} /><Button mode="text" accessibilityLabel={supportLabel} onPress={onSupport}>{supportLabel}</Button></Card.Content></Card>;
}
