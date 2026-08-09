import { NavigateFunction } from "react-router-dom";
import { PatientListItem, PatientSortBy, SortDir } from "@/lib/patients-api";
import { PatientCard } from "@/components/patients/PatientRows";

interface Props {
  items: PatientListItem[];
  navigate: NavigateFunction;
  sortBy: PatientSortBy;
  sortDir: SortDir;
  onSort: (column: PatientSortBy) => void;
  onSortDirToggle: () => void;
  onEdit: (p: PatientListItem) => void;
  onDelete: (p: PatientListItem) => void;
  onNewConsultation: (p: PatientListItem) => void;
}

export function PatientsMobileList({ items, navigate, sortBy, sortDir, onSort, onSortDirToggle, onEdit, onDelete, onNewConsultation }: Props) {
  return (
    <div className="md:hidden space-y-3">
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSort(e.target.value as PatientSortBy)}
          className="h-9 flex-1 rounded-lg bg-muted border-0 text-xs px-2.5"
        >
          <option value="createdAt">Ordenar: más recientes</option>
          <option value="name">Ordenar: nombre</option>
          <option value="cedula">Ordenar: cédula</option>
          <option value="visitsCount">Ordenar: nº de consultas</option>
          <option value="lastVisit">Ordenar: última visita</option>
        </select>
        <button
          onClick={onSortDirToggle}
          className="h-9 w-9 shrink-0 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"
          aria-label="Invertir orden"
        >
          {sortDir === "ASC" ? "↑" : "↓"}
        </button>
      </div>
      {items.map((p, i) => (
        <PatientCard key={p.id} p={p} navigate={navigate} idx={i} onEdit={onEdit} onDelete={onDelete} onNewConsultation={onNewConsultation} />
      ))}
      {items.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">No se encontraron pacientes</div>
      )}
    </div>
  );
}
