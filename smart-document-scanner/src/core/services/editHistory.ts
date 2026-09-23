import type { ScanPage } from "../types";

export type EditSnapshot = {
  pages: ScanPage[];
  thumbnailUri: string;
  savedAt: number;
  kind?: "rotate" | "crop" | "filter";
};

export const MAX_EDIT_HISTORY = 3;

export function editKindLabel(kind: EditSnapshot["kind"]): string {
  if (kind === "rotate") return "Rotated page";
  if (kind === "crop") return "Cropped page";
  if (kind === "filter") return "Applied filter";
  return "Edited page";
}

export function sanitizeEditHistory(history: unknown): EditSnapshot[] | undefined {
  if (!Array.isArray(history)) return undefined;
  const valid = history.filter((item): item is EditSnapshot => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<EditSnapshot>;
    return Array.isArray(candidate.pages) && typeof candidate.thumbnailUri === "string" && typeof candidate.savedAt === "number";
  });
  return valid.slice(0, MAX_EDIT_HISTORY);
}

export function pushEditSnapshot(
  history: EditSnapshot[] | undefined,
  snapshot: Omit<EditSnapshot, "savedAt">,
  now = Date.now(),
): EditSnapshot[] {
  return [{ ...snapshot, savedAt: now }, ...(history ?? [])].slice(0, MAX_EDIT_HISTORY);
}

export function popEditSnapshot(history: EditSnapshot[] | undefined): {
  snapshot: EditSnapshot | null;
  remaining: EditSnapshot[];
} {
  if (!history?.length) return { snapshot: null, remaining: [] };
  return { snapshot: history[0], remaining: history.slice(1) };
}
