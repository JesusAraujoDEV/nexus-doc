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
  privateNotes: string | null;
  visitType: string | null;
  createdAt: string;
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
