import { Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAttachmentsTrash } from "@/hooks/use-attachments-trash";
import { useAttachmentActions } from "@/hooks/use-attachment-actions";
import { formatBytes } from "@/lib/attachment-rules";
import { formatApiDate } from "@/lib/calendar-date";

/** Pestaña "Archivos" de la papelera: adjuntos borrados, con restaurar. */
export function AttachmentsTrash() {
  const { data = [], isLoading, isError } = useAttachmentsTrash();
  const { restore } = useAttachmentActions();

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-8" />;
  if (isError) return <p className="text-sm text-destructive text-center py-8">No se pudo cargar la papelera de archivos.</p>;
  if (!data.length) return <p className="text-sm text-muted-foreground text-center py-8">La papelera de archivos está vacía.</p>;

  return (
    <div className="space-y-2">
      {data.map((a) => (
        <div key={a.id} className="medical-card flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{a.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(a.sizeBytes)} · Subido el {formatApiDate(a.createdAt)}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={() => restore.mutate(a.id)}
            disabled={restore.isPending}
          >
            <Undo2 size={14} className="mr-1" />Restaurar
          </Button>
        </div>
      ))}
    </div>
  );
}
