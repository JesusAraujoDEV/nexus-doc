import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { renameAttachment, deleteAttachment, restoreAttachment } from "@/lib/files-api";

/**
 * Renombrar / eliminar (a papelera) / restaurar un adjunto. Todas invalidan el
 * prefijo ["attachments"]: lista de la consulta, de la paciente y papelera.
 */
export function useAttachmentActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["attachments"] });
  const onError = (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" });

  const rename = useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName: string }) => renameAttachment(id, fileName),
    onSuccess: () => {
      invalidate();
      toast({ title: "Nombre actualizado" });
    },
    onError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAttachment(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Archivo enviado a la papelera" });
    },
    onError,
  });

  const restore = useMutation({
    mutationFn: (id: string) => restoreAttachment(id),
    onSuccess: () => {
      invalidate();
      toast({ title: "Archivo restaurado" });
    },
    onError,
  });

  return { rename, remove, restore };
}
