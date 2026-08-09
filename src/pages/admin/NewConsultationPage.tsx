import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClinicalRecord } from "@/lib/clinical-records-api";
import { useToast } from "@/components/ui/use-toast";
import { ConsultationForm, ConsultationFormValues } from "@/components/patients/ConsultationForm";

const EMPTY: ConsultationFormValues = {
  visitType: "",
  visitDate: new Date().toISOString().slice(0, 10),
  symptoms: "",
  diagnosis: "",
  treatment: "",
  labOrders: "",
  privateNotes: "",
  nextAppointmentDate: "",
  recipeItems: [],
  ultrasound: {},
};

export default function NewConsultationPage() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const goBack = () => navigate(`/admin/patients/${patientId}`);

  const mutation = useMutation({
    mutationFn: (form: ConsultationFormValues) =>
      createClinicalRecord({
        patientId: patientId as string,
        visitType: form.visitType || undefined,
        visitDate: form.visitDate || undefined,
        symptoms: form.symptoms || undefined,
        diagnosis: form.diagnosis || undefined,
        treatment: form.treatment || undefined,
        labOrders: form.labOrders || undefined,
        privateNotes: form.privateNotes || undefined,
        nextAppointmentDate: form.nextAppointmentDate || undefined,
        recipeItems: form.recipeItems.filter((i) => i.nombre?.trim()).length ? form.recipeItems.filter((i) => i.nombre?.trim()) : undefined,
        ultrasoundFindings: Object.keys(form.ultrasound).length ? form.ultrasound : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      toast({ title: "Consulta creada" });
      goBack();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <ConsultationForm
      title="Nueva consulta"
      initialValues={EMPTY}
      onBack={goBack}
      onSubmit={(form) => mutation.mutate(form)}
      submitting={mutation.isPending}
      submitLabel="Guardar consulta"
    />
  );
}
