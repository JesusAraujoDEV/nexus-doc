import { PatientDetail } from "@/lib/patients-api";

const REFERRED_LABELS: Record<string, string> = {
  redes: "Redes sociales",
  otro_doctor: "Referido por otro doctor",
  colega: "Colega",
  amigo: "Amigo/familiar",
  otro: "Otro",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-lg p-2.5 text-center">
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

/** Datos básicos que no caben en el header fijo: peso/talla y cómo llegó la paciente. */
export function PatientInfoTab({ p }: { p: PatientDetail }) {
  const hasVitals = p.weightKg != null || p.heightCm != null;
  const referredLabel = p.referredByType ? REFERRED_LABELS[p.referredByType] : null;
  const isEmpty = !hasVitals && !referredLabel && !p.referredByDetail;

  if (isEmpty) {
    return <div className="medical-card p-4 text-sm text-muted-foreground text-center">Sin datos adicionales.</div>;
  }

  return (
    <div className="medical-card p-4 space-y-3">
      {hasVitals && (
        <div className="grid grid-cols-2 gap-2">
          {p.weightKg != null && <Stat label="Peso (kg)" value={String(p.weightKg)} />}
          {p.heightCm != null && <Stat label="Talla (cm)" value={String(p.heightCm)} />}
        </div>
      )}
      {(referredLabel || p.referredByDetail) && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Cómo llegó</p>
          <p className="text-sm text-foreground">
            {referredLabel}
            {p.referredByDetail && <span className="text-muted-foreground"> — {p.referredByDetail}</span>}
          </p>
        </div>
      )}
    </div>
  );
}
