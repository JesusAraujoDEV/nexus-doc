import { GuField, GuTextarea, GuFieldProps } from "./general-ultrasound-field-inputs";

/** Mamas: mama derecha, mama izquierda, conclusiones. */
export function GeneralUltrasoundMamarioFields(p: GuFieldProps) {
  return (
    <div className="space-y-4">
      <GuField label="Mama derecha" field="EC-MAD" {...p} />
      <GuField label="Mama izquierda" field="EC-MAI" {...p} />
      <GuTextarea label="Conclusiones" field="EC-MA-CON" {...p} />
    </div>
  );
}
