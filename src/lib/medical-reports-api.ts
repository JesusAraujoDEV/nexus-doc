import { apiFetch, API_URL } from "@/lib/api";
import { buildPdfUrl } from "@/lib/pdf-url";
import { openPdfInTab } from "@/lib/open-pdf-tab";

export type MedicalReportType = "informe" | "constancia";

export interface MedicalReport {
  id: string;
  clinicalRecordId: string;
  patientId: string;
  type: MedicalReportType;
  title: string | null;
  referringDoctorId: string | null;
  medicalCenterId: string | null;
  content: string | null;
  constanciaText: string | null;
  realizandoseText: string | null;
  indicatesRest: boolean;
  createdAt: string;
  referringDoctor: { id: string; name: string; specialty: string | null } | null;
  medicalCenter: { id: string; name: string; address: string | null } | null;
}

export function fetchMedicalReportsByRecord(recordId: string) {
  return apiFetch<MedicalReport[]>(`/medical-reports/record/${recordId}`);
}

export function createMedicalReport(data: {
  clinicalRecordId: string;
  patientId: string;
  type: MedicalReportType;
  title?: string;
  referringDoctorId?: string;
  medicalCenterId?: string;
  content?: string;
  constanciaText?: string;
  realizandoseText?: string;
  indicatesRest?: boolean;
}) {
  return apiFetch<MedicalReport>("/medical-reports", { method: "POST", body: JSON.stringify(data) });
}

export function updateMedicalReport(
  id: string,
  changes: Partial<{
    title: string;
    referringDoctorId: string;
    medicalCenterId: string;
    content: string;
    constanciaText: string;
    realizandoseText: string;
    indicatesRest: boolean;
  }>,
) {
  return apiFetch<MedicalReport>(`/medical-reports/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export function deleteMedicalReport(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/medical-reports/${id}`, { method: "DELETE" });
}

export function medicalReportPdfUrl(id: string, fecha?: string): string {
  return buildPdfUrl(`${API_URL}/medical-reports/${id}/pdf`, fecha);
}

/** Abre el PDF del informe/constancia en pestaña nueva. Mismo patrón que openClinicalRecordPdf/openPregnancyPdf. */
export function openMedicalReportPdf(id: string, fecha?: string) {
  return openPdfInTab(medicalReportPdfUrl(id, fecha));
}
