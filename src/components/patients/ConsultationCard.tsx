import { useState } from "react";
import { ChevronDown, ChevronUp, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicalRecord, consultationDate } from "@/lib/patients-api";

function formatDate(iso: string) {
  // visitDate llega como "YYYY-MM-DD" (DATEONLY). Parsearlo con new Date() lo
  // trata como UTC y en Venezuela (UTC-4) restaría un día, así que se formatea
  // a mano cuando no trae hora.
  const soloFecha = /^\d{4}-\d{2}-\d{2}$/.exec(iso);
  const d = soloFecha
    ? new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))
    : new Date(iso);
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export function ConsultationCard({ record, idx }: { record: ClinicalRecord; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  const hasDetail = record.diagnosis || record.treatment || record.labOrders || record.privateNotes;

  return (
    <div className="medical-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
            <Stethoscope size={16} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {record.visitType || "Consulta"}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(consultationDate(record))}</p>
          </div>
        </div>
        {hasDetail && (open ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />)}
      </button>

      {open && hasDetail && (
        <div className={cn("px-4 pb-4 space-y-3 border-t border-border pt-3")}>
          <Field label="Motivo" value={record.symptoms} />
          <Field label="Diagnóstico" value={record.diagnosis} />
          <Field label="Tratamiento" value={record.treatment} />
          <Field label="Exámenes indicados" value={record.labOrders} />
          <Field label="Observaciones" value={record.privateNotes} />
        </div>
      )}
    </div>
  );
}
