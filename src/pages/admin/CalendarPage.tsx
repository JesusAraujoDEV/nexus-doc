import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear,
  addMonths, addWeeks, addYears, eachDayOfInterval, format, getMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { fetchCalendarRange, CalendarEntry, Granularity } from "@/lib/calendar-api";
import { parseDateOnly, toDateKey } from "@/lib/calendar-date";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { CalendarYearView } from "@/components/calendar/CalendarYearView";
import { CalendarDayList } from "@/components/calendar/CalendarDayList";

const WEEK_OPTS = { weekStartsOn: 1 as const };

export default function CalendarPage() {
  const navigate = useNavigate();
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [anchor, setAnchor] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { gridStart, gridEnd } = useMemo(() => {
    if (granularity === "week") {
      return { gridStart: startOfWeek(anchor, WEEK_OPTS), gridEnd: endOfWeek(anchor, WEEK_OPTS) };
    }
    if (granularity === "year") {
      return { gridStart: startOfYear(anchor), gridEnd: endOfYear(anchor) };
    }
    return {
      gridStart: startOfWeek(startOfMonth(anchor), WEEK_OPTS),
      gridEnd: endOfWeek(endOfMonth(anchor), WEEK_OPTS),
    };
  }, [granularity, anchor]);

  const fromKey = toDateKey(gridStart);
  const toKey = toDateKey(gridEnd);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["calendar", fromKey, toKey],
    queryFn: () => fetchCalendarRange(fromKey, toKey),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of data ?? []) {
      const key = toDateKey(parseDateOnly(entry.date));
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    return map;
  }, [data]);

  const countsByMonth = useMemo(() => {
    const counts = new Array(12).fill(0);
    for (const entry of data ?? []) counts[getMonth(parseDateOnly(entry.date))]++;
    return counts;
  }, [data]);

  function navigateStep(dir: 1 | -1) {
    if (granularity === "week") return setAnchor((a) => addWeeks(a, dir));
    if (granularity === "year") return setAnchor((a) => addYears(a, dir));
    return setAnchor((a) => addMonths(a, dir));
  }

  const title =
    granularity === "year" ? format(anchor, "yyyy")
    : granularity === "week" ? `${format(gridStart, "d MMM", { locale: es })} - ${format(gridEnd, "d MMM yyyy", { locale: es })}`
    : format(anchor, "MMMM yyyy", { locale: es });

  const goToPatient = (patientId: string) => navigate(`/admin/patients/${patientId}`);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <h1 className="text-lg font-bold text-foreground mb-3">Calendario</h1>
        <CalendarToolbar
          granularity={granularity}
          onGranularityChange={setGranularity}
          title={title}
          onPrev={() => navigateStep(-1)}
          onNext={() => navigateStep(1)}
          onToday={() => setAnchor(new Date())}
        />
      </div>

      <div className="flex-1 p-4">
        {isLoading && (
          <div className="py-16 flex justify-center text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
          </div>
        )}

        {isError && (
          <div className="py-12 text-center text-sm text-destructive">No se pudo cargar el calendario.</div>
        )}

        {!isLoading && !isError && granularity === "month" && (
          <CalendarMonthView
            gridStart={gridStart}
            gridEnd={gridEnd}
            anchorMonth={anchor}
            grouped={grouped}
            onDayClick={setSelectedDay}
          />
        )}

        {!isLoading && !isError && granularity === "week" && (
          <CalendarWeekView
            days={eachDayOfInterval({ start: gridStart, end: gridEnd })}
            grouped={grouped}
            onSelectPatient={goToPatient}
          />
        )}

        {!isLoading && !isError && granularity === "year" && (
          <CalendarYearView
            countsByMonth={countsByMonth}
            onMonthClick={(monthIndex) => {
              setAnchor(new Date(anchor.getFullYear(), monthIndex, 1));
              setGranularity("month");
            }}
          />
        )}
      </div>

      <CalendarDayList
        dateKey={selectedDay}
        entries={(selectedDay && grouped.get(selectedDay)) || []}
        onOpenChange={(open) => !open && setSelectedDay(null)}
        onSelectPatient={goToPatient}
      />
    </div>
  );
}
