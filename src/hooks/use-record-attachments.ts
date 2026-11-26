import { useQuery } from "@tanstack/react-query";
import { fetchRecordAttachments } from "@/lib/files-api";

/** Adjuntos de una consulta. Clave bajo ["attachments"] para invalidar todo junto. */
export function useRecordAttachments(recordId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["attachments", "record", recordId],
    queryFn: () => fetchRecordAttachments(recordId as string),
    enabled: !!recordId && enabled,
  });
}
