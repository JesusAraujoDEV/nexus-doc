import { apiFetch } from "@/lib/api";

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
  clinicalRecords: ClinicalRecord[];
}

export function fetchPatients(params: { search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  return apiFetch<PatientListResponse>(`/patients?${query.toString()}`);
}

export function fetchPatient(id: string) {
  return apiFetch<PatientDetail>(`/patients/${id}`);
}
