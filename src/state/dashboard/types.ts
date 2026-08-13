import type { DashboardData, DashboardFilters } from '@/src/types/dashboard'
export const LOAD_ATTEMPT = 'dashboard/LOAD_ATTEMPT' as const
export const LOAD_SUCCESS = 'dashboard/LOAD_SUCCESS' as const
export const LOAD_FAILURE = 'dashboard/LOAD_FAILURE' as const
export const SET_FILTERS = 'dashboard/SET_FILTERS' as const
export type DashboardState = {
  data: DashboardData | null
  filters: DashboardFilters
  loading: boolean
  refreshing: boolean
  error: string | null
}
export type DashboardAction =
  | { type: typeof LOAD_ATTEMPT; refreshing: boolean }
  | { type: typeof LOAD_SUCCESS; data: DashboardData }
  | { type: typeof LOAD_FAILURE; error: string }
  | { type: typeof SET_FILTERS; filters: DashboardFilters }
