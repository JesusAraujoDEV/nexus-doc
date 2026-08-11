import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";

export interface CatalogOption {
  id: string;
  name: string;
  subtitle?: string | null;
}

interface Props {
  /** Texto en el input - el nombre elegido, o lo que se está escribiendo para buscar/crear. */
  value: string;
  onTextChange: (text: string) => void;
  onSelect: (option: CatalogOption) => void;
  fetchOptions: (search: string) => Promise<CatalogOption[]>;
  queryKey: string;
  placeholder?: string;
  /** Si se da, ofrece "Crear <texto>" cuando no hay coincidencia exacta (catálogo de médicos referentes). */
  onCreate?: (name: string) => Promise<CatalogOption>;
}

/**
 * Picker de catálogo por id (no historial de texto libre como SuggestCombobox).
 * Usa PopoverAnchor sobre un <Input> en vez de PopoverTrigger: un PopoverTrigger
 * fuerza type="button" y rompe el tipeo (bug ya corregido una vez en RecipeItemsEditor).
 */
export function CatalogComboBox({ value, onTextChange, onSelect, fetchOptions, queryKey, placeholder, onCreate }: Props) {
  const [open, setOpen] = useState(false);

  const { data: options = [] } = useQuery({
    queryKey: ["catalog-combo", queryKey, value],
    queryFn: () => fetchOptions(value),
    enabled: value.length >= 1,
    staleTime: 30 * 1000,
  });

  const exactMatch = options.some((o) => o.name.toLowerCase() === value.trim().toLowerCase());

  return (
    <Popover open={open && value.length >= 1} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onTextChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </PopoverAnchor>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o.id} value={o.id} onSelect={() => { onSelect(o); setOpen(false); }}>
                  <div className="min-w-0">
                    <p className="truncate">{o.name}</p>
                    {o.subtitle && <p className="truncate text-xs text-muted-foreground">{o.subtitle}</p>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {onCreate && value.trim() && !exactMatch && (
              <CommandGroup>
                <CommandItem
                  value={`__create__${value}`}
                  onSelect={async () => {
                    const created = await onCreate(value.trim());
                    onSelect(created);
                    setOpen(false);
                  }}
                >
                  <Plus size={14} className="mr-1" />Crear "{value.trim()}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
