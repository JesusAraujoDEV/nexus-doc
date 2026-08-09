import { Baby } from "lucide-react";
import { ClinicalRecord } from "@/lib/patients-api";
import { currentPregnancyStatus } from "@/lib/pregnancy";

function formatDate(d: Date) {
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
}

/** Semanas de embarazo y fecha probable de parto, calculado a partir de lo que la doctora ya registró. */
export function PregnancyBanner({ records }: { records: ClinicalRecord[] }) {
  const status = currentPregnancyStatus(records);
  if (!status) return null;

  return (
    <div className="medical-card p-4 flex items-center gap-3 bg-primary-light/50 border-primary/20">
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
        <Baby size={18} className="text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {status.weeksToday} semanas{status.daysToday ? ` y ${status.daysToday} días` : ""} de embarazo
        </p>
        <p className="text-xs text-muted-foreground">
          Fecha probable de parto: {formatDate(status.dueDate)} · calculado con lo registrado el {new Date(status.sourceVisitDate).toLocaleDateString("es-VE")}
        </p>
      </div>
    </div>
  );
}
