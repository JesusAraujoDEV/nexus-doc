import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GENERAL_ULTRASOUND_SUB_TYPES,
  GENERAL_ULTRASOUND_SUB_TYPE_LABELS,
  GeneralUltrasoundSubType,
  fetchGeneralUltrasoundsByRecord,
  saveGeneralUltrasound,
} from "@/lib/general-ultrasounds-api";
import { GuValues, GuFieldProps } from "./general-ultrasound-field-inputs";
import { GeneralUltrasoundAbdominalFields } from "./GeneralUltrasoundAbdominalFields";
import { GeneralUltrasoundRenalFields } from "./GeneralUltrasoundRenalFields";
import { GeneralUltrasoundTiroideoFields } from "./GeneralUltrasoundTiroideoFields";
import { GeneralUltrasoundPartesBlandasFields } from "./GeneralUltrasoundPartesBlandasFields";
import { GeneralUltrasoundMamarioFields } from "./GeneralUltrasoundMamarioFields";
import { GeneralUltrasoundGenericFields } from "./GeneralUltrasoundGenericFields";

const DETAILED: Partial<Record<GeneralUltrasoundSubType, React.ComponentType<GuFieldProps>>> = {
  abdominal: GeneralUltrasoundAbdominalFields,
  renal: GeneralUltrasoundRenalFields,
  tiroideo: GeneralUltrasoundTiroideoFields,
  partes_blandas: GeneralUltrasoundPartesBlandasFields,
  mamario: GeneralUltrasoundMamarioFields,
};

interface Props {
  /** Solo existe en edición o tras el primer guardado - el módulo depende de un clinical_record ya creado. */
  recordId?: string;
}

/** Los 9 subtipos de ecografía general (catálogo legado TP-ECO.DAT), cada uno se guarda aparte vía upsert. */
export function GeneralUltrasoundTab({ recordId }: Props) {
  const [subType, setSubType] = useState<GeneralUltrasoundSubType>("abdominal");
  const [values, setValues] = useState<GuValues>({});
  const queryClient = useQueryClient();

  const { data: saved = [], isLoading } = useQuery({
    queryKey: ["general-ultrasounds", recordId],
    queryFn: () => fetchGeneralUltrasoundsByRecord(recordId as string),
    enabled: !!recordId,
  });
  const current = saved.find((s) => s.subType === subType);

  useEffect(() => setValues(current?.findings || {}), [current]);

  const save = useMutation({
    mutationFn: () => saveGeneralUltrasound({ clinicalRecordId: recordId as string, subType, findings: values }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["general-ultrasounds", recordId] }),
  });

  if (!recordId) {
    return (
      <p className="text-sm text-muted-foreground rounded-lg border border-border p-4">
        Guarda la consulta primero para registrar el ultrasonido general.
      </p>
    );
  }

  const Fields = DETAILED[subType];

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Ultrasonido general</p>
      <div className="flex gap-2 flex-wrap">
        {GENERAL_ULTRASOUND_SUB_TYPES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSubType(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              subType === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
              saved.some((x) => x.subType === s) && subType !== s && "ring-1 ring-primary/40",
            )}
          >
            {GENERAL_ULTRASOUND_SUB_TYPE_LABELS[s]}
          </button>
        ))}
      </div>
      {isLoading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : Fields ? (
        <Fields values={values} onChange={setValues} />
      ) : (
        <GeneralUltrasoundGenericFields subType={subType} values={values} onChange={setValues} />
      )}
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" disabled>Generar Informe (próximamente)</Button>
        <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Guardando..." : "Guardar hallazgos"}
        </Button>
      </div>
    </div>
  );
}
