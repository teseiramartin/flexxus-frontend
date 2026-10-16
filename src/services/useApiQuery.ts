import { useEffect, useState } from 'react'
import { apiErrorMessage } from './BaseProxy'

// The caller memoizes query. Results from superseded filters/unmounted views are ignored.
export function useApiQuery<T>(query: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    query: typeof query
    attempt: number
    data?: T
    error?: string
  }>()
  useEffect(() => {
    let active = true
    query().then(
      (data) => {
        if (active) setResult({ query, attempt, data })
      },
      (error) => {
        if (active) setResult({ query, attempt, error: apiErrorMessage(error) })
      }
    )
    return () => {
      active = false
    }
  }, [query, attempt])
  const current = result?.query === query && result.attempt === attempt ? result : undefined
  return {
    data: current?.data,
    error: current?.error,
    pending: !current,
    retry: () => setAttempt((n) => n + 1)
  }
}
