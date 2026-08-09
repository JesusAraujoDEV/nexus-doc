import { ClinicalRecord, consultationDate } from "@/lib/clinical-records-api";

export interface PregnancyStatus {
  weeksToday: number;
  daysToday: number;
  dueDate: Date;
  sourceVisitDate: string;
}

function parseDDMMYYYYOrISO(s: string): Date | null {
  const iso = /^\d{4}-\d{2}-\d{2}/.exec(s);
  if (iso) return new Date(s);
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (ddmmyyyy) return new Date(Number(ddmmyyyy[3]), Number(ddmmyyyy[2]) - 1, Number(ddmmyyyy[1]));
  return null;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

/**
 * Semanas de embarazo hoy y fecha probable de parto (FPP), a partir del dato más
 * reciente que la doctora haya registrado (F.U.M. por regla de Naegele, o semanas
 * de gestación anotadas en una consulta puntual, proyectadas hasta hoy).
 * No estima nada por biometría fetal - eso lo decide la doctora, esto solo proyecta
 * en el tiempo lo que ella ya escribió.
 */
export function currentPregnancyStatus(records: ClinicalRecord[]): PregnancyStatus | null {
  const sorted = [...records].sort((a, b) => consultationDate(b).localeCompare(consultationDate(a)));
  const today = new Date();

  for (const r of sorted) {
    const eco = r.ultrasoundFindings;
    if (!eco) continue;
    const visitDate = new Date(consultationDate(r));

    if (eco.FUM) {
      const fum = parseDDMMYYYYOrISO(String(eco.FUM));
      if (!fum) continue;
      const dueDate = new Date(fum.getTime() + 280 * 86400000);
      const daysToday = daysBetween(fum, today);
      const weeksToday = Math.floor(daysToday / 7);
      if (weeksToday >= 0 && weeksToday <= 42) {
        return { weeksToday, daysToday: daysToday % 7, dueDate, sourceVisitDate: consultationDate(r) };
      }
      continue;
    }

    const weeksAtVisit = Number(eco["EDAD-GEST-SEM"]);
    if (weeksAtVisit > 0) {
      const daysSinceVisit = daysBetween(visitDate, today);
      const totalDays = weeksAtVisit * 7 + daysSinceVisit;
      const weeksToday = Math.floor(totalDays / 7);
      if (weeksToday >= 0 && weeksToday <= 42) {
        const dueDate = new Date(visitDate.getTime() + (280 - weeksAtVisit * 7) * 86400000);
        return { weeksToday, daysToday: totalDays % 7, dueDate, sourceVisitDate: consultationDate(r) };
      }
      continue;
    }
  }
  return null;
}
