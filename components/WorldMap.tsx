'use client'

import { useCallback, useRef, useMemo } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { MapCountry } from '@/types/domain'

interface WorldMapProps {
  countries: MapCountry[]
  onCountryClick: (code: string) => void
  selectedCountry?: string | null
}

export default function WorldMap({ countries, onCountryClick, selectedCountry }: WorldMapProps) {
  const mapRef = useRef<MapRef>(null)

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features
      if (features?.[0]?.properties?.ISO_A2) {
        onCountryClick(features[0].properties.ISO_A2)
      }
    },
    [onCountryClick]
  )

  // Build a set of highlighted country codes from filter results
  const highlightedCodes = useMemo(() => new Set(countries.map((c) => c.code)), [countries])

  // Dynamic fill color: highlighted countries get bright gold, selected gets full gold, rest get subtle
  const fillColor = useMemo(() => {
    if (highlightedCodes.size === 0 && !selectedCountry) {
      // No filters active — subtle uniform tint
      return '#C9A227'
    }

    // Build match expression: [match, [get, ISO_A2], ...pairs, fallback]
    const matchExpr: unknown[] = ['match', ['get', 'ISO_A2']]

    if (selectedCountry) {
      matchExpr.push(selectedCountry, '#C9A227') // full gold for selected
    }

    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) {
        matchExpr.push(code, '#C9A227') // bright gold for filtered
      }
    }

    matchExpr.push('#4a5568') // fallback: dim gray for non-matching

    return matchExpr as unknown as string
  }, [highlightedCodes, selectedCountry])

  const fillOpacity = useMemo(() => {
    if (highlightedCodes.size === 0 && !selectedCountry) {
      return 0.12
    }

    const matchExpr: unknown[] = ['match', ['get', 'ISO_A2']]

    if (selectedCountry) {
      matchExpr.push(selectedCountry, 0.45)
    }

    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) {
        matchExpr.push(code, 0.3)
      }
    }

    matchExpr.push(0.06) // fallback: very dim

    return matchExpr as unknown as number
  }, [highlightedCodes, selectedCountry])

  const borderColor = useMemo(() => {
    if (highlightedCodes.size === 0 && !selectedCountry) {
      return '#C9A227'
    }

    const matchExpr: unknown[] = ['match', ['get', 'ISO_A2']]

    if (selectedCountry) {
      matchExpr.push(selectedCountry, '#C9A227')
    }

    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) {
        matchExpr.push(code, '#C9A227')
      }
    }

    matchExpr.push('#374151') // fallback: dark gray border

    return matchExpr as unknown as string
  }, [highlightedCodes, selectedCountry])

  const borderWidth = useMemo(() => {
    if (highlightedCodes.size === 0 && !selectedCountry) {
      return 0.5
    }

    const matchExpr: unknown[] = ['match', ['get', 'ISO_A2']]

    if (selectedCountry) {
      matchExpr.push(selectedCountry, 2)
    }

    for (const code of Array.from(highlightedCodes)) {
      if (code !== selectedCountry) {
        matchExpr.push(code, 1.2)
      }
    }

    matchExpr.push(0.3)

    return matchExpr as unknown as number
  }, [highlightedCodes, selectedCountry])

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 20, latitude: 10, zoom: 2 }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      onClick={handleClick}
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
  )
}
