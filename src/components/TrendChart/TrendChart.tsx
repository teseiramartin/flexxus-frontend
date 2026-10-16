import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { SectionPanel } from '@/src/shared/components'
import type { DashboardData } from '@/src/types/dashboard'
import { currency } from '@/src/utils/formatters'
import './TrendChart.css'
export function TrendChart({ data }: { data: DashboardData['evolucionMensual'] }) {
  const max = Math.max(1, ...data.flatMap((x) => [Math.abs(x.ventas), Math.abs(x.compras)]))
  return (
    <SectionPanel
      title='Evolución mensual'
      caption='IVA por mes del año · compras de todas las sucursales'
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
      <Typography variant='caption'>
        Barras en valor absoluto; los valores negativos se muestran atenuados y con signo en el
        detalle.
      </Typography>
      {data.every((x) => x.ventas === 0 && x.compras === 0) && (
        <Typography>No hay importes de IVA para este año.</Typography>
      )}
      <Box className='bars' role='img' aria-label='Comparación mensual de IVA ventas e IVA compras'>
        {data.map((x) => (
          <Box className='bar-group' key={x.mes}>
            <Tooltip title={`Ventas: ${currency.format(x.ventas)}`}>
              <Box
                className='bar sales'
                sx={{
                  height: `${(Math.abs(x.ventas) / max) * 100}%`,
                  opacity: x.ventas < 0 ? 0.5 : 1
                }}
              />
            </Tooltip>
            <Tooltip title={`Compras: ${currency.format(x.compras)}`}>
              <Box
                className='bar purchases'
                sx={{
                  height: `${(Math.abs(x.compras) / max) * 100}%`,
                  opacity: x.compras < 0 ? 0.5 : 1
                }}
              />
            </Tooltip>
            <span>{x.mes}</span>
          </Box>
        ))}
      </Box>
    </SectionPanel>
  )
}
