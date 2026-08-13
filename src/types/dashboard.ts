export type DashboardFilters = { year: number; month: number; branch: string }
export type Sucursal = { codigo: string; descripcion: string }
export type VentaDetalle = {
  id: string
  usuario: string
  comprobante: string
  fecha: string
  rubro: string
  articulo: string
  cantidad: number
  precioTotal: number
  iva: number
  precioSinIva: number
}
export type ProveedorArticulo = {
  id: string
  descripcion: string
  cantidad: number
  precioLista: number
}
export type Proveedor = {
  id: string
  razonSocial: string
  cantidad: number
  precioLista: number
  articulos: ProveedorArticulo[]
}
export type UsuarioArticulo = {
  id: string
  rubro: string
  articulo: string
  cantidad: number
  precioSinIva: number
  precioTotal: number
}
export type UsuarioVenta = {
  id: string
  area: string
  nombre: string
  cantidad: number
  precioSinIva: number
  precioTotal: number
  articulos: UsuarioArticulo[]
}
export type DashboardData = {
  updatedAt: string
  sucursales: Sucursal[]
  resumen: { ivaVentas: number; ivaCompras: number; saldo: number; facturacionPromedio: number }
  evolucionMensual: { mes: string; ventas: number; compras: number }[]
  porTipoComprobante: { tipo: string; ivaVentas: number; ivaCompras: number }[]
  proveedores: Proveedor[]
  usuarios: UsuarioVenta[]
  detalleVentas: VentaDetalle[]
}
