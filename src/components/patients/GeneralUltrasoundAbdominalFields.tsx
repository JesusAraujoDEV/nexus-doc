import { GuField, GuNumberField, GuTextarea, GuFieldProps } from "./general-ultrasound-field-inputs";

/** Abdominal: hígado, vesícula, vías biliares, páncreas, aorta/cava, bazo, estómago, colon, riñones, vejiga. */
export function GeneralUltrasoundAbdominalFields(p: GuFieldProps) {
  return (
    <div className="space-y-4">
      <GuField label="Hígado" field="EC-HIG" {...p} />
      <div className="grid grid-cols-4 gap-3">
        <GuNumberField label="Lóbulo der (mm)" field="EC-HIG-LD" {...p} />
        <GuNumberField label="Lóbulo izq (mm)" field="EC-HIG-LI" {...p} />
        <GuNumberField label="Porta hepática (mm)" field="EC-HIG-PH" {...p} />
        <GuNumberField label="Colédoco (mm)" field="EC-HIG-CL" {...p} />
      </div>
      <GuField label="Vesícula" field="EC-VES" {...p} />
      <div className="grid grid-cols-2 gap-3">
        <GuNumberField label="Dimensión 1 (mm)" field="EC-VES-DIM-1" {...p} />
        <GuNumberField label="Dimensión 2 (mm)" field="EC-VES-DIM-2" {...p} />
      </div>
      <GuField label="Vías biliares" field="EC-VIB" {...p} />
      <GuField label="Páncreas" field="EC-PAN" {...p} />
      <div className="grid grid-cols-3 gap-3">
        <GuNumberField label="Cabeza (mm)" field="EC-PAN-CAB" {...p} />
        <GuNumberField label="Cuerpo (mm)" field="EC-PAN-CUE" {...p} />
        <GuNumberField label="Cola (mm)" field="EC-PAN-COL" {...p} />
      </div>
      <GuField label="Aorta, cava y resto de vasos peritoneales" field="EC-AO-CAV-RVP" {...p} />
      <GuField label="Bazo" field="EC-BAZ" {...p} />
      <div className="grid grid-cols-2 gap-3">
        <GuNumberField label="Dimensión 1 (mm)" field="EC-BAZ-DIM-1" {...p} />
        <GuNumberField label="Dimensión 2 (mm)" field="EC-BAZ-DIM-2" {...p} />
      </div>
      <GuField label="Estómago" field="EC-EST" {...p} />
      <GuField label="Colon" field="EC-COL" {...p} />
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
      <GuTextarea label="Observaciones" field="EC-ABD-OBS" {...p} />
      <GuTextarea label="Conclusiones" field="EC-ABD-CON" {...p} />
    </div>
  );
}
