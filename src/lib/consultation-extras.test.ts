import { describe, expect, it } from "vitest";
import { certificateFromForm, certificateSummary, certificateToForm, cleanImpressions, EMPTY_CERTIFICATE } from "@/lib/consultation-extras";

describe("certificateFromForm", () => {
  it("devuelve null si la constancia está vacía", () => {
    expect(certificateFromForm({ ...EMPTY_CERTIFICATE, diagnostico: "  " })).toBeNull();
  });

  it("convierte días a entero y los anula si no hay reposo", () => {
    expect(certificateFromForm({ diagnostico: "Embarazo", motivo: "", reposo: true, diasReposo: "3" }))
      .toEqual({ diagnostico: "Embarazo", motivo: undefined, reposo: true, diasReposo: 3 });
    expect(certificateFromForm({ diagnostico: "", motivo: "CONTROL PRENATAL.-", reposo: false, diasReposo: "5" })?.diasReposo).toBeNull();
  });

  it("hace round-trip con certificateToForm", () => {
    const c = { diagnostico: "X", motivo: "Y", reposo: true, diasReposo: 2 };
    expect(certificateFromForm(certificateToForm(c))).toEqual(c);
  });
});

describe("cleanImpressions", () => {
  it("quita vacíos y devuelve null si no queda nada", () => {
    expect(cleanImpressions([" MIOMA UTERINO ", ""])).toEqual(["MIOMA UTERINO"]);
    expect(cleanImpressions(["  "])).toBeNull();
  });
});

describe("certificateSummary", () => {
  it("arma la línea de la tarjeta", () => {
    expect(certificateSummary({ motivo: "CONTROL PRENATAL.-", reposo: true, diasReposo: 1 }))
      .toBe("Constancia: CONTROL PRENATAL.- · Reposo 1 día");
    expect(certificateSummary({ reposo: false })).toBeNull();
    expect(certificateSummary(null)).toBeNull();
  });
});
