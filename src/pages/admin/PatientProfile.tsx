import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import { fetchPatient, deletePatient } from "@/lib/patients-api";
import { consultationDate } from "@/lib/clinical-records-api";
import { cn } from "@/lib/utils";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { PatientInfoTab } from "@/components/patients/PatientInfoTab";
import { MedicalBackground } from "@/components/patients/MedicalBackground";
import { PregnancySection } from "@/components/patients/PregnancySection";
import { PregnancyBanner } from "@/components/patients/PregnancyBanner";
import { PatientConsultationsTab } from "@/components/patients/PatientConsultationsTab";
import { PatientLabExamsTab } from "@/components/patients/PatientLabExamsTab";
import { ConfirmDeleteDialog } from "@/components/patients/ConfirmDeleteDialog";
import { useToast } from "@/components/ui/use-toast";

type ProfileTab = "info" | "background" | "pregnancies" | "consultations" | "labExams";
const TABS: { key: ProfileTab; label: string }[] = [
  { key: "info", label: "Info" },
  { key: "background", label: "Antecedentes" },
  { key: "pregnancies", label: "Embarazos" },
  { key: "consultations", label: "Consultas" },
  { key: "labExams", label: "Lab. exámenes" },
];

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<ProfileTab>("info");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => fetchPatient(id as string),
    enabled: !!id,
  });

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
            <PregnancyBanner patientId={data.id} />

            <div className="flex gap-2 overflow-x-auto -mx-4 px-4">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "info" && <PatientInfoTab p={data} />}
            {tab === "background" && <MedicalBackground p={data} />}
            {tab === "pregnancies" && <PregnancySection patientId={data.id} />}
            {tab === "consultations" && <PatientConsultationsTab patientId={data.id} records={records} />}
            {tab === "labExams" && <PatientLabExamsTab patientId={data.id} active={tab === "labExams"} />}

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
