import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { RecipeItem, fetchMedicationSuggestions } from "@/lib/clinical-records-api";

interface Props {
  items: RecipeItem[];
  onChange: (items: RecipeItem[]) => void;
}

/** Nombre del medicamento con autocompletado: al elegir uno ya usado, rellena su posología. */
function MedicationNameInput({ item, onUpdate }: { item: RecipeItem; onUpdate: (item: RecipeItem) => void }) {
  const [open, setOpen] = useState(false);
  const search = item.nombre || "";

  const { data: suggestions = [] } = useQuery({
    queryKey: ["medication-suggestions", search],
    queryFn: () => fetchMedicationSuggestions(search),
    enabled: search.length >= 2,
    staleTime: 60 * 1000,
  });

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          placeholder="Nombre del medicamento"
          value={item.nombre || ""}
          onChange={(e) => { onUpdate({ ...item, nombre: e.target.value }); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </PopoverAnchor>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        // Sin esto, Radix mueve el foco adentro del popover en cuanto abre y la
        // paciente no puede seguir escribiendo en el input de afuera - eso era
        // el bug de "no deja escribir".
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>Sin coincidencias</CommandEmpty>
            <CommandGroup heading="Ya recetados">
              {suggestions.map((s, i) => (
                <CommandItem
                  key={`${s.nombre}-${i}`}
                  value={`${s.nombre}-${i}`}
                  onSelect={() => { onUpdate({ nombre: s.nombre, comercial: s.comercial, posologia: s.posologia }); setOpen(false); }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.nombre}{s.comercial ? ` (${s.comercial})` : ""}</p>
                    {s.posologia && <p className="truncate text-xs text-muted-foreground">{s.posologia}</p>}
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">{s.count}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Editor de récipe dentro de una consulta: lista de {medicamento, posología}, con autocompletado de lo ya recetado. */
export function RecipeItemsEditor({ items, onChange }: Props) {
  const update = (i: number, item: RecipeItem) => onChange(items.map((it, idx) => (idx === i ? item : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { nombre: "", comercial: "", posologia: "" }]);

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Récipe</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus size={14} className="mr-1" />Agregar medicamento
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <MedicationNameInput item={item} onUpdate={(v) => update(i, v)} />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Nombre comercial"
              value={item.comercial || ""}
              onChange={(e) => update(i, { ...item, comercial: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Indicaciones (ej: 1 tableta cada 12 horas x 7 días)"
              value={item.posologia || ""}
              onChange={(e) => update(i, { ...item, posologia: e.target.value })}
            />
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ))}
      {!items.length && <p className="text-xs text-muted-foreground">Sin medicamentos agregados.</p>}
    </div>
  );
}
