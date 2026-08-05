import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { fetchPatients } from "@/lib/patients-api";
import { PatientTableRow, PatientCard } from "@/components/patients/PatientRows";

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
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounced(query, 350);

  useEffect(() => setPage(1), [debouncedQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients", debouncedQuery, page],
    queryFn: () => fetchPatients({ search: debouncedQuery || undefined, page, limit: PAGE_SIZE }),
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
              {items.map((p, i) => (
                <PatientCard key={p.id} p={p} navigate={navigate} idx={i} />
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paciente</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cédula</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teléfono</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Consultas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Última Visita</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p, i) => (
                      <PatientTableRow key={p.id} p={p} navigate={navigate} idx={i} />
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
    </div>
  );
}
