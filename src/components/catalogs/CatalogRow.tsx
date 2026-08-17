import { CatalogItem, CatalogKey } from "@/lib/catalogs-api";

function primaryText(key: CatalogKey, item: CatalogItem) {
  if (key === "medications") return item.commercialName;
  if (key === "icd10") return item.title;
  return item.name;
}

function secondaryText(key: CatalogKey, item: CatalogItem) {
  if (key === "medical-centers") return item.address;
  if (key === "diagnoses") return item.icd10Code ? `CIE-10: ${item.icd10Code}` : null;
  if (key === "medications") return [item.genericName, item.presentation].filter(Boolean).join(" · ");
  if (key === "lab-exams") return item.isGroup ? "Grupo de exámenes" : "Examen individual";
  if (key === "icd10") return item.code;
  if (key === "referring-doctors") return item.specialty;
  return null;
}

export function CatalogRow({ catalogKey, item }: { catalogKey: CatalogKey; item: CatalogItem }) {
  const primary = primaryText(catalogKey, item);
  const secondary = secondaryText(catalogKey, item);
  return (
    <div className="medical-card p-3.5 flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-foreground">{primary}</span>
      {secondary && <span className="text-xs text-muted-foreground">{secondary}</span>}
    </div>
  );
}
