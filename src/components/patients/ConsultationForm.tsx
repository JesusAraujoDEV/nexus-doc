import { useState } from "react";
import { ChevronLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RecipeItem, openClinicalRecordPdf } from "@/lib/clinical-records-api";
import { ConsultationPrincipalFields } from "@/components/patients/ConsultationPrincipalFields";
import { RecipeItemsEditor } from "@/components/patients/RecipeItemsEditor";
import { UltrasoundFieldsEditor, UltrasoundValues } from "@/components/patients/UltrasoundFieldsEditor";

type Tab = "principal" | "recipe" | "ultrasonido";
const TABS: { key: Tab; label: string }[] = [
  { key: "principal", label: "Principal" },
  { key: "recipe", label: "Récipe" },
  { key: "ultrasonido", label: "Ultrasonido" },
];

export interface ConsultationFormValues {
  visitType: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  labOrders: string;
  privateNotes: string;
  nextAppointmentDate: string;
  recipeItems: RecipeItem[];
  ultrasound: UltrasoundValues;
}

interface Props {
  title: string;
  initialValues: ConsultationFormValues;
  onBack: () => void;
  onSubmit: (values: ConsultationFormValues) => void;
  submitting: boolean;
  submitLabel: string;
  /** Solo en edición: ya existe una fila guardada, así que se puede imprimir. */
  recordId?: string;
}

function PrintButton({ recordId, kind, label }: { recordId: string; kind: "prescription" | "ultrasound"; label: string }) {
  return (
    <button
      type="button"
      onClick={() => openClinicalRecordPdf(recordId, kind)}
      className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mb-2"
    >
      <Printer size={14} />{label}
    </button>
  );
}

/**
 * Cuerpo de "nueva consulta" / "editar consulta": misma vista para las dos, solo
 * cambia si arranca vacía o precargada y qué hace el submit. Página propia (no
 * modal) con tabs horizontales porque la consulta real tiene demasiados módulos
 * (motivo/diagnóstico, récipe, ultrasonido) para un modal con scroll infinito.
 */
export function ConsultationForm({ title, initialValues, onBack, onSubmit, submitting, submitLabel, recordId }: Props) {
  const [tab, setTab] = useState<Tab>("principal");
  const [form, setForm] = useState(initialValues);
  const [diagnosisMissing, setDiagnosisMissing] = useState(false);

  // El diagnóstico es obligatorio pero su campo vive en el tab "Principal" - si la
  // doctora está en Récipe/Ultrasonido y le da guardar, el submit fallaba en
  // silencio (un toast que nadie conecta con "te falta llenar otra pestaña").
  // Ahora se valida ANTES de mandar, y si falta, salta directo a esa pestaña.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.diagnosis.trim()) {
      setTab("principal");
      setDiagnosisMissing(true);
      return;
    }
    setDiagnosisMissing(false);
    onSubmit(form);
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10 space-y-3">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} />Volver a la paciente
        </button>
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col" noValidate>
        <div className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-4">
          {tab === "principal" && (
            <ConsultationPrincipalFields
              form={form}
              onChange={setForm}
              diagnosisMissing={diagnosisMissing}
              onDiagnosisEdited={() => setDiagnosisMissing(false)}
            />
          )}
          {tab === "recipe" && (
            <>
              {recordId && <PrintButton recordId={recordId} kind="prescription" label="Imprimir récipe" />}
              <RecipeItemsEditor items={form.recipeItems} onChange={(recipeItems) => setForm((f) => ({ ...f, recipeItems }))} />
            </>
          )}
          {tab === "ultrasonido" && (
            <>
              {recordId && <PrintButton recordId={recordId} kind="ultrasound" label="Imprimir ecografía" />}
              <UltrasoundFieldsEditor values={form.ultrasound} onChange={(ultrasound) => setForm((f) => ({ ...f, ultrasound }))} />
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}
