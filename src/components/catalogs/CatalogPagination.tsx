import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}

export function CatalogPagination({ page, pages, onChange }: Props) {
  const [draft, setDraft] = useState(String(page));

  useEffect(() => setDraft(String(page)), [page]);

  if (pages <= 1) return null;

  const commit = () => {
    const n = Number(draft);
    if (Number.isInteger(n)) onChange(Math.min(pages, Math.max(1, n)));
    else setDraft(String(page));
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn("cursor-pointer", page <= 1 && "pointer-events-none opacity-40")}
            onClick={() => onChange(Math.max(1, page - 1))}
          />
        </PaginationItem>
        <PaginationItem className="flex items-center gap-2 px-1">
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={pages}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="h-9 w-14 text-center px-1"
            aria-label="Ir a la página"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">de {pages}</span>
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
