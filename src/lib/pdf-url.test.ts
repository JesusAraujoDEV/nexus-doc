import { describe, it, expect } from "vitest";
import { API_URL } from "@/lib/api";
import { buildPdfUrl } from "@/lib/pdf-url";
import { clinicalRecordPdfUrl } from "@/lib/clinical-records-api";
import { medicalReportPdfUrl } from "@/lib/medical-reports-api";
import { pregnancyPdfUrl } from "@/lib/pregnancies-api";

describe("buildPdfUrl", () => {
  it("agrega ?fecha= cuando se pasa una fecha", () => {
    expect(buildPdfUrl("http://localhost:3000/api/pregnancies/1/pdf", "2026-11-25")).toBe(
      "http://localhost:3000/api/pregnancies/1/pdf?fecha=2026-11-25",
    );
  });

  it("no agrega query si la fecha falta o está vacía", () => {
    const base = "http://localhost:3000/api/pregnancies/1/pdf";
    expect(buildPdfUrl(base)).toBe(base);
    expect(buildPdfUrl(base, "")).toBe(base);
    expect(buildPdfUrl(base, "   ")).toBe(base);
  });

  it("usa & si la URL base ya tiene parámetros", () => {
    expect(buildPdfUrl("http://localhost:3000/api/doc?foo=1", "2026-11-25")).toBe(
      "http://localhost:3000/api/doc?foo=1&fecha=2026-11-25",
    );
  });
});

describe("URLs de endpoints PDF con ?fecha=", () => {
  it("arma todas las rutas de consulta con y sin fecha", () => {
    expect(clinicalRecordPdfUrl("rec-1", "prescription", "2026-11-25")).toBe(
      `${API_URL}/clinical-records/rec-1/prescription-pdf?fecha=2026-11-25`,
    );
    expect(clinicalRecordPdfUrl("rec-1", "ultrasound", "2026-11-25")).toBe(
      `${API_URL}/clinical-records/rec-1/ultrasound-pdf?fecha=2026-11-25`,
    );
    expect(clinicalRecordPdfUrl("rec-1", "general-ultrasound", "2026-11-25")).toBe(
      `${API_URL}/clinical-records/rec-1/general-ultrasound-pdf?fecha=2026-11-25`,
    );
    expect(clinicalRecordPdfUrl("rec-1", "lab-exam", "2026-11-25")).toBe(
      `${API_URL}/clinical-records/rec-1/lab-exam-pdf?fecha=2026-11-25`,
    );
    expect(clinicalRecordPdfUrl("rec-1", "prescription")).toBe(
      `${API_URL}/clinical-records/rec-1/prescription-pdf`,
    );
  });

  it("arma la ruta de informe médico con y sin fecha", () => {
    expect(medicalReportPdfUrl("rep-1", "2026-11-25")).toBe(
      `${API_URL}/medical-reports/rep-1/pdf?fecha=2026-11-25`,
    );
    expect(medicalReportPdfUrl("rep-1")).toBe(`${API_URL}/medical-reports/rep-1/pdf`);
  });

  it("arma la ruta de ficha de embarazo con y sin fecha", () => {
    expect(pregnancyPdfUrl("preg-1", "2026-11-25")).toBe(
      `${API_URL}/pregnancies/preg-1/pdf?fecha=2026-11-25`,
    );
    expect(pregnancyPdfUrl("preg-1")).toBe(`${API_URL}/pregnancies/preg-1/pdf`);
  });
});
