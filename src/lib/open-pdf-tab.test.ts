import { describe, expect, it } from "vitest";
import { withPdfAccess } from "@/lib/open-pdf-tab";

describe("withPdfAccess", () => {
  it("agrega el token con ? o con & según la URL", () => {
    expect(withPdfAccess("https://x/api/a/pdf", "t")).toBe("https://x/api/a/pdf?access=t");
    expect(withPdfAccess("https://x/api/a/pdf?fecha=2026-11-20", "t")).toBe("https://x/api/a/pdf?fecha=2026-11-20&access=t");
  });
});
