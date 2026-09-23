import { describe, expect, it } from 'vitest';
import { tryNavigate } from '../src/core/navigation/safeNavigation';

describe('tryNavigate', () => {
  it('returns a successful navigation value', () => {
    expect(tryNavigate(() => 'opened')).toEqual({ ok: true, value: 'opened' });
  });

  it('contains navigation failures without throwing', () => {
    const error = new Error('route unavailable');
    const result = tryNavigate(() => {
      throw error;
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(error);
  });
});
