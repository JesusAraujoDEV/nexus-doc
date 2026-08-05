import { useState } from "react";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { StatsSummary } from "@/lib/stats-api";
import { TemporalChart } from "./TemporalChart";
import { PatientBehaviorCard } from "./PatientBehaviorCard";
import { TopRankingList } from "./TopRankingList";

export function AnalysisSection({ data }: { data: StatsSummary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="medical-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Análisis completo</span>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-4 pt-0 space-y-4 border-t border-border">
          <TemporalChart temporal={data.temporal} />
          <PatientBehaviorCard data={data.patientBehavior} />
          <div className="grid md:grid-cols-2 gap-4">
            <TopRankingList title="Fármacos más recetados" items={data.topMedications} />
            <TopRankingList title="Exámenes más solicitados" items={data.topExams} />
          </div>
        </div>
      )}
    </div>
  );
}
