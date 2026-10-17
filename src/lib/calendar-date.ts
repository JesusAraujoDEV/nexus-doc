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

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Helper único para fechas que vienen de la API: "YYYY-MM-DD" se toma como día
 * local (ver parseDateOnly); un timestamp completo se respeta tal cual.
 */
export function parseApiDate(value: string): Date {
  return DATE_ONLY.test(value) ? parseDateOnly(value) : new Date(value);
}

/** Formatea una fecha de la API en es-VE sin el corrimiento UTC de las fechas solo-día. */
export function formatApiDate(value: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" }): string {
  return parseApiDate(value).toLocaleDateString("es-VE", options);
}

/** Hoy en hora local como "YYYY-MM-DD" (toISOString daría el día UTC: de noche en Venezuela, mañana). */
export function todayKey(): string {
  return toDateKey(new Date());
}
