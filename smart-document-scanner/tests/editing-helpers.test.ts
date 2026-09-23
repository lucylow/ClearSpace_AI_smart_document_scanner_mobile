import { describe, expect, it } from "vitest";
import { clampCropDraft, cropRectFromDraft, filterLabel, undoNotice } from "../src/core/services/editingHelpers";

describe("editing helpers", () => {
  it("keeps crop bounds inside the image with a usable minimum span", () => {
    expect(clampCropDraft({ left: -1, top: 0.95, right: 0.02, bottom: 2 })).toEqual({
      left: 0,
      top: 0.88,
      right: 0.12,
      bottom: 1,
    });
  });

  it("converts normalized crop bounds to safe pixel coordinates", () => {
    expect(cropRectFromDraft({ left: 0.1, top: 0.2, right: 0.9, bottom: 0.8 }, 1000, 500)).toEqual({
      originX: 100,
      originY: 100,
      width: 800,
      height: 300,
    });
  });

  it("uses user-facing filter labels and undo copy", () => {
    expect(filterLabel("enhanced")).toBe("Enhanced");
    expect(filterLabel("bw")).toBe("Black & white");
    expect(undoNotice("Receipt", false)).toBe("Receipt deleted.");
    expect(undoNotice("Receipt", true)).toBe("Receipt restored.");
  });
});
