# Integración local Flexxus

Diagnóstico realizado el 15/10/2026 sobre `C:\workspace\flexxus-frontend` y `C:\workspace\flexxus-backend`, usando Codebase Memory, archivos fuente, OpenAPI y consultas GET reales. No se modificó el backend, SQL Server, autenticación, infraestructura ni despliegues. No se ejecutaron login ERP ni sincronizaciones. Se preservó el archivo SQL no versionado que ya existía en el backend.

## Arquitecturas y problemas iniciales

Frontend: una SPA sin router, con DashboardPage, Material UI, tablas propias, Axios y Redux Toolkit configurado con reducer y thunks manuales. No existía listado ni detalle de artículos. El dashboard consumía mocks por defecto y una ruta real inexistente (`/api/v1/dashboard/libro-iva-ventas`). Su caché en localStorage no distinguía mocks, servidor ni modo y podía presentar información simulada al activar la API. Las tablas paginaban únicamente en memoria. El build Vite no ejecutaba TypeScript.

Backend: ASP.NET Core .NET 10, controllers versionados, servicios Application y EF Core con SQL Server. El contrato devuelve `{ data, error }`; los errores llevan `status`, `title`, `detail` y extensiones. La paginación devuelve `{ items, total, pagina, tamanioPagina, totalPaginas }`. OpenAPI está en `/openapi/v1.json`; la UI está en `/swagger/index.html`. `/swagger/v1/swagger.json` devuelve 404.

Se conservan Axios, los proxies, el estado global Redux y los thunks. RTK Query no aporta una ventaja suficiente para justificar migrar la arquitectura. Los detalles y páginas independientes usan un hook local; el dashboard y sus filtros permanecen en Redux. Se eliminó el caché persistente; las solicitudes simultáneas idénticas comparten una promesa, tienen timeout de 30 segundos y las respuestas obsoletas no actualizan el estado. Los errores reales no producen mocks de respaldo.

## Matriz implementada

Todas las rutas de la tabla usan GET y el prefijo `/api/v1/`.

| Vista                      | Fuente anterior | Endpoint                         | Adaptación                                                                                              |
| -------------------------- | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Artículos                  | No existía      | `Articulos`                      | Nueva pestaña conservando componentes MUI; búsqueda, código de rubro, activos y paginación del servidor |
| Detalle artículo           | No existía      | `Articulos/{codigo}`             | Modal; códigos siempre string, incluido `000722`                                                        |
| Sucursales                 | Mock            | `Sucursales`                     | Códigos reales `CASA_CENTRAL` y `SUC_PERICO`; selección vacía omite el filtro                           |
| IVA ventas/compras y saldo | Mock            | `libro-iva/resumen`              | Se conservan importes y signo del servidor                                                              |
| Facturación promedio       | Mock            | `Ventas/resumen`                 | Campo `ticketPromedio`: facturación / unidades, según documentación backend                             |
| Comprobantes               | Mock            | `libro-iva/por-tipo-comprobante` | IVA, no neto; descripción y código del comprobante                                                      |
| Evolución anual            | Mock            | `libro-iva/resumen` por mes      | Doce consultas, como máximo tres concurrentes; no usa facturación como si fuera IVA                     |
| Proveedores                | Mock            | `Proveedores/jerarquia`          | Raíz y expansión proveedor → rubro → artículo; pendientes actuales sin fecha/sucursal                   |
| Usuarios                   | Mock            | `Ventas/jerarquia`               | Áreas y usuarios para totales; expansión usuario → super rubro → artículo bajo demanda                  |
| Detalle de ventas          | Mock            | `Ventas/lineas`                  | Paginación remota, adaptación de fecha, usuario, IVA porcentual y artículos                             |

No quedan secciones de dashboard con mocks en modo real. `VITE_USE_MOCKS=true` conserva explícitamente la demostración completa original; los artículos siguen siendo un catálogo real, señalado en pantalla.

## Filtros y límites semánticos

