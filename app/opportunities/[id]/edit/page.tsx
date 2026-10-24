'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import OpportunityForm, { formFromOpportunity } from '@/components/OpportunityForm'
import type { OpportunityDTO } from '@/lib/opportunities'

type Loaded = OpportunityDTO & { canEdit: boolean }

export default function EditOpportunityPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const [opp, setOpp] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/opportunities/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Not found')
        const data = (await r.json()) as Loaded
        if (!data.canEdit) throw new Error('You can only edit your own listings.')
        setOpp(data)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load'))
  }, [params.id, status])

  async function patch(body: Record<string, unknown>): Promise<string | null> {
    const res = await fetch(`/api/opportunities/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json()) as OpportunityDTO & { error?: string }
    if (!res.ok) return data.error ?? 'Could not save'
    setOpp((prev) => (prev ? { ...data, canEdit: true } : prev))
    setSaved(
      data.properties.status === 'PUBLISHED'
        ? 'Saved. It is live on the map.'
        : data.properties.status === 'ARCHIVED'
          ? 'Archived. It no longer shows on the map.'
          : 'Saved. It is waiting for an admin to approve it.'
    )
    return null
  }

  if (status === 'unauthenticated') {
    return (
      <PageShell title="Edit listing">
        <a href="/login?callbackUrl=/opportunities%23yours" className="btn btn-primary">
          Sign in to edit
        </a>
      </PageShell>
    )
  }

  return (
    <PageShell eyebrow="Your listings" title={opp ? `Edit: ${opp.label}` : 'Edit listing'}>
      <div className="space-y-4">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && (
          <div className="rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-text">
            {saved}
          </div>
        )}
        {opp && (
          <>
            <OpportunityForm
              key={opp.id}
              initial={formFromOpportunity(opp)}
              submitLabel="Save"
              note={
                isAdmin
                  ? undefined
                  : 'Changes to a live listing are checked by an admin before they show again.'
              }
              onSubmit={patch}
            />
            <div className="flex flex-wrap gap-3">
              {isAdmin && opp.properties.status !== 'PUBLISHED' && (
                <button
                  onClick={() => void patch({ status: 'PUBLISHED' })}
                  className="btn btn-primary"
                >
                  Publish on the map
                </button>
              )}
              {opp.properties.status !== 'ARCHIVED' && (
                <button
                  onClick={() => void patch({ status: 'ARCHIVED' })}
                  className="btn hover:text-red-300"
                >
                  Archive (take off the map)
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PageShell>
  )
}
