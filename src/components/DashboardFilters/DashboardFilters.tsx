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
        <Typography className='section-kicker'>LIBROS IVA (Compra-Venta)</Typography>
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
            inputProps={{ 'aria-label': 'Año' }}
            value={filters.year}
            onChange={(e) => onChange({ ...filters, year: Number(e.target.value) })}>
            {Array.from(
              { length: Math.max(new Date().getFullYear(), filters.year) - 2023 + 1 },
              (_, i) => 2023 + i
            ).map((y) => (
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
            inputProps={{ 'aria-label': 'Mes' }}
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
          <InputLabel shrink>Sucursal</InputLabel>
          <Select
            label='Sucursal'
            notched
            displayEmpty
            renderValue={(value) =>
              branches.find((b) => b.codigo === value)?.descripcion ??
              (value || 'Todas las sucursales')
            }
            inputProps={{ 'aria-label': 'Sucursal' }}
            value={filters.branch}
            onChange={(e) => onChange({ ...filters, branch: e.target.value })}>
            <MenuItem value=''>Todas las sucursales</MenuItem>
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
