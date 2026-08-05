import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { PatientSortBy, SortDir } from "@/lib/patients-api";

interface Props {
  label: string;
  column: PatientSortBy;
  sortBy: PatientSortBy;
  sortDir: SortDir;
  onSort: (column: PatientSortBy) => void;
}

export function SortableHeader({ label, column, sortBy, sortDir, onSort }: Props) {
  const isActive = sortBy === column;
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {label}
        {isActive ? (
          sortDir === "ASC" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
        ) : (
          <ChevronsUpDown size={13} className="opacity-40" />
        )}
      </button>
    </th>
  );
}