- Año/mes se convierten a `Desde=YYYY-MM-01` y `Hasta=YYYY-MM-DD`, inclusive, usando el último día real del mes. Se envía `CodigoSucursal` sin traducirlo a números.
- Artículos: `busqueda`, `codigoRubro`, `soloActivos`, `Pagina` (desde 1) y `Tamanio`. `soloActivos=true` excluye también bloqueados según backend.
- Ventas: se mantienen los defaults del servidor (por ejemplo, no incluir cobranzas ni remitos). Las jerarquías y líneas comparten el mismo período y sucursal.
- Compras fiscales no poseen sucursal en el contrato. Al elegir una sucursal, las ventas se filtran y las compras siguen siendo globales. La interfaz lo informa.
- Proveedores representa órdenes pendientes del presente. No se presenta como compras históricas del período seleccionado.
- El saldo es crédito menos débito: IVA compras − IVA ventas.
- `Consultado` es la hora de lectura del frontend, no una fecha de sincronización del ERP.
- La API local devolvió IVA ventas igual a cero y descripciones vacías en algunas líneas/jerarquías. Se conservan los valores reales; los códigos se muestran cuando faltan descripciones.
- El endpoint agregado `Dashboard` existe, pero su servicio omite `CodigoSucursal` al consultar libro IVA y su evolución mensual es facturación. Por eso se usan los endpoints específicos adecuados a cada sección.

## Ejecución local

En el backend:

```powershell
Set-Location C:\workspace\flexxus-backend
docker compose ps
```

Durante la validación la API estaba activa en 8000 y SQL Server saludable. Si ya están creados pero detenidos, iniciar los servicios existentes con `docker compose start`. Para crear servicios por primera vez se usa `docker compose up -d`, con la configuración local existente. **El backend ejecuta migraciones al arrancar y registra un servicio de sincronización automática:** revisar esa configuración y obtener autorización antes de crear/reiniciar servicios si ello pudiera alterar la base o sincronizar ERP. Esta integración no necesitó arrancarlos ni recrearlos. No usar `down -v` ni scripts de reparación de migraciones.

En el frontend, si todavía no existe `.env.local`, copiar `.env.example` (no sobrescribir configuraciones propias):

```powershell
Set-Location C:\workspace\flexxus-frontend
Copy-Item .env.example .env.local
npm run dev -- --host 127.0.0.1
```

```dotenv
VITE_API_URL=
VITE_USE_MOCKS=false
```

Abrir `http://127.0.0.1:5173`. En esta sesión también se dejó un `.env.development` local ignorado por Git con esos valores; `.env.local` puede sobrescribirlos. Las dependencias ya estaban instaladas; no se agregó ninguna.

La API no publica CORS: OPTIONS devolvió 405 sin `Access-Control-Allow-Origin`. El navegador consulta `/api` en el mismo origen Vite; el proxy de desarrollo conecta a 8000. No se desactiva CORS ni se modifica seguridad. Una URL absoluta a 8000 vuelve a requerir CORS en el backend.

`npm run preview` no es el entorno integrado de desarrollo. El proxy es exclusivamente local; un despliegue real requiere API accesible por HTTPS y una decisión de CORS o proxy de producción, fuera del alcance autorizado. No usar localhost como API de Vercel. No se cambió `vercel.json` ni se publicó un despliegue.

## Flujo técnico

El componente entrega filtros tipados al thunk Redux (dashboard) o al hook de consulta (catálogo, detalle y paginación). El proxy específico adapta el modelo de pantalla a los parámetros reales. BaseProxy codifica la URL, deduplica llamadas activas y ejecuta Axios. Vite reenvía `/api` al controller de ASP.NET Core; el controller consulta Application/EF Core y responde con el sobre estándar. El proxy extrae `data`, adapta los DTOs y React presenta éxito, carga, error o vacío. Un fallo no usa datos mock. Las expansiones solo montan sus consultas cuando están abiertas.

## Desarrollo backend pendiente o mejoras

- Agregado mensual de IVA para reducir las doce consultas actuales; el gráfico existente ya funciona con resúmenes por período.
- Compras por sucursal e históricos de pendientes no pueden implementarse fielmente con estos contratos; requieren datos y endpoints nuevos si se desean esos cortes.
- Corregir propagación de sucursal del endpoint agregado Dashboard y revisar la calidad de IVA/descripciones sincronizados, con autorización independiente.
- Exponer fecha real de última sincronización si se quiere mostrar frescura del ERP.
- Definir autenticación de usuarios y acceso de producción. `Auth/login` es un diagnóstico de credenciales ERP, no un login de usuario SPA, y no se invoca desde el frontend.
- Mejorar el tamaño del bundle (advertencia de Vite >500 kB), sin impacto en el build actual.
