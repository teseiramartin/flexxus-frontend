# Validación de integración — 15/10/2026

## Evidencia inicial de solo lectura

- Ambos repositorios accesibles; frontend sin cambios iniciales. Backend tenía `tools/repair-local-squashed-migrations.sql` no versionado, que se preservó.
- `docker compose ps`: API activa en 8000, SQL Server healthy.
- `GET /openapi/v1.json`: 200. Rutas contrastadas con controllers y DTOs.
- Artículos: 2.513 activos; búsqueda BENELLI: 181 resultados al probar. Página 2 devuelve otra selección.
- `GET /api/v1/Articulos/000722`: 200, código string `000722`, precio venta 623278.59.
- Artículo inexistente: 404 estándar; `Pagina=abc`: 400 estándar.
- Sucursales, resumen fiscal, Dashboard, comprobantes, jerarquías y líneas: 200.
- OPTIONS desde `http://localhost:5173`: 405, sin cabecera CORS. Se verificó conexión real mediante proxy Vite.

## Pruebas automatizadas

Resultado final ejecutado: **12 pruebas aprobadas, 0 fallidas y 0 omitidas**, incluida la prueba viva a través de Vite. Build de producción en modo real exitoso; TypeScript estricto y ESLint sin errores. Vite advierte que el bundle principal supera 500 kB (aproximadamente 599 kB sin comprimir); no impide compilar.

`npm test` ejecuta build y pruebas Node con un bundle de pruebas generado por Vite dentro de `node_modules/.cache/flexxus-tests`. No requiere dependencias nuevas. Incluye:

- URL, filtros codificados, paginación y conservación de ceros iniciales.
- Deduplicación de GET simultáneos.
- Errores 400, 401, 404, 500 y red con adaptador Axios controlado, sin fallback mock.
- Vacío válido frente a respuesta inválida.
- Fechas inclusivas y febrero bisiesto.
- Adaptación de dashboard y propagación de sucursal.
- Doce períodos fiscales con concurrencia máxima de tres.
- Respuestas fuera de orden y doble carga Redux/StrictMode.
- Renderizado explícito de tabla vacía y tests SPA preexistentes.

La prueba viva es opt-in y requiere API y Vite ejecutándose:

```powershell
$env:FLEXXUS_LIVE_TEST='1'
$env:VITE_USE_MOCKS='false'
npm test
Remove-Item Env:FLEXXUS_LIVE_TEST
Remove-Item Env:VITE_USE_MOCKS
npm run typecheck
npm run lint
```

La prueba viva solo realiza GET: artículo, dashboard adaptado y segunda página de ventas por el proxy 5173. Los 401/500 y fallos de red se prueban de manera controlada; no se provocan fallos en SQL Server ni se modifica autenticación. Los 400/404 se comprobaron también contra la API real.

## Navegador

Verificados con el navegador integrado:

- Catálogo inicial real, página 2, búsqueda `000722` y modal con el mismo código y valores del endpoint.
- Indicadores de enero 2025: IVA compras 33.385.985,69 y promedio 86.709,74, coincidentes con las respuestas reales.
- Proveedor → rubro → artículos; usuario → super rubro → artículos.
- Ventas con 1.614 movimientos en enero 2025 y segunda página diferente.
- Sucursal PERICO: usuarios/ventas vacíos en el período probado, compras globales preservadas y alcance visible.
- Búsqueda de artículo inexistente: tabla con mensaje de ausencia de resultados, sin filas mock.
- Diseño Material UI preservado en captura visual.
- Carga final limpia sin errores ni advertencias de consola. Se corrigió el solapamiento del selector vacío y se ajustó `src/shared/components/SectionPanel/SectionPanel.css` para evitar que las tablas ensanchen el documento; ancho final igual al viewport.

## Archivos y responsabilidades

| Archivos                                                           | Cambio                                                                              |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `src/services/BaseProxy.ts`, `config.ts`, `useApiQuery.ts`         | HTTP compartido, entorno, errores, deduplicación y descarte de resultados obsoletos |
| `src/services/ArticulosProxy.ts`, `src/types/api.ts`               | Contratos de API, catálogo y detalle                                                |
| `src/services/DashboardProxy.ts`, `SucursalesProxy.ts`             | Rutas reales, adaptación y filtros                                                  |
| `src/state/dashboard/actions.ts`, `reducers.ts`                    | Thunks existentes con manejo de errores y concurrencia; filtro de sucursal real     |
| `src/App.tsx`, `components/ArticulosPage/ArticulosPage.tsx`        | Navegación y catálogo completo                                                      |
| `components/RemoteData/RemoteData.tsx`                             | Jerarquías bajo demanda, evolución y ventas paginadas                               |
| `components/DashboardPage`, `DashboardFilters`                     | Datos reales, sucursales, fechas y aclaraciones de alcance                          |
| `components/UsersTable`, `ProvidersTable`, `SalesTable`            | Reutilización de tablas con detalles reales y paginación                            |
| `shared/components/DataTable/DataTable.tsx`                        | Estado vacío y montaje de detalles solo al expandir                                 |
| `components/TrendChart`, `VoucherBreakdown`                        | Ceros reales, valores negativos y estado vacío; corrección de prop MUI              |
| `.env.example`, `vite.config.ts`                                   | Configuración local y proxy de desarrollo                                           |
| `package.json`, `tests/api.test.mjs`, `tests/integration-entry.ts` | Typecheck y pruebas focalizadas                                                     |
| `README.md`, `docs/backend-contract.md`, este documento            | Ejecución, decisiones, límites y evidencia                                          |

No se hicieron commits ni push. Ningún archivo de backend se modificó.
