import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Baby, Printer, Pencil, Plus } from "lucide-react";
import { Pregnancy, openPregnancyPdf } from "@/lib/pregnancies-api";
import { EditPregnancyDialog } from "./EditPregnancyDialog";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
}

function statusLabel(p: Pregnancy) {
  if (p.isLoss) return "Pérdida";
  if (p.isEctopic) return "Ectópico";
  if (p.isFinalized) return "Finalizado";
  return "Activo";
}

export function PregnancyCard({ pregnancy }: { pregnancy: Pregnancy }) {
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const records = pregnancy.clinicalRecords || [];

  return (
    <div className="medical-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Baby size={16} className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Gesta N° {pregnancy.pregnancyNumber} — {statusLabel(pregnancy)}</p>
            {!pregnancy.isFinalized && !pregnancy.isLoss && !pregnancy.isEctopic && pregnancy.gestationalAgeWeeks != null && (
              <p className="text-xs text-muted-foreground">
                {pregnancy.gestationalAgeWeeks} semanas{pregnancy.dueDate && ` · F.P.P ${formatDate(pregnancy.dueDate)}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => openPregnancyPdf(pregnancy.id)} className="text-xs text-primary flex items-center gap-1"><Printer size={12} />Imprimir</button>
          <button onClick={() => setEditing(true)} className="text-xs text-muted-foreground flex items-center gap-1"><Pencil size={12} />Editar</button>
        </div>
      </div>

      {pregnancy.lmpExplanation && <p className="text-xs text-muted-foreground italic">{pregnancy.lmpExplanation}</p>}

      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evolución ({records.length})</p>
          <button
            onClick={() => navigate(`/admin/patients/${pregnancy.patientId}/consultations/new?pregnancyId=${pregnancy.id}`)}
            className="text-xs text-primary flex items-center gap-1"
          >
            <Plus size={12} />Nueva consulta
          </button>
        </div>
        {records.length === 0 && <p className="text-xs text-muted-foreground">Sin consultas todavía.</p>}
        {records.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/admin/patients/${pregnancy.patientId}/consultations/${r.id}/edit`)}
            className="w-full text-left text-xs py-1 border-t border-border first:border-t-0 hover:text-primary transition-colors"
          >
            {formatDate(r.visitDate || r.createdAt)} — {r.diagnosis || r.symptoms || "Consulta"}
          </button>
        ))}
      </div>

      <EditPregnancyDialog pregnancy={pregnancy} open={editing} onOpenChange={setEditing} />
    </div>
  );
}
