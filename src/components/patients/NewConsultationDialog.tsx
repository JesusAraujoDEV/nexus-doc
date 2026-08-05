import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClinicalRecord } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  patientId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function NewConsultationDialog({ patientId, open, onOpenChange }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    visitType: "",
    visitDate: today,
    symptoms: "",
    diagnosis: "",
    treatment: "",
    labOrders: "",
    privateNotes: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      createClinicalRecord({
        patientId,
        visitType: form.visitType || undefined,
        visitDate: form.visitDate || undefined,
        symptoms: form.symptoms || undefined,
        diagnosis: form.diagnosis || undefined,
        treatment: form.treatment || undefined,
        labOrders: form.labOrders || undefined,
        privateNotes: form.privateNotes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      toast({ title: "Consulta creada" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva consulta</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nc-type">Tipo de consulta</Label>
              <Input id="nc-type" value={form.visitType} onChange={set("visitType")} placeholder="CONTROL, PRENATAL..." />
            </div>
            <div>
              <Label htmlFor="nc-date">Fecha</Label>
              <Input id="nc-date" type="date" value={form.visitDate} onChange={set("visitDate")} />
            </div>
          </div>
          <div>
            <Label htmlFor="nc-symp">Motivo</Label>
            <Textarea id="nc-symp" value={form.symptoms} onChange={set("symptoms")} rows={2} />
          </div>
          <div>
            <Label htmlFor="nc-diag">Diagnostico</Label>
            <Textarea id="nc-diag" value={form.diagnosis} onChange={set("diagnosis")} rows={2} />
          </div>
          <div>
            <Label htmlFor="nc-treat">Tratamiento</Label>
            <Textarea id="nc-treat" value={form.treatment} onChange={set("treatment")} rows={3} />
          </div>
          <div>
            <Label htmlFor="nc-lab">Examenes indicados</Label>
            <Textarea id="nc-lab" value={form.labOrders} onChange={set("labOrders")} rows={2} />
          </div>
          <div>
            <Label htmlFor="nc-notes">Observaciones</Label>
            <Textarea id="nc-notes" value={form.privateNotes} onChange={set("privateNotes")} rows={2} />
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
