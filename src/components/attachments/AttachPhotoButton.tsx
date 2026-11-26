import { useState } from "react";
import { Camera } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ATTACHMENT_LIMITS_HINT } from "@/lib/attachment-rules";
import { AttachmentPickButtons } from "./AttachmentPickButtons";

interface Props {
  onFiles: (files: File[]) => void;
}

/** Botón "Adjuntar foto" para la fila de acciones: abre cámara o selector de archivos. */
export function AttachPhotoButton({ onFiles }: Props) {
  const [open, setOpen] = useState(false);

  function handleFiles(files: File[]) {
    setOpen(false);
    onFiles(files);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 min-h-11 md:min-h-0 text-sm md:text-xs text-primary hover:text-primary/80 transition-colors"
      >
        <Camera size={12} aria-hidden />Adjuntar foto
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pr-10">
            <DialogTitle>Adjuntar a la consulta</DialogTitle>
            <DialogDescription>{ATTACHMENT_LIMITS_HINT}</DialogDescription>
          </DialogHeader>
          <AttachmentPickButtons onFiles={handleFiles} />
        </DialogContent>
      </Dialog>
    </>
  );
}
