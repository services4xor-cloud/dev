# Human Exchange Network — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Be[Country] from a job-board-style platform into a human exchange network with 5 core routes: Landing+Discovery, My World (network graph), Exchange (smart feed), Messages, and Me (unified profile with Explorer/Host toggle).

**Architecture:** Extend `identity-context.tsx` with languages/interests/mode. Build 3-step Discovery flow on `/`. Create network graph on `/world`, unified feed on `/exchange`, merged dashboard on `/me`. Update Nav/Footer to 4-item logged-in nav. Reuse all existing data (16 countries, 14 languages, 140 skills, matching engine). Delete old routes in final phase.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS + existing premium design system (glass, phi, ambient), SVG for network graph (no new deps), existing matching engine.

---

## Phase 1: Foundation (Data Layer + Navigation)

### Task 1: Extend Identity Context with languages, interests, mode

**Files:**

- Modify: `lib/identity-context.tsx`

**Step 1: Extend the Identity interface**

Add `languages`, `interests`, and `mode` fields to the existing Identity interface:

```typescript
interface Identity {
  country: string
  language: string // display language (existing)
  threadSlug?: string
  threadType?: string
  threadBrandName?: string
  // NEW fields for Human Exchange Network
  city?: string
  languages: string[] // languages the user SPEAKS (not display lang)
  interests: string[] // category IDs from EXCHANGE_CATEGORIES
  mode: 'explorer' | 'host' // Explorer ↔ Host toggle
}
```

Update the default state in `IdentityProvider`:

```typescript
const [identity, setIdentity] = useState<Identity>({
  country: DEFAULT_COUNTRY,
  language: DEFAULT_LANGUAGE,
  languages: [],
  interests: [],
  mode: 'explorer',
})
```

Add new setters to context value:

```typescript
setLanguages: (langs: string[]) => void
setInterests: (interests: string[]) => void
setMode: (mode: 'explorer' | 'host') => void
setCity: (city: string) => void
hasCompletedDiscovery: boolean // true when languages.length > 0 && interests.length > 0
```

