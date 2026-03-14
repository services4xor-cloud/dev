'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface EdgeDisplay {
  id: string
  relation: string
  to: { type: string; code: string; label: string; icon?: string }
}

export default function MePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [edges, setEdges] = useState<EdgeDisplay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status !== 'authenticated') return

    fetch('/api/identity')
      .then((r) => r.json())
      .then((data) => {
        setEdges(data.edges ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [status, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Loading identity...</p>
      </div>
    )
  }

  const grouped = edges.reduce(
    (acc, edge) => {
      const key = edge.relation
      if (!acc[key]) acc[key] = []
      acc[key].push(edge)
      return acc
    },
    {} as Record<string, EdgeDisplay[]>
  )

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-accent">
          {session?.user?.name ?? 'Explorer'}
        </h1>
        <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
          ← Map
        </a>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center">
          <p className="text-brand-text-muted">No dimensions yet.</p>
          <a
            href="/onboarding"
            className="mt-4 inline-block rounded-lg bg-brand-primary px-6 py-3 font-medium text-brand-accent"
          >
            Tell us who you are
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([relation, edges]) => (
            <div key={relation}>
              <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
                {relation.replace(/_/g, ' ')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {edges.map((edge) => (
                  <span
                    key={edge.id}
                    className="rounded-full border border-brand-accent/20 bg-brand-surface px-3 py-1.5 text-sm text-brand-text"
                  >
                    {edge.to.icon && <span className="mr-1">{edge.to.icon}</span>}
                    {edge.to.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
