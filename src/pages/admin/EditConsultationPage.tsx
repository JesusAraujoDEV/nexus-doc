import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ClinicalRecord, fetchClinicalRecord, updateClinicalRecord } from "@/lib/clinical-records-api";
import { certificateFromForm, certificateToForm, cleanImpressions } from "@/lib/consultation-extras";
import { useToast } from "@/components/ui/use-toast";
import { ConsultationForm, ConsultationFormValues } from "@/components/patients/ConsultationForm";
import { isConsultationTab } from "@/components/patients/ConsultationFormHeader";

function toFormValues(record: ClinicalRecord): ConsultationFormValues {
  return {
    category: record.category || "gynecology",
    pregnancyId: record.pregnancyId || "",
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
    indicatesPrescription: record.indicatesPrescription || false,
    indicatesImagingStudy: record.indicatesImagingStudy || false,
    diagnosticImpressions: record.diagnosticImpressions || [],
    evolution: record.evolution || "",
    recommendations: record.recommendations || "",
    medicalCertificate: certificateToForm(record.medicalCertificate),
  };
}

export default function EditConsultationPage() {
  const { id: patientId, recordId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const goBack = () => navigate(`/admin/patients/${patientId}`);
  const tabParam = searchParams.get("tab");

  // El form toma los valores una sola vez: se espera al fetch fresco de este
  // montaje (no a una copia vieja de la caché) y no se refresca en foco.
  const { data: record, isError, isFetchedAfterMount } = useQuery({
    queryKey: ["clinical-record", recordId],
    queryFn: () => fetchClinicalRecord(recordId as string),
    enabled: !!recordId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (form: ConsultationFormValues) =>
      updateClinicalRecord(recordId as string, {
        category: form.category,
        pregnancyId: form.category === "obstetrics" ? (form.pregnancyId || null) : null,
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
        indicatesPrescription: form.indicatesPrescription,
        indicatesImagingStudy: form.indicatesImagingStudy,
        diagnosticImpressions: cleanImpressions(form.diagnosticImpressions),
        medicalCertificate: certificateFromForm(form.medicalCertificate),
        evolution: form.evolution.trim() || null,
        recommendations: form.recommendations.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinical-record", recordId] });
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      queryClient.invalidateQueries({ queryKey: ["pregnancies", patientId] });
      toast({ title: "Consulta actualizada" });
      goBack();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isError) {
    return <div className="py-12 text-center text-sm text-destructive">No se pudo cargar la consulta.</div>;
  }
  if (!record || !isFetchedAfterMount) {
    return <div className="py-16 flex justify-center text-muted-foreground"><Loader2 size={22} className="animate-spin" /></div>;
  }

  return (
    <ConsultationForm
      key={record.id}
      title="Editar consulta"
      patientId={patientId as string}
      initialValues={toFormValues(record)}
      initialTab={isConsultationTab(tabParam) ? tabParam : undefined}
      onBack={goBack}
      onSubmit={(form) => mutation.mutate(form)}
      submitting={mutation.isPending}
      submitLabel="Guardar cambios"
      recordId={record.id}
    />
  );
}
