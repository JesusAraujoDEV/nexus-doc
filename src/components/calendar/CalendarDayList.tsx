import { ChevronRight, Clock, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarDisplayEntry, CalendarMode } from "@/lib/calendar-api";
import { formatLongSpanishDate, formatTime12h } from "@/lib/upcoming-schedule";

interface Props {
  dateKey: string | null;
  entries: readonly CalendarDisplayEntry[];
  mode: CalendarMode;
  onOpenChange: (open: boolean) => void;
  onSelectPatient: (patientId: string) => void;
}

function buildSubtitle(count: number, mode: CalendarMode): string {
  if (mode === "upcoming") {
    return count === 1 ? "1 paciente pautada" : `${count} pacientes pautadas`;
  }
  return count === 1 ? "1 consulta realizada" : `${count} consultas realizadas`;
}

export function CalendarDayList({ dateKey, entries, mode, onOpenChange, onSelectPatient }: Props) {
  const title = dateKey ? formatLongSpanishDate(dateKey, { includeYear: true }) : "";

  return (
    <Dialog open={!!dateKey} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize text-lg">{title}</DialogTitle>
          <DialogDescription className="text-sm">{buildSubtitle(entries.length, mode)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {entries.map((entry) => {
            const timeLabel = entry.kind === "upcoming" ? formatTime12h(entry.time) : null;
            return (
              <button
                key={`${entry.kind}-${entry.id}`}
                type="button"
                onClick={() => onSelectPatient(entry.patientId)}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-left"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold text-foreground truncate">{entry.patientName}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.kind === "upcoming" ? (
                      <>
                        {timeLabel && (
                          <Badge variant="default" className="text-xs gap-1">
                            <Clock size={12} />
                            {timeLabel}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {entry.source === "cita" ? "Cita reservada" : "Próxima consulta"}
                        </Badge>
                        {entry.phone && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone size={12} />
                            {entry.phone}
                          </span>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {entry.category === "obstetrics" ? "Obstetricia" : "Ginecología"}
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
