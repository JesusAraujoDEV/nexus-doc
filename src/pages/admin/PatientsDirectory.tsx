import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { fetchPatients, PatientSortBy, SortDir, PatientListItem, deletePatient, updatePatient } from "@/lib/patients-api";
import { PatientTableRow, PatientCard } from "@/components/patients/PatientRows";
import { SortableHeader } from "@/components/patients/SortableHeader";
import { PatientFilters, Filters } from "@/components/patients/PatientFilters";
import { ConfirmDeleteDialog } from "@/components/patients/ConfirmDeleteDialog";
import { NewConsultationDialog } from "@/components/patients/NewConsultationDialog";
import { EditPatientQuickDialog } from "@/components/patients/EditPatientQuickDialog";
import { useToast } from "@/components/ui/use-toast";

const PAGE_SIZE = 20;

function useDebounced<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function PatientsPagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn("cursor-pointer", page <= 1 && "pointer-events-none opacity-40")}
            onClick={() => onChange(Math.max(1, page - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-3 text-xs text-muted-foreground">Página {page} de {pages}</span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={cn("cursor-pointer", page >= pages && "pointer-events-none opacity-40")}
            onClick={() => onChange(Math.min(pages, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default function PatientsDirectory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<PatientSortBy>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("DESC");
  const [filters, setFilters] = useState<Filters>({ gender: "", hasVisits: "", hasCedula: "" });
  const debouncedQuery = useDebounced(query, 350);

  const [editingPatient, setEditingPatient] = useState<PatientListItem | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<PatientListItem | null>(null);
  const [newConsultationFor, setNewConsultationFor] = useState<PatientListItem | null>(null);

  const deleteMut = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente eliminado" });
      setDeletingPatient(null);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  useEffect(
    () => setPage(1),
    [debouncedQuery, sortBy, sortDir, filters.gender, filters.hasVisits, filters.hasCedula],
  );

  function handleSort(column: PatientSortBy) {
    if (sortBy === column) {
      setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortDir("ASC");
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients", debouncedQuery, page, sortBy, sortDir, filters],
    queryFn: () => fetchPatients({
      search: debouncedQuery || undefined,
      page,
      limit: PAGE_SIZE,
      sortBy,
      sortDir,
      gender: filters.gender || undefined,
      hasVisits: filters.hasVisits || undefined,
      hasCedula: filters.hasCedula || undefined,
    }),
  });

  const items = data?.items || [];

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">Pacientes</h1>
            <p className="text-xs text-muted-foreground">{data?.total ?? "…"} registros totales</p>
          </div>
          {!!data && <div className="badge-primary text-xs">{data.total} resultados</div>}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, cédula o teléfono..."
            className="pl-9 h-11 rounded-xl bg-muted border-0 text-sm"
          />
        </div>
        <PatientFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="flex-1 p-4">
        {isLoading && (
          <div className="py-16 flex justify-center text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
          </div>
        )}

        {isError && (
          <div className="py-12 text-center text-sm text-destructive">No se pudo cargar la lista de pacientes.</div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="md:hidden space-y-3">
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value as PatientSortBy)}
                  className="h-9 flex-1 rounded-lg bg-muted border-0 text-xs px-2.5"
                >
                  <option value="createdAt">Ordenar: más recientes</option>
                  <option value="name">Ordenar: nombre</option>
                  <option value="cedula">Ordenar: cédula</option>
                  <option value="visitsCount">Ordenar: nº de consultas</option>
                  <option value="lastVisit">Ordenar: última visita</option>
                </select>
                <button
                  onClick={() => setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"))}
                  className="h-9 w-9 shrink-0 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"
                  aria-label="Invertir orden"
                >
                  {sortDir === "ASC" ? "↑" : "↓"}
                </button>
              </div>
              {items.map((p, i) => (
                <PatientCard key={p.id} p={p} navigate={navigate} idx={i}
                  onEdit={setEditingPatient}
                  onDelete={setDeletingPatient}
                  onNewConsultation={setNewConsultationFor}
                />
              ))}
              {items.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">No se encontraron pacientes</div>
              )}
            </div>

            <div className="hidden md:block">
              <div className="medical-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <SortableHeader label="Paciente" column="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                      <SortableHeader label="Cédula" column="cedula" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teléfono</th>
                      <SortableHeader label="Consultas" column="visitsCount" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                      <SortableHeader label="Última Visita" column="lastVisit" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p, i) => (
                      <PatientTableRow key={p.id} p={p} navigate={navigate} idx={i}
                        onEdit={setEditingPatient}
                        onDelete={setDeletingPatient}
                        onNewConsultation={setNewConsultationFor}
                      />
                    ))}
                  </tbody>
                </table>
                {items.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No se encontraron pacientes para "<span className="font-medium">{query}</span>"
                  </div>
                )}
              </div>
            </div>

            {data && <PatientsPagination page={data.page} pages={data.pages} onChange={setPage} />}
          </>
        )}
      </div>

      {editingPatient && (
        <EditPatientQuickDialog
          patient={editingPatient}
          open={!!editingPatient}
          onOpenChange={(v) => !v && setEditingPatient(null)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deletingPatient}
        onOpenChange={(v) => !v && setDeletingPatient(null)}
        title="Eliminar paciente"
        description={`Se eliminara "${deletingPatient ? `${deletingPatient.firstName} ${deletingPatient.lastName}` : ''}" y sus consultas. No se borrara permanentemente.`}
        onConfirm={() => deletingPatient && deleteMut.mutate(deletingPatient.id)}
        loading={deleteMut.isPending}
      />

      {newConsultationFor && (
        <NewConsultationDialog
          patientId={newConsultationFor.id}
          open={!!newConsultationFor}
          onOpenChange={(v) => !v && setNewConsultationFor(null)}
        />
      )}
    </div>
  );
}
