import { useState } from "react";
import { MessageCircle, Phone, MapPin, Pencil, Trash2 } from "lucide-react";
import { PatientDetail } from "@/lib/patients-api";
import { EditPatientDialog } from "./EditPatientDialog";

function ageFrom(birthDate: string | null) {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

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
              <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-muted transition-colors" title="Editar paciente">
                <Pencil size={14} className="text-muted-foreground" />
              </button>
              {onDelete && (
                <button onClick={onDelete} className="p-1 rounded hover:bg-destructive/10 transition-colors" title="Eliminar paciente">
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
