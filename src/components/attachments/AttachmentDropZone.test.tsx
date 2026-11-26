import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AttachmentDropZone } from "@/components/attachments/AttachmentDropZone";

const toastMock = vi.fn();

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

function setCoarsePointer(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("coarse") ? matches : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}

describe("AttachmentDropZone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCoarsePointer(false);
  });

  it("muestra el recuadro accesible y resalta al arrastrar un archivo encima", () => {
    render(<AttachmentDropZone onFiles={vi.fn()} />);

    const zone = screen.getByRole("region", { name: /arrastrar o pegar/i });
    expect(zone).toHaveAttribute("tabindex", "0");
    expect(screen.getByText(/Arrastrá fotos aquí o pegalas con Ctrl\+V/)).toBeInTheDocument();

    fireEvent.dragEnter(zone, { dataTransfer: { types: ["Files"] } });
    expect(screen.getByText("Soltá para adjuntar")).toBeInTheDocument();

    fireEvent.dragLeave(zone);
    expect(screen.getByText(/Arrastrá fotos aquí o pegalas con Ctrl\+V/)).toBeInTheDocument();
  });

  it("al soltar varios archivos válidos llama a onFiles con todos ellos", () => {
    const onFiles = vi.fn();
    render(<AttachmentDropZone onFiles={onFiles} />);

    const zone = screen.getByRole("region", { name: /arrastrar o pegar/i });
    const photo = new File(["img"], "eco.jpg", { type: "image/jpeg" });
    const pdf = new File(["pdf"], "resultados.pdf", { type: "application/pdf" });

    fireEvent.drop(zone, { dataTransfer: { files: [photo, pdf] } });

    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles).toHaveBeenCalledWith([photo, pdf]);
    expect(toastMock).not.toHaveBeenCalled();
  });

  it("ignora tipos no permitidos y muestra un toast explicando qué archivo falló", () => {
    const onFiles = vi.fn();
    render(<AttachmentDropZone onFiles={onFiles} />);

    const zone = screen.getByRole("region", { name: /arrastrar o pegar/i });
    const photo = new File(["img"], "valida.png", { type: "image/png" });
    const video = new File(["vid"], "video.mp4", { type: "video/mp4" });

    fireEvent.drop(zone, { dataTransfer: { files: [photo, video] } });

    expect(onFiles).toHaveBeenCalledWith([photo]);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "destructive",
        description: expect.stringContaining("video.mp4"),
      }),
    );
  });

  it("pegar una imagen en el recuadro la renombra como captura y llama a onFiles", () => {
    const onFiles = vi.fn();
    render(<AttachmentDropZone onFiles={onFiles} />);

    const zone = screen.getByRole("region", { name: /arrastrar o pegar/i });
    const screenshot = new File(["png"], "image.png", { type: "image/png" });

    fireEvent.paste(zone, {
      clipboardData: { items: [{ kind: "file", getAsFile: () => screenshot }], files: [] },
    });

    expect(onFiles).toHaveBeenCalledTimes(1);
    const [pastedFile] = onFiles.mock.calls[0][0] as File[];
    expect(pastedFile.name).toMatch(/^captura-\d{4}-\d{2}-\d{2}-\d{4}\.png$/);
  });

  it("con listenPagePaste escucha Ctrl+V en toda la página excepto en campos de texto", () => {
    const onFiles = vi.fn();
    render(
      <div>
        <input aria-label="Notas" />
        <AttachmentDropZone onFiles={onFiles} listenPagePaste />
      </div>,
    );

    const screenshot = new File(["png"], "image.png", { type: "image/png" });
    const input = screen.getByLabelText("Notas");

    fireEvent.paste(input, { clipboardData: { files: [screenshot] } });
    expect(onFiles).not.toHaveBeenCalled();

    fireEvent.paste(document.body, { clipboardData: { files: [screenshot] } });
    expect(onFiles).toHaveBeenCalledTimes(1);
  });

  it("se oculta en pantallas táctiles dejando solo los botones existentes", () => {
    setCoarsePointer(true);
    render(<AttachmentDropZone onFiles={vi.fn()} />);

    expect(screen.queryByRole("region", { name: /arrastrar o pegar/i })).not.toBeInTheDocument();
  });
});
