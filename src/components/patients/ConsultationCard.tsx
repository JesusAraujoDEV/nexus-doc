import { useState } from "react";
import { ChevronDown, ChevronUp, Stethoscope, Pencil, Trash2, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicalRecord, consultationDate, openClinicalRecordPdf } from "@/lib/patients-api";

function formatDate(iso: string) {
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

interface Props {
  record: ClinicalRecord;
  idx: number;
  patientId: string;
  onEdit?: (record: ClinicalRecord) => void;
  onDelete?: (record: ClinicalRecord) => void;
}

export function ConsultationCard({ record, idx, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(idx === 0);
  const hasDetail = record.diagnosis || record.treatment || record.labOrders || record.privateNotes;
  const hasRecipe = !!record.recipeItems?.length;
  const hasUltrasound = !!record.ultrasoundFindings && Object.keys(record.ultrasoundFindings).length > 0;

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
        {(hasDetail || hasRecipe || hasUltrasound) && (open ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />)}
      </button>

      {open && (hasDetail || hasRecipe || hasUltrasound) && (
        <div className={cn("px-4 pb-4 space-y-3 border-t border-border pt-3")}>
          <Field label="Motivo" value={record.symptoms} />
          <Field label="Diagnóstico" value={record.diagnosis} />
          <Field label="Tratamiento" value={record.treatment} />
          <Field label="Exámenes indicados" value={record.labOrders} />
          <Field label="Observaciones" value={record.privateNotes} />
          {(onEdit || onDelete || hasRecipe || hasUltrasound) && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
              {hasRecipe && (
                <button onClick={() => openClinicalRecordPdf(record.id, "prescription")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                  <Printer size={12} />Imprimir récipe
                </button>
              )}
              {hasUltrasound && (
                <button onClick={() => openClinicalRecordPdf(record.id, "ultrasound")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                  <Printer size={12} />Imprimir ecografía
                </button>
              )}
              {onEdit && (
                <button onClick={() => onEdit(record)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil size={12} />Editar
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(record)} className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors">
                  <Trash2 size={12} />Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
