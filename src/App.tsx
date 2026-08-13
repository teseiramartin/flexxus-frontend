import { DashboardPage } from '@/src/components/DashboardPage'
import { StoreProvider } from '@/src/state/StoreProvider'
import { AppThemeProvider } from '@/src/theme/AppThemeProvider'

export default function App() {
  return (
    <AppThemeProvider>
      <StoreProvider>
        <DashboardPage />
      </StoreProvider>
    </AppThemeProvider>
  )
}
