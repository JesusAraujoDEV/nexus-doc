import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { parseDateOnly } from "@/lib/calendar-date";
import { CalendarEntry } from "@/lib/calendar-api";

interface Props {
  dateKey: string | null;
  entries: CalendarEntry[];
  onOpenChange: (open: boolean) => void;
  onSelectPatient: (patientId: string) => void;
}

export function CalendarDayList({ dateKey, entries, onOpenChange, onSelectPatient }: Props) {
  const title = dateKey
    ? parseDateOnly(dateKey).toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  return (
    <Dialog open={!!dateKey} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelectPatient(entry.patientId)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{entry.patientName}</p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {entry.category === "obstetrics" ? "Obstetricia" : "Ginecología"}
                </Badge>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
