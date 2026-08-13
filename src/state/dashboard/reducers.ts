import {
  LOAD_ATTEMPT,
  LOAD_FAILURE,
  LOAD_SUCCESS,
  SET_FILTERS,
  type DashboardAction,
  type DashboardState
} from './types'
export const initialState: DashboardState = {
  data: null,
  filters: { year: 2025, month: 1, branch: '001' },
  loading: true,
  refreshing: false,
  error: null
}
export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case LOAD_ATTEMPT:
      return { ...state, loading: !action.refreshing, refreshing: action.refreshing, error: null }
    case LOAD_SUCCESS:
      return { ...state, data: action.data, loading: false, refreshing: false }
    case LOAD_FAILURE:
      return { ...state, loading: false, refreshing: false, error: action.error }
    case SET_FILTERS:
      return { ...state, filters: action.filters }
    default:
      return state
  }
}
