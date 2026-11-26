import { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConsultationAttachments } from "./use-consultation-attachments";
import { usePatientAttachments } from "./use-patient-attachments";
import type { Attachment } from "@/lib/files-api";

const fetchRecordAttachments = vi.fn();
const fetchPatientAttachments = vi.fn();
const uploadAttachment = vi.fn();

vi.mock("@/lib/files-api", () => ({
  fetchRecordAttachments: (...args: unknown[]) => fetchRecordAttachments(...args),
  fetchPatientAttachments: (...args: unknown[]) => fetchPatientAttachments(...args),
  uploadAttachment: (...args: unknown[]) => uploadAttachment(...args),
}));

function makeAttachment(overrides: Partial<Attachment> = {}): Attachment {
  return {
    id: "att-1",
    patientId: "pat-1",
    clinicalRecordId: "rec-1",
    doctorId: "doc-1",
    fileName: "eco.jpg",
    fileType: "IMAGE",
    mimeType: "image/jpeg",
    sizeBytes: 2048,
    createdAt: "2026-10-17T10:00:00Z",
    updatedAt: "2026-10-17T10:00:00Z",
    ...overrides,
  };
}

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

function createClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

describe("useConsultationAttachments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchRecordAttachments.mockResolvedValue([]);
    fetchPatientAttachments.mockResolvedValue([]);
  });

  it("no pide adjuntos cuando enabled es false y los pide al habilitarse", async () => {
    const attachment = makeAttachment();
    fetchRecordAttachments.mockResolvedValue([attachment]);
    const wrapper = createWrapper(createClient());

    const { result, rerender } = renderHook(
      ({ enabled }) => useConsultationAttachments("rec-1", enabled),
      { initialProps: { enabled: false }, wrapper },
    );

    expect(fetchRecordAttachments).not.toHaveBeenCalled();
    expect(result.current.attachments).toEqual([]);

    rerender({ enabled: true });

    await waitFor(() => expect(result.current.attachments).toEqual([attachment]));
    expect(fetchRecordAttachments).toHaveBeenCalledTimes(1);
    expect(fetchRecordAttachments).toHaveBeenCalledWith("rec-1");
  });

  it("reporta progreso al subir e invalida adjuntos de la consulta y de la paciente", async () => {
    let reportProgress: (pct: number) => void = () => {};
    let resolveUpload: (value: Attachment) => void = () => {};
    uploadAttachment.mockImplementation((_recordId: string, _file: File, onProgress: (pct: number) => void) => {
      reportProgress = onProgress;
      return new Promise<Attachment>((resolve) => {
        resolveUpload = resolve;
      });
    });

    const client = createClient();
    const wrapper = createWrapper(client);
    const { result } = renderHook(
      () => ({
        consultation: useConsultationAttachments("rec-1", true),
        patient: usePatientAttachments("pat-1"),
      }),
      { wrapper },
    );

    await waitFor(() => expect(fetchRecordAttachments).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetchPatientAttachments).toHaveBeenCalledTimes(1));

    const photo = new File(["img"], "ecografia.jpg", { type: "image/jpeg" });
    act(() => result.current.consultation.uploads.enqueue([photo]));

    await waitFor(() => expect(result.current.consultation.uploads.items[0]?.status).toBe("uploading"));

    act(() => reportProgress(45));
    expect(result.current.consultation.uploads.items[0]?.progress).toBe(45);

    const created = makeAttachment({ id: "att-2", fileName: "ecografia.jpg" });
    fetchRecordAttachments.mockResolvedValue([created]);
    fetchPatientAttachments.mockResolvedValue([created]);

    await act(async () => {
      resolveUpload(created);
    });

    await waitFor(() => expect(result.current.consultation.uploads.items[0]?.status).toBe("done"));
    await waitFor(() => expect(fetchRecordAttachments).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(fetchPatientAttachments).toHaveBeenCalledTimes(2));
    expect(result.current.consultation.attachments).toEqual([created]);
  });

  it("rechaza archivos inválidos en el cliente sin llamar al servidor", () => {
    const wrapper = createWrapper(createClient());
    const { result } = renderHook(() => useConsultationAttachments("rec-1", false), { wrapper });

    const video = new File(["vid"], "video.mp4", { type: "video/mp4" });
    act(() => result.current.uploads.enqueue([video]));

    expect(uploadAttachment).not.toHaveBeenCalled();
    expect(result.current.uploads.items[0]?.status).toBe("error");
    expect(result.current.uploads.items[0]?.error).toMatch(/no permitido/i);
  });

  it("abre el visor por id, refleja cambios en vivo y lo cierra", async () => {
    const initial = makeAttachment({ id: "att-1", fileName: "foto.jpg" });
    const renamed = makeAttachment({ id: "att-1", fileName: "eco-control.jpg" });
    fetchRecordAttachments.mockResolvedValue([initial]);

    const client = createClient();
    const { result } = renderHook(() => useConsultationAttachments("rec-1", true), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.attachments).toHaveLength(1));

    act(() => result.current.openViewer(initial));
    expect(result.current.opened?.fileName).toBe("foto.jpg");

    act(() => {
      client.setQueryData(["attachments", "record", "rec-1"], [renamed]);
    });
    await waitFor(() => expect(result.current.opened?.fileName).toBe("eco-control.jpg"));

    act(() => result.current.closeViewer());
    expect(result.current.opened).toBeNull();
  });
});
