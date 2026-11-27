/** Nombre del archivo que manda el servidor en Content-Disposition (acepta filename*=UTF-8''...). */
export function filenameFrom(header: string | null, fallback: string): string {
  const encoded = header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) return decodeURIComponent(encoded);
  return header?.match(/filename="?([^";]+)"?/i)?.[1] ?? fallback;
}
