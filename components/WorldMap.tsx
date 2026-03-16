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

/** Country score: ranked dimensions for fill + currency for borders */
interface ScoredCountry {
  code: string
  score: number
  matchCount: number
  dimensions: string[]
  /** Ranked fill: [0]=fill, [1]=outer ring, [2]=mid ring (language/sector/faith only) */
  ranked: DimSlot[]
  depth: number // fill dimension count 1-3 → intensity
  /** Currency value for border coloring — always priority 1 for borders */
  currencyValue?: string
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
 * Convert scored country to HSL fill color.
 * Hue = dimension family ± value offset. Sat+Light = depth (exponential).
 */
function scoredToColor(dominantDim: string, dominantValue: string, depth: number): string {
  if (!dominantDim) return '#6B5B3E' // neighbor proximity

  const baseHue = DIMENSION_HUE[dominantDim] ?? 178
  const valueOffset = (strHash(dominantValue) % 17) - 8
  const hue = (baseHue + valueOffset + 360) % 360

  // Exponential vibrancy: each depth level is dramatically more vivid
  const sat = 40 + depth * 15 // 55% → 100%
  const light = 28 + depth * 10 // 38% → 68%

  return `hsl(${hue},${sat}%,${light}%)`
}

/**
 * Contour line color — lighter version of fill for topographic effect.
 * Same hue family but higher lightness, like elevation rings on a topo map.
 */
function scoredToContourColor(dominantDim: string, dominantValue: string): string {
  if (!dominantDim) return 'transparent'

  const baseHue = DIMENSION_HUE[dominantDim] ?? 178
  const valueOffset = (strHash(dominantValue) % 17) - 8
  const hue = (baseHue + valueOffset + 360) % 360

  return `hsl(${hue},65%,72%)`
}

/** Depth shape SVG paths — used in tooltip and legend */
export const DEPTH_SHAPES: { path: string; viewBox: string; label: string }[] = [
  { path: '', viewBox: '0 0 1 1', label: '' }, // depth 0 — unused
  { path: '', viewBox: '0 0 1 1', label: '' }, // depth 1 — fill only, no shape
  { path: 'M2 7h12', viewBox: '0 0 16 14', label: '×2' }, // line
  { path: 'M8 2L14 12H2Z', viewBox: '0 0 16 14', label: '×3' }, // triangle
  { path: 'M2 2h12v10H2z', viewBox: '0 0 16 14', label: '×4' }, // rectangle
  {
    path: 'M8 0l2.5 5.1 5.5.8-4 3.9.9 5.5L8 12.8l-4.9 2.5.9-5.5-4-3.9 5.5-.8z',
    viewBox: '0 0 16 15.3',
    label: '×5',
  }, // star
]

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
    code: string
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

