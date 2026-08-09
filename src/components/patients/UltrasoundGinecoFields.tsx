import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CatalogField, NumberField, FieldProps } from "./ultrasound-field-inputs";
import { UltrasoundUteroFields } from "./UltrasoundUteroFields";
import { UltrasoundOvariosFields } from "./UltrasoundOvariosFields";

/** Examen ginecológico normal (no embarazada): útero, endométrio, anexos. */
export function UltrasoundGinecoFields(p: FieldProps) {
  const { values, onChange } = p;
  return (
    <div className="space-y-4">
      <CatalogField label="Transductor" field="TIP-TRANS" {...p} />
      <UltrasoundUteroFields {...p} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Endométrio</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Espesor (mm)" field="ESP-END" {...p} />
          <CatalogField label="Características" field="ENDOMETRIO" {...p} />
        </div>
      </div>
      <CatalogField label="F.S. Douglas" field="FS-DOUGLAS" {...p} />
      <UltrasoundOvariosFields {...p} />
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
