import { getToken, ApiError } from "@/lib/api";

const FALLBACK_NAME = "documento.pdf";

/** Saca el nombre de `Content-Disposition: inline; filename="recipe-x-2026-11-20.pdf"`. */
export function filenameFromDisposition(header: string | null): string {
  return /filename="([^"]+)"/.exec(header ?? "")?.[1] ?? FALLBACK_NAME;
}

/**
 * Abre un PDF protegido en pestaña nueva, con su nombre real.
 * Una URL blob: no lleva nombre (el visor guardaría "3f9c…-uuid.pdf"), así que la pestaña
 * muestra el PDF en un iframe bajo un título con el nombre y un botón "Descargar" que lo usa.
 * La pestaña se abre ANTES del fetch porque los navegadores bloquean window.open() tras un await.
 */
export async function openPdfInTab(url: string): Promise<void> {
  const tab = window.open("", "_blank");
  const token = getToken();
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) {
    tab?.close();
    throw new ApiError(res.status, `No se pudo generar el PDF (${res.status})`);
  }
  const name = filenameFromDisposition(res.headers.get("Content-Disposition"));
  const file = URL.createObjectURL(await res.blob());
  if (!tab) return;
  // ponytail: `name` viene del servidor ya saneado ([a-z0-9-].pdf); no hace falta escapar HTML.
  tab.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${name}</title>
<style>html,body{margin:0;height:100%;font-family:system-ui,sans-serif}body{display:flex;flex-direction:column}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;background:#0b4f9c;color:#fff;font-size:14px}
a{color:#0b4f9c;background:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:600}
iframe{flex:1;border:0;width:100%}</style></head>
<body><header><span>${name}</span><a href="${file}" download="${name}">Descargar</a></header>
<iframe src="${file}" title="${name}"></iframe></body></html>`);
  tab.document.close();
}
