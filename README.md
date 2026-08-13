# Flexxus BI Frontend

Single Page Application de Libro IVA Ventas construida con React 19, Vite, TypeScript, Material UI, Redux Toolkit y Tailwind CSS.

## Ejecutar localmente

```bash
npm install
npm run dev
```

La aplicación usa datos mock por defecto. Para conectarla al backend, copiar `.env.example` a `.env.local`, configurar `VITE_API_URL` y establecer `VITE_USE_MOCKS=false`.

## Comandos

- `npm run dev`: servidor de desarrollo de Vite.
- `npm run build`: genera la aplicación de producción en `dist`.
- `npm run preview`: sirve localmente el contenido compilado.
- `npm run lint`: valida el código con ESLint.
- `npm test`: compila y valida la salida SPA.

## Estructura

- `src/main.tsx`: punto de entrada de React.
- `src/App.tsx`: composición raíz de providers y pantalla principal.
- `src/components`: componentes de la pantalla; cada componente tiene carpeta, archivo TSX, CSS e índice.
- `src/shared/components`: componentes reutilizables, incluida `DataTable` con paginación y filas expandidas.
- `src/services`: `BaseProxy` y proxies específicos para los endpoints.
- `src/state/dashboard`: actions, reducer, types y provider del dashboard.
- `src/types`, `src/utils` y `src/mocks`: contratos, utilidades y datos de desarrollo.

## Despliegue

- Vercel: framework `Vite`, comando `npm run build` y directorio de salida `dist`. `vercel.json` resuelve el fallback de la SPA.
- Cloudflare Pages: comando `npm run build` y directorio de salida `dist`. `public/_redirects` resuelve el fallback de la SPA.
