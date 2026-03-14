'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────

interface Participant {
  id: string
  name: string | null
  image: string | null
}

interface MessageItem {
  id: string
  senderId: string
  content: string
  read: boolean
  createdAt: string
  sender?: Participant
}

interface ConversationSummary {
  id: string
  participants: Participant[]
  lastMessage: MessageItem | null
  lastMessageAt: string | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function otherParticipants(participants: Participant[], myId: string): Participant[] {
  return participants.filter((p) => p.id !== myId)
}

function initials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Avatar({ participant }: { participant: Participant }) {
  if (participant.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={participant.image}
        alt={participant.name ?? 'User'}
        className="h-9 w-9 rounded-full object-cover"
      />
    )
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-brand-accent">
      {initials(participant.name)}
    </div>
  )
}

function ConversationItem({
  conv,
  myId,
  isActive,
  onClick,
}: {
  conv: ConversationSummary
  myId: string
  isActive: boolean
  onClick: () => void
}) {
  const others = otherParticipants(conv.participants, myId)
  const displayName = others.map((p) => p.name ?? 'Unknown').join(', ') || 'Unknown'
  const preview = conv.lastMessage?.content ?? ''
  const truncated = preview.length > 50 ? preview.slice(0, 50) + '…' : preview

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-brand-surface/60 ${
        isActive ? 'bg-brand-surface border-l-2 border-brand-accent' : ''
      }`}
    >
      <div className="flex-shrink-0">
        {others[0] ? (
          <Avatar participant={others[0]} />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-surface text-xs text-brand-text-muted">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium text-brand-text">{displayName}</span>
          <span className="flex-shrink-0 text-xs text-brand-text-muted">
            {timeAgo(conv.lastMessageAt)}
          </span>
        </div>
        <p className="truncate text-xs text-brand-text-muted">{truncated || 'No messages yet'}</p>
      </div>
    </button>
  )
}

function MessageBubble({ msg, isOwn }: { msg: MessageItem; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
          isOwn
            ? 'bg-brand-primary text-brand-accent rounded-br-sm'
            : 'bg-brand-surface text-brand-text rounded-bl-sm'
        }`}
      >
        <p className="break-words leading-relaxed">{msg.content}</p>
        <p
          className={`mt-1 text-right text-xs opacity-60 ${isOwn ? 'text-brand-accent' : 'text-brand-text-muted'}`}
        >
          {timeAgo(msg.createdAt)}
        </p>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

function MessagesInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const myId = (session?.user as { id?: string })?.id ?? ''

  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [activeParticipants, setActiveParticipants] = useState<Participant[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New-conversation state from ?to= param
  const [newConvRecipient, setNewConvRecipient] = useState<Participant | null>(null)
  const [newConvMode, setNewConvMode] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Handle ?to= query param — auto-open or create conversation with recipient
  useEffect(() => {
    const toUserId = searchParams.get('to')
    if (!toUserId || status !== 'authenticated' || !myId || toUserId === myId) return

    // Check if we already have a conversation with this user
    const existingConv = conversations.find((c) => c.participants.some((p) => p.id === toUserId))
    if (existingConv) {
      // Auto-select existing conversation
      setActiveConvId(existingConv.id)
      setNewConvMode(false)
      setNewConvRecipient(null)
      // Clean the URL
      router.replace('/messages', { scroll: false })
      return
    }

    // No existing conversation — fetch recipient info and enter new-conversation mode
    if (!newConvMode && !newConvRecipient) {
      fetch(`/api/users/${toUserId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setNewConvRecipient({
            id: toUserId,
            name: data?.name ?? 'Explorer',
            image: data?.image ?? null,
          })
          setNewConvMode(true)
          setActiveConvId(null)
        })
        .catch(() => {
          setNewConvRecipient({ id: toUserId, name: 'Explorer', image: null })
          setNewConvMode(true)
          setActiveConvId(null)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, status, myId, conversations])

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      if (!res.ok) throw new Error('Failed to load conversations')
      const data: ConversationSummary[] = await res.json()
      setConversations(data)
    } catch {
      // silently fail on poll
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  // Load messages for active conversation
  const loadMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/messages/${convId}`)
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setMessages(data.messages ?? [])
      setActiveParticipants(data.participants ?? [])
    } catch {
      // silently fail on poll
    } finally {
      setLoadingMsgs(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    if (status !== 'authenticated') return
    loadConversations()
  }, [status, loadConversations])

  // Poll conversations every 5s
  useEffect(() => {
    if (status !== 'authenticated') return
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [status, loadConversations])

  // Load messages when active conv changes
  useEffect(() => {
    if (!activeConvId) return
    setLoadingMsgs(true)
    loadMessages(activeConvId)
  }, [activeConvId, loadMessages])

  // Poll messages every 5s when a conversation is open
  useEffect(() => {
    if (!activeConvId) return
    const interval = setInterval(() => loadMessages(activeConvId), 5000)
    return () => clearInterval(interval)
  }, [activeConvId, loadMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSelectConv(convId: string) {
    setActiveConvId(convId)
    setMessages([])
    setError(null)
    setNewConvMode(false)
    setNewConvRecipient(null)
  }

  async function handleSend() {
    if (!inputValue.trim() || sending) return

    // Determine the recipientId — either from active conversation or new-conversation mode
    let recipientId: string | undefined
    if (newConvMode && newConvRecipient) {
      recipientId = newConvRecipient.id
    } else if (activeConvId) {
      const others = otherParticipants(activeParticipants, myId)
      recipientId = others[0]?.id
    }
    if (!recipientId) return

    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, content: inputValue.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Send failed')
      }
      const data = await res.json()
      setInputValue('')

      // If we were in new-conversation mode, switch to the created conversation
      if (newConvMode) {
        setNewConvMode(false)
        setNewConvRecipient(null)
        router.replace('/messages', { scroll: false })
        await loadConversations()
        setActiveConvId(data.conversationId)
      } else if (activeConvId) {
        await loadMessages(activeConvId)
        await loadConversations()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send message')
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Loading…</p>
      </div>
    )
  }

  const activeConv = conversations.find((c) => c.id === activeConvId)
  const activeOthers = activeConvId ? otherParticipants(activeParticipants, myId) : []

  return (
    <div className="flex h-screen flex-col bg-brand-bg">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-semibold text-brand-accent">Messages</h1>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex min-h-0 flex-1">
        {/* Left sidebar — conversation list */}
        <aside className="flex w-72 flex-shrink-0 flex-col border-r border-white/5">
          <div className="border-b border-white/5 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-text-muted">
              Conversations
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-brand-text-muted">Loading…</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <p className="text-2xl">✉️</p>
                <p className="mt-2 text-sm font-medium text-brand-text">No messages yet</p>
                <p className="mt-1 text-xs text-brand-text-muted">
                  Start a conversation from an Explorer&apos;s profile.
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  myId={myId}
                  isActive={conv.id === activeConvId}
                  onClick={() => handleSelectConv(conv.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Right panel — messages + input */}
        <main className="flex min-w-0 flex-1 flex-col">
          {newConvMode && newConvRecipient ? (
            <>
              {/* New conversation header */}
              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
                <Avatar participant={newConvRecipient} />
                <div>
                  <p className="text-sm font-semibold text-brand-text">{newConvRecipient.name}</p>
                  <p className="text-xs text-brand-text-muted">New conversation</p>
                </div>
              </div>

              {/* Empty message area with prompt */}
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-brand-text-muted">
                  Send your first message to {newConvRecipient.name}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mx-5 mb-2 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Input bar */}
              <div className="border-t border-white/5 px-4 py-3">
                <div className="flex items-end gap-3 rounded-xl border border-white/10 bg-brand-surface px-4 py-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)"
                    maxLength={2000}
                    className="flex-1 resize-none bg-transparent text-sm text-brand-text placeholder-brand-text-muted outline-none"
                    style={{ minHeight: '24px' }}
                    autoFocus
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !inputValue.trim()}
                    className="flex-shrink-0 rounded-lg bg-brand-primary px-4 py-1.5 text-sm font-medium text-brand-accent transition disabled:opacity-40 hover:opacity-90"
                  >
                    {sending ? '…' : 'Send'}
                  </button>
                </div>
                <p className="mt-1 text-right text-xs text-brand-text-muted">
                  {inputValue.length}/2000
                </p>
              </div>
            </>
          ) : !activeConvId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <p className="text-4xl">💬</p>
              <p className="mt-3 text-base font-medium text-brand-text">Select a conversation</p>
              <p className="mt-1 text-sm text-brand-text-muted">
                Choose from the list on the left to start messaging.
              </p>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
                {activeOthers[0] && <Avatar participant={activeOthers[0]} />}
                <div>
                  <p className="text-sm font-semibold text-brand-text">
                    {activeOthers.map((p) => p.name ?? 'Unknown').join(', ') || 'Unknown'}
                  </p>
                  {activeConv && (
                    <p className="text-xs text-brand-text-muted">
                      {activeConv.participants.length} participants
                    </p>
                  )}
                </div>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-brand-text-muted">Loading messages…</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-brand-text-muted">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} isOwn={msg.senderId === myId} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mx-5 mb-2 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Input bar */}
              <div className="border-t border-white/5 px-4 py-3">
                <div className="flex items-end gap-3 rounded-xl border border-white/10 bg-brand-surface px-4 py-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      // Auto-resize
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)"
                    maxLength={2000}
                    className="flex-1 resize-none bg-transparent text-sm text-brand-text placeholder-brand-text-muted outline-none"
                    style={{ minHeight: '24px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !inputValue.trim()}
                    className="flex-shrink-0 rounded-lg bg-brand-primary px-4 py-1.5 text-sm font-medium text-brand-accent transition disabled:opacity-40 hover:opacity-90"
                  >
                    {sending ? '…' : 'Send'}
                  </button>
                </div>
                <p className="mt-1 text-right text-xs text-brand-text-muted">
                  {inputValue.length}/2000
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-bg">
          <p className="text-brand-text-muted text-sm">Loading…</p>
        </div>
      }
    >
      <MessagesInner />
    </Suspense>
  )
}
