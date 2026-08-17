import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CatalogItem, CatalogKey, createCatalogItem, updateCatalogItem } from "@/lib/catalogs-api";
import { CATALOG_FIELDS, CatalogField } from "@/components/catalogs/catalog-fields";

interface Props {
  catalogKey: CatalogKey;
  item: CatalogItem | null; // null = crear
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type FormState = Record<string, string | boolean>;

function toFormState(fields: CatalogField[], item: CatalogItem | null): FormState {
  const state: FormState = {};
  for (const field of fields) {
    const raw = item?.[field.key];
    state[field.key] = field.type === "checkbox" ? Boolean(raw) : (raw as string) || "";
  }
  return state;
}

export function CatalogItemDialog({ catalogKey, item, open, onOpenChange }: Props) {
  const fields = CATALOG_FIELDS[catalogKey];
  const [form, setForm] = useState<FormState>(() => toFormState(fields, item));
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEdit = Boolean(item);

  const mutation = useMutation({
    mutationFn: () => {
      const payload: Partial<CatalogItem> = {};
      for (const field of fields) {
        const value = form[field.key];
        (payload as Record<string, unknown>)[field.key] = field.type === "checkbox" ? Boolean(value) : (value || null);
      }
      return isEdit ? updateCatalogItem(catalogKey, item!.id, payload) : createCatalogItem(catalogKey, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", catalogKey] });
      toast({ title: isEdit ? "Elemento actualizado" : "Elemento creado" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setForm(toFormState(fields, item)); onOpenChange(v); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar" : "Nuevo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={Boolean(form[field.key])}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, [field.key]: Boolean(v) }))}
                  />
                  {field.label}
                </label>
              ) : (
                <>
                  <Label htmlFor={`cid-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`cid-${field.key}`}
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    required={field.required}
                  />
                </>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
