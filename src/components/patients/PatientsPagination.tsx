import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}

export function PatientsPagination({ page, pages, onChange }: Props) {
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
