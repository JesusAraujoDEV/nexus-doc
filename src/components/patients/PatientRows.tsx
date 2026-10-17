import { MessageCircle, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PatientListItem } from "@/lib/patients-api";
import { formatApiDate } from "@/lib/calendar-date";

export function fullName(p: PatientListItem) {
  return `${p.firstName} ${p.lastName}`.trim();
}

function initials(p: PatientListItem) {
  return (p.firstName[0] || "") + (p.lastName[0] || "");
}

function formatDate(iso: string | null) {
  if (!iso) return "Sin consultas";
  return formatApiDate(iso, { day: "2-digit", month: "short", year: "numeric" });
}

function getVisitLabel(n: number) {
  if (n >= 10) return { label: `${n} visitas`, color: "bg-primary-light text-primary" };
  if (n >= 5) return { label: `${n} visitas`, color: "bg-accent-light text-accent" };
  return { label: `${n} visita${n !== 1 ? "s" : ""}`, color: "bg-muted text-muted-foreground" };
}

const avatarColors = ["gradient-primary", "gradient-accent", "gradient-primary", "gradient-accent"];

// Áreas táctiles: 44px en la tarjeta (teléfono), 40px en la tabla (tablet/escritorio).
const ICON_BTN_MOBILE = "h-11 w-11 flex items-center justify-center rounded-lg transition-colors";
const ICON_BTN_TABLE = "h-10 w-10 flex items-center justify-center rounded-lg transition-colors";

function WhatsAppLink({ phone, className, children }: { phone: string | null; className?: string; children: React.ReactNode }) {
  if (!phone) return <span className={cn(className, "opacity-40")}>{children}</span>;
  return (
    <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

interface RowProps {
  p: PatientListItem;
  navigate: (s: string) => void;
  idx: number;
  onEdit?: (p: PatientListItem) => void;
  onDelete?: (p: PatientListItem) => void;
  onNewConsultation?: (p: PatientListItem) => void;
}

export function PatientTableRow({ p, navigate, idx, onEdit, onDelete, onNewConsultation }: RowProps) {
  const visit = getVisitLabel(Number(p.visitsCount));
  const color = avatarColors[idx % avatarColors.length];
  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", color)}>
            {initials(p)}
          </div>
          <span className="text-sm font-semibold text-foreground">{fullName(p)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{p.cedula || "—"}</td>
      <td className="px-4 py-3">
        <WhatsAppLink phone={p.phone} className="flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors group">
          <MessageCircle size={14} className="text-accent group-hover:scale-110 transition-transform" />
          {p.phone || "Sin teléfono"}
        </WhatsAppLink>
      </td>
      <td className="px-4 py-3">
        <span className={cn("badge-primary text-xs", visit.color)}>{visit.label}</span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(p.lastVisit)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/patients/${p.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Eye size={12} />Ver
          </button>
          {onNewConsultation && (
            <button
              onClick={() => onNewConsultation(p)}
              title="Nueva consulta"
              aria-label="Nueva consulta"
              className={ICON_BTN_TABLE + " hover:bg-accent-light"}
            >
              <Plus size={16} className="text-accent" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(p)}
              title="Editar paciente"
              aria-label="Editar paciente"
              className={ICON_BTN_TABLE + " hover:bg-muted"}
            >
              <Pencil size={16} className="text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(p)}
              title="Eliminar paciente"
              aria-label="Eliminar paciente"
              className={ICON_BTN_TABLE + " hover:bg-destructive/10"}
            >
              <Trash2 size={16} className="text-destructive" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function PatientCard({ p, navigate, idx, onEdit, onDelete, onNewConsultation }: RowProps) {
  const visit = getVisitLabel(Number(p.visitsCount));
  const color = avatarColors[idx % avatarColors.length];
  return (
    <div className="medical-card p-4 animate-fade-in" style={{ animationDelay: `${idx * 0.04}s` }}>
      <div className="flex items-start gap-3">
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0", color)}>
          {initials(p)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground">{fullName(p)}</p>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", visit.color)}>{visit.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{p.cedula || "Sin cédula"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Última visita: {formatDate(p.lastVisit)}</p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {onNewConsultation && (
            <button onClick={() => onNewConsultation(p)} title="Nueva consulta" aria-label="Nueva consulta" className={ICON_BTN_MOBILE + " hover:bg-accent-light"}>
              <Plus size={18} className="text-accent" />
            </button>
          )}
          {onEdit && (
            <button onClick={() => onEdit(p)} title="Editar" aria-label="Editar paciente" className={ICON_BTN_MOBILE + " hover:bg-muted"}>
              <Pencil size={17} className="text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(p)} title="Eliminar" aria-label="Eliminar paciente" className={ICON_BTN_MOBILE + " hover:bg-destructive/10"}>
              <Trash2 size={17} className="text-destructive" />
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <WhatsAppLink
          phone={p.phone}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent-light text-accent text-xs font-semibold hover:opacity-80 transition-opacity"
        >
          <MessageCircle size={13} />
          WhatsApp
        </WhatsAppLink>
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
