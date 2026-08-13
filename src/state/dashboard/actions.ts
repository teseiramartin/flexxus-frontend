import type { ThunkAction } from '@reduxjs/toolkit'
import { DashboardProxy } from '@/src/services'
import type { DashboardData, DashboardFilters } from '@/src/types/dashboard'
import type { RootState } from '@/src/state/store'
import * as types from './types'
import type { DashboardAction } from './types'

type DashboardThunk = ThunkAction<Promise<void>, RootState, unknown, DashboardAction>

export const loadAttempt = (): DashboardAction => ({ type: types.LOAD_ATTEMPT })
export const loadSuccess = (data: DashboardData): DashboardAction => ({
  type: types.LOAD_SUCCESS,
  data
})
export const loadFailure = (error: string): DashboardAction => ({
  type: types.LOAD_FAILURE,
  error
})

export const refreshAttempt = (): DashboardAction => ({ type: types.REFRESH_ATTEMPT })
export const refreshSuccess = (data: DashboardData): DashboardAction => ({
  type: types.REFRESH_SUCCESS,
  data
})
export const refreshFailure = (error: string): DashboardAction => ({
  type: types.REFRESH_FAILURE,
  error
})
export const setFilters = (filters: DashboardFilters): DashboardAction => ({
  type: types.SET_FILTERS,
  filters
})
export const reset = (): DashboardAction => ({ type: types.RESET })

export const loadDashboard =
  (filters: DashboardFilters): DashboardThunk =>
  async (dispatch) => {
    try {
      dispatch(loadAttempt())
      const proxy = new DashboardProxy()
      const response = await proxy.getLibroIvaVentas(filters)
      dispatch(loadSuccess(response))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No pudimos obtener los datos.'
      dispatch(loadFailure(message))
      throw error
    }
  }

export const refreshDashboard =
  (filters: DashboardFilters): DashboardThunk =>
  async (dispatch) => {
    try {
      dispatch(refreshAttempt())
      const proxy = new DashboardProxy()
      proxy.invalidate(filters)
      const response = await proxy.getLibroIvaVentas(filters)
      dispatch(refreshSuccess(response))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No pudimos actualizar los datos.'
      dispatch(refreshFailure(message))
      throw error
    }
  }
