import { apiFetch } from "@/lib/api";

export type Granularity = "month" | "week" | "year";
export type CalendarMode = "upcoming" | "completed";
export type UpcomingSource = "proxima_cita" | "cita";

export interface CalendarEntry {
  id: string;
  patientId: string;
  patientName: string;
  /** "YYYY-MM-DD", fecha real de la consulta (ver parseDateOnly). */
  date: string;
  category: "gynecology" | "obstetrics";
}

export interface UpcomingEntry {
  id: string;
  patientId: string;
  patientName: string;
  phone: string | null;
  /** "YYYY-MM-DD", fecha pautada de la próxima consulta o cita (ver parseDateOnly). */
  date: string;
  source: UpcomingSource;
  /** "HH:mm" cuando proviene de una cita reservada; null si proviene de próxima consulta. */
  time: string | null;
  /** ID de la consulta de origen cuando source === "proxima_cita". */
  sourceRecordId: string | null;
}

export type CalendarDisplayEntry =
  | (UpcomingEntry & { kind: "upcoming" })
  | (CalendarEntry & { kind: "completed" });

export function fetchCalendarRange(from: string, to: string) {
  const query = new URLSearchParams({ from, to });
  return apiFetch<CalendarEntry[]>(`/clinical-records/calendar?${query.toString()}`);
}

export function fetchUpcomingRange(from: string, to: string) {
  const query = new URLSearchParams({ from, to });
  return apiFetch<UpcomingEntry[]>(`/clinical-records/upcoming?${query.toString()}`);
}
