import { describe, it, expect, vi, afterEach } from "vitest";
import {
  formatLongSpanishDate,
  parseApiDate,
  toDateInputValue,
  todayKey,
} from "./calendar-date";

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

describe("toDateInputValue", () => {
  afterEach(() => vi.useRealTimers());

  it("conserva una fecha YYYY-MM-DD sin corrimiento", () => {
    expect(toDateInputValue("2026-11-25")).toBe("2026-11-25");
  });

  it("extrae la fecha local de un timestamp ISO", () => {
    const localMidday = new Date(2026, 10, 25, 12, 0, 0).toISOString();
    expect(toDateInputValue(localMidday)).toBe("2026-11-25");
  });

  it("usa hoy si falta el valor o es inválido", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 10, 0));
    expect(toDateInputValue(null)).toBe("2026-11-26");
    expect(toDateInputValue("")).toBe("2026-11-26");
    expect(toDateInputValue("no-es-fecha")).toBe("2026-11-26");
  });
});

describe("formatLongSpanishDate", () => {
  it("escribe la fecha en español con día de la semana y sin corrimiento UTC", () => {
    expect(formatLongSpanishDate("2026-11-24")).toBe("martes 24 de noviembre de 2026");
    expect(formatLongSpanishDate("2026-11-25")).toBe("miércoles 25 de noviembre de 2026");
    expect(formatLongSpanishDate("2026-01-01")).toBe("jueves 1 de enero de 2026");
    expect(formatLongSpanishDate("2026-03-01")).toBe("domingo 1 de marzo de 2026");
  });

  it("devuelve vacío ante formato inválido o día inexistente", () => {
    expect(formatLongSpanishDate("")).toBe("");
    expect(formatLongSpanishDate("25/11/2026")).toBe("");
    expect(formatLongSpanishDate("2026-02-30")).toBe("");
    expect(formatLongSpanishDate("2026-13-01")).toBe("");
  });
});
