import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ClipboardList, Loader2, Plus } from "lucide-react";
import { fetchPatient, consultationDate, deletePatient, deleteClinicalRecord, ClinicalRecord } from "@/lib/patients-api";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { MedicalBackground } from "@/components/patients/MedicalBackground";
import { PregnancyBanner } from "@/components/patients/PregnancyBanner";
import { ConsultationCard } from "@/components/patients/ConsultationCard";
import { EditConsultationDialog } from "@/components/patients/EditConsultationDialog";
import { ConfirmDeleteDialog } from "@/components/patients/ConfirmDeleteDialog";
import { useToast } from "@/components/ui/use-toast";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => fetchPatient(id as string),
    enabled: !!id,
  });

  const [editingRecord, setEditingRecord] = useState<ClinicalRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<ClinicalRecord | null>(null);
  const [showDeletePatient, setShowDeletePatient] = useState(false);

  const deletePatientMut = useMutation({
    mutationFn: () => deletePatient(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente eliminado" });
      navigate("/admin/patients");
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteRecordMut = useMutation({
    mutationFn: (recordId: string) => deleteClinicalRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
      toast({ title: "Consulta eliminada" });
      setDeletingRecord(null);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const records = [...(data?.clinicalRecords || [])].sort((a, b) =>
    consultationDate(b).localeCompare(consultationDate(a)),
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <button
          onClick={() => navigate("/admin/patients")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />Pacientes
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-3xl w-full mx-auto">
        {isLoading && (
          <div className="py-16 flex justify-center text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
          </div>
        )}
        {isError && <div className="py-12 text-center text-sm text-destructive">No se pudo cargar la paciente.</div>}

        {data && (
          <>
            <PatientHeader p={data} onDelete={() => setShowDeletePatient(true)} />
            <PregnancyBanner records={data.clinicalRecords} />
            <MedicalBackground p={data} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Consultas <span className="text-muted-foreground font-normal">({records.length})</span>
                  </h3>
                </div>
                <button
                  onClick={() => navigate(`/admin/patients/${data.id}/consultations/new`)}
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
                      patientId={data.id}
                      onEdit={(rec) => setEditingRecord(rec)}
                      onDelete={(rec) => setDeletingRecord(rec)}
                    />
                  ))}
                </div>
              )}
            </div>

            {editingRecord && (
              <EditConsultationDialog
                record={editingRecord}
                patientId={data.id}
                open={!!editingRecord}
                onOpenChange={(v) => !v && setEditingRecord(null)}
              />
            )}

            <ConfirmDeleteDialog
              open={!!deletingRecord}
              onOpenChange={(v) => !v && setDeletingRecord(null)}
              title="Eliminar consulta"
              description="La consulta se marcara como eliminada. No se borrara permanentemente."
              onConfirm={() => deletingRecord && deleteRecordMut.mutate(deletingRecord.id)}
              loading={deleteRecordMut.isPending}
            />

            <ConfirmDeleteDialog
              open={showDeletePatient}
              onOpenChange={setShowDeletePatient}
              title="Eliminar paciente"
              description="El paciente y sus consultas se marcaran como eliminados. No se borraran permanentemente."
              onConfirm={() => deletePatientMut.mutate()}
              loading={deletePatientMut.isPending}
            />
          </>
        )}
      </div>
    </div>
  );
}
