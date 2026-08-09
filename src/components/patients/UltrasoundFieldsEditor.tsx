import { useState } from "react";
import { cn } from "@/lib/utils";
import { UltrasoundValues, FieldProps } from "./ultrasound-field-inputs";
import { UltrasoundGinecoFields } from "./UltrasoundGinecoFields";
import { UltrasoundObstetrico1erFields } from "./UltrasoundObstetrico1erFields";
import { UltrasoundObstetrico23Fields } from "./UltrasoundObstetrico23Fields";

export type { UltrasoundValues } from "./ultrasound-field-inputs";

type Mode = "gineco" | "obst1" | "obst23";
const MODES: { key: Mode; label: string }[] = [
  { key: "gineco", label: "Ginecológico" },
  { key: "obst1", label: "Obstétrico - 1er trimestre" },
  { key: "obst23", label: "Obstétrico - 2do/3er trimestre" },
];

/** Si ya hay datos cargados (editando), abre en el modo que corresponda a lo que se guardó. */
function detectMode(values: UltrasoundValues): Mode {
  if (["PRESENT", "SITUAC", "DBP", "CIR-ABD"].some((f) => values[f] !== undefined)) return "obst23";
  if (["SAC-GES", "EMBRION", "SAC-VIT"].some((f) => values[f] !== undefined)) return "obst1";
  return "gineco";
}

/**
 * Formulario de ecografía dentro de una consulta. La Dra. Arteaga usa 3 formatos
 * distintos en MedDig según el tipo de examen: ginecológico normal, obstétrico de
 * 1er trimestre (saco gestacional/embrión) y obstétrico de 2do-3er trimestre
 * (biometría fetal completa) - comparten motivo/récipe pero no el ultrasonido.
 */
export function UltrasoundFieldsEditor({ values, onChange }: FieldProps) {
  const [mode, setMode] = useState<Mode>(() => detectMode(values));

  function selectMode(m: Mode) {
    setMode(m);
    // 1er trimestre no necesita preguntar - lo marca solo. 2do/3er sí lo elige la doctora.
    if (m === "obst1") onChange({ ...values, TRIMESTRE: 1 });
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Ultrasonido</p>
      <div className="flex gap-2 flex-wrap">
        {MODES.map((m) => (
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

      {mode === "gineco" && <UltrasoundGinecoFields values={values} onChange={onChange} />}
      {mode === "obst1" && <UltrasoundObstetrico1erFields values={values} onChange={onChange} />}
      {mode === "obst23" && <UltrasoundObstetrico23Fields values={values} onChange={onChange} />}
    </div>
  );
}
