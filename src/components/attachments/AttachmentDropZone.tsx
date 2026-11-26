import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { usePagePaste } from "@/hooks/use-page-paste";
import {
  extractTransferFiles,
  formatRejectedToast,
  hasTransferFiles,
  normalizePastedFiles,
  partitionAttachmentFiles,
} from "@/lib/attachment-drop";

interface Props {
  onFiles: (files: File[]) => void;
  /** Escucha Ctrl+V en toda la página (para pantallas con una sola consulta). */
  listenPagePaste?: boolean;
  className?: string;
}

/** Recuadro para arrastrar archivos o pegar capturas con Ctrl+V. */
export function AttachmentDropZone({ onFiles, listenPagePaste = false, className }: Props) {
  const { toast } = useToast();
  const isTouch = useCoarsePointer();
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);

  function enqueueValid(files: File[]) {
    if (!files.length) return;
    const { accepted, rejected } = partitionAttachmentFiles(files);

    if (rejected.length > 0) {
      const notice = formatRejectedToast(rejected);
      toast({ title: notice.title, description: notice.description, variant: "destructive" });
    }
    if (accepted.length > 0) onFiles(accepted);
  }

  usePagePaste(listenPagePaste && !isTouch, (files) => enqueueValid(normalizePastedFiles(files)));

  // En pantallas táctiles no existe arrastrar con mouse; alcanzan los botones existentes.
  if (isTouch) return null;

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    if (!hasTransferFiles(e.dataTransfer)) return;
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (!hasTransferFiles(e.dataTransfer)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave() {
    if (dragDepth.current === 0) return;
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    enqueueValid(extractTransferFiles(e.dataTransfer));
  }

  function handleLocalPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const files = extractTransferFiles(e.clipboardData);
    if (!files.length) return;
    e.preventDefault();
    enqueueValid(normalizePastedFiles(files));
  }

  return (
    <div
      role="region"
      tabIndex={0}
      aria-label="Zona para arrastrar o pegar fotos y archivos"
      onClick={(e) => e.currentTarget.focus()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={listenPagePaste ? undefined : handleLocalPaste}
      className={cn(
        "rounded-xl border-2 border-dashed p-5 text-center transition-colors cursor-pointer select-none",
        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-primary-light/30",
        isDragging
          ? "border-primary bg-primary-light/60 ring-2 ring-primary/30"
          : "border-border bg-muted/30 hover:border-primary/60 hover:bg-primary-light/20",
        className,
      )}
    >
      <div className="pointer-events-none flex flex-col items-center gap-1.5">
        <Upload size={22} className="text-primary" aria-hidden />
        <p className="text-base font-medium text-foreground">
          {isDragging ? "Soltá para adjuntar" : "Arrastrá fotos aquí o pegalas con Ctrl+V"}
        </p>
        <p className="text-xs text-muted-foreground">
          {isDragging ? "Se subirán a esta consulta" : "JPG, PNG, WEBP, PDF, Word o Excel"}
        </p>
      </div>
    </div>
  );
}
