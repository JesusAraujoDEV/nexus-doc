import { eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/calendar-date";
import { CalendarEntry } from "@/lib/calendar-api";

const WEEKDAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

interface Props {
  gridStart: Date;
  gridEnd: Date;
  anchorMonth: Date;
  grouped: Map<string, CalendarEntry[]>;
  onDayClick: (dateKey: string) => void;
}

export function CalendarMonthView({ gridStart, gridEnd, anchorMonth, grouped, onDayClick }: Props) {
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {WEEKDAY_LETTERS.map((letter, i) => (
          <span key={i} className="text-[10px] font-semibold text-muted-foreground py-1">
            {letter}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const count = grouped.get(dateKey)?.length ?? 0;
          const inMonth = isSameMonth(day, anchorMonth);
          return (
            <button
              key={dateKey}
              onClick={() => count > 0 && onDayClick(dateKey)}
              disabled={count === 0}
              className={cn(
                "relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors",
                inMonth ? "text-foreground" : "text-muted-foreground/40",
                isToday(day) && "ring-1 ring-primary",
                count > 0 ? "bg-primary/10 hover:bg-primary/20 cursor-pointer" : "cursor-default",
              )}
            >
              <span className="font-medium">{day.getDate()}</span>
              {count > 0 && (
                <span className="absolute bottom-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-white text-[9px] leading-[14px] font-semibold">
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
