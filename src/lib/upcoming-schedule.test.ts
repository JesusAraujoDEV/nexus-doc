import { describe, it, expect } from "vitest";
import {
  addDaysToDateKey,
  countEntriesByMonth,
  diffCalendarDays,
  formatLongSpanishDate,
  formatNextVisitSummary,
  formatRelativeDaysText,
  formatTime12h,
  groupEntriesByDay,
  resolvePatientNextVisit,
  sortUpcomingEntries,
} from "./upcoming-schedule";
import { UpcomingEntry } from "./calendar-api";
import { ClinicalRecord } from "./clinical-records-api";
import { PatientAppointment } from "./patients-api";

function makeRecord(overrides: Partial<ClinicalRecord> = {}): ClinicalRecord {
  return {
    id: "rec-1",
    symptoms: null,
    diagnosis: null,
    treatment: null,
    labOrders: null,
    privateNotes: null,
    visitType: null,
    visitDate: "2026-11-01",
    createdAt: "2026-11-01T10:00:00.000Z",
    recipeItems: null,
    ultrasoundFindings: null,
    nextAppointmentDate: null,
    category: "gynecology",
    pregnancyId: null,
    indicatesPrescription: false,
    indicatesImagingStudy: false,
    diagnosticImpressions: null,
    medicalCertificate: null,
    evolution: null,
    recommendations: null,
    ...overrides,
  };
}

function makeUpcoming(overrides: Partial<UpcomingEntry> = {}): UpcomingEntry {
  return {
    id: "u-1",
    patientId: "p-1",
    patientName: "Ana Pérez",
    phone: "04141234567",
    date: "2026-12-02",
    source: "proxima_cita",
    time: null,
    sourceRecordId: "rec-1",
    ...overrides,
  };
}

describe("groupEntriesByDay", () => {
  it("agrupa entradas por fecha local sin corrimiento UTC", () => {
    const entries = [
      makeUpcoming({ id: "1", date: "2026-12-02", patientName: "Ana" }),
      makeUpcoming({ id: "2", date: "2026-12-02", patientName: "Beatriz" }),
      makeUpcoming({ id: "3", date: "2026-12-03", patientName: "Carla" }),
    ];

    const grouped = groupEntriesByDay(entries);

    expect(Array.from(grouped.keys())).toEqual(["2026-12-02", "2026-12-03"]);
    expect(grouped.get("2026-12-02")?.map((e) => e.patientName)).toEqual(["Ana", "Beatriz"]);
    expect(grouped.get("2026-12-03")?.map((e) => e.patientName)).toEqual(["Carla"]);
  });

  it("devuelve un mapa vacío cuando no hay entradas", () => {
    expect(groupEntriesByDay([]).size).toBe(0);
  });
});

describe("sortUpcomingEntries", () => {
  it("ordena primero las citas con hora y luego alfabéticamente en español", () => {
    const entries = [
      makeUpcoming({ id: "1", patientName: "Zulay", time: null }),
      makeUpcoming({ id: "2", patientName: "Carmen", time: "14:00", source: "cita" }),
      makeUpcoming({ id: "3", patientName: "Ana", time: null }),
      makeUpcoming({ id: "4", patientName: "Elena", time: "09:00", source: "cita" }),
    ];

    const sorted = sortUpcomingEntries(entries);

    expect(sorted.map((e) => e.id)).toEqual(["4", "2", "3", "1"]);
    expect(entries.map((e) => e.id)).toEqual(["1", "2", "3", "4"]);
  });
});

