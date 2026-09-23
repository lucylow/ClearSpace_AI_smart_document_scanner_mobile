import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const { listeners, announceForAccessibility } = vi.hoisted(() => ({
  listeners: new Set<(state: 'active' | 'background') => void>(),
  announceForAccessibility: vi.fn(),
}));

vi.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: (_event: string, listener: (state: 'active' | 'background') => void) => {
      listeners.add(listener);
      return { remove: () => listeners.delete(listener) };
    },
  },
  AccessibilityInfo: { announceForAccessibility },
}));

import { useExpoCompatibilityAgeLifecycle } from '../src/core/services/useExpoCompatibilityAgeLifecycle';

function Harness({ checkedAt, now, intervalMs = 60_000 }: { checkedAt: number; now: () => number; intervalMs?: number }) {
  const state = useExpoCompatibilityAgeLifecycle({ checkedAt, locale: 'en-US', now, intervalMs });
  return <output>{`${state.appIsActive}:${state.ageNow}:${state.announcement}`}</output>;
}

describe('Expo compatibility age lifecycle renderer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    listeners.clear();
    announceForAccessibility.mockReset();
  });

  it('refreshes immediately when the app returns to the foreground', () => {
    let now = 1_000;
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<Harness checkedAt={1_000} now={() => now} />);
    });

    now = 62_000;
    act(() => listeners.forEach((listener) => listener('background')));
    act(() => listeners.forEach((listener) => listener('active')));

    expect(renderer!.root.findByType('output').children.join('')).toContain(':62000:');
    act(() => renderer!.unmount());
  });

  it('clears the compatibility timer on unmount', () => {
    let now = 1_000;
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<Harness checkedAt={1_000} now={() => now} />);
    });
    act(() => renderer!.unmount());

    now = 61_000;
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(announceForAccessibility).not.toHaveBeenCalled();
  });
});
