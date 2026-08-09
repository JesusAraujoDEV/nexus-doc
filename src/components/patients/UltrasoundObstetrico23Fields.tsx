import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CatalogField, FieldProps } from "./ultrasound-field-inputs";
import { UltrasoundEmbarazoFields } from "./UltrasoundEmbarazoFields";
import { UltrasoundEstaticaFetalFields } from "./UltrasoundEstaticaFetalFields";
import { UltrasoundBiometriaFetalFields } from "./UltrasoundBiometriaFetalFields";
import { UltrasoundDopplerFields } from "./UltrasoundDopplerFields";

type SubTab = "estatica" | "biometria" | "anexos" | "doppler";
const SUBTABS: { key: SubTab; label: string }[] = [
  { key: "estatica", label: "Estática fetal" },
  { key: "biometria", label: "Biometría fetal" },
  { key: "anexos", label: "Anexos" },
  { key: "doppler", label: "Doppler" },
];

/** Ecografía obstétrica de 2do/3er trimestre: misma vista para ambos trimestres (biometría fetal completa). */
export function UltrasoundObstetrico23Fields(p: FieldProps) {
  const [sub, setSub] = useState<SubTab>("estatica");
  const { values, onChange } = p;

  const trimestre = Number(values.TRIMESTRE) === 3 ? 3 : 2;

  return (
    <div className="space-y-4">
      <UltrasoundEmbarazoFields {...p} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Trimestre</p>
        <div className="flex gap-2">
          {([[2, "2do trimestre"], [3, "3er trimestre"]] as [number, string][]).map(([t, label]) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...values, TRIMESTRE: t })}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                trimestre === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 border-b border-border pb-2 flex-wrap">
        {SUBTABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSub(t.key)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              sub === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === "estatica" && <UltrasoundEstaticaFetalFields {...p} />}
      {sub === "biometria" && <UltrasoundBiometriaFetalFields {...p} />}
      {sub === "doppler" && <UltrasoundDopplerFields {...p} />}
      {sub === "anexos" && (
        <div className="space-y-4">
          <CatalogField label="IDx fetal (impresión diagnóstica)" field="IDX-FET-TXT" {...p} />
          <div>
            <Label>Observaciones y recomendaciones</Label>
            <Textarea value={String(values.OBS ?? "")} onChange={(e) => onChange({ ...values, OBS: e.target.value })} rows={2} />
          </div>
        </div>
      )}
    </div>
  );
}
