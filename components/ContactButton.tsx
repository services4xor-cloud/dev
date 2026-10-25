'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ContactButtonProps {
  opportunityId: string
  compact?: boolean
}

/** Write to the provider of a listing; it lands in their Messages inbox (and by email). */
export default function ContactButton({ opportunityId, compact = false }: ContactButtonProps) {
  const { data: session } = useSession()
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)

  const buttonClass = compact ? 'btn btn-sm' : 'btn'

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
      <p
        role="status"
        className="w-full rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
      >
        Message sent. The answer comes to your{' '}
        <a
          href={conversationId ? `/messages?c=${conversationId}` : '/messages'}
          className="underline"
        >
          Messages
        </a>{' '}
        and your email.
      </p>
    )
  }

  if (state === 'idle') {
    return (
      <button type="button" onClick={() => setState('form')} className={buttonClass}>
        Contact
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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Could not send the message')
      setConversationId(data.conversationId ?? null)
      setState('done')
    } catch (e) {
      // fetch itself throws a TypeError when the phone is offline
      setErrorMsg(
        e instanceof TypeError
          ? 'No connection. Check your internet and send again.'
          : e instanceof Error
            ? e.message
            : 'Could not send the message'
      )
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
        placeholder="Your question for the provider"
        className="input text-sm"
      />
      {state === 'error' && (
        <p role="alert" className="text-xs text-red-400">
          {errorMsg}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={send}
          disabled={state === 'sending' || message.trim().length < 5}
          className="btn btn-primary btn-sm"
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
