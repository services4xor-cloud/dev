'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIdentity } from '@/lib/identity-context'
// Threads fetched from real DB via /api/threads
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'
import GlassCard from '@/components/ui/GlassCard'

// ── Types ────────────────────────────────────────────────────────────

interface MockMessage {
  id: string
  author: string
  avatar: string
  text: string
  time: string
}

// ── Mock messages per channel ────────────────────────────────────────

const CHANNEL_MESSAGES: Record<string, MockMessage[]> = {
  ke: [
    {
      id: '1',
      author: 'Amina W.',
      avatar: '🇰🇪',
      text: 'Has anyone used the KE→DE route for nursing? Looking for advice on credential recognition.',
      time: '2 hours ago',
    },
    {
      id: '2',
      author: 'James O.',
      avatar: '💻',
      text: 'Just got my Blue Card approved! Happy to answer questions about the process.',
      time: '4 hours ago',
    },
    {
      id: '3',
      author: 'Wanjiku M.',
      avatar: '🌿',
      text: 'Welcome to all new Pioneers joining this week. Feel free to introduce yourselves!',
      time: '6 hours ago',
    },
  ],
  tech: [
    {
      id: '1',
      author: 'David K.',
      avatar: '💻',
      text: 'Anyone working on mobile money integrations? Would love to connect.',
      time: '1 hour ago',
    },
    {
      id: '2',
      author: 'Sarah L.',
      avatar: '⚙️',
      text: 'Just published a guide on getting remote tech roles from Nairobi. Check my profile!',
      time: '3 hours ago',
    },
  ],
  nairobi: [
    {
      id: '1',
      author: 'Peter N.',
      avatar: '🏙️',
      text: 'iHub is hosting a meetup next Thursday. Who is coming?',
      time: '30 min ago',
    },
    {
      id: '2',
      author: 'Grace A.',
      avatar: '🎯',
      text: 'Looking for co-working space recommendations in Westlands area.',
      time: '2 hours ago',
    },
  ],
}

// ── Thread type labels ───────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  country: 'Countries',
  tribe: 'Tribes',
  language: 'Languages',
  interest: 'Interests',
  religion: 'Faith',
  science: 'Knowledge',
  location: 'Locations',
}

// ── Component ────────────────────────────────────────────────────────

/** Build DimensionProfile from user identity */
function identityToProfile(identity: {
  country: string
  city?: string
  languages: string[]
  interests: string[]
}): DimensionProfile {
  return {
    country: identity.country,
    city: identity.city,
    languages: identity.languages,
    faith: (identity as Record<string, unknown>).faith as string | undefined,
    craft: ((identity as Record<string, unknown>).craft as string[]) ?? [],
    interests: identity.interests,
    reach: ((identity as Record<string, unknown>).reach as string[]) ?? [],
    culture: (identity as Record<string, unknown>).culture as string | undefined,
    isHuman: true,
  }
}

