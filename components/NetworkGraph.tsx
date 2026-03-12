'use client'

/**
 * NetworkGraph — SVG network visualization
 *
 * Renders the Pioneer's world as a concentric ring graph.
 * YOU at center, connections radiating outward by match score.
 */

import { useState, useMemo } from 'react'
import type { GraphNode, GraphEdge } from '@/lib/graph'

// ─── Constants ──────────────────────────────────────────────────────

const VIEW_SIZE = 700
const CENTER = VIEW_SIZE / 2
const RING_RADII = [0, 120, 220, 320] as const
const NODE_RADIUS = { you: 24, person: 14, opportunity: 14, community: 14 } as const

const NODE_COLORS: Record<GraphNode['type'], string> = {
  you: '#C9A227',      // accent gold
  person: '#C9A227',   // gold
  opportunity: '#5C0A14', // maroon
  community: '#006600',   // success green
}

const NODE_STROKE: Record<GraphNode['type'], string> = {
  you: '#d4af37',
  person: '#d4af37',
  opportunity: '#7a1020',
  community: '#008800',
}

type FilterType = 'all' | 'person' | 'opportunity' | 'community'

// ─── Edge dash patterns by type ─────────────────────────────────────

function edgeDash(type: GraphEdge['type']): string {
  switch (type) {
    case 'language': return '6,4'      // dashed
    case 'skill': return ''            // solid
    case 'location': return '2,4'      // dotted
  }
}

// ─── Component ──────────────────────────────────────────────────────

interface NetworkGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick: (node: GraphNode) => void
}

export default function NetworkGraph({ nodes, edges, onNodeClick }: NetworkGraphProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Position nodes around their ring
  const positioned = useMemo(() => {
    const ringGroups: Record<number, GraphNode[]> = { 0: [], 1: [], 2: [], 3: [] }
    for (const node of nodes) {
      const ring = node.ring as 0 | 1 | 2 | 3
      if (ringGroups[ring]) {
        ringGroups[ring].push(node)
      }
    }

    const result: Map<string, { x: number; y: number; node: GraphNode }> = new Map()

    for (const [ringStr, group] of Object.entries(ringGroups)) {
      const ring = Number(ringStr)
      const radius = RING_RADII[ring] ?? 0

      if (ring === 0) {
        for (const node of group) {
          result.set(node.id, { x: CENTER, y: CENTER, node })
        }
        continue
      }

      const count = group.length
      if (count === 0) continue

      // Offset each ring slightly for visual variety
      const angleOffset = ring * 0.4

      for (let i = 0; i < count; i++) {
        const angle = angleOffset + (2 * Math.PI * i) / count - Math.PI / 2
        const x = CENTER + radius * Math.cos(angle)
        const y = CENTER + radius * Math.sin(angle)
        result.set(group[i].id, { x, y, node: group[i] })
      }
    }

    return result
  }, [nodes])

  // Filtered nodes
  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>()
    for (const [id, { node }] of Array.from(positioned.entries())) {
      if (node.type === 'you') {
        ids.add(id)
        continue
      }
      if (filter === 'all' || filter === node.type) {
        ids.add(id)
      }
    }
    return ids
  }, [positioned, filter])

  function handleNodeClick(node: GraphNode) {
    if (node.type === 'you') return
    setSelectedNode(node.id === selectedNode ? null : node.id)
    onNodeClick(node)
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'person', label: 'People' },
    { key: 'opportunity', label: 'Paths' },
    { key: 'community', label: 'Communities' },
  ]

  return (
    <div className="w-full">
      {/* Filter bar */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40'
                : 'glass-subtle text-white/50 hover:text-white/80 border border-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SVG canvas */}
      <svg
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        className="w-full max-w-[700px] mx-auto"
        style={{ aspectRatio: '1 / 1' }}
      >
        {/* Ring guides */}
        {[1, 2, 3].map((ring) => (
          <circle
            key={`ring-${ring}`}
            cx={CENTER}
            cy={CENTER}
            r={RING_RADII[ring]}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
            strokeDasharray="4,8"
          />
        ))}

        {/* Edges */}
        {edges.map((edge) => {
          const fromPos = positioned.get(edge.from)
          const toPos = positioned.get(edge.to)
          if (!fromPos || !toPos) return null
          if (!visibleNodeIds.has(edge.to)) return null

          const isHighlighted = selectedNode === edge.to || hoveredNode === edge.to

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={isHighlighted ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={isHighlighted ? 1.5 : 0.8}
              strokeDasharray={edgeDash(edge.type)}
              className="transition-all duration-300"
            />
          )
        })}

        {/* Center glow */}
        <defs>
          <radialGradient id="youGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Nodes */}
        {Array.from(positioned.values()).map(({ x, y, node }) => {
          if (!visibleNodeIds.has(node.id)) return null

          const r = NODE_RADIUS[node.type]
          const fillColor = NODE_COLORS[node.type]
          const strokeColor = NODE_STROKE[node.type]
          const isHovered = hoveredNode === node.id
          const isSelected = selectedNode === node.id
          const isActive = isHovered || isSelected

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow for YOU node */}
              {node.type === 'you' && (
                <circle cx={x} cy={y} r={48} fill="url(#youGlow)" />
              )}

              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={isActive ? r + 3 : r}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isActive ? 2.5 : 1.5}
                opacity={isActive ? 1 : 0.85}
                filter={node.type === 'you' ? 'url(#glow)' : undefined}
                className="transition-all duration-200"
              />

              {/* Icon text for YOU node */}
              {node.type === 'you' && (
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  YOU
                </text>
              )}

              {/* Label below node (not for YOU) */}
              {node.type !== 'you' && (
                <text
                  x={x}
                  y={y + r + 14}
                  textAnchor="middle"
                  fill={isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'}
                  fontSize="9"
                  fontWeight={isActive ? '500' : '400'}
                  className="transition-all duration-200 select-none pointer-events-none"
                >
                  {node.label.length > 22 ? node.label.slice(0, 20) + '...' : node.label}
                </text>
              )}

              {/* Tooltip on hover */}
              {isHovered && node.type !== 'you' && (
                <g>
                  <rect
                    x={x - 80}
                    y={y - r - 38}
                    width={160}
                    height={28}
                    rx={6}
                    fill="rgba(17,17,24,0.95)"
                    stroke="rgba(201,162,39,0.3)"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={y - r - 20}
                    textAnchor="middle"
                    fill="#C9A227"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {node.label} — {node.score}% match
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" /> People
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5C0A14]" /> Paths
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006600]" /> Communities
        </span>
      </div>
    </div>
  )
}
