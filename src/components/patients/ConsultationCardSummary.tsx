import { ClinicalRecord } from "@/lib/clinical-records-api";
import { certificateSummary } from "@/lib/consultation-extras";

/**
 * Lo que se ve de la consulta sin expandir la tarjeta: impresiones diagnósticas
 * como chips y una línea de constancia. Ambos truncados para no romper la
 * tarjeta en teléfono; el texto completo queda en el `title`.
 */
export function ConsultationCardSummary({ record }: { record: ClinicalRecord }) {
  const impressions = record.diagnosticImpressions?.filter((s) => s.trim()) ?? [];
  const certificate = certificateSummary(record.medicalCertificate);
  if (!impressions.length && !certificate) return null;

  return (
    <div className="mt-1.5 space-y-1">
      {impressions.length > 0 && (
        <ul className="flex flex-wrap gap-1" aria-label="Impresiones diagnósticas">
          {impressions.map((imp, i) => (
            <li key={`${imp}-${i}`} title={imp} className="max-w-full truncate text-[11px] px-2 py-0.5 rounded-full bg-primary-light text-primary">
              {imp}
            </li>
          ))}
        </ul>
      )}
      {certificate && <p className="text-xs text-muted-foreground truncate" title={certificate}>{certificate}</p>}
    </div>
  );
}
