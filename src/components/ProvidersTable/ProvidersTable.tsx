import { Typography } from '@mui/material'
import { DataTable, SectionPanel, type Column } from '@/src/shared/components'
import type { Proveedor, ProveedorArticulo } from '@/src/types/dashboard'
import { currency, number } from '@/src/utils/formatters'
import './ProvidersTable.css'
const cols: Column<Proveedor>[] = [
  { key: 'name', label: 'Proveedor', render: (r) => <strong>{r.razonSocial}</strong> },
  { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
  {
    key: 'price',
    label: 'Precio lista',
    align: 'right',
    render: (r) => currency.format(r.precioLista)
  }
]
const detail: Column<ProveedorArticulo>[] = [
  { key: 'article', label: 'Artículo', render: (r) => r.descripcion },
  { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
  {
    key: 'price',
    label: 'Precio lista',
    align: 'right',
    render: (r) => currency.format(r.precioLista)
  }
]
export function ProvidersTable({ rows }: { rows: Proveedor[] }) {
  return (
    <SectionPanel title='Proveedores' caption='Compras agrupadas por proveedor'>
      <DataTable
        rows={rows}
        columns={cols}
        getRowId={(r) => r.id}
        ariaLabel='Proveedores'
        renderExpandedRow={(r) => (
          <div className='expanded-content'>
            <Typography variant='h6'>Artículos de {r.razonSocial}</Typography>
            <DataTable
              rows={r.articulos}
              columns={detail}
              getRowId={(x) => x.id}
              ariaLabel={`Artículos de ${r.razonSocial}`}
              paginated={false}
            />
          </div>
        )}
      />
    </SectionPanel>
  )
}
