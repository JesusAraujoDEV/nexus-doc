import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";

// Subcarpeta propia del caché: se vacía al abrir la app para no dejar archivos de pacientes.
const FOLDER = "abiertos";

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function safeName(fileName: string): string {
  // eslint-disable-next-line no-control-regex
  const clean = fileName.replace(/[\/:*?"<>|\x00-\x1f]/g, "-").trim();
  return clean && clean !== "." && clean !== ".." ? clean : "archivo";
}

/**
 * En la app, el WebView no abre blobs ni PDFs: se guarda el archivo en caché y se abre
 * con el visor del teléfono (desde ahí se imprime o se comparte por WhatsApp).
 */
export async function openFileNative(blob: Blob, fileName: string): Promise<void> {
  const data = await toBase64(blob);
  const { uri } = await Filesystem.writeFile({ path: `${FOLDER}/${safeName(fileName)}`, data, directory: Directory.Cache, recursive: true });
  try {
    // Sin tipo, el plugin lo deduce de la extensión (Word/Excel abren mejor así).
    await FileOpener.open({ filePath: uri, contentType: blob.type || undefined });
  } catch {
    throw new Error("No hay una app en este teléfono para abrir este archivo.");
  }
}

/** Borra los archivos abiertos en sesiones anteriores. */
export async function clearOpenedFiles(): Promise<void> {
  await Filesystem.rmdir({ path: FOLDER, directory: Directory.Cache, recursive: true }).catch(() => undefined);
}
