import { useQuery } from "@tanstack/react-query";
import { Baby } from "lucide-react";
import { fetchPregnanciesByPatient } from "@/lib/pregnancies-api";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
}

/** Aviso inmediato de embarazo activo, visible sin entrar a la pestaña "Embarazos". */
export function PregnancyBanner({ patientId }: { patientId: string }) {
  const { data: pregnancies = [] } = useQuery({
    queryKey: ["pregnancies", patientId],
    queryFn: () => fetchPregnanciesByPatient(patientId),
  });

  const active = pregnancies.find((p) => !p.isFinalized && !p.isLoss && !p.isEctopic);
  if (!active) return null;

  return (
    <div className="medical-card p-3 flex items-center gap-2 bg-accent-light border-accent">
      <Baby size={18} className="text-accent shrink-0" />
      <p className="text-sm text-foreground">
        <span className="font-semibold">Embarazada</span>
        {active.gestationalAgeWeeks != null && ` · ${active.gestationalAgeWeeks} semanas`}
        {active.dueDate && ` · F.P.P ${formatDate(active.dueDate)}`}
      </p>
    </div>
  );
}
