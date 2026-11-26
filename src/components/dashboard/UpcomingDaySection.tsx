import { ChevronRight, Clock, Phone } from "lucide-react";
import { UpcomingEntry } from "@/lib/calendar-api";
import { formatTime12h } from "@/lib/upcoming-schedule";

interface Props {
  heading: string;
  dateLabel: string;
  entries: UpcomingEntry[];
  emptyMessage: string;
  onSelectPatient: (patientId: string) => void;
}

export function UpcomingDaySection({ heading, dateLabel, entries, emptyMessage, onSelectPatient }: Props) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-foreground">{heading}</h3>
        <span className="text-sm text-muted-foreground capitalize">{dateLabel}</span>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-xl bg-muted/50 px-4 py-3.5 text-base text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const timeLabel = formatTime12h(entry.time);
            return (
              <div
                key={`${entry.source}-${entry.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold text-foreground truncate">{entry.patientName}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {timeLabel ? (
                      <span className="inline-flex items-center gap-1 font-medium text-primary">
                        <Clock size={14} className="shrink-0" />
                        {timeLabel}
                      </span>
                    ) : (
                      <span>Consulta pautada</span>
                    )}
                    {entry.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={13} className="shrink-0" />
                        {entry.phone}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPatient(entry.patientId)}
                  className="inline-flex items-center justify-center gap-1.5 shrink-0 min-h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Ver perfil
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
