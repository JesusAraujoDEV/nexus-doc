import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AntecedentePersonal } from "@/lib/medical-background";

interface Props {
  items: AntecedentePersonal[];
  onChange: (items: AntecedentePersonal[]) => void;
}

/** Lista editable de antecedentes personales: código CIE-9 opcional + título. */
export function AntecedentesPersonalesEditor({ items, onChange }: Props) {
  const update = (i: number, item: AntecedentePersonal) => onChange(items.map((it, idx) => (idx === i ? item : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { cie9: null, titulo: "" }]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Antecedentes personales</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus size={14} className="mr-1" />Agregar
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            aria-label={`CIE-9 del antecedente ${i + 1}`}
            placeholder="CIE-9"
            className="w-24 shrink-0"
            value={item.cie9 || ""}
            onChange={(e) => update(i, { ...item, cie9: e.target.value || null })}
          />
          <Input
            aria-label={`Antecedente ${i + 1}`}
            placeholder="Ej: Hipertensión arterial"
            value={item.titulo}
            onChange={(e) => update(i, { ...item, titulo: e.target.value })}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label={`Quitar antecedente ${i + 1}`}>
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ))}
      {!items.length && <p className="text-xs text-muted-foreground">Sin antecedentes personales.</p>}
    </div>
  );
}
