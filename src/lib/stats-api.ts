import { apiFetch } from "@/lib/api";

export interface LabeledCount {
  label: string;
  count: number;
}

export interface StatsSummary {
  totals: {
    patients: number;
    consultations: number;
    withBirthDate: number;
    consultationsThisMonth: number;
  };
  consultationsByMonth: { month: string; count: number }[];
  topVisitTypes: { type: string; count: number }[];
  ageDistribution: { bucket: string; count: number }[];
  temporal: {
    byDayOfWeek: LabeledCount[];
    byMonthOfYear: LabeledCount[];
    byYear: LabeledCount[];
  };
  patientBehavior: {
    inactivePatients: { months: number; count: number };
    avgConsultationsPerPatient: { avg: number; max: number };
    avgDaysBetweenVisits: { avgDays: number };
    retentionRate: { returning: number; total: number; pct: number };
  };
  topMedications: { name: string; count: number }[];
  topExams: { name: string; count: number }[];
  firstVisitAgeDistribution: { bucket: string; count: number }[];
}

export function fetchStats() {
  return apiFetch<StatsSummary>("/stats/summary");
}
