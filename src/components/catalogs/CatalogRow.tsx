import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CatalogItem, CatalogKey, deleteCatalogItem } from "@/lib/catalogs-api";
import { ConfirmDeleteDialog } from "@/components/patients/ConfirmDeleteDialog";
import { CatalogItemDialog } from "@/components/catalogs/CatalogItemDialog";
import { useToast } from "@/components/ui/use-toast";

function primaryText(key: CatalogKey, item: CatalogItem) {
  if (key === "medications") return item.commercialName;
  if (key === "icd10") return item.title;
  return item.name;
}

function secondaryText(key: CatalogKey, item: CatalogItem) {
  if (key === "medical-centers") return item.address;
  if (key === "diagnoses") return item.icd10Code ? `CIE-10: ${item.icd10Code}` : null;
  if (key === "medications") return [item.genericName, item.presentation].filter(Boolean).join(" · ");
  if (key === "lab-exams") return item.isGroup ? "Grupo de exámenes" : "Examen individual";
  if (key === "icd10") return item.code;
  if (key === "referring-doctors") return item.specialty;
  return null;
}

export function CatalogRow({ catalogKey, item }: { catalogKey: CatalogKey; item: CatalogItem }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: () => deleteCatalogItem(catalogKey, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", catalogKey] });
      toast({ title: "Elemento eliminado" });
      setDeleteOpen(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const primary = primaryText(catalogKey, item);
  const secondary = secondaryText(catalogKey, item);

  return (
    <div className="medical-card p-3.5 flex items-center justify-between gap-2">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-foreground truncate">{primary}</span>
        {secondary && <span className="text-xs text-muted-foreground truncate">{secondary}</span>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Editar"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <CatalogItemDialog catalogKey={catalogKey} item={item} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar elemento"
        description={`¿Eliminar "${primary}" del catálogo? Esta acción no se puede deshacer.`}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
