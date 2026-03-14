interface ApiOptions extends RequestInit {
  retries?: number
  retryDelay?: number
}

interface ApiError {
  status: number
  message: string
}

class ApiClientError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
  }
}

async function apiClient<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { retries = 1, retryDelay = 500, ...fetchOptions } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      if (!res.ok) {
        const text = await res.text().catch(() => 'Unknown error')
        throw new ApiClientError(res.status, text)
      }

      return (await res.json()) as T
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }
  }

  throw lastError
}

// Convenience methods
const api = {
  get: <T>(url: string, options?: ApiOptions) => apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, body: unknown, options?: ApiOptions) =>
    apiClient<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(url: string, body: unknown, options?: ApiOptions) =>
    apiClient<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  del: <T>(url: string, options?: ApiOptions) =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),
}

export { api, apiClient, ApiClientError }
export type { ApiError, ApiOptions }
