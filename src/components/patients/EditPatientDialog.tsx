import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PatientDetail, updatePatient } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";
import { AntecedentesForm, parseMedicalBackground, buildMedicalBackground } from "@/lib/medical-background";
import { PatientAntecedentesFields } from "./PatientAntecedentesFields";
import { PatientReferralFields, ReferralValue } from "./PatientReferralFields";

interface Props {
  patient: PatientDetail;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function initialForm(patient: PatientDetail) {
  return {
    firstName: patient.firstName,
    lastName: patient.lastName,
    cedula: patient.cedula || "",
    phone: patient.phone || "",
    phoneSecondary: patient.phoneSecondary || "",
    email: patient.email || "",
    birthDate: patient.birthDate || "",
    address: patient.address || "",
    weightKg: patient.weightKg != null ? String(patient.weightKg) : "",
    heightCm: patient.heightCm != null ? String(patient.heightCm) : "",
  };
}

export function EditPatientDialog({ patient, open, onOpenChange }: Props) {
  const [form, setForm] = useState(() => initialForm(patient));
  const [referral, setReferral] = useState<ReferralValue>({
    type: patient.referredByType || "",
    detail: patient.referredByDetail || "",
    doctorId: patient.referredByDoctorId || null,
  });
  const [antecedentes, setAntecedentes] = useState<AntecedentesForm>(() => parseMedicalBackground(patient.medicalBackground));

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      updatePatient(patient.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        cedula: form.cedula || null,
        phone: form.phone || null,
        phoneSecondary: form.phoneSecondary || null,
        email: form.email.trim() || null,
        birthDate: form.birthDate || null,
        address: form.address || null,
        referredByType: referral.type || null,
        referredByDetail: referral.detail || null,
        referredByDoctorId: referral.doctorId || null,
        // Merge: conserva claves del JSONB que este form no administra (ocupación, hábitos, legacy…).
        medicalBackground: buildMedicalBackground(antecedentes, patient.medicalBackground),
        weightKg: form.weightKg ? Number(form.weightKg) : null,
        heightCm: form.heightCm ? Number(form.heightCm) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patient.id] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente actualizado" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const set = (field: keyof ReturnType<typeof initialForm>) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label htmlFor="ep-fn">Nombre</Label><Input id="ep-fn" value={form.firstName} onChange={set("firstName")} required /></div>
            <div><Label htmlFor="ep-ln">Apellido</Label><Input id="ep-ln" value={form.lastName} onChange={set("lastName")} required /></div>
            <div><Label htmlFor="ep-ced">Cedula</Label><Input id="ep-ced" value={form.cedula} onChange={set("cedula")} /></div>
            <div><Label htmlFor="ep-phone">Telefono</Label><Input id="ep-phone" type="tel" value={form.phone} onChange={set("phone")} /></div>
            <div><Label htmlFor="ep-phone2">Teléfono fijo / secundario</Label><Input id="ep-phone2" type="tel" maxLength={30} value={form.phoneSecondary} onChange={set("phoneSecondary")} /></div>
            <div><Label htmlFor="ep-email">Email</Label><Input id="ep-email" type="email" inputMode="email" autoComplete="email" maxLength={254} value={form.email} onChange={set("email")} /></div>
            <div><Label htmlFor="ep-bd">Fecha nac.</Label><Input id="ep-bd" type="date" value={form.birthDate} onChange={set("birthDate")} /></div>
            <div><Label htmlFor="ep-addr">Dirección</Label><Input id="ep-addr" value={form.address} onChange={set("address")} /></div>
            <div><Label htmlFor="ep-weight">Peso (kg)</Label><Input id="ep-weight" type="number" inputMode="decimal" step="0.1" min="0" value={form.weightKg} onChange={set("weightKg")} /></div>
            <div><Label htmlFor="ep-height">Altura (cm)</Label><Input id="ep-height" type="number" inputMode="decimal" step="0.1" min="0" value={form.heightCm} onChange={set("heightCm")} /></div>
          </div>

          <PatientReferralFields value={referral} onChange={setReferral} hasStoredDetail={!!patient.referredByDetail} />

          <PatientAntecedentesFields value={antecedentes} onChange={setAntecedentes} />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="h-11 md:h-10" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="h-11 md:h-10" disabled={mutation.isPending}>
              {mutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
