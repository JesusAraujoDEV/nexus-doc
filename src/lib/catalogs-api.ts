import { apiFetch } from "@/lib/api";

export type CatalogKey = "medical-centers" | "diagnoses" | "medications" | "lab-exams" | "labs" | "icd10";

export interface CatalogItem {
  id: string;
  name?: string;
  address?: string | null;
  icd10Code?: string | null;
  commercialName?: string;
  genericName?: string | null;
  presentation?: string | null;
  isGroup?: boolean;
  code?: string;
  title?: string;
}

export interface CatalogResponse {
  items: CatalogItem[];
  total: number;
  page: number;
  pages: number;
}

export function fetchCatalog(key: CatalogKey, params: { search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  return apiFetch<CatalogResponse>(`/catalogs/${key}?${query.toString()}`);
}
