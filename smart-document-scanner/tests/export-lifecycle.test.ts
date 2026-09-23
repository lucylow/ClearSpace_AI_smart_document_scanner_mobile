import { describe, expect, it } from 'vitest';
import { abortActiveExport } from '../src/core/services/exportLifecycle';

describe('export lifecycle helpers', () => {
  it('aborts an active export controller exactly once', () => {
    const controller = new AbortController();
    expect(abortActiveExport(controller)).toBe(true);
    expect(controller.signal.aborted).toBe(true);
    expect(abortActiveExport(controller)).toBe(false);
  });

  it('treats a missing controller as an already-clean state', () => {
    expect(abortActiveExport(null)).toBe(false);
  });
});
