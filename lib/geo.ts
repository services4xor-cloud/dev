/**
 * geo.ts — Geography utilities
 *
 * Haversine distance, formatted distance/flight-time, UTC offset parsing.
 */

// ─── Haversine distance (km) ────────────────────────────────────────────────
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = Math.PI / 180
  const dLat = (lat2 - lat1) * toRad
  const dLng = (lng2 - lng1) * toRad
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function fmtDistance(km: number): string {
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${Math.round(km)} km`
}

export function fmtFlightTime(km: number): string {
  const hours = km / 800 // average cruise speed
  if (hours < 1) return `~${Math.round(hours * 60)}min`
  return hours < 10 ? `~${hours.toFixed(1)}h` : `~${Math.round(hours)}h`
}

export function getUtcOffsetMinutes(tz: string): number {
  try {
    const now = new Date()
    const str = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const match = str.match(/GMT([+-]\d{1,2}(?::?\d{2})?)/)
    if (!match) return 0
    const parts = match[1].replace(':', '').match(/^([+-])(\d{1,2})(\d{2})?$/)
    if (!parts) return 0
    const sign = parts[1] === '-' ? -1 : 1
    return sign * (parseInt(parts[2]) * 60 + parseInt(parts[3] ?? '0'))
  } catch {
    return 0
  }
}

// ─── Great circle arc (for connection lines on the map) ─────────────────────
/** Points along the great circle between two coordinates, as [lng, lat] pairs. */
export function greatCircleArc(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  segments = 32
): [number, number][] {
  const toRad = Math.PI / 180
  const toDeg = 180 / Math.PI
  const φ1 = lat1 * toRad
  const λ1 = lng1 * toRad
  const φ2 = lat2 * toRad
  const λ2 = lng2 * toRad
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2
      )
    )
  if (d < 0.001)
    return [
      [lng1, lat1],
      [lng2, lat2],
    ]
  const points: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const f = i / segments
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2)
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2)
    const z = A * Math.sin(φ1) + B * Math.sin(φ2)
    points.push([Math.atan2(y, x) * toDeg, Math.atan2(z, Math.sqrt(x * x + y * y)) * toDeg])
  }
  // Keep the line continuous across the antimeridian
  for (let i = 1; i < points.length; i++) {
    while (points[i][0] - points[i - 1][0] > 180) points[i][0] -= 360
    while (points[i][0] - points[i - 1][0] < -180) points[i][0] += 360
  }
  return points
}
