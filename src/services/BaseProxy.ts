import axios from 'axios'
import type { ApiResponse } from '@/src/types/api'
import { API_URL } from './config'

const inFlight = new Map<string, Promise<unknown>>()

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    if (!error.response)
      return 'No se pudo conectar con la API. Revisá la conexión y volvé a intentar.'
    const status = error.response.status
    const messages: Record<number, string> = {
      400: 'Los filtros enviados no son válidos.',
      401: 'La API requiere autenticación.',
      403: 'No tenés permisos para consultar estos datos.',
      404: 'No se encontró el recurso solicitado.',
      500: 'La API no pudo completar la consulta. Volvé a intentar.'
    }
    return messages[status] ?? `La consulta falló (HTTP ${status}).`
  }
  return error instanceof Error ? error.message : 'No se pudieron obtener los datos.'
}

export type QueryValue = string | number | boolean | Array<string | number> | null | undefined
export type QueryParams = Record<string, QueryValue>

class BaseProxy {
  protected _baseUrl: string

  constructor() {
    this._baseUrl = API_URL
  }

  protected get<T>(path: string, params: QueryParams = {}): Promise<T> {
    const url = `${this._baseUrl}${path}${this._makeUrlParams(params)}`
    const existing = inFlight.get(url)
    if (existing) return existing as Promise<T>
    const request = axios
      .get<ApiResponse<T>>(url, { timeout: 30000 })
      .then(({ data }) => {
        if (data.error || data.data === null || data.data === undefined) {
          throw new Error('La API devolvió una respuesta no válida.')
        }
        return data.data
      })
      .finally(() => {
        inFlight.delete(url)
      })
    inFlight.set(url, request)
    return request
  }

  protected _makeUrlParams(params: QueryParams) {
    let queryString = ''
    const entries = Object.entries(params)

    for (let i = 0; i < entries.length; ++i) {
      const entry = entries[i]
      const values = Array.isArray(entry[1]) ? entry[1] : [entry[1]]

      for (let j = 0; j < values.length; ++j) {
        const value = values[j]
        if (value === undefined || value === null || value === '') continue

        const separator = queryString === '' ? '?' : '&'
        queryString += `${separator}${encodeURIComponent(entry[0])}=${encodeURIComponent(String(value))}`
      }
    }

    return queryString
  }
}

export default BaseProxy
