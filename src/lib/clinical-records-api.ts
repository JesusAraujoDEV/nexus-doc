import { apiFetch, API_URL, getToken, ApiError } from "@/lib/api";
import { buildPdfUrl } from "@/lib/pdf-url";
import { openPdfInTab } from "@/lib/open-pdf-tab";

export interface RecipeItem {
  nombre: string | null;
  comercial: string | null;
  posologia: string | null;
}

/** Constancia médica emitida en la consulta (migrada del legacy o cargada en el form). */
export interface MedicalCertificate {
  diagnostico?: string;
  motivo?: string;
  reposo?: boolean;
  diasReposo?: number | null;
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
  category: "gynecology" | "obstetrics";
  pregnancyId: string | null;
  indicatesPrescription: boolean;
  indicatesImagingStudy: boolean;
  /** Impresiones diagnósticas (hasta ~3 en el legacy). */
  diagnosticImpressions: string[] | null;
  medicalCertificate: MedicalCertificate | null;
  evolution: string | null;
  /** Recomendaciones / indicaciones a la paciente. */
  recommendations: string | null;
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

export function fetchClinicalRecord(id: string) {
  return apiFetch<ClinicalRecord>(`/clinical-records/${id}`);
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

export type ClinicalRecordPdfKind = "prescription" | "ultrasound" | "general-ultrasound" | "lab-exam";

export function clinicalRecordPdfUrl(id: string, kind: ClinicalRecordPdfKind, fecha?: string): string {
  return buildPdfUrl(`${API_URL}/clinical-records/${id}/${kind}-pdf`, fecha);
}

/**
 * Abre en una pestaña nueva el récipe o el informe de ecografía de una consulta, en PDF.
 * La pestaña se abre ANTES del fetch (sincrónico con el click) porque los navegadores
 * bloquean window.open() si se llama después de un await.
 */
export function openClinicalRecordPdf(id: string, kind: ClinicalRecordPdfKind, fecha?: string) {
  return openPdfInTab(clinicalRecordPdfUrl(id, kind, fecha));
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
  category?: "gynecology" | "obstetrics";
  pregnancyId?: string;
  indicatesPrescription?: boolean;
  indicatesImagingStudy?: boolean;
  diagnosticImpressions?: string[];
  medicalCertificate?: MedicalCertificate;
  evolution?: string;
  recommendations?: string;
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
  comercial: string | null;
  posologia: string | null;
  count: number;
}

export function fetchMedicationSuggestions(q: string) {
  return apiFetch<MedicationSuggestion[]>(`/clinical-records/suggestions/medications?q=${encodeURIComponent(q)}`);
}
