'use client'

import { useCallback, useRef } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { MapCountry } from '@/types/domain'

interface WorldMapProps {
  countries: MapCountry[]
  onCountryClick: (code: string) => void
}

export default function WorldMap({ countries, onCountryClick }: WorldMapProps) {
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

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 20, latitude: 10, zoom: 2 }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      onClick={handleClick}
      interactiveLayerIds={['country-fill']}
    >
      <Source id="countries" type="geojson" data="/geo/countries.json">
        <Layer
          id="country-fill"
          type="fill"
          paint={{
            'fill-color': '#C9A227',
            'fill-opacity': 0.15,
          }}
        />
        <Layer
          id="country-border"
          type="line"
          paint={{
            'line-color': '#C9A227',
            'line-width': 0.5,
            'line-opacity': 0.3,
          }}
        />
      </Source>
    </Map>
  )
}
