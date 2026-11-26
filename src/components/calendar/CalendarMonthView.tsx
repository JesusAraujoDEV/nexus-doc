import { eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/calendar-date";
import { CalendarDisplayEntry } from "@/lib/calendar-api";

const WEEKDAY_LETTERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface Props {
  gridStart: Date;
  gridEnd: Date;
  anchorMonth: Date;
  grouped: Map<string, readonly CalendarDisplayEntry[]>;
  onDayClick: (dateKey: string) => void;
}

export function CalendarMonthView({ gridStart, gridEnd, anchorMonth, grouped, onDayClick }: Props) {
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
        {WEEKDAY_LETTERS.map((letter) => (
          <span key={letter} className="text-xs font-semibold text-muted-foreground py-1">
            {letter}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const count = grouped.get(dateKey)?.length ?? 0;
          const inMonth = isSameMonth(day, anchorMonth);
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => count > 0 && onDayClick(dateKey)}
              disabled={count === 0}
              className={cn(
                "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-colors",
                inMonth ? "text-foreground" : "text-muted-foreground/40",
                isToday(day) && "ring-2 ring-primary",
                count > 0 ? "bg-primary/10 hover:bg-primary/20 cursor-pointer" : "cursor-default",
              )}
            >
              <span className="font-semibold">{day.getDate()}</span>
              {count > 0 && (
                <span className="mt-0.5 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-xs leading-5 font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
