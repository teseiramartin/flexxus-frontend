import { createMockDashboard } from '@/src/mocks/dashboard'
import type { DashboardData, DashboardFilters } from '@/src/types/dashboard'
import BaseProxy from './BaseProxy'
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'
const TTL = 60 * 60 * 1000
export class DashboardProxy extends BaseProxy {
  constructor() {
    super('/api/v1/dashboard')
  }
  private key(f: DashboardFilters) {
    return `flexxus:iva-ventas:v2:${f.year}:${f.month}:${f.branch}`
  }
  invalidate(f: DashboardFilters) {
    if (typeof window !== 'undefined') localStorage.removeItem(this.key(f))
  }
  async getLibroIvaVentas(filters: DashboardFilters): Promise<DashboardData> {
    const key = this.key(filters)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(key)
      if (cached) {
        const value = JSON.parse(cached) as { expiresAt: number; data: DashboardData }
        if (value.expiresAt > Date.now()) return value.data
      }
    }
    const data = USE_MOCKS
      ? await this.mock(filters)
      : await this.get<DashboardData>('/libro-iva-ventas', filters)
    if (typeof window !== 'undefined')
      localStorage.setItem(key, JSON.stringify({ expiresAt: Date.now() + TTL, data }))
    return data
  }
  private async mock(filters: DashboardFilters) {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return createMockDashboard(filters)
  }
}
