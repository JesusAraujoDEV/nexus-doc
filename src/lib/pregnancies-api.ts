import { apiFetch, API_URL, getToken, ApiError } from "@/lib/api";
import { ClinicalRecord } from "@/lib/clinical-records-api";

export interface NewbornData {
  birthDate?: string | null;
  deliveryType?: string | null;
  name?: string | null;
  weight?: number | null;
  length?: number | null;
  medicalCenter?: string | null;
  admissionDate?: string | null;
  dischargeDate?: string | null;
  perinealInjury?: string | null;
  observations?: string | null;
}

export interface Pregnancy {
  id: string;
  patientId: string;
  pregnancyNumber: number;
  lmpDate: string | null;
  lmpSource: "reported" | "estimated";
  lmpReferenceDate: string | null;
  lmpReferenceWeeks: number | null;
  lmpReferenceDays: number | null;
  fetalSex: string | null;
  isFinalized: boolean;
  isLoss: boolean;
  isEctopic: boolean;
  newbornData: NewbornData | null;
  notes: string | null;
  gestationalAgeWeeks: number | null;
  gestationalAgeDays: number | null;
  dueDate: string | null;
  lmpExplanation: string | null;
  clinicalRecords?: ClinicalRecord[];
}

export interface CreatePregnancyData {
  patientId: string;
  lmpSource?: "reported" | "estimated";
  lmpDate?: string;
  lmpReferenceDate?: string;
  lmpReferenceWeeks?: number;
  lmpReferenceDays?: number;
  fetalSex?: string;
  notes?: string;
}

export function createPregnancy(data: CreatePregnancyData) {
  return apiFetch<Pregnancy>("/pregnancies", { method: "POST", body: JSON.stringify(data) });
}

export function fetchPregnanciesByPatient(patientId: string) {
  return apiFetch<Pregnancy[]>(`/pregnancies/patient/${patientId}`);
}

export function fetchPregnancy(id: string) {
  return apiFetch<Pregnancy>(`/pregnancies/${id}`);
}

export function updatePregnancy(id: string, changes: Partial<Pregnancy>) {
  return apiFetch<Pregnancy>(`/pregnancies/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export function deletePregnancy(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/pregnancies/${id}`, { method: "DELETE" });
}

export async function openPregnancyPdf(id: string) {
  const tab = window.open("", "_blank");
  const token = getToken();
  const res = await fetch(`${API_URL}/pregnancies/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    tab?.close();
    throw new ApiError(res.status, `No se pudo generar el PDF (${res.status})`);
  }
  const blob = await res.blob();
  if (tab) tab.location.href = URL.createObjectURL(blob);
}
