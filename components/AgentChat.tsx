'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { AgentDimensions } from '@/types/domain'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface EnrichedContext {
  countries: string[]
  allValues: Record<string, string[]>
  customChips: { dimension: string; label: string }[]
}

interface AgentChatProps {
  dimensions: AgentDimensions
  enrichedContext?: EnrichedContext
  onClose?: () => void
}

export default function AgentChat({ dimensions, enrichedContext, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsAuth, setNeedsAuth] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimensions,
          enrichedContext,
          message: userMessage,
          conversationId,
        }),
      })

      if (res.status === 401) {
        setNeedsAuth(true)
        setMessages((prev) => prev.slice(0, -1))
        return
      }

      if (!res.ok) {
        throw new Error(`Agent error (${res.status})`)
      }

      const newConversationId = res.headers.get('X-Conversation-Id')
      if (newConversationId) setConversationId(newConversationId)

      const text = await res.text()
      setMessages((prev) => [...prev, { role: 'assistant', content: text }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (needsAuth) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-brand-accent/20 bg-brand-surface px-6 py-12 text-center">
        <div className="mb-4 text-4xl">🔒</div>
        <h3 className="mb-2 text-lg font-semibold text-brand-accent">Hold on, Explorer!</h3>
        <p className="mb-1 text-sm text-brand-text-muted">
          The agent needs to know who you are before it can guide your journey.
        </p>
        <p className="mb-6 text-xs text-brand-text-muted/60">
          Sign in and your dimensions will shape a personal life advisor.
        </p>
        <a
          href="/login"
          className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-brand-accent transition hover:opacity-90"
        >
          Sign in to start exploring
        </a>
        <button
          onClick={() => setNeedsAuth(false)}
          className="mt-3 text-xs text-brand-text-muted/50 transition hover:text-brand-text-muted"
        >
          back to chat
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-brand-accent/20 bg-brand-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-accent/10 px-4 py-3">
        <h3 className="font-medium text-brand-accent">Be[X] Agent</h3>
        {onClose && (
          <button onClick={onClose} className="text-brand-text-muted hover:text-brand-text">
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-brand-text-muted">
            Ask me anything about your selected dimensions.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'ml-8 bg-brand-primary/30 text-brand-text'
                : 'mr-8 bg-brand-surface text-brand-text'
            }`}
          >
            {msg.role === 'assistant' ? (
              <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:text-brand-accent prose-strong:text-brand-accent prose-a:text-brand-accent">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-8 animate-pulse rounded-lg bg-brand-surface px-3 py-2 text-sm text-brand-text-muted">
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-brand-accent/10 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask the agent..."
            className="flex-1 rounded-lg border border-brand-accent/20 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text-muted focus:border-brand-accent focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-accent transition hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
