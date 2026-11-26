import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Granularity } from "@/lib/calendar-api";

interface Props {
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({ granularity, onGranularityChange, title, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Período anterior"
            className="w-10 h-10 shrink-0 rounded-lg hover:bg-secondary flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-bold text-foreground capitalize truncate px-1">{title}</h2>
          <button
            type="button"
            onClick={onNext}
            aria-label="Período siguiente"
            className="w-10 h-10 shrink-0 rounded-lg hover:bg-secondary flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={onToday}
          className="shrink-0 text-sm font-semibold text-primary px-3 py-2 rounded-lg hover:bg-primary/10"
        >
          Hoy
        </button>
      </div>
      <Tabs value={granularity} onValueChange={(v) => onGranularityChange(v as Granularity)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="month" className="text-sm">Mes</TabsTrigger>
          <TabsTrigger value="week" className="text-sm">Semana</TabsTrigger>
          <TabsTrigger value="year" className="text-sm">Año</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
