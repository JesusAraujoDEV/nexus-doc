import { PatientDetail } from "@/lib/patients-api";
import { AntecedentePersonal, parseMedicalBackground } from "@/lib/medical-background";

interface Gineco {
  menarquia?: number; irs?: number; gestas?: number;
  partos?: number; cesareas?: number; abortos?: number; ectopicos?: number;
}

function PersonalesList({ items }: { items: AntecedentePersonal[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Antecedentes personales</p>
      <ul className="space-y-0.5">
        {items.map((a, i) => (
          <li key={`${a.cie9 ?? ""}-${i}`} className="text-sm text-foreground">
            {a.titulo}
            {a.cie9 && <span className="ml-1.5 text-[11px] text-muted-foreground">CIE-9 {a.cie9}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value?: unknown }) {
  if (typeof value !== "string" || !value.trim()) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function GinecoRow({ g }: { g: Gineco }) {
  const items: [string, number | undefined][] = [
    ["Menarquia", g.menarquia], ["1ra Rel.", g.irs], ["Gestas", g.gestas],
    ["Partos", g.partos], ["Cesáreas", g.cesareas], ["Abortos", g.abortos], ["Ectópicos", g.ectopicos],
  ];
  const present = items.filter(([, v]) => v !== undefined && v !== null);
  if (present.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Antecedentes gineco-obstétricos</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {present.map(([label, v]) => (
          <div key={label} className="bg-muted rounded-lg p-2 text-center">
            <p className="text-base font-bold text-foreground">{v}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MedicalBackground({ p }: { p: PatientDetail }) {
  const bg = (p.medicalBackground || {}) as Record<string, unknown>;
  const habitos = bg.habitos as Record<string, string> | undefined;
  const gineco = bg.antecedentesGinecoObs as Gineco | undefined;

  const personales = parseMedicalBackground(bg).antecedentesPersonales;

  const isEmpty = !bg.notas && !bg.alergias && !bg.cirugiasPrevias && !bg.ocupacion && !gineco && !habitos && !personales.length;
  if (isEmpty) {
    return <div className="medical-card p-4 text-sm text-muted-foreground text-center">Sin antecedentes registrados.</div>;
  }

  return (
    <div className="medical-card p-4 space-y-3">
      <TextBlock label="Ocupación" value={bg.ocupacion} />
      {gineco && <GinecoRow g={gineco} />}
      <PersonalesList items={personales} />
      <TextBlock label="Alergias" value={bg.alergias} />
      <TextBlock label="Cirugías previas" value={bg.cirugiasPrevias} />
      <TextBlock label="Notas" value={bg.notas} />
      {habitos && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Hábitos</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(habitos).map(([k, v]) => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
