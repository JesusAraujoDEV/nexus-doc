import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClinicalRecord, RecipeItem } from "@/lib/patients-api";
import { useToast } from "@/components/ui/use-toast";
import { VisitTypeCombobox } from "@/components/patients/VisitTypeCombobox";
import { RecipeItemsEditor } from "@/components/patients/RecipeItemsEditor";
import { UltrasoundFieldsEditor, UltrasoundValues } from "@/components/patients/UltrasoundFieldsEditor";

type Tab = "principal" | "recipe" | "ultrasonido";
const TABS: { key: Tab; label: string }[] = [
  { key: "principal", label: "Principal" },
  { key: "recipe", label: "Récipe" },
  { key: "ultrasonido", label: "Ultrasonido" },
];

/**
 * Crear consulta como página propia (no modal): la consulta real de la doctora
 * tiene demasiados módulos (motivo/diagnóstico, récipe, ultrasonido) para caber
 * en un modal con scroll infinito. Navega por tabs horizontales, un solo submit.
 */
export default function NewConsultationPage() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("principal");

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    visitType: "", visitDate: today, symptoms: "", diagnosis: "", treatment: "", labOrders: "", privateNotes: "",
  });
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);
  const [ultrasound, setUltrasound] = useState<UltrasoundValues>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const mutation = useMutation({
    mutationFn: () =>
      createClinicalRecord({
        patientId: patientId as string,
        visitType: form.visitType || undefined,
        visitDate: form.visitDate || undefined,
        symptoms: form.symptoms || undefined,
        diagnosis: form.diagnosis || undefined,
        treatment: form.treatment || undefined,
        labOrders: form.labOrders || undefined,
        privateNotes: form.privateNotes || undefined,
        recipeItems: recipeItems.filter((i) => i.nombre?.trim()).length ? recipeItems.filter((i) => i.nombre?.trim()) : undefined,
        ultrasoundFindings: Object.keys(ultrasound).length ? ultrasound : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      toast({ title: "Consulta creada" });
      navigate(`/admin/patients/${patientId}`);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10 space-y-3">
        <button
          onClick={() => navigate(`/admin/patients/${patientId}`)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />Volver a la paciente
        </button>
        <h1 className="text-lg font-bold text-foreground">Nueva consulta</h1>
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

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="flex-1 flex flex-col">
        <div className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-4">
          {tab === "principal" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Tipo de consulta</Label><VisitTypeCombobox value={form.visitType} onChange={(v) => setForm((f) => ({ ...f, visitType: v }))} /></div>
                <div><Label htmlFor="nc-date">Fecha</Label><Input id="nc-date" type="date" value={form.visitDate} onChange={set("visitDate")} /></div>
              </div>
              <div><Label htmlFor="nc-symp">Motivo</Label><Textarea id="nc-symp" value={form.symptoms} onChange={set("symptoms")} rows={2} /></div>
              <div><Label htmlFor="nc-diag">Diagnóstico *</Label><Textarea id="nc-diag" value={form.diagnosis} onChange={set("diagnosis")} rows={2} required /></div>
              <div><Label htmlFor="nc-treat">Tratamiento</Label><Textarea id="nc-treat" value={form.treatment} onChange={set("treatment")} rows={3} /></div>
              <div><Label htmlFor="nc-lab">Examenes indicados</Label><Textarea id="nc-lab" value={form.labOrders} onChange={set("labOrders")} rows={2} /></div>
              <div><Label htmlFor="nc-notes">Observaciones</Label><Textarea id="nc-notes" value={form.privateNotes} onChange={set("privateNotes")} rows={2} /></div>
            </>
          )}
          {tab === "recipe" && <RecipeItemsEditor items={recipeItems} onChange={setRecipeItems} />}
          {tab === "ultrasonido" && <UltrasoundFieldsEditor values={ultrasound} onChange={setUltrasound} />}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/patients/${patientId}`)}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Guardando..." : "Guardar consulta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
