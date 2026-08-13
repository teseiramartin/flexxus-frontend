# Flexxus BI Frontend

Dashboard de Libro IVA Ventas construido con React, TypeScript y Material UI.

## Ejecutar

```bash
npm install
npm run dev
```

La aplicación usa datos mock por defecto. Para conectarla al backend, copiar `.env.example` a `.env.local`, configurar la URL y establecer `NEXT_PUBLIC_USE_MOCKS=false`.

## Estructura

- `app`: rutas y configuración global.
- `src/components`: componentes de la pantalla; cada componente tiene carpeta, archivo TSX, CSS e índice.
- `src/shared/components`: componentes reutilizables, incluida `DataTable` con paginación y filas expandidas.
- `src/services`: `BaseProxy` y proxies específicos para los endpoints.
- `src/state/dashboard`: actions, reducer, types y provider del dashboard.
- `src/types`, `src/utils` y `src/mocks`: contratos, utilidades y datos de desarrollo.

## Validación

- `npm run lint`
- `npm run build`
