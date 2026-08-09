import { apiFetch, API_URL, getToken, ApiError } from "@/lib/api";

export interface PatientListItem {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string | null;
  phone: string | null;
  visitsCount: string;
  lastVisit: string | null;
}

export interface PatientListResponse {
  items: PatientListItem[];
  total: number;
  page: number;
  pages: number;
}

export interface RecipeItem {
  nombre: string | null;
  comercial: string | null;
  posologia: string | null;
}

export interface ClinicalRecord {
  id: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  labOrders: string | null;
  privateNotes: string | null;
  visitType: string | null;
  /** Fecha real de la consulta. Puede faltar en registros antiguos. */
  visitDate: string | null;
  /** Cuándo se creó la fila, no cuándo ocurrió la consulta. */
  createdAt: string;
  /** Récipe como items separados. Null si la consulta no tuvo récipe. */
  recipeItems: RecipeItem[] | null;
  /** Hallazgos de ecografía (útero, ovarios, biometría fetal). Null si no se hizo ecografía. */
  ultrasoundFindings: Record<string, string | number> | null;
  nextAppointmentDate: string | null;
}

/**
 * Fecha que debe mostrarse para una consulta: la real si existe, y si no la de
 * creación de la fila. Se centraliza acá para no repetir la decisión en cada
 * componente: mostrar createdAt como fecha de consulta fue justamente el bug
 * que hacía que toda la historia importada apareciera con la fecha de la carga.
 */
export function consultationDate(record: ClinicalRecord): string {
  return record.visitDate || record.createdAt;
}

export type ReferredByType = "redes" | "otro_doctor" | "colega" | "amigo" | "otro";

export interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  medicalBackground: Record<string, unknown> | null;
  referredByType: ReferredByType | null;
  referredByDetail: string | null;
  clinicalRecords: ClinicalRecord[];
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string;
  birthDate?: string;
  address?: string;
  referredByType?: ReferredByType;
  referredByDetail?: string;
  medicalBackground?: Record<string, unknown>;
}

export function createPatient(data: CreatePatientData) {
  return apiFetch<PatientDetail>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type PatientSortBy = "name" | "cedula" | "createdAt" | "visitsCount" | "lastVisit";
export type SortDir = "ASC" | "DESC";

export interface PatientListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: PatientSortBy;
  sortDir?: SortDir;
  gender?: "Femenino" | "Masculino";
  hasVisits?: "true" | "false";
  hasCedula?: "true" | "false";
}

export function fetchPatients(params: PatientListParams) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDir) query.set("sortDir", params.sortDir);
  if (params.gender) query.set("gender", params.gender);
  if (params.hasVisits) query.set("hasVisits", params.hasVisits);
  if (params.hasCedula) query.set("hasCedula", params.hasCedula);
  return apiFetch<PatientListResponse>(`/patients?${query.toString()}`);
}

export function fetchPatient(id: string) {
  return apiFetch<PatientDetail>(`/patients/${id}`);
}

export function updatePatient(id: string, changes: Partial<Omit<PatientDetail, "id" | "clinicalRecords">>) {
  return apiFetch<PatientDetail>(`/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deletePatient(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/patients/${id}`, { method: "DELETE" });
}

export function updateClinicalRecord(id: string, changes: Partial<Omit<ClinicalRecord, "id" | "createdAt">>) {
  return apiFetch<ClinicalRecord>(`/clinical-records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteClinicalRecord(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/clinical-records/${id}`, { method: "DELETE" });
}

/**
 * Abre en una pestaña nueva el récipe o el informe de ecografía de una consulta, en PDF.
 * La pestaña se abre ANTES del fetch (sincrónico con el click) porque los navegadores
 * bloquean window.open() si se llama después de un await.
 */
export async function openClinicalRecordPdf(id: string, kind: "prescription" | "ultrasound") {
  const tab = window.open("", "_blank");
  const token = getToken();
  const res = await fetch(`${API_URL}/clinical-records/${id}/${kind}-pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    tab?.close();
    throw new ApiError(res.status, `No se pudo generar el PDF (${res.status})`);
  }
  const blob = await res.blob();
  if (tab) tab.location.href = URL.createObjectURL(blob);
}

export function createClinicalRecord(data: {
  patientId: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  labOrders?: string;
  privateNotes?: string;
  visitType?: string;
  visitDate?: string;
  recipeItems?: RecipeItem[];
  ultrasoundFindings?: Record<string, string | number>;
  nextAppointmentDate?: string;
}) {
  return apiFetch<ClinicalRecord>("/clinical-records", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface UltrasoundFieldSuggestion {
  value: string;
  count: number;
}

export function fetchUltrasoundSuggestions(field: string) {
  return apiFetch<UltrasoundFieldSuggestion[]>(`/clinical-records/suggestions/ultrasound?field=${encodeURIComponent(field)}`);
}

export interface MedicationSuggestion {
  nombre: string;
  posologia: string | null;
  count: number;
}

export function fetchMedicationSuggestions(q: string) {
  return apiFetch<MedicationSuggestion[]>(`/clinical-records/suggestions/medications?q=${encodeURIComponent(q)}`);
}
