import axios from 'axios'
import { createMockDashboard } from '@/src/mocks/dashboard'
import type { DashboardData, DashboardFilters } from '@/src/types/dashboard'
import BaseProxy from './BaseProxy'

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'
const CACHE_TTL = 60 * 60 * 1000

export class DashboardProxy extends BaseProxy {
  constructor() {
    super()
    this._baseUrl = `${this._baseUrl}/api/v1/dashboard`
  }

  async getLibroIvaVentas(filters: DashboardFilters): Promise<DashboardData> {
    const cachedData = this._getCachedData(filters)
    if (cachedData) return cachedData

    const data = USE_MOCKS ? await this._getMockData(filters) : await this._getFromApi(filters)

    this._setCachedData(filters, data)
    return data
  }

  invalidate(filters: DashboardFilters) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this._getCacheKey(filters))
    }
  }

  private async _getFromApi(filters: DashboardFilters): Promise<DashboardData> {
    const response = await axios.get(
      `${this._baseUrl}/libro-iva-ventas${this._makeUrlParams(filters)}`
    )

    return response.data.data ?? response.data
  }

  private async _getMockData(filters: DashboardFilters) {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return createMockDashboard(filters)
  }

  private _getCacheKey(filters: DashboardFilters) {
    return `flexxus:iva-ventas:v2:${filters.year}:${filters.month}:${filters.branch}`
  }

  private _getCachedData(filters: DashboardFilters) {
    if (typeof window === 'undefined') return null

    const cached = window.localStorage.getItem(this._getCacheKey(filters))
    if (!cached) return null

    const value = JSON.parse(cached) as { expiresAt: number; data: DashboardData }
    return value.expiresAt > Date.now() ? value.data : null
  }

  private _setCachedData(filters: DashboardFilters, data: DashboardData) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        this._getCacheKey(filters),
        JSON.stringify({ expiresAt: Date.now() + CACHE_TTL, data })
      )
    }
  }
}

export default DashboardProxy
