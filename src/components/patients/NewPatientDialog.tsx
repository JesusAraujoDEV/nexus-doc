import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

interface CreatePatientResponse {
  id: string;
  firstName: string;
  lastName: string;
}

export function NewPatientDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    cedula: "",
    phone: "",
    birthDate: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<CreatePatientResponse>("/patients", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          cedula: form.cedula,
          phone: form.phone,
          birthDate: form.birthDate || undefined,
        }),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="np-fn">Nombre *</Label>
              <Input id="np-fn" value={form.firstName} onChange={set("firstName")} required />
            </div>
            <div>
              <Label htmlFor="np-ln">Apellido *</Label>
              <Input id="np-ln" value={form.lastName} onChange={set("lastName")} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="np-ced">Cedula *</Label>
              <Input id="np-ced" value={form.cedula} onChange={set("cedula")} required />
            </div>
            <div>
              <Label htmlFor="np-phone">Telefono *</Label>
              <Input id="np-phone" value={form.phone} onChange={set("phone")} required />
            </div>
          </div>
          <div>
            <Label htmlFor="np-bd">Fecha de nacimiento</Label>
            <Input id="np-bd" type="date" value={form.birthDate} onChange={set("birthDate")} />
          </div>
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
