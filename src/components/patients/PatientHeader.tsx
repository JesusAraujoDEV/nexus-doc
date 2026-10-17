import { useState } from "react";
import { MessageCircle, Phone, MapPin, Pencil, Trash2, Mail } from "lucide-react";
import { PatientDetail } from "@/lib/patients-api";
import { parseApiDate } from "@/lib/calendar-date";
import { EditPatientDialog } from "./EditPatientDialog";

/** Edad en años cumplidos, comparando año/mes/día locales (no milisegundos UTC). */
function ageFrom(birthDate: string | null) {
  if (!birthDate) return null;
  const birth = parseApiDate(birthDate);
  const today = new Date();
  const hadBirthday = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  return today.getFullYear() - birth.getFullYear() - (hadBirthday ? 0 : 1);
}

// ≥44px de alto en teléfono para que el link sea tocable; compacto desde md.
const CONTACT_LINK = "inline-flex items-center gap-1.5 min-h-11 md:min-h-0 hover:text-foreground transition-colors";

export function PatientHeader({ p, onDelete }: { p: PatientDetail; onDelete?: () => void }) {
  const [editing, setEditing] = useState(false);
  const name = `${p.firstName} ${p.lastName}`.trim();
  const initials = (p.firstName[0] || "") + (p.lastName[0] || "");
  const age = ageFrom(p.birthDate);

  return (
    <>
      <div className="medical-card p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <button onClick={() => setEditing(true)} className="h-11 w-11 md:h-8 md:w-8 shrink-0 flex items-center justify-center rounded hover:bg-muted transition-colors" title="Editar paciente" aria-label="Editar paciente">
                <Pencil size={16} className="text-muted-foreground" />
              </button>
              {onDelete && (
                <button onClick={onDelete} className="h-11 w-11 md:h-8 md:w-8 shrink-0 flex items-center justify-center rounded hover:bg-destructive/10 transition-colors" title="Eliminar paciente" aria-label="Eliminar paciente">
                  <Trash2 size={14} className="text-destructive" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
              {p.cedula && <span>C.I. {p.cedula}</span>}
              {age !== null && <span>{age} años</span>}
              {p.gender && <span>{p.gender}</span>}
            </div>
            {p.address && (
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground mt-2">
                <MapPin size={13} className="shrink-0 mt-0.5" />{p.address}
              </p>
            )}
            {(p.phoneSecondary || p.email) && (
              <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-muted-foreground">
                {p.phoneSecondary && (
                  <a href={`tel:${p.phoneSecondary.replace(/[^\d+]/g, "")}`} className={CONTACT_LINK} aria-label={`Llamar al teléfono secundario ${p.phoneSecondary}`}>
                    <Phone size={13} className="shrink-0" />{p.phoneSecondary}
                  </a>
                )}
                {p.email && (
                  <a href={`mailto:${p.email}`} className={`${CONTACT_LINK} min-w-0 break-all`}>
                    <Mail size={13} className="shrink-0" />{p.email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {p.phone && (
          <div className="flex gap-2 mt-4">
            <a href={`https://wa.me/${p.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent-light text-accent text-xs font-semibold hover:opacity-80 transition-opacity">
              <MessageCircle size={14} />WhatsApp
            </a>
            <a href={`tel:${p.phone.replace(/\D/g, "")}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary-light text-primary text-xs font-semibold hover:opacity-80 transition-opacity">
              <Phone size={14} />{p.phone}
            </a>
          </div>
        )}
      </div>

      <EditPatientDialog patient={p} open={editing} onOpenChange={setEditing} />
    </>
  );
}
