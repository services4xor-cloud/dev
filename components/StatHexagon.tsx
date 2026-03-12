'use client'

import React, { useMemo, useCallback } from 'react'

interface StatHexagonProps {
  breakdown: {
    language: number
    craft: number
    passion: number
    location: number
    reach: number
    faith: number
    culture: number
    market: number
  }
  priorities?: Record<string, 'high' | 'medium' | 'low'>
  onPriorityChange?: (dimension: string, priority: 'high' | 'medium' | 'low') => void
  className?: string
}

const DIMENSIONS = [
  { key: 'language', label: 'Language', icon: '\u{1F5E3}', max: 20 },
  { key: 'market', label: 'Market', icon: '\u{1F4CA}', max: 20 },
  { key: 'craft', label: 'Craft', icon: '\u{1F527}', max: 15 },
  { key: 'passion', label: 'Passion', icon: '\u{2764}\u{FE0F}', max: 15 },
  { key: 'location', label: 'Location', icon: '\u{1F4CD}', max: 10 },
  { key: 'faith', label: 'Faith', icon: '\u{1F64F}', max: 8 },
  { key: 'reach', label: 'Reach', icon: '\u{1F310}', max: 7 },
  { key: 'culture', label: 'Culture', icon: '\u{1F33F}', max: 5 },
] as const

const PRIORITY_CYCLE: Record<string, 'high' | 'medium' | 'low'> = {
  low: 'medium',
  medium: 'high',
  high: 'low',
}

const PRIORITY_DOTS: Record<string, string> = {
  high: '\u25CF\u25CF\u25CF',
  medium: '\u25CF\u25CF',
  low: '\u25CF',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#C9A227',
  medium: '#8a7a3a',
  low: '#555555',
}

const CX = 200
const CY = 200
const RADIUS = 130
const AXIS_COUNT = DIMENSIONS.length

function polarToCart(angleDeg: number, r: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}

function getAngle(index: number): number {
  return (360 / AXIS_COUNT) * index
}

function gridPolygonPoints(scale: number): string {
  return DIMENSIONS.map((_, i) => {
    const [x, y] = polarToCart(getAngle(i), RADIUS * scale)
    return `${x},${y}`
  }).join(' ')
}

