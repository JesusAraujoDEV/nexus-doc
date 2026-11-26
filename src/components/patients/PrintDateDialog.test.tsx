import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrintDateDialog } from "@/components/patients/PrintDateDialog";

describe("PrintDateDialog", () => {
  afterEach(() => vi.useRealTimers());

  it("muestra el título según el documento y la fecha precargada en español", () => {
    render(
      <PrintDateDialog
        open
        onOpenChange={vi.fn()}
        documentLabel="el récipe"
        defaultDate="2026-11-24"
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("¿Con qué fecha imprimo el récipe?")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha del documento")).toHaveValue("2026-11-24");
    expect(screen.getByText("martes 24 de noviembre de 2026")).toBeInTheDocument();
  });

  it("permite cambiar la fecha, usar hoy y confirmar la impresión", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 10, 0));

    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <PrintDateDialog
        open
        onOpenChange={onOpenChange}
        documentLabel="la ecografía"
        defaultDate="2026-11-20"
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Usar la fecha de hoy/i }));
    expect(screen.getByLabelText("Fecha del documento")).toHaveValue("2026-11-26");
    expect(screen.getByText("jueves 26 de noviembre de 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Imprimir$/i }));
    expect(onConfirm).toHaveBeenCalledWith("2026-11-26");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("cierra sin imprimir al tocar Cancelar", () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <PrintDateDialog
        open
        onOpenChange={onOpenChange}
        documentLabel="la ficha de embarazo"
        defaultDate="2026-11-25"
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
