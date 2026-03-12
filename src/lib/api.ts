// src/lib/api.ts

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5153";

function getToken() {
  return localStorage.getItem("token");
}

type ApiError = Error & { status?: number; details?: string };

// ========================
// CORE REQUEST FUNCTION
// ========================

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");

    const err: ApiError = new Error(
      text || `${options.method ?? "GET"} ${path} failed (${res.status})`
    );

    err.status = res.status;
    err.details = text;

    throw err;
  }

  if (res.status === 204) return null as T;

  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    return text as unknown as T;
  }

  return (await res.json()) as T;
}

// ========================
// BASIC METHODS
// ========================

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

export async function apiDeleteDirect(url: string) {
  const res = await fetch(`http://localhost:5050/api${url}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return res.json();
}

// ========================
// INVENTORY
// ========================

export function adjustInventory(tankId: number, quantity: number) {
  return apiPost("/api/inventory/adjust", {
    tankId,
    quantity,
  });
}

// ========================
// IMPORTS (NHẬP XĂNG)
// ========================

export function getImports() {
  return apiGet<any[]>("/api/imports");
}

export function createImport(data: any) {
  return apiPost("/api/imports", data);
}

export function updateImport(id: number, data: any) {
  return apiPut(`/api/imports/${id}`, data);
}

export function deleteImport(id: number) {
  return apiDelete(`/api/imports/${id}`);
}

// ========================
// ACCESSORY PRODUCTS
// ========================

export function getAccessoryProducts() {
  return apiGet<any[]>("/api/accessory-products");
}

export function createAccessoryProduct(data: any) {
  return apiPost("/api/accessory-products", data);
}

export function updateAccessoryProduct(id: number, data: any) {
  return apiPut(`/api/accessory-products/${id}`, data);
}

export function deleteAccessoryProduct(id: number) {
  return apiDelete(`/api/accessory-products/${id}`);
}

// ========================
// ACCESSORY SALES (BÁN PHỤ KIỆN)
// ========================

export function sellAccessory(productId: number, quantity: number) {
  return apiPost("/api/accessory-sales", {
    productId,
    quantity,
  });
}

export function getAccessorySales() {
  return apiGet<any[]>("/api/accessory-sales");
}

// ========================
// SALES (BÁN XĂNG)
// ========================

export function getSales() {
  return apiGet<any[]>("/api/sales");
}

export function createSale(data: any) {
  return apiPost("/api/sales", data);
}

export function deleteSale(id: number) {
  return apiDelete(`/api/sales/${id}`);
}

// ========================
// DASHBOARD
// ========================

export function getDashboardToday() {
  return apiGet("/api/dashboard/today");
}

// ========================
// REPORTS
// ========================

// sản lượng xăng theo tuần
export function getWeeklyFuel() {
  return apiGet<any[]>("/api/reports/weekly-fuel");
}

// phụ kiện bán theo tuần
export function getAccessoriesWeek() {
  return apiGet<any[]>("/api/reports/accessories-week");
}

// doanh thu theo tuần
export function getRevenueWeek() {
  return apiGet<any[]>("/api/reports/revenue-week");
}

// tổng lít theo ngày
export function getLitersWeek() {
  return apiGet<any[]>("/api/reports/liters-week");
}

// tỉ lệ loại xăng
export function getFuelRatio() {
  return apiGet<any[]>("/api/reports/fuel-ratio");
}