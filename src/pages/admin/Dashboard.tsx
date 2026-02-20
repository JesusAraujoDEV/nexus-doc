import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Users, Clock, ChevronRight, Play,
  TrendingUp, CheckCircle2, AlertCircle, Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

const todayAppointments = [
  { time: "08:30 AM", name: "María López", service: "Consulta General", status: "completed", id: "1" },
  { time: "09:00 AM", name: "Carlos Méndez", service: "Revisión Periódica", status: "active", id: "2" },
  { time: "09:30 AM", name: "Ana Rodríguez", service: "Control Cardiológico", status: "pending", id: "3" },
  { time: "10:00 AM", name: "Luis García", service: "Resultados de Examen", status: "pending", id: "4" },
  { time: "11:00 AM", name: "Sofía Martínez", service: "Consulta General", status: "pending", id: "5" },
  { time: "02:00 PM", name: "Pedro Jiménez", service: "Revisión Periódica", status: "pending", id: "6" },
];

const stats = [
  { label: "Citas de Hoy", value: 6, icon: Calendar, color: "bg-primary-light text-primary", trend: "+2 vs ayer" },
  { label: "Pacientes Totales", value: "248", icon: Users, color: "bg-accent-light text-accent", trend: "+5 este mes" },
  { label: "Completadas", value: 1, icon: CheckCircle2, color: "bg-primary-light text-primary", trend: "16% del día" },
  { label: "Pendientes", value: 5, icon: Clock, color: "bg-accent-light text-accent", trend: "83% del día" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") return (
    <span className="flex items-center gap-1 text-[10px] font-medium text-accent">
      <CheckCircle2 size={11} />Completada
    </span>
  );
  if (status === "active") return (
    <span className="flex items-center gap-1 text-[10px] font-medium text-primary animate-pulse-soft">
      <Stethoscope size={11} />En consulta
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
      <AlertCircle size={11} />Pendiente
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-6 pb-8">
        <p className="text-white/70 text-xs capitalize mb-1">{today}</p>
        <h1 className="text-xl font-bold">Buenos días, Dra. García 👋</h1>
        <p className="text-white/70 text-sm mt-1">Tienes 5 citas pendientes hoy</p>
      </div>

      <div className="flex-1 px-4 -mt-4 space-y-5 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="medical-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.color)}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp size={9} />{stat.trend}
                </p>
              </div>
            );
          })}
        </div>

        {/* Today's Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Agenda de Hoy</h2>
            <button
              onClick={() => navigate("/admin/schedule")}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              Ver todo <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-0">
            {todayAppointments.map((appt, i) => (
              <div key={appt.id} className="timeline-node pb-4">
                <div className={cn(
                  "timeline-dot",
                  appt.status === "completed" && "!bg-accent",
                  appt.status === "active" && "animate-pulse-soft",
                )} style={{ background: appt.status === "completed" ? undefined : undefined }}>
                  {appt.status === "completed" ? "✓" : i + 1}
                </div>

                <div className={cn(
                  "medical-card p-3.5 flex items-center gap-3",
                  appt.status === "active" && "border-primary border-2 bg-primary-light"
                )}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-primary">{appt.time}</span>
                      <StatusBadge status={appt.status} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{appt.name}</p>
                    <p className="text-xs text-muted-foreground">{appt.service}</p>
                  </div>
                  {appt.status !== "completed" && (
                    <button
                      onClick={() => navigate(`/admin/patients/${appt.id}`)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                        appt.status === "active"
                          ? "gradient-primary text-white shadow-primary"
                          : "bg-muted text-muted-foreground hover:bg-primary-light hover:text-primary"
                      )}
                    >
                      <Play size={11} />
                      {appt.status === "active" ? "En curso" : "Iniciar"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
