import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Paperclip, ChevronRight } from "lucide-react";
import { ClinicalRecord, consultationDate } from "@/lib/clinical-records-api";
import { Attachment } from "@/lib/files-api";
import { formatApiDate } from "@/lib/calendar-date";
import { usePatientAttachments } from "@/hooks/use-patient-attachments";
import { AttachmentGrid } from "@/components/attachments/AttachmentGrid";
import { AttachmentViewerDialog } from "@/components/attachments/AttachmentViewerDialog";

interface Props {
  patientId: string;
  /** Consultas de la paciente, para rotular cada grupo con su tipo y fecha. */
  records: ClinicalRecord[];
}

interface Group {
  recordId: string;
  record: ClinicalRecord | undefined;
  attachments: Attachment[];
}

/** Agrupa por consulta, en el mismo orden (más reciente primero) que `records`. */
function groupByRecord(attachments: Attachment[], records: ClinicalRecord[]): Group[] {
  const byRecord = new Map<string, Attachment[]>();
  for (const a of attachments) byRecord.set(a.clinicalRecordId, [...(byRecord.get(a.clinicalRecordId) ?? []), a]);
  const order = new Map(records.map((r, i) => [r.id, i]));
  return [...byRecord.entries()]
    .map(([recordId, list]) => ({ recordId, record: records.find((r) => r.id === recordId), attachments: list }))
    .sort((a, b) => (order.get(a.recordId) ?? Infinity) - (order.get(b.recordId) ?? Infinity));
}

function groupTitle(record: ClinicalRecord | undefined) {
  if (!record) return "Consulta no disponible";
  return `${record.visitType || "Consulta"} · ${formatApiDate(consultationDate(record))}`;
}

/** Pestaña "Archivos" del perfil: todos los adjuntos de la paciente, por consulta. */
export function PatientAttachmentsTab({ patientId, records }: Props) {
  const { data: attachments = [], isLoading, isError } = usePatientAttachments(patientId);
  const [openId, setOpenId] = useState<string | null>(null);
  const groups = useMemo(() => groupByRecord(attachments, records), [attachments, records]);
  const opened = attachments.find((a) => a.id === openId) ?? null;

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  if (isError) return <p className="medical-card p-4 text-sm text-destructive text-center">No se pudieron cargar los archivos.</p>;
  if (!attachments.length) {
    return <p className="medical-card p-4 text-sm text-muted-foreground text-center">Esta paciente no tiene archivos adjuntos.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Paperclip size={16} className="text-primary" aria-hidden />
        <h3 className="text-sm font-bold text-foreground">
          Archivos <span className="text-muted-foreground font-normal">({attachments.length})</span>
        </h3>
      </div>
      {groups.map((g) => (
        <section key={g.recordId} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground min-w-0 truncate">{groupTitle(g.record)}</p>
            {g.record && (
              <Link
                to={`/admin/patients/${patientId}/consultations/${g.recordId}/edit?tab=attachments`}
                className="shrink-0 flex items-center min-h-11 px-2 text-sm text-primary"
              >
                Ver consulta<ChevronRight size={16} aria-hidden />
              </Link>
            )}
          </div>
          <AttachmentGrid attachments={g.attachments} onOpen={(a) => setOpenId(a.id)} />
        </section>
      ))}
      <AttachmentViewerDialog attachment={opened} onClose={() => setOpenId(null)} />
    </div>
  );
}
