import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchPregnanciesByPatient, createPregnancy } from "@/lib/pregnancies-api";
import { FechaInciertaCalculator } from "./FechaInciertaCalculator";

interface Props {
  patientId: string;
  pregnancyId: string;
  onChange: (pregnancyId: string) => void;
}

/**
 * Cuando la consulta es de categoría Obstetricia, hace falta una Ficha de Embarazo
 * activa: si la paciente ya tiene una, se enlaza sola; si no, se crea acá mismo
 * (F.U.M conocida o por fecha incierta) sin salir del flujo de la consulta.
 */
export function PregnancyPicker({ patientId, pregnancyId, onChange }: Props) {
  const [lmpDate, setLmpDate] = useState("");
  const [showCalc, setShowCalc] = useState(false);
  const queryClient = useQueryClient();

  const { data: pregnancies = [], isLoading } = useQuery({
    queryKey: ["pregnancies", patientId],
    queryFn: () => fetchPregnanciesByPatient(patientId),
  });
  const active = pregnancies.find((p) => !p.isFinalized && !p.isLoss && !p.isEctopic);

  const create = useMutation({
    mutationFn: (data: { lmpSource: "reported" | "estimated"; lmpDate?: string; lmpReferenceDate?: string; lmpReferenceWeeks?: number; lmpReferenceDays?: number }) =>
      createPregnancy({ patientId, ...data }),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ["pregnancies", patientId] });
      onChange(p.id);
    },
  });

  useEffect(() => {
    if (active && pregnancyId !== active.id) onChange(active.id);
  }, [active, pregnancyId, onChange]);

  if (isLoading) return <p className="text-xs text-muted-foreground">Buscando ficha de embarazo...</p>;

  if (active) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-light/50 p-3">
        <Baby size={16} className="text-primary shrink-0" />
        <p className="text-sm text-foreground">
          Gesta N° {active.pregnancyNumber} — {active.gestationalAgeWeeks ?? "?"} semanas
          {active.dueDate && ` · F.P.P ${new Date(active.dueDate).toLocaleDateString("es-VE")}`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Esta paciente no tiene una ficha de embarazo activa</p>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>F.U.M (si se sabe)</Label>
          <Input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} />
        </div>
        <Button
          type="button"
          disabled={!lmpDate || create.isPending}
          onClick={() => create.mutate({ lmpSource: "reported", lmpDate })}
        >
          Crear ficha
        </Button>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => setShowCalc(true)}>
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
