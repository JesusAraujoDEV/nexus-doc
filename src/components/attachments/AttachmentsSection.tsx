import { Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTACHMENT_LIMITS_HINT } from "@/lib/attachment-rules";
import { useConsultationAttachments } from "@/hooks/use-consultation-attachments";
import { AttachmentPickButtons } from "./AttachmentPickButtons";
import { AttachmentDropZone } from "./AttachmentDropZone";
import { AttachmentUploadList } from "./AttachmentUploadList";
import { AttachmentGrid } from "./AttachmentGrid";
import { AttachmentViewerDialog } from "./AttachmentViewerDialog";

interface Props {
  /** Solo existe en edición: los adjuntos se atan a una consulta ya guardada. */
  recordId?: string;
  /** Consulta nueva: guarda y vuelve a abrirla en esta sección para adjuntar. */
  onSaveFirst?: () => void;
  saving?: boolean;
}

function SectionTitle() {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Paperclip size={16} className="text-primary" aria-hidden />Adjuntos
    </p>
  );
}

function RecordAttachments({ recordId }: { recordId: string }) {
  const { attachments, isLoading, isError, uploads, opened, openViewer, closeViewer } = useConsultationAttachments(recordId);

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <SectionTitle />
      <AttachmentPickButtons onFiles={uploads.enqueue} />
      <AttachmentDropZone onFiles={uploads.enqueue} listenPagePaste />
      <p className="text-xs text-muted-foreground">{ATTACHMENT_LIMITS_HINT}</p>
      <AttachmentUploadList items={uploads.items} onDismiss={uploads.dismiss} onClearDone={uploads.clearDone} />
      {isLoading && <Loader2 className="animate-spin text-muted-foreground" size={20} aria-label="Cargando adjuntos" />}
      {isError && <p className="text-sm text-destructive">No se pudieron cargar los adjuntos.</p>}
      {!isLoading && !isError && attachments.length === 0 && (
        <p className="text-sm text-muted-foreground">Esta consulta no tiene adjuntos todavía.</p>
      )}
      {attachments.length > 0 && <AttachmentGrid attachments={attachments} onOpen={openViewer} />}
      <AttachmentViewerDialog attachment={opened} onClose={closeViewer} />
    </div>
  );
}

/** Sección "Adjuntos" de la consulta. En una consulta nueva avisa que primero hay que guardar. */
export function AttachmentsSection({ recordId, onSaveFirst, saving }: Props) {
  if (recordId) return <RecordAttachments recordId={recordId} />;
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <SectionTitle />
      <p className="text-sm text-muted-foreground">
        Para tomar fotos o subir archivos, primero hay que guardar la consulta.
      </p>
      {onSaveFirst && (
        <Button type="button" className="h-12 w-full sm:w-auto text-base" onClick={onSaveFirst} disabled={saving}>
          {saving ? "Guardando..." : "Guardar consulta y adjuntar"}
        </Button>
      )}
    </div>
  );
}
