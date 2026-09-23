import { describe, expect, it } from "vitest";
import { getLastMigrationSummary, normalizeScans, PERSISTENCE_VERSION } from "../src/core/storage/scanPersistence";

describe("scan persistence normalization", () => {
  it("fills safe defaults for legacy records and pages", () => {
    const scans = normalizeScans([{ id: "legacy-1", title: "", pages: [{ processedUri: "file://page.jpg" }] }], 100);
    expect(scans).toHaveLength(1);
    expect(scans[0]).toMatchObject({ id: "legacy-1", title: "Untitled document", createdAt: 100, updatedAt: 100, thumbnailUri: "file://page.jpg" });
    expect(scans[0].pages[0]).toMatchObject({ id: "page-1", originalUri: "file://page.jpg", filter: "original", width: 1, height: 1, createdAt: 100 });
  });

  it("preserves valid zero-page records while dropping invalid records", () => {
    const scans = normalizeScans([null, { id: "missing-pages", pages: [] }, { id: "mixed", pages: [{ processedUri: "file://ok.jpg" }, { width: 2 }] }]);
    expect(scans).toHaveLength(2);
    expect(scans.find((scan) => scan.id === "missing-pages")?.pages).toHaveLength(0);
    expect(scans.find((scan) => scan.id === "mixed")?.pages).toHaveLength(1);
  });

  it("records a sanitized migration summary and targets the current version", () => {
    normalizeScans({ version: 0, scans: [{ id: "legacy", pages: [{ processedUri: "file://page.jpg" }] }, { id: "invalid" }] }, 100);
    expect(getLastMigrationSummary()).toMatchObject({ sourceVersion: 0, targetVersion: PERSISTENCE_VERSION, recordsSeen: 2, recordsKept: 2, pagesRepaired: 1 });
  });
});
