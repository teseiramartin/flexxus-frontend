'use client'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren
} from 'react'
import type { DashboardFilters } from '@/src/types/dashboard'
import { loadDashboard, setFilters } from './actions'
import { dashboardReducer, initialState } from './reducers'
import type { DashboardState } from './types'
type ContextValue = DashboardState & {
  updateFilters: (filters: DashboardFilters) => void
  refresh: () => Promise<void>
}
const Context = createContext<ContextValue | null>(null)
export function DashboardProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  useEffect(() => {
    void loadDashboard(dispatch, state.filters)
  }, [state.filters])
  const value = useMemo(
    () => ({
      ...state,
      updateFilters: (filters: DashboardFilters) => dispatch(setFilters(filters)),
      refresh: () => loadDashboard(dispatch, state.filters, true)
    }),
    [state]
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useDashboard() {
  const value = useContext(Context)
  if (!value) throw new Error('useDashboard must be used within DashboardProvider')
  return value
}
export * from './actions'
export * from './reducers'
export * from './types'
