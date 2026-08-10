import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchPendingLabExamOrders, recordLabExamResult, LabExamOrder } from "@/lib/lab-exams-api";

function ResultRow({ order, recordId, onSaved }: { order: LabExamOrder; recordId: string; onSaved: () => void }) {
  const [value, setValue] = useState(order.resultValue || "");
  const [observations, setObservations] = useState(order.resultObservations || "");
  const [performedDate, setPerformedDate] = useState(order.performedDate || "");

  const save = useMutation({
    mutationFn: () => recordLabExamResult(order.id, { resultRecordId: recordId, performedDate: performedDate || undefined, resultValue: value || undefined, resultObservations: observations || undefined }),
    onSuccess: onSaved,
  });

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end border-b border-border py-2">
      <p className="text-sm font-medium">{order.exam.name}</p>
      <div><Input type="date" value={performedDate} onChange={(e) => setPerformedDate(e.target.value)} placeholder="Fecha realizada" /></div>
      <div><Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Valor" /></div>
      <div><Input value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Observaciones" /></div>
      <Button type="button" size="sm" disabled={save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? "..." : "Guardar"}
      </Button>
    </div>
  );
}

/** Panel "Registro de resultados": exámenes pendientes de la paciente (de cualquier consulta), resueltos en la actual. */
export function LabExamResultsTab({ patientId, recordId }: { patientId: string; recordId: string }) {
  const queryClient = useQueryClient();
  const { data: pending = [], isLoading } = useQuery({
    queryKey: ["lab-exam-orders-pending", patientId],
    queryFn: () => fetchPendingLabExamOrders(patientId),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["lab-exam-orders-pending", patientId] });

  if (isLoading) return <p className="text-xs text-muted-foreground">Cargando pendientes...</p>;

  return (
    <div className="space-y-2">
      {pending.map((o) => (
        <ResultRow key={o.id} order={o} recordId={recordId} onSaved={refresh} />
      ))}
      {!pending.length && <p className="text-xs text-muted-foreground">Sin exámenes pendientes de resultado.</p>}
    </div>
  );
}