describe("addDaysToDateKey y diffCalendarDays", () => {
  it("suma días cruzando cambio de mes y año correctamente", () => {
    expect(addDaysToDateKey("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysToDateKey("2026-11-26", 6)).toBe("2026-12-02");
  });

  it("calcula la diferencia exacta en días calendario", () => {
    expect(diffCalendarDays("2026-12-02", "2026-11-26")).toBe(6);
    expect(diffCalendarDays("2026-11-26", "2026-11-26")).toBe(0);
    expect(diffCalendarDays("2026-11-20", "2026-11-26")).toBe(-6);
  });
});

describe("countEntriesByMonth", () => {
  it("cuenta las entradas en el índice de mes local correcto", () => {
    const counts = countEntriesByMonth([
      { date: "2026-01-01" },
      { date: "2026-01-31" },
      { date: "2026-12-02" },
    ]);

    expect(counts[0]).toBe(2);
    expect(counts[11]).toBe(1);
    expect(counts[5]).toBe(0);
  });
});

describe("formatLongSpanishDate y formatTime12h", () => {
  it("escribe día de la semana y mes en español y solo muestra año si difiere", () => {
    expect(formatLongSpanishDate("2026-12-02", { referenceYear: 2026 })).toBe("miércoles 2 de diciembre");
    expect(formatLongSpanishDate("2027-01-05", { referenceYear: 2026 })).toBe("martes 5 de enero de 2027");
    expect(formatLongSpanishDate("2026-12-02", { includeYear: true })).toBe("miércoles 2 de diciembre de 2026");
  });

  it("formatea horas en formato 12 horas legible", () => {
    expect(formatTime12h("09:30:00")).toBe("9:30 a. m.");
    expect(formatTime12h("14:05")).toBe("2:05 p. m.");
    expect(formatTime12h("12:00")).toBe("12:00 p. m.");
    expect(formatTime12h("00:15")).toBe("12:15 a. m.");
    expect(formatTime12h(null)).toBeNull();
  });
});

describe("formatRelativeDaysText", () => {
  it("genera textos en español para hoy, mañana, futuro y pasado", () => {
    expect(formatRelativeDaysText(0)).toBe("hoy");
    expect(formatRelativeDaysText(1)).toBe("mañana");
    expect(formatRelativeDaysText(6)).toBe("en 6 días");
    expect(formatRelativeDaysText(-1)).toBe("ayer");
    expect(formatRelativeDaysText(-4)).toBe("hace 4 días");
  });
});

describe("resolvePatientNextVisit y formatNextVisitSummary", () => {
  it("usa la próxima cita del último registro clínico y genera el texto esperado", () => {
    const records = [
      makeRecord({ id: "old", visitDate: "2026-05-01", nextAppointmentDate: "2026-08-01" }),
      makeRecord({ id: "new", visitDate: "2026-11-10", nextAppointmentDate: "2026-12-02" }),
    ];

    const visit = resolvePatientNextVisit(records, [], "2026-11-26");

    expect(visit).toEqual({
      status: "upcoming",
      date: "2026-12-02",
      time: null,
      source: "proxima_cita",
      diffDays: 6,
    });
    expect(formatNextVisitSummary(visit!, "2026-11-26")).toBe("Próxima consulta: miércoles 2 de diciembre (en 6 días)");
  });

  it("prefiere la cita reservada cuando coincide el mismo día y trae hora", () => {
    const records = [makeRecord({ visitDate: "2026-11-10", nextAppointmentDate: "2026-12-02" })];
    const appointments: PatientAppointment[] = [
      { id: "a-1", appointmentDate: "2026-12-02", startTime: "09:30:00", endTime: "10:00:00", status: "CONFIRMADA" },
    ];

    const visit = resolvePatientNextVisit(records, appointments, "2026-11-26");

    expect(visit?.source).toBe("cita");
    expect(visit?.time).toBe("09:30");
    expect(formatNextVisitSummary(visit!, "2026-11-26")).toBe(
      "Próxima consulta: miércoles 2 de diciembre a las 9:30 a. m. (en 6 días)",
    );
  });

  it("ignora citas canceladas", () => {
    const appointments: PatientAppointment[] = [
      { id: "a-1", appointmentDate: "2026-12-02", startTime: "09:30:00", endTime: "10:00:00", status: "CANCELADA" },
    ];

    expect(resolvePatientNextVisit([], appointments, "2026-11-26")).toBeNull();
  });

  it("reporta consulta vencida cuando la fecha pasó y la paciente no volvió", () => {
    const records = [makeRecord({ id: "r-1", visitDate: "2026-10-01", nextAppointmentDate: "2026-11-10" })];

    const visit = resolvePatientNextVisit(records, [], "2026-11-26");

    expect(visit?.status).toBe("missed");
    expect(formatNextVisitSummary(visit!, "2026-11-26")).toBe("Tenía consulta el martes 10 de noviembre (no ha vuelto)");
  });

  it("no muestra aviso si la fecha ya pasó pero la paciente sí volvió después", () => {
    const records = [
      makeRecord({ id: "r-1", visitDate: "2026-10-01", nextAppointmentDate: "2026-11-10" }),
      makeRecord({ id: "r-2", visitDate: "2026-11-12", nextAppointmentDate: null }),
    ];

    expect(resolvePatientNextVisit(records, [], "2026-11-26")).toBeNull();
  });
});
