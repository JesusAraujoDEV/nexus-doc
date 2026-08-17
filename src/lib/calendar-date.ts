/**
 * Fechas "solo día" (DATEONLY del backend, ej. "2026-08-17") deben parsearse
 * componente a componente. `new Date("2026-08-17")` la interpreta como
 * medianoche UTC, y en zonas horarias negativas eso cae en el día anterior
 * al mostrarla en hora local — el mismo bug que motivó el patrón
 * COALESCE(visit_date, created_at::date) en el backend. Mismo criterio que
 * ConsultationCard.tsx ya usa para fechas de consulta.
 */
export function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Inverso de parseDateOnly: Date local -> "YYYY-MM-DD", sin pasar por UTC. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
