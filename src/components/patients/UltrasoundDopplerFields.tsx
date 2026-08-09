import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextField, FieldProps } from "./ultrasound-field-inputs";

/**
 * Doppler: sin catálogo histórico (nunca se usó en la migración legacy), así que
 * son campos de texto libre en vez de autocompletado con sugerencias.
 */
export function UltrasoundDopplerFields({ values, onChange }: FieldProps) {
  const p = { values, onChange };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Corazón" field="DOP-CORAZON" {...p} />
        <TextField label="Septus" field="DOP-SEPTUS" {...p} />
        <TextField label="Art. Uterina" field="DOP-ART-UT" {...p} />
        <TextField label="A. Umbilical" field="DOP-ART-UM" {...p} />
        <TextField label="A. Cerebral Media" field="DOP-ART-CER-MED" {...p} />
        <TextField label="Patrón Art. Pulmonar" field="DOP-PAT-ART-PULM" {...p} />
        <TextField label="Patrón Art. Umbilical" field="DOP-PAT-ART-UMB" {...p} />
        <TextField label="Ductus venoso" field="DOP-DUC-VEN" {...p} />
        <TextField label="Vaciamiento AV" field="DOP-VAC-AV" {...p} />
        <TextField label="Tricúspide" field="DOP-TRIC" {...p} />
        <TextField label="Mitral" field="DOP-MITR" {...p} />
        <TextField label="V. Cava Inf." field="DOP-VEN-CAV-INF" {...p} />
        <TextField label="Gradiente Ductus Art." field="DOP-GRAD-DUC-ART" {...p} />
        <TextField label="Índice Cerebro/Umbilical" field="DOP-IND-CER-UMB" {...p} />
      </div>
      <div>
        <Label>Otros hallazgos y Doppler</Label>
        <Textarea value={String(values["O-HALL-DOP"] ?? "")} onChange={(e) => onChange({ ...values, "O-HALL-DOP": e.target.value })} rows={2} />
      </div>
    </div>
  );
}