Ensure localStorage migration handles old format (no languages/interests fields — default to empty arrays).

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors (existing consumers don't use the new fields yet)

**Step 3: Commit**

```bash
git add lib/identity-context.tsx
git commit -m "feat: extend identity context with languages, interests, mode for Human Exchange Network"
```

---

### Task 2: Create Exchange Categories data

**Files:**

- Create: `lib/exchange-categories.ts`

**Step 1: Create category definitions**

These are the visual grid categories for Discovery step 2 and Exchange filters. Derived from existing `PATH_CATEGORIES` in vocabulary.ts but broader:

```typescript
export interface ExchangeCategory {
  id: string
  label: string
  icon: string
  description: string
  /** i18n key for label */
  i18nKey: string
}

export const EXCHANGE_CATEGORIES: ExchangeCategory[] = [
  {
    id: 'culture',
    label: 'Culture & Language',
    icon: '🌍',
    description: 'Cultural exchange, language teaching, traditions',
    i18nKey: 'category.culture',
  },
  {
    id: 'tech',
    label: 'Technology',
    icon: '💻',
    description: 'Software, hardware, engineering, AI',
    i18nKey: 'category.tech',
  },
  {
    id: 'safari',
    label: 'Safari & Wildlife',
    icon: '🦁',
    description: 'Game drives, conservation, eco-tourism',
    i18nKey: 'category.safari',
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    icon: '❤️',
    description: 'Healthcare, fitness, mental health, nutrition',
    i18nKey: 'category.health',
  },
  {
    id: 'fashion',
    label: 'Art & Fashion',
    icon: '🎨',
    description: 'Design, clothing, craft, beauty',
    i18nKey: 'category.fashion',
  },
  {
    id: 'media',
    label: 'Media & Content',
    icon: '📱',
    description: 'Photography, video, social media, music',
    i18nKey: 'category.media',
  },
  {
    id: 'trade',
    label: 'Trade & Investment',
    icon: '💰',
    description: 'Business, gold, agriculture, import/export',
    i18nKey: 'category.trade',
  },
  {
    id: 'education',
    label: 'Education',
    icon: '📚',
    description: 'Teaching, mentorship, courses, skills training',
    i18nKey: 'category.education',
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, restaurants, travel, tourism',
    i18nKey: 'category.hospitality',
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    icon: '🌿',
    description: 'Farming, livestock, agritech, food',
    i18nKey: 'category.agriculture',
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: '🔧',
    description: 'Construction, mechanics, energy, mining',
    i18nKey: 'category.engineering',
  },
  {
    id: 'community',
    label: 'Community',
    icon: '🤝',
    description: 'NGOs, charity, volunteering, social impact',
    i18nKey: 'category.community',
  },
]
```

**Step 2: Commit**

```bash
git add lib/exchange-categories.ts
git commit -m "feat: add exchange categories for Discovery and Exchange filters"
```

---

### Task 3: Update Nav + Footer for new architecture

**Files:**

- Modify: `lib/nav-structure.ts`
- Modify: `components/Nav.tsx`
- Modify: `components/Footer.tsx`

**Step 1: Rewrite nav-structure.ts**

Replace current 6 link groups with 2 states:

```typescript
// Logged out nav
export const PUBLIC_NAV_LINKS: NavLink[] = [
  { href: '/about', label: 'About', icon: Info, aria: 'About the platform' },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, aria: 'Pricing plans' },
]

// Logged in nav (4 core routes)
export const MAIN_NAV_LINKS: NavLink[] = [
  { href: '/world', label: 'My World', icon: Globe, aria: 'Your network graph' },
  { href: '/exchange', label: 'Exchange', icon: Map, aria: 'Browse people and opportunities' },
  { href: '/messages', label: 'Messages', icon: Send, aria: 'Your conversations' },
  { href: '/me', label: 'Me', icon: Users, aria: 'Your profile and settings' },
]

// Simplified footer
export const FOOTER_LINKS: FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/charity', label: 'Community' },
  { href: '/business', label: 'Business' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
]
```

Keep existing exports as deprecated aliases so nothing breaks immediately. Delete them in Phase 3.

**Step 2: Update Nav.tsx**

- Import `PUBLIC_NAV_LINKS` and `MAIN_NAV_LINKS`
- Use identity context `hasCompletedDiscovery` to determine which nav to show
- Logged out: logo + public links + [Log in] + [Begin →] CTA
- Logged in / discovered: logo + 4 main links + avatar/menu
- Remove all pioneer/anchor/agent dropdown sections
- Keep glass-strong scroll behavior and mobile menu

**Step 3: Update Footer.tsx**

- Import `FOOTER_LINKS`
- Single row of links (no column sections like "For Pioneers" / "For Anchors")
- Keep social links and copyright
- Remove "For Pioneers", "For Anchors", "Discover", "Company" column structure

**Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: may have errors from pages that import old nav exports — that's OK, we'll fix in Phase 3

**Step 5: Commit**

```bash
git add lib/nav-structure.ts components/Nav.tsx components/Footer.tsx
git commit -m "feat: new nav (4-item logged-in, public logged-out) + simplified footer"
```

---

## Phase 2: Core Pages

### Task 4: New Landing Page — The Wow + Discovery

**Files:**

- Rewrite: `app/page.tsx`
- Create: `components/Discovery.tsx`
- Create: `components/WowHero.tsx`

This is the biggest and most important task. The homepage becomes:

1. **WowHero**: Dark screen, gold dot (your location), connection lines pulse, "You are here. The world is connected to you." → "Tell us who you are" CTA
2. **Discovery**: 3-step interactive flow (location+languages → interests → your network appears)

**Step 1: Create WowHero component**

`components/WowHero.tsx` — The 30-second emotional hook.

- Full viewport height, dark bg
- SVG with animated dots + lines representing global connections
- Auto-detected city/country displayed as glowing gold dot
- Text reveals: "You are here." → "The world is connected to you."
- CTA: "Tell us who you are" → triggers Discovery
- CSS-only animations (no JS animation libs)
- Use existing `detectCountryFromTimezone()` from `lib/geo.ts`
- Use existing `COUNTRY_OPTIONS` from `lib/country-selector.ts` for dot positions

**Step 2: Create Discovery component**

`components/Discovery.tsx` — The 3-step identity builder.

- Step 1: Location + Languages
  - Show auto-detected location (country + city if available)
  - "Change" button to override
  - Language grid: pull from `LANGUAGE_REGISTRY` in `lib/country-selector.ts`
  - Tap to select, show live feedback: "{count} people speak {language}"
  - Visual: mini dots appear on a small map preview as languages are selected

- Step 2: What Matters
  - Visual grid of `EXCHANGE_CATEGORIES` (from Task 2)
  - Pick 3-5 (minimum 1)
  - Live feedback: "{N} matches found"
  - Use matching engine to count real matches from mock data

- Step 3: Your Network Appears
  - Simple animated reveal of network graph preview
  - YOU at center, matched nodes around you
  - "This is your world. Explore it." → [Enter My World]
  - Saves identity to context (localStorage persisted)
  - Redirects to `/world`

- State: managed locally in Discovery, committed to identity context on completion.

**Step 3: Rewrite app/page.tsx**

```tsx
'use client'
import { useIdentity } from '@/lib/identity-context'
import WowHero from '@/components/WowHero'
import Discovery from '@/components/Discovery'
import { useState } from 'react'

export default function HomePage() {
  const { identity } = useIdentity()
  const [showDiscovery, setShowDiscovery] = useState(false)

  // If user already completed discovery, redirect to /world
  // (or show a simplified landing with "Enter My World" CTA)

  return (
    <main>
      {!showDiscovery ? <WowHero onBegin={() => setShowDiscovery(true)} /> : <Discovery />}
    </main>
  )
}
```

Keep it simple. The old homepage content (pillars, testimonials, payment badges) gets removed.

**Step 4: Run typecheck + dev server**

Run: `npx tsc --noEmit`
Run: `npm run dev` — verify `/` loads with WowHero

**Step 5: Commit**

```bash
git add app/page.tsx components/WowHero.tsx components/Discovery.tsx
git commit -m "feat: new landing page — WowHero + 3-step Discovery flow"
```

---

### Task 5: My World page — Network Graph

**Files:**

- Create: `app/world/page.tsx`
- Create: `components/NetworkGraph.tsx`
- Create: `lib/graph.ts`

**Step 1: Create graph data preparation**

`lib/graph.ts` — Transforms identity + mock data into graph nodes/edges.

```typescript
export interface GraphNode {
  id: string
  type: 'you' | 'person' | 'opportunity' | 'community'
  label: string
  sublabel: string
  icon: string
  score: number // 0-100 match score
  x: number // calculated position
  y: number // calculated position
  ring: number // 0=center(you), 1=inner, 2=mid, 3=outer
}

export interface GraphEdge {
  from: string
  to: string
  type: 'language' | 'skill' | 'location'
  strength: number // 0-1
}

export function buildGraph(identity: Identity): { nodes: GraphNode[]; edges: GraphEdge[] }
```

- Pull from `MOCK_VENTURE_PATHS`, `MOCK_RECENT_PIONEERS`, `MOCK_THREADS`
- Use `scorePioneerPath()` from matching.ts for opportunity scoring
- Use language overlap for person connections
- Use thread type for community nodes
- Position: concentric rings (you=center, high-match=inner, lower=outer)

**Step 2: Create NetworkGraph component**

`components/NetworkGraph.tsx` — SVG-based graph visualization.

- SVG canvas, responsive (fills container)
- Concentric circle layout (not force-directed — simpler, faster, mobile-friendly)
- Gold center dot = YOU
- Colored nodes by type (gold=person, maroon=opportunity, green=community)
- Lines connecting nodes with shared attributes
- Click node → fires callback with node data
- Filter bar at top: [All] [People] [Opportunities] [Communities]
- Mobile: smaller nodes, tap to select
- Uses glass-subtle background, premium design system

**Step 3: Create world page**

`app/world/page.tsx`:

- If user hasn't completed Discovery → redirect to `/`
- Show NetworkGraph full-width
- Side panel (or bottom sheet on mobile) for node details when clicked
- Panel shows: name, location, match score, shared languages/skills, [Connect] or [View] button

**Step 4: Typecheck + verify**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 5: Commit**

```bash
git add app/world/page.tsx components/NetworkGraph.tsx lib/graph.ts
git commit -m "feat: /world page with SVG network graph visualization"
```

---

### Task 6: Exchange page — Smart Feed

**Files:**

- Create: `app/exchange/page.tsx`
- Create: `app/exchange/[id]/page.tsx`
- Create: `components/ExchangeCard.tsx`

**Step 1: Create ExchangeCard component**

Two variants: PersonCard and OpportunityCard, unified as `ExchangeCard`.

```typescript
interface ExchangeCardProps {
  type: 'person' | 'opportunity'
  data: {
    id: string
    title: string // name or opportunity title
    subtitle: string // location or posted by
    flag: string
    languages: string[]
    skills: string[]
    matchScore: number
    mode?: 'explorer' | 'host'
    salary?: string
    sector?: string
    sectorIcon?: string
  }
  sharedLanguages: string[] // highlighted
  sharedSkills: string[] // highlighted
}
```

- Uses GlassCard from existing design system
- Shows match score as percentage badge
- Shared languages/skills highlighted in accent color
- [Connect] for people, [View]/[Apply] for opportunities
- Hover effects, phi typography

**Step 2: Create Exchange page**

`app/exchange/page.tsx`:

- If user hasn't completed Discovery → redirect to `/`
- Filter bar: Sector, Location, Language, Type (People/Opportunities/Both)
- Feed: sorted by match score (highest first)
- Uses `rankPathsForPioneer()` from matching.ts + extended language/interest matching
- Pulls from mock data: MOCK_VENTURE_PATHS + MOCK_RECENT_PIONEERS
- Infinite-scroll-style layout (load more on scroll)

**Step 3: Create Exchange detail page**

`app/exchange/[id]/page.tsx`:

- Person detail: full profile, languages, skills, location, mode, [Connect] button
- Opportunity detail: full description, requirements, salary, location, [Apply/Book] button
- Replaces old `/experiences/[id]` and venture detail views

**Step 4: Typecheck + commit**

```bash
git add app/exchange/ components/ExchangeCard.tsx
git commit -m "feat: /exchange page with smart feed + detail view"
```

---

### Task 7: Me page — Unified Dashboard

**Files:**

- Create: `app/me/page.tsx`
- Create: `components/ModeToggle.tsx`

**Step 1: Create ModeToggle component**

Simple Explorer ↔ Host toggle. Prominent, pill-shaped.

```typescript
interface ModeToggleProps {
  mode: 'explorer' | 'host'
  onChange: (mode: 'explorer' | 'host') => void
}
```

- Glass background, gold accent on active side
- Smooth slide animation
- Updates identity context

**Step 2: Create Me page**

`app/me/page.tsx`:

- If user hasn't completed Discovery → redirect to `/`
- Header: avatar/initials, name, location, flag, language badges, match count
- ModeToggle prominently placed

- **Explorer mode tabs:**
  - Dashboard: stats (connections, matches, active exchanges) using StatCard
  - Saved: bookmarked items
  - Exchanges: active conversations/applications (from MOCK_CHAPTERS data)
  - Referrals: referral stats (from existing referral data)

- **Host mode tabs:**
  - Dashboard: stats (views, requests, earnings)
  - Offerings: user's posted opportunities (from MOCK_PATHS data)
  - Requests: incoming applications
  - Earnings: revenue tracking

- **Shared tabs (both modes):**
  - Profile: edit identity (location, languages, skills, interests, bio)
  - Settings: notifications, payment methods, account

- Reuse data from existing mocks (MOCK_CURRENT_PIONEER, MOCK_ANCHOR, MOCK_CHAPTERS, etc.)

**Step 3: Typecheck + commit**

```bash
git add app/me/page.tsx components/ModeToggle.tsx
git commit -m "feat: /me page with Explorer/Host toggle, unified dashboard"
```

---

### Task 8: Messages page

**Files:**

- Create: `app/messages/page.tsx`

**Step 1: Create Messages page**

- If user hasn't completed Discovery → redirect to `/`
- Left sidebar: channel list
  - Community channels: from MOCK_THREADS data (BeKenya, BeMaasai, BeSwahili, etc.)
  - Direct messages: placeholder (empty state + "Connect with someone on Exchange")
- Right panel: selected channel content
  - Community: thread description + sample posts
  - Direct: message thread (placeholder)

- Simple, clean, uses GlassCard + existing design system
- This is a placeholder — real messaging comes when DB is connected

**Step 2: Typecheck + commit**

```bash
git add app/messages/page.tsx
git commit -m "feat: /messages page with community channels + DM placeholder"
```

---

## Phase 3: Cleanup + Polish

### Task 9: Update vocabulary.ts

**Files:**

- Modify: `lib/vocabulary.ts`

**Step 1: Update VOCAB object**

Add new terms alongside old ones (don't break existing references yet):

```typescript
export const VOCAB = {
  // Legacy (keep for backward compat during migration)
  pioneer: { singular: 'Pioneer', plural: 'Pioneers', verb: 'pioneering' },
  anchor: { singular: 'Anchor', plural: 'Anchors', verb: 'anchoring' },
  path: { singular: 'Path', plural: 'Paths', verb: 'path opening' },
  chapter: { singular: 'Chapter', plural: 'Chapters', verb: 'opening a chapter' },
  venture: { singular: 'Venture', plural: 'Ventures', verb: 'venturing' },
  gate: { singular: 'Gate', plural: 'Gates', verb: 'entering' },
  route: { singular: 'Route', plural: 'Routes', verb: 'routing' },
  compass: { singular: 'Compass', plural: 'Compasses', verb: 'navigating' },
  // New Human Exchange Network vocabulary
  explorer: { singular: 'Explorer', plural: 'Explorers', verb: 'exploring' },
  host: { singular: 'Host', plural: 'Hosts', verb: 'hosting' },
  opportunity: { singular: 'Opportunity', plural: 'Opportunities', verb: 'offering' },
  exchange: { singular: 'Exchange', plural: 'Exchanges', verb: 'exchanging' },
  experience: { singular: 'Experience', plural: 'Experiences', verb: 'experiencing' },
  discovery: { singular: 'Discovery', plural: 'Discoveries', verb: 'discovering' },
  hub: { singular: 'Hub', plural: 'Hubs', verb: 'connecting' },
  corridor: { singular: 'Corridor', plural: 'Corridors', verb: 'routing' },
  // Updated CTAs
  network_name: 'The BeNetwork',
  tagline: 'You are here. The world is connected to you.',
  explorer_cta: 'Explore',
  host_cta: 'Create Offering',
  connect_cta: 'Connect',
  discover_cta: 'Tell us who you are',
} as const
```

**Step 2: Commit**

```bash
git add lib/vocabulary.ts
git commit -m "feat: add Human Exchange Network vocabulary alongside legacy terms"
```

---

### Task 10: Redirect old routes + delete old pages

**Files:**

- Create: `app/compass/page.tsx` (redirect)
- Create: `app/onboarding/page.tsx` (redirect)
- Create: `app/ventures/page.tsx` (redirect)
- Create: `app/offerings/page.tsx` (redirect)
- Create: `app/pioneers/dashboard/page.tsx` (redirect)
- Create: `app/anchors/dashboard/page.tsx` (redirect)
- Create: `app/profile/page.tsx` (redirect)
- Create: `app/threads/page.tsx` (redirect)
- Delete: `app/agents/` (entire directory)
- Delete: `app/fashion/page.tsx` (content lives in /exchange?sector=fashion)
- Delete: `app/media/page.tsx` (content lives in /exchange?sector=media)
- Delete: `app/referral/page.tsx` (feature lives in /me)

**Step 1: Create redirect pages**

Each old route becomes a simple redirect:

```tsx
// app/compass/page.tsx
import { redirect } from 'next/navigation'
export default function CompassRedirect() {
  redirect('/')
}
```

Same pattern for: onboarding→/, ventures→/exchange, offerings→/exchange, pioneers/dashboard→/me, anchors/dashboard→/me, profile→/me, threads→/messages.

**Step 2: Delete removed pages**

```bash
rm -rf app/agents app/fashion app/media app/referral
rm -rf app/anchors/post-path
rm -rf app/pioneers/notifications
rm -rf app/signup app/forgot-password
```

Note: `/signup` merges into Discovery. `/forgot-password` merges into `/login`.

**Step 3: Run typecheck + tests**

Run: `npx tsc --noEmit`
Run: `npm run test`
Fix any broken imports/references.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: redirect old routes to new architecture, delete removed pages"
```

---

### Task 11: Update info pages (about, pricing, charity, business, contact, privacy)

**Files:**

- Modify: `app/about/page.tsx`
- Modify: `app/pricing/page.tsx`
- Modify: `app/charity/page.tsx`
- Modify: `app/business/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/privacy/page.tsx`

**Step 1: Update language**

For each page:

- Replace "Pioneer" language with "Explorer" where user-facing
- Replace "Anchor" with "Host" where user-facing
- Replace "Path" with "Opportunity" where user-facing
- Replace "Chapter" with "Exchange" where user-facing
- Update CTAs to point to new routes (/exchange, /me, /)
- Remove references to /compass, /ventures, /onboarding
- Keep all existing content structure and premium design system

**Step 2: Typecheck + commit**

```bash
git add app/about/page.tsx app/pricing/page.tsx app/charity/page.tsx app/business/page.tsx app/contact/page.tsx app/privacy/page.tsx
git commit -m "style: update info pages with Human Exchange Network vocabulary"
```

---

### Task 12: Update country hubs (be/[country])

**Files:**

- Modify: `app/be/[country]/page.tsx`

**Step 1: Adapt to new architecture**

- Update CTAs: "Start Compass" → "Discover" (links to /), "Browse Ventures" → "Exchange" (links to /exchange)
- Replace Pioneer/Anchor language with Explorer/Host
- Keep all country-specific content (sectors, stats, impact partner)
- Add "Begin Discovery" CTA if user hasn't completed it

**Step 2: Commit**

```bash
git add "app/be/[country]/page.tsx"
git commit -m "feat: adapt country hubs to Human Exchange Network architecture"
```

---

### Task 13: Update login page

**Files:**

- Modify: `app/login/page.tsx`

**Step 1: Simplify login**

- Keep Google OAuth + email/password
- Add "Forgot password?" inline (expand section, not separate page)
- After login: redirect to `/world` if Discovery complete, otherwise `/`
- Remove references to Pioneer/Anchor roles on login

**Step 2: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat: simplified login with inline forgot-password"
```

---

### Task 14: Final verification + docs update

**Step 1: Full build**

Run: `npm run build`
Expected: 0 errors

**Step 2: Run all tests**

Run: `npm run test`
Expected: Some tests may fail (references to deleted pages). Fix or delete stale tests.

**Step 3: Update PROGRESS.md**

Add session entry documenting the Human Exchange Network redesign.

**Step 4: Update CLAUDE.md**

Update vocabulary table, repo map, and session workflow to reflect new architecture.

**Step 5: Commit + push**

```bash
git add -A
git commit -m "docs: update PROGRESS.md + CLAUDE.md for Human Exchange Network redesign"
git push
```

---

## Execution Notes

- **Phase 1 (Tasks 1-3):** Foundation. Must be solid before Phase 2.
- **Phase 2 (Tasks 4-8):** Core pages. Task 4 (Landing) is the most complex. Tasks 5-8 can run in parallel after Task 4.
- **Phase 3 (Tasks 9-14):** Cleanup. Can run mostly in parallel.
- **Total:** 14 tasks. Phase 1: ~30 min. Phase 2: ~2 hours. Phase 3: ~1 hour.
- **Key risk:** Network graph (Task 5) is the most technically novel piece. Start with concentric circles, iterate to force-directed later.
- **All mock data stays.** No new backend work. The redesign is purely frontend architecture + UX.
