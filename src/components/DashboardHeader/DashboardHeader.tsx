import Image from 'next/image'
import { CheckCircleOutlineOutlined, RefreshRounded } from '@mui/icons-material'
import { Box, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import logo from '@/public/assets/frontera-logo.png'
import './DashboardHeader.css'
export function DashboardHeader({
  refreshing,
  onRefresh
}: {
  refreshing: boolean
  onRefresh: () => void
}) {
  return (
    <Box component='header' className='topbar'>
      <Stack direction='row' alignItems='center' spacing={1.5}>
        <Image src={logo} alt='Frontera BI' className='brand-mark' />
        <Box>
          <Typography className='brand-name'>
            Frontera <span>BI</span>
          </Typography>
          <Typography className='brand-subtitle'>Inteligencia comercial</Typography>
        </Box>
      </Stack>
      <Stack direction='row' alignItems='center' spacing={1.5}>
        <Chip icon={<CheckCircleOutlineOutlined />} label='Datos locales' className='status-chip' />
        <Tooltip title='Actualizar todos los datos'>
          <span>
            <IconButton
              className='refresh-button'
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