  // Tooltip: show on hover (desktop), briefly flash on tap (mobile), then auto-clear
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const features = e.features
    if (features?.[0]?.properties?.name) {
      setHoveredCountry({
        name: features[0].properties.name,
        code: (features[0].properties.ISO_A2 as string) ?? '',
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
      // On touch/mobile: clear tooltip after brief flash
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
      tooltipTimer.current = setTimeout(() => setHoveredCountry(null), 800)
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

    // Scored: EXPONENTIAL opacity — each depth level ~2× visual weight of previous
    // depth 1 = 0.12, depth 2 = 0.30, depth 3 = 0.55, depth 4 = 0.80
    const DEPTH_OPACITY = [0, 0.12, 0.3, 0.55, 0.8]
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        if (sc.depth > 0) {
          expr.push(code, DEPTH_OPACITY[Math.min(sc.depth, 4)])
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

  // ─── Outer border: CURRENCY color (priority 1) ─────────────────────────────
  // Currency always renders as border color. Width scales if currency is shared.
  const borderStyle = useMemo(() => {
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0 || previewCodes.size > 0

    if (!hasActive) {
      return {
        color: '#C9A227' as unknown as string,
        width: 0.3 as unknown as number,
        opacity: 0.4,
      }
    }

    const colorExpr: unknown[] = ['match', ['get', 'ISO_A2']]
    const widthExpr: unknown[] = ['match', ['get', 'ISO_A2']]

    // Enriched: gold border (selected countries always gold)
    for (const code of enrichedCountries) {
      colorExpr.push(code, ENRICHED_COLOR)
      widthExpr.push(code, ENRICHED_BORDER_WIDTH)
    }

    // Scored: currency → border color (rose hue 345), width scales with total depth
    const DEPTH_BORDER_WIDTH = [0.3, 1.0, 1.8, 2.8, 4.0]
    for (const [code, sc] of Array.from(scoreMap)) {
      if (!enrichedSet.has(code)) {
        if (sc.currencyValue) {
          // Currency dimension → rose/magenta border
          colorExpr.push(code, scoredToColor('currency', sc.currencyValue, Math.max(sc.depth, 1)))
          widthExpr.push(code, DEPTH_BORDER_WIDTH[Math.min(sc.depth + 1, 4)])
        } else {
          // No currency match → subtle fill-colored border
          colorExpr.push(code, scoredToColor(sc.ranked[0].dim, sc.ranked[0].value, sc.depth))
          widthExpr.push(code, DEPTH_BORDER_WIDTH[Math.min(sc.depth, 4)])
        }
      }
    }

    // Preview
    for (const code of Array.from(previewCodes)) {
      if (!enrichedSet.has(code) && !scoreMap.has(code)) {
        colorExpr.push(code, '#5B8A84')
        widthExpr.push(code, 0.6)
      }
    }

    colorExpr.push('#1f2937')
    widthExpr.push(0.2)

    return {
      color: colorExpr as unknown as string,
      width: widthExpr as unknown as number,
      opacity: 0.85,
    }
  }, [scoreMap, previewCodes, enrichedCountries, enrichedSet])

  // ─── Topographic contour lines: inset borders showing depth ────────────────
  // Depth 2 = 1 contour, Depth 3 = 2 contours, Depth 4 = 3 contours
  // Uses line-offset (negative = inward) to create elevation-ring effect
  const contourStyles = useMemo(() => {
    const CONTOUR_OFFSETS = [-3, -6, -9] // px inward from polygon boundary
    const hasActive = scoreMap.size > 0 || enrichedSet.size > 0

    return CONTOUR_OFFSETS.map((offset, contourIdx) => {
      if (!hasActive) {
        return {
          color: 'transparent' as unknown as string,
          width: 0 as unknown as number,
          offset,
          opacity: 0,
        }
      }

      const colorExpr: unknown[] = ['match', ['get', 'ISO_A2']]
      const widthExpr: unknown[] = ['match', ['get', 'ISO_A2']]

      // Enriched: gold contours (subtle)
      for (const code of enrichedCountries) {
        colorExpr.push(code, '#FFD700')
        widthExpr.push(code, 0.8)
      }

      // Scored: contour visible only if depth > contourIdx + 1
      // depth 2 → contour 0 only | depth 3 → contours 0,1 | depth 4 → all 3
      for (const [code, sc] of Array.from(scoreMap)) {
        if (!enrichedSet.has(code)) {
          if (sc.depth > contourIdx + 1) {
            colorExpr.push(code, scoredToContourColor(sc.ranked[0].dim, sc.ranked[0].value))
            widthExpr.push(code, 1.0)
          } else {
            colorExpr.push(code, 'transparent')
            widthExpr.push(code, 0)
          }
        }
      }

      colorExpr.push('transparent')
      widthExpr.push(0)

      return {
        color: colorExpr as unknown as string,
        width: widthExpr as unknown as number,
        offset,
        opacity: 0.5,
      }
    })
  }, [scoreMap, enrichedCountries, enrichedSet])

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
          {/* Outer border — width scales with depth */}
          <Layer
            id="country-border"
            type="line"
            paint={{
              'line-color': borderStyle.color,
              'line-width': borderStyle.width,
              'line-opacity': borderStyle.opacity,
            }}
          />
          {/* Topographic contour lines — inset borders showing depth */}
          {contourStyles.map((contour, i) => (
            <Layer
              key={`contour-${i}`}
              id={`country-contour-${i}`}
              type="line"
              paint={{
                'line-color': contour.color,
                'line-width': contour.width,
                'line-opacity': contour.opacity,
                'line-offset': contour.offset,
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

      {/* Hover tooltip — shows country name + depth shape when scored */}
      {hoveredCountry &&
        (() => {
          const sc = scoreMap.get(hoveredCountry.code)
          const depth = sc?.depth ?? 0
          const shape = depth >= 2 ? DEPTH_SHAPES[Math.min(depth, 5)] : null
          return (
            <div
              className="pointer-events-none absolute z-30 flex items-center gap-2 rounded-lg bg-brand-surface/95 px-3 py-1.5 text-sm text-brand-accent shadow-lg backdrop-blur"
              style={{ left: hoveredCountry.x + 12, top: hoveredCountry.y - 20 }}
            >
              {hoveredCountry.name}
              {shape && (
                <span className="flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-accent/80">
                  <svg
                    width="12"
                    height="12"
                    viewBox={shape.viewBox}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  >
                    <path d={shape.path} />
                  </svg>
                  {shape.label}
                </span>
              )}
            </div>
          )
        })()}

      {/* Depth legend — floating mini-key showing shape meanings */}
      {scoreMap.size > 0 && (
        <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-1 rounded-lg border border-white/10 bg-brand-surface/90 px-2.5 py-2 text-[10px] text-white/60 backdrop-blur">
          <span className="mb-0.5 font-semibold text-white/40 uppercase tracking-wider">Depth</span>
          {[2, 3, 4, 5].map((d) => {
            const s = DEPTH_SHAPES[d]
            return (
              <div key={d} className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="10"
                  viewBox={s.viewBox}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                >
                  <path d={s.path} />
                </svg>
                <span>{s.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
