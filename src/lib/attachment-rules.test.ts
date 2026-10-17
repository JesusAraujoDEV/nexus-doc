import { describe, it, expect } from "vitest";
import { validateAttachment, formatBytes, MAX_IMAGE_BYTES, MAX_DOCUMENT_BYTES } from "./attachment-rules";

function fakeFile(name: string, type: string, size: number): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("validateAttachment", () => {
  it("acepta una foto JPG dentro del límite", () => {
    expect(validateAttachment(fakeFile("foto.jpg", "image/jpeg", 3_000_000))).toBeNull();
  });

  it("rechaza una imagen de más de 15 MB", () => {
    expect(validateAttachment(fakeFile("foto.png", "image/png", MAX_IMAGE_BYTES + 1))).toMatch(/15 MB/);
  });

  it("acepta PDF y .docx/.xlsx hasta 25 MB", () => {
    expect(validateAttachment(fakeFile("eco.pdf", "application/pdf", MAX_DOCUMENT_BYTES))).toBeNull();
    expect(validateAttachment(fakeFile("informe.docx", "", 1000))).toBeNull();
    expect(validateAttachment(fakeFile("labs.xlsx", "", 1000))).toBeNull();
  });

  it("rechaza un documento de más de 25 MB", () => {
    expect(validateAttachment(fakeFile("eco.pdf", "application/pdf", MAX_DOCUMENT_BYTES + 1))).toMatch(/25 MB/);
  });

  it("rechaza tipos no permitidos", () => {
    expect(validateAttachment(fakeFile("video.mp4", "video/mp4", 1000))).toMatch(/no permitido/);
    expect(validateAttachment(fakeFile("viejo.doc", "application/msword", 1000))).toMatch(/no permitido/);
  });
});

describe("formatBytes", () => {
  it("formatea KB y MB", () => {
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(1.5 * 1024 * 1024)).toBe("1.5 MB");
  });
});
