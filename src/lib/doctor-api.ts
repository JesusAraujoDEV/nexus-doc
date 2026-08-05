import { apiFetch } from "@/lib/api";

export interface DoctorService {
  id: string;
  name: string;
  durationMinutes?: number | null;
  price?: number | string | null;
}

export interface Doctor {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicName: string;
  phone: string;
  experienceYears: number;
  services?: DoctorService[];
}

export function fetchDoctor(slug: string) {
  return apiFetch<Doctor>(`/doctors/${slug}`);
}
