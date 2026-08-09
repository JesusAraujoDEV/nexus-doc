import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CatalogField, NumberField, FieldProps } from "./ultrasound-field-inputs";
import { UltrasoundUteroFields } from "./UltrasoundUteroFields";
import { UltrasoundOvariosFields } from "./UltrasoundOvariosFields";
import { UltrasoundEmbarazoFields } from "./UltrasoundEmbarazoFields";

type SubTab = "utero" | "gestacion" | "anexos";
const SUBTABS: { key: SubTab; label: string }[] = [
  { key: "utero", label: "Cuerpo Uterino" },
  { key: "gestacion", label: "Gestación" },
  { key: "anexos", label: "Anexos" },
];

/** Ecografía obstétrica de 1er trimestre: saco gestacional, embrión, actividad cardíaca - todavía no hay biometría fetal real. */
export function UltrasoundObstetrico1erFields(p: FieldProps) {
  const [sub, setSub] = useState<SubTab>("utero");
  const { values, onChange } = p;

  return (
    <div className="space-y-4">
      <UltrasoundEmbarazoFields {...p} />
      <div className="flex gap-2 border-b border-border pb-2">
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

      {sub === "utero" && <UltrasoundUteroFields {...p} />}

      {sub === "gestacion" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Saco Gestacional</p>
            <div className="grid grid-cols-2 gap-3">
              <CatalogField label="Estado" field="SAC-GES" {...p} />
              <NumberField label="Dimensiones (mm)" field="SAC-GES-DIM-MM" {...p} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Embrión</p>
            <div className="grid grid-cols-2 gap-3">
              <CatalogField label="Estado" field="EMBRION" {...p} />
              <CatalogField label="Actividad Cardíaca" field="ACT-CARD" {...p} />
              <CatalogField label="Actividad Motora" field="ACT-MOT" {...p} />
              <CatalogField label="L.C.R" field="LCR" {...p} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Varios</p>
            <div className="grid grid-cols-2 gap-3">
              <CatalogField label="Placa Coriónica" field="PLACA-CORIONICA" {...p} />
              <CatalogField label="Localización" field="PLA-COR-LOC" {...p} />
              <CatalogField label="Saco Vitelino" field="SAC-VIT" {...p} />
            </div>
          </div>
        </div>
      )}

      {sub === "anexos" && (
        <div className="space-y-4">
          <UltrasoundOvariosFields {...p} />
          <div>
            <Label>Otros hallazgos y Doppler</Label>
            <Textarea value={String(values["O-HALL-DOP"] ?? "")} onChange={(e) => onChange({ ...values, "O-HALL-DOP": e.target.value })} rows={2} />
          </div>
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
