import { useCallback, useState, type ReactNode } from 'react'
import { Alert, Button, LinearProgress, TablePagination } from '@mui/material'
import { DataTable, type Column } from '@/src/shared/components'
import { DashboardProxy } from '@/src/services/DashboardProxy'
import { useApiQuery } from '@/src/services/useApiQuery'
import type { DashboardFilters } from '@/src/types/dashboard'
import type { NivelProveedor, NivelVentas } from '@/src/types/api'
import { currency, number } from '@/src/utils/formatters'
import { TrendChart } from '../TrendChart'
import { SalesTable } from '../SalesTable'

const proxy = new DashboardProxy()
export function QueryState({
  pending,
  error,
  retry,
  children
}: {
  pending: boolean
  error?: string
  retry: () => void
  children: ReactNode
}) {
  return (
    <>
      {pending && <LinearProgress aria-label='Cargando datos' />}
      {error && (
        <Alert severity='error' action={<Button onClick={retry}>Reintentar</Button>}>
          {error}
        </Alert>
      )}
      {!pending && !error && children}
    </>
  )
}
export function RealTrend({ filters }: { filters: DashboardFilters }) {
  const { year, branch } = filters
  const query = useCallback(() => proxy.evolucion({ year, branch, month: 1 }), [year, branch])
  const result = useApiQuery(query)
  return <QueryState {...result}>{result.data && <TrendChart data={result.data} />}</QueryState>
}
export function RealSales({ filters }: { filters: DashboardFilters }) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const query = useCallback(() => proxy.lineas(filters, page + 1, size), [filters, page, size])
  const result = useApiQuery(query)
  const data = result.data
  return (
    <QueryState {...result}>
      {data && (
        <>
          <SalesTable
            paginated={false}
            total={data.total}
            rows={data.items.map((line, index) => ({
              id: `${page}-${index}`,
              usuario: line.razonSocialUsuario || line.codigoUsuario,
              comprobante: line.comprobante,
              fecha: new Date(line.fechaComprobante).toLocaleDateString('es-AR'),
              rubro: line.superRubro,
              articulo: line.articulo || line.codigoArticulo,
              cantidad: line.cantidad,
              precioTotal: line.precioTotal,
              iva: line.porcentajeIva,
              precioSinIva: line.precioSinIva
            }))}
          />
          <TablePagination
            component='div'
            count={data.total}
            page={page}
            rowsPerPage={size}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage='Filas'
            onPageChange={(_, next) => setPage(next)}
            onRowsPerPageChange={(e) => {
              setSize(Number(e.target.value))
              setPage(0)
            }}
          />
        </>
      )}
    </QueryState>
  )
}
export function UserDetail({
  filters,
  area,
  usuario,
  rubro
}: {
  filters: DashboardFilters
  area: string
  usuario: string
  rubro?: string
}) {
  const query = useCallback(
    () => proxy.usuarios(filters, { area, codigoUsuario: usuario, codigoSuperRubro: rubro }),
    [filters, area, usuario, rubro]
  )
  const result = useApiQuery(query)
  const columns: Column<NivelVentas>[] = [
    { key: 'name', label: rubro ? 'Artículo' : 'Super rubro', render: (r) => r.etiqueta },
    { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
    {
      key: 'net',
      label: 'Sin IVA',
      align: 'right',
      render: (r) => currency.format(r.precioSinIva)
    },
    { key: 'total', label: 'Total', align: 'right', render: (r) => currency.format(r.precioTotal) }
  ]
  return (
    <QueryState {...result}>
      {result.data && (
        <DataTable
          rows={result.data}
          columns={columns}
          getRowId={(r) => r.clave}
          ariaLabel={rubro ? 'Artículos vendidos' : 'Rubros vendidos'}
          renderExpandedRow={
            rubro
              ? undefined
              : (r) =>
                  r.tieneHijos && (
                    <UserDetail filters={filters} area={area} usuario={usuario} rubro={r.clave} />
                  )
          }
        />
      )}
    </QueryState>
  )
}
export function ProviderDetail({ proveedor, rubro }: { proveedor: string; rubro?: string }) {
  const query = useCallback(
    () => proxy.proveedores({ codigoProveedor: proveedor, codigoRubro: rubro }),
    [proveedor, rubro]
  )
  const result = useApiQuery(query)
  const columns: Column<NivelProveedor>[] = [
    { key: 'name', label: rubro ? 'Artículo' : 'Rubro', render: (r) => r.etiqueta },
    { key: 'qty', label: 'Cantidad', align: 'right', render: (r) => number.format(r.cantidad) },
    {
      key: 'total',
      label: 'Valorizado a precio de lista',
      align: 'right',
      render: (r) => currency.format(r.valorizado)
    }
  ]
  return (
    <QueryState {...result}>
      {result.data && (
        <DataTable
          rows={result.data}
          columns={columns}
          getRowId={(r) => r.clave}
          ariaLabel={rubro ? 'Artículos pendientes' : 'Rubros pendientes'}
          renderExpandedRow={
            rubro
              ? undefined
              : (r) => r.tieneHijos && <ProviderDetail proveedor={proveedor} rubro={r.clave} />
          }
        />
      )}
    </QueryState>
  )
}
