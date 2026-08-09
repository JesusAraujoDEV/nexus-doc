import { useQuery } from "@tanstack/react-query";
import { fetchPregnanciesByPatient } from "@/lib/pregnancies-api";
import { PregnancyCard } from "./PregnancyCard";

/** Fichas de embarazo de la paciente (todas: activa + historial). Se crean desde "Nueva consulta" → Obstetricia. */
export function PregnancySection({ patientId }: { patientId: string }) {
  const { data: pregnancies = [] } = useQuery({
    queryKey: ["pregnancies", patientId],
    queryFn: () => fetchPregnanciesByPatient(patientId),
  });

  if (!pregnancies.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-foreground">Embarazo</h3>
      {pregnancies.map((p) => <PregnancyCard key={p.id} pregnancy={p} />)}
    </div>
  );
}
