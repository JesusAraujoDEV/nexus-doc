import { apiFetch } from "@/lib/api";

/** Catálogo de médicos referentes, compartido entre "Referido por" del paciente y los informes médicos. */
export interface ReferringDoctor {
  id: string;
  name: string;
  specialty: string | null;
  legacyCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export function fetchReferringDoctors(params: { search?: string; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.limit) q.set("limit", String(params.limit));
  return apiFetch<{ items: ReferringDoctor[]; total: number; page: number; pages: number }>(`/catalogs/referring-doctors?${q.toString()}`);
}

export function createReferringDoctor(data: { name: string; specialty?: string }) {
  return apiFetch<ReferringDoctor>("/catalogs/referring-doctors", { method: "POST", body: JSON.stringify(data) });
}
