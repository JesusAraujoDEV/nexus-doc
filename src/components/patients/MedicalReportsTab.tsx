import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchMedicalReportsByRecord, deleteMedicalReport, openMedicalReportPdf, MedicalReport } from "@/lib/medical-reports-api";
import { InformeMedicoForm } from "./InformeMedicoForm";
import { ConstanciaForm } from "./ConstanciaForm";

type SubTab = "informe" | "constancia";
const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: "informe", label: "Informe Médico" },
  { key: "constancia", label: "Constancia" },
];

interface Props {
  patientId: string;
  /** Solo existe en edición o tras el primer guardado - los informes se atan a un clinical_record ya creado. */
  recordId?: string;
}

function ReportRow({ report, onDeleted }: { report: MedicalReport; onDeleted: () => void }) {
  const del = useMutation({ mutationFn: () => deleteMedicalReport(report.id), onSuccess: onDeleted });
  return (
    <div className="flex items-center justify-between px-2 py-1.5 text-sm border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="truncate font-medium">{report.title || (report.type === "informe" ? "Informe médico" : "Constancia")}</p>
        <p className="text-xs text-muted-foreground">
          {report.type === "informe" ? "Informe" : "Constancia"} · {new Date(report.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={() => openMedicalReportPdf(report.id)}>
          <Printer size={14} />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => del.mutate()} disabled={del.isPending}>
          <Trash2 size={14} className="text-destructive" />
        </Button>
      </div>
    </div>
  );
}

/** "Informes/Constancias": lista lo emitido en esta consulta arriba, formulario de emisión abajo. */
export function MedicalReportsTab({ patientId, recordId }: Props) {
  const [subTab, setSubTab] = useState<SubTab>("informe");
  const queryClient = useQueryClient();

  const { data: reports = [] } = useQuery({
    queryKey: ["medical-reports", recordId],
    queryFn: () => fetchMedicalReportsByRecord(recordId as string),
    enabled: !!recordId,
  });

  if (!recordId) {
    return (
      <p className="text-sm text-muted-foreground rounded-lg border border-border p-4">
        Guarda la consulta primero para generar informes o constancias.
      </p>
    );
  }

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["medical-reports", recordId] });

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Informes/Constancias</p>

      {reports.length > 0 && (
        <div className="border border-border rounded-md divide-y">
          {reports.map((r) => <ReportRow key={r.id} report={r} onDeleted={invalidate} />)}
        </div>
      )}

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
      {subTab === "informe" ? (
        <InformeMedicoForm patientId={patientId} recordId={recordId} onSaved={invalidate} />
      ) : (
        <ConstanciaForm patientId={patientId} recordId={recordId} onSaved={invalidate} />
      )}
    </div>
  );
}
