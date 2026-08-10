import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  LabExamCategory,
  LAB_EXAM_CATEGORY_LABELS,
  fetchLabExams,
  createLabExam,
  fetchLabExamOrdersByRecord,
  createLabExamOrder,
  deleteLabExamOrder,
} from "@/lib/lab-exams-api";

const CATEGORIES: (LabExamCategory | "all")[] = ["all", 1, 2, 3, 4, 5];

interface Props {
  patientId: string;
  recordId: string;
  indicatesPrescription: boolean;
  indicatesImagingStudy: boolean;
  onChangeFlags: (flags: { indicatesPrescription: boolean; indicatesImagingStudy: boolean }) => void;
}

/** Panel "Solicitud de Exámenes": buscar/crear en el catálogo a la izquierda, orden de esta consulta a la derecha. */
export function LabExamOrderTab({ patientId, recordId, indicatesPrescription, indicatesImagingStudy, onChangeFlags }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LabExamCategory | "all">("all");
  const [newName, setNewName] = useState("");
  const queryClient = useQueryClient();

  const { data: catalog } = useQuery({
    queryKey: ["lab-exams", search],
    queryFn: () => fetchLabExams({ search, limit: 50 }),
  });
  const items = (catalog?.items || []).filter((e) => category === "all" || e.category === category);

  const { data: orders = [] } = useQuery({
    queryKey: ["lab-exam-orders", recordId],
    queryFn: () => fetchLabExamOrdersByRecord(recordId),
  });
  const orderedHere = orders.filter((o) => o.orderedRecordId === recordId);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["lab-exam-orders", recordId] });
  const addOrder = useMutation({
    mutationFn: (examId: string) => createLabExamOrder({ examId, patientId, orderedRecordId: recordId }),
    onSuccess: invalidate,
  });
  const removeOrder = useMutation({ mutationFn: deleteLabExamOrder, onSuccess: invalidate });
  const createExam = useMutation({
    mutationFn: () => createLabExam({ name: newName }),
    onSuccess: () => { setNewName(""); queryClient.invalidateQueries({ queryKey: ["lab-exams"] }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={indicatesPrescription} onCheckedChange={(v) => onChangeFlags({ indicatesPrescription: !!v, indicatesImagingStudy })} />Se indican Rx</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={indicatesImagingStudy} onCheckedChange={(v) => onChangeFlags({ indicatesPrescription, indicatesImagingStudy: !!v })} />Se indica estudio de imágenes</label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input placeholder="Buscar examen..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)} className={cn("px-2 py-1 rounded-full text-xs", category === c ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                {c === "all" ? "Todos" : LAB_EXAM_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="max-h-64 overflow-y-auto border border-border rounded-md divide-y">
            {items.map((e) => (
              <button key={e.id} type="button" onClick={() => addOrder.mutate(e.id)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-secondary">
                {e.name}
              </button>
            ))}
            {!items.length && <p className="text-xs text-muted-foreground p-2">Sin resultados</p>}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Nombre del examen nuevo" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button type="button" size="sm" disabled={!newName.trim() || createExam.isPending} onClick={() => createExam.mutate()}>
              <Plus size={14} className="mr-1" />Crear examen
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Orden de exámenes</Label>
          <div className="border border-border rounded-md divide-y">
            {orderedHere.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-2 py-1.5 text-sm">
                {o.exam.name}
                <Button type="button" variant="ghost" size="icon" onClick={() => removeOrder.mutate(o.id)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            ))}
            {!orderedHere.length && <p className="text-xs text-muted-foreground p-2">Sin exámenes ordenados en esta consulta.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
