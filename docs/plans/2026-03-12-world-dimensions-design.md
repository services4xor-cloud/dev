# World Dimensions — Design Document

> **Date:** 2026-03-12
> **Status:** Approved
> **Scope:** Expand BeNetwork to all 193 countries, all languages, 8 identity dimensions, AI-powered agent network, restore pre-rework features

---

## 1. Vision

BeNetwork becomes a **living global network from day one**. Every country, every language, every faith, every craft has active AI agents that interact, propose exchanges, and populate the platform. When real humans join, they enter an already-vibrant world where connections are immediate.

No mock data. No empty states. The AI agents ARE the network — 193 countries, each with multiple personas spanning diverse crafts, faiths, languages, and cultures.

---

## 2. The 8 Identity Dimensions

Every person (human or AI agent) has up to 8 dimensions that filter and score all connections:

| #   | Dimension     | Weight | Type                     | Source                   |
| --- | ------------- | ------ | ------------------------ | ------------------------ |
| 1   | **Location**  | 10 pts | country + city           | User-declared            |
| 2   | **Languages** | 20 pts | spoken languages         | User-declared            |
| 3   | **Faith**     | 8 pts  | spiritual/philosophical  | User-declared (optional) |
| 4   | **Craft**     | 15 pts | skills/profession        | User-declared            |
| 5   | **Passion**   | 15 pts | interests/sectors        | User-declared            |
| 6   | **Reach**     | 7 pts  | mobility/capability      | User-declared            |
| 7   | **Culture**   | 5 pts  | ethnic/cultural identity | User-declared (optional) |
| 8   | **Market**    | 20 pts | real-world sector demand | Platform-pushed          |

**Total: 100 points.** Language and Market are weighted highest because they create the strongest bonds and the most actionable opportunities.

### Scoring Principles

- **Complementary > Mirror:** In Craft, a software engineer + designer scores higher than two software engineers. Exchange over echo.
- **Additive Layers:** Each dimension is a filter layer. Where layers overlap = strongest connections. Different layers still have value.
- **Market is Platform-Pushed:** Not user-declared. Real economic signals that create urgency and drive commission-generating exchanges.
- **Faith & Culture are Optional:** Never forced, never penalized for skipping. When present, they create community bonds.

---

## 3. World Dataset — All Countries & Languages

### Countries (193 UN member states)

New file: `lib/world-data.ts`

```typescript
interface WorldCountry {
  code: string        // ISO 3166-1 alpha-2
  name: string        // English name
  region: string      // Africa, Europe, Asia, Americas, Oceania
  subregion: string   // East Africa, Western Europe, etc.
  lat: number
  lng: number
  languages: string[] // Primary language codes
  faiths: string[]    // Predominant faiths
  currency: string    // ISO 4217
}

export const WORLD_COUNTRIES: Record<string, WorldCountry> = { ... }
// All 193 countries, statically defined
```

### Languages (~70 most spoken)

```typescript
interface WorldLanguage {
  code: string        // ISO 639-1
  name: string        // English name
  nativeName: string  // Self-name (e.g., Deutsch, Kiswahili)
  script: 'ltr' | 'rtl'
  speakers: number    // Approximate millions
  countries: string[] // Where widely spoken
}

export const WORLD_LANGUAGES: Record<string, WorldLanguage> = { ... }
// ~70 languages covering 95%+ of world population
```

### Endonyms via Intl API

Replace hand-curated endonyms with browser-native `Intl.DisplayNames`:

```typescript
export function getCountryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}
```

Zero maintenance. Works for every language/country combination natively.

---

## 4. Extended Identity Interface

```typescript
interface Identity {
  // Existing (keep)
  country: string
  language: string // display language
  city?: string
  languages: string[] // spoken languages
  interests: string[] // exchange category IDs (= Passion dimension)
  mode: 'explorer' | 'host'

  // New dimensions
  faith?: string // 'islam' | 'christianity' | 'secular' | 'buddhism' | 'hinduism' | 'judaism' | 'traditional' | 'other'
  craft: string[] // profession/skill tags (free-text + autocomplete)
  reach: string[] // 'can-travel' | 'can-host' | 'can-invest' | 'digital-only' | 'can-mentor' | 'can-relocate'
  culture?: string // optional ethnic/cultural identity
}
```

`hasCompletedDiscovery` updates: requires `languages.length > 0 && interests.length > 0 && craft.length > 0`.

---

## 5. Dimension Registries

### Faith Options

```
islam, christianity, secular, hinduism, buddhism, judaism, traditional, other
```

Displayed with respectful icons. Single-select. Optional — "Other / Prefer not to say" is always available.

### Craft Suggestions (~50 curated, free-text allowed)

Categories: Tech, Business, Creative, Trades, Health, Education, Nature, Service. Users get autocomplete from suggestions but can type anything.

### Reach Options (multi-select)

```
can-travel, can-host, can-invest, digital-only, can-mentor, can-relocate
```

### Culture

Free-text with country-aware suggestions (e.g., Kenya suggests "Maasai", "Kikuyu", "Luo"; Nigeria suggests "Yoruba", "Igbo", "Hausa"). Entirely optional.

