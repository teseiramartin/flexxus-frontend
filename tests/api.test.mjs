import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import { build } from 'vite'
import axios from 'axios'
import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

await build({
  logLevel: 'error',
  define: {
    'import.meta.env.VITE_USE_MOCKS': JSON.stringify('false'),
    'import.meta.env.VITE_API_URL': JSON.stringify('')
  },
  build: {
    ssr: 'tests/integration-entry.ts',
    outDir: 'node_modules/.cache/flexxus-tests',
    emptyOutDir: true,
    rolldownOptions: { output: { entryFileNames: 'integration.mjs' } }
  }
})
const {
  ArticulosProxy,
  DashboardProxy,
  periodParams,
  apiErrorMessage,
  reducer,
  loadDashboard,
  setFilters,
  DataTable
} = await import('../node_modules/.cache/flexxus-tests/integration.mjs')
const originalAdapter = axios.defaults.adapter
after(() => {
  axios.defaults.adapter = originalAdapter
})
const reply = (config, data) => ({
  data: { data, error: null },
  status: 200,
  statusText: 'OK',
  headers: {},
  config
})
const filters = { year: 2024, month: 2, branch: 'SUC_PERICO' }
const articleFilters = {
  busqueda: 'BENELLI & 400',
  codigoRubro: '00066',
  soloActivos: false,
  Pagina: 2,
  Tamanio: 10
}

test('artículos: codifica filtros, conserva códigos y respeta paginación', async () => {
  const urls = []
  axios.defaults.adapter = async (config) => {
    urls.push(config.url)
    return reply(config, {
      items: [{ codigo: '000722' }],
      total: 21,
      pagina: 2,
      tamanioPagina: 10,
      totalPaginas: 3
    })
  }
  const result = await new ArticulosProxy().buscar(articleFilters)
  const url = new URL(urls[0], 'http://local')
  assert.equal(url.pathname, '/api/v1/Articulos')
  assert.equal(url.searchParams.get('busqueda'), 'BENELLI & 400')
  assert.equal(url.searchParams.get('codigoRubro'), '00066')
  assert.equal(url.searchParams.get('soloActivos'), 'false')
  assert.equal(url.searchParams.get('Pagina'), '2')
  assert.equal(result.items[0].codigo, '000722')
  assert.equal(result.total, 21)
  await new ArticulosProxy().detalle('000722')
  assert.equal(urls[1], '/api/v1/Articulos/000722')
})

test('solicitudes simultáneas idénticas comparten una sola llamada HTTP', async () => {
  let count = 0
  axios.defaults.adapter = async (config) => {
    count++
    return reply(config, { codigo: '000722' })
  }
  await Promise.all([
    new ArticulosProxy().detalle('000722'),
    new ArticulosProxy().detalle('000722')
  ])
  assert.equal(count, 1)
})

test('400/401/404/500 y fallo de red rechazan sin devolver mocks', async () => {
  for (const status of [400, 401, 404, 500, undefined]) {
    axios.defaults.adapter = async (config) => {
      throw new axios.AxiosError(
        'test failure',
        'ERR_TEST',
        config,
        undefined,
        status
          ? { status, data: { data: null, error: {} }, config, headers: {}, statusText: 'Error' }
          : undefined
      )
    }
    await assert.rejects(new ArticulosProxy().buscar(articleFilters), (error) => {
      assert.ok(apiErrorMessage(error).length > 10)
      if (!status) assert.match(apiErrorMessage(error), /conectar/)
      return true
    })
    await assert.rejects(new DashboardProxy().getLibroIvaVentas(filters))
  }
})

test('respuesta vacía válida y sobre inválido se distinguen', async () => {
  axios.defaults.adapter = async (config) =>
    reply(config, { items: [], total: 0, pagina: 1, tamanioPagina: 10, totalPaginas: 0 })
  assert.deepEqual((await new ArticulosProxy().buscar(articleFilters)).items, [])
  axios.defaults.adapter = async (config) => reply(config, null)
  await assert.rejects(new ArticulosProxy().detalle('empty'), /respuesta no válida/)
})

test('filtros de fecha incluyen año bisiesto y sucursal sin traducir códigos', () => {
  assert.deepEqual(periodParams(filters), {
    Desde: '2024-02-01',
    Hasta: '2024-02-29',
    CodigoSucursal: 'SUC_PERICO'
  })
  assert.equal(periodParams({ ...filters, year: 2025 }).Hasta, '2025-02-28')
})

