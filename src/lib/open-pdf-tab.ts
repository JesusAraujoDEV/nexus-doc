import { apiFetch } from "@/lib/api";

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
  const tab = window.open("", "_blank");
  try {
    const { token } = await apiFetch<{ token: string }>("/auth/pdf-token", { method: "POST" });
    if (tab) tab.location.href = withPdfAccess(url, token);
  } catch (error) {
    tab?.close();
    throw error;
  }
}
