import { describe, expect, it } from "vitest";
import { filenameFromDisposition } from "@/lib/open-pdf-tab";

describe("filenameFromDisposition", () => {
  it("lee el nombre del encabezado", () => {
    expect(filenameFromDisposition('inline; filename="recipe-zuni-roque-2026-11-20.pdf"')).toBe("recipe-zuni-roque-2026-11-20.pdf");
  });
  it("usa un nombre genérico si no viene", () => {
    expect(filenameFromDisposition(null)).toBe("documento.pdf");
  });
});
