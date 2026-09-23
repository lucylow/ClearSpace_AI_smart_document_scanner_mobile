export function abortActiveExport(controller: AbortController | null): boolean {
  if (!controller || controller.signal.aborted) return false;
  controller.abort();
  return true;
}
