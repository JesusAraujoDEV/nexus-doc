import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ClipboardList, Loader2 } from "lucide-react";
import { fetchPatient, consultationDate } from "@/lib/patients-api";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { MedicalBackground } from "@/components/patients/MedicalBackground";
import { ConsultationCard } from "@/components/patients/ConsultationCard";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => fetchPatient(id as string),
    enabled: !!id,
  });

  const records = [...(data?.clinicalRecords || [])].sort((a, b) =>
    consultationDate(b).localeCompare(consultationDate(a)),
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <button
          onClick={() => navigate("/admin/patients")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />Pacientes
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-3xl w-full mx-auto">
        {isLoading && (
          <div className="py-16 flex justify-center text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
          </div>
        )}
        {isError && <div className="py-12 text-center text-sm text-destructive">No se pudo cargar la paciente.</div>}

        {data && (
          <>
            <PatientHeader p={data} />
            <MedicalBackground p={data} />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Consultas <span className="text-muted-foreground font-normal">({records.length})</span>
                </h3>
              </div>
              {records.length === 0 ? (
                <div className="medical-card p-4 text-sm text-muted-foreground text-center">
                  Esta paciente no tiene consultas registradas.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {records.map((r, i) => (
                    <ConsultationCard key={r.id} record={r} idx={i} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
