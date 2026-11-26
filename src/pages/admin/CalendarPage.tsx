import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear,
  addMonths, addWeeks, addYears, eachDayOfInterval, format,
} from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import {
  CalendarDisplayEntry,
  CalendarEntry,
  CalendarMode,
  fetchCalendarRange,
  Granularity,
  UpcomingEntry,
} from "@/lib/calendar-api";
import { toDateKey } from "@/lib/calendar-date";
import { countEntriesByMonth, groupEntriesByDay } from "@/lib/upcoming-schedule";
import { useUpcomingSchedule } from "@/hooks/use-upcoming-schedule";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { CalendarYearView } from "@/components/calendar/CalendarYearView";
import { CalendarDayList } from "@/components/calendar/CalendarDayList";

const WEEK_OPTS = { weekStartsOn: 1 as const };

function computeGridBounds(granularity: Granularity, anchor: Date) {
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
}

function toDisplayEntries(
  mode: CalendarMode,
  upcoming: readonly UpcomingEntry[],
  completed: readonly CalendarEntry[],
): CalendarDisplayEntry[] {
  if (mode === "upcoming") {
    return upcoming.map((entry) => ({ ...entry, kind: "upcoming" as const }));
  }
  return completed.map((entry) => ({ ...entry, kind: "completed" as const }));
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CalendarMode>("upcoming");
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [anchor, setAnchor] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { gridStart, gridEnd } = useMemo(() => computeGridBounds(granularity, anchor), [granularity, anchor]);
  const fromKey = toDateKey(gridStart);
  const toKey = toDateKey(gridEnd);

  const upcomingQuery = useUpcomingSchedule(fromKey, toKey, mode === "upcoming");
  const completedQuery = useQuery({
    queryKey: ["calendar", fromKey, toKey],
    queryFn: () => fetchCalendarRange(fromKey, toKey),
    enabled: mode === "completed",
  });

  const activeQuery = mode === "upcoming" ? upcomingQuery : completedQuery;
  const entries = useMemo(
    () => toDisplayEntries(mode, upcomingQuery.data ?? [], completedQuery.data ?? []),
    [mode, upcomingQuery.data, completedQuery.data],
  );
  const grouped = useMemo(() => groupEntriesByDay(entries), [entries]);
  const countsByMonth = useMemo(() => countEntriesByMonth(entries), [entries]);

  function navigateStep(dir: 1 | -1) {
    if (granularity === "week") return setAnchor((a) => addWeeks(a, dir));
    if (granularity === "year") return setAnchor((a) => addYears(a, dir));
    return setAnchor((a) => addMonths(a, dir));
  }

  function handleModeChange(nextMode: string) {
    setMode(nextMode as CalendarMode);
    setSelectedDay(null);
  }

  const title =
    granularity === "year" ? format(anchor, "yyyy")
    : granularity === "week" ? `${format(gridStart, "d MMM", { locale: es })} - ${format(gridEnd, "d MMM yyyy", { locale: es })}`
    : format(anchor, "MMMM yyyy", { locale: es });

  const goToPatient = (patientId: string) => navigate(`/admin/patients/${patientId}`);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10 space-y-3">
        <h1 className="text-xl font-bold text-foreground">Calendario</h1>
        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList className="grid grid-cols-2 w-full h-11">
            <TabsTrigger value="upcoming" className="text-sm font-semibold">Próximas citas</TabsTrigger>
            <TabsTrigger value="completed" className="text-sm font-semibold">Consultas realizadas</TabsTrigger>
          </TabsList>
        </Tabs>
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
        {activeQuery.isLoading && (
          <div className="py-16 flex justify-center text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
          </div>
        )}

        {activeQuery.isError && (
          <div className="py-12 text-center text-sm text-destructive">No se pudo cargar el calendario.</div>
        )}

        {!activeQuery.isLoading && !activeQuery.isError && granularity === "month" && (
          <CalendarMonthView
            gridStart={gridStart}
            gridEnd={gridEnd}
            anchorMonth={anchor}
            grouped={grouped}
            onDayClick={setSelectedDay}
          />
        )}

        {!activeQuery.isLoading && !activeQuery.isError && granularity === "week" && (
          <CalendarWeekView
            days={eachDayOfInterval({ start: gridStart, end: gridEnd })}
            grouped={grouped}
            emptyLabel={mode === "upcoming" ? "Sin citas" : "Sin consultas"}
            onSelectPatient={goToPatient}
          />
        )}

        {!activeQuery.isLoading && !activeQuery.isError && granularity === "year" && (
          <CalendarYearView
            countsByMonth={countsByMonth}
            unitLabel={mode === "upcoming" ? "citas" : "consultas"}
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
        mode={mode}
        onOpenChange={(open) => !open && setSelectedDay(null)}
        onSelectPatient={goToPatient}
      />
    </div>
  );
}
