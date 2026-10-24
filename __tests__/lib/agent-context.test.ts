/**
 * Tests for lib/agent-context.ts: countries handed from the map to the agent.
 */
import { getAgentCountries, setAgentCountries } from '@/lib/agent-context'

const store = new Map<string, string>()
beforeAll(() => {
  ;(globalThis as { sessionStorage?: unknown }).sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  }
})
beforeEach(() => store.clear())

test('is empty by default', () => {
  expect(getAgentCountries()).toEqual([])
})

test('round-trips at most three countries', () => {
  setAgentCountries(['KE', 'DE', 'CH', 'GB'])
  expect(getAgentCountries()).toEqual(['KE', 'DE', 'CH'])
})

test('drops anything that is not an ISO code', () => {
  store.set('bex-agent-countries', JSON.stringify(['KE', 'kenya', 42, '<x>']))
  expect(getAgentCountries()).toEqual(['KE'])
})

test('survives broken storage content', () => {
  store.set('bex-agent-countries', '{not json')
  expect(getAgentCountries()).toEqual([])
})
