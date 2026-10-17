import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicalCertificateForm } from "@/lib/consultation-extras";

interface Props {
  value: MedicalCertificateForm;
  onChange: (v: MedicalCertificateForm) => void;
}

/**
 * Constancia guardada en la propia consulta (campo `medicalCertificate`, viene
 * del legacy). Distinta de las constancias emitidas como informe en la pestaña
 * "Informes/Constancias", que son documentos aparte con su PDF.
 */
export function MedicalCertificateFields({ value, onChange }: Props) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">Constancia médica</p>
      <div>
        <Label htmlFor="mc-diag">Diagnóstico de la constancia</Label>
        <Textarea id="mc-diag" rows={2} maxLength={2000} value={value.diagnostico} onChange={(e) => onChange({ ...value, diagnostico: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="mc-motivo">Motivo</Label>
        <Input id="mc-motivo" maxLength={2000} placeholder="Ej: Control prenatal" value={value.motivo} onChange={(e) => onChange({ ...value, motivo: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:items-end">
        <label htmlFor="mc-reposo" className="flex items-center gap-3 min-h-11 md:min-h-10 text-sm cursor-pointer">
          <Checkbox id="mc-reposo" className="h-5 w-5" checked={value.reposo} onCheckedChange={(v) => onChange({ ...value, reposo: v === true })} />
          Se indica reposo
        </label>
        <div>
          <Label htmlFor="mc-dias">Días de reposo</Label>
          <Input
            id="mc-dias"
            type="number"
            inputMode="numeric"
            min={0}
            max={365}
            step={1}
            disabled={!value.reposo}
            value={value.diasReposo}
            onChange={(e) => onChange({ ...value, diasReposo: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
