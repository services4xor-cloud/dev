#!/usr/bin/env node
/**
 * fix-antimeridian.mjs
 *
 * Splits GeoJSON polygon rings that cross the antimeridian (180°/-180°)
 * into separate polygons on each side. Fixes MapLibre rendering artifacts
 * where fills stretch across the entire map.
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT = resolve(__dirname, '../public/geo/countries.json')
const OUTPUT = INPUT // overwrite in place

const geo = JSON.parse(readFileSync(INPUT, 'utf8'))

/**
 * Detect if a ring crosses the antimeridian by checking for large longitude jumps.
 */
function crossesAntimeridian(ring) {
  for (let i = 1; i < ring.length; i++) {
    const dLon = Math.abs(ring[i][0] - ring[i - 1][0])
    if (dLon > 180) return true
  }
  return false
}

/**
 * Interpolate the latitude where a segment crosses the antimeridian (lon = ±180).
 */
function interpolateAtAntimeridian(p1, p2) {
  const [lon1, lat1] = p1
  const [lon2, lat2] = p2

  // Normalize: move both to same side by shifting one by 360
  let nLon1 = lon1
  let nLon2 = lon2
  if (lon1 > 0 && lon2 < 0) nLon2 += 360
  else if (lon1 < 0 && lon2 > 0) nLon1 += 360

  // Interpolate lat at lon = 180 (or -180)
  const target = lon1 > 0 ? 180 : -180
  // Use normalized target
  const nTarget = lon1 > 0 ? 180 : 180 // Both sides map to 180 in normalized space
  const t = (nTarget - nLon1) / (nLon2 - nLon1)
  const lat = lat1 + t * (lat2 - lat1)
  return lat
}

/**
 * Split a ring at antimeridian crossings into eastern (lon > 0) and western (lon < 0) parts.
 */
function splitRing(ring) {
  const eastParts = [] // lon >= 0
  const westParts = [] // lon < 0
  let currentEast = []
  let currentWest = []

  for (let i = 0; i < ring.length; i++) {
    const point = ring[i]
    const isEast = point[0] >= 0

    if (i > 0) {
      const prev = ring[i - 1]
      const prevIsEast = prev[0] >= 0
      const dLon = Math.abs(point[0] - prev[0])

      if (dLon > 180 && prevIsEast !== isEast) {
        // Crossing detected — interpolate
        const lat = interpolateAtAntimeridian(prev, point)

        if (prevIsEast) {
          // Was east, now west
          currentEast.push([180, lat])
          if (currentEast.length >= 3) eastParts.push(currentEast)
          currentEast = []
          currentWest.push([-180, lat])
          currentWest.push(point)
        } else {
          // Was west, now east
          currentWest.push([-180, lat])
          if (currentWest.length >= 3) westParts.push(currentWest)
          currentWest = []
          currentEast.push([180, lat])
          currentEast.push(point)
        }
        continue
      }
    }

    if (isEast) {
      currentEast.push(point)
    } else {
      currentWest.push(point)
    }
  }

  if (currentEast.length >= 3) eastParts.push(currentEast)
  if (currentWest.length >= 3) westParts.push(currentWest)

  // Close each ring
  const result = []
  for (const part of [...eastParts, ...westParts]) {
    const closed = [...part]
    const first = closed[0]
    const last = closed[closed.length - 1]
    if (first[0] !== last[0] || first[1] !== last[1]) {
      closed.push([...first])
    }
    if (closed.length >= 4) {
      result.push(closed)
    }
  }

  return result
}

/**
 * Process a single polygon (array of rings: [exterior, ...holes]).
 * Returns an array of polygons.
 */
function processPolygon(rings) {
  const exterior = rings[0]

  if (!crossesAntimeridian(exterior)) {
    return [rings] // No fix needed
  }

  const splitExteriors = splitRing(exterior)
  // For simplicity, drop holes from antimeridian-crossing polygons
  // (holes in Russia at the antimeridian are extremely unlikely)
  return splitExteriors.map((ext) => [ext])
}

let fixed = 0

for (const feature of geo.features) {
  const geom = feature.geometry
  if (!geom) continue

  if (geom.type === 'Polygon') {
    const results = processPolygon(geom.coordinates)
    if (results.length > 1) {
      // Convert to MultiPolygon
      geom.type = 'MultiPolygon'
      geom.coordinates = results
      fixed++
      console.log(`Split: ${feature.properties.name} (Polygon → MultiPolygon, ${results.length} parts)`)
    }
  } else if (geom.type === 'MultiPolygon') {
    const newPolygons = []
    let changed = false

    for (const polygon of geom.coordinates) {
      const results = processPolygon(polygon)
      if (results.length > 1) changed = true
      newPolygons.push(...results)
    }

    if (changed) {
      geom.coordinates = newPolygons
      fixed++
      console.log(`Split: ${feature.properties.name} (MultiPolygon, now ${newPolygons.length} parts)`)
    }
  }
}

writeFileSync(OUTPUT, JSON.stringify(geo), 'utf8')
console.log(`\nDone. Fixed ${fixed} features. Written to ${OUTPUT}`)
