'use client'

/**
 * /world — My World
 *
 * The Pioneer's network graph. YOU at center, connections radiating outward.
 * Shows people, paths, and communities scored by relevance to the Pioneer's identity.
 */

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIdentity } from '@/lib/identity-context'
import { buildGraph, type GraphNode } from '@/lib/graph'
import NetworkGraph from '@/components/NetworkGraph'
import GlassCard from '@/components/ui/GlassCard'

const TYPE_BADGES: Record<GraphNode['type'], { label: string; className: string }> = {
  you: { label: 'You', className: 'bg-brand-accent/20 text-brand-accent' },
  person: { label: 'Pioneer', className: 'bg-brand-accent/20 text-brand-accent' },
  opportunity: { label: 'Path', className: 'bg-brand-primary/40 text-white' },
  community: { label: 'Community', className: 'bg-emerald-900/60 text-emerald-300' },
}

export default function WorldPage() {
  const router = useRouter()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  // Redirect if discovery not completed
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      router.push('/')
    }
  }, [hasCompletedDiscovery, router])

  const { nodes, edges } = useMemo(() => buildGraph(identity), [identity])

  function handleNodeClick(node: GraphNode) {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node))
  }

  function handleAction(node: GraphNode) {
    switch (node.type) {
      case 'person':
        // Future: navigate to Pioneer profile
        break
      case 'opportunity':
        // Navigate to ventures
        router.push('/ventures')
        break
      case 'community':
        // Navigate to threads
        router.push('/threads')
        break
    }
  }

  if (!hasCompletedDiscovery) {
    return null
  }

  return (
    <main className="min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-phi-7 font-bold gradient-text mb-2">My World</h1>
          <p className="text-white/50 text-phi-4 max-w-lg mx-auto">
            Your network of people, paths, and communities — scored by relevance to your identity.
          </p>
        </div>

        {/* Main layout: graph + side panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Graph */}
          <div className="flex-1 w-full">
            <GlassCard variant="subtle" padding="md">
              <NetworkGraph
                nodes={nodes}
                edges={edges}
                onNodeClick={handleNodeClick}
              />
            </GlassCard>
          </div>

          {/* Side panel — node detail */}
          <div className="w-full lg:w-80 shrink-0">
            {selectedNode ? (
              <GlassCard variant="featured" padding="md" className="sticky top-24">
                {/* Type badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${TYPE_BADGES[selectedNode.type].className}`}
                >
                  {TYPE_BADGES[selectedNode.type].label}
                </span>

                {/* Name */}
                <h2 className="text-phi-5 font-semibold text-white mb-1">
                  {selectedNode.label}
                </h2>

                {/* Sublabel */}
                <p className="text-white/50 text-phi-3 mb-4">
                  {selectedNode.sublabel}
                </p>

                {/* Match score */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedNode.score}%`,
                        background:
                          selectedNode.score >= 80
                            ? '#C9A227'
                            : selectedNode.score >= 50
                              ? '#d4af37'
                              : 'rgba(255,255,255,0.3)',
                      }}
                    />
                  </div>
                  <span className="text-brand-accent font-semibold text-sm">
                    {selectedNode.score}%
                  </span>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleAction(selectedNode)}
                  className="w-full btn-primary py-2.5 rounded-lg text-sm font-medium"
                >
                  {selectedNode.type === 'person'
                    ? 'View Profile'
                    : selectedNode.type === 'opportunity'
                      ? 'View Path'
                      : 'View Community'}
                </button>
              </GlassCard>
            ) : (
              <GlassCard variant="subtle" padding="md">
                <div className="text-center py-8">
                  <p className="text-white/30 text-phi-4 mb-2">Select a node</p>
                  <p className="text-white/20 text-phi-3">
                    Click on any node in the graph to see details and take action.
                  </p>
                </div>
              </GlassCard>
            )}

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'People', count: nodes.filter((n) => n.type === 'person').length, color: 'text-brand-accent' },
                { label: 'Paths', count: nodes.filter((n) => n.type === 'opportunity').length, color: 'text-brand-primary-light' },
                { label: 'Communities', count: nodes.filter((n) => n.type === 'community').length, color: 'text-emerald-400' },
              ].map(({ label, count, color }) => (
                <GlassCard key={label} variant="subtle" padding="sm" className="text-center">
                  <p className={`text-phi-5 font-bold ${color}`}>{count}</p>
                  <p className="text-white/40 text-xs">{label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
