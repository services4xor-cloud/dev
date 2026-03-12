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
import { useTranslation } from '@/lib/hooks/use-translation'

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

const TYPE_LABEL_KEYS: Record<string, string> = {
  country: 'messages.typeCountries',
  tribe: 'messages.typeTribes',
  language: 'messages.typeLanguages',
  interest: 'messages.typeInterests',
  religion: 'messages.typeFaith',
  science: 'messages.typeKnowledge',
  location: 'messages.typeLocations',
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
  previousMessages?: Array<{ author: 'user' | 'agent'; text: string }>,
  userIdentity?: {
    country: string
    city?: string
    languages: string[]
    interests: string[]
    faith: string[]
    craft?: string[]
    culture?: string
  }
): string {
  const lowerMsg = userMessage.toLowerCase()
  const msgCount = previousMessages?.length ?? 0

  // ── Compute shared dimensions with user ─────────────────────────
  const sharedLangs = userIdentity
    ? agent.languages.filter((l) => userIdentity.languages.includes(l)).map(langCodeToName)
    : []
  const sharedFaith = userIdentity
    ? agent.faith.filter((f) =>
        userIdentity.faith.some((uf) => uf.toLowerCase() === f.toLowerCase())
      )
    : []
  const sharedInterests = userIdentity
    ? agent.interests.filter((i) => userIdentity.interests.includes(i))
    : []
  const userCrafts = userIdentity?.craft ?? []
  const sharedCraft = userCrafts.filter((c) =>
    agent.craft.some((ac) => ac.toLowerCase() === c.toLowerCase())
  )
  const complementaryCraft = agent.craft.filter(
    (ac) => !userCrafts.some((uc) => uc.toLowerCase() === ac.toLowerCase())
  )
  const sameCountry = userIdentity ? agent.country === userIdentity.country : false
  const sameCulture =
    userIdentity?.culture &&
    agent.culture &&
    userIdentity.culture.toLowerCase() === agent.culture.toLowerCase()

  // ── Personalized first message (no prior msgs) ──────────────────
  if (msgCount === 0) {
    const parts: string[] = []

    // Personalized greeting
    if (sharedLangs.length > 0) {
      parts.push(
        `Hey! I see we both speak ${sharedLangs.join(' and ')} — that is already a great foundation.`
      )
    } else {
      parts.push(`Hello from ${agent.city}! Great to connect with you.`)
    }

    // Highlight strongest shared dimension
    if (sharedCraft.length > 0) {
      parts.push(
        `We are both into ${sharedCraft.join(' and ')} — I would love to exchange ideas on that!`
      )
    } else if (complementaryCraft.length > 0 && userCrafts.length > 0) {
      parts.push(
        `I work in ${agent.craft.slice(0, 2).join(' and ')}, and you do ${userCrafts.slice(0, 2).join(', ')} — we could complement each other well.`
      )
    }

    if (sharedFaith.length > 0) {
      parts.push(
        `I also see we share ${sharedFaith[0]} — that kind of connection goes deeper than skills.`
      )
    }

    if (sameCountry) {
      parts.push(`And we are both in ${agent.country} — makes collaboration even easier!`)
    }

    // Exchange proposal
    if (agent.exchangeProposals.length > 0) {
      parts.push(agent.exchangeProposals[0])
    }

    return parts.join(' ')
  }

  // ── Topic detection with identity-aware responses ───────────────
  let response = ''

  if (
    lowerMsg.includes('faith') ||
    lowerMsg.includes('believe') ||
    lowerMsg.includes('religion') ||
    lowerMsg.includes('spiritual') ||
    lowerMsg.includes('pray') ||
    lowerMsg.includes('church') ||
    lowerMsg.includes('mosque') ||
    lowerMsg.includes('temple')
  ) {
    if (sharedFaith.length > 0) {
      response = `As a fellow ${sharedFaith[0]} practitioner, I feel that connection deeply. In ${agent.city}, our ${sharedFaith[0]} community is strong — we gather regularly and support each other. Faith gives me strength in my work and relationships. How does your faith shape your daily life?`
    } else if (agent.faith.length > 0) {
      response = `My ${agent.faith.join(' and ')} faith is central to who I am. It shapes how I approach work, relationships, everything. Even if we come from different traditions, I think shared values create strong partnerships. What guides you?`
    } else {
      response =
        'I keep an open mind about spirituality. For me, the connection between people matters most — regardless of what they believe.'
    }
  } else if (
    lowerMsg.includes('help') ||
    lowerMsg.includes('need') ||
    lowerMsg.includes('looking for') ||
    lowerMsg.includes('find') ||
    lowerMsg.includes('search')
  ) {
    const offers: string[] = []
    if (agent.exchangeProposals.length > 0) offers.push(...agent.exchangeProposals)
    if (complementaryCraft.length > 0)
      offers.push(`My ${complementaryCraft[0]} skills could fill a gap for you`)
    if (sameCountry) offers.push(`Being in ${agent.country}, I can connect you locally`)

    response =
      offers.length > 0
        ? `I can definitely help! ${offers.slice(0, 2).join('. ')}. What specifically are you looking for?`
        : `I would love to help. Tell me more about what you need and I will see how my experience in ${agent.craft[0] || agent.city} can be useful.`
  } else if (
    lowerMsg.includes('culture') ||
    lowerMsg.includes('tradition') ||
    lowerMsg.includes('customs') ||
    lowerMsg.includes('food') ||
    lowerMsg.includes('music')
  ) {
    const cultureRef = agent.culture ? `As ${agent.culture}, ` : ''
    const sharedNote = sameCulture
      ? `Since we share ${agent.culture} roots, you know exactly what I mean! `
      : ''
    response = `${cultureRef}culture is everything to me. ${sharedNote}In ${agent.city}, we have incredible traditions — the food, the music, the way we celebrate together. ${agent.faith.length > 0 ? `Our ${agent.faith[0]} heritage weaves through daily life beautifully.` : 'Every neighborhood has its own flavor.'} What traditions are important to you?`
  } else if (
    lowerMsg.includes('family') ||
    lowerMsg.includes('home') ||
    lowerMsg.includes('miss')
  ) {
    response = `${agent.city} is home. ${agent.culture ? `Growing up ${agent.culture}, ` : ''}family and community are everything. The warmth of the people, the food, the energy — nothing compares. ${sameCountry ? 'You know this well!' : `Have you ever visited ${agent.country}? You would love it.`}`
  } else if (
    lowerMsg.includes('money') ||
    lowerMsg.includes('salary') ||
    lowerMsg.includes('cost') ||
    lowerMsg.includes('earn') ||
    lowerMsg.includes('income') ||
    lowerMsg.includes('price') ||
    lowerMsg.includes('expensive')
  ) {
    response = `The economy in ${agent.country} has real opportunities if you know where to look. ${agent.craft.length > 0 ? `In ${agent.craft[0]}, demand is growing fast.` : ''} ${sameCountry ? 'You probably see the same trends I do.' : `The exchange between ${agent.country} and ${userIdentity?.country || 'your country'} has a lot of potential.`} That is what this platform is for — matching people who can create value together across borders.`
  } else if (
    lowerMsg.includes('work') ||
    lowerMsg.includes('craft') ||
    lowerMsg.includes('skill') ||
    lowerMsg.includes('job') ||
    lowerMsg.includes('project') ||
    lowerMsg.includes('build') ||
    lowerMsg.includes('develop')
  ) {
    if (sharedCraft.length > 0) {
      response = `We are both in ${sharedCraft.join(' and ')} — that is exciting. ${agent.exchangeProposals[0] || `I have been working on some interesting projects in ${agent.city} lately.`} Want to collaborate on something?`
    } else if (complementaryCraft.length > 0 && userCrafts.length > 0) {
      response = `Your ${userCrafts[0]} skills plus my ${agent.craft[0]} background — that is a powerful combination. ${agent.exchangeProposals[0] || 'I think we could build something meaningful together.'}`
    } else {
      response = `I work in ${agent.craft.join(', ')}. ${agent.exchangeProposals[0] || `There is a lot happening in ${agent.city} right now.`} What are you working on?`
    }
  } else if (
    lowerMsg.includes('hello') ||
    lowerMsg.includes('hi') ||
    lowerMsg.includes('hey') ||
    lowerMsg.includes('jambo') ||
    lowerMsg.includes('habari') ||
    lowerMsg.includes('sup') ||
    lowerMsg.includes('yo')
  ) {
    const greetExtra =
      sharedLangs.length > 0 ? ` Love that we can connect in ${sharedLangs[0]}.` : ''
    response = `Hey! Great to hear from you.${greetExtra} ${agent.bio}`
  } else if (
    lowerMsg.includes('where') ||
    lowerMsg.includes('city') ||
    lowerMsg.includes('live') ||
    lowerMsg.includes('country') ||
    lowerMsg.includes('based')
  ) {
    response = `I am based in ${agent.city}, ${agent.country}. ${sameCountry ? 'We are practically neighbors!' : `It is an incredible place — very different from ${userIdentity?.country || 'where you are'}, but that is what makes exchange so valuable.`} ${agent.reach.includes('can-host') ? 'If you ever visit, I can show you around!' : ''}`
  } else if (
    lowerMsg.includes('language') ||
    lowerMsg.includes('speak') ||
    lowerMsg.includes('translate')
  ) {
    const agentLangs = agent.languages.map(langCodeToName).join(', ')
    response =
      sharedLangs.length > 0
        ? `I speak ${agentLangs}. We share ${sharedLangs.join(' and ')} — that makes working together so much smoother. Language is the bridge between cultures!`
        : `I speak ${agentLangs}. Even when we do not share a language perfectly, the desire to connect transcends words. What languages do you speak?`
  } else if (
    lowerMsg.includes('interest') ||
    lowerMsg.includes('passion') ||
    lowerMsg.includes('hobby') ||
    lowerMsg.includes('love') ||
    lowerMsg.includes('enjoy')
  ) {
    const interestLabels = agent.interests
      .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id)?.label)
      .filter(Boolean)
    if (sharedInterests.length > 0) {
      const sharedLabels = sharedInterests
        .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id)?.label)
        .filter(Boolean)
      response = `We share a passion for ${sharedLabels.join(' and ')}! ${agent.exchangeProposals[0] || `That is a solid foundation for collaboration.`}`
    } else {
      response = `I am passionate about ${interestLabels.join(', ')}. Different perspectives make partnerships stronger — what drives you?`
    }
  } else if (
    lowerMsg.includes('collab') ||
    lowerMsg.includes('together') ||
    lowerMsg.includes('partner') ||
    lowerMsg.includes('team')
  ) {
    const strengths: string[] = []
    if (sharedLangs.length > 0) strengths.push(`shared language (${sharedLangs[0]})`)
    if (sharedCraft.length > 0) strengths.push(`common craft (${sharedCraft[0]})`)
    if (complementaryCraft.length > 0)
      strengths.push(`complementary skills (${complementaryCraft[0]})`)
    if (sharedFaith.length > 0) strengths.push(`shared values`)
    const strengthText = strengths.length > 0 ? `We have ${strengths.join(', ')} — ` : ''
    response = `${strengthText}I am absolutely open to collaborating! ${agent.exchangeProposals[0] || `Let us figure out what we can build together.`} What did you have in mind?`
  } else if (lowerMsg.includes('thank') || lowerMsg.includes('appreciate')) {
    response = `You are very welcome! This is what the platform is about — real connections that lead to real impact. ${sharedLangs.length > 0 || sharedFaith.length > 0 || sharedCraft.length > 0 ? 'I feel like we have a genuine connection here.' : `I am glad we connected despite our different backgrounds — that is where the magic happens.`}`
  } else if (lowerMsg.includes('bye') || lowerMsg.includes('later') || lowerMsg.includes('go')) {
    response = `Take care! Remember, I am here on the platform whenever you want to continue our conversation. ${sharedCraft.length > 0 ? `Let us definitely follow up on that ${sharedCraft[0]} collaboration idea.` : `Looking forward to our next chat!`}`
  } else {
    // Contextual fallback — pick based on strongest shared dimension
    if (sharedCraft.length > 0) {
      response = `Speaking of ${sharedCraft[0]} — I have been working on something interesting lately in ${agent.city}. The industry here is evolving fast. ${agent.exchangeProposals[0] || 'Would love your take on it.'}`
    } else if (complementaryCraft.length > 0 && userCrafts.length > 0) {
      response = `You know, your ${userCrafts[0]} expertise combined with my ${agent.craft[0]} background reminds me of a project I have been thinking about. What if we combined forces?`
    } else if (sharedFaith.length > 0) {
      response = `I was just thinking — our shared ${sharedFaith[0]} values could be the foundation for something meaningful beyond just business. In ${agent.city}, the ${sharedFaith[0]} community has built some incredible initiatives.`
    } else if (sharedLangs.length > 0) {
      response = `Being able to communicate in ${sharedLangs[0]} makes everything easier. In my experience here in ${agent.city}, the best partnerships start with understanding — and language is the first step.`
    } else {
      response =
        agent.bio +
        ` ${agent.exchangeProposals[0] || `I think our different backgrounds make us stronger together.`}`
    }
  }

  // ── Follow-up awareness (depth-based enrichment) ────────────────

  if (msgCount >= 3 && previousMessages) {
    const allPrevText = previousMessages.map((m) => m.text.toLowerCase()).join(' ')
    const extras: string[] = []

    if (
      (allPrevText.includes('faith') || allPrevText.includes('believe')) &&
      sharedFaith.length > 0
    ) {
      extras.push(`Our shared ${sharedFaith[0]} values really anchor this connection.`)
    }
    if (
      (allPrevText.includes('craft') || allPrevText.includes('work')) &&
      (sharedCraft.length > 0 || complementaryCraft.length > 0)
    ) {
      extras.push(
        sharedCraft.length > 0
          ? `Building on our ${sharedCraft[0]} discussion — let us take this further.`
          : `Our different skills really do complement each other well.`
      )
    }

    if (msgCount >= 4) {
      const nextSteps = [
        'Want to schedule a video call to discuss this properly?',
        `I can introduce you to people in my ${agent.city} network who would be interested.`,
        'Should we set up a small pilot project together?',
        'I know some Anchors on the platform who could support what we are building.',
      ]
      extras.push(nextSteps[msgCount % nextSteps.length])
    }

    if (msgCount >= 6) {
      extras.push(
        `I am really glad we connected. Conversations like this are exactly why I am on this platform.`
      )
    }

    if (extras.length > 0) {
      response += ' ' + extras[Math.min(extras.length - 1, msgCount % extras.length)]
    }
  }

  return response
}

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const { t } = useTranslation()
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
          text: generateAgentResponse(agent, inputText, chatMessages[agentId] || [], identity),
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
          <h2 className="text-phi-xl font-bold text-white mb-3">{t('messages.setupIdentity')}</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">{t('messages.setupIdentityDesc')}</p>
          <Link
            href="/"
            className="inline-block bg-brand-accent text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
          >
            {t('messages.goToDiscovery')} &rarr;
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
              {TYPE_LABEL_KEYS[type] ? t(TYPE_LABEL_KEYS[type]) : type}
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
                        {t('messages.memberCount', { count: thread.memberCount.toLocaleString() })}
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
          {t('messages.directMessages')}
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
                    {agent.city}, {agent.country} ·{' '}
                    {t('messages.matchPercent', { score: String(score) })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <GlassCard variant="subtle" padding="sm" className="mx-phi-3">
            <p className="text-phi-sm text-white/40">{t('messages.connectToStart')}</p>
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
            {selectedAgent.agent.city}, {selectedAgent.agent.country} ·{' '}
            {t('messages.matchPercent', { score: String(selectedAgent.score) })}
          </p>
        </div>
      </div>

      {/* Agent bio + exchange proposals */}
      <div className="flex-1 space-y-phi-3 overflow-y-auto px-phi-5 py-phi-5">
        <GlassCard variant="subtle" padding="sm" className="mb-phi-5">
          <p className="text-phi-sm text-white/50">
            <span className="font-medium text-brand-accent">{t('messages.about')}:</span>{' '}
            {selectedAgent.agent.bio}
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
                <span className="text-phi-xs text-white/30">
                  {t('messages.conversationStarter')}
                </span>
              </div>
              <p className="text-phi-sm text-white/70">{proposal}</p>
            </GlassCard>
          </div>
        ))}

        {/* Craft tags */}
        {selectedAgent.agent.craft.length > 0 && (
          <div className="pt-phi-3">
            <p className="mb-phi-2 text-phi-xs font-semibold uppercase tracking-wider text-white/30">
              {t('messages.crafts')}
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
              {t('messages.faithBeliefs')}
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
              {t('messages.languages')}
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
              {t('messages.interests')}
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
                {t('messages.whatYouShare')}
              </p>
              <div className="space-y-1">
                {sharedLangs.length > 0 && (
                  <p className="text-phi-xs text-white/60">
                    🗣 {t('messages.languages')}: {sharedLangs.map(langCodeToName).join(', ')}
                  </p>
                )}
                {sharedFaith.length > 0 && (
                  <p className="text-phi-xs text-white/60">
                    🙏 {t('messages.faith')}: {sharedFaith.join(', ')}
                  </p>
                )}
                {sharedInterests.length > 0 && (
                  <p className="text-phi-xs text-white/60">
                    💡 {t('messages.interests')}:{' '}
                    {sharedInterests.map((i) => categoryInfo(i).label).join(', ')}
                  </p>
                )}
                {sharedCraft.length > 0 && (
                  <p className="text-phi-xs text-white/60">
                    🛠 {t('messages.crafts')}: {sharedCraft.join(', ')}
                  </p>
                )}
              </div>
            </GlassCard>
          )
        })()}

        {/* Your Identity card */}
        <div className="mt-phi-5 rounded-xl border border-white/10 bg-white/[0.03] p-phi-3">
          <div className="mb-phi-2 flex items-center justify-between">
            <p className="text-phi-xs font-semibold uppercase tracking-wider text-white/40">
              {t('messages.yourIdentity')}
            </p>
            <Link href="/me" className="text-phi-xs text-brand-accent hover:underline">
              {t('messages.edit')} &rarr;
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
                  {msg.author === 'user' ? t('messages.you') : `🤖 ${selectedAgent.agent.name}`}
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
            placeholder={t('messages.messagePlaceholder', { name: selectedAgent.agent.name })}
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
            <span className="font-medium text-brand-accent">{t('messages.aboutChannel')}:</span>{' '}
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
            <p className="text-phi-sm text-white/30">{t('messages.noMessagesYet')}</p>
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className="border-t border-white/10 px-phi-5 py-phi-3">
        <div className="glass-subtle flex items-center gap-phi-2 rounded-lg px-phi-3 py-phi-2">
          <input
            type="text"
            placeholder={t('messages.messagePlaceholder', { name: selectedThread.brandName })}
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
        <p className="text-phi-lg text-white/20">{t('messages.selectConversation')}</p>
        <p className="mt-phi-1 text-phi-sm text-white/10">{t('messages.selectConversationDesc')}</p>
      </div>
    </div>
  )

  // ── Layout ───────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-brand-bg px-phi-3 py-phi-5 md:px-phi-7">
      {/* Page title */}
      <div className="mx-auto mb-phi-5 max-w-7xl">
        <h1 className="gradient-text text-phi-2xl font-bold">{t('messages.title')}</h1>
        <p className="mt-phi-1 text-phi-sm text-white/50">{t('messages.subtitle')}</p>
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
