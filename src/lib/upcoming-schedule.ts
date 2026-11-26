import { parseApiDate, parseDateOnly, toDateKey } from "@/lib/calendar-date";
import { UpcomingEntry, UpcomingSource } from "@/lib/calendar-api";
import { ClinicalRecord, consultationDate } from "@/lib/clinical-records-api";
import { PatientAppointment } from "@/lib/patients-api";

const MS_PER_DAY = 86_400_000;
const NO_TIME_SORT_KEY = "99:99";
const WEEKDAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export interface ResolvedNextVisit {
  status: "upcoming" | "missed";
  date: string;
  time: string | null;
  source: UpcomingSource;
  diffDays: number;
}

interface VisitCandidate {
  date: string;
  time: string | null;
  source: UpcomingSource;
}

function toUtcDayIndex(dateKey: string): number {
  const date = parseDateOnly(dateKey);
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
}

function normalizeTime(rawTime: string | null | undefined): string | null {
  if (!rawTime) return null;
  return rawTime.slice(0, 5);
}

function recordDateKey(record: ClinicalRecord): string {
  return toDateKey(parseApiDate(consultationDate(record)));
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  const date = parseDateOnly(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function diffCalendarDays(targetDateKey: string, referenceDateKey: string): number {
  return toUtcDayIndex(targetDateKey) - toUtcDayIndex(referenceDateKey);
}

export function groupEntriesByDay<T extends { date: string }>(entries: readonly T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const entry of entries) {
    const key = toDateKey(parseDateOnly(entry.date));
    const bucket = grouped.get(key);
    if (bucket) bucket.push(entry);
    else grouped.set(key, [entry]);
  }
  return grouped;
}

export function sortUpcomingEntries(entries: readonly UpcomingEntry[]): UpcomingEntry[] {
  return [...entries].sort((a, b) => {
    const timeA = a.time || NO_TIME_SORT_KEY;
    const timeB = b.time || NO_TIME_SORT_KEY;
    if (timeA !== timeB) return timeA.localeCompare(timeB);
    return a.patientName.localeCompare(b.patientName, "es");
  });
}

export function countEntriesByMonth<T extends { date: string }>(entries: readonly T[]): number[] {
  const counts = new Array<number>(12).fill(0);
  for (const entry of entries) counts[parseDateOnly(entry.date).getMonth()] += 1;
  return counts;
}

export function formatLongSpanishDate(
  dateKey: string,
  options: { referenceYear?: number; includeYear?: boolean } = {},
): string {
  const date = parseDateOnly(dateKey);
  const weekday = WEEKDAYS_ES[date.getDay()];
  const month = MONTHS_ES[date.getMonth()];
  const base = `${weekday} ${date.getDate()} de ${month}`;
  const shouldIncludeYear = options.includeYear || (options.referenceYear !== undefined && date.getFullYear() !== options.referenceYear);
  return shouldIncludeYear ? `${base} de ${date.getFullYear()}` : base;
}

export function formatTime12h(time: string | null): string | null {
  const clean = normalizeTime(time);
  if (!clean) return null;
  const [rawHour, rawMinute] = clean.split(":").map(Number);
  if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) return null;
  const period = rawHour >= 12 ? "p. m." : "a. m.";
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;
  const minutes = String(rawMinute).padStart(2, "0");
  return `${hour12}:${minutes} ${period}`;
}

export function formatRelativeDaysText(diffDays: number): string {
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "mañana";
  if (diffDays > 1) return `en ${diffDays} días`;
  if (diffDays === -1) return "ayer";
  return `hace ${Math.abs(diffDays)} días`;
}

function hasReturnedOnOrAfter(records: readonly ClinicalRecord[], scheduledKey: string, excludeRecordId?: string): boolean {
  return records.some((record) => record.id !== excludeRecordId && recordDateKey(record) >= scheduledKey);
}

function findLatestRecordWithNextDate(records: readonly ClinicalRecord[]): ClinicalRecord | null {
  let latest: ClinicalRecord | null = null;
  let latestKey = "";
  for (const record of records) {
    if (!record.nextAppointmentDate) continue;
    const key = recordDateKey(record);
    if (!latest || key > latestKey || (key === latestKey && record.createdAt > latest.createdAt)) {
      latest = record;
      latestKey = key;
    }
  }
  return latest;
}

function pickBestUpcoming(candidates: readonly VisitCandidate[]): VisitCandidate | null {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    if (a.source !== b.source) return a.source === "cita" ? -1 : 1;
    return (a.time || NO_TIME_SORT_KEY).localeCompare(b.time || NO_TIME_SORT_KEY);
  })[0];
}

function pickLatestMissed(candidates: readonly VisitCandidate[]): VisitCandidate | null {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.source === "cita" ? -1 : 1;
  })[0];
}

function collectCandidates(
  records: readonly ClinicalRecord[],
  appointments: readonly PatientAppointment[],
  todayDateKey: string,
): { upcoming: VisitCandidate[]; missed: VisitCandidate[] } {
  const upcoming: VisitCandidate[] = [];
  const missed: VisitCandidate[] = [];

  for (const appointment of appointments) {
    if (appointment.status === "CANCELADA") continue;
    const date = toDateKey(parseDateOnly(appointment.appointmentDate));
    const candidate: VisitCandidate = { date, time: normalizeTime(appointment.startTime), source: "cita" };
    if (date >= todayDateKey) upcoming.push(candidate);
    else if (appointment.status !== "COMPLETADA" && !hasReturnedOnOrAfter(records, date)) missed.push(candidate);
  }

  const latestRecord = findLatestRecordWithNextDate(records);
  if (latestRecord?.nextAppointmentDate) {
    const date = toDateKey(parseDateOnly(latestRecord.nextAppointmentDate));
    const candidate: VisitCandidate = { date, time: null, source: "proxima_cita" };
    if (date >= todayDateKey) upcoming.push(candidate);
    else if (!hasReturnedOnOrAfter(records, date, latestRecord.id)) missed.push(candidate);
  }

  return { upcoming, missed };
}

export function resolvePatientNextVisit(
  records: readonly ClinicalRecord[],
  appointments: readonly PatientAppointment[],
  todayDateKey: string,
): ResolvedNextVisit | null {
  const { upcoming, missed } = collectCandidates(records, appointments, todayDateKey);
  const chosenUpcoming = pickBestUpcoming(upcoming);
  if (chosenUpcoming) {
    return { ...chosenUpcoming, status: "upcoming", diffDays: diffCalendarDays(chosenUpcoming.date, todayDateKey) };
  }
  const chosenMissed = pickLatestMissed(missed);
  if (chosenMissed) {
    return { ...chosenMissed, status: "missed", diffDays: diffCalendarDays(chosenMissed.date, todayDateKey) };
  }
  return null;
}

export function formatNextVisitSummary(visit: ResolvedNextVisit, referenceDateKey: string): string {
  const referenceYear = parseDateOnly(referenceDateKey).getFullYear();
  const dateText = formatLongSpanishDate(visit.date, { referenceYear });
  const timeText = formatTime12h(visit.time);
  const whenText = timeText ? `${dateText} a las ${timeText}` : dateText;
  if (visit.status === "missed") return `Tenía consulta el ${whenText} (no ha vuelto)`;
  return `Próxima consulta: ${whenText} (${formatRelativeDaysText(visit.diffDays)})`;
}
