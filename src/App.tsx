import { useState } from 'react'
import { Tabs, Tab } from '@mui/material'
import { ArticulosPage } from '@/src/components/ArticulosPage/ArticulosPage'
import { DashboardPage } from '@/src/components/DashboardPage'
import { StoreProvider } from '@/src/state/StoreProvider'
import { AppThemeProvider } from '@/src/theme/AppThemeProvider'

export default function App() {
  const [tab, setTab] = useState(0)
  return (
    <AppThemeProvider>
      <StoreProvider>
        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          aria-label='Navegación principal'>
          <Tab label='Dashboard' id='tab-dashboard' aria-controls='panel-dashboard' />
          <Tab label='Artículos' id='tab-articulos' aria-controls='panel-articulos' />
        </Tabs>
        <div
          role='tabpanel'
          id={tab === 0 ? 'panel-dashboard' : 'panel-articulos'}
          aria-labelledby={tab === 0 ? 'tab-dashboard' : 'tab-articulos'}>
          {tab === 0 ? <DashboardPage /> : <ArticulosPage />}
        </div>
      </StoreProvider>
    </AppThemeProvider>
  )
}
