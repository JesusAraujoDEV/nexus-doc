import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecipeItem } from "@/lib/clinical-records-api";
import { MedicalCertificateForm } from "@/lib/consultation-extras";
import { ConsultationFormHeader, ConsultationTab } from "@/components/patients/ConsultationFormHeader";
import { ConsultationPrincipalFields } from "@/components/patients/ConsultationPrincipalFields";
import { ConsultationPrintButton as PrintButton } from "@/components/patients/ConsultationPrintButton";
import { RecipeItemsEditor } from "@/components/patients/RecipeItemsEditor";
import { UltrasoundFieldsEditor, UltrasoundValues } from "@/components/patients/UltrasoundFieldsEditor";
import { PregnancyPicker } from "@/components/patients/PregnancyPicker";
import { LabExamsTab } from "@/components/patients/LabExamsTab";
import { GeneralUltrasoundTab } from "@/components/patients/GeneralUltrasoundTab";
import { MedicalReportsTab } from "@/components/patients/MedicalReportsTab";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";

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
  diagnosticImpressions: string[];
  evolution: string;
  recommendations: string;
  medicalCertificate: MedicalCertificateForm;
}

interface Props {
  title: string;
  patientId: string;
  /**
   * Se leen UNA vez al montar (el form es estado local de edición). Para cargar
   * otros valores el padre remonta el form con otra `key`; así un refetch en
   * segundo plano nunca pisa lo que la doctora está escribiendo.
   */
  initialValues: ConsultationFormValues;
  initialTab?: ConsultationTab;
  onBack: () => void;
  onSubmit: (values: ConsultationFormValues) => void;
  /** Solo en consulta nueva: guarda y reabre la consulta en "Adjuntos". */
  onSubmitAndAttach?: (values: ConsultationFormValues) => void;
  submitting: boolean;
  submitLabel: string;
  /** Solo en edición: ya existe una fila guardada, así que se puede imprimir y adjuntar. */
  recordId?: string;
}

/**
 * Cuerpo de "nueva consulta" / "editar consulta": misma vista para las dos, solo
 * cambia si arranca vacía o precargada y qué hace el submit. Página propia (no
 * modal) con tabs horizontales porque la consulta real tiene demasiados módulos
 * (motivo/diagnóstico, récipe, ultrasonido) para un modal con scroll infinito.
 */
export function ConsultationForm({ title, patientId, initialValues, initialTab = "principal", onBack, onSubmit, onSubmitAndAttach, submitting, submitLabel, recordId }: Props) {
  const [tab, setTab] = useState<ConsultationTab>(initialTab);
  const [form, setForm] = useState(initialValues);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
            <PregnancyPicker
              patientId={patientId}
              pregnancyId={form.pregnancyId}
              autoSelectActive={!recordId}
              onChange={(pregnancyId) => setForm((f) => ({ ...f, pregnancyId }))}
            />
          )}
          {tab === "principal" && (
            <ConsultationPrincipalFields form={form} onChange={setForm} />
          )}
          {tab === "recipe" && (
            <>
              {recordId && <PrintButton recordId={recordId} kind="prescription" label="Imprimir récipe" defaultDate={form.visitDate} />}
              <RecipeItemsEditor items={form.recipeItems} onChange={(recipeItems) => setForm((f) => ({ ...f, recipeItems }))} />
            </>
          )}
          {tab === "ultrasonido" && (
            <>
              {recordId && <PrintButton recordId={recordId} kind="ultrasound" label="Imprimir ecografía" defaultDate={form.visitDate} />}
              <UltrasoundFieldsEditor category={form.category} values={form.ultrasound} onChange={(ultrasound) => setForm((f) => ({ ...f, ultrasound }))} />
            </>
          )}
          {tab === "labExams" && (
            <>
              {recordId && <PrintButton recordId={recordId} kind="lab-exam" label="Imprimir exámenes de laboratorio" defaultDate={form.visitDate} />}
              <LabExamsTab
                patientId={patientId}
                recordId={recordId}
                indicatesPrescription={form.indicatesPrescription}
                indicatesImagingStudy={form.indicatesImagingStudy}
                onChangeFlags={(flags) => setForm((f) => ({ ...f, ...flags }))}
              />
            </>
          )}
          {tab === "generalUltrasound" && (
            <>
              {recordId && <PrintButton recordId={recordId} kind="general-ultrasound" label="Imprimir ultrasonido general" defaultDate={form.visitDate} />}
              <GeneralUltrasoundTab recordId={recordId} />
            </>
          )}
          {tab === "medicalReports" && <MedicalReportsTab patientId={patientId} recordId={recordId} />}
          {tab === "attachments" && (
            <AttachmentsSection
              recordId={recordId}
              onSaveFirst={onSubmitAndAttach ? () => onSubmitAndAttach(form) : undefined}
              saving={submitting}
            />
          )}
        </div>

        {/* En teléfono la barra queda encima de la .bottom-nav fija (≈4rem + safe area). */}
        <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 z-20 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" className="h-11 md:h-10" onClick={onBack}>Cancelar</Button>
          <Button type="submit" className="h-11 md:h-10" disabled={submitting}>{submitting ? "Guardando..." : submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}
