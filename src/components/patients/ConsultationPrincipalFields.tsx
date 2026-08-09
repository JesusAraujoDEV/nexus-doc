import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { VisitTypeCombobox } from "@/components/patients/VisitTypeCombobox";
import { ConsultationFormValues } from "./ConsultationForm";

interface Props {
  form: ConsultationFormValues;
  onChange: (form: ConsultationFormValues) => void;
  diagnosisMissing: boolean;
  onDiagnosisEdited: () => void;
}

export function ConsultationPrincipalFields({ form, onChange, diagnosisMissing, onDiagnosisEdited }: Props) {
  const set = (field: keyof ConsultationFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Tipo de consulta</Label><VisitTypeCombobox value={form.visitType} onChange={(v) => onChange({ ...form, visitType: v })} /></div>
        <div><Label htmlFor="cf-date">Fecha</Label><Input id="cf-date" type="date" value={form.visitDate} onChange={set("visitDate")} /></div>
      </div>
      <div><Label htmlFor="cf-symp">Motivo</Label><Textarea id="cf-symp" value={form.symptoms} onChange={set("symptoms")} rows={2} /></div>
      <div>
        <Label htmlFor="cf-diag">Diagnóstico *</Label>
        <Textarea
          id="cf-diag"
          value={form.diagnosis}
          onChange={(e) => { set("diagnosis")(e); onDiagnosisEdited(); }}
          rows={2}
          className={cn(diagnosisMissing && "border-destructive focus-visible:ring-destructive")}
        />
        {diagnosisMissing && <p className="text-xs text-destructive mt-1">Falta el diagnóstico - es obligatorio para guardar.</p>}
      </div>
      <div><Label htmlFor="cf-treat">Tratamiento</Label><Textarea id="cf-treat" value={form.treatment} onChange={set("treatment")} rows={3} /></div>
      <div><Label htmlFor="cf-lab">Examenes indicados</Label><Textarea id="cf-lab" value={form.labOrders} onChange={set("labOrders")} rows={2} /></div>
      <div><Label htmlFor="cf-notes">Observaciones</Label><Textarea id="cf-notes" value={form.privateNotes} onChange={set("privateNotes")} rows={2} /></div>
      <div><Label htmlFor="cf-next">Próxima consulta</Label><Input id="cf-next" type="date" value={form.nextAppointmentDate} onChange={set("nextAppointmentDate")} /></div>
    </>
  );
}
