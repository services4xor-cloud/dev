/**
 * Countries the Explorer wants the agent to focus on (set on the map, read on /agent).
 * Kept in sessionStorage like the offering selection; the server re-validates the codes.
 */
const KEY = 'bex-agent-countries'
const MAX = 3

export function getAgentCountries(): string[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(list)
      ? list.filter((x): x is string => typeof x === 'string' && /^[A-Z]{2}$/.test(x)).slice(0, MAX)
      : []
  } catch {
    return []
  }
}

export function setAgentCountries(codes: string[]): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(codes.slice(0, MAX)))
  } catch {
    // storage unavailable
  }
}
