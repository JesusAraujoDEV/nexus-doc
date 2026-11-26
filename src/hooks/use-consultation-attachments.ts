import { useState } from "react";
import { Attachment } from "@/lib/files-api";
import { useRecordAttachments } from "@/hooks/use-record-attachments";
import { useAttachmentUploads } from "@/hooks/use-attachment-uploads";

/** Estado compartido de adjuntos de una consulta: listado, subidas y visor vivo. */
export function useConsultationAttachments(recordId: string, enabled = true) {
  const { data: attachments = [], isLoading, isError } = useRecordAttachments(recordId, enabled);
  const uploads = useAttachmentUploads(recordId);
  const [openId, setOpenId] = useState<string | null>(null);
  // Se busca por id en la lista viva para que el visor refleje un renombrado.
  const opened = attachments.find((a) => a.id === openId) ?? null;

  return {
    attachments,
    isLoading,
    isError,
    uploads,
    opened,
    openViewer: (attachment: Attachment) => setOpenId(attachment.id),
    closeViewer: () => setOpenId(null),
  };
}

export type ConsultationAttachmentsState = ReturnType<typeof useConsultationAttachments>;
