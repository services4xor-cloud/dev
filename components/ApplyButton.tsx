'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ApplyButtonProps {
  opportunityId: string
  /** Shown on the button, e.g. "Book this journey" */
  label?: string
  compact?: boolean
}

/** Book an Opportunity: creates an Exchange the Host then accepts or declines. */
export default function ApplyButton({
  opportunityId,
  label = 'Book this',
  compact = false,
}: ApplyButtonProps) {
  const { data: session } = useSession()
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error' | 'already'>(
    'idle'
  )
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!session?.user) {
    return (
      <a
        href={`/login?callbackUrl=${encodeURIComponent(`/exchange/${opportunityId}`)}`}
        className={`btn btn-primary ${compact ? 'btn-sm' : ''}`}
      >
        Sign in to book
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
        Request sent. The host will confirm it, and you can follow it under{' '}
        <a href="/bookings" className="underline">
          My bookings
        </a>
        .
      </div>
    )
  }

  if (state === 'already') {
    return (
      <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent">
        You already booked this. See{' '}
        <a href="/bookings" className="underline">
          My bookings
        </a>
        .
      </div>
    )
  }

  if (state === 'form' || state === 'sending' || state === 'error') {
    return (
      <div className="w-full space-y-3 rounded-lg border border-brand-line bg-brand-surface-2 p-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Anything the host should know, like dates or group size (optional)…"
          maxLength={500}
          rows={3}
          className="input text-sm"
        />
        {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={state === 'sending'}
            className="btn btn-primary btn-sm"
          >
            {state === 'sending' ? 'Sending…' : 'Send request'}
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
      className={`btn btn-primary ${compact ? 'btn-sm' : ''}`}
    >
      {label}
    </button>
  )
}
