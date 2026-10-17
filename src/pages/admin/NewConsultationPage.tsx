import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClinicalRecord } from "@/lib/clinical-records-api";
import { todayKey } from "@/lib/calendar-date";
import { EMPTY_CERTIFICATE, certificateFromForm, cleanImpressions } from "@/lib/consultation-extras";
import { useToast } from "@/components/ui/use-toast";
import { ConsultationForm, ConsultationFormValues } from "@/components/patients/ConsultationForm";

function buildEmpty(pregnancyId: string | null): ConsultationFormValues {
  return {
    category: pregnancyId ? "obstetrics" : "gynecology",
    pregnancyId: pregnancyId || "",
    visitType: "",
    // Fecha local: toISOString() daría el día UTC (de noche en Venezuela, mañana).
    visitDate: todayKey(),
    symptoms: "",
    diagnosis: "",
    treatment: "",
    labOrders: "",
    privateNotes: "",
    nextAppointmentDate: "",
    recipeItems: [],
    ultrasound: {},
    indicatesPrescription: false,
    indicatesImagingStudy: false,
    diagnosticImpressions: [],
    evolution: "",
    recommendations: "",
    medicalCertificate: { ...EMPTY_CERTIFICATE },
  };
}

function toCreatePayload(patientId: string, form: ConsultationFormValues) {
  const recipeItems = form.recipeItems.filter((i) => i.nombre?.trim());
  return {
    patientId,
    category: form.category,
    pregnancyId: form.category === "obstetrics" && form.pregnancyId ? form.pregnancyId : undefined,
    visitType: form.visitType || undefined,
    visitDate: form.visitDate || undefined,
    symptoms: form.symptoms || undefined,
    diagnosis: form.diagnosis || undefined,
    treatment: form.treatment || undefined,
    labOrders: form.labOrders || undefined,
    privateNotes: form.privateNotes || undefined,
    nextAppointmentDate: form.nextAppointmentDate || undefined,
    recipeItems: recipeItems.length ? recipeItems : undefined,
    ultrasoundFindings: Object.keys(form.ultrasound).length ? form.ultrasound : undefined,
    indicatesPrescription: form.indicatesPrescription,
    indicatesImagingStudy: form.indicatesImagingStudy,
    diagnosticImpressions: cleanImpressions(form.diagnosticImpressions) ?? undefined,
    medicalCertificate: certificateFromForm(form.medicalCertificate) ?? undefined,
    evolution: form.evolution.trim() || undefined,
    recommendations: form.recommendations.trim() || undefined,
  };
}

export default function NewConsultationPage() {
  const { id: patientId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const goBack = () => navigate(`/admin/patients/${patientId}`);

  const mutation = useMutation({
    mutationFn: ({ form }: { form: ConsultationFormValues; attach: boolean }) =>
      createClinicalRecord(toCreatePayload(patientId as string, form)),
    onSuccess: (record, { attach }) => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      queryClient.invalidateQueries({ queryKey: ["pregnancies", patientId] });
      toast({ title: "Consulta creada" });
      // "Guardar y adjuntar": reabre la consulta recién creada en la pestaña Adjuntos.
      if (attach) return navigate(`/admin/patients/${patientId}/consultations/${record.id}/edit?tab=attachments`, { replace: true });
      goBack();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <ConsultationForm
      title="Nueva consulta"
      patientId={patientId as string}
      initialValues={buildEmpty(searchParams.get("pregnancyId"))}
      onBack={goBack}
      onSubmit={(form) => mutation.mutate({ form, attach: false })}
      onSubmitAndAttach={(form) => mutation.mutate({ form, attach: true })}
      submitting={mutation.isPending}
      submitLabel="Guardar consulta"
    />
  );
}
