import { apiFetch } from "@/lib/api";
import { UltrasoundFieldSuggestion } from "@/lib/clinical-records-api";

/** Los 9 subtipos del catálogo legado TP-ECO.DAT. Fuente: nexus-doc-back/libs/general-ultrasound-types.js */
export const GENERAL_ULTRASOUND_SUB_TYPES = [
  "abdominal",
  "hepatobiliar",
  "partes_blandas",
  "mamario",
  "pelvico_transvaginal",
  "prostatico",
  "renal",
  "tiroideo",
  "testicular",
] as const;

export type GeneralUltrasoundSubType = (typeof GENERAL_ULTRASOUND_SUB_TYPES)[number];

export const GENERAL_ULTRASOUND_SUB_TYPE_LABELS: Record<GeneralUltrasoundSubType, string> = {
  abdominal: "Abdominal",
  hepatobiliar: "Hepatobiliar",
  partes_blandas: "Partes blandas",
  mamario: "Mamas",
  pelvico_transvaginal: "Pélvico transvaginal",
  prostatico: "Próstata",
  renal: "Renal",
  tiroideo: "Tiroides",
  testicular: "Testicular",
};

export interface GeneralUltrasound {
  id: string;
  clinicalRecordId: string;
  subType: GeneralUltrasoundSubType;
  findings: Record<string, string | number>;
}

export function fetchGeneralUltrasoundsByRecord(recordId: string) {
  return apiFetch<GeneralUltrasound[]>(`/general-ultrasounds/record/${recordId}`);
}

export function saveGeneralUltrasound(data: {
  clinicalRecordId: string;
  subType: GeneralUltrasoundSubType;
  findings: Record<string, string | number>;
}) {
  return apiFetch<GeneralUltrasound>("/general-ultrasounds", { method: "POST", body: JSON.stringify(data) });
}

export function deleteGeneralUltrasound(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/general-ultrasounds/${id}`, { method: "DELETE" });
}

export function fetchGeneralUltrasoundSuggestions(field: string) {
  return apiFetch<UltrasoundFieldSuggestion[]>(`/clinical-records/suggestions/general-ultrasound?field=${encodeURIComponent(field)}`);
}
