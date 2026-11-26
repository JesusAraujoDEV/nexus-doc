import { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConsultationCard } from "./ConsultationCard";
import type { ClinicalRecord } from "@/lib/clinical-records-api";
import type { Attachment } from "@/lib/files-api";

const fetchRecordAttachments = vi.fn();
const uploadAttachment = vi.fn();
const fetchAttachmentBlob = vi.fn();

vi.mock("@/lib/files-api", () => ({
  fetchRecordAttachments: (...args: unknown[]) => fetchRecordAttachments(...args),
  uploadAttachment: (...args: unknown[]) => uploadAttachment(...args),
  fetchAttachmentBlob: (...args: unknown[]) => fetchAttachmentBlob(...args),
  renameAttachment: vi.fn(),
  deleteAttachment: vi.fn(),
  restoreAttachment: vi.fn(),
}));

function makeRecord(overrides: Partial<ClinicalRecord> = {}): ClinicalRecord {
  return {
    id: "rec-1",
    symptoms: "Control rutinario",
    diagnosis: "Sin hallazgos patológicos",
    treatment: null,
    labOrders: null,
    privateNotes: null,
    visitType: "Control ginecológico",
    visitDate: "2026-10-15",
    createdAt: "2026-10-15T12:00:00Z",
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

function makeAttachment(overrides: Partial<Attachment> = {}): Attachment {
  return {
    id: "att-1",
    patientId: "pat-1",
    clinicalRecordId: "rec-1",
    doctorId: "doc-1",
    fileName: "laboratorio.pdf",
    fileType: "PDF",
    mimeType: "application/pdf",
    sizeBytes: 4096,
    createdAt: "2026-10-15T12:00:00Z",
    updatedAt: "2026-10-15T12:00:00Z",
    ...overrides,
  };
}

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return { client, ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>) };
}

describe("ConsultationCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchRecordAttachments.mockResolvedValue([]);
    fetchAttachmentBlob.mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" }));
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("solo consulta adjuntos cuando la tarjeta se despliega", async () => {
    const attachment = makeAttachment();
    fetchRecordAttachments.mockResolvedValue([attachment]);

    renderWithClient(
      <ConsultationCard record={makeRecord()} idx={1} patientId="pat-1" onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(fetchRecordAttachments).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Control ginecológico/i }));

    await waitFor(() => expect(fetchRecordAttachments).toHaveBeenCalledWith("rec-1"));
    expect(await screen.findByText("laboratorio.pdf")).toBeInTheDocument();
  });

  it("no muestra galería cuando la consulta no tiene adjuntos", async () => {
    renderWithClient(
      <ConsultationCard record={makeRecord()} idx={0} patientId="pat-1" onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    await waitFor(() => expect(fetchRecordAttachments).toHaveBeenCalledWith("rec-1"));
    expect(screen.queryByText(/Adjuntos/i)).not.toBeInTheDocument();
  });

  it("abre el visor al tocar una miniatura", async () => {
    fetchRecordAttachments.mockResolvedValue([makeAttachment({ fileName: "eco-pelvica.pdf" })]);

    renderWithClient(
      <ConsultationCard record={makeRecord()} idx={0} patientId="pat-1" onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    const thumbButton = await screen.findByRole("button", { name: "Abrir eco-pelvica.pdf" });
    fireEvent.click(thumbButton);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "eco-pelvica.pdf" })).toBeInTheDocument();
  });

  it("muestra 'Adjuntar foto' a la derecha de 'Eliminar' con área táctil móvil y flex-wrap", async () => {
    renderWithClient(
      <ConsultationCard record={makeRecord()} idx={0} patientId="pat-1" onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    const deleteButton = screen.getByRole("button", { name: /Eliminar/i });
    const attachButton = screen.getByRole("button", { name: /Adjuntar foto/i });
    const actionsRow = attachButton.parentElement;

    expect(actionsRow).toHaveClass("flex-wrap");
    expect(attachButton).toHaveClass("min-h-11");
    expect(deleteButton.compareDocumentPosition(attachButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("sube una foto desde el botón 'Adjuntar foto', muestra progreso y refresca la galería", async () => {
    let reportProgress: (pct: number) => void = () => {};
    let resolveUpload: (value: Attachment) => void = () => {};
    uploadAttachment.mockImplementation((_recordId: string, _file: File, onProgress: (pct: number) => void) => {
      reportProgress = onProgress;
      return new Promise<Attachment>((resolve) => {
        resolveUpload = resolve;
      });
    });

    const { client } = renderWithClient(
      <ConsultationCard record={makeRecord()} idx={0} patientId="pat-1" onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    fireEvent.click(screen.getByRole("button", { name: /Adjuntar foto/i }));

    expect(await screen.findByRole("button", { name: /Tomar foto/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subir archivo/i })).toBeInTheDocument();

    const fileInput = document.querySelector('input[capture="environment"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const photo = new File(["img"], "nueva-foto.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [photo] } });

    expect(await screen.findByText(/Subiendo/i)).toBeInTheDocument();
    act(() => reportProgress(60));
    expect(await screen.findByText(/60%/)).toBeInTheDocument();

    const uploaded = makeAttachment({ id: "att-2", fileName: "nueva-foto.jpg", fileType: "IMAGE", mimeType: "image/jpeg" });
    fetchRecordAttachments.mockResolvedValue([uploaded]);
    await act(async () => {
      resolveUpload(uploaded);
    });

    expect(await screen.findByRole("button", { name: "Abrir nueva-foto.jpg" })).toBeInTheDocument();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["attachments"] });
  });

  it("permite desplegar una consulta sin diagnóstico ni tratamiento para adjuntar fotos", async () => {
    const minimalRecord = makeRecord({ diagnosis: null, symptoms: null });
    renderWithClient(<ConsultationCard record={minimalRecord} idx={1} patientId="pat-1" />);

    fireEvent.click(screen.getByRole("button", { name: /Control ginecológico/i }));

    expect(await screen.findByRole("button", { name: /Adjuntar foto/i })).toBeInTheDocument();
    await waitFor(() => expect(fetchRecordAttachments).toHaveBeenCalledWith("rec-1"));
  });

  it("muestra el recuadro de arrastre solo desplegada y sube archivos al soltarlos", async () => {
    uploadAttachment.mockResolvedValue(
      makeAttachment({ id: "att-3", fileName: "eco-soltada.jpg", fileType: "IMAGE", mimeType: "image/jpeg" }),
    );

    renderWithClient(<ConsultationCard record={makeRecord()} idx={1} patientId="pat-1" />);
    expect(screen.queryByRole("region", { name: /arrastrar o pegar/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Control ginecológico/i }));
    const zone = await screen.findByRole("region", { name: /arrastrar o pegar/i });
    const photo = new File(["img"], "eco-soltada.jpg", { type: "image/jpeg" });

    fireEvent.drop(zone, { dataTransfer: { files: [photo] } });

    await waitFor(() => expect(uploadAttachment).toHaveBeenCalledWith("rec-1", photo, expect.any(Function)));
  });
});
