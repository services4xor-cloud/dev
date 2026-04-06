# World Dimensions — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand BeNetwork to all 193 countries, ~70 languages, 8 identity dimensions with AI agent network, restore referral/media/fashion pages, and build a rich multi-column footer.

**Architecture:** Create `lib/world-data.ts` (193 countries + ~70 languages), `lib/dimensions.ts` (Faith/Craft/Reach/Culture registries), `lib/agents.ts` (programmatic AI persona generation for all countries), `lib/dimension-scoring.ts` (8-dimension matching engine replacing old 4-factor scoring), `lib/market-data.ts` (platform-pushed sector signals). Extend Identity context with 4 new fields (faith, craft, reach, culture). Expand Discovery from 3→5 steps. Restore referral/media/fashion pages. Rebuild Footer as 4-column layout.

**Tech Stack:** Next.js 14, TypeScript strict, Tailwind CSS + existing premium design system (glass, phi, ambient), Intl.DisplayNames for country/language localization, existing mock data for about/pricing/business/charity pages.

**Design Doc:** `docs/plans/2026-03-12-world-dimensions-design.md`

---

## Task 1: World Data — All 193 Countries + ~70 Languages

**Files:**

- Create: `lib/world-data.ts`
- Create: `__tests__/lib/world-data.test.ts`

**Step 1: Write the failing test**

Create `__tests__/lib/world-data.test.ts`:

```typescript
import {
  WORLD_COUNTRIES,
  WORLD_LANGUAGES,
  getCountryName,
  getLanguageName,
  getCountriesByRegion,
  getLanguagesForCountry,
} from '@/lib/world-data'

describe('WORLD_COUNTRIES', () => {
  it('has all 193 UN member states', () => {
    const codes = Object.keys(WORLD_COUNTRIES)
    expect(codes.length).toBeGreaterThanOrEqual(193)
  })

  it('each country has required fields', () => {
    for (const [code, country] of Object.entries(WORLD_COUNTRIES)) {
      expect(code).toMatch(/^[A-Z]{2}$/)
      expect(country.name).toBeTruthy()
      expect(country.region).toBeTruthy()
      expect(country.subregion).toBeTruthy()
      expect(typeof country.lat).toBe('number')
      expect(typeof country.lng).toBe('number')
      expect(country.languages.length).toBeGreaterThan(0)
      expect(country.currency).toMatch(/^[A-Z]{3}$/)
    }
  })

  it('includes key countries', () => {
    expect(WORLD_COUNTRIES['KE']).toBeDefined()
    expect(WORLD_COUNTRIES['DE']).toBeDefined()
    expect(WORLD_COUNTRIES['US']).toBeDefined()
    expect(WORLD_COUNTRIES['NG']).toBeDefined()
    expect(WORLD_COUNTRIES['JP']).toBeDefined()
    expect(WORLD_COUNTRIES['BR']).toBeDefined()
    expect(WORLD_COUNTRIES['IN']).toBeDefined()
    expect(WORLD_COUNTRIES['SA']).toBeDefined()
  })

  it('getCountriesByRegion returns correct groupings', () => {
    const africa = getCountriesByRegion('Africa')
    expect(africa.length).toBeGreaterThanOrEqual(50)
    const europe = getCountriesByRegion('Europe')
    expect(europe.length).toBeGreaterThanOrEqual(40)
  })
})

describe('WORLD_LANGUAGES', () => {
  it('has at least 50 languages', () => {
    expect(Object.keys(WORLD_LANGUAGES).length).toBeGreaterThanOrEqual(50)
  })

  it('each language has required fields', () => {
    for (const [code, lang] of Object.entries(WORLD_LANGUAGES)) {
      expect(code.length).toBeGreaterThanOrEqual(2)
      expect(lang.name).toBeTruthy()
      expect(lang.nativeName).toBeTruthy()
      expect(['ltr', 'rtl']).toContain(lang.script)
      expect(typeof lang.speakers).toBe('number')
      expect(lang.countries.length).toBeGreaterThan(0)
    }
  })

  it('includes key languages', () => {
    expect(WORLD_LANGUAGES['en']).toBeDefined()
    expect(WORLD_LANGUAGES['ar']).toBeDefined()
    expect(WORLD_LANGUAGES['zh']).toBeDefined()
    expect(WORLD_LANGUAGES['es']).toBeDefined()
    expect(WORLD_LANGUAGES['hi']).toBeDefined()
    expect(WORLD_LANGUAGES['sw']).toBeDefined()
    expect(WORLD_LANGUAGES['de']).toBeDefined()
    expect(WORLD_LANGUAGES['fr']).toBeDefined()
  })

  it('getLanguagesForCountry returns spoken languages', () => {
    const kenyaLangs = getLanguagesForCountry('KE')
    expect(kenyaLangs.some((l) => l.code === 'en')).toBe(true)
    expect(kenyaLangs.some((l) => l.code === 'sw')).toBe(true)
  })
})

describe('getCountryName (Intl.DisplayNames)', () => {
  it('returns English name by default', () => {
    expect(getCountryName('DE', 'en')).toBe('Germany')
    expect(getCountryName('KE', 'en')).toBe('Kenya')
  })

  it('returns native name when locale matches', () => {
    const name = getCountryName('DE', 'de')
    expect(name).toBe('Deutschland')
  })

  it('falls back to code for unknown', () => {
    const name = getCountryName('XX', 'en')
    expect(name).toBe('XX')
  })
})

describe('getLanguageName', () => {
  it('returns language name from registry', () => {
    expect(getLanguageName('en')).toBe('English')
    expect(getLanguageName('sw')).toBe('Swahili')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/world-data.test.ts --no-coverage`
Expected: FAIL — module `@/lib/world-data` not found

