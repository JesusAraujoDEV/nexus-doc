import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumberField, FieldProps } from "./ultrasound-field-inputs";

/** F.U.M + semanas de gestación: alimenta el cálculo de semanas/FPP en el perfil de la paciente. */
export function UltrasoundEmbarazoFields({ values, onChange }: FieldProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label>F.U.M</Label>
        <Input type="date" value={String(values.FUM ?? "")} onChange={(e) => onChange({ ...values, FUM: e.target.value })} />
      </div>
      <NumberField label="Semanas de gestación (hoy)" field="EDAD-GEST-SEM" values={values} onChange={onChange} />
    </div>
  );
}
