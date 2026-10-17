import { describe, it, expect, vi, afterEach } from "vitest";
import { parseApiDate, todayKey } from "./calendar-date";

describe("parseApiDate", () => {
  it("toma una fecha solo-día como día local, sin corrimiento UTC", () => {
    const d = parseApiDate("2026-08-17");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 7, 17]);
  });

  it("respeta un timestamp completo", () => {
    expect(parseApiDate("2026-08-17T12:00:00.000Z").getTime()).toBe(Date.UTC(2026, 7, 17, 12));
  });
});

describe("todayKey", () => {
  afterEach(() => vi.useRealTimers());

  it("usa la fecha local, no la UTC", () => {
    vi.useFakeTimers();
    // 23:30 hora local: en UTC-4 toISOString() ya diría el día siguiente.
    vi.setSystemTime(new Date(2026, 0, 31, 23, 30));
    expect(todayKey()).toBe("2026-01-31");
  });
});