**Step 3: Implement `lib/world-data.ts`**

Create `lib/world-data.ts` with:

1. `WORLD_COUNTRIES` — a `Record<string, WorldCountry>` with all 193 UN member states. Each entry has: `code`, `name`, `region` (Africa/Europe/Asia/Americas/Oceania), `subregion`, `lat`, `lng`, `languages` (ISO 639-1 codes), `faiths` (predominant), `currency` (ISO 4217).

2. `WORLD_LANGUAGES` — a `Record<string, WorldLanguage>` with ~70 most spoken languages. Each entry: `code`, `name`, `nativeName`, `script` (ltr/rtl), `speakers` (millions), `countries` (ISO country codes where spoken).

3. Helper functions:
   - `getCountryName(code, locale)` — uses `Intl.DisplayNames` with fallback
   - `getLanguageName(code)` — from registry
   - `getCountriesByRegion(region)` — filter helper
   - `getLanguagesForCountry(countryCode)` — returns languages spoken in a country

**Important:** Include ALL 193 countries. Use real geographic data. The 5 regions are: Africa, Europe, Asia, Americas, Oceania. Each country must have accurate lat/lng, primary languages, and currency.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/world-data.test.ts --no-coverage`
Expected: PASS — all assertions green

**Step 5: Commit**

```bash
git add lib/world-data.ts __tests__/lib/world-data.test.ts
git commit -m "feat: add world-data with 193 countries and ~70 languages"
```

---

## Task 2: Dimension Registries — Faith, Craft, Reach, Culture

**Files:**

- Create: `lib/dimensions.ts`
- Create: `__tests__/lib/dimensions.test.ts`

**Step 1: Write the failing test**

Create `__tests__/lib/dimensions.test.ts`:

```typescript
import {
  FAITH_OPTIONS,
  CRAFT_SUGGESTIONS,
  REACH_OPTIONS,
  CULTURE_SUGGESTIONS,
  getCultureSuggestionsForCountry,
  type FaithId,
  type ReachId,
} from '@/lib/dimensions'

