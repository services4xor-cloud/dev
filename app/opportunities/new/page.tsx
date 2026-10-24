'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PageShell from '@/components/PageShell'
import OpportunityForm, { emptyOpportunityForm } from '@/components/OpportunityForm'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import type { OpportunityDTO } from '@/lib/opportunities'

/** List an offering: anyone signed in; admins publish right away, others go to review. */
export default function NewOpportunityPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'
  const [country, setCountry] = useState<string | null>(null)

  useEffect(() => {
    const cc = new URLSearchParams(window.location.search).get('country')?.toUpperCase() ?? ''
    setCountry(COUNTRY_OPTIONS.some((c) => c.code === cc) ? cc : 'CH')
  }, [])

  async function create(body: Record<string, unknown>): Promise<string | null> {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json()) as OpportunityDTO & { error?: string }
    if (!res.ok) return data.error ?? 'Could not save the offering'
    router.push(
      data.properties.status === 'PUBLISHED'
        ? `/map?select=${encodeURIComponent(data.code || data.id)}`
        : '/opportunities?submitted=1#yours'
    )
    return null
  }

  return (
    <PageShell
      eyebrow="For hosts"
      title="List an offering"
      intro="Journeys, services, automations or experiences. Your offering appears as a pin on the map, and Explorers can book it, write to you or ask the agent about it."
      width="narrow"
    >
      {status === 'unauthenticated' ? (
        <div className="card p-6">
          <p className="text-brand-text">Sign in first, so Explorers know who they book with.</p>
          <a href="/login?callbackUrl=/opportunities/new" className="btn btn-primary mt-4">
            Sign in or create an account
          </a>
        </div>
      ) : status === 'loading' || !country ? (
        <div className="h-96 animate-pulse rounded-[10px] bg-brand-surface" />
      ) : (
        <OpportunityForm
          initial={emptyOpportunityForm(country)}
          submitLabel={isAdmin ? 'Publish on the map' : 'Submit for review'}
          note={
            isAdmin
              ? 'As an admin, your offering goes live right away.'
              : 'We check every new offering before it appears on the map, usually within a day.'
          }
          onSubmit={create}
        />
      )}
    </PageShell>
  )
}
