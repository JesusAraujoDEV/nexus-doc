import { apiFetch } from "@/lib/api";

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
}

export function fetchStats() {
  return apiFetch<StatsSummary>("/stats/summary");
}
