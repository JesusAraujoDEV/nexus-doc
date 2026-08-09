import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatientDetail, ReferredByType, updatePatient } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";
import { REFERIDO_LABEL } from "@/lib/referred-by";
import { PatientAntecedentesFields, AntecedentesForm, parseMedicalBackground, buildMedicalBackground } from "./PatientAntecedentesFields";

interface Props {
  patient: PatientDetail;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditPatientDialog({ patient, open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    cedula: patient.cedula || "",
    phone: patient.phone || "",
    birthDate: patient.birthDate || "",
    address: patient.address || "",
  });
  const [referredByType, setReferredByType] = useState<ReferredByType | "">(patient.referredByType || "");
  const [referredByDetail, setReferredByDetail] = useState(patient.referredByDetail || "");
  const [antecedentes, setAntecedentes] = useState<AntecedentesForm>(parseMedicalBackground(patient.medicalBackground));

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      updatePatient(patient.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        cedula: form.cedula || null,
        phone: form.phone || null,
        birthDate: form.birthDate || null,
        address: form.address || null,
        referredByType: referredByType || null,
        referredByDetail: referredByDetail || null,
        medicalBackground: buildMedicalBackground(antecedentes),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patient.id] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente actualizado" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const necesitaDetalle = referredByType === "otro_doctor" || referredByType === "otro";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="ep-fn">Nombre</Label><Input id="ep-fn" value={form.firstName} onChange={set("firstName")} required /></div>
            <div><Label htmlFor="ep-ln">Apellido</Label><Input id="ep-ln" value={form.lastName} onChange={set("lastName")} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="ep-ced">Cedula</Label><Input id="ep-ced" value={form.cedula} onChange={set("cedula")} /></div>
            <div><Label htmlFor="ep-phone">Telefono</Label><Input id="ep-phone" value={form.phone} onChange={set("phone")} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="ep-bd">Fecha nac.</Label><Input id="ep-bd" type="date" value={form.birthDate} onChange={set("birthDate")} /></div>
            <div><Label htmlFor="ep-addr">Dirección</Label><Input id="ep-addr" value={form.address} onChange={set("address")} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Referido por</Label>
              <Select value={referredByType} onValueChange={(v) => setReferredByType(v as ReferredByType)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(REFERIDO_LABEL) as ReferredByType[]).map((k) => (
                    <SelectItem key={k} value={k}>{REFERIDO_LABEL[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {necesitaDetalle && (
              <div>
                <Label>{referredByType === "otro_doctor" ? "Nombre del doctor" : "Detalle"}</Label>
                <Input value={referredByDetail} onChange={(e) => setReferredByDetail(e.target.value)} />
              </div>
            )}
          </div>

          <PatientAntecedentesFields value={antecedentes} onChange={setAntecedentes} />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
