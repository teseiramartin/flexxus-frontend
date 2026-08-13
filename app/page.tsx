'use client'

import { DashboardPage } from '@/src/components/DashboardPage'
import { StoreProvider } from '@/src/state/StoreProvider'
import { AppThemeProvider } from '@/src/theme/AppThemeProvider'

export default function Home() {
  return (
    <AppThemeProvider>
      <StoreProvider>
        <DashboardPage />
      </StoreProvider>
    </AppThemeProvider>
  )
}
