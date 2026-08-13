import { DarkModeOutlined, LightModeOutlined, RefreshRounded } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useThemeMode } from '@/src/theme/AppThemeProvider'
import './DashboardHeader.css'

export function DashboardHeader({
  refreshing,
  onRefresh
}: {
  refreshing: boolean
  onRefresh: () => void
}) {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <Box component='header' className='topbar'>
      <Stack direction='row' className='brand' spacing={1.5}>
        <img src='/assets/frontera-logo.png' alt='Frontera BI' className='brand-mark' />
        <Box>
          <Typography className='brand-name'>
            Frontera <span>BI</span>
          </Typography>
          <Typography className='brand-subtitle'>Inteligencia comercial</Typography>
        </Box>
      </Stack>
      <Stack direction='row' className='brand' spacing={1.5}>
        <Tooltip title={mode === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}>
          <IconButton
            className='header-button'
            onClick={toggleTheme}
            aria-label={mode === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}>
            {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
        </Tooltip>
        <Tooltip title='Actualizar todos los datos'>
          <span>
            <IconButton
              className='header-button'
              onClick={onRefresh}
              disabled={refreshing}
              aria-label='Actualizar todos los datos'>
              {refreshing ? <CircularProgress size={22} /> : <RefreshRounded />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  )
}
