/** Arma la URL de un endpoint PDF agregando `?fecha=YYYY-MM-DD` solo cuando se indica fecha. */
export function buildPdfUrl(baseUrl: string, fecha?: string): string {
  const trimmed = fecha?.trim();
  if (!trimmed) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}fecha=${encodeURIComponent(trimmed)}`;
}
