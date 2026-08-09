import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Pregnancy, NewbornData, updatePregnancy } from "@/lib/pregnancies-api";

interface Props {
  pregnancy: Pregnancy;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const EMPTY_NEWBORN: NewbornData = {};

export function EditPregnancyDialog({ pregnancy, open, onOpenChange }: Props) {
  const [isFinalized, setIsFinalized] = useState(pregnancy.isFinalized);
  const [isLoss, setIsLoss] = useState(pregnancy.isLoss);
  const [isEctopic, setIsEctopic] = useState(pregnancy.isEctopic);
  const [newborn, setNewborn] = useState<NewbornData>(pregnancy.newbornData || EMPTY_NEWBORN);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const set = (field: keyof NewbornData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setNewborn((n) => ({ ...n, [field]: e.target.value }));

  const mutation = useMutation({
    mutationFn: () =>
      updatePregnancy(pregnancy.id, {
        isFinalized, isLoss, isEctopic,
        newbornData: isFinalized ? newborn : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pregnancies", pregnancy.patientId] });
      toast({ title: "Ficha de embarazo actualizada" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Ficha de embarazo — Gesta N° {pregnancy.pregnancyNumber}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={isFinalized} onCheckedChange={(v) => setIsFinalized(!!v)} />Finalizado</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={isLoss} onCheckedChange={(v) => setIsLoss(!!v)} />Pérdida</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={isEctopic} onCheckedChange={(v) => setIsEctopic(!!v)} />Ectópico</label>

          {isFinalized && (
            <div className="space-y-3 rounded-lg border border-border p-3">
              <p className="text-sm font-semibold">Recién Nacido</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Fecha de nacimiento</Label><Input type="date" value={newborn.birthDate || ""} onChange={set("birthDate")} /></div>
                <div><Label>Tipo de parto</Label><Input value={newborn.deliveryType || ""} onChange={set("deliveryType")} /></div>
              </div>
              <div><Label>Nombre</Label><Input value={newborn.name || ""} onChange={set("name")} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Peso (gr)</Label><Input type="number" value={newborn.weight ?? ""} onChange={(e) => setNewborn((n) => ({ ...n, weight: e.target.value ? Number(e.target.value) : null }))} /></div>
                <div><Label>Talla (cm)</Label><Input type="number" value={newborn.length ?? ""} onChange={(e) => setNewborn((n) => ({ ...n, length: e.target.value ? Number(e.target.value) : null }))} /></div>
              </div>
              <div><Label>Centro médico</Label><Input value={newborn.medicalCenter || ""} onChange={set("medicalCenter")} /></div>
              <div><Label>Observaciones</Label><Textarea value={newborn.observations || ""} onChange={set("observations")} rows={2} /></div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
