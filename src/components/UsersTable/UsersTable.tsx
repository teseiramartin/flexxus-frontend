import { Chip, Typography } from '@mui/material'
import { DataTable, SectionPanel, type Column } from '@/src/shared/components'
import type { UsuarioArticulo, UsuarioVenta } from '@/src/types/dashboard'
import { currency, number } from '@/src/utils/formatters'
import './UsersTable.css'
const cols: Column<UsuarioVenta>[] = [
  {
    key: 'area',
    label: 'Área',
    render: (r) => <Chip size='small' label={r.area} className='area-chip' />
  },
  { key: 'user', label: 'Usuario', render: (r) => <strong>{r.nombre}</strong> },
  { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
  {
    key: 'net',
    label: 'Precio sin IVA',
    align: 'right',
    render: (r) => currency.format(r.precioSinIva)
  },
  {
    key: 'total',
    label: 'Precio total',
    align: 'right',
    render: (r) => currency.format(r.precioTotal)
  }
]
const detail: Column<UsuarioArticulo>[] = [
  { key: 'rubro', label: 'Rubro', render: (r) => r.rubro },
  { key: 'article', label: 'Artículo', render: (r) => r.articulo },
  { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
  { key: 'net', label: 'Sin IVA', align: 'right', render: (r) => currency.format(r.precioSinIva) },
  { key: 'total', label: 'Total', align: 'right', render: (r) => currency.format(r.precioTotal) }
]
export function UsersTable({ rows }: { rows: UsuarioVenta[] }) {
  return (
    <SectionPanel title='Usuarios' caption='Ventas por usuario, área y artículo'>
      <DataTable
        rows={rows}
        columns={cols}
        getRowId={(r) => r.id}
        ariaLabel='Ventas por usuario'
        renderExpandedRow={(r) => (
          <div className='expanded-content'>
            <Typography variant='h6'>Detalle de ventas de {r.nombre}</Typography>
            <DataTable
              rows={r.articulos}
              columns={detail}
              getRowId={(x) => x.id}
              ariaLabel={`Ventas de ${r.nombre}`}
              paginated={false}
            />
          </div>
        )}
      />
    </SectionPanel>
  )
}
