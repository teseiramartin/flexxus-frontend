'use client'
import { DashboardPage } from '@/src/components/DashboardPage'
import { DashboardProvider } from '@/src/state/dashboard'
export default function Home() {
  return (
    <DashboardProvider>
      <DashboardPage />
    </DashboardProvider>
  )
}
