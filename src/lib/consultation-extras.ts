import { MedicalCertificate } from "@/lib/clinical-records-api";

/**
 * Mapeos de los campos migrados del legacy en la consulta (impresiones
 * diagnósticas y constancia) entre la API y el formulario, y su resumen para
 * la tarjeta. Centralizado para que create/update/tarjeta no repitan reglas.
 */

export interface MedicalCertificateForm {
  diagnostico: string;
  motivo: string;
  reposo: boolean;
  /** String porque viene de un input; se convierte a entero al enviar. */
  diasReposo: string;
}

export const EMPTY_CERTIFICATE: MedicalCertificateForm = { diagnostico: "", motivo: "", reposo: false, diasReposo: "" };

export function certificateToForm(c: MedicalCertificate | null | undefined): MedicalCertificateForm {
  if (!c) return { ...EMPTY_CERTIFICATE };
  return {
    diagnostico: c.diagnostico || "",
    motivo: c.motivo || "",
    reposo: !!c.reposo,
    diasReposo: c.diasReposo != null ? String(c.diasReposo) : "",
  };
}

function parseDias(f: MedicalCertificateForm): number | null {
  if (!f.reposo || !f.diasReposo.trim()) return null;
  const n = Math.trunc(Number(f.diasReposo));
  return Number.isNaN(n) ? null : n;
}

/** Null si la constancia quedó vacía (sin textos y sin reposo). */
export function certificateFromForm(f: MedicalCertificateForm): MedicalCertificate | null {
  const diagnostico = f.diagnostico.trim();
  const motivo = f.motivo.trim();
  if (!diagnostico && !motivo && !f.reposo) return null;
  return {
    diagnostico: diagnostico || undefined,
    motivo: motivo || undefined,
    reposo: f.reposo,
    diasReposo: parseDias(f),
  };
}

/** Quita items vacíos; null si no queda ninguno. */
export function cleanImpressions(list: string[]): string[] | null {
  const items = list.map((s) => s.trim()).filter(Boolean);
  return items.length ? items : null;
}

function reposoLabel(c: MedicalCertificate): string | null {
  if (!c.reposo) return null;
  if (!c.diasReposo) return "Reposo";
  return `Reposo ${c.diasReposo} ${c.diasReposo === 1 ? "día" : "días"}`;
}

/** "Constancia: <diagnóstico — motivo> · Reposo N días", o null si no hay nada que mostrar. */
export function certificateSummary(c: MedicalCertificate | null | undefined): string | null {
  if (!c) return null;
  const text = [c.diagnostico?.trim(), c.motivo?.trim()].filter(Boolean).join(" — ");
  const parts = [text, reposoLabel(c)].filter(Boolean);
  if (!parts.length) return null;
  return `Constancia: ${parts.join(" · ")}`;
}
