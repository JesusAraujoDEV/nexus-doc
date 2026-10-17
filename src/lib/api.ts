export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "nexusdoc_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Extrae el mensaje legible de un cuerpo de error del backend. NestJS manda
 * `message` como string o como array (errores de validación).
 */
export function errorMessageFrom(body: unknown, status: number): string {
  const fallback = `Error ${status}`;
  if (!body || typeof body !== "object" || !("message" in body)) return fallback;
  const message = (body as { message: unknown }).message;
  if (typeof message === "string" && message) return message;
  if (Array.isArray(message) && message.length) return message.join(". ");
  return fallback;
}

/** 401: limpia la sesión y manda al login. Compartido por fetch y XHR (subidas). */
export function handleUnauthorized(): never {
  clearToken();
  if (window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
  throw new ApiError(401, "Sesión expirada");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) handleUnauthorized();

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, errorMessageFrom(body, res.status));
  }
  // DELETE/POST sin cuerpo (204 o body vacío) no deben romper con "Unexpected end of JSON".
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: { id: string; role: string; email: string } }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<{ message: string }>(
    "/auth/change-password",
    { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) },
  );
}
