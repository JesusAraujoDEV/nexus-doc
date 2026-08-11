import { apiFetch, API_URL, getToken, ApiError } from "@/lib/api";

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

/** Abre el PDF del informe/constancia en pestaña nueva. Mismo patrón que openClinicalRecordPdf/openPregnancyPdf. */
export async function openMedicalReportPdf(id: string) {
  const tab = window.open("", "_blank");
  const token = getToken();
  const res = await fetch(`${API_URL}/medical-reports/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    tab?.close();
    throw new ApiError(res.status, `No se pudo generar el PDF (${res.status})`);
  }
  const blob = await res.blob();
  if (tab) tab.location.href = URL.createObjectURL(blob);
}
