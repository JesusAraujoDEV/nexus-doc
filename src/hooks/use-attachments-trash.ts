import { useQuery } from "@tanstack/react-query";
import { fetchAttachmentsTrash } from "@/lib/files-api";

export function useAttachmentsTrash() {
  return useQuery({ queryKey: ["attachments", "trash"], queryFn: fetchAttachmentsTrash });
}
