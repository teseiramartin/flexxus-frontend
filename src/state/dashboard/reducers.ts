import * as types from './types'
import type { DashboardAction, DashboardState } from './types'

const initialState: DashboardState = {
  data: null,
  filters: { year: 2025, month: 1, branch: '001' },
  pending: false,
  refreshPending: false,
  error: null
}

export default function reducer(
  state: DashboardState = initialState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case types.LOAD_ATTEMPT:
      return { ...state, pending: true, error: null }
    case types.LOAD_SUCCESS:
      return { ...state, data: action.data, pending: false, error: null }
    case types.LOAD_FAILURE:
      return { ...state, pending: false, error: action.error }
    case types.REFRESH_ATTEMPT:
      return { ...state, refreshPending: true, error: null }
    case types.REFRESH_SUCCESS:
      return { ...state, data: action.data, refreshPending: false, error: null }
    case types.REFRESH_FAILURE:
      return { ...state, refreshPending: false, error: action.error }
    case types.SET_FILTERS:
      return { ...state, filters: action.filters }
    case types.RESET:
      return { ...initialState }
    default:
      return state
  }
}
