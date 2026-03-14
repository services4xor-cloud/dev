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
  selectedCountry?: string | null
  /** Country codes for soft preview glow (hover state) */
  previewCountryCodes?: string[]
}

export default function WorldMap({
  scoredCountries = [],
  onCountryClick,
  selectedCountry,
  previewCountryCodes = [],
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

  // Build scored map + preview set
  const scoreMap = useMemo(() => {
    const m: globalThis.Map<string, ScoredCountry> = new globalThis.Map()
    for (const sc of scoredCountries) m.set(sc.code, sc)
    return m
  }, [scoredCountries])
  const previewCodes = useMemo(() => new Set<string>(previewCountryCodes), [previewCountryCodes])

  // --- Map style expressions ---
  // Graduated intensity: score 0.2 = dim, score 0.5 = medium, score 1.0 = blazing
  // 5 tiers: Selected > High score > Medium score > Low score > Preview > Default

  // Color graduation: score drives color from dim amber → gold → white-gold
  const scoreToColor = (score: number): string => {
    if (score >= 0.8) return '#FFF4CC' // blazing white-gold (4-5 dimensions)
    if (score >= 0.6) return '#E8C840' // bright gold (3 dimensions)
    if (score >= 0.4) return '#C9A227' // standard gold (2 dimensions)
    return '#A07820' // warm amber (1 dimension)
  }

  const fillColor = useMemo(() => {
    const hasActive = scoreMap.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, '#FFF4CC') // selected = blazing
    for (const [code, sc] of Array.from(scoreMap)) {
      if (code !== selectedCountry) expr.push(code, scoreToColor(sc.score))
    }
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !scoreMap.has(code)) {
        expr.push(code, '#8B6914') // preview = muted gold
      }
    }
    expr.push('#2d3748')
    return expr as unknown as string
  }, [scoreMap, previewCodes, selectedCountry])

  const fillOpacity = useMemo(() => {
    const hasActive = scoreMap.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return 0.08

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, 0.55)

    // Graduated intensity: score drives opacity (0.1 base + score * 0.5)
    for (const [code, sc] of Array.from(scoreMap)) {
      if (code !== selectedCountry) {
        const opacity = 0.08 + sc.score * 0.5
        expr.push(code, Math.min(opacity, 0.6))
      }
    }
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !scoreMap.has(code)) {
        expr.push(code, 0.15) // preview: soft
      }
    }
    expr.push(0.04)
    return expr as unknown as number
  }, [scoreMap, previewCodes, selectedCountry])

  const borderColor = useMemo(() => {
    const hasActive = scoreMap.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, '#C9A227')
    for (const [code] of Array.from(scoreMap)) {
      if (code !== selectedCountry) expr.push(code, '#C9A227')
    }
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !scoreMap.has(code)) {
        expr.push(code, '#C9A227')
      }
    }
    expr.push('#1f2937')
    return expr as unknown as string
  }, [scoreMap, previewCodes, selectedCountry])

  const borderWidth = useMemo(() => {
    const hasActive = scoreMap.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return 0.4

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, 2.5)

    // Border also scales with score
    for (const [code, sc] of Array.from(scoreMap)) {
      if (code !== selectedCountry) {
        const width = 0.4 + sc.score * 2.0
        expr.push(code, Math.min(width, 2.5))
      }
    }
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !scoreMap.has(code)) {
        expr.push(code, 0.6)
      }
    }
    expr.push(0.2)
    return expr as unknown as number
  }, [scoreMap, previewCodes, selectedCountry])

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
