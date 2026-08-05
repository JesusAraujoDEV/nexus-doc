import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PatientListItem, updatePatient } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  patient: PatientListItem;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditPatientQuickDialog({ patient, open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    cedula: patient.cedula || "",
    phone: patient.phone || "",
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
      if (!Object.keys(changes).length) return Promise.resolve(null);
      return updatePatient(patient.id, changes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente actualizado" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="epq-fn">Nombre</Label>
              <Input id="epq-fn" value={form.firstName} onChange={set("firstName")} required />
            </div>
            <div>
              <Label htmlFor="epq-ln">Apellido</Label>
              <Input id="epq-ln" value={form.lastName} onChange={set("lastName")} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="epq-ced">Cedula</Label>
              <Input id="epq-ced" value={form.cedula} onChange={set("cedula")} />
            </div>
            <div>
              <Label htmlFor="epq-phone">Telefono</Label>
              <Input id="epq-phone" value={form.phone} onChange={set("phone")} />
            </div>
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
