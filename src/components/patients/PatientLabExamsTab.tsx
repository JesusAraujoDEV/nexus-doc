import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchLabExamOrdersByPatient, LAB_EXAM_CATEGORY_LABELS } from "@/lib/lab-exams-api";

function formatDate(iso: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** Historial de exámenes de laboratorio de la paciente (pendientes + con resultado). Solo se pide al abrir esta pestaña. */
export function PatientLabExamsTab({ patientId, active }: { patientId: string; active: boolean }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["lab-exam-orders", "patient", patientId],
    queryFn: () => fetchLabExamOrdersByPatient(patientId),
    enabled: active,
  });

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!orders.length) {
    return <div className="medical-card p-4 text-sm text-muted-foreground text-center">Sin exámenes de laboratorio registrados.</div>;
  }

  return (
    <div className="space-y-2">
      {orders.map((o) => {
        const resolved = !!o.resultRecordId;
        return (
          <div key={o.id} className="medical-card p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground min-w-0 break-words">{o.exam.name}</p>
              <span
                className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  resolved ? "bg-accent-light text-accent" : "bg-muted text-muted-foreground"
                }`}
              >
                {resolved ? "Resuelto" : "Pendiente"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {o.exam.category && LAB_EXAM_CATEGORY_LABELS[o.exam.category]}
              {o.orderedDate && ` · Ordenado ${formatDate(o.orderedDate)}`}
              {o.performedDate && ` · Realizado ${formatDate(o.performedDate)}`}
            </p>
            {(o.resultValue || o.resultObservations) && (
              <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                {o.resultValue}
                {o.resultValue && o.resultObservations && " — "}
                {o.resultObservations}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
