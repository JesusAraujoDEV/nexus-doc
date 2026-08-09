import { NavigateFunction } from "react-router-dom";
import { PatientListItem, PatientSortBy, SortDir } from "@/lib/patients-api";
import { PatientTableRow } from "@/components/patients/PatientRows";
import { SortableHeader } from "@/components/patients/SortableHeader";

interface Props {
  items: PatientListItem[];
  navigate: NavigateFunction;
  sortBy: PatientSortBy;
  sortDir: SortDir;
  onSort: (column: PatientSortBy) => void;
  onEdit: (p: PatientListItem) => void;
  onDelete: (p: PatientListItem) => void;
  onNewConsultation: (p: PatientListItem) => void;
  emptyQuery: string;
}

export function PatientsTable({ items, navigate, sortBy, sortDir, onSort, onEdit, onDelete, onNewConsultation, emptyQuery }: Props) {
  return (
    <div className="hidden md:block">
      <div className="medical-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <SortableHeader label="Paciente" column="name" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableHeader label="Cédula" column="cedula" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teléfono</th>
              <SortableHeader label="Consultas" column="visitsCount" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableHeader label="Última Visita" column="lastVisit" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <PatientTableRow key={p.id} p={p} navigate={navigate} idx={i} onEdit={onEdit} onDelete={onDelete} onNewConsultation={onNewConsultation} />
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No se encontraron pacientes para "<span className="font-medium">{emptyQuery}</span>"
          </div>
        )}
      </div>
    </div>
  );
}
