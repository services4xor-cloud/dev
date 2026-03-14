'use client'

import { useCallback, useRef, useMemo, useState } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { MapCountry } from '@/types/domain'

interface WorldMapProps {
  countries: MapCountry[]
  onCountryClick: (code: string | null) => void
  selectedCountry?: string | null
}

export default function WorldMap({ countries, onCountryClick, selectedCountry }: WorldMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string
    x: number
    y: number
  } | null>(null)

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
        onCountryClick(features[0].properties.ISO_A2)
      } else {
        // Clicked water / empty area → deselect
        onCountryClick(null)
      }
    },
    [onCountryClick]
  )

  // Build a set of highlighted country codes from filter results
  const highlightedCodes = useMemo(() => new Set(countries.map((c) => c.code)), [countries])

  // --- Map style expressions ---
  // Default: all countries subtle. Selected: bright gold. Filtered: medium. Others: very dim.

  const fillColor = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry
    if (!hasActive) return '#C9A227' // uniform subtle gold

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, '#C9A227') // gold for selected
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, '#C9A227')
    }
    expr.push('#2d3748') // fallback: dark slate
    return expr as unknown as string
  }, [highlightedCodes, selectedCountry])

  const fillOpacity = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry
    if (!hasActive) return 0.08 // very subtle default

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, 0.5) // selected: bright
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, 0.25) // filtered: medium
    }
    expr.push(0.04) // others: barely visible
    return expr as unknown as number
  }, [highlightedCodes, selectedCountry])

  const borderColor = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry
    if (!hasActive) return '#C9A227'

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, '#C9A227') // gold border
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, '#C9A227')
    }
    expr.push('#1f2937') // fallback: very dark border
    return expr as unknown as string
  }, [highlightedCodes, selectedCountry])

  const borderWidth = useMemo(() => {
    const hasActive = highlightedCodes.size > 0 || !!selectedCountry
    if (!hasActive) return 0.4

    const expr: unknown[] = ['match', ['get', 'ISO_A2']]
    if (selectedCountry) expr.push(selectedCountry, 2.5) // thick for selected
    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) expr.push(code, 1)
    }
    expr.push(0.2) // others: hairline
    return expr as unknown as number
  }, [highlightedCodes, selectedCountry])

  return (
    <div className="relative" style={{ width: '100%', height: '100vh' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 20, latitude: 10, zoom: 2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        renderWorldCopies={false}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredCountry(null)}
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
