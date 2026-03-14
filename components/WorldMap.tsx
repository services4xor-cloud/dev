'use client'

import { useCallback, useRef, useMemo, useState, useEffect } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { MapCountry } from '@/types/domain'

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

interface WorldMapProps {
  countries: MapCountry[]
  onCountryClick: (code: string | null, name?: string) => void
  selectedCountry?: string | null
  /** Country codes to show as soft preview glow (from search-as-you-type) */
  previewCountryCodes?: string[]
}

export default function WorldMap({
  countries,
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

  // Save on unmount too
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
        // Clicked water / empty area → deselect
        onCountryClick(null)
      }
    },
    [onCountryClick]
  )

  // Build sets: confirmed filter results vs preview (search-as-you-type)
  const highlightedCodes = useMemo(() => new Set(countries.map((c) => c.code)), [countries])
  const previewCodes = useMemo(() => new Set(previewCountryCodes), [previewCountryCodes])

  // --- Map style expressions ---
  // 4 tiers: Selected (bright gold) > Confirmed (medium gold) > Preview (soft pulse) > Default (dim)

  const fillColor = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return '#C9A227' // uniform subtle gold

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, '#C9A227')
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, '#C9A227')
    }
    // Preview countries — softer warm gold
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !highlightedCodes.has(code)) {
        expr.push(code, '#C9A227')
      }
    }
    expr.push('#2d3748') // fallback: dark slate
    return expr as unknown as string
  }, [highlightedCodes, previewCodes, selectedCountry])

  const fillOpacity = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return 0.08

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, 0.5) // selected: bright
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, 0.25) // confirmed: medium
    }
    // Preview: soft glow between confirmed and default
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !highlightedCodes.has(code)) {
        expr.push(code, 0.15)
      }
    }
    expr.push(0.04) // others: barely visible
    return expr as unknown as number
  }, [highlightedCodes, previewCodes, selectedCountry])

  const borderColor = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, '#C9A227')
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, '#C9A227')
    }
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !highlightedCodes.has(code)) {
        expr.push(code, '#C9A227')
      }
    }
    expr.push('#1f2937') // fallback: very dark border
    return expr as unknown as string
  }, [highlightedCodes, previewCodes, selectedCountry])

  const borderWidth = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry || previewCodes.size > 0
    if (!hasActive) return 0.4

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, 2.5) // thick for selected
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, 1)
    }
    for (const code of Array.from(previewCodes)) {
      if (code !== selectedCountry && !highlightedCodes.has(code)) {
        expr.push(code, 0.6) // preview: subtle border
      }
    }
    expr.push(0.2) // others: hairline
    return expr as unknown as number
  }, [highlightedCodes, previewCodes, selectedCountry])

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
