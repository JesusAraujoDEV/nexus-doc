import { describe, expect, it } from "vitest";
import { ANTECEDENTES_VACIO, buildMedicalBackground, parseMedicalBackground } from "@/lib/medical-background";

const legacy = {
  ocupacion: "Docente",
  habitos: { cafe: "si" },
  procedencia: "Valencia",
  antecedentesGinecoObs: { gestas: 3, partos: 1, abortos: 1, ectopicos: 1, otroDato: "x" },
  antecedentesPersonales: [{ cie9: "250", titulo: "DIABETES" }, { cie9: null, titulo: "Asma leve" }],
};

describe("parseMedicalBackground", () => {
  it("lee procedencia, partos/abortos/ectópicos y antecedentes personales", () => {
    const f = parseMedicalBackground(legacy);
    expect(f.procedencia).toBe("Valencia");
    expect([f.gestas, f.partos, f.abortos, f.ectopicos]).toEqual(["3", "1", "1", "1"]);
    expect(f.antecedentesPersonales).toEqual(legacy.antecedentesPersonales);
  });

  it("tolera null y entradas mal formadas", () => {
    expect(parseMedicalBackground(null)).toEqual(ANTECEDENTES_VACIO);
    expect(parseMedicalBackground({ antecedentesPersonales: [{ foo: 1 }, "x"] }).antecedentesPersonales).toEqual([]);
  });
});

describe("buildMedicalBackground", () => {
  it("conserva claves desconocidas al hacer round-trip", () => {
    const out = buildMedicalBackground(parseMedicalBackground(legacy), legacy);
    expect(out.ocupacion).toBe("Docente");
    expect(out.habitos).toEqual({ cafe: "si" });
    expect(out.antecedentesGinecoObs).toEqual(legacy.antecedentesGinecoObs);
    expect(out.antecedentesPersonales).toEqual(legacy.antecedentesPersonales);
  });

  it("borra las claves que el form vació y descarta filas sin título", () => {
    const f = { ...parseMedicalBackground(legacy), procedencia: "", ectopicos: "", antecedentesPersonales: [{ cie9: " ", titulo: "  " }] };
    const out = buildMedicalBackground(f, legacy);
    expect(out).not.toHaveProperty("procedencia");
    expect(out).not.toHaveProperty("antecedentesPersonales");
    expect(out.antecedentesGinecoObs).not.toHaveProperty("ectopicos");
  });

  it("no muta el objeto existente", () => {
    const before = JSON.stringify(legacy);
    buildMedicalBackground({ ...ANTECEDENTES_VACIO }, legacy);
    expect(JSON.stringify(legacy)).toBe(before);
  });
});
