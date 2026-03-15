'use client'

import { useCallback, useRef, useMemo, useState, useEffect } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

const MAP_STATE_KEY = 'bex-map-viewport'

function getSavedViewport() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(MAP_STATE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { longitude: number; latitude: number; zoom: number }
  } catch {
    return null
  }
}

/** Country with intensity score — tracks WHICH dimensions match for color blending */
interface ScoredCountry {
  code: string
  score: number // 0-1 normalized
  matchCount: number
  dimensions: string[] // which dimension types match (e.g. ['language', 'faith'])
}

interface WorldMapProps {
  scoredCountries?: ScoredCountry[]
  onCountryClick: (code: string | null, name?: string) => void
  previewCountryCodes?: string[]
  /** Ordered list of enriched country codes — used for connection lines */
  enrichedCountries?: string[]
}

// ─── Dimension-specific RGB values for color blending ─────────────────────────
const DIMENSION_RGB: Record<string, [number, number, number]> = {
  language: [78, 205, 196], // teal
  faith: [167, 139, 250], // violet
  sector: [52, 211, 153], // emerald
  location: [251, 191, 36], // amber
  currency: [253, 224, 71], // yellow
}

/**
 * Blend dimension-specific colors based on WHICH dimensions match.
 * Each unique combination produces a distinct color — Language+Faith = blue-purple,
 * Language+Sector = bright green, etc. More matches = brighter (boosted toward white).
 */
function dimensionsToColor(dimensions: string[], matchCount: number): string {
  if (dimensions.length === 0) return '#6B5B3E' // neighbor proximity — warm earth

  let r = 0,
    g = 0,
    b = 0
  for (const d of dimensions) {
    const rgb = DIMENSION_RGB[d] ?? [200, 200, 200]
    r += rgb[0]
    g += rgb[1]
    b += rgb[2]
  }
  const n = dimensions.length
  r = Math.round(r / n)
  g = Math.round(g / n)
  b = Math.round(b / n)

  // Boost toward white based on total matches (more = brighter)
  const boost = Math.min(matchCount / 5, 1) * 0.35
  r = Math.min(255, Math.round(r + (255 - r) * boost))
  g = Math.min(255, Math.round(g + (255 - g) * boost))
  b = Math.min(255, Math.round(b + (255 - b) * boost))

  return `rgb(${r},${g},${b})`
}

/** Uniform enriched glow — all selected countries shine equally bright */
const ENRICHED_COLOR = '#FFD700'
const ENRICHED_OPACITY = 0.45
const ENRICHED_BORDER_WIDTH = 2.5

/**
 * Great circle interpolation — generates curved arc points between two coordinates.
 * Makes connection lines follow the Earth's curvature instead of straight mercator lines.
 */
function greatCircleArc(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  segments = 24
): [number, number][] {
  const toRad = Math.PI / 180
  const toDeg = 180 / Math.PI
  const φ1 = lat1 * toRad,
    λ1 = lng1 * toRad
  const φ2 = lat2 * toRad,
    λ2 = lng2 * toRad
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
    const φ = Math.atan2(z, Math.sqrt(x * x + y * y))
    const λ = Math.atan2(y, x)
    points.push([λ * toDeg, φ * toDeg])
  }
  return points
}

