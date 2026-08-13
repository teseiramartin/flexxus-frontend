import { CachedOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import type { DashboardData, DashboardFilters as Filters } from '@/src/types/dashboard'
import { months } from '@/src/utils/formatters'
import './DashboardFilters.css'
export function DashboardFilters({
  filters,
  branches,
  refreshing,
  onChange,
  onRefresh
}: {
  filters: Filters
  branches: DashboardData['sucursales']
  refreshing: boolean
  onChange: (f: Filters) => void
  onRefresh: () => void
}) {
  return (
    <Box className='hero'>
      <Box>
        <Typography className='section-kicker'>LIBRO IVA VENTAS</Typography>
        <Typography variant='h3'>Resumen fiscal y comercial</Typography>
        <Typography className='hero-copy'>
          Información consolidada para analizar ventas, compras y comprobantes.
        </Typography>
      </Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} className='filters'>
        <FormControl size='small'>
          <InputLabel>Año</InputLabel>
          <Select
            label='Año'
            value={filters.year}
            onChange={(e) => onChange({ ...filters, year: Number(e.target.value) })}>
            {[2024, 2025, 2026].map((y) => (
              <MenuItem value={y} key={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size='small'>
          <InputLabel>Mes</InputLabel>
          <Select
            label='Mes'
            value={filters.month}
            onChange={(e) => onChange({ ...filters, month: Number(e.target.value) })}>
            {months.map((m, i) => (
              <MenuItem value={i + 1} key={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size='small'>
          <InputLabel>Sucursal</InputLabel>
          <Select
            label='Sucursal'
            value={filters.branch}
            onChange={(e) => onChange({ ...filters, branch: e.target.value })}>
            {branches.map((b) => (
              <MenuItem value={b.codigo} key={b.codigo}>
                {b.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          startIcon={<CachedOutlined />}
          onClick={onRefresh}
          disabled={refreshing}>
          Actualizar
        </Button>
      </Stack>
    </Box>
  )
}
