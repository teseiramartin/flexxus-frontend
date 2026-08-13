import { DashboardProxy } from '@/src/services'
import type { DashboardFilters } from '@/src/types/dashboard'
import {
  LOAD_ATTEMPT,
  LOAD_FAILURE,
  LOAD_SUCCESS,
  SET_FILTERS,
  type DashboardAction
} from './types'
const proxy = new DashboardProxy()
export type Dispatch = (action: DashboardAction) => void
export const setFilters = (filters: DashboardFilters): DashboardAction => ({
  type: SET_FILTERS,
  filters
})
export async function loadDashboard(dispatch: Dispatch, filters: DashboardFilters, force = false) {
  dispatch({ type: LOAD_ATTEMPT, refreshing: force })
  try {
    if (force) proxy.invalidate(filters)
    dispatch({ type: LOAD_SUCCESS, data: await proxy.getLibroIvaVentas(filters) })
  } catch {
    dispatch({
      type: LOAD_FAILURE,
      error:
        'No pudimos obtener los datos. La última versión guardada seguirá disponible si existe.'
    })
  }
}
