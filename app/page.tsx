'use client'

import { DashboardPage } from '@/src/components/DashboardPage'
import { StoreProvider } from '@/src/state/StoreProvider'

export default function Home() {
  return (
    <StoreProvider>
      <DashboardPage />
    </StoreProvider>
  )
}
