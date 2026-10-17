import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAttachmentBlob } from "@/lib/files-api";

/**
 * Contenido de un adjunto como object URL usable en <img>/<iframe>/<a download>.
 * El blob vive en la caché de TanStack (miniatura y visor lo comparten); cada
 * consumidor crea su propia URL y la revoca al desmontar o al cambiar el blob.
 */
export function useAttachmentObjectUrl(id: string, enabled = true) {
  const query = useQuery({
    queryKey: ["attachment-content", id],
    queryFn: () => fetchAttachmentBlob(id),
    enabled,
    staleTime: Infinity,
    gcTime: 5 * 60_000,
  });
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!query.data) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(query.data);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [query.data]);

  return { url, isLoading: query.isLoading, isError: query.isError, error: query.error };
}
