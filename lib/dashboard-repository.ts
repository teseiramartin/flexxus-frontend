import { createMockDashboard } from "./mock-dashboard";
import type { DashboardData, DashboardFilters } from "./dashboard-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
const CACHE_TTL_MS = 60 * 60 * 1000;
const cacheKey = (filters: DashboardFilters) => `flexxus:iva-ventas:v1:${filters.year}:${filters.month}:${filters.branch}`;

export function invalidateDashboardCache(filters: DashboardFilters) {
  if (typeof window !== "undefined") window.localStorage.removeItem(cacheKey(filters));
}

export async function getDashboard(filters: DashboardFilters): Promise<DashboardData> {
  const key = cacheKey(filters);
  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as { expiresAt: number; data: DashboardData };
      if (parsed.expiresAt > Date.now()) return parsed.data;
    }
  }

  const data = USE_MOCKS ? await mockRequest(filters) : await apiRequest(filters);
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify({ expiresAt: Date.now() + CACHE_TTL_MS, data }));
  return data;
}

async function mockRequest(filters: DashboardFilters) {
  await new Promise((resolve) => setTimeout(resolve, 320));
  return createMockDashboard(filters);
}

async function apiRequest(filters: DashboardFilters): Promise<DashboardData> {
  const params = new URLSearchParams({ year: String(filters.year), month: String(filters.month), branch: filters.branch });
  const response = await fetch(`${API_URL}/api/v1/dashboard/libro-iva-ventas?${params}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Dashboard API returned ${response.status}`);
  const payload = await response.json() as DashboardData | { data: DashboardData };
  return "data" in payload ? payload.data : payload;
}