export default function StatHexagon({
  breakdown,
  priorities = {},
  onPriorityChange,
  className = '',
}: StatHexagonProps) {
  const normalized = useMemo(
    () =>
      DIMENSIONS.map((dim) => {
        const raw = breakdown[dim.key as keyof typeof breakdown] ?? 0
        return Math.min(1, Math.max(0, raw / dim.max))
      }),
    [breakdown]
  )

  const totalScore = useMemo(() => {
    const sum = DIMENSIONS.reduce(
      (acc, dim) => acc + (breakdown[dim.key as keyof typeof breakdown] ?? 0),
      0
    )
    const maxSum = DIMENSIONS.reduce((acc, dim) => acc + dim.max, 0)
    return Math.round((sum / maxSum) * 100)
  }, [breakdown])

  const dataPoints: string = useMemo(
    () =>
      normalized
        .map((val, i) => {
          const r = Math.max(val, 0.02) * RADIUS
          const [x, y] = polarToCart(getAngle(i), r)
          return `${x},${y}`
        })
        .join(' '),
    [normalized]
  )

  const handlePriorityClick = useCallback(
    (dimKey: string) => {
      if (!onPriorityChange) return
      const current = priorities[dimKey] ?? 'medium'
      onPriorityChange(dimKey, PRIORITY_CYCLE[current])
    },
    [priorities, onPriorityChange]
  )

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={{ width: '100%', height: '100%', maxWidth: 480 }}
    >
      <defs>
        <filter id="stat-hex-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="stat-hex-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111118" />
          <stop offset="100%" stopColor="#0A0A0F" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <circle cx={CX} cy={CY} r={RADIUS + 40} fill="url(#stat-hex-bg)" />

      {/* Grid rings at 25%, 50%, 75%, 100% */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={gridPolygonPoints(scale)}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={scale === 1 ? 0.15 : 0.07}
          strokeWidth={scale === 1 ? 1.2 : 0.8}
        />
      ))}

      {/* Axis lines */}
      {DIMENSIONS.map((_, i) => {
        const [x, y] = polarToCart(getAngle(i), RADIUS)
        return (
          <line
            key={`axis-${i}`}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="#ffffff"
            strokeOpacity={0.1}
            strokeWidth={0.8}
          />
        )
      })}

      {/* Data polygon — filled area */}
      <polygon
        points={dataPoints}
        fill="#C9A227"
        fillOpacity={0.15}
        stroke="#C9A227"
        strokeWidth={2}
        strokeLinejoin="round"
        filter="url(#stat-hex-glow)"
      />

      {/* Data point dots with priority-based emphasis */}
      {normalized.map((val, i) => {
        const dim = DIMENSIONS[i]
        const priority = priorities[dim.key] ?? 'medium'
        const r = Math.max(val, 0.02) * RADIUS
        const [x, y] = polarToCart(getAngle(i), r)
        const dotRadius = priority === 'high' ? 5 : priority === 'medium' ? 3.5 : 2.5
        const opacity = priority === 'high' ? 1 : priority === 'medium' ? 0.8 : 0.5
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={dotRadius}
            fill="#C9A227"
            fillOpacity={opacity}
            stroke="#C9A227"
            strokeWidth={priority === 'high' ? 2 : 1}
            strokeOpacity={opacity * 0.6}
          />
        )
      })}

      {/* Axis segment emphasis lines for high-priority dimensions */}
      {normalized.map((val, i) => {
        const dim = DIMENSIONS[i]
        const priority = priorities[dim.key] ?? 'medium'
        if (priority !== 'high') return null
        const r = Math.max(val, 0.02) * RADIUS
        const [x, y] = polarToCart(getAngle(i), r)
        return (
          <line
            key={`emphasis-${i}`}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="#C9A227"
            strokeWidth={2.5}
            strokeOpacity={0.4}
          />
        )
      })}

      {/* Labels around the outside */}
      {DIMENSIONS.map((dim, i) => {
        const angle = getAngle(i)
        const labelR = RADIUS + 30
        const [lx, ly] = polarToCart(angle, labelR)
        const priority = priorities[dim.key] ?? 'medium'
        const dots = PRIORITY_DOTS[priority]
        const dotColor = PRIORITY_COLORS[priority]
        const isInteractive = !!onPriorityChange

        // Determine text-anchor based on position
        const normalizedAngle = ((angle % 360) + 360) % 360
        let textAnchor: 'start' | 'middle' | 'end' = 'middle'
        if (normalizedAngle > 30 && normalizedAngle < 150) textAnchor = 'start'
        else if (normalizedAngle > 210 && normalizedAngle < 330) textAnchor = 'end'

        return (
          <g
            key={`label-${dim.key}`}
            onClick={() => handlePriorityClick(dim.key)}
            style={{ cursor: isInteractive ? 'pointer' : 'default' }}
            role={isInteractive ? 'button' : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onKeyDown={(e) => {
              if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                handlePriorityClick(dim.key)
              }
            }}
          >
            {/* Icon */}
            <text x={lx} y={ly - 8} textAnchor={textAnchor} fontSize={14} fill="white">
              {dim.icon}
            </text>
            {/* Dimension name */}
            <text
              x={lx}
              y={ly + 6}
              textAnchor={textAnchor}
              fontSize={10}
              fontFamily="system-ui, sans-serif"
              fill="white"
              fillOpacity={priority === 'high' ? 1 : priority === 'medium' ? 0.7 : 0.45}
              fontWeight={priority === 'high' ? 600 : 400}
            >
              {dim.label}
            </text>
            {/* Priority dots */}
            <text
              x={lx}
              y={ly + 18}
              textAnchor={textAnchor}
              fontSize={7}
              fontFamily="system-ui, sans-serif"
              fill={dotColor}
            >
              {dots}
            </text>
          </g>
        )
      })}

      {/* Center score */}
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fontSize={28}
        fontWeight={700}
        fontFamily="system-ui, sans-serif"
        fill="#C9A227"
      >
        {totalScore}%
      </text>
      <text
        x={CX}
        y={CY + 14}
        textAnchor="middle"
        fontSize={10}
        fontFamily="system-ui, sans-serif"
        fill="white"
        fillOpacity={0.5}
      >
        Match Score
      </text>
    </svg>
  )
}
