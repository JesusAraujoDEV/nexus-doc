import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AntecedentesForm } from "@/lib/medical-background";
import { AntecedentesPersonalesEditor } from "@/components/patients/AntecedentesPersonalesEditor";

interface Props {
  value: AntecedentesForm;
  onChange: (v: AntecedentesForm) => void;
}

type TextField = Exclude<keyof AntecedentesForm, "antecedentesPersonales">;

/** Contadores gineco-obstétricos: van en input numérico con teclado numérico en el teléfono. */
const NUMERIC: [TextField, string][] = [
  ["menarquia", "Menarquia (edad)"], ["irs", "1ra relación (edad)"], ["parejasSexuales", "N° de parejas sexuales"],
  ["gestas", "Gestas"], ["partos", "Partos"], ["cesareas", "Cesáreas"], ["abortos", "Abortos"], ["ectopicos", "Ectópicos"],
];

/** Antecedentes que la Dra. Arteaga pregunta a toda paciente nueva. */
export function PatientAntecedentesFields({ value, onChange }: Props) {
  const set = (field: TextField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [field]: e.target.value });

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Antecedentes</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label htmlFor="ant-lugar">Lugar de nacimiento</Label><Input id="ant-lugar" value={value.lugarNacimiento} onChange={set("lugarNacimiento")} /></div>
        <div><Label htmlFor="ant-proc">Procedencia</Label><Input id="ant-proc" value={value.procedencia} onChange={set("procedencia")} /></div>
        {NUMERIC.map(([field, label]) => (
          <div key={field}>
            <Label htmlFor={`ant-${field}`}>{label}</Label>
            <Input id={`ant-${field}`} type="number" inputMode="numeric" min="0" value={value[field]} onChange={set(field)} />
          </div>
        ))}
        <div><Label htmlFor="ant-ecto-det">Embarazo ectópico (detalle)</Label><Input id="ant-ecto-det" value={value.embarazoEctopico} onChange={set("embarazoEctopico")} placeholder="Niega / detalle" /></div>
        <div><Label htmlFor="ant-fum">Fecha última regla</Label><Input id="ant-fum" type="date" value={value.fum} onChange={set("fum")} /></div>
        <div className="sm:col-span-2"><Label htmlFor="ant-cito">Fecha última citología</Label><Input id="ant-cito" type="date" value={value.fechaUltimaCitologia} onChange={set("fechaUltimaCitologia")} /></div>
      </div>
      <AntecedentesPersonalesEditor
        items={value.antecedentesPersonales}
        onChange={(antecedentesPersonales) => onChange({ ...value, antecedentesPersonales })}
      />
      <div><Label htmlFor="ant-quir">Antecedentes quirúrgicos</Label><Textarea id="ant-quir" value={value.cirugiasPrevias} onChange={set("cirugiasPrevias")} rows={2} /></div>
      <div><Label htmlFor="ant-alerg">Alergias</Label><Input id="ant-alerg" value={value.alergias} onChange={set("alergias")} /></div>
      <div><Label htmlFor="ant-pat">Antecedentes patológicos</Label><Textarea id="ant-pat" value={value.antecedentesPatologicos} onChange={set("antecedentesPatologicos")} rows={2} /></div>
    </div>
  );
}
