import { Loader2, FileText } from "lucide-react";
import { Attachment } from "@/lib/files-api";

interface Props {
  attachment: Attachment;
  url: string | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Vista grande del adjunto. El PDF va en <iframe>: en escritorio y iOS se ve;
 * Android Chrome no renderiza PDF embebido, por eso el visor ofrece "Abrir".
 */
export function AttachmentPreview({ attachment, url, isLoading, isError }: Props) {
  if (isError) return <p className="text-sm text-destructive py-8 text-center">No se pudo cargar el archivo.</p>;
  if (isLoading || !url) {
    return (
      <div className="py-16 flex justify-center text-muted-foreground">
        <Loader2 size={24} className="animate-spin" aria-label="Cargando archivo" />
      </div>
    );
  }
  if (attachment.fileType === "IMAGE") {
    return <img src={url} alt={attachment.fileName} className="w-full max-h-[65dvh] object-contain rounded-md bg-muted" />;
  }
  if (attachment.fileType === "PDF") {
    return <iframe src={url} title={attachment.fileName} className="w-full h-[65dvh] rounded-md border border-border bg-muted" />;
  }
  return (
    <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground">
      <FileText size={48} aria-hidden />
      <p className="text-sm text-center">Este tipo de archivo no se puede ver aquí. Descárgalo para abrirlo.</p>
    </div>
  );
}
