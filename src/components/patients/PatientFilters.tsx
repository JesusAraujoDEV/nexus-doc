import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Filters {
  gender: "" | "Femenino" | "Masculino";
  hasVisits: "" | "true" | "false";
  hasCedula: "" | "true" | "false";
  pregnant: "" | "true" | "history";
  labsPending: "" | "true";
}

export const EMPTY_FILTERS: Filters = {
  gender: "",
  hasVisits: "",
  hasCedula: "",
  pregnant: "",
  labsPending: "",
};

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const selectClass =
  "h-9 rounded-lg bg-muted border-0 text-xs px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

export function PatientFilters({ filters, onChange }: Props) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 flex-wrap mt-3 p-2 rounded-xl bg-muted/40">
      <span className={cn("flex items-center gap-1 text-xs text-muted-foreground shrink-0", activeCount > 0 && "text-primary")}>
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
      <select
        value={filters.hasCedula}
        onChange={(e) => onChange({ ...filters, hasCedula: e.target.value as Filters["hasCedula"] })}
        className={selectClass}
      >
        <option value="">Cédula: todas</option>
        <option value="true">Con cédula</option>
        <option value="false">Sin cédula</option>
      </select>
      <select
        value={filters.pregnant}
        onChange={(e) => onChange({ ...filters, pregnant: e.target.value as Filters["pregnant"] })}
        className={selectClass}
      >
        <option value="">Embarazo: todas</option>
        <option value="true">Embarazadas ahora</option>
        <option value="history">Embarazadas (historial)</option>
      </select>
      <select
        value={filters.labsPending}
        onChange={(e) => onChange({ ...filters, labsPending: e.target.value as Filters["labsPending"] })}
        className={selectClass}
      >
        <option value="">Exámenes: todos</option>
        <option value="true">Con exámenes pendientes</option>
      </select>
      {activeCount > 0 && (
        <button
          onClick={() => onChange(EMPTY_FILTERS)}
          className="flex items-center gap-1 h-9 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X size={13} />
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
