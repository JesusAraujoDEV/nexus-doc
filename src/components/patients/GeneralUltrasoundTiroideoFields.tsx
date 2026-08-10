import { GuField, GuNumberField, GuTextarea, GuFieldProps } from "./general-ultrasound-field-inputs";

/** Un lóbulo tiroideo (der o izq): mismos 6 campos, solo cambia el prefijo. */
function LobuloFields({ side, label, ...p }: { side: "LD" | "LI"; label: string } & GuFieldProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{label}</p>
      <GuField label={label} field={`EC-TIR-${side}`} {...p} />
      <div className="grid grid-cols-3 gap-3 mt-2">
        <GuNumberField label="Longitud (mm)" field={`EC-TIR-${side}-L`} {...p} />
        <GuNumberField label="Ántero-post (mm)" field={`EC-TIR-${side}-AP`} {...p} />
        <GuNumberField label="Transverso (mm)" field={`EC-TIR-${side}-T`} {...p} />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <GuField label="Parénquima" field={`EC-TIR-${side}-PAR`} {...p} />
        <GuField label="Carótida" field={`EC-TIR-${side}-CAR`} {...p} />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <GuField label="Yugular" field={`EC-TIR-${side}-YUG`} {...p} />
        <GuField label="Relaciones musculares" field={`EC-TIR-${side}-R-M`} {...p} />
      </div>
    </div>
  );
}

/** Tiroides: istmo + lóbulo derecho + lóbulo izquierdo. */
export function GeneralUltrasoundTiroideoFields(p: GuFieldProps) {
  return (
    <div className="space-y-4">
      <GuNumberField label="Istmo (mm)" field="EC-TIR-IST" {...p} />
      <LobuloFields side="LD" label="Lóbulo derecho" {...p} />
      <LobuloFields side="LI" label="Lóbulo izquierdo" {...p} />
      <GuTextarea label="Conclusiones" field="EC-TIR-CON" {...p} />
    </div>
  );
}
