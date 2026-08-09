import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SuggestCombobox } from "./SuggestCombobox";
import { fetchUltrasoundSuggestions } from "@/lib/clinical-records-api";

export type UltrasoundValues = Record<string, string | number>;

export interface FieldProps {
  values: UltrasoundValues;
  onChange: (values: UltrasoundValues) => void;
}

/** Campo de catálogo: sugiere lo que ya se ha escrito antes para esa clave de MedDig. */
export function CatalogField({ label, field, values, onChange }: { label: string; field: string } & FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <SuggestCombobox
        value={String(values[field] ?? "")}
        onChange={(v) => onChange({ ...values, [field]: v })}
        suggestionsKey={`ultrasound-${field}`}
        fetchSuggestions={() => fetchUltrasoundSuggestions(field)}
      />
    </div>
  );
}

/** Campo numérico (dimensiones en mm, gramos, etc). */
export function NumberField({ label, field, values, onChange }: { label: string; field: string } & FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        step="1"
        value={values[field] ?? ""}
        onChange={(e) => onChange({ ...values, [field]: e.target.value === "" ? "" : Number(e.target.value) })}
      />
    </div>
  );
}

/** Campo de texto libre corto (Doppler no tiene catálogo histórico, son mediciones/notas puntuales). */
export function TextField({ label, field, values, onChange }: { label: string; field: string } & FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={String(values[field] ?? "")}
        onChange={(e) => onChange({ ...values, [field]: e.target.value })}
      />
    </div>
  );
}
