export type ApiResponse<T> = { data: T; error: { detail?: string; status?: number } | null }
export type PagedResult<T> = {
  items: T[]
  total: number
  pagina: number
  tamanioPagina: number
  totalPaginas: number
}
export type Articulo = {
  codigo: string
  descripcion: string
  articuloInfo: string
  codigoBarra: string
  marcaDescripcion: string
  codigoRubro: string
  rubroDescripcion: string
  precioCompra: number
  precioVenta1: number
  activo: boolean
  bloqueado: boolean
}
export type ResumenIva = {
  ivaVentas: number
  ivaCompras: number
  saldo: number
}
export type TipoComprobante = {
  codigo: string
  descripcion: string
  ivaVentas: number
  ivaCompras: number
}
export type NivelVentas = {
  clave: string
  etiqueta: string
  detalle: string | null
  cantidad: number
  precioSinIva: number
  precioTotal: number
  tieneHijos: boolean
}
export type NivelProveedor = {
  clave: string
  etiqueta: string
  cantidad: number
  valorizado: number
  tieneHijos: boolean
}
export type LineaVenta = {
  codigoUsuario: string
  razonSocialUsuario: string
  comprobante: string
  fechaComprobante: string
  superRubro: string
  articulo: string
  codigoArticulo: string
  cantidad: number
  precioTotal: number
  porcentajeIva: number
  precioSinIva: number
  esCobranza: boolean
}
