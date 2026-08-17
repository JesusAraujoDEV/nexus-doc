import { cn } from "@/lib/utils";

const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function heatClass(count: number, max: number) {
  if (count === 0) return "bg-muted/40 text-muted-foreground";
  const ratio = count / max;
  if (ratio > 0.66) return "bg-primary text-white";
  if (ratio > 0.33) return "bg-primary/60 text-white";
  return "bg-primary/25 text-foreground";
}

interface Props {
  countsByMonth: number[];
  onMonthClick: (monthIndex: number) => void;
}

export function CalendarYearView({ countsByMonth, onMonthClick }: Props) {
  const max = Math.max(1, ...countsByMonth);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {MONTH_LABELS.map((label, i) => {
        const count = countsByMonth[i] ?? 0;
        return (
          <button
            key={label}
            onClick={() => onMonthClick(i)}
            className={cn(
              "rounded-xl p-4 text-left transition-colors hover:opacity-90",
              heatClass(count, max),
            )}
          >
            <p className="text-xs font-semibold">{label}</p>
            <p className="text-2xl font-bold mt-1">{count}</p>
            <p className="text-[10px] opacity-80">consultas</p>
          </button>
        );
      })}
    </div>
  );
}
