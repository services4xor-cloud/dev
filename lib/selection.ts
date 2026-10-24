/**
 * Opportunities the Explorer picked for the agent ("Ask the agent about these").
 * Kept in sessionStorage like the map filters; the agent route re-loads them
 * from the DB by id, so nothing here is trusted as content.
 */
const KEY = 'bex-selected-opportunities'
export const SELECTION_EVENT = 'bex-selection-changed'
const MAX = 10

export function getSelected(): string[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    const ids = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(ids) ? ids.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function setSelected(ids: string[]): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX)))
    window.dispatchEvent(new Event(SELECTION_EVENT))
  } catch {
    // storage unavailable — selection just won't persist
  }
}

export function toggleSelected(id: string): string[] {
  const current = getSelected()
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
  setSelected(next)
  return next.slice(0, MAX)
}
