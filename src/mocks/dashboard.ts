import type { DashboardData, DashboardFilters } from '@/src/types/dashboard'
const products = [
  ['MOTOS', 'MOTOMEL STRATO ALPINO 150 COLOR VERDE', 3650000],
  ['MOTOS', 'MOTOMEL CG 150 S2 BASE COLOR AZUL', 1960000],
  ['MOTOS', 'MOTOMEL SKUA 150 SILVER EDITION', 3630000],
  ['MOTOS', 'MOTOMEL SKUA 250 V6 COLOR ROJO', 4200000],
  ['CASCOS', 'CASCO MOTO REBATIBLE LS2 900 VALIANT II', 1051323.76],
  ['ACCESORIOS', 'BAÚL MOTOMEL 45 LITROS NEGRO', 285000]
] as const
const users = [
  ['Ventas', 'Sonia López', 'SLOPEZ'],
  ['Ventas', 'Augusto Isaguirre', 'AISAGUIRRE'],
  ['Ventas', 'Alexis Valerio', 'AVALERIO'],
  ['Administración', 'Maximiliano Mercado', 'MMERCADO']
] as const
export function createMockDashboard(f: DashboardFilters): DashboardData {
  const factor = f.year === 2026 ? 1.12 : f.year === 2024 ? 0.86 : 1
  const branch = f.branch === '002' ? 0.62 : f.branch === '003' ? 0.41 : 1
  const ivaVentas = 47105980.31 * factor * branch * (0.9 + f.month / 100)
  const ivaCompras = 33385985.69 * factor * branch * (0.93 + f.month / 120)
  const detalleVentas = Array.from({ length: 28 }, (_, i) => {
    const p = products[i % products.length]
    const qty = i % 7 === 2 ? -1 : (i % 3) + 1
    const gross = p[2] * qty
    return {
      id: `${f.year}-${f.month}-${i}`,
      usuario: users[i % users.length][2],
      comprobante: `${qty < 0 ? 'NCB' : 'FB'}-50000${7801 + i}`,
      fecha: `${1 + ((i * 3) % 27)}/${f.month}/${f.year}`,
      rubro: p[0],
      articulo: p[1],
      cantidad: qty,
      precioTotal: gross,
      iva: 21,
      precioSinIva: gross / 1.21
    }
  })
  const proveedores = [
    ['Gilera Motors Argentina S.A.', 13, 33760084.9],
    ['Naked', 4, 8331652.88],
    ['On-Off', 9, 25428432.02],
    ['La Emilia S.A.', 38, 65086716.86],
    ['Zanella Hnos y Cía. SACIFI', 2, 3173553.72]
  ].map(([name, qty, total], pi) => ({
    id: `provider-${pi}`,
    razonSocial: String(name),
    cantidad: Number(qty),
    precioLista: Number(total) * factor * branch,
    articulos: products.slice(0, 3 + (pi % 3)).map((p, i) => ({
      id: `p-${pi}-${i}`,
      descripcion: p[1],
      cantidad: i + 1,
      precioLista: p[2] * (i + 1) * factor
    }))
  }))
  const usuarios = users.map(([area, nombre], ui) => {
    const articulos = products.slice(ui, ui + 3).map((p, i) => ({
      id: `u-${ui}-${i}`,
      rubro: p[0],
      articulo: p[1],
      cantidad: i + 1,
      precioSinIva: p[2] / 1.21,
      precioTotal: p[2]
    }))
    return {
      id: `user-${ui}`,
      area,
      nombre,
      cantidad: articulos.reduce((s, x) => s + x.cantidad, 0),
      precioSinIva: articulos.reduce((s, x) => s + x.precioSinIva * x.cantidad, 0) * branch,
      precioTotal: articulos.reduce((s, x) => s + x.precioTotal * x.cantidad, 0) * branch,
      articulos
    }
  })
  return {
    updatedAt: new Date().toISOString(),
    sucursales: [
      { codigo: '001', descripcion: 'Casa Central' },
      { codigo: '002', descripcion: 'Sucursal Norte' },
      { codigo: '003', descripcion: 'Sucursal Sur' }
    ],
    resumen: {
      ivaVentas,
      ivaCompras,
      saldo: ivaCompras - ivaVentas,
      facturacionPromedio: 613075.47 * factor * branch
    },
    evolucionMensual: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ].map((mes, i) => ({
      mes,
      ventas: (22500000 + i * 2650000 + (i % 3) * 1700000) * factor * branch,
      compras: (17400000 + i * 1950000 + (i % 2) * 1300000) * factor * branch
    })),
    porTipoComprobante: [
      { tipo: 'Factura B', ivaVentas: ivaVentas * 0.72, ivaCompras: 0 },
      { tipo: 'Factura A', ivaVentas: ivaVentas * 0.22, ivaCompras: ivaCompras * 0.98 },
      { tipo: 'Nota de débito B', ivaVentas: ivaVentas * 0.04, ivaCompras: 0 },
      { tipo: 'Nota de crédito B', ivaVentas: ivaVentas * -0.07, ivaCompras: ivaCompras * -0.02 }
    ],
    proveedores,
    usuarios,
    detalleVentas
  }
}
