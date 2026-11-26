import { isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/calendar-date";
import { CalendarDisplayEntry } from "@/lib/calendar-api";
import { formatTime12h } from "@/lib/upcoming-schedule";

const WEEKDAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface Props {
  days: Date[];
  grouped: Map<string, readonly CalendarDisplayEntry[]>;
  emptyLabel?: string;
  onSelectPatient: (patientId: string) => void;
}

export function CalendarWeekView({ days, grouped, emptyLabel = "Sin consultas", onSelectPatient }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day, i) => {
        const dateKey = toDateKey(day);
        const entries = grouped.get(dateKey) ?? [];
        return (
          <div key={dateKey} className="rounded-xl border border-border overflow-hidden">
            <div
              className={cn(
                "px-3 py-2.5 text-sm font-semibold border-b border-border flex items-center justify-between",
                isToday(day) ? "bg-primary/10 text-primary" : "bg-muted/40 text-foreground",
              )}
            >
              <span>{WEEKDAY_LABELS[i]} {day.getDate()}</span>
              {entries.length > 0 && <span className="text-muted-foreground">{entries.length}</span>}
            </div>
            <div className="p-2 space-y-1.5 min-h-[2.75rem]">
              {entries.length === 0 && (
                <p className="text-xs text-muted-foreground px-1 py-1">{emptyLabel}</p>
              )}
              {entries.map((entry) => {
                const timeLabel = entry.kind === "upcoming" ? formatTime12h(entry.time) : null;
                return (
                  <button
                    key={`${entry.kind}-${entry.id}`}
                    type="button"
                    onClick={() => onSelectPatient(entry.patientId)}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors"
                  >
                    {timeLabel && (
                      <span className="block text-xs font-semibold text-primary">{timeLabel}</span>
                    )}
                    <span className="block text-sm font-medium text-foreground truncate">
                      {entry.patientName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
