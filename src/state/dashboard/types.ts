import type { DashboardData, DashboardFilters } from '@/src/types/dashboard'

export const LOAD_ATTEMPT = 'flexxus/dashboard/LOAD_ATTEMPT'
export const LOAD_SUCCESS = 'flexxus/dashboard/LOAD_SUCCESS'
export const LOAD_FAILURE = 'flexxus/dashboard/LOAD_FAILURE'

export const REFRESH_ATTEMPT = 'flexxus/dashboard/REFRESH_ATTEMPT'
export const REFRESH_SUCCESS = 'flexxus/dashboard/REFRESH_SUCCESS'
export const REFRESH_FAILURE = 'flexxus/dashboard/REFRESH_FAILURE'

export const SET_FILTERS = 'flexxus/dashboard/SET_FILTERS'
export const RESET = 'flexxus/dashboard/RESET'

export type DashboardState = {
  data: DashboardData | null
  filters: DashboardFilters
  pending: boolean
  refreshPending: boolean
  error: string | null
}

export type DashboardAction =
  | { type: typeof LOAD_ATTEMPT }
  | { type: typeof LOAD_SUCCESS; data: DashboardData }
  | { type: typeof LOAD_FAILURE; error: string }
  | { type: typeof REFRESH_ATTEMPT }
  | { type: typeof REFRESH_SUCCESS; data: DashboardData }
  | { type: typeof REFRESH_FAILURE; error: string }
  | { type: typeof SET_FILTERS; filters: DashboardFilters }
  | { type: typeof RESET }
