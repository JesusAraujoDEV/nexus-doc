import { apiFetch } from "@/lib/api";
import { filenameFrom, isNativeApp, openFileNative } from "@/lib/native-file";

/** Agrega el token corto `access` a la URL del PDF. */
export function withPdfAccess(url: string, token: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}access=${encodeURIComponent(token)}`;
}

/**
 * Abre un PDF protegido directo desde el servidor en pestaña nueva, así el navegador
 * usa el nombre que manda el servidor (recipe-paciente-fecha.pdf) al guardarlo.
 * La URL lleva un token de 2 minutos que solo sirve para PDFs.
 * La pestaña se abre ANTES del fetch porque los navegadores bloquean window.open() tras un await.
 */
export async function openPdfInTab(url: string): Promise<void> {
  if (isNativeApp()) return openPdfNative(url);
  const tab = window.open("", "_blank");
  try {
    const { token } = await apiFetch<{ token: string }>("/auth/pdf-token", { method: "POST" });
    if (tab) tab.location.href = withPdfAccess(url, token);
  } catch (error) {
    tab?.close();
    throw error;
  }
}

/** En la app de Android: descarga el PDF y lo abre con el visor del teléfono. */
async function openPdfNative(url: string): Promise<void> {
  const { token } = await apiFetch<{ token: string }>("/auth/pdf-token", { method: "POST" });
  const res = await fetch(withPdfAccess(url, token));
  if (!res.ok) throw new Error("No se pudo generar el PDF");
  await openFileNative(await res.blob(), filenameFrom(res.headers.get("Content-Disposition"), "documento.pdf"));
}
