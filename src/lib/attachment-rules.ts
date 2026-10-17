/**
 * Reglas de adjuntos del lado cliente. Son solo feedback rápido antes de subir:
 * el backend es quien decide (415 / 413) y su mensaje se muestra tal cual.
 */
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const DOCUMENT_EXTENSIONS = ["pdf", "docx", "xlsx"];
const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"];

const MB = 1024 * 1024;
export const MAX_IMAGE_BYTES = 15 * MB;
export const MAX_DOCUMENT_BYTES = 25 * MB;

/** Valor de `accept` para "Subir archivo". */
export const ATTACHMENT_ACCEPT = [
  ...IMAGE_EXTENSIONS.map((e) => `.${e}`),
  ...DOCUMENT_EXTENSIONS.map((e) => `.${e}`),
  ...IMAGE_MIME,
  "application/pdf",
].join(",");

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

function isImage(file: File): boolean {
  return IMAGE_MIME.includes(file.type) || IMAGE_EXTENSIONS.includes(extensionOf(file.name));
}

function isAllowedDocument(file: File): boolean {
  return DOCUMENT_EXTENSIONS.includes(extensionOf(file.name)) || file.type === "application/pdf";
}

/** Devuelve el motivo del rechazo, o null si el archivo se puede intentar subir. */
export function validateAttachment(file: File): string | null {
  if (isImage(file)) {
    return file.size > MAX_IMAGE_BYTES ? `La imagen pesa ${formatBytes(file.size)}; el máximo es 15 MB.` : null;
  }
  if (isAllowedDocument(file)) {
    return file.size > MAX_DOCUMENT_BYTES ? `El documento pesa ${formatBytes(file.size)}; el máximo es 25 MB.` : null;
  }
  return "Tipo de archivo no permitido. Usa JPG, PNG, WEBP, PDF, Word (.docx) o Excel (.xlsx).";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}
