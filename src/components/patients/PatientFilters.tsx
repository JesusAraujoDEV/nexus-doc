import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Filters {
  gender: "" | "Femenino" | "Masculino";
  hasVisits: "" | "true" | "false";
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const selectClass =
  "h-9 rounded-lg bg-muted border-0 text-xs px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

export function PatientFilters({ filters, onChange }: Props) {
  const activeCount = Number(!!filters.gender) + Number(!!filters.hasVisits);
  return (
    <div className="flex items-center gap-2 flex-wrap mt-3">
      <span className={cn("flex items-center gap-1 text-xs text-muted-foreground", activeCount > 0 && "text-primary")}>
        <SlidersHorizontal size={13} />
        Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
      </span>
      <select
        value={filters.gender}
        onChange={(e) => onChange({ ...filters, gender: e.target.value as Filters["gender"] })}
        className={selectClass}
      >
        <option value="">Sexo: todos</option>
        <option value="Femenino">Femenino</option>
        <option value="Masculino">Masculino</option>
      </select>
      <select
        value={filters.hasVisits}
        onChange={(e) => onChange({ ...filters, hasVisits: e.target.value as Filters["hasVisits"] })}
        className={selectClass}
      >
        <option value="">Consultas: todas</option>
        <option value="true">Con consultas</option>
        <option value="false">Sin consultas</option>
      </select>
    </div>
  );
}
