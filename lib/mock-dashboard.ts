import type { DashboardData, DashboardFilters } from "./dashboard-types";

const products = [
  ["MOTOS", "MOTOMEL STRATO ALPINO 150 COLOR VERDE", 3650000],
  ["MOTOS", "MOTOMEL CG 150 S2 BASE COLOR AZUL", 1960000],
  ["MOTOS", "MOTOMEL SKUA 150 SILVER EDITION", 3630000],
  ["MOTOS", "MOTOMEL SKUA 250 V6 COLOR ROJO", 4200000],
  ["CASCOS", "CASCO MOTO REBATIBLE LS2 900 VALIANT II", 1051323.76],
  ["ACCESORIOS", "BAÚL MOTOMEL 45 LITROS NEGRO", 285000],
] as const;
const users = ["SLOPEZ", "AISAGUIRRE", "AVALERIO", "MMERCADO"];

export function createMockDashboard(filters: DashboardFilters): DashboardData {
  const factor = filters.year === 2026 ? 1.12 : filters.year === 2024 ? .86 : 1;
  const branchFactor = filters.branch === "002" ? .62 : filters.branch === "003" ? .41 : 1;
  const ivaVentas = 47105980.31 * factor * branchFactor * (.9 + filters.month / 100);
  const ivaCompras = 33385985.69 * factor * branchFactor * (.93 + filters.month / 120);
  const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const detalleVentas = Array.from({ length: 28 }, (_, index) => {
    const product = products[index % products.length];
    const qty = index % 7 === 2 ? -1 : (index % 3) + 1;
    const gross = product[2] * qty;
    return { id: `${filters.year}-${filters.month}-${index}`, usuario: users[index % users.length], comprobante: `${qty < 0 ? "NCB" : "FB"}-50000${7801 + index}`, fecha: `${1 + (index * 3) % 27}/${filters.month}/${filters.year}`, rubro: product[0], articulo: product[1], cantidad: qty, precioTotal: gross, iva: 21, precioSinIva: gross / 1.21 };
  });
  return {
    updatedAt: new Date().toISOString(),
    sucursales: [{ codigo: "001", descripcion: "Casa Central" }, { codigo: "002", descripcion: "Sucursal Norte" }, { codigo: "003", descripcion: "Sucursal Sur" }],
    resumen: { ivaVentas, ivaCompras, saldo: ivaCompras - ivaVentas, facturacionPromedio: 613075.47 * factor * branchFactor },
    evolucionMensual: monthLabels.map((mes, index) => ({ mes, ventas: (22500000 + index * 2650000 + ((index % 3) * 1700000)) * factor * branchFactor, compras: (17400000 + index * 1950000 + ((index % 2) * 1300000)) * factor * branchFactor })),
    porTipoComprobante: [
      { tipo: "Factura B", ivaVentas: ivaVentas * .72, ivaCompras: 0 },
      { tipo: "Factura A", ivaVentas: ivaVentas * .22, ivaCompras: ivaCompras * .98 },
      { tipo: "Nota de débito B", ivaVentas: ivaVentas * .04, ivaCompras: 0 },
      { tipo: "Nota de crédito B", ivaVentas: ivaVentas * -.07, ivaCompras: ivaCompras * -.02 },
    ],
    detalleVentas,
  };
}
