import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-native-paper', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
}));

import { PaywallActionButton } from '../src/monetization/PaywallActionButton';

describe('PaywallActionButton renderer', () => {
  it('marks purchase busy and blocks restore while purchase is active', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<PaywallActionButton label="Restore" action="restore" active="purchase" onPress={vi.fn()} />);
    });
    const button = renderer!.root.findByType('button');
    expect(button.props.disabled).toBe(true);
    expect(button.props.accessibilityState).toEqual({ busy: false, disabled: true });
  });

  it('allows an idle purchase action and exposes a non-busy state', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<PaywallActionButton label="Buy" action="purchase" active={null} onPress={vi.fn()} />);
    });
    const button = renderer!.root.findByType('button');
    expect(button.props.disabled).toBe(false);
    expect(button.props.accessibilityState).toEqual({ busy: false, disabled: false });
  });
});
