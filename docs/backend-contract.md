# Contrato propuesto: Libro IVA Ventas

La primera versión consume un único endpoint agregado para mantener consistente la fotografía del dashboard:

`GET /api/v1/dashboard/libro-iva-ventas?year=2025&month=1&branch=001`

La respuesta puede ser el objeto directo o estar envuelta en `{ "data": ... }`. Su forma TypeScript está documentada en `lib/dashboard-types.ts`.

## Decisiones de integración

- Los filtros cambian sólo la consulta del dashboard, sin recargar la página.
- El navegador conserva cada combinación de filtros durante una hora en `localStorage`.
- El botón **Actualizar** invalida la combinación activa y fuerza una nueva consulta.
- Las tablas reciben arreglos paginables en el cliente para esta maqueta. En producción conviene exponer el detalle en un endpoint separado con `page` y `pageSize` cuando el volumen real sea alto.
- El endpoint administrativo `POST /api/v1/sync/all` no se llama desde esta pantalla: el backend actual lo documenta como carga inicial/pruebas. El futuro refresco funcional debería ser un endpoint controlado y autenticado que coordine sincronización y reconstrucción de la vista.

Para conectar la API real, establecer `NEXT_PUBLIC_USE_MOCKS=false` y `NEXT_PUBLIC_API_URL`, y habilitar CORS en el backend para el origen del frontend.
