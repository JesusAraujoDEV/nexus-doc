import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RecipeItem } from "@/lib/clinical-records-api";
import { VisitTypeCombobox } from "@/components/patients/VisitTypeCombobox";
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
}

/**
 * Cuerpo de "nueva consulta" / "editar consulta": misma vista para las dos, solo
 * cambia si arranca vacía o precargada y qué hace el submit. Página propia (no
 * modal) con tabs horizontales porque la consulta real tiene demasiados módulos
 * (motivo/diagnóstico, récipe, ultrasonido) para un modal con scroll infinito.
 */
export function ConsultationForm({ title, initialValues, onBack, onSubmit, submitting, submitLabel }: Props) {
  const [tab, setTab] = useState<Tab>("principal");
  const [form, setForm] = useState(initialValues);

  const set = (field: keyof ConsultationFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

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

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex-1 flex flex-col">
        <div className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-4">
          {tab === "principal" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Tipo de consulta</Label><VisitTypeCombobox value={form.visitType} onChange={(v) => setForm((f) => ({ ...f, visitType: v }))} /></div>
                <div><Label htmlFor="cf-date">Fecha</Label><Input id="cf-date" type="date" value={form.visitDate} onChange={set("visitDate")} /></div>
              </div>
              <div><Label htmlFor="cf-symp">Motivo</Label><Textarea id="cf-symp" value={form.symptoms} onChange={set("symptoms")} rows={2} /></div>
              <div><Label htmlFor="cf-diag">Diagnóstico *</Label><Textarea id="cf-diag" value={form.diagnosis} onChange={set("diagnosis")} rows={2} required /></div>
              <div><Label htmlFor="cf-treat">Tratamiento</Label><Textarea id="cf-treat" value={form.treatment} onChange={set("treatment")} rows={3} /></div>
              <div><Label htmlFor="cf-lab">Examenes indicados</Label><Textarea id="cf-lab" value={form.labOrders} onChange={set("labOrders")} rows={2} /></div>
              <div><Label htmlFor="cf-notes">Observaciones</Label><Textarea id="cf-notes" value={form.privateNotes} onChange={set("privateNotes")} rows={2} /></div>
              <div><Label htmlFor="cf-next">Próxima consulta</Label><Input id="cf-next" type="date" value={form.nextAppointmentDate} onChange={set("nextAppointmentDate")} /></div>
            </>
          )}
          {tab === "recipe" && <RecipeItemsEditor items={form.recipeItems} onChange={(recipeItems) => setForm((f) => ({ ...f, recipeItems }))} />}
          {tab === "ultrasonido" && <UltrasoundFieldsEditor values={form.ultrasound} onChange={(ultrasound) => setForm((f) => ({ ...f, ultrasound }))} />}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}
