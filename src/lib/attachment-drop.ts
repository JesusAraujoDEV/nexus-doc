import { validateAttachment } from "@/lib/attachment-rules";

export interface TransferItemLike {
  kind: string;
  getAsFile: () => File | null;
}

export interface FileTransferLike {
  files?: ArrayLike<File> | null;
  items?: ArrayLike<TransferItemLike> | null;
  types?: ArrayLike<string> | null;
}

export interface RejectedAttachment {
  file: File;
  reason: string;
}

export interface PartitionedAttachments {
  accepted: File[];
  rejected: RejectedAttachment[];
}

const GENERIC_IMAGE_NAMES = new Set([
  "",
  "blob",
  "image",
  "image.png",
  "image.jpg",
  "image.jpeg",
  "image.webp",
]);

const IMAGE_MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const MAX_REJECTED_SHOWN = 3;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatCaptureStamp(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${year}-${month}-${day}-${hours}${minutes}`;
}

function imageExtensionFor(file: File): string | null {
  if (IMAGE_MIME_EXT[file.type]) return IMAGE_MIME_EXT[file.type];
  const lower = file.name.trim().toLowerCase();
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  if (lower.endsWith(".webp")) return "webp";
  return null;
}

/** Indica si un DataTransfer trae archivos (incluso durante dragenter/dragover). */
export function hasTransferFiles(transfer: FileTransferLike | null | undefined): boolean {
  if (!transfer) return false;
  if (transfer.files && transfer.files.length > 0) return true;
  if (transfer.items && Array.from(transfer.items).some((item) => item.kind === "file")) return true;
  if (transfer.types && Array.from(transfer.types).includes("Files")) return true;
  return false;
}

/** Extrae archivos de un DataTransfer de arrastre o portapapeles sin duplicarlos. */
export function extractTransferFiles(transfer: FileTransferLike | null | undefined): File[] {
  if (!transfer) return [];
  if (transfer.files && transfer.files.length > 0) return Array.from(transfer.files);
  if (!transfer.items) return [];

  const extracted: File[] = [];
  for (const item of Array.from(transfer.items)) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (file) extracted.push(file);
  }
  return extracted;
}

/** Renombra imágenes pegadas genéricas (ej. image.png) a captura-YYYY-MM-DD-HHmm.ext. */
export function renamePastedImage(file: File, now = new Date(), index = 1): File {
  const normalized = file.name.trim().toLowerCase();
  if (!GENERIC_IMAGE_NAMES.has(normalized)) return file;

  const ext = imageExtensionFor(file);
  if (!ext) return file;

  const suffix = index > 1 ? `-${index}` : "";
  const nextName = `captura-${formatCaptureStamp(now)}${suffix}.${ext}`;
  return new File([file], nextName, { type: file.type, lastModified: file.lastModified });
}

/** Aplica renombrado de capturas a un lote pegado evitando colisiones de nombre. */
export function normalizePastedFiles(files: File[], now = new Date()): File[] {
  let captureCount = 0;
  return files.map((file) => {
    const normalized = file.name.trim().toLowerCase();
    if (!GENERIC_IMAGE_NAMES.has(normalized) || !imageExtensionFor(file)) return file;
    captureCount += 1;
    return renamePastedImage(file, now, captureCount);
  });
}

/** Separa archivos permitidos de los rechazados usando las reglas del cliente. */
export function partitionAttachmentFiles(files: File[]): PartitionedAttachments {
  const accepted: File[] = [];
  const rejected: RejectedAttachment[] = [];

  for (const file of files) {
    const reason = validateAttachment(file);
    if (reason) {
      rejected.push({ file, reason });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}

/** Arma un mensaje claro en español para notificar archivos ignorados en un toast. */
export function formatRejectedToast(rejected: RejectedAttachment[]): { title: string; description: string } {
  if (rejected.length === 1) {
    const { file, reason } = rejected[0];
    return {
      title: "No se pudo adjuntar",
      description: `${file.name || "Archivo sin nombre"}: ${reason}`,
    };
  }

  const shown = rejected
    .slice(0, MAX_REJECTED_SHOWN)
    .map(({ file, reason }) => `${file.name || "Archivo sin nombre"}: ${reason}`);
  const remaining = rejected.length - shown.length;
  const suffix = remaining > 0 ? ` (y ${remaining} más)` : "";

  return {
    title: `No se pudieron adjuntar ${rejected.length} archivos`,
    description: `${shown.join(" · ")}${suffix}`,
  };
}

/** True cuando el foco está en un campo donde el usuario escribe o edita texto. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (EDITABLE_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return target.closest('[contenteditable="true"], [contenteditable=""]') !== null;
}

/** Suscribe el pegado global de archivos en la página sin interferir con inputs de texto. */
export function subscribePagePaste(onFiles: (files: File[]) => void): () => void {
  function handlePaste(event: ClipboardEvent) {
    if (isEditableTarget(event.target)) return;
    const files = extractTransferFiles(event.clipboardData);
    if (!files.length) return;
    event.preventDefault();
    onFiles(files);
  }

  window.addEventListener("paste", handlePaste);
  return () => window.removeEventListener("paste", handlePaste);
}
