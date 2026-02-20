import { useState } from "react";
import { Plus, Trash2, Save, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const TIME_OPTIONS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
];

interface Slot {
  id: string;
  start: string;
  end: string;
}

type Schedule = Record<string, { active: boolean; slots: Slot[] }>;

const defaultSchedule: Schedule = {
  Lunes:     { active: true,  slots: [{ id: "1", start: "08:00", end: "12:00" }, { id: "2", start: "14:00", end: "17:00" }] },
  Martes:    { active: true,  slots: [{ id: "3", start: "08:00", end: "12:00" }] },
  Miércoles: { active: true,  slots: [{ id: "4", start: "08:00", end: "17:00" }] },
  Jueves:    { active: false, slots: [] },
  Viernes:   { active: true,  slots: [{ id: "5", start: "08:00", end: "13:00" }] },
};

function uid() {
  return Math.random().toString(36).slice(2);
}

function SlotEditor({ slot, onUpdate, onDelete }: {
  slot: Slot;
  onUpdate: (id: string, field: "start" | "end", val: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-xl border border-border animate-fade-in">
      <Clock size={14} className="text-muted-foreground shrink-0" />
      <select
        value={slot.start}
        onChange={e => onUpdate(slot.id, "start", e.target.value)}
        className="flex-1 h-9 rounded-lg bg-card border border-border text-sm text-foreground px-2 min-w-0"
      >
        {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <span className="text-xs text-muted-foreground shrink-0">hasta</span>
      <select
        value={slot.end}
        onChange={e => onUpdate(slot.id, "end", e.target.value)}
        className="flex-1 h-9 rounded-lg bg-card border border-border text-sm text-foreground px-2 min-w-0"
      >
        {TIME_OPTIONS.filter(t => t > slot.start).map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <button
        onClick={() => onDelete(slot.id)}
        className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 hover:bg-destructive/20 transition-colors"
      >
        <Trash2 size={13} className="text-destructive" />
      </button>
    </div>
  );
}

export default function ScheduleConfig() {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setSchedule(s => ({ ...s, [day]: { ...s[day], active: !s[day].active } }));
  };

  const addSlot = (day: string) => {
    const newSlot: Slot = { id: uid(), start: "08:00", end: "12:00" };
    setSchedule(s => ({ ...s, [day]: { ...s[day], slots: [...s[day].slots, newSlot] } }));
  };

  const updateSlot = (day: string, id: string, field: "start" | "end", val: string) => {
    setSchedule(s => ({
      ...s,
      [day]: {
        ...s[day],
        slots: s[day].slots.map(slot => slot.id === id ? { ...slot, [field]: val } : slot)
      }
    }));
  };

  const deleteSlot = (day: string, id: string) => {
    setSchedule(s => ({
      ...s,
      [day]: { ...s[day], slots: s[day].slots.filter(slot => slot.id !== id) }
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeDays = DAYS.filter(d => schedule[d].active).length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Configurar Horario</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeDays} días activos esta semana
            </p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
              saved
                ? "bg-accent text-white shadow-accent-glow"
                : "gradient-primary text-white shadow-primary"
            )}
          >
            <Save size={15} />
            {saved ? "¡Guardado!" : "Guardar"}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 pb-8">
        {/* Summary chips */}
        <div className="flex gap-2 flex-wrap">
          {DAYS.map(day => (
            <span
              key={day}
              className={cn(
                "text-xs px-3 py-1 rounded-full font-medium border cursor-pointer transition-all",
                schedule[day].active
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground border-border"
              )}
              onClick={() => toggleDay(day)}
            >
              {day.slice(0, 3)}
            </span>
          ))}
        </div>

        {/* Day cards */}
        {DAYS.map(day => {
          const dayData = schedule[day];
          return (
            <div key={day} className={cn("medical-card overflow-hidden transition-all duration-300", !dayData.active && "opacity-60")}>
              {/* Day header */}
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all duration-300 relative shrink-0",
                    dayData.active ? "bg-primary" : "bg-border"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm",
                    dayData.active ? "left-6" : "left-0.5"
                  )} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{day}</p>
                  {dayData.active ? (
                    <p className="text-xs text-muted-foreground">
                      {dayData.slots.length === 0
                        ? "Sin horarios configurados"
                        : `${dayData.slots.length} bloque${dayData.slots.length !== 1 ? "s" : ""} de atención`}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Día no disponible</p>
                  )}
                </div>
                {dayData.active && (
                  <button
                    onClick={() => addSlot(day)}
                    className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-primary active:scale-95 transition-transform"
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                )}
              </div>

              {/* Slots */}
              {dayData.active && dayData.slots.length > 0 && (
                <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                  {dayData.slots.map(slot => (
                    <SlotEditor
                      key={slot.id}
                      slot={slot}
                      onUpdate={(id, field, val) => updateSlot(day, id, field, val)}
                      onDelete={(id) => deleteSlot(day, id)}
                    />
                  ))}
                </div>
              )}

              {dayData.active && dayData.slots.length === 0 && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <button
                    onClick={() => addSlot(day)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                    Agregar bloque de horario
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Duration setting */}
        <div className="medical-card p-4">
          <p className="text-sm font-bold text-foreground mb-3">Duración por Cita</p>
          <div className="grid grid-cols-3 gap-2">
            {["15 min", "20 min", "30 min", "45 min", "60 min"].map((dur, i) => (
              <button
                key={dur}
                className={cn(
                  "py-3 rounded-xl text-xs font-semibold border-2 transition-all",
                  i === 2
                    ? "gradient-primary text-white border-transparent shadow-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                {dur}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
