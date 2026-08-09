import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SuggestCombobox } from "./SuggestCombobox";
import { fetchUltrasoundSuggestions } from "@/lib/patients-api";

export type UltrasoundValues = Record<string, string | number>;

interface Props {
  values: UltrasoundValues;
  onChange: (values: UltrasoundValues) => void;
}

/** Campo de catálogo: sugiere lo que ya se ha escrito antes para esa clave de MedDig. */
function CatalogField({ label, field, values, onChange }: { label: string; field: string } & Props) {
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

/** Campo numérico (dimensiones en mm). */
function NumberField({ label, field, values, onChange }: { label: string; field: string } & Props) {
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

/**
 * Formulario de ecografía dentro de una consulta: mismos campos que la pestaña
 * "Ultrasonido" de MedDig (útero, dimensiones, endométrio, anexos/ovarios).
 * Cada campo de catálogo sugiere lo ya escrito antes, en vez de un picklist fijo.
 */
export function UltrasoundFieldsEditor({ values, onChange }: Props) {
  const p = { values, onChange };
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Ultrasonido</p>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Embarazo (si aplica)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>F.U.M</Label>
            <Input type="date" value={String(values.FUM ?? "")} onChange={(e) => onChange({ ...values, FUM: e.target.value })} />
          </div>
          <NumberField label="Semanas de gestación (hoy)" field="EDAD-GEST-SEM" {...p} />
        </div>
      </div>

      <CatalogField label="Transductor" field="TIP-TRANS" {...p} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Útero</p>
        <div className="grid grid-cols-2 gap-3">
          <CatalogField label="Posición" field="UTERO-POS" {...p} />
          <CatalogField label="Forma" field="UTERO-FOR" {...p} />
          <CatalogField label="Bordes" field="UTERO-BOR" {...p} />
          <CatalogField label="Miometrio" field="MIOMETRIO" {...p} />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Dimensiones (mm)</p>
        <div className="grid grid-cols-3 gap-3">
          <NumberField label="Long" field="LONG-MIOM" {...p} />
          <NumberField label="Transv" field="LONG-TRANSV-MIOM" {...p} />
          <NumberField label="Ant-Post" field="LONG-ANT-POST-MIOM" {...p} />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Endométrio</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Espesor (mm)" field="ESP-END" {...p} />
          <CatalogField label="Características" field="ENDOMETRIO" {...p} />
        </div>
      </div>

      <CatalogField label="F.S. Douglas" field="FS-DOUGLAS" {...p} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Anexos</p>
        <div className="grid grid-cols-2 gap-3">
          <CatalogField label="Ovario derecho" field="OV-DER" {...p} />
          <CatalogField label="Ovario izquierdo" field="OV-IZQ" {...p} />
          <NumberField label="Ov. D. dim 1" field="OV-DER-M1" {...p} />
          <NumberField label="Ov. I. dim 1" field="OV-IZQ-M1" {...p} />
          <NumberField label="Ov. D. dim 2" field="OV-DER-M2" {...p} />
          <NumberField label="Ov. I. dim 2" field="OV-IZQ-M2" {...p} />
          <NumberField label="Ov. D. dim 3" field="OV-DER-M3" {...p} />
          <NumberField label="Ov. I. dim 3" field="OV-IZQ-M3" {...p} />
        </div>
      </div>

      <div>
        <Label>Otros hallazgos y Doppler</Label>
        <Textarea
          value={String(values["O-HALL-DOP"] ?? "")}
          onChange={(e) => onChange({ ...values, "O-HALL-DOP": e.target.value })}
          rows={2}
        />
      </div>
      <CatalogField label="IDx (impresión diagnóstica)" field="IDX-FET-TXT" {...p} />
    </div>
  );
}
