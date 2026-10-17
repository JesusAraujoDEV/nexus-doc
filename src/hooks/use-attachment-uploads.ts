import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadAttachment } from "@/lib/files-api";
import { validateAttachment } from "@/lib/attachment-rules";

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadItem {
  key: string;
  fileName: string;
  sizeBytes: number;
  status: UploadStatus;
  progress: number;
  error?: string;
}

/**
 * Cola de subida de una consulta: un archivo por request, en secuencia, con
 * estado y progreso por archivo. Los que no pasan la validación local quedan
 * en "error" sin llegar al servidor.
 */
export function useAttachmentUploads(recordId: string) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const queryClient = useQueryClient();
  const chain = useRef<Promise<void>>(Promise.resolve());
  const counter = useRef(0);

  const update = useCallback((key: string, patch: Partial<UploadItem>) => {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }, []);

  const uploadOne = useCallback(async (key: string, file: File) => {
    update(key, { status: "uploading" });
    try {
      await uploadAttachment(recordId, file, (progress) => update(key, { progress }));
      update(key, { status: "done", progress: 100 });
      await queryClient.invalidateQueries({ queryKey: ["attachments"] });
    } catch (e) {
      update(key, { status: "error", error: e instanceof Error ? e.message : "No se pudo subir el archivo" });
    }
  }, [recordId, queryClient, update]);

  const enqueue = useCallback((files: File[]) => {
    const batch = files.map((file) => {
      counter.current += 1;
      const error = validateAttachment(file) ?? undefined;
      const item: UploadItem = { key: `${Date.now()}-${counter.current}`, fileName: file.name, sizeBytes: file.size, status: error ? "error" : "pending", progress: 0, error };
      return { item, file };
    });
    setItems((list) => [...list, ...batch.map((b) => b.item)]);
    const valid = batch.filter((b) => b.item.status === "pending");
    chain.current = chain.current.then(async () => {
      for (const { item, file } of valid) await uploadOne(item.key, file);
    });
  }, [uploadOne]);

  const dismiss = useCallback((key: string) => setItems((list) => list.filter((i) => i.key !== key)), []);
  const clearDone = useCallback(() => setItems((list) => list.filter((i) => i.status !== "done")), []);

  return { items, enqueue, dismiss, clearDone };
}
