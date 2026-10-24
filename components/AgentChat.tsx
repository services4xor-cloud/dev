'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AgentChatProps {
  /** ISO codes of the countries in focus; the server loads their live data */
  countries: string[]
  /** Offerings the Explorer selected; the server loads them by id */
  opportunityIds: string[]
  /** Starter questions shown before the first message */
  suggestions: string[]
}

export default function AgentChat({ countries, opportunityIds, suggestions }: AgentChatProps) {
  const { status } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  async function send(text: string) {
    const message = text.trim()
    if (!message || loading || status !== 'authenticated') return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setLoading(true)
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countries, opportunityIds, message, conversationId }),
      })
      if (res.status === 429 || res.status === 503) {
        const limitText = await res.text()
        setMessages((prev) => [...prev, { role: 'assistant', content: limitText }])
        return
      }
      if (!res.ok) throw new Error(`Agent error (${res.status})`)
      const id = res.headers.get('X-Conversation-Id')
      if (id) setConversationId(id)
      const reply = await res.text()
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'The agent could not answer just now. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'unauthenticated') {
    return (
      <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
        <h2 className="font-display text-2xl text-brand-text">Sign in to talk to the agent</h2>
        <p className="mt-2 max-w-md text-sm text-brand-text-muted">
          It is free. The agent uses the countries and offerings you picked on the map, with live
          public data, and keeps your conversation private to you.
        </p>
        <a href="/login?callbackUrl=/agent" className="btn btn-primary mt-6">
          Sign in or create an account
        </a>
      </div>
    )
  }

  return (
    <div className="card flex min-h-[28rem] flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-brand-text-muted">Try one of these, or ask your own:</p>
            <div className="mt-3 grid gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  disabled={status !== 'authenticated'}
                  className="rounded-lg border border-brand-line bg-brand-surface-2 px-3.5 py-2.5 text-left text-sm text-brand-text transition hover:border-brand-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div
              key={i}
              className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-brand-primary px-3.5 py-2.5 text-sm text-[#f3f5f2]"
            >
              {m.content}
            </div>
          ) : (
            <div
              key={i}
              className="prose prose-sm prose-invert max-w-none text-brand-text prose-headings:font-display prose-headings:text-brand-text prose-a:text-brand-accent prose-strong:text-brand-text prose-li:my-0.5 prose-p:my-2"
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          )
        )}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-brand-text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-accent" />
            Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
        className="flex items-end gap-2 border-t border-brand-line p-3"
      >
        <label htmlFor="agent-input" className="sr-only">
          Your question
        </label>
        <textarea
          id="agent-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send(input)
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder="Ask about partners, industries, work or the offerings…"
          className="input max-h-40 min-h-[2.75rem] resize-y"
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  )
}
