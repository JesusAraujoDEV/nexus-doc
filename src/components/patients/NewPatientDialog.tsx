import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPatient, ReferredByType } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";
import { REFERIDO_LABEL } from "@/lib/referred-by";
import { PatientAntecedentesFields, AntecedentesForm, ANTECEDENTES_VACIO, buildMedicalBackground } from "./PatientAntecedentesFields";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function NewPatientDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", cedula: "", phone: "", birthDate: "", address: "",
  });
  const [referredByType, setReferredByType] = useState<ReferredByType | "">("");
  const [referredByDetail, setReferredByDetail] = useState("");
  const [antecedentes, setAntecedentes] = useState<AntecedentesForm>(ANTECEDENTES_VACIO);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      createPatient({
        firstName: form.firstName,
        lastName: form.lastName,
        cedula: form.cedula,
        phone: form.phone,
        birthDate: form.birthDate || undefined,
        address: form.address || undefined,
        referredByType: referredByType || undefined,
        referredByDetail: referredByDetail || undefined,
        medicalBackground: buildMedicalBackground(antecedentes),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente creada" });
      onOpenChange(false);
      navigate(`/admin/patients/${data.id}`);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const necesitaDetalle = referredByType === "otro_doctor" || referredByType === "otro";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="np-fn">Nombre *</Label><Input id="np-fn" value={form.firstName} onChange={set("firstName")} required /></div>
            <div><Label htmlFor="np-ln">Apellido *</Label><Input id="np-ln" value={form.lastName} onChange={set("lastName")} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="np-ced">Cedula *</Label><Input id="np-ced" value={form.cedula} onChange={set("cedula")} required /></div>
            <div><Label htmlFor="np-phone">Telefono *</Label><Input id="np-phone" value={form.phone} onChange={set("phone")} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="np-bd">Fecha de nacimiento</Label><Input id="np-bd" type="date" value={form.birthDate} onChange={set("birthDate")} /></div>
            <div><Label htmlFor="np-addr">Dirección</Label><Input id="np-addr" value={form.address} onChange={set("address")} /></div>
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
              {mutation.isPending ? "Guardando..." : "Crear paciente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
