import { useState } from "react";
import { Download, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Attachment } from "@/lib/files-api";
import { formatBytes } from "@/lib/attachment-rules";
import { useAttachmentObjectUrl } from "@/hooks/use-attachment-object-url";
import { useAttachmentActions } from "@/hooks/use-attachment-actions";
import { isNativeApp } from "@/lib/is-native-app";
import { ConfirmDeleteDialog } from "@/components/patients/ConfirmDeleteDialog";
import { AttachmentPreview } from "./AttachmentPreview";
import { RenameAttachmentDialog } from "./RenameAttachmentDialog";

interface Props {
  /** null = cerrado. */
  attachment: Attachment | null;
  onClose: () => void;
}

function ViewerBody({ attachment, onClose }: { attachment: Attachment; onClose: () => void }) {
  const { url, blob, isLoading, isError } = useAttachmentObjectUrl(attachment.id);
  const { rename, remove, openNative } = useAttachmentActions();
  const [renaming, setRenaming] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const actionClass = "h-11 flex-1 min-w-[8rem]";

  return (
    <>
      <DialogHeader className="pr-10">
        <DialogTitle className="break-all leading-snug">{attachment.fileName}</DialogTitle>
        <DialogDescription>{formatBytes(attachment.sizeBytes)}</DialogDescription>
      </DialogHeader>
      <AttachmentPreview attachment={attachment} url={url} isLoading={isLoading} isError={isError} />
      <div className="flex flex-wrap gap-2">
        {blob && isNativeApp() && (
          <Button type="button" variant="outline" className={actionClass} disabled={openNative.isPending}
            onClick={() => openNative.mutate({ blob, fileName: attachment.fileName })}>
            <ExternalLink />Abrir
          </Button>
        )}
        {url && !isNativeApp() && (
          <Button asChild variant="outline" className={actionClass}>
            <a href={url} download={attachment.fileName}><Download />Descargar</a>
          </Button>
        )}
        {url && !isNativeApp() && attachment.fileType === "PDF" && (
          <Button asChild variant="outline" className={actionClass}>
            <a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink />Abrir</a>
          </Button>
        )}
        <Button type="button" variant="outline" className={actionClass} onClick={() => setRenaming(true)}>
          <Pencil />Renombrar
        </Button>
        <Button type="button" variant="outline" className={`${actionClass} text-destructive`} onClick={() => setConfirmingDelete(true)}>
          <Trash2 />Eliminar
        </Button>
      </div>

      <RenameAttachmentDialog
        open={renaming}
        onOpenChange={setRenaming}
        currentName={attachment.fileName}
        saving={rename.isPending}
        onSave={(fileName) => rename.mutate({ id: attachment.id, fileName }, { onSuccess: () => setRenaming(false) })}
      />
      <ConfirmDeleteDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Eliminar archivo"
        description="El archivo se moverá a la papelera. Puedes restaurarlo desde Papelera › Archivos."
        loading={remove.isPending}
        onConfirm={() => remove.mutate(attachment.id, { onSuccess: () => { setConfirmingDelete(false); onClose(); } })}
      />
    </>
  );
}

/** Visor de un adjunto: imagen grande o PDF, con descargar / renombrar / eliminar. */
export function AttachmentViewerDialog({ attachment, onClose }: Props) {
  return (
    <Dialog open={!!attachment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        {attachment && <ViewerBody attachment={attachment} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
