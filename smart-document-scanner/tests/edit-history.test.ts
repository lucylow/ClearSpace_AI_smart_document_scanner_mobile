import { describe, expect, it } from "vitest";
import { MAX_EDIT_HISTORY, editKindLabel, popEditSnapshot, pushEditSnapshot, sanitizeEditHistory } from "../src/core/services/editHistory";

const snapshot = (name: string) => ({ pages: [{ id: name, originalUri: name, processedUri: name, filter: "original" as const, width: 10, height: 10, createdAt: 1 }], thumbnailUri: name });

describe("edit history", () => {
  it("keeps newest snapshots first and trims to the safety limit", () => {
    const history = ["a", "b", "c", "d"].reduce((items, name, index) => pushEditSnapshot(items, snapshot(name), index), [] as ReturnType<typeof pushEditSnapshot>);
    expect(history).toHaveLength(MAX_EDIT_HISTORY);
    expect(history.map((entry) => entry.thumbnailUri)).toEqual(["d", "c", "b"]);
  });

  it("pops the newest snapshot without mutating the remaining history", () => {
    const history = pushEditSnapshot(pushEditSnapshot(undefined, snapshot("old"), 1), snapshot("new"), 2);
    const result = popEditSnapshot(history);
    expect(result.snapshot?.thumbnailUri).toBe("new");
    expect(result.remaining.map((entry) => entry.thumbnailUri)).toEqual(["old"]);
  });

  it("handles empty history safely", () => {
    expect(popEditSnapshot(undefined)).toEqual({ snapshot: null, remaining: [] });
  });

  it("sanitizes malformed history and retains only the bounded valid prefix", () => {
    const valid = { ...snapshot("valid"), savedAt: 10, kind: "crop" as const };
    const result = sanitizeEditHistory([valid, null, { thumbnailUri: "missing-pages" }, valid, valid, valid]);
    expect(result).toHaveLength(MAX_EDIT_HISTORY);
    expect(result?.every((entry) => entry.thumbnailUri === "valid")).toBe(true);
    expect(sanitizeEditHistory("not-an-array")).toBeUndefined();
  });

  it("provides stable action labels", () => {
    expect(editKindLabel("rotate")).toBe("Rotated page");
    expect(editKindLabel("filter")).toBe("Applied filter");
    expect(editKindLabel(undefined)).toBe("Edited page");
  });
});
