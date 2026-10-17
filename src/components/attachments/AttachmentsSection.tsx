import { useState } from "react";
import { Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecordAttachments } from "@/hooks/use-record-attachments";
import { useAttachmentUploads } from "@/hooks/use-attachment-uploads";
import { AttachmentPickButtons } from "./AttachmentPickButtons";
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
  const { data: attachments = [], isLoading, isError } = useRecordAttachments(recordId);
  const uploads = useAttachmentUploads(recordId);
  const [openId, setOpenId] = useState<string | null>(null);
  // Se busca por id en la lista viva para que el visor refleje un renombrado.
  const opened = attachments.find((a) => a.id === openId) ?? null;

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <SectionTitle />
      <AttachmentPickButtons onFiles={uploads.enqueue} />
      <p className="text-xs text-muted-foreground">Fotos JPG, PNG o WEBP hasta 15 MB · PDF, Word o Excel hasta 25 MB.</p>
      <AttachmentUploadList items={uploads.items} onDismiss={uploads.dismiss} onClearDone={uploads.clearDone} />
      {isLoading && <Loader2 className="animate-spin text-muted-foreground" size={20} aria-label="Cargando adjuntos" />}
      {isError && <p className="text-sm text-destructive">No se pudieron cargar los adjuntos.</p>}
      {!isLoading && !isError && attachments.length === 0 && (
        <p className="text-sm text-muted-foreground">Esta consulta no tiene adjuntos todavía.</p>
      )}
      {attachments.length > 0 && <AttachmentGrid attachments={attachments} onOpen={(a) => setOpenId(a.id)} />}
      <AttachmentViewerDialog attachment={opened} onClose={() => setOpenId(null)} />
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
