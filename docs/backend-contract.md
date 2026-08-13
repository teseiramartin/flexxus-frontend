# Contrato propuesto: Libro IVA Ventas

La primera versión consume un endpoint agregado para mantener consistente la fotografía del dashboard:

`GET /api/v1/dashboard/libro-iva-ventas?year=2025&month=1&branch=001`

La respuesta puede ser el objeto directo o estar envuelta en `{ "data": ... }`. Su contrato TypeScript está en `src/types/dashboard.ts` e incluye resumen, evolución mensual, comprobantes, proveedores, usuarios y detalle de ventas.

## Integración preparada

- `src/services/BaseProxy.ts` concentra URL base, query string, errores y deserialización.
- `DashboardProxy` administra el endpoint, mocks y caché por filtros durante una hora.
- `SucursalesProxy` queda listo para consumir el endpoint existente del backend.
- El botón **Actualizar** invalida la combinación activa y fuerza una consulta nueva.
- Las tablas usan paginación cliente para la maqueta. Cuando el volumen real lo requiera, los endpoints de detalle deberían aceptar `page` y `pageSize`.
- `POST /api/v1/sync/all` continúa fuera del frontend porque el backend lo define como operación administrativa.

Para conectar la API real, establecer `NEXT_PUBLIC_USE_MOCKS=false`, configurar `NEXT_PUBLIC_API_URL` y habilitar CORS en el backend.
