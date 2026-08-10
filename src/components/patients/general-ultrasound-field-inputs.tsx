import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SuggestCombobox } from "./SuggestCombobox";
import { fetchGeneralUltrasoundSuggestions } from "@/lib/general-ultrasounds-api";

export type GuValues = Record<string, string | number>;

export interface GuFieldProps {
  values: GuValues;
  onChange: (values: GuValues) => void;
}

/** Campo de texto libre con autocompletado de lo ya escrito antes para ese código legado. */
export function GuField({ label, field, values, onChange }: { label: string; field: string } & GuFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <SuggestCombobox
        value={String(values[field] ?? "")}
        onChange={(v) => onChange({ ...values, [field]: v })}
        suggestionsKey={`general-ultrasound-${field}`}
        fetchSuggestions={() => fetchGeneralUltrasoundSuggestions(field)}
      />
    </div>
  );
}

/** Campo numérico (dimensiones en mm). */
export function GuNumberField({ label, field, values, onChange }: { label: string; field: string } & GuFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        value={values[field] ?? ""}
        onChange={(e) => onChange({ ...values, [field]: e.target.value === "" ? "" : Number(e.target.value) })}
      />
    </div>
  );
}

/** Observaciones / Conclusiones: texto largo, sin autocompletado (es redacción libre, no un hallazgo puntual). */
export function GuTextarea({ label, field, values, onChange }: { label: string; field: string } & GuFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea value={String(values[field] ?? "")} onChange={(e) => onChange({ ...values, [field]: e.target.value })} rows={2} />
    </div>
  );
}
