import { useEffect, useRef } from "react";
import { subscribePagePaste } from "@/lib/attachment-drop";

/** Escucha Ctrl+V en toda la página cuando `enabled` es true (ignora campos de texto). */
export function usePagePaste(enabled: boolean, onFiles: (files: File[]) => void): void {
  const onFilesRef = useRef(onFiles);
  onFilesRef.current = onFiles;

  useEffect(() => {
    if (!enabled) return;
    return subscribePagePaste((files) => onFilesRef.current(files));
  }, [enabled]);
}
