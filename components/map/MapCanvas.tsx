'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Map,
  Source,
  Layer,
  NavigationControl,
  type MapRef,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import type { StyleSpecification } from 'maplibre-gl'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { greatCircleArc } from '@/lib/geo'
import { PIN_COLORS } from '@/lib/pin-colors'

export type MapProjectionMode = 'mercator' | 'globe'

/** An offering drawn as a pin */
export interface MapPin {
  id: string
  label: string
  lat: number
  lng: number
  kind: string
  selected?: boolean
}

const VIEWPORT_KEY = 'bex-map-viewport'
const GOLD = '#d9a93f'
const ACCENT = '#7fb8a6'
const CAPITAL = new globalThis.Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))

/** Fallback base when no MapTiler key is set: plain background, our own country shapes on top. */
const PLAIN_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#0b100e' } }],
}

interface MapCanvasProps {
  pins: MapPin[]
  selectedCountry: string | null
  /** Countries to highlight (e.g. same language), weight 0..1 */
  highlight: Record<string, number>
  /** Countries that have offerings: a faint tint so the map shows where things are */
  activeCountries: Set<string>
  onCountryClick: (code: string, name: string) => void
  onPinClick: (id: string) => void
  onBackgroundClick?: () => void
  projection: MapProjectionMode
  /** Change the key to fly somewhere */
  flyTo?: { lng: number; lat: number; zoom?: number; key: number } | null
}

function savedViewport() {
  try {
    const raw = sessionStorage.getItem(VIEWPORT_KEY)
    return raw ? (JSON.parse(raw) as { longitude: number; latitude: number; zoom: number }) : null
  } catch {
    return null
  }
}

