/**
 * Mock Messages Data — single source of truth
 *
 * Used by: messages page (channel messages)
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MockMessage {
  id: string
  author: string
  avatar: string
  text: string
  time: string
}

// ─── Channel Messages ───────────────────────────────────────────────────────

export const MOCK_CHANNEL_MESSAGES: Record<string, MockMessage[]> = {
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