test('dashboard adapta los contratos, sin calcular IVA ficticio ni usar la ruta obsoleta', async () => {
  const urls = []
  axios.defaults.adapter = async (config) => {
    const url = new URL(config.url, 'http://local')
    urls.push(url)
    const route = url.pathname
    let data
    if (route.endsWith('libro-iva/resumen')) data = { ivaVentas: 0, ivaCompras: 25, saldo: 25 }
    else if (route.endsWith('Ventas/resumen')) data = { ticketPromedio: 12 }
    else if (route.endsWith('por-tipo-comprobante'))
      data = [{ codigo: 'FA', descripcion: 'Factura A', ivaVentas: 0, ivaCompras: 25 }]
    else if (route.endsWith('Sucursales')) data = [{ codigo: 'SUC_PERICO', descripcion: 'Perico' }]
    else if (route.endsWith('Proveedores/jerarquia'))
      data = [{ clave: '00002', etiqueta: 'Proveedor', cantidad: 2, valorizado: 30 }]
    else if (route.endsWith('Ventas/jerarquia'))
      data = url.searchParams.has('area')
        ? [{ clave: 'USER', etiqueta: 'Usuario', cantidad: 2, precioSinIva: 10, precioTotal: 12 }]
        : [{ clave: 'VENTAS' }]
    else throw new Error(`Unexpected route: ${route}`)
    return reply(config, data)
  }
  const data = await new DashboardProxy().getLibroIvaVentas(filters)
  assert.equal(data.resumen.ivaVentas, 0)
  assert.equal(data.resumen.facturacionPromedio, 12)
  assert.equal(data.usuarios[0].precioSinIva, 10)
  assert.equal(data.proveedores[0].id, '00002')
  assert.equal(
    urls.find((u) => u.pathname.endsWith('libro-iva/resumen')).searchParams.get('CodigoSucursal'),
    'SUC_PERICO'
  )
  assert.ok(urls.every((u) => !u.pathname.includes('/dashboard/')))
})

test('evolución fiscal usa doce períodos y limita concurrencia a tres', async () => {
  let active = 0
  let maximum = 0
  const dates = []
  axios.defaults.adapter = async (config) => {
    active++
    maximum = Math.max(maximum, active)
    dates.push(new URL(config.url, 'http://local').searchParams.get('Desde'))
    await new Promise((resolve) => setImmediate(resolve))
    active--
    return reply(config, { ivaVentas: 0, ivaCompras: 1, saldo: 1 })
  }
  const result = await new DashboardProxy().evolucion(filters)
  assert.equal(result.length, 12)
  assert.equal(new Set(dates).size, 12)
  assert.ok(maximum <= 3)
  assert.equal(result[0].ventas, 0)
})

test('Redux descarta respuestas tardías y evita cargas duplicadas de StrictMode', async () => {
  const original = DashboardProxy.prototype.getLibroIvaVentas
  const pending = []
  DashboardProxy.prototype.getLibroIvaVentas = () => new Promise((resolve) => pending.push(resolve))
  try {
    const store = configureStore({ reducer: { dashboard: reducer } })
    const a = store.dispatch(loadDashboard(filters))
    await store.dispatch(loadDashboard(filters))
    assert.equal(pending.length, 1)
    const next = { ...filters, month: 3 }
    store.dispatch(setFilters(next))
    const b = store.dispatch(loadDashboard(next))
    pending[1]({ updatedAt: 'new' })
    await b
    pending[0]({ updatedAt: 'old' })
    await a
    assert.equal(store.getState().dashboard.data.updatedAt, 'new')
  } finally {
    DashboardProxy.prototype.getLibroIvaVentas = original
  }
})

test('tabla vacía informa explícitamente la ausencia de resultados', () => {
  const html = renderToStaticMarkup(
    React.createElement(DataTable, {
      rows: [],
      columns: [],
      getRowId: (row) => row.id,
      ariaLabel: 'Vacío'
    })
  )
  assert.match(html, /No hay datos para esta consulta/)
})

test(
  'integración GET real a través del proxy Vite',
  { skip: !process.env.FLEXXUS_LIVE_TEST },
  async () => {
    axios.defaults.adapter = originalAdapter
    axios.defaults.baseURL = 'http://127.0.0.1:5173'
    try {
      const articulo = await new ArticulosProxy().detalle('000722')
      assert.equal(articulo.codigo, '000722')
      const data = await new DashboardProxy().getLibroIvaVentas({
        year: 2025,
        month: 1,
        branch: ''
      })
      assert.ok(data.sucursales.some((s) => s.codigo === 'CASA_CENTRAL'))
      assert.equal(data.resumen.ivaCompras, 33385985.69)
      const sales = await new DashboardProxy().lineas({ year: 2025, month: 1, branch: '' }, 2, 10)
      assert.equal(sales.pagina, 2)
      assert.equal(sales.items.length, 10)
    } finally {
      delete axios.defaults.baseURL
    }
  }
)
