import { StatsSummary } from "@/lib/stats-api";

export function PatientBehaviorCard({ data }: { data: StatsSummary["patientBehavior"] }) {
  const items = [
    { label: "Consultas por paciente", value: data.avgConsultationsPerPatient.avg, hint: `máx. ${data.avgConsultationsPerPatient.max}` },
    { label: "Días entre visitas", value: data.avgDaysBetweenVisits.avgDays, hint: "promedio" },
    { label: "Retención (12 meses)", value: `${data.retentionRate.pct}%`, hint: `${data.retentionRate.returning}/${data.retentionRate.total} vuelven` },
  ];

  return (
    <div className="medical-card p-4">
      <h3 className="text-sm font-bold text-foreground mb-3">Cómo se comportan mis pacientes</h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-xl font-bold text-foreground">{item.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{item.label}</p>
            <p className="text-[10px] text-muted-foreground/70">{item.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
