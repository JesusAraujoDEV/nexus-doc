import { useState } from "react";
import { cn } from "@/lib/utils";
import { LabExamOrderTab } from "./LabExamOrderTab";
import { LabExamResultsTab } from "./LabExamResultsTab";

type SubTab = "solicitud" | "resultados";
const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: "solicitud", label: "Solicitud de Exámenes" },
  { key: "resultados", label: "Registro de resultados" },
];

interface Props {
  patientId: string;
  /** Solo existe en edición o tras el primer guardado - la orden se ata a un clinical_record ya creado. */
  recordId?: string;
  indicatesPrescription: boolean;
  indicatesImagingStudy: boolean;
  onChangeFlags: (flags: { indicatesPrescription: boolean; indicatesImagingStudy: boolean }) => void;
}

/** "6. Examen de laboratorio": solicitar exámenes del catálogo y registrar resultados pendientes. */
export function LabExamsTab({ patientId, recordId, indicatesPrescription, indicatesImagingStudy, onChangeFlags }: Props) {
  const [subTab, setSubTab] = useState<SubTab>("solicitud");

  if (!recordId) {
    return (
      <p className="text-sm text-muted-foreground rounded-lg border border-border p-4">
        Guarda la consulta primero para solicitar exámenes de laboratorio.
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Examen de laboratorio</p>
      <div className="flex gap-2 flex-wrap">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSubTab(t.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              subTab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {subTab === "solicitud" ? (
        <LabExamOrderTab
          patientId={patientId}
          recordId={recordId}
          indicatesPrescription={indicatesPrescription}
          indicatesImagingStudy={indicatesImagingStudy}
          onChangeFlags={onChangeFlags}
        />
      ) : (
        <LabExamResultsTab patientId={patientId} recordId={recordId} />
      )}
    </div>
  );
}
