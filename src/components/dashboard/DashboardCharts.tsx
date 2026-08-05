import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import { StatsSummary } from "@/lib/stats-api";

const AGE_COLOR = "hsl(var(--primary))";
const TYPE_COLORS = [
  "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary))",
  "hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--accent))",
  "hsl(var(--primary))", "hsl(var(--accent))",
];

function titleCase(s: string) {
  return s.length > 16 ? `${s.slice(0, 16)}…` : s;
}

export function AgeDistributionChart({ data }: { data: StatsSummary["ageDistribution"] }) {
  return (
    <div className="medical-card p-4">
      <h3 className="text-sm font-bold text-foreground mb-3">Distribución por edad</h3>
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
