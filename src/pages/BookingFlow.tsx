import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Stethoscope, Microscope, Activity, Heart, User, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---- Data ----
const services = [
  { id: 1, icon: Stethoscope, name: "Consulta General", desc: "Evaluación médica completa", price: "$30", duration: "30 min" },
  { id: 2, icon: Activity, name: "Revisión Periódica", desc: "Chequeo de rutina anual", price: "$25", duration: "20 min" },
  { id: 3, icon: Heart, name: "Control Cardiológico", desc: "Evaluación cardiovascular", price: "$45", duration: "45 min" },
  { id: 4, icon: Microscope, name: "Resultados de Examen", desc: "Revisión y análisis de resultados", price: "$20", duration: "15 min" },
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
];

const unavailableSlots = ["09:00 AM", "10:00 AM", "02:30 PM"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ---- Step Components ----
function StepService({ selected, onSelect }: { selected: number | null; onSelect: (id: number) => void }) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-foreground">Selecciona el servicio</h2>
        <p className="text-sm text-muted-foreground mt-1">¿Qué tipo de consulta necesitas?</p>
      </div>
      {services.map((s) => {
        const Icon = s.icon;
        const isSelected = selected === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
              isSelected
                ? "border-primary bg-primary-light shadow-primary"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
              isSelected ? "gradient-primary shadow-primary" : "bg-muted"
            )}>
              <Icon size={22} className={isSelected ? "text-white" : "text-muted-foreground"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold", isSelected ? "text-primary" : "text-foreground")}>{s.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-medium text-foreground">{s.price}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">{s.duration}</span>
              </div>
            </div>
            {isSelected && (
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <Check size={13} className="text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StepCalendar({ selectedDay, selectedSlot, onDay, onSlot }: {
  selectedDay: number | null; selectedSlot: string | null;
  onDay: (d: number) => void; onSlot: (s: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isPast = (d: number) => new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isWeekend = (d: number) => {
    const dow = new Date(viewYear, viewMonth, d).getDay();
    return dow === 0 || dow === 6;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground">Elige fecha y hora</h2>
        <p className="text-sm text-muted-foreground mt-1">Toca un día disponible</p>
      </div>

      {/* Calendar */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft size={16} className="text-muted-foreground" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map(d => (
            <div key={d} className="py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-px bg-border p-0">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-card aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const disabled = isPast(day) || isWeekend(day);
            const active = selectedDay === day;
            return (
              <button
                key={day}
                disabled={disabled}
                onClick={() => !disabled && onDay(day)}
                className={cn(
                  "bg-card aspect-square flex items-center justify-center text-sm font-medium transition-all duration-150",
                  disabled && "text-muted-foreground/40 cursor-not-allowed",
                  !disabled && !active && "text-foreground hover:bg-primary-light hover:text-primary",
                  isToday(day) && !active && "text-primary font-bold",
                  active && "gradient-primary text-white shadow-sm",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDay && (
        <div className="animate-slide-up">
          <p className="text-sm font-semibold text-foreground mb-3">
            Horarios disponibles — {selectedDay} de {MONTHS[viewMonth]}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const unavailable = unavailableSlots.includes(slot);
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  disabled={unavailable}
                  onClick={() => !unavailable && onSlot(slot)}
                  className={cn(
                    "slot-btn text-xs py-3 rounded-xl border-2 font-medium transition-all duration-200",
                    unavailable && "opacity-40 cursor-not-allowed border-border text-muted-foreground line-through",
                    !unavailable && !isSelected && "border-border text-foreground hover:border-primary hover:bg-primary-light hover:text-primary",
                    isSelected && "gradient-primary border-transparent text-white shadow-primary"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            🔴 Tachados = no disponibles
          </p>
        </div>
      )}
    </div>
  );
}

function StepForm({ onConfirm }: { onConfirm: () => void }) {
  const [form, setForm] = useState({ name: "", id: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const valid = form.name.trim() && form.id.trim() && form.phone.trim();

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-foreground">Tus datos</h2>
        <p className="text-sm text-muted-foreground mt-1">Completa la información para confirmar</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">
            <span className="flex items-center gap-2"><User size={14} /> Nombre Completo</span>
          </Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Juan Carlos Pérez"
            className="h-12 rounded-xl border-border bg-card text-sm"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">
            <span className="flex items-center gap-2"><CreditCard size={14} /> Cédula de Identidad</span>
          </Label>
          <Input
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="Ej: V-12.345.678"
            className="h-12 rounded-xl border-border bg-card text-sm"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">
            <span className="flex items-center gap-2"><Phone size={14} /> Número de Teléfono</span>
          </Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Ej: +58 412-5559999"
            type="tel"
            className="h-12 rounded-xl border-border bg-card text-sm"
          />
        </div>
      </div>

      <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground">
        🔒 Tu información es confidencial y solo será usada para gestionar tu cita médica.
      </div>

      <Button
        onClick={onConfirm}
        disabled={!valid}
        className="w-full h-13 rounded-2xl text-base font-semibold gradient-primary text-white border-0 shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Confirmar Cita ✓
      </Button>
    </div>
  );
}

// ---- Main Component ----
export default function BookingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [service, setService] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const steps = [
    { label: "Servicio", num: 1 },
    { label: "Fecha", num: 2 },
    { label: "Datos", num: 3 },
  ];

  const canNext = () => {
    if (step === 1) return service !== null;
    if (step === 2) return day !== null && slot !== null;
    return true;
  };

  const handleConfirm = () => setConfirmed(true);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center mb-6 shadow-accent-glow">
          <Check size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">¡Cita Confirmada!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Recibirás una confirmación por WhatsApp con los detalles de tu consulta.
        </p>
        <div className="medical-card p-4 w-full max-w-xs text-left space-y-2 mb-8">
          <p className="text-xs text-muted-foreground">Servicio</p>
          <p className="text-sm font-semibold text-foreground">{services.find(s => s.id === service)?.name}</p>
          <p className="text-xs text-muted-foreground mt-2">Fecha y hora</p>
          <p className="text-sm font-semibold text-foreground">{day && slot ? `${day} de este mes — ${slot}` : ""}</p>
        </div>
        <Button
          onClick={() => navigate("/")}
          className="h-12 px-8 rounded-2xl gradient-primary text-white border-0 shadow-primary font-semibold"
        >
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/")}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground flex-1">Agendar Consulta</h1>
          <span className="text-xs text-muted-foreground">{step} / 3</span>
        </div>

        {/* Step bar */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "step-indicator text-xs w-6 h-6",
                s.num < step ? "completed" : s.num === step ? "active" : "pending"
              )}>
                {s.num < step ? <Check size={12} /> : s.num}
              </div>
              <span className={cn(
                "text-[10px] font-medium flex-1",
                s.num === step ? "text-primary" : "text-muted-foreground"
              )}>{s.label}</span>
              {i < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-4 rounded-full",
                  s.num < step ? "bg-accent" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {step === 1 && <StepService selected={service} onSelect={setService} />}
        {step === 2 && <StepCalendar selectedDay={day} selectedSlot={slot} onDay={setDay} onSlot={setSlot} />}
        {step === 3 && <StepForm onConfirm={handleConfirm} />}
      </div>

      {/* Next button (steps 1 & 2) */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="w-full h-13 rounded-2xl text-base font-semibold gradient-primary text-white border-0 shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
      )}

      {/* Space for fixed button */}
      {step < 3 && <div className="h-24" />}
    </div>
  );
}
