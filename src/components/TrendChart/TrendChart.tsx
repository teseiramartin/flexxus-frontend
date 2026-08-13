import { Box, Stack, Tooltip } from '@mui/material'
import { SectionPanel } from '@/src/shared/components'
import type { DashboardData } from '@/src/types/dashboard'
import { currency } from '@/src/utils/formatters'
import './TrendChart.css'
export function TrendChart({ data }: { data: DashboardData['evolucionMensual'] }) {
  const max = Math.max(...data.flatMap((x) => [x.ventas, x.compras]))
  return (
    <SectionPanel
      title='Evolución mensual'
      caption='Ventas y compras acumuladas del año'
      action={
        <Stack direction='row' spacing={2} className='legend'>
          <span>
            <i className='dot sales' />
            Ventas
          </span>
          <span>
            <i className='dot purchases' />
            Compras
          </span>
        </Stack>
      }>
      <Box className='bars' role='img' aria-label='Comparación mensual de IVA ventas e IVA compras'>
        {data.map((x) => (
          <Box className='bar-group' key={x.mes}>
            <Tooltip title={`Ventas: ${currency.format(x.ventas)}`}>
              <Box
                className='bar sales'
                sx={{ height: `${Math.max((x.ventas / max) * 100, 3)}%` }}
              />
            </Tooltip>
            <Tooltip title={`Compras: ${currency.format(x.compras)}`}>
              <Box
                className='bar purchases'
                sx={{ height: `${Math.max((x.compras / max) * 100, 3)}%` }}
              />
            </Tooltip>
            <span>{x.mes}</span>
          </Box>
        ))}
      </Box>
    </SectionPanel>
  )
}
