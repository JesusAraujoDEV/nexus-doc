import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandSeparator } from "@/components/ui/command";

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Clave usada para cachear las sugerencias (@tanstack/react-query queryKey). */
  suggestionsKey: string;
  fetchSuggestions: () => Promise<{ value: string; count: number }[]>;
  placeholder?: string;
}

/**
 * Combobox genérico: sugiere lo que la doctora ya escribió antes para este campo
 * (con conteo de frecuencia) y permite escribir un valor nuevo si no está en la lista.
 * No depende de un catálogo mantenido aparte - las sugerencias salen del histórico real.
 */
export function SuggestCombobox({ value, onChange, suggestionsKey, fetchSuggestions, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: options = [] } = useQuery({
    queryKey: ["suggest", suggestionsKey],
    queryFn: fetchSuggestions,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = options.filter((o) => o.value.toUpperCase().includes(search.toUpperCase()));
  const noMatch = search.length >= 1 && !options.some((o) => o.value.toUpperCase() === search.toUpperCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder || "Seleccionar..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Buscar o escribir..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            {filtered.length > 0 && (
              <CommandGroup heading="Ya usados">
                {filtered.map((o) => (
                  <CommandItem key={o.value} value={o.value} onSelect={() => { onChange(o.value); setOpen(false); setSearch(""); }}>
                    <Check className={cn("mr-2 h-4 w-4", value === o.value ? "opacity-100" : "opacity-0")} />
                    {o.value}
                    <span className="ml-auto text-xs text-muted-foreground">{o.count}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {noMatch && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem value={search} onSelect={() => { onChange(search); setOpen(false); setSearch(""); }}>
                    <span className="text-primary font-medium">Usar: "{search}"</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