---

## 6. Market Data (Platform-Pushed)

New file: `lib/market-data.ts`

```typescript
interface MarketSignal {
  id: string
  sector: string // Maps to exchange category
  region: string // Country code or region
  signal: 'growing' | 'stable' | 'emerging' | 'urgent'
  title: string
  description: string
  demandCrafts: string[] // Crafts in demand
  opportunityScore: number // 0-100
}
```

Seeded with ~30 real-world market signals:

- Safari tourism in East Africa (growing)
- German-Kenyan tech corridor (emerging)
- Gulf investment in African agriculture (growing)
- Nigerian fintech expansion (urgent)
- Fashion design in West Africa (growing)
- Healthcare workers needed in Gulf states (urgent)
- etc.

These signals boost matching scores and create "trending" badges in the /exchange feed.

---

## 7. AI Agent Network (No Mock Data)

### Architecture

Every AI agent is a full-dimensional persona:

```typescript
interface AgentPersona {
  id: string
  type: 'ai' // Distinguishes from 'human'
  name: string
  avatar: string // Emoji or generated avatar
  // All 8 dimensions
  country: string
  city: string
  languages: string[]
  faith?: string
  craft: string[]
  interests: string[] // Passion
  reach: string[]
  culture?: string
  // Behavioral
  bio: string
  exchangeProposals: string[] // What they offer/seek
  responseStyle: string // Personality template
}
```

New file: `lib/agents.ts` — generates agent personas programmatically for all 193 countries. Not static mock data — a generation function that produces diverse, realistic personas based on country demographics:

```typescript
function generateAgentsForCountry(countryCode: string): AgentPersona[]
// Uses WORLD_COUNTRIES data to pick appropriate languages, faiths, crafts
// Produces 3-10 agents per country based on population/relevance
// Total: ~500-1000 active agents across the network
```

### Behavior

- Appear in /world graph and /exchange feed like real people
- Respond to messages (with 🤖 badge)
- Make exchange proposals ("I'm a safari guide in Nairobi, looking for tech mentorship")
- Can be filtered out ("show humans only")

### Human Premium

- Real humans get a ✨ badge and "Real Connection" label
- Human-to-human match scores get +10 bonus
- Referral system rewards bringing real humans into the network

---

## 8. Restored Features

### Referral System (/referral)

Restore the referral page with:

- KES 5,000 referral bonus messaging (adapted per country currency)
- Referral link copy/share (WhatsApp, Twitter, email)
- 4-step "How it works" visualization
- Stats grid (people referred, bonus earned, status)
- **New:** "Real humans are premium" messaging — referrals bring real people into the AI-populated network, giving both parties higher match priority

### Media Section (/media)

Restore as an exchange category landing:

- Creator paths: Video/Documentary, Photography, Content Writing, Music & Audio
- Featured projects from AI agents + market signals
- 9 social platforms integration
- Adapted to use exchange vocabulary (not old Path/Anchor terms)

### Fashion Section (/fashion)

Restore as an exchange category landing:

- Model, Designer, Creative paths
- Pioneer Protections section (Contracts First, Pioneer Sets Rates, Chaperone Service, All Work Compensated)
- Partner connections from AI agents
- Adapted to exchange vocabulary

### Rich Footer

Restore multi-column footer layout:

```
┌─────────────────────────────────────────────────────────┐
│ The BeNetwork                                           │
│ You are here. The world is connected to you.            │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Explore      │ Connect      │ Community    │ Company    │
│ My World     │ Exchange     │ Charity      │ About      │
│ Messages     │ Media        │ Referral     │ Pricing    │
│ Me           │ Fashion      │ Contact      │ Business   │
│              │              │              │ Privacy    │
├──────────────┴──────────────┴──────────────┴────────────┤
│ 📸 Instagram  👥 Facebook  🎵 TikTok                    │
│ © 2026 Be[Network] Inc. Built for dignity, everywhere.  │
└─────────────────────────────────────────────────────────┘
```

Four columns: Explore (app routes), Connect (exchange categories), Community (social/charity), Company (corporate).

---

## 9. Updated Discovery Flow (5 Steps)

From 3 steps to 5, still fast (each step is one selection):

1. **Where & How** — Country (auto-detected) + City (text) + Languages (multi-select, ~70 options)
2. **What You Do** — Craft tags (autocomplete from suggestions, free-text allowed, pick 1-5)
3. **What Drives You** — Passion/Interests (category grid, pick 1-5) + Reach (multi-select checkboxes)
4. **Who You Are** _(skippable)_ — Faith (single select) + Culture (free text)
5. **Your Network** — Animated 8-dimension score preview, instant connections shown, redirect to /world

Steps 1-3 required. Step 4 skippable. Step 5 is the payoff.

---

## 10. 8-Dimension Matching Engine

New file: `lib/dimension-scoring.ts`

