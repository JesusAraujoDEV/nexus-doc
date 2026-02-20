import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle, Eye, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const patients = [
  { id: "1", name: "María López", cedula: "V-12.345.678", phone: "+58 412-1234567", visits: 8, lastVisit: "15 Ene 2025", initials: "ML" },
  { id: "2", name: "Carlos Méndez", cedula: "V-11.222.333", phone: "+58 424-9876543", visits: 3, lastVisit: "10 Ene 2025", initials: "CM" },
  { id: "3", name: "Ana Rodríguez", cedula: "V-14.567.890", phone: "+58 416-5554321", visits: 12, lastVisit: "08 Ene 2025", initials: "AR" },
  { id: "4", name: "Luis García", cedula: "V-16.789.012", phone: "+58 426-1112233", visits: 1, lastVisit: "03 Ene 2025", initials: "LG" },
  { id: "5", name: "Sofía Martínez", cedula: "V-19.345.678", phone: "+58 412-7778899", visits: 5, lastVisit: "29 Dic 2024", initials: "SM" },
  { id: "6", name: "Pedro Jiménez", cedula: "V-13.456.789", phone: "+58 414-3334455", visits: 2, lastVisit: "20 Dic 2024", initials: "PJ" },
  { id: "7", name: "Laura Torres", cedula: "V-17.890.123", phone: "+58 424-6667788", visits: 7, lastVisit: "15 Dic 2024", initials: "LT" },
  { id: "8", name: "Roberto Díaz", cedula: "V-15.234.567", phone: "+58 416-9990011", visits: 4, lastVisit: "10 Dic 2024", initials: "RD" },
];

function getVisitLabel(n: number) {
  if (n >= 10) return { label: `${n} visitas`, color: "bg-primary-light text-primary" };
  if (n >= 5) return { label: `${n} visitas`, color: "bg-accent-light text-accent" };
  return { label: `${n} visita${n !== 1 ? "s" : ""}`, color: "bg-muted text-muted-foreground" };
}

const avatarColors = [
  "gradient-primary",
  "gradient-accent",
  "gradient-primary",
  "gradient-accent",
];

// Desktop table row
function TableRow({ p, navigate, idx }: { p: typeof patients[0]; navigate: (s: string) => void; idx: number }) {
  const visit = getVisitLabel(p.visits);
  const color = avatarColors[idx % avatarColors.length];
  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", color)}>
            {p.initials}
          </div>
          <span className="text-sm font-semibold text-foreground">{p.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{p.cedula}</td>
      <td className="px-4 py-3">
        <a
          href={`https://wa.me/${p.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors group"
        >
          <MessageCircle size={14} className="text-accent group-hover:scale-110 transition-transform" />
          {p.phone}
        </a>
      </td>
      <td className="px-4 py-3">
        <span className={cn("badge-primary text-xs", visit.color)}>{visit.label}</span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{p.lastVisit}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => navigate(`/admin/patients/${p.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Eye size={12} />
          Ver Historial
        </button>
      </td>
    </tr>
  );
}

// Mobile card
function PatientCard({ p, navigate, idx }: { p: typeof patients[0]; navigate: (s: string) => void; idx: number }) {
  const visit = getVisitLabel(p.visits);
  const color = avatarColors[idx % avatarColors.length];
  return (
    <div className="medical-card p-4 animate-fade-in" style={{ animationDelay: `${idx * 0.04}s` }}>
      <div className="flex items-start gap-3">
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0", color)}>
          {p.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground">{p.name}</p>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", visit.color)}>{visit.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{p.cedula}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Última visita: {p.lastVisit}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <a
          href={`https://wa.me/${p.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent-light text-accent text-xs font-semibold hover:opacity-80 transition-opacity"
        >
          <MessageCircle size={13} />
          WhatsApp
        </a>
        <button
          onClick={() => navigate(`/admin/patients/${p.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl gradient-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Eye size={13} />
          Ver Historial
        </button>
      </div>
    </div>
  );
}

export default function PatientsDirectory() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.cedula.includes(query) ||
    p.phone.includes(query)
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">Pacientes</h1>
            <p className="text-xs text-muted-foreground">{patients.length} registros totales</p>
          </div>
          <div className="badge-primary text-xs">{filtered.length} resultados</div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, cédula o teléfono..."
            className="pl-9 h-11 rounded-xl bg-muted border-0 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Mobile: Cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((p, i) => (
            <PatientCard key={p.id} p={p} navigate={navigate} idx={i} />
          ))}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block">
          <div className="medical-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paciente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cédula</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Consultas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Última Visita</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <TableRow key={p.id} p={p} navigate={navigate} idx={i} />
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No se encontraron pacientes para "<span className="font-medium">{query}</span>"
              </div>
            )}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="md:hidden py-12 text-center text-muted-foreground text-sm">
            No se encontraron pacientes
          </div>
        )}
      </div>
    </div>
  );
}
