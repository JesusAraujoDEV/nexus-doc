import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchClinicalRecord, updateClinicalRecord } from "@/lib/clinical-records-api";
import { useToast } from "@/components/ui/use-toast";
import { ConsultationForm, ConsultationFormValues } from "@/components/patients/ConsultationForm";

export default function EditConsultationPage() {
  const { id: patientId, recordId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const goBack = () => navigate(`/admin/patients/${patientId}`);

  const { data: record, isLoading, isError } = useQuery({
    queryKey: ["clinical-record", recordId],
    queryFn: () => fetchClinicalRecord(recordId as string),
    enabled: !!recordId,
  });

  const mutation = useMutation({
    mutationFn: (form: ConsultationFormValues) =>
      updateClinicalRecord(recordId as string, {
        visitType: form.visitType || null,
        visitDate: form.visitDate || null,
        symptoms: form.symptoms || null,
        diagnosis: form.diagnosis || null,
        treatment: form.treatment || null,
        labOrders: form.labOrders || null,
        privateNotes: form.privateNotes || null,
        nextAppointmentDate: form.nextAppointmentDate || null,
        recipeItems: form.recipeItems.filter((i) => i.nombre?.trim()),
        ultrasoundFindings: form.ultrasound,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      toast({ title: "Consulta actualizada" });
      goBack();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) {
    return <div className="py-16 flex justify-center text-muted-foreground"><Loader2 size={22} className="animate-spin" /></div>;
  }
  if (isError || !record) {
    return <div className="py-12 text-center text-sm text-destructive">No se pudo cargar la consulta.</div>;
  }

  const initialValues: ConsultationFormValues = {
    visitType: record.visitType || "",
    visitDate: record.visitDate || "",
    symptoms: record.symptoms || "",
    diagnosis: record.diagnosis || "",
    treatment: record.treatment || "",
    labOrders: record.labOrders || "",
    privateNotes: record.privateNotes || "",
    nextAppointmentDate: record.nextAppointmentDate || "",
    recipeItems: record.recipeItems || [],
    ultrasound: record.ultrasoundFindings || {},
  };

  return (
    <ConsultationForm
      title="Editar consulta"
      initialValues={initialValues}
      onBack={goBack}
      onSubmit={(form) => mutation.mutate(form)}
      submitting={mutation.isPending}
      submitLabel="Guardar cambios"
      recordId={record.id}
    />
  );
}
