'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ContactButtonProps {
  opportunityId: string
  compact?: boolean
}

/** Write to the provider of a listing; the message is relayed by email. */
export default function ContactButton({ opportunityId, compact = false }: ContactButtonProps) {
  const { data: session } = useSession()
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const buttonClass = compact
    ? 'rounded-lg border border-brand-accent/30 px-3 py-1.5 text-xs font-medium text-brand-text hover:bg-brand-accent/10'
    : 'rounded-lg border border-brand-accent/30 px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-accent/10'

  if (!session?.user) {
    return (
      <a
        href={`/login?callbackUrl=${encodeURIComponent(`/exchange/${opportunityId}`)}`}
        className={buttonClass}
      >
        Sign in to contact
      </a>
    )
  }

  if (state === 'done') {
    return (
      <p className="text-sm text-green-400">Message sent. The provider answers you by email.</p>
    )
  }

  if (state === 'idle') {
    return (
      <button type="button" onClick={() => setState('form')} className={buttonClass}>
        Contact provider
      </button>
    )
  }

  async function send() {
    setState('sending')
    setErrorMsg('')
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Could not send the message')
      }
      setState('done')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Could not send the message')
      setState('error')
    }
  }

  return (
    <div className="w-full space-y-2">
      <label htmlFor={`contact-${opportunityId}`} className="sr-only">
        Your message
      </label>
      <textarea
        id={`contact-${opportunityId}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Your question. The provider replies to your email."
        className="w-full rounded-lg border border-brand-accent/20 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-muted focus:border-brand-accent focus:outline-none"
      />
      {state === 'error' && <p className="text-xs text-red-400">{errorMsg}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={send}
          disabled={state === 'sending' || message.trim().length < 5}
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-accent hover:opacity-90 disabled:opacity-50"
        >
          {state === 'sending' ? 'Sending…' : 'Send'}
        </button>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="px-3 py-2 text-sm text-brand-text-muted hover:text-brand-text"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
