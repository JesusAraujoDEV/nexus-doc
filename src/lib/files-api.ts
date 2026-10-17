import { apiFetch, API_URL, getToken, ApiError, errorMessageFrom, handleUnauthorized } from "@/lib/api";

export type AttachmentFileType = "IMAGE" | "PDF" | "OTHER";

/** Adjunto de una consulta (foto, PDF, Word, Excel). */
export interface Attachment {
  id: string;
  patientId: string;
  clinicalRecordId: string;
  doctorId: string;
  fileName: string;
  fileType: AttachmentFileType;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export function fetchRecordAttachments(recordId: string) {
  return apiFetch<Attachment[]>(`/files/record/${recordId}`);
}

export function fetchPatientAttachments(patientId: string) {
  return apiFetch<Attachment[]>(`/files/patient/${patientId}`);
}

export function renameAttachment(id: string, fileName: string) {
  return apiFetch<Attachment>(`/files/${id}`, { method: "PATCH", body: JSON.stringify({ fileName }) });
}

export function deleteAttachment(id: string) {
  return apiFetch<unknown>(`/files/${id}`, { method: "DELETE" });
}

export function fetchAttachmentsTrash() {
  return apiFetch<Attachment[]>("/files/trash");
}

export function restoreAttachment(id: string) {
  return apiFetch<Attachment>(`/files/${id}/restore`, { method: "POST" });
}

/**
 * El contenido exige el header Authorization, así que no sirve como <img src>:
 * se pide como blob y el componente lo convierte en object URL.
 */
export async function fetchAttachmentBlob(id: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(`${API_URL}/files/${id}/content`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new ApiError(res.status, `No se pudo abrir el archivo (${res.status})`);
  return res.blob();
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function uploadError(xhr: XMLHttpRequest): ApiError {
  const message = errorMessageFrom(parseJson(xhr.responseText), xhr.status);
  // Un 413 del proxy (nginx) llega con HTML, sin `message`.
  if (xhr.status === 413 && message === "Error 413") return new ApiError(413, "El archivo es demasiado grande para subirlo.");
  return new ApiError(xhr.status, message);
}

/**
 * Sube UN archivo. Usa XMLHttpRequest (no fetch) porque fetch no reporta
 * progreso de subida; en el teléfono con datos móviles una foto tarda.
 */
export function uploadAttachment(recordId: string, file: File, onProgress: (pct: number) => void): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/files/record/${recordId}`);
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new ApiError(0, "Sin conexión. Revisa tu internet e intenta de nuevo."));
    xhr.onload = () => {
      if (xhr.status === 401) {
        try { handleUnauthorized(); } catch (e) { reject(e); }
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300) return reject(uploadError(xhr));
      resolve(parseJson(xhr.responseText) as Attachment);
    };
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}
