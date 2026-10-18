import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type RecentFilter = "" | "7" | "30" | "90" | "new";

const OPTIONS: { value: RecentFilter; label: string; hint: string }[] = [
  { value: "", label: "Todas", hint: "Todas las pacientes" },
  { value: "7", label: "Esta semana", hint: "Atendidas en los últimos 7 días" },
  { value: "30", label: "Este mes", hint: "Atendidas en los últimos 30 días" },
  { value: "90", label: "Últimos 3 meses", hint: "Atendidas en los últimos 90 días" },
  { value: "new", label: "Nuevas", hint: "Su primera consulta fue en los últimos 30 días" },
];

interface Props {
  value: RecentFilter;
  onChange: (value: RecentFilter) => void;
}

/**
 * Atajo grande para "las pacientes más recientes": botones de un toque en vez
 * de un desplegable. Se mide por la fecha de la consulta, no por cuándo se
 * cargó la ficha (la historia importada se cargó toda el mismo día).
 */
export function RecentPatientsChips({ value, onChange }: Props) {
  return (
    <div className="mt-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
        <Clock size={13} aria-hidden />Pacientes atendidas
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Filtrar por fecha de atención">
        {OPTIONS.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value || "all"}
              type="button"
              title={o.hint}
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "shrink-0 h-11 md:h-9 px-4 rounded-full text-base md:text-sm font-medium border transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-muted",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
