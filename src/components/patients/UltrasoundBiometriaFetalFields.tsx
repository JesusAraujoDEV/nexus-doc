import { NumberField, FieldProps } from "./ultrasound-field-inputs";

/** Biometría fetal: medidas en mm que la doctora toma de cada hueso/estructura, más peso y líquido estimados. */
export function UltrasoundBiometriaFetalFields(p: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="DBP (mm)" field="DBP" {...p} />
        <NumberField label="Circunferencia Abdominal (mm)" field="CIR-ABD" {...p} />
        <NumberField label="DOF (mm)" field="DOF" {...p} />
        <NumberField label="L. Sacro (mm)" field="L-SACRO" {...p} />
        <NumberField label="Circunferencia Cefálica (mm)" field="CIR-CEF-MAN" {...p} />
        <NumberField label="D.T. Cerebeloso (mm)" field="DTC" {...p} />
        <NumberField label="I. Órbita E. (mm)" field="I-ORB-E" {...p} />
        <NumberField label="I. Órbita I. (mm)" field="I-ORB-I" {...p} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Huesos largos (mm)</p>
        <div className="grid grid-cols-3 gap-3">
          <NumberField label="L. Húmero" field="L-HUMER-VAL" {...p} />
          <NumberField label="Fémur" field="FEMUR-VAL" {...p} />
          <NumberField label="Tibia" field="TIBIA-VAL" {...p} />
          <NumberField label="Cúbito" field="HULAR-CUB-VAL" {...p} />
          <NumberField label="Peroné" field="HULAR-PER-VAL" {...p} />
          <NumberField label="Radio" field="HULAR-RAD-VAL" {...p} />
          <NumberField label="N.O. Húmero" field="NO-HUM" {...p} />
          <NumberField label="N.O.D.F" field="NODF" {...p} />
          <NumberField label="N.O.P.T" field="NOPT" {...p} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Peso Estimado Fetal (gr)" field="PESO-EST-FET" {...p} />
        <NumberField label="Líquido Amniótico (mm)" field="OG-NIV-LIQ-AMN" {...p} />
      </div>
    </div>
  );
}
