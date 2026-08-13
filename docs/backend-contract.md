# Contrato del backend

La SPA consume el backend mediante los proxies de `src/services`.

## Variables de entorno

- `VITE_API_URL`: URL base del backend, por defecto `http://localhost:8000`.
- `VITE_USE_MOCKS`: usa los datos locales salvo que su valor sea exactamente `false`.

Para conectar la API real, establecer `VITE_USE_MOCKS=false`, configurar `VITE_API_URL` y habilitar CORS en el backend para el dominio del frontend.
