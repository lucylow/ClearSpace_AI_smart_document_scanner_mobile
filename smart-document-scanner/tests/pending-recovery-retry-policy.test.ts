import { describe, expect, it } from 'vitest';
import { MAX_PENDING_RECOVERY_ATTEMPTS, pendingRecoveryRetryState } from '../src/monetization/pendingRecoveryRetryPolicy';

describe('pending recovery retry policy', () => {
  it('allows retries before the bounded threshold', () => {
    expect(pendingRecoveryRetryState(0)).toEqual({ canRetry: true, showEscalation: false });
    expect(pendingRecoveryRetryState(MAX_PENDING_RECOVERY_ATTEMPTS - 1)).toEqual({ canRetry: true, showEscalation: false });
  });

  it('blocks retry and shows escalation at the threshold', () => {
    expect(pendingRecoveryRetryState(MAX_PENDING_RECOVERY_ATTEMPTS)).toEqual({ canRetry: false, showEscalation: true });
    expect(pendingRecoveryRetryState(MAX_PENDING_RECOVERY_ATTEMPTS + 2)).toEqual({ canRetry: false, showEscalation: true });
  });

  it('fails closed for malformed attempt counts', () => {
    expect(pendingRecoveryRetryState(Number.NaN)).toEqual({ canRetry: true, showEscalation: false });
    expect(pendingRecoveryRetryState(-4)).toEqual({ canRetry: true, showEscalation: false });
  });
});
