import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { StatsSummary } from "@/lib/stats-api";
import { cn } from "@/lib/utils";

type Granularity = "day" | "month" | "year";

const OPTIONS: { key: Granularity; label: string }[] = [
  { key: "day", label: "Día de semana" },
  { key: "month", label: "Mes del año" },
  { key: "year", label: "Por año" },
];

export function TemporalChart({ temporal }: { temporal: StatsSummary["temporal"] }) {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const data = {
    day: temporal.byDayOfWeek,
    month: temporal.byMonthOfYear,
    year: temporal.byYear,
  }[granularity];

  return (
    <div className="medical-card p-4">
      <h3 className="text-sm font-bold text-foreground mb-3">Cuándo atiendo</h3>
      <div className="flex gap-1 mb-3 overflow-x-auto">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setGranularity(o.key)}
            className={cn(
              "shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap",
              granularity === o.key ? "bg-primary text-white" : "bg-muted text-muted-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={35} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="count" name="Consultas" radius={[6, 6, 0, 0]} fill="hsl(var(--accent))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
