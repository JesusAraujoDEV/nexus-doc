import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Límites del backend: ≤20 items de ≤500 caracteres.
const MAX_ITEMS = 20;
const MAX_LENGTH = 500;

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
}

/** Lista editable de impresiones diagnósticas (texto libre, una por fila). */
export function DiagnosticImpressionsEditor({ items, onChange }: Props) {
  const update = (i: number, v: string) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Impresiones diagnósticas</Label>
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={items.length >= MAX_ITEMS}>
          <Plus size={14} className="mr-1" />Agregar
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            aria-label={`Impresión diagnóstica ${i + 1}`}
            placeholder="Ej: Mioma uterino"
            maxLength={MAX_LENGTH}
            value={item}
            onChange={(e) => update(i, e.target.value)}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label={`Quitar impresión ${i + 1}`}>
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ))}
      {!items.length && <p className="text-xs text-muted-foreground">Sin impresiones diagnósticas.</p>}
    </div>
  );
}
