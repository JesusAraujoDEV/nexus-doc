import { useState } from "react";
import { cn } from "@/lib/utils";
import { UltrasoundValues, FieldProps } from "./ultrasound-field-inputs";
import { UltrasoundGinecoFields } from "./UltrasoundGinecoFields";
import { UltrasoundObstetrico1erFields } from "./UltrasoundObstetrico1erFields";
import { UltrasoundObstetrico23Fields } from "./UltrasoundObstetrico23Fields";

export type { UltrasoundValues } from "./ultrasound-field-inputs";

type ObstetricMode = "obst1" | "obst23";
const OBSTETRIC_MODES: { key: ObstetricMode; label: string }[] = [
  { key: "obst1", label: "1er trimestre" },
  { key: "obst23", label: "2do/3er trimestre" },
];

/** Si ya hay datos cargados (editando), abre en el trimestre que corresponda a lo que se guardó. */
function detectObstetricMode(values: UltrasoundValues): ObstetricMode {
  if (["PRESENT", "SITUAC", "DBP", "CIR-ABD"].some((f) => values[f] !== undefined)) return "obst23";
  return "obst1";
}

interface Props extends FieldProps {
  /** Ginecología solo usa el examen normal; Obstetricia usa los formularios por trimestre. */
  category: "gynecology" | "obstetrics";
}

/**
 * Formulario de ecografía dentro de una consulta. En Ginecología es un único
 * formato (útero/anexos); en Obstetricia hay 2 formatos según trimestre (1er vs
 * 2do-3er) porque MedDig los pide distinto - la doctora elige cuál está usando.
 */
export function UltrasoundFieldsEditor({ values, onChange, category }: Props) {
  const [mode, setMode] = useState<ObstetricMode>(() => detectObstetricMode(values));

  function selectMode(m: ObstetricMode) {
    setMode(m);
    // 1er trimestre no necesita preguntar - lo marca solo. 2do/3er sí lo elige la doctora.
    if (m === "obst1") onChange({ ...values, TRIMESTRE: 1 });
  }

  if (category === "gynecology") {
    return (
      <div className="space-y-4 rounded-lg border border-border p-4">
        <p className="text-sm font-semibold text-foreground">Ultrasonido</p>
        <UltrasoundGinecoFields values={values} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Ultrasonido obstétrico</p>
      <div className="flex gap-2 flex-wrap">
        {OBSTETRIC_MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => selectMode(m.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              mode === m.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "obst1" && <UltrasoundObstetrico1erFields values={values} onChange={onChange} />}
      {mode === "obst23" && <UltrasoundObstetrico23Fields values={values} onChange={onChange} />}
    </div>
  );
}
