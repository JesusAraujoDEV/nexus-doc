import { CatalogItem, CatalogKey } from "@/lib/catalogs-api";

export interface CatalogField {
  key: keyof CatalogItem;
  label: string;
  type: "text" | "checkbox";
  required?: boolean;
}

// ponytail: campos reales por modelo (ver db/models en el backend), no genéricos.
export const CATALOG_FIELDS: Record<CatalogKey, CatalogField[]> = {
  "medical-centers": [
    { key: "name", label: "Nombre", type: "text", required: true },
    { key: "address", label: "Dirección", type: "text" },
  ],
  diagnoses: [
    { key: "name", label: "Nombre", type: "text", required: true },
    { key: "icd10Code", label: "Código CIE-10", type: "text" },
  ],
  medications: [
    { key: "commercialName", label: "Nombre comercial", type: "text", required: true },
    { key: "genericName", label: "Nombre genérico", type: "text" },
    { key: "presentation", label: "Presentación", type: "text" },
  ],
  "lab-exams": [
    { key: "name", label: "Nombre", type: "text", required: true },
    { key: "isGroup", label: "Es un grupo de exámenes", type: "checkbox" },
  ],
  labs: [{ key: "name", label: "Nombre", type: "text", required: true }],
  icd10: [
    { key: "title", label: "Descripción", type: "text", required: true },
    { key: "code", label: "Código", type: "text" },
  ],
  "referring-doctors": [
    { key: "name", label: "Nombre", type: "text", required: true },
    { key: "specialty", label: "Especialidad", type: "text" },
  ],
};
