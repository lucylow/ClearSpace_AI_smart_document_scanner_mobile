import { describe, expect, it } from "vitest";
import { createMemoryStorage } from "../src/core/storage/StorageAdapter";
import { createScanPersistence } from "../src/core/storage/scanPersistence";

const scan = (id: string) => ({ id, title: id, createdAt: 1, updatedAt: 1, thumbnailUri: "file://thumb", isSynced: false, pages: [] });

describe("scan persistence backups", () => {
  it("creates a backup before replacing the primary payload and reports its age", async () => {
    const persistence = createScanPersistence(createMemoryStorage());
    await persistence.save([scan("first")]);
    expect((await persistence.getBackupInfo()).available).toBe(false);
    await persistence.save([scan("second")]);
    const info = await persistence.getBackupInfo();
    expect(info.available).toBe(true);
    expect(info.savedAt).toEqual(expect.any(Number));
    expect((await persistence.restoreBackup())[0].id).toBe("first");
  });

  it("clears the primary payload and backup together", async () => {
    const persistence = createScanPersistence(createMemoryStorage());
    await persistence.save([scan("first")]);
    await persistence.save([scan("second")]);
    await persistence.clear();
    expect(await persistence.load()).toEqual([]);
    expect(await persistence.restoreBackup()).toEqual([]);
    expect((await persistence.getBackupInfo()).available).toBe(false);
  });

  it("keeps the previous payload recoverable when replacing the primary payload fails", async () => {
    const primary = JSON.stringify({ version: 1, scans: [scan("previous")] });
    const base = createMemoryStorage({ "smart-scanner-scans": primary });
    const failing = { ...base, set: async (key: string, value: string) => { if (key === "smart-scanner-scans") throw new Error("primary unavailable"); await base.set(key, value); } };
    const persistence = createScanPersistence(failing);
    await expect(persistence.save([scan("next")])).rejects.toThrow("primary unavailable");
    expect((await persistence.restoreBackup())[0].id).toBe("previous");
  });
});
