import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  saving: boolean;
  onSave: (fileName: string) => void;
}

export function RenameAttachmentDialog({ open, onOpenChange, currentName, saving, onSave }: Props) {
  const [name, setName] = useState(currentName);

  // Se reinicia cada vez que se abre, no en cada render.
  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const trimmed = name.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renombrar archivo</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (trimmed) onSave(trimmed);
          }}
        >
          <div>
            <Label htmlFor="rename-attachment">Nombre</Label>
            <Input id="rename-attachment" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="h-11" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="h-11" disabled={!trimmed || trimmed === currentName || saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