export default function MapCanvas({
  pins,
  selectedCountry,
  highlight,
  activeCountries,
  onCountryClick,
  onPinClick,
  onBackgroundClick,
  projection,
  flyTo,
}: MapCanvasProps) {
  const mapRef = useRef<MapRef>(null)
  const [initialView] = useState(
    () =>
      (typeof window !== 'undefined' && savedViewport()) || {
        longitude: 15,
        latitude: 20,
        zoom: 1.6,
      }
  )
  const [hover, setHover] = useState<{ label: string; x: number; y: number } | null>(null)
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY
  const mapStyle = key
    ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`
    : PLAIN_STYLE

  useEffect(() => {
    if (!flyTo) return
    mapRef.current?.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: Math.max(mapRef.current.getZoom(), flyTo.zoom ?? 3),
      duration: 1200,
      essential: true,
    })
  }, [flyTo])

  const saveViewport = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const c = map.getCenter()
    try {
      sessionStorage.setItem(
        VIEWPORT_KEY,
        JSON.stringify({ longitude: c.lng, latitude: c.lat, zoom: map.getZoom() })
      )
    } catch {
      // storage unavailable
    }
  }, [])

  // ── Pins: nearby listings at one spot fan out a little so each stays clickable ──
  const pinData = useMemo(() => {
    const seen: Record<string, number> = {}
    return {
      type: 'FeatureCollection' as const,
      features: pins.map((p) => {
        const spot = `${p.lat.toFixed(2)},${p.lng.toFixed(2)}`
        const n = (seen[spot] = (seen[spot] ?? -1) + 1)
        const angle = n * 2.4
        const r = n === 0 ? 0 : 0.5 + 0.25 * Math.sqrt(n)
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [p.lng + r * Math.cos(angle), p.lat + r * Math.sin(angle)],
          },
          properties: {
            id: p.id,
            label: p.label,
            color: PIN_COLORS[p.kind] ?? ACCENT,
            selected: p.selected ? 1 : 0,
          },
        }
      }),
    }
  }, [pins])

  // ── Connection arcs: selected country → highlighted countries ──
  const arcs = useMemo(() => {
    const from = selectedCountry ? CAPITAL.get(selectedCountry) : null
    if (!from) return null
    const targets = Object.entries(highlight)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
    return {
      type: 'FeatureCollection' as const,
      features: targets.flatMap(([code, w]) => {
        const to = CAPITAL.get(code)
        if (!to) return []
        return [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: greatCircleArc(from.lat, from.lng, to.lat, to.lng),
            },
            properties: { w },
          },
        ]
      }),
    }
  }, [selectedCountry, highlight])

  // ── Country styling: selected (gold) > highlighted (teal by weight) > has offerings ──
  const { fillColor, fillOpacity, lineColor, lineWidth } = useMemo(() => {
    const color: unknown[] = ['match', ['get', 'ISO_A2']]
    const opacity: unknown[] = ['match', ['get', 'ISO_A2']]
    const line: unknown[] = ['match', ['get', 'ISO_A2']]
    const width: unknown[] = ['match', ['get', 'ISO_A2']]
    const done = new Set<string>()
    if (selectedCountry) {
      color.push(selectedCountry, GOLD)
      opacity.push(selectedCountry, 0.42)
      line.push(selectedCountry, GOLD)
      width.push(selectedCountry, 1.6)
      done.add(selectedCountry)
    }
    for (const [code, w] of Object.entries(highlight)) {
      if (done.has(code)) continue
      color.push(code, ACCENT)
      opacity.push(code, 0.14 + 0.36 * w)
      line.push(code, ACCENT)
      width.push(code, 0.9)
      done.add(code)
    }
    for (const code of Array.from(activeCountries)) {
      if (done.has(code)) continue
      color.push(code, ACCENT)
      opacity.push(code, 0.1)
      line.push(code, '#4f7a6d')
      width.push(code, 0.6)
      done.add(code)
    }
    const empty = done.size === 0
    color.push('#93a09a')
    opacity.push(0.035)
    line.push('#3a4641')
    width.push(0.4)
    return {
      fillColor: (empty ? '#93a09a' : color) as unknown as string,
      fillOpacity: (empty ? 0.035 : opacity) as unknown as number,
      lineColor: (empty ? '#3a4641' : line) as unknown as string,
      lineWidth: (empty ? 0.4 : width) as unknown as number,
    }
  }, [selectedCountry, highlight, activeCountries])

  const handleMove = useCallback((e: MapLayerMouseEvent) => {
    const f = e.features?.[0]
    if (!f) return setHover(null)
    const label =
      f.layer?.id === 'pin' ? (f.properties?.label as string) : (f.properties?.name as string)
    setHover(label ? { label, x: e.point.x, y: e.point.y } : null)
  }, [])

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const pin = e.features?.find((f) => f.layer?.id === 'pin')
      if (pin) return onPinClick(pin.properties?.id as string)
      const country = e.features?.find((f) => f.layer?.id === 'country-fill')
      const code = country?.properties?.ISO_A2 as string | undefined
      if (code && code !== '-99') onCountryClick(code, country?.properties?.name as string)
      else onBackgroundClick?.()
    },
    [onCountryClick, onPinClick, onBackgroundClick]
  )

  return (
    <div className="absolute inset-0">
      <Map
        key={projection}
        ref={mapRef}
        initialViewState={initialView}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        projection={projection}
        renderWorldCopies={false}
        doubleClickZoom={false}
        dragRotate={false}
        minZoom={1}
        maxZoom={7}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        onMoveEnd={saveViewport}
        interactiveLayerIds={pins.length ? ['pin', 'country-fill'] : ['country-fill']}
        cursor="pointer"
        attributionControl={{ compact: true }}
      >
        <Source id="countries" type="geojson" data="/geo/countries.json">
          <Layer
            id="country-fill"
            type="fill"
            paint={{ 'fill-color': fillColor, 'fill-opacity': fillOpacity }}
          />
          <Layer
            id="country-line"
            type="line"
            paint={{ 'line-color': lineColor, 'line-width': lineWidth, 'line-opacity': 0.9 }}
          />
        </Source>

        {arcs && (
          <Source id="arcs" type="geojson" data={arcs}>
            <Layer
              id="arc"
              type="line"
              layout={{ 'line-cap': 'round' }}
              paint={{
                'line-color': ACCENT,
                'line-width': ['+', 0.6, ['*', 1.4, ['get', 'w']]],
                'line-opacity': ['+', 0.25, ['*', 0.45, ['get', 'w']]],
                'line-dasharray': [2, 2],
              }}
            />
          </Source>
        )}

        {pins.length > 0 && (
          <Source id="pins" type="geojson" data={pinData}>
            <Layer
              id="pin-halo"
              type="circle"
              paint={{
                'circle-radius': ['case', ['==', ['get', 'selected'], 1], 15, 10],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.22,
                'circle-blur': 0.6,
              }}
            />
            <Layer
              id="pin"
              type="circle"
              paint={{
                'circle-radius': ['case', ['==', ['get', 'selected'], 1], 8, 6],
                'circle-color': ['get', 'color'],
                'circle-stroke-width': ['case', ['==', ['get', 'selected'], 1], 3, 1.5],
                'circle-stroke-color': [
                  'case',
                  ['==', ['get', 'selected'], 1],
                  '#f3f5f2',
                  '#0f1513',
                ],
              }}
            />
          </Source>
        )}

        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 max-w-[16rem] truncate rounded-md border border-brand-line bg-brand-surface/95 px-2.5 py-1 text-sm text-brand-text shadow-lg"
          style={{ left: hover.x + 14, top: hover.y - 14 }}
        >
          {hover.label}
        </div>
      )}
    </div>
  )
}
