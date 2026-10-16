import { Typography } from '@mui/material'
import { DataTable, SectionPanel, type Column } from '@/src/shared/components'
import type { Proveedor, ProveedorArticulo } from '@/src/types/dashboard'
import { currency, number } from '@/src/utils/formatters'
import './ProvidersTable.css'
import { ProviderDetail } from '../RemoteData/RemoteData'
const cols: Column<Proveedor>[] = [
  { key: 'name', label: 'Proveedor', render: (r) => <strong>{r.razonSocial}</strong> },
  { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
  {
    key: 'price',
    label: 'Valorizado a precio de lista',
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
export function ProvidersTable({ rows, real = false }: { rows: Proveedor[]; real?: boolean }) {
  return (
    <SectionPanel
      title='Proveedores'
      caption={
        real
          ? 'Compras pendientes actuales · sin filtro por fecha o sucursal'
          : 'Compras agrupadas por proveedor'
      }>
      <DataTable
        rows={rows}
        columns={cols}
        getRowId={(r) => r.id}
        ariaLabel='Proveedores'
        renderExpandedRow={(r) => (
          <div className='expanded-content'>
            <Typography variant='h6'>Artículos de {r.razonSocial}</Typography>
            {real ? (
              <ProviderDetail proveedor={r.id} />
            ) : (
              <DataTable
                rows={r.articulos}
                columns={detail}
                getRowId={(x) => x.id}
                ariaLabel={`Artículos de ${r.razonSocial}`}
                paginated={false}
              />
            )}
          </div>
        )}
      />
    </SectionPanel>
  )
}
