export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors: FieldErrors;
  constructor(message: string, status: number, code?: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/** Friendly text for anything thrown by a request, including a server that is down. */
export const messageFor = (error: unknown) =>
  error instanceof ApiError ? error.message : "Could not reach the server. Try again.";

// One refresh at a time, however many requests hit a 401 together.
let refreshing: Promise<boolean> | null = null;
export function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(`${API_URL}/auth/refresh`, { method: "POST", credentials: "include" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

const NO_RETRY = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"];

export async function fetchJson<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, credentials: "include" });

  if (res.status === 401 && retry && !NO_RETRY.includes(path) && (await refreshSession())) {
    return fetchJson<T>(path, init, false);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const fieldErrors: FieldErrors = {};
    for (const item of err?.details?.errors ?? []) {
      const field = String(item.field).split(".").pop();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = String(item.message).replace(/^Value error, /, "");
      }
    }
    throw new ApiError(err?.message ?? `Request failed (${res.status})`, res.status, err?.code, fieldErrors);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}