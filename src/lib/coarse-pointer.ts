const COARSE_POINTER_QUERY = "(hover: none) and (pointer: coarse)";

/** Detecta dispositivos táctiles sin puntero fino (teléfonos y tabletas). */
export function matchesCoarsePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

/** Suscribe cambios en la capacidad táctil del dispositivo. */
export function subscribeCoarsePointer(onChange: (isCoarse: boolean) => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const media = window.matchMedia(COARSE_POINTER_QUERY);
  const handleChange = () => onChange(media.matches);
  media.addEventListener("change", handleChange);
  return () => media.removeEventListener("change", handleChange);
}
