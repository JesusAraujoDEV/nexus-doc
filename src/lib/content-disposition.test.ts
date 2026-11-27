import { describe, expect, it } from "vitest";
import { filenameFrom } from "./content-disposition";

describe("filenameFrom", () => {
  it("lee el nombre entre comillas", () => {
    expect(filenameFrom('inline; filename="recipe-ana-2026-11-27.pdf"', "x.pdf")).toBe("recipe-ana-2026-11-27.pdf");
  });
  it("lee el nombre sin comillas", () => {
    expect(filenameFrom("attachment; filename=eco.pdf", "x.pdf")).toBe("eco.pdf");
  });
  it("prefiere filename* codificado", () => {
    expect(filenameFrom("inline; filename*=UTF-8''ecograf%C3%ADa.pdf", "x.pdf")).toBe("ecografía.pdf");
  });
  it("usa el respaldo sin cabecera", () => {
    expect(filenameFrom(null, "documento.pdf")).toBe("documento.pdf");
  });
});
