import { createMockDashboard } from '@/src/mocks/dashboard'
import type { DashboardData, DashboardFilters, Sucursal, UsuarioVenta } from '@/src/types/dashboard'
import type {
  LineaVenta,
  NivelProveedor,
  NivelVentas,
  PagedResult,
  ResumenIva,
  TipoComprobante
} from '@/src/types/api'
import BaseProxy, { type QueryParams } from './BaseProxy'
import { USE_MOCKS } from './config'

export function periodParams(filters: DashboardFilters): QueryParams {
  const month = String(filters.month).padStart(2, '0')
  const lastDay = new Date(filters.year, filters.month, 0).getDate()
  return {
    Desde: `${filters.year}-${month}-01`,
    Hasta: `${filters.year}-${month}-${lastDay}`,
    CodigoSucursal: filters.branch
  }
}

export class DashboardProxy extends BaseProxy {
  async getLibroIvaVentas(filters: DashboardFilters): Promise<DashboardData> {
    if (USE_MOCKS) return createMockDashboard(filters)
    const params = periodParams(filters)
    const [resumen, ventas, tipos, sucursales, proveedores, areas] = await Promise.all([
      this.get<ResumenIva>('/api/v1/libro-iva/resumen', params),
      this.get<{ ticketPromedio: number }>('/api/v1/Ventas/resumen', params),
      this.get<TipoComprobante[]>('/api/v1/libro-iva/por-tipo-comprobante', params),
      this.get<Sucursal[]>('/api/v1/Sucursales'),
      this.proveedores(),
      this.usuarios(filters)
    ])
    const usuarios = (
      await Promise.all(
        areas.map(async (area) =>
          (await this.usuarios(filters, { area: area.clave })).map((user): UsuarioVenta => ({
            id: user.clave,
            area: area.clave,
            nombre: user.etiqueta,
            cantidad: user.cantidad,
            precioSinIva: user.precioSinIva,
            precioTotal: user.precioTotal,
            articulos: []
          }))
        )
      )
    ).flat()
    return {
      updatedAt: new Date().toISOString(),
      sucursales,
      resumen: { ...resumen, facturacionPromedio: ventas.ticketPromedio },
      porTipoComprobante: tipos.map((t) => ({
        tipo: `${t.codigo} · ${t.descripcion}`,
        ivaVentas: t.ivaVentas,
        ivaCompras: t.ivaCompras
      })),
      proveedores: proveedores.map((p) => ({
        id: p.clave,
        razonSocial: p.etiqueta,
        cantidad: p.cantidad,
        precioLista: p.valorizado,
        articulos: []
      })),
      usuarios,
      // Real detail/chart data loads independently; these arrays serve demo mode only.
      detalleVentas: [],
      evolucionMensual: []
    }
  }
  usuarios(filters: DashboardFilters, path: QueryParams = {}) {
    return this.get<NivelVentas[]>('/api/v1/Ventas/jerarquia', {
      ...periodParams(filters),
      ...path
    })
  }
  proveedores(path: QueryParams = {}) {
    return this.get<NivelProveedor[]>('/api/v1/Proveedores/jerarquia', path)
  }
  lineas(filters: DashboardFilters, pagina: number, tamanio: number) {
    return this.get<PagedResult<LineaVenta>>('/api/v1/Ventas/lineas', {
      ...periodParams(filters),
      Pagina: pagina,
      Tamanio: tamanio
    })
  }
  async evolucion(filters: DashboardFilters): Promise<DashboardData['evolucionMensual']> {
    const result: DashboardData['evolucionMensual'] = []
    // Bound concurrency: the API exposes fiscal summaries per period only.
    for (let start = 1; start <= 12; start += 3) {
      result.push(
        ...(await Promise.all(
          [start, start + 1, start + 2].map(async (month) => {
            const data = await this.get<ResumenIva>(
              '/api/v1/libro-iva/resumen',
              periodParams({ ...filters, month })
            )
            return {
              mes: new Date(filters.year, month - 1, 1).toLocaleString('es-AR', { month: 'short' }),
              ventas: data.ivaVentas,
              compras: data.ivaCompras
            }
          })
        ))
      )
    }
    return result
  }
}
export default DashboardProxy
