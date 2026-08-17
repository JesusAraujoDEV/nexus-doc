import { apiFetch } from "@/lib/api";

export type Granularity = "month" | "week" | "year";

export interface CalendarEntry {
  id: string;
  patientId: string;
  patientName: string;
  /** "YYYY-MM-DD", fecha real de la consulta (ver parseDateOnly). */
  date: string;
  category: "gynecology" | "obstetrics";
}

export function fetchCalendarRange(from: string, to: string) {
  const query = new URLSearchParams({ from, to });
  return apiFetch<CalendarEntry[]>(`/clinical-records/calendar?${query.toString()}`);
}
