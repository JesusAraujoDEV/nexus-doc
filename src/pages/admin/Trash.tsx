import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { fetchPatientsTrash, restorePatient, fetchClinicalRecordsTrash, restoreClinicalRecord } from "@/lib/trash-api";

type Tab = "patients" | "records";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
}

function PatientsTrash() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data = [], isLoading } = useQuery({ queryKey: ["patients-trash"], queryFn: fetchPatientsTrash });

  const restore = useMutation({
    mutationFn: restorePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients-trash"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Paciente restaurada" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-8" />;
  if (!data.length) return <p className="text-sm text-muted-foreground text-center py-8">La papelera de pacientes está vacía.</p>;

  return (
    <div className="space-y-2">
      {data.map((p) => (
        <div key={p.id} className="medical-card flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{p.firstName} {p.lastName}</p>
            <p className="text-xs text-muted-foreground">
              {p.cedula ? `C.I. ${p.cedula}` : "Sin cédula"} · Eliminada el {formatDate(p.deletedAt)}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => restore.mutate(p.id)} disabled={restore.isPending}>
            <Undo2 size={14} className="mr-1" />Restaurar
          </Button>
        </div>
      ))}
    </div>
  );
}

function RecordsTrash() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data = [], isLoading } = useQuery({ queryKey: ["clinical-records-trash"], queryFn: fetchClinicalRecordsTrash });

  const restore = useMutation({
    mutationFn: restoreClinicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinical-records-trash"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast({ title: "Consulta restaurada" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-8" />;
  if (!data.length) return <p className="text-sm text-muted-foreground text-center py-8">La papelera de consultas está vacía.</p>;

  return (
    <div className="space-y-2">
      {data.map((r) => (
        <div key={r.id} className="medical-card flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : "Paciente eliminada"} — {r.visitType || "Consulta"}
            </p>
            <p className="text-xs text-muted-foreground">
              {r.visitDate ? formatDate(r.visitDate) : formatDate(r.createdAt)} · Eliminada el {formatDate(r.deletedAt)}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => restore.mutate(r.id)} disabled={restore.isPending}>
            <Undo2 size={14} className="mr-1" />Restaurar
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function Trash() {
  const [tab, setTab] = useState<Tab>("patients");

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-lg font-bold text-foreground">Papelera</h1>
      <div className="flex gap-2">
        {([["patients", "Pacientes"], ["records", "Consultas"]] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              tab === key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "patients" ? <PatientsTrash /> : <RecordsTrash />}
    </div>
  );
}
