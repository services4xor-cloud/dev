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

interface DimSlot {
  dim: string
  value: string
}

/** Country score: ranked dimensions for fill + concentric border rings */
interface ScoredCountry {
  code: string
  score: number
  matchCount: number
  dimensions: string[]
  /** Ranked: [0]=fill, [1]=outer ring, [2]=mid ring, [3]=inner ring */
  ranked: DimSlot[]
  depth: number // unique dimension count 1-4 → intensity
}

interface WorldMapProps {
  scoredCountries?: ScoredCountry[]
  onCountryClick: (code: string | null, name?: string) => void
  previewCountryCodes?: string[]
  enrichedCountries?: string[]
}

// ─── HSL-based dimension color system ─────────────────────────────────────────
// Each dimension has a base hue ~90° apart for maximum distinction.
// Depth (1-4 matching dimensions) controls saturation + lightness.
// Result: English=teal-A, German=teal-B (same family, distinguishable).
const DIMENSION_HUE: Record<string, number> = {
  language: 185, // teal/cyan
  sector: 90, // lime/chartreuse
  faith: 275, // purple/violet
  currency: 345, // rose/magenta
}

/** Simple string hash for consistent value→shade mapping */
function strHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) & 0xffff
  return h
}

/**
 * Convert scored country to HSL color.
 * Hue = dimension family ± value offset. Sat+Light = depth.
 * Each specific value (English, German, Christianity, Islam) gets a unique,
 * consistent shade within its dimension's color family.
 */
function scoredToColor(dominantDim: string, dominantValue: string, depth: number): string {
  if (!dominantDim) return '#6B5B3E' // neighbor proximity

  const baseHue = DIMENSION_HUE[dominantDim] ?? 178
  // Specific value shifts hue ±8° for distinguishable shades within the family
  const valueOffset = (strHash(dominantValue) % 17) - 8
  const hue = (baseHue + valueOffset + 360) % 360

  // Depth 1→4 determines vibrancy: subtle → vivid (shiny rarity curve)
  // Rank 1: muted, Rank 2: noticeable, Rank 3: bright, Rank 4: blazing
  const sat = depth <= 2 ? 38 + depth * 15 : 60 + depth * 10 // 53→68 → 90→100
  const light = depth <= 2 ? 26 + depth * 9 : 32 + depth * 10 // 35→44 → 62→72

  return `hsl(${hue},${Math.min(sat, 100)}%,${Math.min(light, 72)}%)`
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

    // 2. Scored — HSL dimension-family colors (hue=dimension, shade=value, intensity=depth)
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        expr.push(code, scoredToColor(sc.ranked[0].dim, sc.ranked[0].value, sc.depth))
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

    // Scored: opacity tied to depth — shiny rarity curve
    // depth 1 = 0.22, depth 2 = 0.34, depth 3 = 0.52, depth 4 = 0.68
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        if (sc.depth > 0) {
          const dimOpacity = sc.depth <= 2 ? 0.1 + sc.depth * 0.12 : 0.2 + sc.depth * 0.12
          expr.push(code, Math.min(dimOpacity, 0.68))
        } else {
          // Neighbor proximity only — subtle
          expr.push(code, 0.05 + sc.score * 0.1)
        }
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

  // ─── Concentric border rings: each ranked dimension gets its own ring ────────
  // Ring 0 (outermost, widest) = ranked[1] (2nd dimension)
  // Ring 1 (middle)            = ranked[2] (3rd dimension)
  // Ring 2 (inner, thinnest)   = ranked[3] (4th dimension)
  // ranked[0] is the fill color. Countries with only 1 dim: all rings = same as fill.
  const ringStyles = useMemo(() => {
    const RING_WIDTHS = [4.0, 2.5, 1.2] // outer → inner
    const RING_SLOTS = [1, 2, 3] // which ranked[] index each ring uses
    const RING_OPACITIES = [0.75, 0.85, 0.95] // inner rings slightly more opaque
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0

    return RING_SLOTS.map((slotIdx, ringIdx) => {
      if (!hasActive) {
        return {
          color: '#C9A227' as unknown as string,
          width: (ringIdx === 0 ? 0.3 : 0) as unknown as number,
          opacity: 0.4,
        }
      }

      const colorExpr: unknown[] = ['match', ['get', 'ISO_A2']]
      const widthExpr: unknown[] = ['match', ['get', 'ISO_A2']]

      // Enriched: gold rings
      for (const code of enrichedCountries) {
        colorExpr.push(code, ENRICHED_COLOR)
        widthExpr.push(code, ENRICHED_BORDER_WIDTH)
      }

      // Scored: ring color from ranked[slotIdx], visible only if country has enough dims
      for (const [code, sc] of Array.from(scoreMap)) {
        if (!enrichedSet.has(code)) {
          const slot = sc.ranked[slotIdx]
          if (sc.depth > slotIdx) {
            // This country has enough dimensions for this ring
            colorExpr.push(code, scoredToColor(slot.dim, slot.value, sc.depth))
            widthExpr.push(code, RING_WIDTHS[ringIdx])
          } else {
            // Not enough dims — collapse to transparent (width 0)
            colorExpr.push(code, 'transparent')
            widthExpr.push(code, 0)
          }
        }
      }

      // Preview
      for (const code of Array.from(previewCodes)) {
        if (!enrichedSet.has(code) && !scoreMap.has(code)) {
          colorExpr.push(code, ringIdx === 0 ? '#5B8A84' : 'transparent')
          widthExpr.push(code, ringIdx === 0 ? 0.6 : 0)
        }
      }

      colorExpr.push(ringIdx === 0 ? '#1f2937' : 'transparent')
      widthExpr.push(ringIdx === 0 ? 0.2 : 0)

      return {
        color: colorExpr as unknown as string,
        width: widthExpr as unknown as number,
        opacity: RING_OPACITIES[ringIdx],
      }
    })
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet])

  return (
    <div className="relative" style={{ width: '100%', height: '100vh' }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        renderWorldCopies={false}
        doubleClickZoom={false}
        minZoom={1.5}
        maxZoom={6}
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
          {/* Concentric border rings — outer=2nd dim, mid=3rd dim, inner=4th dim */}
          {ringStyles.map((ring, i) => (
            <Layer
              key={`ring-${i}`}
              id={`country-border-ring-${i}`}
              type="line"
              paint={{
                'line-color': ring.color,
                'line-width': ring.width,
                'line-opacity': ring.opacity,
              }}
            />
          ))}
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
