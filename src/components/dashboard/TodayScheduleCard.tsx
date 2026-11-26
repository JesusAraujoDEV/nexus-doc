import { useMemo } from "react";
import { CalendarDays, ArrowRight, Loader2 } from "lucide-react";
import { todayKey } from "@/lib/calendar-date";
import {
  addDaysToDateKey,
  formatLongSpanishDate,
  groupEntriesByDay,
  sortUpcomingEntries,
} from "@/lib/upcoming-schedule";
import { useUpcomingSchedule } from "@/hooks/use-upcoming-schedule";
import { UpcomingDaySection } from "@/components/dashboard/UpcomingDaySection";

interface Props {
  onSelectPatient: (patientId: string) => void;
  onOpenCalendar: () => void;
}

export function TodayScheduleCard({ onSelectPatient, onOpenCalendar }: Props) {
  const today = todayKey();
  const tomorrow = addDaysToDateKey(today, 1);
  const referenceYear = Number(today.slice(0, 4));
  const { data, isLoading, isError } = useUpcomingSchedule(today, tomorrow);

  const grouped = useMemo(() => groupEntriesByDay(data ?? []), [data]);
  const todayEntries = sortUpcomingEntries(grouped.get(today) ?? []);
  const tomorrowEntries = sortUpcomingEntries(grouped.get(tomorrow) ?? []);

  return (
    <section className="medical-card p-5 space-y-5 border-primary/25">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <CalendarDays size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Hoy te toca ver a…</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {formatLongSpanishDate(today, { referenceYear })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenCalendar}
          className="inline-flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          Ver agenda completa
          <ArrowRight size={16} />
        </button>
      </div>

      {isLoading && (
        <div className="py-6 flex justify-center text-muted-foreground">
          <Loader2 size={22} className="animate-spin" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          No se pudo cargar la agenda de hoy y mañana.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-5">
          <UpcomingDaySection
            heading={`Hoy (${todayEntries.length})`}
            dateLabel={formatLongSpanishDate(today, { referenceYear })}
            entries={todayEntries}
            emptyMessage="Hoy no tienes consultas pautadas. ¡Que tengas un buen día!"
            onSelectPatient={onSelectPatient}
          />
          <div className="border-t border-border pt-4">
            <UpcomingDaySection
              heading={`Mañana (${tomorrowEntries.length})`}
              dateLabel={formatLongSpanishDate(tomorrow, { referenceYear })}
              entries={tomorrowEntries}
              emptyMessage="Mañana todavía no tienes consultas pautadas."
              onSelectPatient={onSelectPatient}
            />
          </div>
        </div>
      )}
    </section>
  );
}
