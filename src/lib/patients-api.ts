import { apiFetch } from "@/lib/api";
import { ClinicalRecord } from "@/lib/clinical-records-api";

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

export type ReferredByType = "redes" | "otro_doctor" | "colega" | "amigo" | "otro";
export type AppointmentStatus = "PENDIENTE" | "CONFIRMADA" | "COMPLETADA" | "CANCELADA";

export interface PatientAppointment {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string | null;
  phone: string | null;
  /** Teléfono fijo / secundario (legacy PACIENTE.TELEFONO). */
  phoneSecondary: string | null;
  email: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  medicalBackground: Record<string, unknown> | null;
  referredByType: ReferredByType | null;
  referredByDetail: string | null;
  referredByDoctorId: string | null;
  weightKg: number | null;
  heightCm: number | null;
  clinicalRecords: ClinicalRecord[];
  appointments?: PatientAppointment[];
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  /** Opcional: menores sin cédula. El backend acepta null o "". */
  cedula?: string | null;
  phone?: string | null;
  birthDate?: string;
  address?: string;
  referredByType?: ReferredByType;
  referredByDetail?: string;
  referredByDoctorId?: string;
  medicalBackground?: Record<string, unknown>;
  weightKg?: number;
  heightCm?: number;
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
  pregnant?: "true" | "history";
  labsPending?: "true";
  /** Atendidas en los últimos 7/30/90 días, o "new" = primera consulta en los últimos 30 días. */
  recent?: "7" | "30" | "90" | "new";
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
  if (params.pregnant) query.set("pregnant", params.pregnant);
  if (params.labsPending) query.set("labsPending", params.labsPending);
  if (params.recent) query.set("recent", params.recent);
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
