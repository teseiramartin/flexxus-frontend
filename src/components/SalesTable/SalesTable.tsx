import { Chip } from '@mui/material'
import { DataTable, SectionPanel, type Column } from '@/src/shared/components'
import type { VentaDetalle } from '@/src/types/dashboard'
import { currency, number } from '@/src/utils/formatters'
import './SalesTable.css'

const cols: Column<VentaDetalle>[] = [
  { key: 'user', label: 'Usuario', render: (r) => <strong>{r.usuario}</strong> },
  { key: 'voucher', label: 'Comprobante', render: (r) => r.comprobante },
  { key: 'date', label: 'Fecha', render: (r) => r.fecha },
  { key: 'category', label: 'Rubro', render: (r) => r.rubro },
  {
    key: 'article',
    label: 'Artículo',
    render: (r) => <span className='article-text'>{r.articulo}</span>
  },
  { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
  {
    key: 'total',
    label: 'Precio total',
    align: 'right',
    render: (r) => currency.format(r.precioTotal)
  },
  { key: 'vat', label: 'IVA', align: 'right', render: (r) => `${number.format(r.iva)}%` },
  { key: 'net', label: 'Sin IVA', align: 'right', render: (r) => currency.format(r.precioSinIva) }
]

export function SalesTable({
  rows,
  paginated = true,
  total = rows.length
}: {
  rows: VentaDetalle[]
  paginated?: boolean
  total?: number
}) {
  return (
    <SectionPanel
      title='Detalle de ventas'
      caption='Comprobantes y artículos asociados'
      action={<Chip label={`${total} movimientos`} size='small' className='count-chip' />}>
      <DataTable
        paginated={paginated}
        rows={rows}
        columns={cols}
        getRowId={(r) => r.id}
        ariaLabel='Detalle paginado de ventas'
      />
    </SectionPanel>
  )
}
