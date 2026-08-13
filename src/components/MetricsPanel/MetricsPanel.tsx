import { TrendingUpRounded } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import type { DashboardData } from '@/src/types/dashboard'
import { currency } from '@/src/utils/formatters'
import './MetricsPanel.css'
function Metric({
  label,
  value,
  tone = 'primary'
}: {
  label: string
  value: number
  tone?: 'primary' | 'danger' | 'success'
}) {
  const color = tone === 'danger' ? '#d92d20' : tone === 'success' ? '#067647' : '#295492'
  return (
    <Paper className='metric-card' elevation={0}>
      <Typography className='eyebrow'>{label}</Typography>
      <Typography className='metric-value' sx={{ color }}>
        {currency.format(value)}
      </Typography>
      <Box className='metric-accent' sx={{ backgroundColor: color }} />
    </Paper>
  )
}
export function MetricsPanel({ summary }: { summary: DashboardData['resumen'] }) {
  return (
    <Box className='metrics-grid'>
      <Metric label='Total IVA ventas' value={summary.ivaVentas} />
      <Metric label='Total IVA compras' value={summary.ivaCompras} tone='success' />
      <Metric
        label='Saldo del período'
        value={summary.saldo}
        tone={summary.saldo < 0 ? 'danger' : 'success'}
      />
      <Paper className='metric-card compact' elevation={0}>
        <TrendingUpRounded className='metric-icon' />
        <Box>
          <Typography className='eyebrow'>Facturación promedio</Typography>
          <Typography className='secondary-value'>
            {currency.format(summary.facturacionPromedio)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
