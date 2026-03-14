// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

import { api, apiClient, ApiClientError } from '@/lib/api-client'

describe('apiClient', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  test('returns JSON on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    })
    const result = await apiClient('/api/test')
    expect(result).toEqual({ data: 'test' })
  })

  test('throws ApiClientError on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not found'),
    })
    await expect(apiClient('/api/test')).rejects.toThrow(ApiClientError)
  })

  test('retries on failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error')).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ recovered: true }),
    })
    const result = await apiClient('/api/test', { retries: 1, retryDelay: 10 })
    expect(result).toEqual({ recovered: true })
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  test('throws after all retries exhausted', async () => {
    mockFetch.mockRejectedValue(new Error('network error'))
    await expect(apiClient('/api/test', { retries: 2, retryDelay: 10 })).rejects.toThrow(
      'network error'
    )
    expect(mockFetch).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
  })

  test('api.get calls with GET method', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    await api.get('/api/items')
    expect(mockFetch).toHaveBeenCalledWith('/api/items', expect.objectContaining({ method: 'GET' }))
  })

  test('api.post sends JSON body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '1' }),
    })
    await api.post('/api/items', { name: 'test' })
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      })
    )
  })

  test('api.del calls with DELETE method', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ deleted: true }),
    })
    await api.del('/api/items/1')
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/items/1',
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  test('sets Content-Type header by default', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    await apiClient('/api/test')
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })
})
