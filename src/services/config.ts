export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
