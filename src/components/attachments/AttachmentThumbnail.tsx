import { FileText, FileSpreadsheet, File as FileIcon, ImageOff, Loader2 } from "lucide-react";
import { Attachment } from "@/lib/files-api";
import { useAttachmentObjectUrl } from "@/hooks/use-attachment-object-url";

function DocumentIcon({ attachment }: { attachment: Attachment }) {
  const name = attachment.fileName.toLowerCase();
  if (attachment.fileType === "PDF") return <FileText size={36} className="text-destructive" aria-hidden />;
  if (name.endsWith(".xlsx")) return <FileSpreadsheet size={36} className="text-accent" aria-hidden />;
  return <FileIcon size={36} className="text-primary" aria-hidden />;
}

function ImageThumb({ attachment }: { attachment: Attachment }) {
  const { url, isLoading, isError } = useAttachmentObjectUrl(attachment.id);
  if (isError) return <ImageOff size={28} className="text-muted-foreground" aria-hidden />;
  if (isLoading || !url) return <Loader2 size={20} className="animate-spin text-muted-foreground" aria-hidden />;
  return <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />;
}

/** Miniatura cuadrada: la imagen real para fotos, ícono para PDF/otros. */
export function AttachmentThumbnail({ attachment }: { attachment: Attachment }) {
  return (
    <div className="aspect-square w-full bg-muted flex items-center justify-center overflow-hidden rounded-md">
      {attachment.fileType === "IMAGE" ? <ImageThumb attachment={attachment} /> : <DocumentIcon attachment={attachment} />}
    </div>
  );
}
