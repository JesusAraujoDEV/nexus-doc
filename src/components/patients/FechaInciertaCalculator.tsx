import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Devuelve fecha de referencia + semanas/días - el padre calcula y crea/actualiza la ficha. */
  onConfirm: (referenceDate: string, weeks: number, days: number) => void;
}

/**
 * "Fecha incierta": la doctora no tiene la F.U.M exacta, pero sí una ecografía con
 * fecha y edad gestacional. Mismo flujo que MedDig: fecha de la eco + semanas/días
 * → F.U.M aproximada = fecha de la eco menos esas semanas/días.
 */
export function FechaInciertaCalculator({ open, onOpenChange, onConfirm }: Props) {
  const [referenceDate, setReferenceDate] = useState(new Date().toISOString().slice(0, 10));
  const [weeks, setWeeks] = useState("");
  const [days, setDays] = useState("");

  const canCalculate = referenceDate && weeks !== "" && days !== "";
  const preview = canCalculate
    ? new Date(new Date(referenceDate).getTime() - (Number(weeks) * 7 + Number(days)) * 86400000)
      .toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Fecha incierta</DialogTitle></DialogHeader>
        <p className="text-xs text-muted-foreground">
          Escriba la fecha de la ecografía y la edad gestacional que indica (semanas y días), y se calcula la F.U.M aproximada.
        </p>
        <div>
          <Label>Fecha de la ecografía</Label>
          <Input type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Semanas</Label><Input type="number" min={0} value={weeks} onChange={(e) => setWeeks(e.target.value)} /></div>
          <div><Label>Días</Label><Input type="number" min={0} value={days} onChange={(e) => setDays(e.target.value)} /></div>
        </div>
        {preview && (
          <p className="text-sm">F.U.M aproximada: <span className="font-semibold text-primary">{preview}</span></p>
        )}
        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            type="button"
            disabled={!canCalculate}
            onClick={() => { onConfirm(referenceDate, Number(weeks), Number(days)); onOpenChange(false); }}
          >
            Establecer como F.U.M
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
