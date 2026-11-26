import { Loader2 } from "lucide-react";
import { ConsultationAttachmentsState } from "@/hooks/use-consultation-attachments";
import { AttachmentUploadList } from "./AttachmentUploadList";
import { AttachmentGrid } from "./AttachmentGrid";
import { AttachmentViewerDialog } from "./AttachmentViewerDialog";

interface Props {
  state: ConsultationAttachmentsState;
}

/** Galería y progreso de subida dentro de la tarjeta desplegada de una consulta. */
export function ConsultationAttachments({ state }: Props) {
  const { attachments, isLoading, isError, uploads, opened, openViewer, closeViewer } = state;
  const hasVisibleBody = attachments.length > 0 || uploads.items.length > 0 || isError;

  if (!hasVisibleBody && !isLoading) return null;

  if (!hasVisibleBody && isLoading) {
    return <Loader2 className="animate-spin text-muted-foreground" size={16} aria-label="Cargando adjuntos" />;
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {attachments.length > 0 ? `Adjuntos (${attachments.length})` : "Adjuntos"}
      </p>
      <AttachmentUploadList items={uploads.items} onDismiss={uploads.dismiss} onClearDone={uploads.clearDone} />
      {isError && <p className="text-xs text-destructive">No se pudieron cargar los adjuntos.</p>}
      {attachments.length > 0 && <AttachmentGrid attachments={attachments} onOpen={openViewer} />}
      <AttachmentViewerDialog attachment={opened} onClose={closeViewer} />
    </div>
  );
}
