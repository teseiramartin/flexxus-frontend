# Flexxus BI Frontend

Primera versión del dashboard de **Libro IVA Ventas**, creada con React, TypeScript y Material UI a partir del diseño y modelo del archivo Power BI `Frontera-v5-1.pbix`.

## Ejecutar localmente

```bash
npm install
npm run dev
```

La aplicación arranca con datos mock y no necesita que el backend esté disponible.

## Conectar el backend

Copiar `.env.example` a `.env.local` y configurar:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCKS=false
```

El contrato propuesto está en `docs/backend-contract.md`. El backend debe permitir CORS desde el origen del frontend.

## Comandos

- `npm run dev`: desarrollo local.
- `npm run build`: compilación de producción.
- `npm run lint`: análisis estático.
