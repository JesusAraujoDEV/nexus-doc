import { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import { StatsSummary } from "@/lib/stats-api";
import { cn } from "@/lib/utils";

const AGE_COLOR = "hsl(var(--primary))";
const TYPE_COLORS = [
  "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary))",
  "hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--accent))",
  "hsl(var(--primary))", "hsl(var(--accent))",
];

function titleCase(s: string) {
  return s.length > 16 ? `${s.slice(0, 16)}…` : s;
}

interface AgeDistributionChartProps {
  current: StatsSummary["ageDistribution"];
  atFirstVisit: StatsSummary["firstVisitAgeDistribution"];
}

export function AgeDistributionChart({ current, atFirstVisit }: AgeDistributionChartProps) {
  const [mode, setMode] = useState<"current" | "first">("current");
  const data = mode === "current" ? current : atFirstVisit;

  return (
    <div className="medical-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">Distribución por edad</h3>
        <div className="flex gap-1 text-[11px]">
          <button
            onClick={() => setMode("current")}
            className={cn("px-2 py-1 rounded-md", mode === "current" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}
          >
            Actual
          </button>
          <button
            onClick={() => setMode("first")}
            className={cn("px-2 py-1 rounded-md", mode === "first" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}
          >
            1ra consulta
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="bucket" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={30} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="count" name="Pacientes" radius={[6, 6, 0, 0]} fill={AGE_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VisitTypesChart({ data }: { data: StatsSummary["topVisitTypes"] }) {
  const chartData = data.map((d) => ({ ...d, label: titleCase(d.type) }));
  return (
    <div className="medical-card p-4">
      <h3 className="text-sm font-bold text-foreground mb-3">Tipos de consulta más frecuentes</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 34)}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis
            type="category" dataKey="label" width={100}
            tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="count" name="Consultas" radius={[0, 6, 6, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