describe('FAITH_OPTIONS', () => {
  it('has 8 faith options', () => {
    expect(FAITH_OPTIONS.length).toBe(8)
  })

  it('each option has id, label, icon', () => {
    for (const opt of FAITH_OPTIONS) {
      expect(opt.id).toBeTruthy()
      expect(opt.label).toBeTruthy()
      expect(opt.icon).toBeTruthy()
    }
  })

  it('includes major world faiths', () => {
    const ids = FAITH_OPTIONS.map((o) => o.id)
    expect(ids).toContain('islam')
    expect(ids).toContain('christianity')
    expect(ids).toContain('secular')
    expect(ids).toContain('hinduism')
    expect(ids).toContain('buddhism')
  })

  it('has unique IDs', () => {
    const ids = FAITH_OPTIONS.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('CRAFT_SUGGESTIONS', () => {
  it('has at least 40 craft suggestions', () => {
    expect(CRAFT_SUGGESTIONS.length).toBeGreaterThanOrEqual(40)
  })

  it('all unique', () => {
    const lower = CRAFT_SUGGESTIONS.map((s) => s.toLowerCase())
    expect(new Set(lower).size).toBe(lower.length)
  })

  it('covers tech, health, creative, trades', () => {
    const all = CRAFT_SUGGESTIONS.join(' ').toLowerCase()
    expect(all).toContain('software')
    expect(all).toContain('nursing')
    expect(all).toContain('photography')
    expect(all).toContain('construction')
  })
})

describe('REACH_OPTIONS', () => {
  it('has 6 reach options', () => {
    expect(REACH_OPTIONS.length).toBe(6)
  })

  it('each has id, label, icon, description', () => {
    for (const opt of REACH_OPTIONS) {
      expect(opt.id).toBeTruthy()
      expect(opt.label).toBeTruthy()
      expect(opt.icon).toBeTruthy()
      expect(opt.description).toBeTruthy()
    }
  })

  it('includes key capabilities', () => {
    const ids = REACH_OPTIONS.map((o) => o.id)
    expect(ids).toContain('can-travel')
    expect(ids).toContain('can-host')
    expect(ids).toContain('digital-only')
  })
})

describe('getCultureSuggestionsForCountry', () => {
  it('returns suggestions for Kenya', () => {
    const suggestions = getCultureSuggestionsForCountry('KE')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions).toContain('Maasai')
  })

  it('returns suggestions for Nigeria', () => {
    const suggestions = getCultureSuggestionsForCountry('NG')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions).toContain('Yoruba')
  })

  it('returns empty for unknown country', () => {
    expect(getCultureSuggestionsForCountry('XX')).toEqual([])
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/dimensions.test.ts --no-coverage`
Expected: FAIL — module not found

**Step 3: Implement `lib/dimensions.ts`**

Create `lib/dimensions.ts` with:

1. `FAITH_OPTIONS` — array of 8 objects: `{ id: FaithId, label: string, icon: string }`. IDs: islam, christianity, secular, hinduism, buddhism, judaism, traditional, other.

2. `CRAFT_SUGGESTIONS` — string array of ~50 craft/skill tags, organized by category (Tech, Business, Creative, Trades, Health, Education, Nature, Service).

3. `REACH_OPTIONS` — array of 6 objects: `{ id: ReachId, label: string, icon: string, description: string }`. IDs: can-travel, can-host, can-invest, digital-only, can-mentor, can-relocate.

4. `CULTURE_SUGGESTIONS` — `Record<string, string[]>` mapping country codes to ethnic/cultural identity suggestions. Cover at least 30 countries with 3-8 suggestions each.

5. `getCultureSuggestionsForCountry(code)` — returns suggestions array or empty.

6. Export types: `FaithId`, `ReachId`.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/dimensions.test.ts --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/dimensions.ts __tests__/lib/dimensions.test.ts
git commit -m "feat: add dimension registries (faith, craft, reach, culture)"
```

---

## Task 3: Market Data — Platform-Pushed Signals

**Files:**

- Create: `lib/market-data.ts`
- Create: `__tests__/lib/market-data.test.ts`

**Step 1: Write the failing test**

Create `__tests__/lib/market-data.test.ts`:

```typescript
import {
  MARKET_SIGNALS,
  getSignalsForRegion,
  getSignalsForCraft,
  getMarketScore,
  type MarketSignal,
} from '@/lib/market-data'

describe('MARKET_SIGNALS', () => {
  it('has at least 30 signals', () => {
    expect(MARKET_SIGNALS.length).toBeGreaterThanOrEqual(30)
  })

  it('each signal has required fields', () => {
    for (const s of MARKET_SIGNALS) {
      expect(s.id).toBeTruthy()
      expect(s.sector).toBeTruthy()
      expect(s.region).toBeTruthy()
      expect(['growing', 'stable', 'emerging', 'urgent']).toContain(s.signal)
      expect(s.title).toBeTruthy()
      expect(s.description).toBeTruthy()
      expect(s.demandCrafts.length).toBeGreaterThan(0)
      expect(s.opportunityScore).toBeGreaterThanOrEqual(0)
      expect(s.opportunityScore).toBeLessThanOrEqual(100)
    }
  })

  it('has unique IDs', () => {
    const ids = MARKET_SIGNALS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getSignalsForRegion', () => {
  it('returns signals for East Africa', () => {
    const signals = getSignalsForRegion('KE')
    expect(signals.length).toBeGreaterThan(0)
  })
})

describe('getSignalsForCraft', () => {
  it('returns signals matching software engineering', () => {
    const signals = getSignalsForCraft(['Software Engineering'])
    expect(signals.length).toBeGreaterThan(0)
  })
})

describe('getMarketScore', () => {
  it('returns 0-20 score', () => {
    const score = getMarketScore(
      { country: 'KE', craft: ['Safari Guide'], interests: ['safari'] },
      MARKET_SIGNALS
    )
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(20)
  })

  it('scores higher for urgent + matching craft', () => {
    const high = getMarketScore(
      { country: 'KE', craft: ['Safari Guide'], interests: ['safari'] },
      MARKET_SIGNALS
    )
    const low = getMarketScore(
      { country: 'JP', craft: ['Pottery'], interests: ['community'] },
      MARKET_SIGNALS
    )
    expect(high).toBeGreaterThan(low)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/market-data.test.ts --no-coverage`
Expected: FAIL

**Step 3: Implement `lib/market-data.ts`**

Create with:

1. `MarketSignal` interface: id, sector, region, signal (growing/stable/emerging/urgent), title, description, demandCrafts, opportunityScore.

2. `MARKET_SIGNALS` — array of ~30+ real-world market signals covering:
   - East Africa: safari tourism (growing), tech hubs (growing), agriculture (stable)
   - West Africa: fintech (urgent), fashion (growing), media/Nollywood (growing)
   - Europe-Africa corridors: German-Kenyan tech (emerging), UK-Nigeria trade (growing)
   - Gulf: healthcare workers (urgent), construction (stable), investment in Africa (growing)
   - Asia: manufacturing (stable), tech outsourcing (growing)
   - Americas: remote tech (growing), agricultural trade (emerging)

3. `getSignalsForRegion(countryCode)` — returns signals for a country or its region.
4. `getSignalsForCraft(crafts)` — returns signals whose demandCrafts overlap.
5. `getMarketScore(profile, signals)` — returns 0-20 score based on how well user's craft/interests/location align with active market signals.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/market-data.test.ts --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/market-data.ts __tests__/lib/market-data.test.ts
git commit -m "feat: add market data with 30+ real-world sector signals"
```

---

## Task 4: 8-Dimension Scoring Engine

**Files:**

- Create: `lib/dimension-scoring.ts`
- Create: `__tests__/lib/dimension-scoring.test.ts`

**Step 1: Write the failing test**

Create `__tests__/lib/dimension-scoring.test.ts`:

```typescript
import {
  scoreDimensions,
  type DimensionProfile,
  type DimensionScore,
} from '@/lib/dimension-scoring'
import { MARKET_SIGNALS } from '@/lib/market-data'

const ME: DimensionProfile = {
  country: 'KE',
  city: 'Nairobi',
  languages: ['en', 'sw'],
  faith: 'christianity',
  craft: ['Software Engineering', 'UX Design'],
  interests: ['tech', 'safari'],
  reach: ['can-travel', 'digital-only'],
  culture: 'Kikuyu',
  isHuman: true,
}

describe('scoreDimensions', () => {
  it('returns score between 0 and 100', () => {
    const them: DimensionProfile = {
      country: 'DE',
      city: 'Berlin',
      languages: ['de', 'en'],
      craft: ['Marketing'],
      interests: ['tech'],
      reach: ['can-host'],
      isHuman: true,
    }
    const result = scoreDimensions(ME, them, MARKET_SIGNALS)
    expect(result.total).toBeGreaterThanOrEqual(0)
    expect(result.total).toBeLessThanOrEqual(110) // 100 + 10 human bonus
  })

  it('has all 8 breakdown fields', () => {
    const them: DimensionProfile = {
      country: 'TZ',
      city: 'Dar',
      languages: ['sw', 'en'],
      craft: ['Safari Guide'],
      interests: ['safari'],
      reach: ['can-host'],
      isHuman: false,
    }
    const result = scoreDimensions(ME, them, MARKET_SIGNALS)
    expect(result.breakdown).toHaveProperty('language')
    expect(result.breakdown).toHaveProperty('market')
    expect(result.breakdown).toHaveProperty('craft')
    expect(result.breakdown).toHaveProperty('passion')
    expect(result.breakdown).toHaveProperty('location')
    expect(result.breakdown).toHaveProperty('faith')
    expect(result.breakdown).toHaveProperty('reach')
    expect(result.breakdown).toHaveProperty('culture')
  })

  it('language overlap scores higher than no overlap', () => {
    const shared: DimensionProfile = {
      country: 'TZ',
      city: 'Dar',
      languages: ['sw', 'en'],
      craft: ['Teaching'],
      interests: ['education'],
      reach: ['can-host'],
      isHuman: false,
    }
    const none: DimensionProfile = {
      country: 'JP',
      city: 'Tokyo',
      languages: ['ja'],
      craft: ['Teaching'],
      interests: ['education'],
      reach: ['can-host'],
      isHuman: false,
    }
    const s1 = scoreDimensions(ME, shared, MARKET_SIGNALS)
    const s2 = scoreDimensions(ME, none, MARKET_SIGNALS)
    expect(s1.breakdown.language).toBeGreaterThan(s2.breakdown.language)
  })

  it('complementary craft scores higher than mirror', () => {
    const complementary: DimensionProfile = {
      country: 'KE',
      city: 'Nairobi',
      languages: ['en'],
      craft: ['Marketing', 'Sales'],
      interests: ['tech'],
      reach: ['digital-only'],
      isHuman: false,
    }
    const mirror: DimensionProfile = {
      country: 'KE',
      city: 'Nairobi',
      languages: ['en'],
      craft: ['Software Engineering', 'UX Design'],
      interests: ['tech'],
      reach: ['digital-only'],
      isHuman: false,
    }
    const c = scoreDimensions(ME, complementary, MARKET_SIGNALS)
    const m = scoreDimensions(ME, mirror, MARKET_SIGNALS)
    expect(c.breakdown.craft).toBeGreaterThan(m.breakdown.craft)
  })

  it('human-to-human gets +10 bonus', () => {
    const human: DimensionProfile = {
      country: 'KE',
      city: 'Nairobi',
      languages: ['en'],
      craft: ['Teaching'],
      interests: ['education'],
      reach: ['can-host'],
      isHuman: true,
    }
    const ai: DimensionProfile = { ...human, isHuman: false }
    const h = scoreDimensions(ME, human, MARKET_SIGNALS)
    const a = scoreDimensions(ME, ai, MARKET_SIGNALS)
    expect(h.humanBonus).toBe(10)
    expect(a.humanBonus).toBe(0)
  })

  it('reach compatibility: can-travel + can-host scores high', () => {
    const host: DimensionProfile = {
      country: 'TZ',
      city: 'Arusha',
      languages: ['en', 'sw'],
      craft: ['Safari Guide'],
      interests: ['safari'],
      reach: ['can-host'],
      isHuman: false,
    }
    const digital: DimensionProfile = {
      ...host,
      reach: ['digital-only'],
    }
    const h = scoreDimensions(ME, host, MARKET_SIGNALS)
    const d = scoreDimensions(ME, digital, MARKET_SIGNALS)
    expect(h.breakdown.reach).toBeGreaterThanOrEqual(d.breakdown.reach)
  })

  it('assigns recommendation label', () => {
    const them: DimensionProfile = {
      country: 'KE',
      city: 'Nairobi',
      languages: ['en', 'sw'],
      faith: 'christianity',
      craft: ['Marketing'],
      interests: ['tech', 'safari'],
      reach: ['can-host', 'can-mentor'],
      culture: 'Kikuyu',
      isHuman: true,
    }
    const result = scoreDimensions(ME, them, MARKET_SIGNALS)
    expect(['Perfect', 'Strong', 'Good', 'Possible']).toContain(result.label)
  })

  it('returns highlights array', () => {
    const them: DimensionProfile = {
      country: 'TZ',
      city: 'Dar',
      languages: ['sw', 'en'],
      craft: ['Safari Guide'],
      interests: ['safari'],
      reach: ['can-host'],
      isHuman: false,
    }
    const result = scoreDimensions(ME, them, MARKET_SIGNALS)
    expect(Array.isArray(result.highlights)).toBe(true)
    expect(result.highlights.length).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/dimension-scoring.test.ts --no-coverage`
Expected: FAIL

**Step 3: Implement `lib/dimension-scoring.ts`**

Create with:

1. `DimensionProfile` interface — country, city?, languages[], faith?, craft[], interests[], reach[], culture?, isHuman.

2. `DimensionScore` interface — total (0-110), breakdown (8 fields), humanBonus, label, highlights[].

3. `scoreDimensions(me, them, marketSignals)` function implementing:
   - **Language (0-20):** Score based on shared language count. 1 shared = 10, 2+ shared = 20.
   - **Market (0-20):** Import `getMarketScore` from market-data. Score based on alignment.
   - **Craft (0-15):** Complementary scoring — shared crafts worth 2 pts each, complementary worth 4 pts each, capped at 15.
   - **Passion (0-15):** Shared interest count. 1 = 5, 2 = 10, 3+ = 15.
   - **Location (0-10):** Same country = 10, same region = 5, different = 0.
   - **Faith (0-8):** Same faith = 8 (only if both declared).
   - **Reach (0-7):** Compatible pairs (can-travel+can-host, can-invest+can-mentor, can-relocate+can-host) = 7 each match, capped at 7.
   - **Culture (0-5):** Same culture = 5 (only if both declared).
   - **Human bonus:** +10 if both isHuman.
   - **Label:** total ≥ 80 = Perfect, ≥ 60 = Strong, ≥ 40 = Good, else Possible.
   - **Highlights:** human-readable reasons for each dimension that scored.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/dimension-scoring.test.ts --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/dimension-scoring.ts __tests__/lib/dimension-scoring.test.ts
git commit -m "feat: add 8-dimension scoring engine with complementary craft logic"
```

---

## Task 5: AI Agent Network — Persona Generation

**Files:**

- Create: `lib/agents.ts`
- Create: `__tests__/lib/agents.test.ts`

**Step 1: Write the failing test**

Create `__tests__/lib/agents.test.ts`:

```typescript
import { generateAgentsForCountry, generateAllAgents, type AgentPersona } from '@/lib/agents'

describe('generateAgentsForCountry', () => {
  it('returns 3-10 agents for Kenya', () => {
    const agents = generateAgentsForCountry('KE')
    expect(agents.length).toBeGreaterThanOrEqual(3)
    expect(agents.length).toBeLessThanOrEqual(10)
  })

  it('each agent has complete profile', () => {
    const agents = generateAgentsForCountry('DE')
    for (const a of agents) {
      expect(a.id).toBeTruthy()
      expect(a.type).toBe('ai')
      expect(a.name).toBeTruthy()
      expect(a.avatar).toBeTruthy()
      expect(a.country).toBe('DE')
      expect(a.city).toBeTruthy()
      expect(a.languages.length).toBeGreaterThan(0)
      expect(a.craft.length).toBeGreaterThan(0)
      expect(a.interests.length).toBeGreaterThan(0)
      expect(a.reach.length).toBeGreaterThan(0)
      expect(a.bio).toBeTruthy()
      expect(a.exchangeProposals.length).toBeGreaterThan(0)
    }
  })

  it('agents have realistic languages for their country', () => {
    const agents = generateAgentsForCountry('KE')
    const allLangs = agents.flatMap((a) => a.languages)
    expect(allLangs).toContain('en')
    expect(allLangs).toContain('sw')
  })

  it('agents have diverse crafts', () => {
    const agents = generateAgentsForCountry('KE')
    const allCrafts = new Set(agents.flatMap((a) => a.craft))
    expect(allCrafts.size).toBeGreaterThanOrEqual(3)
  })

  it('generates deterministically (same seed = same output)', () => {
    const a1 = generateAgentsForCountry('KE')
    const a2 = generateAgentsForCountry('KE')
    expect(a1.map((a) => a.id)).toEqual(a2.map((a) => a.id))
  })
})

describe('generateAllAgents', () => {
  it('generates agents for all 193 countries', () => {
    const all = generateAllAgents()
    const countries = new Set(all.map((a) => a.country))
    expect(countries.size).toBeGreaterThanOrEqual(193)
  })

  it('generates 500-1500 total agents', () => {
    const all = generateAllAgents()
    expect(all.length).toBeGreaterThanOrEqual(500)
    expect(all.length).toBeLessThanOrEqual(1500)
  })

  it('all IDs are unique', () => {
    const all = generateAllAgents()
    const ids = all.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/agents.test.ts --no-coverage`
Expected: FAIL

**Step 3: Implement `lib/agents.ts`**

Create with:

1. `AgentPersona` interface — id, type: 'ai', name, avatar (emoji), country, city, languages[], faith?, craft[], interests[], reach[], culture?, bio, exchangeProposals[], responseStyle.

2. `generateAgentsForCountry(countryCode)` — deterministic function that:
   - Reads country data from `WORLD_COUNTRIES` to get languages, faiths, region
   - Uses a seeded pseudo-random function (based on country code hash) for consistency
   - Picks culturally appropriate names (use name pools by region)
   - Assigns languages from the country's language list
   - Assigns crafts relevant to the country's economic profile
   - Generates 3-10 agents (larger countries get more)
   - Each agent has 1-3 exchange proposals (e.g., "Looking for tech mentorship", "Offering safari photography workshops")

3. `generateAllAgents()` — calls `generateAgentsForCountry` for all 193 countries.

4. Internal name pools: `NAMES_AFRICA`, `NAMES_EUROPE`, `NAMES_ASIA`, `NAMES_AMERICAS`, `NAMES_MIDDLE_EAST` — arrays of culturally appropriate first names (~20 per region).

5. Internal city pools per major country (~3-5 cities each for top 50 countries, capital only for smaller countries).

**Important:** This is NOT mock data. These are the actual AI agents that populate the network. They must feel real and diverse. Use realistic names, real cities, appropriate languages.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/agents.test.ts --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/agents.ts __tests__/lib/agents.test.ts
git commit -m "feat: add AI agent network with personas for all 193 countries"
```

---

## Task 6: Extend Identity Context with New Dimensions

**Files:**

- Modify: `lib/identity-context.tsx`
- Modify: `__tests__/lib/identity-context.test.ts` (create if doesn't exist)

**Step 1: Write the failing test**

Create/update `__tests__/lib/identity-context.test.ts`:

```typescript
/**
 * Test the extended Identity interface shape (compile-time check via import).
 * Since IdentityProvider uses React context + localStorage, we test the
 * type shape and default values.
 */
import { renderHook, act } from '@testing-library/react'
import React from 'react'

// We can't easily test the full provider without a test wrapper,
// so we test the module exports and type shape
describe('Identity Context — extended dimensions', () => {
  it('exports IdentityProvider and useIdentity', async () => {
    const mod = await import('@/lib/identity-context')
    expect(mod.IdentityProvider).toBeDefined()
    expect(mod.useIdentity).toBeDefined()
  })

  it('useIdentity fallback has new dimension fields', async () => {
    const { useIdentity } = await import('@/lib/identity-context')
    // Outside provider, useIdentity returns fallback
    const result = useIdentity()
    expect(result.identity).toHaveProperty('craft')
    expect(result.identity).toHaveProperty('reach')
    expect(Array.isArray(result.identity.craft)).toBe(true)
    expect(Array.isArray(result.identity.reach)).toBe(true)
    expect(result.identity.craft).toEqual([])
    expect(result.identity.reach).toEqual([])
  })

  it('fallback has setFaith, setCraft, setReach, setCulture', async () => {
    const { useIdentity } = await import('@/lib/identity-context')
    const result = useIdentity()
    expect(typeof result.setFaith).toBe('function')
    expect(typeof result.setCraft).toBe('function')
    expect(typeof result.setReach).toBe('function')
    expect(typeof result.setCulture).toBe('function')
  })

  it('hasCompletedDiscovery requires craft', async () => {
    const { useIdentity } = await import('@/lib/identity-context')
    const result = useIdentity()
    // Fallback has empty arrays → false
    expect(result.hasCompletedDiscovery).toBe(false)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/identity-context.test.ts --no-coverage`
Expected: FAIL — identity doesn't have `craft`, `reach` fields; no `setFaith`, `setCraft`, `setReach`, `setCulture` functions

**Step 3: Modify `lib/identity-context.tsx`**

Add to the `Identity` interface:

```typescript
  faith?: string         // FaithId from dimensions.ts
  craft: string[]        // profession/skill tags
  reach: string[]        // ReachId[] from dimensions.ts
  culture?: string       // free-text cultural identity
```

Add to default state:

```typescript
  craft: [],
  reach: [],
```

Add to `IdentityContextValue`:

```typescript
  setFaith: (faith: string | undefined) => void
  setCraft: (craft: string[]) => void
  setReach: (reach: string[]) => void
  setCulture: (culture: string | undefined) => void
```

Add setters (same pattern as existing `setLanguages`, `setCity`):

```typescript
const setFaith = useCallback((faith: string | undefined) => {
  setIdentity((prev) => ({ ...prev, faith }))
}, [])
const setCraft = useCallback((craft: string[]) => {
  setIdentity((prev) => ({ ...prev, craft }))
}, [])
const setReach = useCallback((reach: string[]) => {
  setIdentity((prev) => ({ ...prev, reach }))
}, [])
const setCulture = useCallback((culture: string | undefined) => {
  setIdentity((prev) => ({ ...prev, culture }))
}, [])
```

Update `hasCompletedDiscovery`:

```typescript
const hasCompletedDiscovery =
  identity.languages.length > 0 && identity.interests.length > 0 && identity.craft.length > 0
```

Update localStorage migration to add defaults for missing `craft` and `reach` fields.

Update fallback in `useIdentity()` to include new fields and no-op setters.

Add all 4 new setters to the Provider's value object.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/identity-context.test.ts --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/identity-context.tsx __tests__/lib/identity-context.test.ts
git commit -m "feat: extend identity context with faith, craft, reach, culture dimensions"
```

---

## Task 7: Discovery Flow — Expand from 3 to 5 Steps

**Files:**

- Modify: `components/Discovery.tsx`

**Step 1: Update Discovery.tsx**

This is a UI task — no separate test file needed (existing visual/behavioral tests cover it). The component changes are:

1. Update `StepIndicator` to accept `current: 1 | 2 | 3 | 4 | 5` and render 5 dots.

2. **Step 1 stays** — "Where & How": Country + City (add text input for city) + Languages. **Key change:** Replace `LANGUAGE_REGISTRY` (14 languages) with `WORLD_LANGUAGES` from `lib/world-data.ts` (~70 languages). Add a search/filter input above the language grid since there are now many more options.

3. **Step 2 becomes "What You Do"** — Craft selection. Autocomplete text input with `CRAFT_SUGGESTIONS` from `lib/dimensions.ts`. User picks 1-5 tags. Show selected tags as pills. Allow free-text entry.

4. **Step 3 stays** — "What Drives You": Interests/Passion grid (EXCHANGE_CATEGORIES). **Add:** Reach multi-select checkboxes below the category grid (6 options from `REACH_OPTIONS`).

5. **Step 4 is NEW** — "Who You Are" (optional/skippable): Faith single-select (FAITH_OPTIONS grid, similar styling to interests). Culture free-text input with country-aware suggestions. "Skip" button prominent.

6. **Step 5 stays** — "Your Network Appears": Enhanced with 8-dimension scoring. Show score breakdown visually. Same animated SVG + "Enter My World" CTA.

7. Update `handleComplete` to commit all new fields:

```typescript
const handleComplete = () => {
  setLanguages(selectedLanguages)
  setInterests(selectedInterests)
  setCraft(selectedCrafts)
  setReach(selectedReach)
  if (selectedFaith) setFaith(selectedFaith)
  if (selectedCulture) setCulture(selectedCulture)
  setCity(editCity)
  router.push('/world')
}
```

8. Add state for new fields: `selectedCrafts: string[]`, `selectedReach: string[]`, `selectedFaith: string | undefined`, `selectedCulture: string`.

9. Import from new modules: `WORLD_LANGUAGES` from `lib/world-data`, `FAITH_OPTIONS`, `CRAFT_SUGGESTIONS`, `REACH_OPTIONS`, `getCultureSuggestionsForCountry` from `lib/dimensions`.

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/Discovery.tsx
git commit -m "feat: expand discovery from 3 to 5 steps with all 8 dimensions"
```

---

## Task 8: Update Endonyms to Use Intl.DisplayNames

**Files:**

- Modify: `lib/endonyms.ts`

**Step 1: Modify endonyms.ts**

Replace the manually curated `ENDONYMS` map with `Intl.DisplayNames`:

```typescript
/**
 * Country Name Localization — via Intl.DisplayNames
 *
 * Uses browser/Node native Intl API for zero-maintenance localization.
 * Falls back to the manual map for edge cases or SSR environments.
 */

// Keep the existing ENDONYMS map as fallback only
const ENDONYMS: Record<string, Record<string, string>> = {
  /* existing data stays */
}

export function getLocalizedCountryName(countryCode: string, language: string): string {
  // Try Intl.DisplayNames first (zero maintenance, all languages)
  try {
    const name = new Intl.DisplayNames([language], { type: 'region' }).of(countryCode.toUpperCase())
    if (name && name !== countryCode.toUpperCase()) return name
  } catch {
    // Fall through to manual map
  }

  // Fallback to manual map
  const cc = countryCode.toUpperCase()
  return ENDONYMS[cc]?.[language] ?? ENDONYMS[cc]?.['en'] ?? cc
}

export function getDefaultLanguage(countryCode: string): string {
  // Keep existing logic
  // ...
}
```

This makes `getLocalizedCountryName` work for ALL 193 countries in ALL languages without any manual entries.

**Step 2: Run existing tests**

Run: `npx jest --no-coverage`
Expected: All existing tests pass (endonyms function signature unchanged)

**Step 3: Commit**

```bash
git add lib/endonyms.ts
git commit -m "feat: switch endonyms to Intl.DisplayNames with manual fallback"
```

---

## Task 9: Rich Multi-Column Footer

**Files:**

- Modify: `lib/nav-structure.ts`
- Modify: `components/Footer.tsx`

**Step 1: Update nav-structure.ts**

Add structured footer columns:

```typescript
export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { href: '/world', label: 'My World' },
      { href: '/messages', label: 'Messages' },
      { href: '/me', label: 'Me' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: '/exchange', label: 'Exchange' },
      { href: '/media', label: 'Media' },
      { href: '/fashion', label: 'Fashion' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/charity', label: 'Charity' },
      { href: '/referral', label: 'Referral' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/business', label: 'Business' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
]
```

Keep existing `FOOTER_LINKS` as a flat array (backward compat) = all links from all columns.

**Step 2: Rebuild Footer.tsx**

Rewrite `components/Footer.tsx` with 4-column layout:

- Top: brand name + tagline
- Middle: 4 columns (grid-cols-2 sm:grid-cols-4) with column headers + links
- Bottom: social links + copyright

Follow existing design system (glass, brand-bg, accent colors, phi spacing).

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Update nav-structure test**

Update `__tests__/lib/nav-structure.test.ts` to add test for `FOOTER_COLUMNS`:

```typescript
describe('Nav Structure — footer columns', () => {
  it('exports FOOTER_COLUMNS with 4 columns', () => {
    expect(FOOTER_COLUMNS.length).toBe(4)
  })

  it('each column has title and links', () => {
    for (const col of FOOTER_COLUMNS) {
      expect(col.title).toBeTruthy()
      expect(col.links.length).toBeGreaterThan(0)
    }
  })
})
```

**Step 5: Run tests**

Run: `npx jest --no-coverage`
Expected: All pass

**Step 6: Commit**

```bash
git add lib/nav-structure.ts components/Footer.tsx __tests__/lib/nav-structure.test.ts
git commit -m "feat: restore rich 4-column footer with explore/connect/community/company"
```

---

## Task 10: Restore Referral Page

**Files:**

- Create: `app/referral/page.tsx`

**Step 1: Create referral page**

Restore `app/referral/page.tsx` with the original feature set, updated for Human Exchange Network vocabulary:

1. Hero section: "Invite Real Humans" messaging with `REFERRAL_BONUS` from config
2. "Human Premium" section explaining that real humans get ✨ badge and higher match priority
3. Referral link copy/share (WhatsApp, Twitter, Email buttons)
4. 4-step "How it works" visualization using `REFERRAL.steps` from `data/mock/config.ts`
5. Stats grid using `REFERRAL.stats`
6. CTA → link to /login or /me

Use existing components: `GlassCard`, `SectionLayout`. Follow design system (dark theme, brand colors, glass effects).

**Important:** Use Human Exchange Network vocabulary throughout — no "Pioneer gets placed" language. Instead: "Your connection joins the network" / "Real humans make the network stronger."

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/referral/page.tsx
git commit -m "feat: restore referral page with human premium messaging"
```

---

## Task 11: Restore Media Page

**Files:**

- Create: `app/media/page.tsx`
- Create: `app/media/layout.tsx`

**Step 1: Create media page**

Restore `app/media/page.tsx` as an exchange category landing, using `MEDIA_PATHS`, `MEDIA_FEATURED_PROJECTS`, `MEDIA_PLATFORMS` from `data/mock/media.ts`:

1. Hero: "BeNetwork Media" with creator exchange messaging
2. 4 creator paths: Video/Documentary, Photography, Content Writing, Music & Audio (from `MEDIA_PATHS`)
3. Featured projects section (from `MEDIA_FEATURED_PROJECTS`)
4. 9 social platforms (from `MEDIA_PLATFORMS`)
5. CTA → /exchange (to find media connections) and /me (to set up profile)

Use Human Exchange Network vocabulary. Replace any "Apply" / "Anchor" language with "Connect" / "Exchange" / "Host".

**Step 2: Create layout**

Create `app/media/layout.tsx` with metadata:

```typescript
export const metadata = { title: 'Media & Content — The BeNetwork' }
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/media/page.tsx app/media/layout.tsx
git commit -m "feat: restore media exchange category landing page"
```

---

## Task 12: Restore Fashion Page

**Files:**

- Create: `app/fashion/page.tsx`
- Create: `app/fashion/layout.tsx`

**Step 1: Create fashion page**

Restore `app/fashion/page.tsx` using `FASHION_PATHS`, `FASHION_PARTNER_ANCHORS`, `FASHION_PROTECTIONS` from `data/mock/fashion.ts`:

1. Hero: "BeNetwork Fashion" with fashion exchange messaging
2. 3 paths: Model, Designer, Creative (from `FASHION_PATHS`)
3. Pioneer Protections section (from `FASHION_PROTECTIONS`) — keep "Contracts First", "Pioneer Sets Rates", "Chaperone Service", "All Work Compensated"
4. Partner connections (from `FASHION_PARTNER_ANCHORS`)
5. CTAs → /exchange, /me

Use Human Exchange Network vocabulary. Replace "Hire" with "Connect", "Anchor" with "Host".

**Step 2: Create layout**

Create `app/fashion/layout.tsx` with metadata:

```typescript
export const metadata = { title: 'Fashion & Design — The BeNetwork' }
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/fashion/page.tsx app/fashion/layout.tsx
git commit -m "feat: restore fashion exchange category landing page"
```

---

## Task 13: Wire AI Agents into Graph + Exchange Pages

**Files:**

- Modify: `lib/graph.ts`
- Modify: `app/exchange/page.tsx`
- Modify: `app/world/page.tsx`
- Modify: `app/messages/page.tsx`

**Step 1: Update graph.ts**

Replace the current `buildGraph` function to:

1. Import `generateAllAgents` from `lib/agents.ts` instead of using `MOCK_ALL_PIONEERS`
2. Import `scoreDimensions` from `lib/dimension-scoring.ts` instead of the current manual scoring
3. Import `MARKET_SIGNALS` from `lib/market-data.ts`
4. Build `DimensionProfile` from both the user's identity AND from each agent
5. Score using the 8-dimension engine
6. Add `isHuman` and `type` fields to `GraphNode`

Update `GraphNode` interface:

```typescript
export interface GraphNode {
  id: string
  type: 'you' | 'person' | 'opportunity' | 'community'
  personType: 'human' | 'ai' // NEW
  label: string
  sublabel: string
  icon: string
  score: number
  ring: number
}
```

**Step 2: Update exchange page**

In `app/exchange/page.tsx`:

1. Replace `MOCK_EXCHANGE_PEOPLE` with agents from `generateAllAgents()`
2. Replace manual scoring with `scoreDimensions()`
3. Add 🤖/✨ badges to `ExchangeCard` data
4. Add market signal "trending" badges for cards that align with urgent/growing signals

**Step 3: Update world page**

In `app/world/page.tsx`:

1. Use updated `buildGraph` (which now uses agents + dimension scoring)
2. Show human/AI distinction in the side panel

**Step 4: Update messages page**

In `app/messages/page.tsx`:

1. Add AI agent conversations alongside existing `MOCK_THREADS`
2. Show 🤖 badge on AI agent messages
3. Show ✨ "Real Connection" on human messages

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 6: Run all tests**

Run: `npx jest --no-coverage`
Expected: All pass

**Step 7: Commit**

```bash
git add lib/graph.ts app/exchange/page.tsx app/world/page.tsx app/messages/page.tsx
git commit -m "feat: wire AI agents into graph, exchange, and messages with 8-dimension scoring"
```

---

## Task 14: Update /me Profile with 8 Dimensions

**Files:**

- Modify: `app/me/page.tsx`

**Step 1: Update Me page**

Add new sections to the Profile tab in `app/me/page.tsx`:

1. **Craft section** — display current crafts as pills, "Add craft" input with autocomplete from `CRAFT_SUGGESTIONS`
2. **Reach section** — 6 toggle switches for reach capabilities (from `REACH_OPTIONS`)
3. **Faith section** — radio select from `FAITH_OPTIONS` (with "Prefer not to say" default)
4. **Culture section** — free-text input with country-aware suggestions from `getCultureSuggestionsForCountry`

All sections use existing glass card styling. Each section has a header with the dimension name and weight indicator (e.g., "Craft · 15% of your match score").

Wire each section's onChange to the identity context setters: `setCraft`, `setReach`, `setFaith`, `setCulture`.

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/me/page.tsx
git commit -m "feat: add 8-dimension profile editing to /me page"
```

---

## Task 15: Update Existing Tests + Run Full Suite

**Files:**

- Modify: `__tests__/lib/vocabulary.test.ts` (if needed)
- Modify: `__tests__/lib/nav-structure.test.ts` (already updated in Task 9)
- Fix: any broken tests from deleted pages

**Step 1: Run full test suite**

Run: `npx jest --no-coverage`

Check for any failures caused by:

- Changed `hasCompletedDiscovery` condition (now requires `craft.length > 0`)
- New imports in modified files
- Changed graph.ts interface

**Step 2: Fix any failing tests**

Update test assertions to match new behavior. Key changes to watch for:

- `hasCompletedDiscovery` now requires languages + interests + craft (not just languages + interests)
- `GraphNode` now has `personType` field
- Footer tests need updating for `FOOTER_COLUMNS`

**Step 3: Run full suite again**

Run: `npx jest --no-coverage`
Expected: ALL pass

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add -A
git commit -m "fix: update tests for 8-dimension architecture"
```

---

## Task 16: Push + Update PROGRESS.md

**Step 1: Update PROGRESS.md**

Add entry documenting:

- World data: 193 countries, ~70 languages
- 8 identity dimensions: Location, Languages, Faith, Craft, Passion, Reach, Culture, Market
- AI agent network: ~500-1000 personas across all countries
- 8-dimension scoring engine (complementary craft, reach compatibility, human premium)
- Discovery: 5-step flow
- Restored: referral, media, fashion pages
- Rich 4-column footer

**Step 2: Push**

```bash
git add PROGRESS.md
git commit -m "docs: update PROGRESS.md with world dimensions implementation"
git push origin main
```
