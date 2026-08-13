import { configureStore } from '@reduxjs/toolkit'
import dashboard from './dashboard'

export const store = configureStore({
  reducer: { dashboard }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
