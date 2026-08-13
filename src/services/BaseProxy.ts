export type Query = Record<string, string | number | boolean | undefined>
export class BaseProxy {
  protected readonly baseUrl: string
  constructor(path = '') {
    const root = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    this.baseUrl = `${root.replace(/\/$/, '')}${path}`
  }
  protected makeUrl(path = '', query?: Query) {
    const params = new URLSearchParams()
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value))
    })
    return `${this.baseUrl}${path}${params.size ? `?${params}` : ''}`
  }
  protected async get<T>(path = '', query?: Query): Promise<T> {
    const response = await fetch(this.makeUrl(path, query), {
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)
    const payload = (await response.json()) as T | { data: T }
    return typeof payload === 'object' && payload !== null && 'data' in payload
      ? payload.data
      : payload
  }
}
export default BaseProxy
