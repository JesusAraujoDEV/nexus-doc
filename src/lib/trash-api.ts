import { apiFetch } from "@/lib/api";

export interface DeletedPatient {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string | null;
  phone: string | null;
  deletedAt: string;
}

export interface DeletedClinicalRecord {
  id: string;
  visitType: string | null;
  visitDate: string | null;
  createdAt: string;
  deletedAt: string;
  patient: { id: string; firstName: string; lastName: string } | null;
}

export function fetchPatientsTrash() {
  return apiFetch<DeletedPatient[]>("/patients/trash");
}

export function restorePatient(id: string) {
  return apiFetch<{ id: string }>(`/patients/${id}/restore`, { method: "POST" });
}

export function fetchClinicalRecordsTrash() {
  return apiFetch<DeletedClinicalRecord[]>("/clinical-records/trash");
}

export function restoreClinicalRecord(id: string) {
  return apiFetch<DeletedClinicalRecord>(`/clinical-records/${id}/restore`, { method: "POST" });
}
