import { GuField, GuTextarea, GuFieldProps } from "./general-ultrasound-field-inputs";

/** Partes blandas: zona de interés, piel/tejidos, planos musculares, glándulas, vascular. */
export function GeneralUltrasoundPartesBlandasFields(p: GuFieldProps) {
  return (
    <div className="space-y-4">
      <GuField label="Zona de interés" field="EC-PB-ZONA" {...p} />
      <GuField label="Piel y tejidos subcutáneos" field="EC-PB-PYTS" {...p} />
      <GuField label="Planos musculares y trayectos fibrilares" field="EC-PB-PMTF" {...p} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <GuField label="Glándulas submaxilares" field="EC-PB-GLSU" {...p} />
        <GuField label="Glándulas tiroidea" field="EC-PB-GLTI" {...p} />
        <GuField label="Glándulas parótidas" field="EC-PB-GLPA" {...p} />
      </div>
      <GuField label="Detalle vascular" field="EC-PB-DEVA" {...p} />
      <GuTextarea label="Conclusiones" field="EC-PB-CON" {...p} />
    </div>
  );
}
