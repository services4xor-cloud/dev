'use client'

import { useCallback, useRef, useMemo, useState, useEffect } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'

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

/** Country with intensity score — more filter matches = brighter glow */
interface ScoredCountry {
  code: string
  score: number // 0-1 normalized
  matchCount: number
}

interface WorldMapProps {
  /** Countries with intensity scores from active filters */
  scoredCountries?: ScoredCountry[]
  onCountryClick: (code: string | null, name?: string) => void
  /** Country codes for soft preview glow (hover state) */
  previewCountryCodes?: string[]
  /** Ordered list of enriched country codes — newest last, used for path-fading glow */
  enrichedCountries?: string[]
}

/**
 * Color spectrum for dimension matches — cool→warm→white as matches increase.
 * 1 match = teal (cool), 2 = emerald, 3 = gold, 4 = amber, 5 = white-gold (blazing).
 * 0 matches = neighbor proximity glow (subtle warm amber, doesn't compete with filters).
 */
function scoreToColor(score: number, matchCount: number): string {
  if (matchCount >= 5) return '#FFF4CC' // blazing white-gold — full intersection
  if (matchCount >= 4) return '#FFD666' // bright amber — almost perfect match
  if (matchCount >= 3) return '#E8C840' // warm gold — strong connection
  if (matchCount >= 2) return '#4ECDC4' // teal-green — moderate overlap
  if (matchCount >= 1) return '#45B7AA' // cool teal — single dimension
  if (score > 0) return '#6B5B3E' // warm earth — neighbor proximity only
  return '#2d3748'
}

/**
 * Path-fading glow for enriched (clicked) countries.
 * Most recent = brightest gold, older = progressively dimmer with cooler hue.
 */
function enrichedToColor(recency: number): string {
  // recency: 1.0 = most recent, fading to 0 for oldest
  if (recency >= 0.9) return '#FFD700' // blazing gold — current selection
  if (recency >= 0.5) return '#E8C840' // warm bright gold — recent
  return '#C9A227' // standard gold — oldest in path
}

function enrichedToOpacity(recency: number): number {
  // Strong glow for all enriched, strongest for newest
  return 0.25 + recency * 0.25 // range: 0.25 → 0.50
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

  // Persist map viewport to sessionStorage on move
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

  // Build scored map + preview set + enriched recency map
  const scoreMap = useMemo(() => {
    const m: globalThis.Map<string, ScoredCountry> = new globalThis.Map()
    for (const sc of scoredCountries) m.set(sc.code, sc)
    return m
  }, [scoredCountries])

  const previewCodes = useMemo(() => new Set<string>(previewCountryCodes), [previewCountryCodes])

  // Recency map: newest enriched = 1.0, oldest = lowest
  const enrichedRecency = useMemo(() => {
    const m = new globalThis.Map<string, number>()
    const len = enrichedCountries.length
    if (len === 0) return m
    for (let i = 0; i < len; i++) {
      // Linear fade: oldest = 0.33, newest = 1.0 (never fully transparent)
      m.set(enrichedCountries[i], 0.33 + 0.67 * (i / Math.max(len - 1, 1)))
    }
    return m
  }, [enrichedCountries])

  const enrichedSet = useMemo(() => new Set(enrichedCountries), [enrichedCountries])

  // --- Map style expressions ---
  // Priority: enriched countries (path glow) > scored countries (dimension heat) > preview > default

  const fillColor = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // 1. Enriched countries — path-fading gold trail
    for (const code of enrichedCountries) {
      const recency = enrichedRecency.get(code) ?? 0.5
      expr.push(code, enrichedToColor(recency))
    }

    // 2. Scored countries — dimension heat spectrum
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, scoreToColor(sc.score, sc.matchCount))
      }
    }

    // 3. Preview countries
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, '#5B8A84') // muted teal for preview
      }
    }

    expr.push('#2d3748') // default
    return expr as unknown as string
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet, enrichedRecency])

  const fillOpacity = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return 0.08

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: path-fading opacity
    for (const code of enrichedCountries) {
      const recency = enrichedRecency.get(code) ?? 0.5
      expr.push(code, enrichedToOpacity(recency))
    }

    // Scored: heat-mapped opacity
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        const opacity = 0.06 + sc.score * 0.32
        expr.push(code, Math.min(opacity, 0.4))
      }
    }

    // Preview: soft
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, 0.12)
      }
    }

    expr.push(0.04) // default
    return expr as unknown as number
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet, enrichedRecency])

  const borderColor = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: gold borders with recency glow
    for (const code of enrichedCountries) {
      const recency = enrichedRecency.get(code) ?? 0.5
      expr.push(code, enrichedToColor(recency))
    }

    // Scored: teal-to-gold spectrum for borders too
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, scoreToColor(sc.score, sc.matchCount))
      }
    }

    // Preview
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, '#5B8A84')
      }
    }

    expr.push('#1f2937')
    return expr as unknown as string
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet, enrichedRecency])

  const borderWidth = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0
    if (!hasActive) return 0.4

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: thick border for current, thinner for trail
    for (const code of enrichedCountries) {
      const recency = enrichedRecency.get(code) ?? 0.5
      expr.push(code, 1.0 + recency * 1.8) // 1.0 → 2.8
    }

    // Scored: border scales with match intensity
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, Math.min(0.4 + sc.score * 2.0, 2.5))
      }
    }

    // Preview
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        expr.push(code, 0.6)
      }
    }

    expr.push(0.2)
    return expr as unknown as number
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet, enrichedRecency])

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
      </Map>
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
