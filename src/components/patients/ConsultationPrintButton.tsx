import { useState } from "react";
import { Printer } from "lucide-react";
import { ClinicalRecordPdfKind, openClinicalRecordPdf } from "@/lib/clinical-records-api";
import { PrintDateDialog } from "@/components/patients/PrintDateDialog";

const DOCUMENT_LABELS: Record<ClinicalRecordPdfKind, string> = {
  prescription: "el récipe",
  ultrasound: "la ecografía",
  "general-ultrasound": "la ecografía general",
  "lab-exam": "la orden de exámenes",
};

interface Props {
  recordId: string;
  kind: ClinicalRecordPdfKind;
  label: string;
  defaultDate?: string | null;
}

export function ConsultationPrintButton({ recordId, kind, label, defaultDate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 min-h-11 md:min-h-0 text-sm md:text-xs font-semibold text-primary hover:text-primary/80 transition-colors mb-2"
      >
        <Printer size={14} />{label}
      </button>
      <PrintDateDialog
        open={open}
        onOpenChange={setOpen}
        documentLabel={DOCUMENT_LABELS[kind]}
        defaultDate={defaultDate}
        onConfirm={(fecha) => openClinicalRecordPdf(recordId, kind, fecha)}
      />
    </>
  );
}
