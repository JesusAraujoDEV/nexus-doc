import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Plus } from "lucide-react";
import { ClinicalRecord, deleteClinicalRecord } from "@/lib/clinical-records-api";
import { useToast } from "@/components/ui/use-toast";
import { ConsultationCard } from "./ConsultationCard";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

/** Lista de consultas de la paciente + acceso a "nueva consulta". Dueña de su propio borrado. */
export function PatientConsultationsTab({ patientId, records }: { patientId: string; records: ClinicalRecord[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deletingRecord, setDeletingRecord] = useState<ClinicalRecord | null>(null);

  const deleteRecordMut = useMutation({
    mutationFn: (recordId: string) => deleteClinicalRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      toast({ title: "Consulta eliminada" });
      setDeletingRecord(null);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Consultas <span className="text-muted-foreground font-normal">({records.length})</span>
          </h3>
        </div>
        <button
          onClick={() => navigate(`/admin/patients/${patientId}/consultations/new`)}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <Plus size={14} />Nueva consulta
        </button>
      </div>

      {records.length === 0 ? (
        <div className="medical-card p-4 text-sm text-muted-foreground text-center">
          Esta paciente no tiene consultas registradas.
        </div>
      ) : (
        <div className="space-y-2.5">
          {records.map((r, i) => (
            <ConsultationCard
              key={r.id}
              record={r}
              idx={i}
              patientId={patientId}
              onEdit={(rec) => navigate(`/admin/patients/${patientId}/consultations/${rec.id}/edit`)}
              onDelete={(rec) => setDeletingRecord(rec)}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deletingRecord}
        onOpenChange={(v) => !v && setDeletingRecord(null)}
        title="Eliminar consulta"
        description="La consulta se marcara como eliminada. No se borrara permanentemente."
        onConfirm={() => deletingRecord && deleteRecordMut.mutate(deletingRecord.id)}
        loading={deleteRecordMut.isPending}
      />
    </div>
  );
}
