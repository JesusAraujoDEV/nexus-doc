import { CheckCircle2, Loader2, X, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/attachment-rules";
import { UploadItem } from "@/hooks/use-attachment-uploads";

interface Props {
  items: UploadItem[];
  onDismiss: (key: string) => void;
  onClearDone: () => void;
}

function StatusIcon({ status }: { status: UploadItem["status"] }) {
  if (status === "done") return <CheckCircle2 size={18} className="text-accent shrink-0" aria-hidden />;
  if (status === "error") return <AlertCircle size={18} className="text-destructive shrink-0" aria-hidden />;
  if (status === "uploading") return <Loader2 size={18} className="animate-spin text-primary shrink-0" aria-hidden />;
  return <Clock size={18} className="text-muted-foreground shrink-0" aria-hidden />;
}

const STATUS_LABEL: Record<UploadItem["status"], string> = {
  pending: "En espera",
  uploading: "Subiendo",
  done: "Subido",
  error: "No se subió",
};

/** Estado por archivo de la cola de subida. */
export function AttachmentUploadList({ items, onDismiss, onClearDone }: Props) {
  if (!items.length) return null;
  const hasDone = items.some((i) => i.status === "done");

  return (
    <div className="space-y-2" aria-live="polite">
      {items.map((i) => (
        <div key={i.key} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <StatusIcon status={i.status} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{i.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {STATUS_LABEL[i.status]}{i.status === "uploading" ? ` · ${i.progress}%` : ""} · {formatBytes(i.sizeBytes)}
              </p>
            </div>
            {i.status !== "uploading" && i.status !== "pending" && (
              <button
                type="button"
                onClick={() => onDismiss(i.key)}
                className="h-11 w-11 flex items-center justify-center rounded-lg hover:bg-muted shrink-0"
                aria-label={`Quitar ${i.fileName} de la lista`}
              >
                <X size={18} />
              </button>
            )}
          </div>
          {i.status === "uploading" && <Progress value={i.progress} className="h-2" />}
          {i.error && <p className="text-sm text-destructive">{i.error}</p>}
        </div>
      ))}
      {hasDone && (
        <button type="button" onClick={onClearDone} className="text-sm text-muted-foreground underline min-h-11 px-1">
          Limpiar subidos
        </button>
      )}
    </div>
  );
}
