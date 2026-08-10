import { GuField, GuNumberField, GuFieldProps } from "./general-ultrasound-field-inputs";
import { GeneralUltrasoundSubType } from "@/lib/general-ultrasounds-api";

interface FieldDef {
  label: string;
  field: string;
  numeric?: boolean;
}

/** Campos simplificados (label + input) para los 4 subtipos sin maqueta detallada. */
const GENERIC_FIELDS: Record<string, FieldDef[]> = {
  hepatobiliar: [{ label: "Conclusiones", field: "EC-HB-CON" }],
  pelvico_transvaginal: [
    { label: "Cuello uterino", field: "EC-PTV-CU" },
    { label: "Vagina", field: "EC-PTV-VA" },
    { label: "Vejiga", field: "EC-PTV-VE" },
    { label: "Conclusiones", field: "EC-PTV-CON" },
  ],
  prostatico: [
    { label: "Medida 1 (mm)", field: "EC-PRO-M1", numeric: true },
    { label: "Medida 2 (mm)", field: "EC-PRO-M2", numeric: true },
    { label: "Volumen", field: "EC-PRO-V" },
    { label: "Peso", field: "EC-PRO-P" },
    { label: "Tamaño", field: "EC-PRO-TAM" },
    { label: "Simetría", field: "EC-PRO-SIM" },
    { label: "Bordes", field: "EC-PRO-BOR" },
    { label: "Parénquima", field: "EC-PRO-PAR" },
    { label: "Vesículas seminales", field: "EC-PRO-VES-SEM" },
    { label: "Conclusiones", field: "EC-PRO-CON" },
  ],
  testicular: [
    { label: "Testículo der", field: "EC-TES-D" },
    { label: "Longitud der (mm)", field: "EC-TES-D-L", numeric: true },
    { label: "Ántero-post der (mm)", field: "EC-TES-D-AP", numeric: true },
    { label: "Transverso der (mm)", field: "EC-TES-D-T", numeric: true },
    { label: "Centro der", field: "EC-TES-D-CE" },
    { label: "Der (obs)", field: "EC-TES-D-PP" },
    { label: "Testículo izq", field: "EC-TES-I" },
    { label: "Longitud izq (mm)", field: "EC-TES-I-L", numeric: true },
    { label: "Ántero-post izq (mm)", field: "EC-TES-I-AP", numeric: true },
    { label: "Transverso izq (mm)", field: "EC-TES-I-T", numeric: true },
    { label: "Centro izq", field: "EC-TES-I-CE" },
    { label: "Izq (obs)", field: "EC-TES-I-PP" },
    { label: "Conclusiones", field: "EC-TES-CON" },
  ],
};

/** Fallback genérico (label + input) para los subtipos sin maqueta detallada del brief. */
export function GeneralUltrasoundGenericFields({ subType, ...p }: { subType: GeneralUltrasoundSubType } & GuFieldProps) {
  const fields = GENERIC_FIELDS[subType] || [];
  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map((f) =>
        f.numeric ? <GuNumberField key={f.field} label={f.label} field={f.field} {...p} /> : <GuField key={f.field} label={f.label} field={f.field} {...p} />,
      )}
    </div>
  );
}
