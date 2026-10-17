import { Attachment } from "@/lib/files-api";
import { formatBytes } from "@/lib/attachment-rules";
import { AttachmentThumbnail } from "./AttachmentThumbnail";

interface Props {
  attachments: Attachment[];
  onOpen: (attachment: Attachment) => void;
  /** Línea extra bajo el nombre (p. ej. fecha de la consulta en el perfil). */
  caption?: (attachment: Attachment) => string | null;
}

/** Grilla de adjuntos; tocar uno abre el visor. 2 columnas en teléfono. */
export function AttachmentGrid({ attachments, onOpen, caption }: Props) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {attachments.map((a) => (
        <li key={a.id}>
          <button
            type="button"
            onClick={() => onOpen(a)}
            className="w-full text-left rounded-lg border border-border p-2 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Abrir ${a.fileName}`}
          >
            <AttachmentThumbnail attachment={a} />
            <p className="mt-2 text-sm font-medium truncate">{a.fileName}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(a.sizeBytes)}</p>
            {caption?.(a) && <p className="text-xs text-muted-foreground truncate">{caption(a)}</p>}
          </button>
        </li>
      ))}
    </ul>
  );
}
