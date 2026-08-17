import { isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/calendar-date";
import { CalendarEntry } from "@/lib/calendar-api";

const WEEKDAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface Props {
  days: Date[];
  grouped: Map<string, CalendarEntry[]>;
  onSelectPatient: (patientId: string) => void;
}

export function CalendarWeekView({ days, grouped, onSelectPatient }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day, i) => {
        const dateKey = toDateKey(day);
        const entries = grouped.get(dateKey) ?? [];
        return (
          <div key={dateKey} className="rounded-xl border border-border overflow-hidden">
            <div
              className={cn(
                "px-3 py-2 text-xs font-semibold border-b border-border flex items-center justify-between",
                isToday(day) ? "bg-primary/10 text-primary" : "bg-muted/40 text-foreground",
              )}
            >
              <span>{WEEKDAY_LABELS[i]} {day.getDate()}</span>
              {entries.length > 0 && <span className="text-muted-foreground">{entries.length}</span>}
            </div>
            <div className="p-2 space-y-1 min-h-[2.5rem]">
              {entries.length === 0 && (
                <p className="text-[11px] text-muted-foreground px-1 py-1">Sin consultas</p>
              )}
              {entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onSelectPatient(entry.patientId)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors truncate"
                >
                  {entry.patientName}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
