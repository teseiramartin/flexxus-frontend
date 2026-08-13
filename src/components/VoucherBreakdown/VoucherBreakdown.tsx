import { Box, Stack, Typography } from '@mui/material'
import { SectionPanel } from '@/src/shared/components'
import type { DashboardData } from '@/src/types/dashboard'
import { currency } from '@/src/utils/formatters'
import './VoucherBreakdown.css'

export function VoucherBreakdown({ rows }: { rows: DashboardData['porTipoComprobante'] }) {
  const total = rows.reduce((s, x) => s + Math.abs(x.ivaVentas), 0) || 1
  return (
    <SectionPanel title='Por tipo de comprobante' caption='Composición del IVA ventas'>
      <Stack spacing={2.1} mt={3}>
        {rows.map((row) => (
          <Box key={row.tipo}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 0.7 }}>
              <Typography sx={{ fontWeight: 650 }}>{row.tipo}</Typography>
              <Typography
                sx={{ fontWeight: 700 }}
                color={row.ivaVentas < 0 ? 'error.main' : 'text.primary'}>
                {currency.format(row.ivaVentas)}
              </Typography>
            </Stack>
            <Box className='progress-track'>
              <Box
                className='progress-fill'
                sx={{
                  width: `${Math.max((Math.abs(row.ivaVentas) / total) * 100, 2)}%`,
                  backgroundColor: row.ivaVentas < 0 ? '#f97066' : '#315b9b'
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </SectionPanel>
  )
}
