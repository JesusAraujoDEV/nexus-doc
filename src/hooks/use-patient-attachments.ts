import { useQuery } from "@tanstack/react-query";
import { fetchPatientAttachments } from "@/lib/files-api";

/** Todos los adjuntos de la paciente (de todas sus consultas). */
export function usePatientAttachments(patientId: string) {
  return useQuery({
    queryKey: ["attachments", "patient", patientId],
    queryFn: () => fetchPatientAttachments(patientId),
  });
}
