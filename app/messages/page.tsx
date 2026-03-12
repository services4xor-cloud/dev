'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
// Threads fetched from real DB via /api/threads
import { MOCK_THREADS } from '@/data/mock'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import GlassCard from '@/components/ui/GlassCard'

/** Resolve a language code to its human-readable name */
function langCodeToName(code: string): string {
  const lang = LANGUAGE_REGISTRY[code as LanguageCode]
  return lang ? lang.name : code
}

/** Resolve an exchange category ID to its label and icon */
function categoryInfo(id: string): { label: string; icon: string } {
  const cat = EXCHANGE_CATEGORIES.find((c) => c.id === id)
  return cat ? { label: cat.label, icon: cat.icon } : { label: id, icon: '📌' }
}

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
  faith: string[]
  craft?: string[]
  reach?: string[]
  culture?: string
}): DimensionProfile {
  return {
    country: identity.country,
    city: identity.city,
    languages: identity.languages,
    faith: identity.faith,
    craft: identity.craft ?? [],
    interests: identity.interests,
    reach: identity.reach ?? [],
    culture: identity.culture,
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

/** Generate a contextual response from an agent based on their persona and conversation history */
function generateAgentResponse(
  agent: AgentPersona,
  userMessage: string,
  previousMessages?: Array<{ author: 'user' | 'agent'; text: string }>
): string {
  const greetings = [
    'Jambo! Great to connect with you. ',
    'Hello! Thanks for reaching out. ',
    'Hey there! Nice to meet you. ',
    "Hi! I'm excited to chat. ",
  ]

  const topicResponses: string[] = []

  // Faith-based responses
  if (agent.faith.length > 0) {
    topicResponses.push(
      `As someone who practices ${agent.faith.join(' and ')}, I find that faith connects us across borders.`,
      `My ${agent.faith[0]} faith has been a guiding light in my journey. Do you share similar beliefs?`
    )
  }

  // Craft-based responses
  if (agent.craft.length > 0) {
    topicResponses.push(
      `I specialize in ${agent.craft.slice(0, 2).join(' and ')}. Would love to collaborate!`,
      `My experience in ${agent.craft[0]} has taught me so much. What's your craft?`
    )
  }

  // Location-based
  topicResponses.push(
    `Life in ${agent.city} is amazing. Have you ever visited?`,
    `${agent.city} has so much to offer. I'd love to show you around someday!`
  )

  // Interest-based
  if (agent.interests.length > 0) {
    topicResponses.push(
      "I'm really passionate about what I do. Let's find ways to create value together."
    )
  }

  // Bio-based
  topicResponses.push(agent.bio)

  // Pick based on message content or random
  const lowerMsg = userMessage.toLowerCase()
  const msgCount = previousMessages?.length ?? 0
  let response = ''

  // ── Topic detection ──────────────────────────────────────────────

  if (
    lowerMsg.includes('faith') ||
    lowerMsg.includes('believe') ||
    lowerMsg.includes('religion') ||
    lowerMsg.includes('spiritual')
  ) {
    response =
      agent.faith.length > 0
        ? `My ${agent.faith.join(' and ')} faith is central to who I am. It shapes how I work and connect with people. What about you?`
        : 'I keep an open mind about spirituality. I believe in connecting with people regardless of their beliefs.'
  } else if (
    lowerMsg.includes('help') ||
    lowerMsg.includes('need') ||
    lowerMsg.includes('looking for')
  ) {
    // Share exchange proposals
    if (agent.exchangeProposals.length > 1) {
      response = `I can definitely help! Here is what I have to offer: ${agent.exchangeProposals.join(' Also, ')} What resonates with you?`
    } else if (agent.exchangeProposals.length === 1) {
      response = `Absolutely! ${agent.exchangeProposals[0]} Does that sound useful to you?`
    } else {
      response = `I would love to help. My skills in ${agent.craft.join(', ') || 'various areas'} could be valuable. What exactly do you need?`
    }
  } else if (
    lowerMsg.includes('culture') ||
    lowerMsg.includes('tradition') ||
    lowerMsg.includes('customs')
  ) {
    const cultureRef = agent.culture ? `As ${agent.culture}, ` : ''
    response = `${cultureRef}Culture is everything to me. In ${agent.city}, we have a rich blend of traditions — from how we greet each other to how we celebrate milestones. ${agent.faith.length > 0 ? `Our ${agent.faith[0]} heritage also plays a big role in daily life.` : 'Every community here has its own unique flavor.'} I would love to share more about our traditions if you are curious!`
  } else if (
    lowerMsg.includes('family') ||
    lowerMsg.includes('home') ||
    lowerMsg.includes('miss')
  ) {
    response = `${agent.city} is home and it holds a special place in my heart. The community here is warm and tight-knit. ${agent.culture ? `Growing up ${agent.culture}, ` : ''}family and neighbors are everything. The food, the sounds, the energy of the streets — there is nothing quite like it. Have you ever been to ${agent.country}?`
  } else if (
    lowerMsg.includes('money') ||
    lowerMsg.includes('salary') ||
    lowerMsg.includes('cost') ||
    lowerMsg.includes('earn') ||
    lowerMsg.includes('income') ||
    lowerMsg.includes('expensive')
  ) {
    response = `The economic landscape in ${agent.country} is full of both challenges and opportunities. ${agent.craft.length > 0 ? `In ${agent.craft[0]}, there is growing demand, but the pay structure is still evolving compared to international standards.` : 'Many sectors are growing rapidly.'} That is why platforms like this matter — they help us find value exchanges that work across different economies. What is the situation like where you are?`
  } else if (
    lowerMsg.includes('work') ||
    lowerMsg.includes('craft') ||
    lowerMsg.includes('skill') ||
    lowerMsg.includes('job')
  ) {
    response =
      agent.craft.length > 0
        ? `I work in ${agent.craft.join(', ')}. ${agent.exchangeProposals[0] || 'Would love to explore opportunities together!'}`
        : `I'm always looking to learn new skills. ${agent.exchangeProposals[0] || 'What do you do?'}`
  } else if (
    lowerMsg.includes('hello') ||
    lowerMsg.includes('hi') ||
    lowerMsg.includes('hey') ||
    lowerMsg.includes('jambo')
  ) {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)]
    response = greeting + (agent.exchangeProposals[0] || agent.bio)
  } else if (
    lowerMsg.includes('where') ||
    lowerMsg.includes('city') ||
    lowerMsg.includes('live') ||
    lowerMsg.includes('country')
  ) {
    response = `I'm based in ${agent.city}, ${agent.country}. It's a great place! Where are you from?`
  } else if (lowerMsg.includes('language') || lowerMsg.includes('speak')) {
    response =
      agent.languages.length > 0
        ? `I speak ${agent.languages.map(langCodeToName).join(', ')}. Language is such a powerful connector!`
        : "I'm always eager to learn new languages. Communication bridges cultures!"
  } else {
    // Random topical response
    response = topicResponses[Math.floor(Math.random() * topicResponses.length)]
  }

  // ── Follow-up awareness (3+ messages = more personal) ────────────

  if (msgCount >= 3 && previousMessages) {
    // Gather topics mentioned in previous messages
    const allPrevText = previousMessages.map((m) => m.text.toLowerCase()).join(' ')
    const extras: string[] = []

    // Reference earlier topics
    if (allPrevText.includes('faith') || allPrevText.includes('believe')) {
      if (agent.faith.length > 0) {
        extras.push(`Since we both value faith, I think there is a deeper connection here.`)
      }
    }
    if (
      allPrevText.includes('craft') ||
      allPrevText.includes('work') ||
      allPrevText.includes('skill')
    ) {
      extras.push(
        `Building on what we discussed about work — ${agent.exchangeProposals[0] || 'I think we could create real value together.'}`
      )
    }

    // Suggest concrete next steps at 4+ messages
    if (msgCount >= 4) {
      const nextSteps = [
        'Want to schedule a video call so we can discuss this properly?',
        `I can introduce you to some people in my network here in ${agent.city} who might help.`,
        'Should we set up a small exchange project together? I think it could work!',
        'If you are serious about this, I know a few Anchors on the platform who would be interested.',
      ]
      extras.push(nextSteps[Math.floor(Math.random() * nextSteps.length)])
    }

    // At 6+ messages, agent becomes warmer
    if (msgCount >= 6) {
      const warmth = [
        `I am really glad we connected. This is exactly what the platform is for.`,
        `You know, conversations like this make me optimistic about what we can build together.`,
        `I feel like we have a lot in common. Let us make something happen!`,
      ]
      extras.push(warmth[Math.floor(Math.random() * warmth.length)])
    }

    if (extras.length > 0) {
      response += ' ' + extras[Math.floor(Math.random() * extras.length)]
    }
  }

  return response
}

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [showMobileContent, setShowMobileContent] = useState(false)
  const [chatMessages, setChatMessages] = useState<
    Record<
      string,
      Array<{
        id: string
        author: 'user' | 'agent'
        text: string
        time: string
      }>
    >
  >({})
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
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

  // Fetch real threads from DB, fallback to mock data for demo
  useEffect(() => {
    fetch('/api/threads')
      .then((r) => r.json())
      .then((data) => {
        if (data.threads && data.threads.length > 0) {
          setDbThreads(data.threads)
        } else {
          // Fallback: use mock data when DB is empty
          setDbThreads(
            MOCK_THREADS.map((t) => ({
              slug: t.slug,
              name: t.name,
              brandName: t.brandName,
              type: t.type,
              icon: t.icon,
              tagline: t.tagline ?? '',
              description: t.description ?? '',
              memberCount: t.memberCount ?? 0,
              active: t.active ?? true,
            }))
          )
        }
      })
      .catch(() => {
        // API failed — use mock data
        setDbThreads(
          MOCK_THREADS.map((t) => ({
            slug: t.slug,
            name: t.name,
            brandName: t.brandName,
            type: t.type,
            icon: t.icon,
            tagline: t.tagline ?? '',
            description: t.description ?? '',
            memberCount: t.memberCount ?? 0,
            active: t.active ?? true,
          }))
        )
      })
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

  // Auto-scroll to bottom when new chat messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Send a message and get an agent response
  const handleSendMessage = (agentId: string, agent: AgentPersona) => {
    if (!chatInput.trim()) return

    const userMsg = {
      id: `msg-${Date.now()}`,
      author: 'user' as const,
      text: chatInput.trim(),
      time: 'Just now',
    }

    setChatMessages((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), userMsg],
    }))

    const inputText = chatInput.trim()
    setChatInput('')

    // Agent responds after a short delay (simulating typing)
    setTimeout(
      () => {
        const agentMsg = {
          id: `msg-${Date.now()}-reply`,
          author: 'agent' as const,
          text: generateAgentResponse(agent, inputText, chatMessages[agentId] || []),
          time: 'Just now',
        }
        setChatMessages((prev) => ({
          ...prev,
          [agentId]: [...(prev[agentId] || []), agentMsg],
        }))
      },
      800 + Math.random() * 1200
    )
  }

  // Gate: show guidance if discovery not complete
  if (!hasCompletedDiscovery) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <p className="text-phi-2xl mb-4">💬</p>
          <h2 className="text-phi-xl font-bold text-white mb-3">Set Up Your Identity First</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Select your languages on the homepage to unlock Messages and start connecting with
            people in your communities.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-accent text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
          >
            Go to Discovery &rarr;
          </Link>
        </div>
      </main>
    )
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
                  className={`rounded-full px-phi-2 py-0.5 text-phi-xs ${
                    identity.craft?.includes(c)
                      ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Faith / Beliefs */}
        {selectedAgent.agent.faith.length > 0 && (
          <div className="pt-phi-3">
            <p className="mb-phi-2 text-phi-xs font-semibold uppercase tracking-wider text-white/30">
              Faith &amp; Beliefs
            </p>
            <div className="flex flex-wrap gap-phi-1">
              {selectedAgent.agent.faith.map((f) => {
                const shared = identity.faith.includes(f)
                return (
                  <span
                    key={f}
                    className={`rounded-full px-phi-2 py-0.5 text-phi-xs ${
                      shared
                        ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                        : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {shared && '✦ '}🙏 {f}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        {selectedAgent.agent.languages.length > 0 && (
          <div className="pt-phi-3">
            <p className="mb-phi-2 text-phi-xs font-semibold uppercase tracking-wider text-white/30">
              Languages
            </p>
            <div className="flex flex-wrap gap-phi-1">
              {selectedAgent.agent.languages.map((l) => {
                const shared = identity.languages.includes(l)
                return (
                  <span
                    key={l}
                    className={`rounded-full px-phi-2 py-0.5 text-phi-xs ${
                      shared
                        ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                        : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {shared && '✦ '}🗣 {langCodeToName(l)}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Interests */}
        {selectedAgent.agent.interests.length > 0 && (
          <div className="pt-phi-3">
            <p className="mb-phi-2 text-phi-xs font-semibold uppercase tracking-wider text-white/30">
              Interests
            </p>
            <div className="flex flex-wrap gap-phi-1">
              {selectedAgent.agent.interests.map((i) => {
                const shared = identity.interests.includes(i)
                const { label, icon } = categoryInfo(i)
                return (
                  <span
                    key={i}
                    className={`rounded-full px-phi-2 py-0.5 text-phi-xs ${
                      shared
                        ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                        : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {shared && '✦ '}
                    {icon} {label}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Shared dimensions summary */}
        {(() => {
          const sharedLangs = selectedAgent.agent.languages.filter((l) =>
            identity.languages.includes(l)
          )
          const sharedFaith = selectedAgent.agent.faith.filter((f) => identity.faith.includes(f))
          const sharedInterests = selectedAgent.agent.interests.filter((i) =>
            identity.interests.includes(i)
          )
          const sharedCraft = selectedAgent.agent.craft.filter((c) =>
            (identity.craft ?? []).includes(c)
          )
          const totalShared =
            sharedLangs.length + sharedFaith.length + sharedInterests.length + sharedCraft.length

          if (totalShared === 0) return null
          return (
            <GlassCard
              variant="subtle"
              padding="sm"
              className="mt-phi-3 border border-brand-accent/20"
            >
              <p className="mb-phi-1 text-phi-xs font-semibold uppercase tracking-wider text-brand-accent">
                What You Share
              </p>
              <div className="space-y-1">
                {sharedLangs.length > 0 && (
                  <p className="text-phi-xs text-white/60">
                    🗣 Languages: {sharedLangs.map(langCodeToName).join(', ')}
                  </p>
                )}
                {sharedFaith.length > 0 && (
                  <p className="text-phi-xs text-white/60">🙏 Faith: {sharedFaith.join(', ')}</p>
                )}
                {sharedInterests.length > 0 && (
                  <p className="text-phi-xs text-white/60">
                    💡 Interests: {sharedInterests.map((i) => categoryInfo(i).label).join(', ')}
                  </p>
                )}
                {sharedCraft.length > 0 && (
                  <p className="text-phi-xs text-white/60">🛠 Crafts: {sharedCraft.join(', ')}</p>
                )}
              </div>
            </GlassCard>
          )
        })()}

        {/* Your Identity card */}
        <div className="mt-phi-5 rounded-xl border border-white/10 bg-white/[0.03] p-phi-3">
          <div className="mb-phi-2 flex items-center justify-between">
            <p className="text-phi-xs font-semibold uppercase tracking-wider text-white/40">
              Your Identity
            </p>
            <Link href="/me" className="text-phi-xs text-brand-accent hover:underline">
              Edit &rarr;
            </Link>
          </div>
          <div className="space-y-1">
            {identity.languages.length > 0 && (
              <p className="text-phi-xs text-white/50">
                🗣 {identity.languages.map(langCodeToName).join(', ')}
              </p>
            )}
            {identity.faith.length > 0 && (
              <p className="text-phi-xs text-white/50">🙏 {identity.faith.join(', ')}</p>
            )}
            {identity.interests.length > 0 && (
              <p className="text-phi-xs text-white/50">
                💡 {identity.interests.map((i) => categoryInfo(i).label).join(', ')}
              </p>
            )}
            {(identity.craft ?? []).length > 0 && (
              <p className="text-phi-xs text-white/50">🛠 {(identity.craft ?? []).join(', ')}</p>
            )}
          </div>
        </div>

        {/* Live chat messages */}
        {(chatMessages[selectedAgent.agent.id] || []).map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-phi-3 ${msg.author === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-phi-sm ${
                msg.author === 'user' ? 'bg-brand-primary' : 'bg-brand-surface'
              }`}
            >
              {msg.author === 'user' ? '👤' : selectedAgent.agent.avatar}
            </div>
            <GlassCard
              variant={msg.author === 'user' ? 'featured' : 'subtle'}
              padding="sm"
              className="min-w-0 max-w-[80%]"
            >
              <div className="mb-phi-1 flex items-baseline gap-phi-2">
                <span className="text-phi-sm font-medium text-white">
                  {msg.author === 'user' ? 'You' : `🤖 ${selectedAgent.agent.name}`}
                </span>
                <span className="text-phi-xs text-white/30">{msg.time}</span>
              </div>
              <p className="text-phi-sm text-white/70">{msg.text}</p>
            </GlassCard>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message input bar */}
      <div className="border-t border-white/10 px-phi-5 py-phi-3">
        <div className="glass-subtle flex items-center gap-phi-2 rounded-lg px-phi-3 py-phi-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(selectedAgent.agent.id, selectedAgent.agent)
              }
            }}
            placeholder={`Message ${selectedAgent.agent.name}...`}
            className="flex-1 bg-transparent text-phi-sm text-white placeholder-white/30 outline-none"
          />
          <button
            onClick={() => handleSendMessage(selectedAgent.agent.id, selectedAgent.agent)}
            className="flex-shrink-0 text-brand-accent transition-colors hover:text-brand-accent/80"
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
