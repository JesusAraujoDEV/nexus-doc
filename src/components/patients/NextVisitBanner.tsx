import { AlertCircle, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { todayKey } from "@/lib/calendar-date";
import { ClinicalRecord } from "@/lib/clinical-records-api";
import { PatientAppointment } from "@/lib/patients-api";
import { formatNextVisitSummary, resolvePatientNextVisit } from "@/lib/upcoming-schedule";

interface Props {
  records: readonly ClinicalRecord[];
  appointments?: readonly PatientAppointment[];
}

export function NextVisitBanner({ records, appointments = [] }: Props) {
  const today = todayKey();
  const visit = resolvePatientNextVisit(records, appointments, today);
  if (!visit) return null;

  const summary = formatNextVisitSummary(visit, today);
  const isMissed = visit.status === "missed";

  return (
    <div
      className={cn(
        "medical-card p-4 flex items-center gap-3",
        isMissed
          ? "bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-100"
          : "bg-primary-light/70 border-primary/40 text-foreground",
      )}
    >
      {isMissed ? (
        <AlertCircle size={22} className="text-amber-600 dark:text-amber-400 shrink-0" />
      ) : (
        <CalendarClock size={22} className="text-primary shrink-0" />
      )}
      <p className="text-base font-semibold leading-snug">{summary}</p>
    </div>
  );
}
