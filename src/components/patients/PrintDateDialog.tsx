import { useEffect, useState } from "react";
import { Calendar, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatLongSpanishDate, todayKey, toDateInputValue } from "@/lib/calendar-date";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Artículo + nombre del documento, ej. "el récipe", "la ecografía". */
  documentLabel: string;
  /** Fecha actual del documento (YYYY-MM-DD o timestamp ISO). Si falta, usa hoy. */
  defaultDate?: string | null;
  onConfirm: (fecha: string) => void | Promise<void>;
}

/** Modal reutilizable para elegir la fecha que saldrá impresa en un PDF (no modifica la historia). */
export function PrintDateDialog({ open, onOpenChange, documentLabel, defaultDate, onConfirm }: Props) {
  const [date, setDate] = useState(() => toDateInputValue(defaultDate));
  const { toast } = useToast();

  useEffect(() => {
    if (open) setDate(toDateInputValue(defaultDate));
  }, [open, defaultDate]);

  const readableDate = formatLongSpanishDate(date);

  function handleConfirm() {
    if (!readableDate) return;
    const pending = onConfirm(date);
    onOpenChange(false);
    Promise.resolve(pending).catch((error: unknown) => {
      const description = error instanceof Error ? error.message : "Intenta nuevamente.";
      toast({ title: "No se pudo abrir el PDF", description, variant: "destructive" });
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Con qué fecha imprimo {documentLabel}?</DialogTitle>
          <DialogDescription>
            Esta fecha solo sale en el PDF; no cambia los datos guardados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="print-date-input">Fecha del documento</Label>
            <Input
              id="print-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {readableDate ? (
            <p className="rounded-md bg-muted/60 px-3 py-2 text-sm font-medium text-foreground">
              {readableDate}
            </p>
          ) : (
            <p className="text-sm text-destructive">Elige una fecha válida para imprimir.</p>
          )}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDate(todayKey())}
              className="h-10 gap-1.5"
            >
              <Calendar size={14} />
              Usar la fecha de hoy
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 text-base flex-1 sm:flex-none"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="lg"
            className="h-12 text-base gap-2 flex-1 sm:flex-none"
            disabled={!readableDate}
            onClick={handleConfirm}
          >
            <Printer size={18} />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
