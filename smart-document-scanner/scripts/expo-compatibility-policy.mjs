export function compatibilityCheckFailure(status, output) {
  return status !== 0 || /Found outdated dependencies|Your project may not work correctly/.test(output);
}

export function compatibilityCheckResult(status, output) {
  const failed = compatibilityCheckFailure(status, output);
  return {
    ok: !failed,
    status: status ?? 1,
    reason: failed ? 'outdated-or-incompatible-dependencies' : 'up-to-date',
    summary: compatibilityCheckSummary(status, output),
  };
}

export function compatibilityCheckSummary(status, output) {
  if (compatibilityCheckFailure(status, output)) {
    return 'Expo compatibility check failed. Review the package guidance above; no dependencies were changed.';
  }
  return 'Expo compatibility check passed without modifying dependencies.';
}
