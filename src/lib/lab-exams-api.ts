import { apiFetch } from "@/lib/api";

export type LabExamCategory = 1 | 2 | 3 | 4 | 5;

/** Mapeo UI-only: el backend no fija el significado de category, solo lo persiste. */
export const LAB_EXAM_CATEGORY_LABELS: Record<LabExamCategory, string> = {
  1: "Químicos",
  2: "Bioquímicos",
  3: "Hemáticos",
  4: "Microbiológicos",
  5: "Otros",
};

export interface LabExam {
  id: string;
  name: string;
  isGroup: boolean;
  category: LabExamCategory | null;
  legacyCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export function fetchLabExams(params: { search?: string; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.limit) q.set("limit", String(params.limit));
  return apiFetch<{ items: LabExam[]; total: number; page: number; pages: number }>(`/catalogs/lab-exams?${q.toString()}`);
}

export function createLabExam(data: { name: string; category?: LabExamCategory }) {
  return apiFetch<LabExam>("/catalogs/lab-exams", { method: "POST", body: JSON.stringify(data) });
}

export interface LabExamOrder {
  id: string;
  examId: string;
  patientId: string;
  orderedRecordId: string;
  orderedDate: string | null;
  resultRecordId: string | null;
  performedDate: string | null;
  resultValue: string | null;
  resultObservations: string | null;
  exam: LabExam;
}

export function createLabExamOrder(data: { examId: string; patientId: string; orderedRecordId: string; orderedDate?: string }) {
  return apiFetch<LabExamOrder>("/lab-exam-orders", { method: "POST", body: JSON.stringify(data) });
}

export function fetchPendingLabExamOrders(patientId: string) {
  return apiFetch<LabExamOrder[]>(`/lab-exam-orders/patient/${patientId}/pending`);
}

/** Historial completo (pendientes + con resultado) para la pestaña "Lab. exámenes" del perfil de la paciente. */
export function fetchLabExamOrdersByPatient(patientId: string) {
  return apiFetch<LabExamOrder[]>(`/lab-exam-orders/patient/${patientId}`);
}

export function fetchLabExamOrdersByRecord(recordId: string) {
  return apiFetch<LabExamOrder[]>(`/lab-exam-orders/record/${recordId}`);
}

export function recordLabExamResult(
  orderId: string,
  data: { resultRecordId: string; performedDate?: string; resultValue?: string; resultObservations?: string },
) {
  return apiFetch<LabExamOrder>(`/lab-exam-orders/${orderId}/result`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteLabExamOrder(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/lab-exam-orders/${id}`, { method: "DELETE" });
}
