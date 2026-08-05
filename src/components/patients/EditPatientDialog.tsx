import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PatientDetail, updatePatient } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";

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
    gender: patient.gender || "",
    address: patient.address || "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () => {
      const changes: Record<string, string | null> = {};
      if (form.firstName !== patient.firstName) changes.firstName = form.firstName;
      if (form.lastName !== patient.lastName) changes.lastName = form.lastName;
      if (form.cedula !== (patient.cedula || "")) changes.cedula = form.cedula || null;
      if (form.phone !== (patient.phone || "")) changes.phone = form.phone || null;
      if (form.birthDate !== (patient.birthDate || "")) changes.birthDate = form.birthDate || null;
      if (form.gender !== (patient.gender || "")) changes.gender = form.gender || null;
      if (form.address !== (patient.address || "")) changes.address = form.address || null;
      if (!Object.keys(changes).length) return Promise.resolve(patient);
      return updatePatient(patient.id, changes);
    },
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ep-fn">Nombre</Label>
              <Input id="ep-fn" value={form.firstName} onChange={set("firstName")} required />
            </div>
            <div>
              <Label htmlFor="ep-ln">Apellido</Label>
              <Input id="ep-ln" value={form.lastName} onChange={set("lastName")} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ep-ced">Cedula</Label>
              <Input id="ep-ced" value={form.cedula} onChange={set("cedula")} />
            </div>
            <div>
              <Label htmlFor="ep-phone">Telefono</Label>
              <Input id="ep-phone" value={form.phone} onChange={set("phone")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ep-bd">Fecha nac.</Label>
              <Input id="ep-bd" type="date" value={form.birthDate} onChange={set("birthDate")} />
            </div>
            <div>
              <Label htmlFor="ep-gen">Sexo</Label>
              <select id="ep-gen" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">--</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="ep-addr">Direccion</Label>
            <Textarea id="ep-addr" value={form.address} onChange={set("address")} rows={2} />
          </div>
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
