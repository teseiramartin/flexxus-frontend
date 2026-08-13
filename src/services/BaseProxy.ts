export type QueryValue = string | number | boolean | Array<string | number> | null | undefined
export type QueryParams = Record<string, QueryValue>

class BaseProxy {
  protected _baseUrl: string

  constructor() {
    this._baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
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
        queryString += `${separator}${encodeURIComponent(entry[0])}=${encodeURIComponent(value)}`
      }
    }

    return queryString
  }
}

export default BaseProxy
