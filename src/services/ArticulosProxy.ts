import type { Articulo, PagedResult } from '@/src/types/api'
import BaseProxy from './BaseProxy'

export type ArticulosFilters = {
  busqueda: string
  codigoRubro: string
  soloActivos: boolean
  Pagina: number
  Tamanio: number
}
export class ArticulosProxy extends BaseProxy {
  buscar(filters: ArticulosFilters) {
    return this.get<PagedResult<Articulo>>('/api/v1/Articulos', filters)
  }
  detalle(codigo: string) {
    return this.get<Articulo>(`/api/v1/Articulos/${encodeURIComponent(codigo)}`)
  }
}
