import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchPregnanciesByPatient, createPregnancy, Pregnancy } from "@/lib/pregnancies-api";
import { formatApiDate } from "@/lib/calendar-date";
import { FechaInciertaCalculator } from "./FechaInciertaCalculator";

interface Props {
  patientId: string;
  pregnancyId: string;
  onChange: (pregnancyId: string) => void;
  /**
   * Solo en consulta NUEVA: si viene sin embarazo elegido, se preselecciona el
   * activo una vez. En edición nunca se reasigna sola: la consulta puede ser de
   * otra gesta o no tener ninguna a propósito.
   */
  autoSelectActive: boolean;
}

function pregnancyLabel(p: Pregnancy) {
  const dueDate = p.dueDate ? ` · F.P.P ${formatApiDate(p.dueDate, { day: "2-digit", month: "2-digit", year: "numeric" })}` : "";
  return `Gesta N° ${p.pregnancyNumber} — ${p.gestationalAgeWeeks ?? "?"} semanas${dueDate}`;
}

/**
 * Cuando la consulta es de categoría Obstetricia se enlaza a una Ficha de
 * Embarazo: se muestra la elegida, se ofrece la activa, o se crea una acá mismo
 * (F.U.M conocida o por fecha incierta) sin salir del flujo de la consulta.
 */
export function PregnancyPicker({ patientId, pregnancyId, onChange, autoSelectActive }: Props) {
  const [lmpDate, setLmpDate] = useState("");
  const [showCalc, setShowCalc] = useState(false);
  const autoSelected = useRef(false);
  const queryClient = useQueryClient();

  const { data: pregnancies = [], isLoading } = useQuery({
    queryKey: ["pregnancies", patientId],
    queryFn: () => fetchPregnanciesByPatient(patientId),
  });
  const active = pregnancies.find((p) => !p.isFinalized && !p.isLoss && !p.isEctopic);
  const selected = pregnancies.find((p) => p.id === pregnancyId);

  const create = useMutation({
    mutationFn: (data: { lmpSource: "reported" | "estimated"; lmpDate?: string; lmpReferenceDate?: string; lmpReferenceWeeks?: number; lmpReferenceDays?: number }) =>
      createPregnancy({ patientId, ...data }),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ["pregnancies", patientId] });
      onChange(p.id);
    },
  });

  useEffect(() => {
    if (!autoSelectActive || autoSelected.current || pregnancyId || !active) return;
    autoSelected.current = true;
    onChange(active.id);
  }, [autoSelectActive, pregnancyId, active, onChange]);

  if (isLoading) return <p className="text-xs text-muted-foreground">Buscando ficha de embarazo...</p>;

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-light/50 p-3">
        <Baby size={16} className="text-primary shrink-0" />
        <p className="text-sm text-foreground flex-1">{pregnancyLabel(selected)}</p>
        <Button type="button" variant="ghost" className="h-11 md:h-9 shrink-0" onClick={() => { autoSelected.current = true; onChange(""); }}>
          Quitar
        </Button>
      </div>
    );
  }

  if (active) {
    return (
      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="text-sm text-foreground">Esta consulta no está vinculada a un embarazo.</p>
        <Button type="button" variant="outline" className="h-auto min-h-11 py-2 whitespace-normal text-left w-full sm:w-auto" onClick={() => onChange(active.id)}>
          <Baby />Vincular a {pregnancyLabel(active)}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Esta paciente no tiene una ficha de embarazo activa</p>
      <div className="flex flex-col sm:flex-row sm:items-end gap-2">
        <div className="flex-1">
          <Label>F.U.M (si se sabe)</Label>
          <Input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} />
        </div>
        <Button
          type="button"
          className="h-11 md:h-10"
          disabled={!lmpDate || create.isPending}
          onClick={() => create.mutate({ lmpSource: "reported", lmpDate })}
        >
          Crear ficha
        </Button>
      </div>
      <Button type="button" variant="outline" className="h-auto min-h-11 py-2 whitespace-normal" onClick={() => setShowCalc(true)}>
        F.U.M incierta - calcular por ecografía
      </Button>
      <FechaInciertaCalculator
        open={showCalc}
        onOpenChange={setShowCalc}
        onConfirm={(referenceDate, weeks, days) =>
          create.mutate({ lmpSource: "estimated", lmpReferenceDate: referenceDate, lmpReferenceWeeks: weeks, lmpReferenceDays: days })
        }
      />
    </div>
  );
}
