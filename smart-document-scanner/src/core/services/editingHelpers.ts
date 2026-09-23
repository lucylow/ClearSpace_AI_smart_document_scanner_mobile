import type { ScanFilter } from "../types";

export type CropDraft = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type CropRect = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

const MIN_SPAN = 0.12;

export function clampCropDraft(draft: CropDraft): CropDraft {
  const left = Math.max(0, Math.min(1 - MIN_SPAN, draft.left));
  const top = Math.max(0, Math.min(1 - MIN_SPAN, draft.top));
  const right = Math.max(left + MIN_SPAN, Math.min(1, draft.right));
  const bottom = Math.max(top + MIN_SPAN, Math.min(1, draft.bottom));
  return { left, top, right, bottom };
}

export function cropRectFromDraft(draft: CropDraft, width: number, height: number): CropRect {
  const safe = clampCropDraft(draft);
  return {
    originX: Math.floor(width * safe.left),
    originY: Math.floor(height * safe.top),
    width: Math.max(1, Math.floor(width * (safe.right - safe.left))),
    height: Math.max(1, Math.floor(height * (safe.bottom - safe.top))),
  };
}

export function filterLabel(filter: ScanFilter): string {
  switch (filter) {
    case "original":
      return "Original";
    case "bw":
      return "Black & white";
    case "grayscale":
      return "Grayscale";
    case "enhanced":
      return "Enhanced";
  }
}

export function undoNotice(title: string, restored: boolean): string {
  return restored ? `${title} restored.` : `${title} deleted.`;
}
