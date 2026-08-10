import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeItem, openClinicalRecordPdf } from "@/lib/clinical-records-api";
import { ConsultationFormHeader, ConsultationTab } from "@/components/patients/ConsultationFormHeader";
import { ConsultationPrincipalFields } from "@/components/patients/ConsultationPrincipalFields";
import { RecipeItemsEditor } from "@/components/patients/RecipeItemsEditor";
import { UltrasoundFieldsEditor, UltrasoundValues } from "@/components/patients/UltrasoundFieldsEditor";
import { PregnancyPicker } from "@/components/patients/PregnancyPicker";
import { LabExamsTab } from "@/components/patients/LabExamsTab";
import { GeneralUltrasoundTab } from "@/components/patients/GeneralUltrasoundTab";

export type ConsultationCategory = "gynecology" | "obstetrics";

export interface ConsultationFormValues {
  category: ConsultationCategory;
  pregnancyId: string;
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
  indicatesPrescription: boolean;
  indicatesImagingStudy: boolean;
}

interface Props {
  title: string;
  patientId: string;
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
export function ConsultationForm({ title, patientId, initialValues, onBack, onSubmit, submitting, submitLabel, recordId }: Props) {
  const [tab, setTab] = useState<ConsultationTab>("principal");
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
      <ConsultationFormHeader
        title={title}
        onBack={onBack}
        category={form.category}
        onCategoryChange={(category) => setForm((f) => ({ ...f, category }))}
        tab={tab}
        onTabChange={setTab}
      />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col" noValidate>
        <div className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-4">
          {form.category === "obstetrics" && (
            <PregnancyPicker patientId={patientId} pregnancyId={form.pregnancyId} onChange={(pregnancyId) => setForm((f) => ({ ...f, pregnancyId }))} />
          )}
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
              <UltrasoundFieldsEditor category={form.category} values={form.ultrasound} onChange={(ultrasound) => setForm((f) => ({ ...f, ultrasound }))} />
            </>
          )}
          {tab === "labExams" && (
            <LabExamsTab
              patientId={patientId}
              recordId={recordId}
              indicatesPrescription={form.indicatesPrescription}
              indicatesImagingStudy={form.indicatesImagingStudy}
              onChangeFlags={(flags) => setForm((f) => ({ ...f, ...flags }))}
            />
          )}
          {tab === "generalUltrasound" && <GeneralUltrasoundTab recordId={recordId} />}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}
