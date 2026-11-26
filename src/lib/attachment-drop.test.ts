import { describe, it, expect } from "vitest";
import {
  extractTransferFiles,
  formatRejectedToast,
  hasTransferFiles,
  isEditableTarget,
  normalizePastedFiles,
  partitionAttachmentFiles,
  renamePastedImage,
} from "@/lib/attachment-drop";
import { MAX_IMAGE_BYTES } from "@/lib/attachment-rules";

function fakeFile(name: string, type: string, size = 1024): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("extractTransferFiles", () => {
  it("extrae todos los archivos de DataTransfer.files", () => {
    const photo = fakeFile("eco.jpg", "image/jpeg");
    const pdf = fakeFile("informe.pdf", "application/pdf");

    expect(extractTransferFiles({ files: [photo, pdf] })).toEqual([photo, pdf]);
  });

  it("extrae archivos desde DataTransfer.items cuando files está vacío", () => {
    const pasted = fakeFile("image.png", "image/png");
    const transfer = {
      files: [],
      items: [
        { kind: "string", getAsFile: () => null },
        { kind: "file", getAsFile: () => pasted },
      ],
    };

    expect(extractTransferFiles(transfer)).toEqual([pasted]);
  });

  it("no duplica archivos cuando vienen tanto en files como en items", () => {
    const photo = fakeFile("foto.png", "image/png");
    const transfer = {
      files: [photo],
      items: [{ kind: "file", getAsFile: () => photo }],
    };

    expect(extractTransferFiles(transfer)).toEqual([photo]);
  });

  it("devuelve lista vacía si no hay DataTransfer", () => {
    expect(extractTransferFiles(null)).toEqual([]);
    expect(extractTransferFiles(undefined)).toEqual([]);
  });
});

describe("hasTransferFiles", () => {
  it("detecta arrastres de archivos por types, items o files", () => {
    expect(hasTransferFiles({ types: ["Files"] })).toBe(true);
    expect(hasTransferFiles({ files: [fakeFile("a.jpg", "image/jpeg")] })).toBe(true);
    expect(hasTransferFiles({ items: [{ kind: "file", getAsFile: () => null }] })).toBe(true);
  });

  it("devuelve false para arrastres de solo texto", () => {
    expect(hasTransferFiles({ types: ["text/plain"], files: [], items: [] })).toBe(false);
    expect(hasTransferFiles(null)).toBe(false);
  });
});

describe("renamePastedImage", () => {
  const fixedDate = new Date(2026, 10, 26, 15, 30);

  it("renombra image.png a captura-YYYY-MM-DD-HHmm.png", () => {
    const pasted = fakeFile("image.png", "image/png");
    const renamed = renamePastedImage(pasted, fixedDate);

    expect(renamed.name).toBe("captura-2026-11-26-1530.png");
    expect(renamed.type).toBe("image/png");
  });

  it("renombra capturas sin nombre o llamadas blob según su tipo MIME", () => {
    const jpeg = renamePastedImage(fakeFile("", "image/jpeg"), fixedDate);
    const webp = renamePastedImage(fakeFile("blob", "image/webp"), fixedDate);

    expect(jpeg.name).toBe("captura-2026-11-26-1530.jpg");
    expect(webp.name).toBe("captura-2026-11-26-1530.webp");
  });

  it("conserva el nombre original cuando no es genérico", () => {
    const named = fakeFile("ecografia-pelvica.png", "image/png");
    const doc = fakeFile("laboratorio.pdf", "application/pdf");

    expect(renamePastedImage(named, fixedDate)).toBe(named);
    expect(renamePastedImage(doc, fixedDate)).toBe(doc);
  });
});

describe("normalizePastedFiles", () => {
  it("numera capturas cuando se pegan varias a la vez", () => {
    const fixedDate = new Date(2026, 10, 26, 15, 30);
    const result = normalizePastedFiles(
      [fakeFile("image.png", "image/png"), fakeFile("image.png", "image/png")],
      fixedDate,
    );

    expect(result.map((f) => f.name)).toEqual([
      "captura-2026-11-26-1530.png",
      "captura-2026-11-26-1530-2.png",
    ]);
  });
});

describe("partitionAttachmentFiles", () => {
  it("separa tipos permitidos de archivos inválidos o demasiado grandes", () => {
    const jpg = fakeFile("foto.jpg", "image/jpeg");
    const pdf = fakeFile("eco.pdf", "application/pdf");
    const docx = fakeFile("informe.docx", "");
    const xlsx = fakeFile("labs.xlsx", "");
    const video = fakeFile("clip.mp4", "video/mp4");
    const huge = fakeFile("enorme.png", "image/png", MAX_IMAGE_BYTES + 1);

    const { accepted, rejected } = partitionAttachmentFiles([jpg, pdf, docx, xlsx, video, huge]);

    expect(accepted).toEqual([jpg, pdf, docx, xlsx]);
    expect(rejected).toHaveLength(2);
    expect(rejected[0].file).toBe(video);
    expect(rejected[0].reason).toMatch(/no permitido/i);
    expect(rejected[1].file).toBe(huge);
    expect(rejected[1].reason).toMatch(/15 MB/);
  });
});

describe("formatRejectedToast", () => {
  it("incluye archivo y motivo para un archivo rechazado", () => {
    const toast = formatRejectedToast([{ file: fakeFile("video.mp4", "video/mp4"), reason: "Tipo no permitido" }]);

    expect(toast.title).toMatch(/No se pudo adjuntar/);
    expect(toast.description).toContain("video.mp4");
    expect(toast.description).toContain("Tipo no permitido");
  });

  it("resume múltiples archivos rechazados en un solo mensaje", () => {
    const rejected = [
      { file: fakeFile("a.mp4", "video/mp4"), reason: "Motivo A" },
      { file: fakeFile("b.exe", ""), reason: "Motivo B" },
    ];
    const toast = formatRejectedToast(rejected);

    expect(toast.title).toContain("2 archivos");
    expect(toast.description).toContain("a.mp4");
    expect(toast.description).toContain("b.exe");
  });
});

describe("isEditableTarget", () => {
  it("detecta inputs, textareas, selects y elementos editables", () => {
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    const child = document.createElement("span");
    editable.appendChild(child);
    const regular = document.createElement("div");

    expect(isEditableTarget(input)).toBe(true);
    expect(isEditableTarget(textarea)).toBe(true);
    expect(isEditableTarget(child)).toBe(true);
    expect(isEditableTarget(regular)).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});