export default function WorldMap({
  scoredCountries = [],
  onCountryClick,
  previewCountryCodes = [],
  enrichedCountries = [],
}: WorldMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [initialViewport] = useState(
    () => getSavedViewport() ?? { longitude: 20, latitude: 10, zoom: 2 }
  )
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string
    x: number
    y: number
  } | null>(null)

  const saveViewport = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const center = map.getCenter()
    const zoom = map.getZoom()
    sessionStorage.setItem(
      MAP_STATE_KEY,
      JSON.stringify({ longitude: center.lng, latitude: center.lat, zoom })
    )
  }, [])

  useEffect(() => {
    return () => saveViewport()
  }, [saveViewport])

  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const features = e.features
    if (features?.[0]?.properties?.name) {
      setHoveredCountry({
        name: features[0].properties.name,
        x: e.point.x,
        y: e.point.y,
      })
    } else {
      setHoveredCountry(null)
    }
  }, [])

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features
      if (features?.[0]?.properties?.ISO_A2) {
        onCountryClick(features[0].properties.ISO_A2, features[0].properties.name as string)
      } else {
        onCountryClick(null)
      }
    },
    [onCountryClick]
  )

  const scoreMap = useMemo(() => {
    const m: globalThis.Map<string, ScoredCountry> = new globalThis.Map()
    for (const sc of scoredCountries) m.set(sc.code, sc)
    return m
  }, [scoredCountries])

  const previewCodes = useMemo(() => new Set<string>(previewCountryCodes), [previewCountryCodes])
  const enrichedSet = useMemo(() => new Set(enrichedCountries), [enrichedCountries])

  // ─── Connection lines between enriched countries (great circle arcs) ────────
  const connectionGeoJSON = useMemo(() => {
    if (enrichedCountries.length < 2) return null

    const features: unknown[] = []
    for (let i = 0; i < enrichedCountries.length - 1; i++) {
      const c1 = COUNTRY_OPTIONS.find((c) => c.code === enrichedCountries[i])
      const c2 = COUNTRY_OPTIONS.find((c) => c.code === enrichedCountries[i + 1])
      if (!c1 || !c2) continue
      const arc = greatCircleArc(c1.lat, c1.lng, c2.lat, c2.lng)
      features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: arc },
        properties: { index: i },
      })
    }

    return { type: 'FeatureCollection', features }
  }, [enrichedCountries])

  // ─── Enriched country centroid markers ──────────────────────────────────────
  const enrichedPointsGeoJSON = useMemo(() => {
    const features = enrichedCountries
      .map((code, i) => {
        const c = COUNTRY_OPTIONS.find((co) => co.code === code)
        if (!c) return null
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
          properties: { index: i, total: enrichedCountries.length },
        }
      })
      .filter(Boolean)
    return { type: 'FeatureCollection', features }
  }, [enrichedCountries])

  // ─── Map style expressions ──────────────────────────────────────────────────
  // Priority: enriched > scored (with dimension blending) > preview > default

  const fillColor = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // 1. Enriched — uniform bright gold
    for (const code of enrichedCountries) {
      expr.push(code, ENRICHED_COLOR)
    }

    // 2. Scored — dimension-blended colors (unique per combination)
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, dimensionsToColor(sc.dimensions, sc.matchCount))
      }
    }

    // 3. Preview
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, '#5B8A84')
      }
    }

    expr.push('#2d3748')
    return expr as unknown as string
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet])

  const fillOpacity = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return 0.08

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: uniform strong opacity
    for (const code of enrichedCountries) {
      expr.push(code, ENRICHED_OPACITY)
    }

    // Scored: opacity scales with score, higher floor for visibility
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        const opacity = 0.08 + sc.score * 0.35
        expr.push(code, Math.min(opacity, 0.45))
      }
    }

    // Preview
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, 0.12)
      }
    }

    expr.push(0.04)
    return expr as unknown as number
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet])

  const borderColor = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: bright gold border
    for (const code of enrichedCountries) {
      expr.push(code, ENRICHED_COLOR)
    }

    // Scored: dimension-blended border colors
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, dimensionsToColor(sc.dimensions, sc.matchCount))
      }
    }

    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, '#5B8A84')
      }
    }

    expr.push('#1f2937')
    return expr as unknown as string
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet])

  const borderWidth = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return 0.4

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: uniform thick border
    for (const code of enrichedCountries) {
      expr.push(code, ENRICHED_BORDER_WIDTH)
    }

    // Scored: border scales with score
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, Math.min(0.4 + sc.score * 2.0, 2.5))
      }
    }

    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, 0.6)
      }
    }

    expr.push(0.2)
    return expr as unknown as number
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet])

  return (
    <div className="relative" style={{ width: '100%', height: '100vh' }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        renderWorldCopies={false}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredCountry(null)}
        onMoveEnd={saveViewport}
        interactiveLayerIds={['country-fill']}
        cursor="pointer"
      >
        {/* Country polygons */}
        <Source id="countries" type="geojson" data="/geo/countries.json">
          <Layer
            id="country-fill"
            type="fill"
            paint={{
              'fill-color': fillColor,
              'fill-opacity': fillOpacity,
            }}
          />
          <Layer
            id="country-border"
            type="line"
            paint={{
              'line-color': borderColor,
              'line-width': borderWidth,
              'line-opacity': 0.6,
            }}
          />
        </Source>

        {/* Connection arcs between enriched countries */}
        {connectionGeoJSON && (
          <Source id="connections" type="geojson" data={connectionGeoJSON as GeoJSON.GeoJSON}>
            <Layer
              id="connection-line-glow"
              type="line"
              paint={{
                'line-color': '#FFD700',
                'line-width': 6,
                'line-opacity': 0.15,
                'line-blur': 4,
              }}
            />
            <Layer
              id="connection-line"
              type="line"
              paint={{
                'line-color': '#FFD700',
                'line-width': 2,
                'line-opacity': 0.7,
                'line-dasharray': [2, 1.5],
              }}
            />
          </Source>
        )}

        {/* Enriched country centroid markers */}
        {enrichedCountries.length > 0 && (
          <Source
            id="enriched-points"
            type="geojson"
            data={enrichedPointsGeoJSON as GeoJSON.GeoJSON}
          >
            <Layer
              id="enriched-marker-glow"
              type="circle"
              paint={{
                'circle-radius': 10,
                'circle-color': '#FFD700',
                'circle-opacity': 0.2,
                'circle-blur': 0.8,
              }}
            />
            <Layer
              id="enriched-marker"
              type="circle"
              paint={{
                'circle-radius': 5,
                'circle-color': '#FFD700',
                'circle-opacity': 0.9,
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#FFF8E1',
                'circle-stroke-opacity': 0.8,
              }}
            />
          </Source>
        )}
      </Map>

      {/* Hover tooltip */}
      {hoveredCountry && (
        <div
          className="pointer-events-none absolute z-30 rounded-lg bg-brand-surface/95 px-3 py-1.5 text-sm text-brand-accent shadow-lg backdrop-blur"
          style={{ left: hoveredCountry.x + 12, top: hoveredCountry.y - 20 }}
        >
          {hoveredCountry.name}
        </div>
      )}
    </div>
  )
}
