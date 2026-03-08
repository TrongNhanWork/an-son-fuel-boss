// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5153";

function getToken() {
  return localStorage.getItem("token");
}

type ApiError = Error & { status?: number; details?: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  // nếu có body mà chưa set content-type thì mặc định JSON
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // attach token if exists
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err: ApiError = new Error(
      text || `${options.method ?? "GET"} ${path} failed: ${res.status}`
    );
    err.status = res.status;
    err.details = text;
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return null as T;

  // có thể trả rỗng
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // nếu backend trả text/plain
    const text = await res.text().catch(() => "");
    return text as unknown as T;
  }

  return (await res.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body?: any): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body?: any): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}


// Inventory
export function adjustInventory(tankId: number, quantity: number) {
  return apiPost("/api/inventory/adjust", {
    tankId,
    quantity,
  });
}