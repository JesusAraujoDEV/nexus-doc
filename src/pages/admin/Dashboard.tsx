import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, ClipboardList, CalendarClock, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { fetchStats } from "@/lib/stats-api";
import { StatCard } from "@/components/dashboard/StatCard";
import { AgeDistributionChart, VisitTypesChart } from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card">
        <h1 className="text-lg font-bold text-foreground">Inicio</h1>
        <p className="text-xs text-muted-foreground">Resumen de la consulta</p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {isLoading && (
          <div className="py-16 flex justify-center text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
          </div>
        )}
        {isError && <div className="py-12 text-center text-sm text-destructive">No se pudieron cargar las estadísticas.</div>}

        {data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Pacientes" value={data.totals.patients.toLocaleString("es-VE")}
                icon={Users} color="bg-primary-light text-primary" hint="registrados en total" />
              <StatCard label="Consultas" value={data.totals.consultations.toLocaleString("es-VE")}
                icon={ClipboardList} color="bg-accent-light text-accent" hint="historial completo" />
              <StatCard label="Con f. nacimiento" value={data.totals.withBirthDate.toLocaleString("es-VE")}
                icon={CheckCircle2} color="bg-primary-light text-primary"
                hint={`${Math.round((data.totals.withBirthDate / data.totals.patients) * 100)}% del total`} />
              <StatCard label="Este mes" value={data.totals.consultationsThisMonth.toLocaleString("es-VE")}
                icon={CalendarClock} color="bg-accent-light text-accent" hint="consultas registradas" />
            </div>

            <button
              onClick={() => navigate("/admin/patients")}
              className="w-full flex items-center justify-between medical-card p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">Ver directorio de pacientes</span>
              </div>
              <ArrowRight size={16} className="text-muted-foreground" />
            </button>

            <div className="grid lg:grid-cols-2 gap-4">
              <AgeDistributionChart data={data.ageDistribution} />
              <VisitTypesChart data={data.topVisitTypes} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
