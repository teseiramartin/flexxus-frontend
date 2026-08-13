export type DashboardFilters = { year: number; month: number; branch: string };
export type Sucursal = { codigo: string; descripcion: string };
export type VentaDetalle = {
  id: string; usuario: string; comprobante: string; fecha: string; rubro: string;
  articulo: string; cantidad: number; precioTotal: number; iva: number; precioSinIva: number;
};
export type DashboardData = {
  updatedAt: string;
  sucursales: Sucursal[];
  resumen: { ivaVentas: number; ivaCompras: number; saldo: number; facturacionPromedio: number };
  evolucionMensual: { mes: string; ventas: number; compras: number }[];
  porTipoComprobante: { tipo: string; ivaVentas: number; ivaCompras: number }[];
  detalleVentas: VentaDetalle[];
};
