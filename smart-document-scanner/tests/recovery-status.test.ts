import { describe, expect, it } from "vitest";
import { formatBackupAge, isBackupStale } from "../src/core/services/recoveryStatus";

describe("recovery status", () => {
  const now = 10 * 24 * 60 * 60 * 1000;
  it("formats useful backup age labels", () => {
    expect(formatBackupAge(null, now)).toBe("No local backup yet");
    expect(formatBackupAge(now - 30 * 60 * 1000, now)).toBe("Saved less than an hour ago");
    expect(formatBackupAge(now - 2 * 60 * 60 * 1000, now)).toBe("Saved 2 hours ago");
    expect(formatBackupAge(now - 2 * 24 * 60 * 60 * 1000, now)).toBe("Saved 2 days ago");
  });

  it("flags only backups older than a week", () => {
    expect(isBackupStale(null, now)).toBe(false);
    expect(isBackupStale(now - 6 * 24 * 60 * 60 * 1000, now)).toBe(false);
    expect(isBackupStale(now - 7 * 24 * 60 * 60 * 1000, now)).toBe(true);
  });
});
