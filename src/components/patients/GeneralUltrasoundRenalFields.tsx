import { GuField, GuNumberField, GuTextarea, GuFieldProps } from "./general-ultrasound-field-inputs";

/** Renal: riñones (mismos campos que en Abdominal) + vejiga. */
export function GeneralUltrasoundRenalFields(p: GuFieldProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Riñón derecho</p>
        <GuField label="Riñón der" field="EC-RIN-D" {...p} />
        <div className="grid grid-cols-4 gap-3 mt-2">
          <GuNumberField label="Longitud (mm)" field="EC-RIN-D-L" {...p} />
          <GuNumberField label="Transverso (mm)" field="EC-RIN-D-T" {...p} />
          <GuNumberField label="Ántero-post (mm)" field="EC-RIN-D-AP" {...p} />
          <GuNumberField label="Parénquima (mm)" field="EC-RIN-D-P" {...p} />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Riñón izquierdo</p>
        <GuField label="Riñón izq" field="EC-RIN-I" {...p} />
        <div className="grid grid-cols-4 gap-3 mt-2">
          <GuNumberField label="Longitud (mm)" field="EC-RIN-I-L" {...p} />
          <GuNumberField label="Transverso (mm)" field="EC-RIN-I-T" {...p} />
          <GuNumberField label="Ántero-post (mm)" field="EC-RIN-I-AP" {...p} />
          <GuNumberField label="Parénquima (mm)" field="EC-RIN-I-P" {...p} />
        </div>
      </div>
      <GuField label="Vejiga" field="EC-VEJ" {...p} />
      <GuTextarea label="Observaciones" field="EC-REN-OBS" {...p} />
      <GuTextarea label="Conclusiones" field="EC-REN-CON" {...p} />
    </div>
  );
}
