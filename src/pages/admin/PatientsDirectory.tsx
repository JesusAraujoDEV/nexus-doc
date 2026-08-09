import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchPatients, PatientSortBy, SortDir, PatientListItem, deletePatient } from "@/lib/patients-api";
import { PatientsMobileList } from "@/components/patients/PatientsMobileList";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { PatientFilters, Filters } from "@/components/patients/PatientFilters";
import { ConfirmDeleteDialog } from "@/components/patients/ConfirmDeleteDialog";
import { EditPatientQuickDialog } from "@/components/patients/EditPatientQuickDialog";
import { NewPatientDialog } from "@/components/patients/NewPatientDialog";
import { PatientsPagination } from "@/components/patients/PatientsPagination";
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

export default function PatientsDirectory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<PatientSortBy>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("DESC");
  const [filters, setFilters] = useState<Filters>({ gender: "", hasVisits: "", hasCedula: "", pregnant: "" });
  const debouncedQuery = useDebounced(query, 350);

  const [editingPatient, setEditingPatient] = useState<PatientListItem | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<PatientListItem | null>(null);
  const [showNewPatient, setShowNewPatient] = useState(false);

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
    [debouncedQuery, sortBy, sortDir, filters.gender, filters.hasVisits, filters.hasCedula, filters.pregnant],
  );

  function handleSort(column: PatientSortBy) {
    if (sortBy === column) {
      setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortDir("ASC");
    }
  }

  const onNewConsultation = (p: PatientListItem) => navigate(`/admin/patients/${p.id}/consultations/new`);

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
      pregnant: filters.pregnant || undefined,
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewPatient(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <UserPlus size={14} />Nueva paciente
            </button>
            {!!data && <div className="badge-primary text-xs">{data.total} resultados</div>}
          </div>
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
            <PatientsMobileList
              items={items} navigate={navigate} sortBy={sortBy} sortDir={sortDir}
              onSort={handleSort} onSortDirToggle={() => setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"))}
              onEdit={setEditingPatient} onDelete={setDeletingPatient} onNewConsultation={onNewConsultation}
            />
            <PatientsTable
              items={items} navigate={navigate} sortBy={sortBy} sortDir={sortDir} onSort={handleSort}
              onEdit={setEditingPatient} onDelete={setDeletingPatient} onNewConsultation={onNewConsultation}
              emptyQuery={query}
            />
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

      <NewPatientDialog open={showNewPatient} onOpenChange={setShowNewPatient} />
    </div>
  );
}
