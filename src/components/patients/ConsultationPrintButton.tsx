import { Printer } from "lucide-react";
import { openClinicalRecordPdf } from "@/lib/clinical-records-api";

interface Props {
  recordId: string;
  kind: "prescription" | "ultrasound" | "general-ultrasound" | "lab-exam";
  label: string;
}

export function ConsultationPrintButton({ recordId, kind, label }: Props) {
  return (
    <button
      type="button"
      onClick={() => openClinicalRecordPdf(recordId, kind)}
      className="flex items-center gap-1 min-h-11 md:min-h-0 text-sm md:text-xs font-semibold text-primary hover:text-primary/80 transition-colors mb-2"
    >
      <Printer size={14} />{label}
    </button>
  );
}
