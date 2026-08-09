import { CatalogField, NumberField, FieldProps } from "./ultrasound-field-inputs";

/** Ovarios: se usa en el examen ginecológico y en los anexos del 1er trimestre obstétrico. */
export function UltrasoundOvariosFields(p: FieldProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Ovarios</p>
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
  );
}
