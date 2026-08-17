import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { fetchCatalog, CatalogKey } from "@/lib/catalogs-api";
import { CatalogRow } from "@/components/catalogs/CatalogRow";

const TABS: { key: CatalogKey; label: string }[] = [
  { key: "medical-centers", label: "Centros médicos" },
  { key: "diagnoses", label: "Diagnósticos" },
  { key: "medications", label: "Fármacos" },
  { key: "lab-exams", label: "Exámenes" },
  { key: "labs", label: "Laboratorios" },
  { key: "icd10", label: "CIE-10" },
  { key: "referring-doctors", label: "Médicos referidos" },
];

function useDebounced<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function Catalogs() {
  const [tab, setTab] = useState<CatalogKey>("medical-centers");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounced(query, 350);

  useEffect(() => setPage(1), [debouncedQuery, tab]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["catalog", tab, debouncedQuery, page],
    queryFn: () => fetchCatalog(tab, { search: debouncedQuery || undefined, page, limit: 30 }),
  });

  const items = data?.items || [];

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <h1 className="text-lg font-bold text-foreground mb-3">Catálogos</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative mt-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
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
        {isError && <div className="py-12 text-center text-sm text-destructive">No se pudo cargar el catálogo.</div>}

        {!isLoading && !isError && (
          <>
            <p className="text-xs text-muted-foreground mb-2">{data?.total ?? 0} resultados</p>
            <div className="space-y-2">
              {items.map((item) => (
                <CatalogRow key={item.id} catalogKey={tab} item={item} />
              ))}
              {items.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Sin resultados</div>
              )}
            </div>

            {data && data.pages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn("cursor-pointer", data.page <= 1 && "pointer-events-none opacity-40")}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-xs text-muted-foreground">Página {data.page} de {data.pages}</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      className={cn("cursor-pointer", data.page >= data.pages && "pointer-events-none opacity-40")}
                      onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
