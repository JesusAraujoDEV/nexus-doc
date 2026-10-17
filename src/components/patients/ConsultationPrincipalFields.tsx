import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VisitTypeCombobox } from "@/components/patients/VisitTypeCombobox";
import { DiagnosticImpressionsEditor } from "@/components/patients/DiagnosticImpressionsEditor";
import { MedicalCertificateFields } from "@/components/patients/MedicalCertificateFields";
import { ConsultationFormValues } from "./ConsultationForm";

interface Props {
  form: ConsultationFormValues;
  onChange: (form: ConsultationFormValues) => void;
}

type TextField = "visitDate" | "symptoms" | "diagnosis" | "treatment" | "labOrders" | "privateNotes" | "nextAppointmentDate" | "evolution" | "recommendations";

export function ConsultationPrincipalFields({ form, onChange }: Props) {
  const set = (field: TextField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>Tipo de consulta</Label><VisitTypeCombobox value={form.visitType} onChange={(v) => onChange({ ...form, visitType: v })} /></div>
        <div><Label htmlFor="cf-date">Fecha</Label><Input id="cf-date" type="date" value={form.visitDate} onChange={set("visitDate")} /></div>
      </div>
      <div><Label htmlFor="cf-symp">Motivo</Label><Textarea id="cf-symp" value={form.symptoms} onChange={set("symptoms")} rows={2} /></div>
      <div>
        <Label htmlFor="cf-diag">Diagnóstico</Label>
        <Textarea id="cf-diag" value={form.diagnosis} onChange={set("diagnosis")} rows={2} />
      </div>
      <DiagnosticImpressionsEditor
        items={form.diagnosticImpressions}
        onChange={(diagnosticImpressions) => onChange({ ...form, diagnosticImpressions })}
      />
      <div><Label htmlFor="cf-evol">Evolución</Label><Textarea id="cf-evol" value={form.evolution} onChange={set("evolution")} rows={2} maxLength={5000} /></div>
      <div><Label htmlFor="cf-treat">Tratamiento</Label><Textarea id="cf-treat" value={form.treatment} onChange={set("treatment")} rows={3} /></div>
      <div><Label htmlFor="cf-rec">Recomendaciones</Label><Textarea id="cf-rec" value={form.recommendations} onChange={set("recommendations")} rows={2} maxLength={5000} /></div>
      <div><Label htmlFor="cf-lab">Examenes indicados</Label><Textarea id="cf-lab" value={form.labOrders} onChange={set("labOrders")} rows={2} /></div>
      <div><Label htmlFor="cf-notes">Observaciones</Label><Textarea id="cf-notes" value={form.privateNotes} onChange={set("privateNotes")} rows={2} /></div>
      <div><Label htmlFor="cf-next">Próxima consulta</Label><Input id="cf-next" type="date" value={form.nextAppointmentDate} onChange={set("nextAppointmentDate")} /></div>
      <MedicalCertificateFields
        value={form.medicalCertificate}
        onChange={(medicalCertificate) => onChange({ ...form, medicalCertificate })}
      />
    </>
  );
}