/** Build DimensionProfile from agent */
function agentToProfile(agent: AgentPersona): DimensionProfile {
  return {
    country: agent.country,
    city: agent.city,
    languages: agent.languages,
    faith: agent.faith,
    craft: agent.craft,
    interests: agent.interests,
    reach: agent.reach,
    culture: agent.culture,
    isHuman: false,
  }
}

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)
  const [dbThreads, setDbThreads] = useState<
    Array<{
      slug: string
      name: string
      brandName: string
      type: string
      icon: string
      tagline: string
      description: string
      memberCount: number
      active: boolean
    }>
  >([])

  // Fetch real threads from DB
  useEffect(() => {
    fetch('/api/threads')
      .then((r) => r.json())
      .then((data) => {
        if (data.threads) setDbThreads(data.threads)
      })
      .catch(() => {})
  }, [])

  // Auto-select DM when navigating from Connect action (e.g., /messages?dm=agent_123)
  const dmParam = searchParams.get('dm')
  useEffect(() => {
    if (dmParam) {
      setSelectedSlug(`dm-${dmParam}`)
      setShowMobileContent(true)
    }
  }, [dmParam])

  // Top-matched AI agents for Direct Messages section
  // Includes the dm query param agent if not in top 5
  const topAgents = useMemo(() => {
    const allAgents = generateAllAgents()
    const meProfile = identityToProfile(identity)
    const signals = getSignalsForRegion(identity.country)

    const scored = allAgents
      .map((agent) => {
        const themProfile = agentToProfile(agent)
        const dimScore = scoreDimensions(meProfile, themProfile, signals)
        const displayScore = Math.min(100, Math.round((dimScore.total / 110) * 100))
        return { agent, score: displayScore }
      })
      .sort((a, b) => b.score - a.score)

    const top5 = scored.slice(0, 5)

    // If a dm param agent isn't in top 5, include them at the top
    if (dmParam) {
      const inTop5 = top5.some(({ agent }) => agent.id === dmParam)
      if (!inTop5) {
        const dmAgent = scored.find(({ agent }) => agent.id === dmParam)
        if (dmAgent) {
          return [dmAgent, ...top5]
        }
      }
    }

    return top5
  }, [identity, dmParam])

  // Gate: redirect if discovery not complete
  if (!hasCompletedDiscovery) {
    router.push('/')
    return null
  }

  // Group threads by type for the sidebar
  const threadsByType = dbThreads.reduce(
    (acc, thread) => {
      if (!thread.active) return acc
      const type = thread.type
      if (!acc[type]) acc[type] = []
      acc[type].push(thread)
      return acc
    },
    {} as Record<string, (typeof dbThreads)[number][]>
  )

  // Display order for thread types
  const typeOrder = ['country', 'tribe', 'language', 'interest', 'science', 'location', 'religion']

  const selectedThread =
    selectedSlug && !selectedSlug.startsWith('dm-')
      ? dbThreads.find((t) => t.slug === selectedSlug)
      : null

  // Find selected AI agent for DM view
  const selectedAgent = selectedSlug?.startsWith('dm-')
    ? topAgents.find(({ agent }) => `dm-${agent.id}` === selectedSlug)
    : null

  const messages =
    selectedSlug && !selectedSlug.startsWith('dm-') ? CHANNEL_MESSAGES[selectedSlug] || [] : []

  const handleSelectChannel = (slug: string) => {
    setSelectedSlug(slug)
    setShowMobileContent(true)
  }

  const handleBackToList = () => {
    setShowMobileContent(false)
  }

  // ── Sidebar ──────────────────────────────────────────────────────

  const sidebar = (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Communities */}
      {typeOrder.map((type) => {
        const threads = threadsByType[type]
        if (!threads || threads.length === 0) return null
        return (
          <div key={type} className="mb-phi-3">
            <h3 className="mb-phi-1 px-phi-3 text-phi-xs font-semibold uppercase tracking-wider text-white/40">
              {TYPE_LABELS[type] || type}
            </h3>
            <div className="space-y-px">
              {threads.map((thread) => (
                <button
                  key={thread.slug}
                  onClick={() => handleSelectChannel(thread.slug)}
                  className={`flex w-full items-center gap-phi-2 px-phi-3 py-phi-2 text-left transition-all duration-200 hover:bg-white/5 ${
                    selectedSlug === thread.slug
                      ? 'glass-subtle border-l-2 border-brand-accent bg-white/5'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <span className="text-phi-base">{thread.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-phi-sm font-medium ${
                        selectedSlug === thread.slug ? 'text-brand-accent' : 'text-white/80'
                      }`}
                    >
                      {thread.brandName}
                    </p>
                    {thread.memberCount && (
                      <p className="text-phi-xs text-white/30">
                        {thread.memberCount.toLocaleString()} members
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Direct Messages — AI agent conversation starters */}
      <div className="mt-phi-5 border-t border-white/10 pt-phi-3">
        <h3 className="mb-phi-2 px-phi-3 text-phi-xs font-semibold uppercase tracking-wider text-white/40">
          Direct Messages
        </h3>
        {topAgents.length > 0 ? (
          <div className="space-y-px">
            {topAgents.map(({ agent, score }) => (
              <button
                key={agent.id}
                onClick={() => handleSelectChannel(`dm-${agent.id}`)}
                className={`flex w-full items-center gap-phi-2 px-phi-3 py-phi-2 text-left transition-all duration-200 hover:bg-white/5 ${
                  selectedSlug === `dm-${agent.id}`
                    ? 'glass-subtle border-l-2 border-brand-accent bg-white/5'
                    : 'border-l-2 border-transparent'
                }`}
              >
                <span className="text-phi-base">{agent.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-phi-sm font-medium ${
                      selectedSlug === `dm-${agent.id}` ? 'text-brand-accent' : 'text-white/80'
                    }`}
                  >
                    <span className="mr-1 text-phi-xs opacity-60">🤖</span>
                    {agent.name}
                  </p>
                  <p className="truncate text-phi-xs text-white/30">
                    {agent.city}, {agent.country} · {score}% match
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <GlassCard variant="subtle" padding="sm" className="mx-phi-3">
            <p className="text-phi-sm text-white/40">
              Connect with someone on Exchange to start a conversation
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  )

  // ── Content panel ────────────────────────────────────────────────

  // ── Agent DM content panel ─────────────────────────────────────
  const agentDmPanel = selectedAgent ? (
    <div className="flex h-full flex-col">
      {/* Agent header */}
      <div className="flex items-center gap-phi-3 border-b border-white/10 px-phi-5 py-phi-3">
        <button
          onClick={handleBackToList}
          className="mr-phi-1 text-white/60 transition-colors hover:text-white md:hidden"
          aria-label="Back to channels"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="text-phi-lg">{selectedAgent.agent.avatar}</span>
        <div>
          <h2 className="text-phi-base font-semibold text-white">
            <span className="mr-1 text-phi-xs opacity-60">🤖</span>
            {selectedAgent.agent.name}
          </h2>
          <p className="text-phi-xs text-white/50">
            {selectedAgent.agent.city}, {selectedAgent.agent.country} · {selectedAgent.score}% match
          </p>
        </div>
      </div>

      {/* Agent bio + exchange proposals */}
      <div className="flex-1 space-y-phi-3 overflow-y-auto px-phi-5 py-phi-5">
        <GlassCard variant="subtle" padding="sm" className="mb-phi-5">
          <p className="text-phi-sm text-white/50">
            <span className="font-medium text-brand-accent">About:</span> {selectedAgent.agent.bio}
          </p>
        </GlassCard>

        {/* Exchange proposals as conversation starters */}
        {selectedAgent.agent.exchangeProposals.map((proposal, idx) => (
          <div key={idx} className="flex items-start gap-phi-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-phi-sm">
              {selectedAgent.agent.avatar}
            </div>
            <GlassCard variant="subtle" padding="sm" className="min-w-0 flex-1">
              <div className="mb-phi-1 flex items-baseline gap-phi-2">
                <span className="text-phi-sm font-medium text-white">
                  🤖 {selectedAgent.agent.name}
                </span>
                <span className="text-phi-xs text-white/30">Conversation starter</span>
              </div>
              <p className="text-phi-sm text-white/70">{proposal}</p>
            </GlassCard>
          </div>
        ))}

        {/* Craft tags */}
        {selectedAgent.agent.craft.length > 0 && (
          <div className="pt-phi-3">
            <p className="mb-phi-2 text-phi-xs font-semibold uppercase tracking-wider text-white/30">
              Crafts
            </p>
            <div className="flex flex-wrap gap-phi-1">
              {selectedAgent.agent.craft.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/5 px-phi-2 py-0.5 text-phi-xs text-white/50"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className="border-t border-white/10 px-phi-5 py-phi-3">
        <div className="glass-subtle flex items-center gap-phi-2 rounded-lg px-phi-3 py-phi-2">
          <input
            type="text"
            placeholder={`Message ${selectedAgent.agent.name}...`}
            className="flex-1 bg-transparent text-phi-sm text-white placeholder-white/30 outline-none"
            disabled
          />
          <button
            className="flex-shrink-0 text-white/30 transition-colors hover:text-brand-accent"
            disabled
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null

  const contentPanel = selectedThread ? (
    <div className="flex h-full flex-col">
      {/* Channel header */}
      <div className="flex items-center gap-phi-3 border-b border-white/10 px-phi-5 py-phi-3">
        {/* Mobile back button */}
        <button
          onClick={handleBackToList}
          className="mr-phi-1 text-white/60 transition-colors hover:text-white md:hidden"
          aria-label="Back to channels"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="text-phi-lg">{selectedThread.icon}</span>
        <div>
          <h2 className="text-phi-base font-semibold text-white">{selectedThread.brandName}</h2>
          <p className="text-phi-xs text-white/50">{selectedThread.tagline}</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-phi-3 overflow-y-auto px-phi-5 py-phi-5">
        {/* Channel description */}
        <GlassCard variant="subtle" padding="sm" className="mb-phi-5">
          <p className="text-phi-sm text-white/50">
            <span className="font-medium text-brand-accent">About this channel:</span>{' '}
            {selectedThread.description}
          </p>
        </GlassCard>

        {/* Messages */}
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-phi-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-phi-sm">
                {msg.avatar}
              </div>
              <GlassCard variant="subtle" padding="sm" className="min-w-0 flex-1">
                <div className="mb-phi-1 flex items-baseline gap-phi-2">
                  <span className="text-phi-sm font-medium text-white">{msg.author}</span>
                  <span className="text-phi-xs text-white/30">{msg.time}</span>
                </div>
                <p className="text-phi-sm text-white/70">{msg.text}</p>
              </GlassCard>
            </div>
          ))
        ) : (
          <div className="py-phi-7 text-center">
            <p className="text-phi-sm text-white/30">
              No messages yet. Be the first to start a conversation!
            </p>
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className="border-t border-white/10 px-phi-5 py-phi-3">
        <div className="glass-subtle flex items-center gap-phi-2 rounded-lg px-phi-3 py-phi-2">
          <input
            type="text"
            placeholder={`Message ${selectedThread.brandName}...`}
            className="flex-1 bg-transparent text-phi-sm text-white placeholder-white/30 outline-none"
            disabled
          />
          <button
            className="flex-shrink-0 text-white/30 transition-colors hover:text-brand-accent"
            disabled
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : agentDmPanel ? (
    agentDmPanel
  ) : (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-phi-lg text-white/20">Select a conversation</p>
        <p className="mt-phi-1 text-phi-sm text-white/10">
          Choose a community channel or AI agent to view messages
        </p>
      </div>
    </div>
  )

  // ── Layout ───────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-brand-bg px-phi-3 py-phi-5 md:px-phi-7">
      {/* Page title */}
      <div className="mx-auto mb-phi-5 max-w-7xl">
        <h1 className="gradient-text text-phi-2xl font-bold">Messages</h1>
        <p className="mt-phi-1 text-phi-sm text-white/50">
          Community channels and direct conversations
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto flex max-w-7xl gap-0 overflow-hidden rounded-xl border border-white/5 md:h-[calc(100vh-200px)]">
        {/* Sidebar — hidden on mobile when content is shown */}
        <div
          className={`glass-strong w-full flex-shrink-0 border-r border-white/5 py-phi-3 md:block md:w-[300px] ${
            showMobileContent ? 'hidden' : 'block'
          }`}
        >
          {sidebar}
        </div>

        {/* Content panel — hidden on mobile when list is shown */}
        <div
          className={`min-w-0 flex-1 bg-brand-bg md:block ${
            showMobileContent ? 'block' : 'hidden'
          }`}
        >
          {contentPanel}
        </div>
      </div>
    </main>
  )
}
