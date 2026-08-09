import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface AntecedentesForm {
  lugarNacimiento: string;
  menarquia: string;
  irs: string;
  parejasSexuales: string;
  gestas: string;
  partos: string;
  cesareas: string;
  abortos: string;
  embarazoEctopico: string;
  fum: string;
  fechaUltimaCitologia: string;
  cirugiasPrevias: string;
  alergias: string;
  antecedentesPatologicos: string;
}

export const ANTECEDENTES_VACIO: AntecedentesForm = {
  lugarNacimiento: "", menarquia: "", irs: "", parejasSexuales: "",
  gestas: "", partos: "", cesareas: "", abortos: "", embarazoEctopico: "",
  fum: "", fechaUltimaCitologia: "", cirugiasPrevias: "", alergias: "", antecedentesPatologicos: "",
};

/** Inversa de buildMedicalBackground: precarga el formulario a partir de lo que ya tenga la paciente. */
export function parseMedicalBackground(bg: Record<string, unknown> | null | undefined): AntecedentesForm {
  const g = (bg?.antecedentesGinecoObs || {}) as Record<string, unknown>;
  const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));
  return {
    lugarNacimiento: str(bg?.lugarNacimiento),
    menarquia: str(g.menarquia),
    irs: str(g.irs),
    parejasSexuales: str(g.parejasSexuales),
    gestas: str(g.gestas),
    partos: str(g.partos),
    cesareas: str(g.cesareas),
    abortos: str(g.abortos),
    embarazoEctopico: str(g.embarazoEctopico),
    fum: str(g.fum),
    fechaUltimaCitologia: str(g.fechaUltimaCitologia),
    cirugiasPrevias: str(bg?.cirugiasPrevias),
    alergias: str(bg?.alergias),
    antecedentesPatologicos: str(bg?.antecedentesPatologicos),
  };
}

/** Arma el medical_background JSONB a partir del formulario plano. Omite campos vacíos. */
export function buildMedicalBackground(a: AntecedentesForm): Record<string, unknown> {
  const gineco: Record<string, unknown> = {};
  if (a.menarquia) gineco.menarquia = Number(a.menarquia);
  if (a.irs) gineco.irs = Number(a.irs);
  if (a.parejasSexuales) gineco.parejasSexuales = Number(a.parejasSexuales);
  if (a.gestas) gineco.gestas = Number(a.gestas);
  if (a.partos) gineco.partos = Number(a.partos);
  if (a.cesareas) gineco.cesareas = Number(a.cesareas);
  if (a.abortos) gineco.abortos = Number(a.abortos);
  if (a.embarazoEctopico) gineco.embarazoEctopico = a.embarazoEctopico;
  if (a.fum) gineco.fum = a.fum;
  if (a.fechaUltimaCitologia) gineco.fechaUltimaCitologia = a.fechaUltimaCitologia;

  const bg: Record<string, unknown> = {};
  if (a.lugarNacimiento) bg.lugarNacimiento = a.lugarNacimiento;
  if (a.cirugiasPrevias) bg.cirugiasPrevias = a.cirugiasPrevias;
  if (a.alergias) bg.alergias = a.alergias;
  if (a.antecedentesPatologicos) bg.antecedentesPatologicos = a.antecedentesPatologicos;
  if (Object.keys(gineco).length) bg.antecedentesGinecoObs = gineco;
  return bg;
}

interface Props {
  value: AntecedentesForm;
  onChange: (v: AntecedentesForm) => void;
}

/** Antecedentes que la Dra. Arteaga pregunta a toda paciente nueva. */
export function PatientAntecedentesFields({ value, onChange }: Props) {
  const set = (field: keyof AntecedentesForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [field]: e.target.value });

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Antecedentes</p>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Lugar de nacimiento</Label><Input value={value.lugarNacimiento} onChange={set("lugarNacimiento")} /></div>
        <div><Label>Menarquia (edad)</Label><Input type="number" value={value.menarquia} onChange={set("menarquia")} /></div>
        <div><Label>1ra relación (edad)</Label><Input type="number" value={value.irs} onChange={set("irs")} /></div>
        <div><Label>N° de parejas sexuales</Label><Input type="number" value={value.parejasSexuales} onChange={set("parejasSexuales")} /></div>
        <div><Label>Gestas</Label><Input type="number" value={value.gestas} onChange={set("gestas")} /></div>
        <div><Label>Partos</Label><Input type="number" value={value.partos} onChange={set("partos")} /></div>
        <div><Label>Cesáreas</Label><Input type="number" value={value.cesareas} onChange={set("cesareas")} /></div>
        <div><Label>Abortos</Label><Input type="number" value={value.abortos} onChange={set("abortos")} /></div>
        <div><Label>Embarazo ectópico</Label><Input value={value.embarazoEctopico} onChange={set("embarazoEctopico")} placeholder="Niega / detalle" /></div>
        <div><Label>Fecha última regla</Label><Input type="date" value={value.fum} onChange={set("fum")} /></div>
        <div className="col-span-2"><Label>Fecha última citología</Label><Input type="date" value={value.fechaUltimaCitologia} onChange={set("fechaUltimaCitologia")} /></div>
      </div>
      <div><Label>Antecedentes quirúrgicos</Label><Textarea value={value.cirugiasPrevias} onChange={set("cirugiasPrevias")} rows={2} /></div>
      <div><Label>Alergias</Label><Input value={value.alergias} onChange={set("alergias")} /></div>
      <div><Label>Antecedentes patológicos</Label><Textarea value={value.antecedentesPatologicos} onChange={set("antecedentesPatologicos")} rows={2} /></div>
    </div>
  );
}
