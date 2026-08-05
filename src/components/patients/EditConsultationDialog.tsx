import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClinicalRecord, updateClinicalRecord } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";
import { VisitTypeCombobox } from "./VisitTypeCombobox";

interface Props {
  record: ClinicalRecord;
  patientId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditConsultationDialog({ record, patientId, open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    visitType: record.visitType || "",
    visitDate: record.visitDate || "",
    symptoms: record.symptoms || "",
    diagnosis: record.diagnosis || "",
    treatment: record.treatment || "",
    labOrders: record.labOrders || "",
    privateNotes: record.privateNotes || "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () => {
      const changes: Record<string, string | null> = {};
      if (form.visitType !== (record.visitType || "")) changes.visitType = form.visitType || null;
      if (form.visitDate !== (record.visitDate || "")) changes.visitDate = form.visitDate || null;
      if (form.symptoms !== (record.symptoms || "")) changes.symptoms = form.symptoms || null;
      if (form.diagnosis !== (record.diagnosis || "")) changes.diagnosis = form.diagnosis || null;
      if (form.treatment !== (record.treatment || "")) changes.treatment = form.treatment || null;
      if (form.labOrders !== (record.labOrders || "")) changes.labOrders = form.labOrders || null;
      if (form.privateNotes !== (record.privateNotes || "")) changes.privateNotes = form.privateNotes || null;
      if (!Object.keys(changes).length) return Promise.resolve(record);
      return updateClinicalRecord(record.id, changes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      toast({ title: "Consulta actualizada" });
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
          <DialogTitle>Editar consulta</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo de consulta</Label>
              <VisitTypeCombobox value={form.visitType} onChange={(v) => setForm((f) => ({ ...f, visitType: v }))} />
            </div>
            <div>
              <Label htmlFor="ec-date">Fecha</Label>
              <Input id="ec-date" type="date" value={form.visitDate} onChange={set("visitDate")} />
            </div>
          </div>
          <div>
            <Label htmlFor="ec-symp">Motivo</Label>
            <Textarea id="ec-symp" value={form.symptoms} onChange={set("symptoms")} rows={2} />
          </div>
          <div>
            <Label htmlFor="ec-diag">Diagnostico</Label>
            <Textarea id="ec-diag" value={form.diagnosis} onChange={set("diagnosis")} rows={2} />
          </div>
          <div>
            <Label htmlFor="ec-treat">Tratamiento</Label>
            <Textarea id="ec-treat" value={form.treatment} onChange={set("treatment")} rows={3} />
          </div>
          <div>
            <Label htmlFor="ec-lab">Examenes indicados</Label>
            <Textarea id="ec-lab" value={form.labOrders} onChange={set("labOrders")} rows={2} />
          </div>
          <div>
            <Label htmlFor="ec-notes">Observaciones</Label>
            <Textarea id="ec-notes" value={form.privateNotes} onChange={set("privateNotes")} rows={2} />
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
