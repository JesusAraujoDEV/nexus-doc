import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";

/** True dentro de la app de Android (Capacitor); false en el navegador. */
export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * En la app, el WebView no abre blobs ni PDFs: se guarda el archivo en caché y se abre
 * con el visor del teléfono (desde ahí se imprime o se comparte por WhatsApp).
 */
export async function openFileNative(blob: Blob, fileName: string): Promise<void> {
  const safeName = fileName.replace(/[\\/:*?"<>|]/g, "-");
  const { uri } = await Filesystem.writeFile({ path: safeName, data: await toBase64(blob), directory: Directory.Cache });
  await FileOpener.open({ filePath: uri, contentType: blob.type || "application/octet-stream" });
}

/** Nombre del archivo que manda el servidor en Content-Disposition. */
export function filenameFrom(header: string | null, fallback: string): string {
  return header?.match(/filename="?([^";]+)"?/)?.[1] ?? fallback;
}
