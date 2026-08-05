import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandSeparator } from "@/components/ui/command";
import { apiFetch } from "@/lib/api";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

function fetchVisitTypes() {
  return apiFetch<{ type: string; count: number }[]>("/stats/visit-types");
}

export function VisitTypeCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: types = [] } = useQuery({
    queryKey: ["visit-types"],
    queryFn: fetchVisitTypes,
    staleTime: 5 * 60 * 1000,
  });

  const frequent = types.slice(0, 2); // CONTROL GINECOLOGICO y PRENATAL
  const rest = types.slice(2);
  const filtered = rest.filter((t) => t.type.includes(search.toUpperCase()));
  const noMatch = search.length >= 2 && !types.some((t) => t.type === search.toUpperCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || "Seleccionar tipo..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar o escribir..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            {frequent.length > 0 && (
              <CommandGroup heading="Frecuentes">
                {frequent.map((t) => (
                  <CommandItem
                    key={t.type}
                    value={t.type}
                    onSelect={() => { onChange(t.type); setOpen(false); setSearch(""); }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === t.type ? "opacity-100" : "opacity-0")} />
                    {t.type}
                    <span className="ml-auto text-xs text-muted-foreground">{t.count}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {filtered.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Otros tipos">
                  {filtered.map((t) => (
                    <CommandItem
                      key={t.type}
                      value={t.type}
                      onSelect={() => { onChange(t.type); setOpen(false); setSearch(""); }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === t.type ? "opacity-100" : "opacity-0")} />
                      {t.type}
                      <span className="ml-auto text-xs text-muted-foreground">{t.count}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
            {noMatch && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value={search.toUpperCase()}
                    onSelect={() => { onChange(search.toUpperCase()); setOpen(false); setSearch(""); }}
                  >
                    <span className="text-primary font-medium">Usar: "{search.toUpperCase()}"</span>
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
