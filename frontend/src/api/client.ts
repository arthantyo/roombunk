const TOKEN_KEY = "staycay_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`/api/v1${path}`, { ...options, headers });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = response.statusText;

    if (text) {
      try {
        const json = JSON.parse(text);
        if (typeof json.message === "string" && json.message.trim()) {
          message = json.message;
        } else if (typeof json.error === "string" && json.error.trim()) {
          message = json.error;
        } else {
          message = text;
        }
      } catch {
        message = text;
      }
    }

    if (response.status === 429) {
      if (
        !message ||
        message === response.statusText ||
        message === "Too Many Requests"
      ) {
        message = "Too many requests. Please slow down and try again later.";
      }
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