```typescript
interface DimensionProfile {
  country: string
  city?: string
  languages: string[]
  faith?: string
  craft: string[]
  interests: string[] // Passion
  reach: string[]
  culture?: string
  isHuman: boolean
}

interface DimensionScore {
  total: number // 0-100
  breakdown: {
    language: number // 0-20
    market: number // 0-20
    craft: number // 0-15
    passion: number // 0-15
    location: number // 0-10
    faith: number // 0-8
    reach: number // 0-7
    culture: number // 0-5
  }
  humanBonus: number // +10 if both are human
  label: 'Perfect' | 'Strong' | 'Good' | 'Possible'
  highlights: string[] // Why this match works
}

function scoreDimensions(
  me: DimensionProfile,
  them: DimensionProfile,
  market: MarketSignal[]
): DimensionScore
```

### Craft Complementary Scoring

```typescript
function craftScore(myCrafts: string[], theirCrafts: string[]): number {
  const shared = intersection(myCrafts, theirCrafts)
  const complementary = difference(theirCrafts, myCrafts)
  // Complementary skills worth more than mirror
  return Math.min(15, shared.length * 2 + complementary.length * 4)
}
```

### Reach Compatibility

```typescript
function reachScore(myReach: string[], theirReach: string[]): number {
  // can-travel + can-host = high
  // can-invest + can-mentor = high
  // digital-only + digital-only = medium
  const compatPairs = [
    ['can-travel', 'can-host'],
    ['can-invest', 'can-mentor'],
    ['can-relocate', 'can-host'],
  ]
  // Score based on compatible pairs found
}
```

---

## 11. Updated Page Architecture

| Route            | Changes                                                    |
| ---------------- | ---------------------------------------------------------- |
| `/`              | Discovery flow grows from 3 to 5 steps                     |
| `/world`         | Graph uses 8-dimension scoring, shows AI agents + humans   |
| `/exchange`      | Feed uses 8-dimension scoring, market badges, AI agents    |
| `/exchange/[id]` | Detail shows full 8-dimension profile                      |
| `/messages`      | AI agent messaging with 🤖 badge, human ✨ badge           |
| `/me`            | Profile shows/edits all 8 dimensions, Reach toggles        |
| `/referral`      | **RESTORE** — referral system with human premium messaging |
| `/media`         | **RESTORE** — creator exchange category landing            |
| `/fashion`       | **RESTORE** — fashion exchange category landing            |
| `/about`         | Keep rich (already preserved)                              |
| `/pricing`       | Keep rich (already preserved)                              |
| `/charity`       | Keep rich (already preserved)                              |
| `/business`      | Keep rich (already preserved)                              |
| `/contact`       | Keep rich (already preserved)                              |
| `/privacy`       | Keep (already preserved)                                   |

---

## 12. File Impact Summary

### New Files

| File                                      | Purpose                              |
| ----------------------------------------- | ------------------------------------ |
| `lib/world-data.ts`                       | 193 countries + ~70 languages        |
| `lib/dimensions.ts`                       | Faith/Craft/Reach/Culture registries |
| `lib/market-data.ts`                      | Platform-pushed market signals       |
| `lib/dimension-scoring.ts`                | 8-dimension matching engine          |
| `lib/agents.ts`                           | AI agent persona generation          |
| `app/referral/page.tsx`                   | Restored referral page               |
| `app/media/page.tsx`                      | Restored media exchange landing      |
| `app/fashion/page.tsx`                    | Restored fashion exchange landing    |
| `__tests__/lib/dimension-scoring.test.ts` | Scoring engine tests                 |
| `__tests__/lib/world-data.test.ts`        | World data validation                |
| `__tests__/lib/agents.test.ts`            | Agent generation tests               |

### Modified Files

| File                       | Changes                              |
| -------------------------- | ------------------------------------ |
| `lib/identity-context.tsx` | Add faith, craft, reach, culture     |
| `lib/endonyms.ts`          | Switch to Intl.DisplayNames          |
| `lib/country-selector.ts`  | Delegate to world-data               |
| `lib/nav-structure.ts`     | Add referral/media/fashion to footer |
| `components/Discovery.tsx` | 5-step flow                          |
| `components/Footer.tsx`    | 4-column rich layout                 |
| `lib/graph.ts`             | Use dimension-scoring + agents       |
| `app/exchange/page.tsx`    | 8-dimension scoring + market badges  |
| `app/me/page.tsx`          | Edit all 8 dimensions                |
| `app/messages/page.tsx`    | AI/Human badges                      |
| `app/world/page.tsx`       | Agent personas in graph              |

### Data Files (evolve, not delete)

- Existing `data/mock/*.ts` files are preserved for pages that still consume them (about, pricing, business, charity, config)
- Media and fashion mock data gets consumed by restored pages
- No new mock data created — AI agents replace mock personas

---

## 13. Non-Goals (YAGNI)

- Real-time AI chat (agents respond with pre-built templates, not LLM calls)
- Database migration (still localStorage + mock until DB credentials available)
- i18n UI translation (content stays English, but language data supports all)
- Payment processing (M-Pesa/Stripe integration stays as-is)
- User authentication changes (NextAuth stays as-is)
