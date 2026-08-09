import { CatalogField, NumberField, FieldProps } from "./ultrasound-field-inputs";

/** Cuerpo uterino: igual en el examen ginecológico y en el "Cuerpo Uterino" del 1er trimestre obstétrico. */
export function UltrasoundUteroFields(p: FieldProps) {
  return (
    <>
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
    </>
  );
}
