'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ApplyButton({ opportunityId }: { opportunityId: string }) {
  const { data: session } = useSession()
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error' | 'already'>(
    'idle'
  )
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!session?.user) {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-accent transition hover:opacity-90"
      >
        Sign in to engage
      </a>
    )
  }

  async function handleSubmit() {
    setState('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          ...(message.trim() ? { message: message.trim() } : {}),
        }),
      })
      if (res.status === 409) {
        setState('already')
        return
      }
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to engage')
      }
      setState('done')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
        Exchange submitted! The host will review it.
      </div>
    )
  }

  if (state === 'already') {
    return (
      <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent">
        You have already engaged with this opportunity.
      </div>
    )
  }

  if (state === 'form' || state === 'sending' || state === 'error') {
    return (
      <div className="space-y-3 rounded-lg border border-white/10 bg-brand-surface p-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the host why you're interested (optional)…"
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/40"
        />
        {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={state === 'sending'}
            className="rounded-lg bg-brand-primary px-5 py-2 text-sm font-semibold text-brand-accent transition hover:opacity-90 disabled:opacity-40"
          >
            {state === 'sending' ? 'Sending…' : 'Submit Exchange'}
          </button>
          <button
            onClick={() => {
              setState('idle')
              setMessage('')
              setErrorMsg('')
            }}
            className="text-sm text-brand-text-muted hover:text-brand-text transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setState('form')}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-accent transition hover:opacity-90"
    >
      Engage with this Opportunity
    </button>
  )
}
