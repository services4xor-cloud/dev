# Data Perfection + Route-Aware Agent + Identity Profile — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perfect the country data, make the agent route-aware with real distances/rates/timezones, and persist Pioneer identity so the map lights up their world on return.

**Architecture:** 3 layers in dependency order. Layer 1 fixes data foundation (greetings extraction, country audit, vocab fix). Layer 2 extracts route computation to `lib/route.ts`, expands `AgentDimensions` with route context computed client-side, enriches the agent prompt, and adds dimension-matched links to Opportunities. Layer 3 saves Pioneer identity to the graph DB and restores it on login.

**Tech Stack:** Next.js 14, TypeScript, Tailwind, Prisma + Neon PostgreSQL, Anthropic Claude API, open.er-api.com (exchange rates)

**Spec:** `docs/superpowers/specs/2026-03-15-data-agent-profile-design.md`

---

## File Structure

### New Files

| File                                | Responsibility                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `lib/greetings.ts`                  | Browser language detection + GREETINGS map (extracted from 3 pages)                                       |
| `lib/route.ts`                      | Haversine, timezone, exchange rates, hop building, shared dimensions (extracted from DimensionOverlapBar) |
| `app/api/profile/identity/route.ts` | GET/PUT Pioneer identity via graph edges                                                                  |
| `__tests__/lib/greetings.test.ts`   | Unit tests for greetings                                                                                  |
| `__tests__/lib/route.test.ts`       | Unit tests for route computation                                                                          |

### Modified Files

| File                                 | Changes                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `app/agent/page.tsx`                 | Import greetings, build RouteContext client-side, pass to AgentChat       |
| `app/opportunities/page.tsx`         | Import greetings, dimension-matched Path links                            |
| `app/profile/page.tsx`               | Import greetings, show saved identity                                     |
| `lib/country-selector.ts`            | Data corrections (languages, sectors, faiths, currencies)                 |
| `lib/ai.ts`                          | Fix vocabulary, add route context section to prompt, graceful degradation |
| `types/domain.ts`                    | Add RouteContext, RouteHop, SharedDim; expand AgentDimensions to arrays   |
| `components/DimensionOverlapBar.tsx` | Import haversine/timezone/rates from lib/route.ts                         |
| `components/AgentChat.tsx`           | Pass route in dimensions to API                                           |
| `app/page.tsx`                       | Restore saved identity from DB on login (when sessionStorage empty)       |
| `app/api/opportunities/route.ts`     | Accept dimension filter query params                                      |
| `prisma/schema.prisma`               | Add SELECTED_COUNTRY, SELECTED_DIMENSION to EdgeRelation enum             |

**Note:** Line number references throughout this plan are approximate. Locate code by content, not line number — earlier tasks may shift lines.

---

## Chunk 1: Layer 1 — Data Foundation

### Task 1: Extract GREETINGS to lib/greetings.ts

**Files:**

- Create: `lib/greetings.ts`
- Modify: `app/agent/page.tsx`
- Modify: `app/opportunities/page.tsx`
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Create `lib/greetings.ts`**

```typescript
/** Browser language greeting — shared across agent, opportunities, profile pages */
const GREETINGS: Record<string, string> = {
  en: 'Hello',
  de: 'Hallo',
  fr: 'Bonjour',
  es: 'Hola',
  pt: 'Olá',
  it: 'Ciao',
  nl: 'Hallo',
  pl: 'Cześć',
  ru: 'Привет',
  uk: 'Привіт',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  ar: 'مرحبا',
  hi: 'नमस्ते',
  sw: 'Habari',
  tr: 'Merhaba',
  th: 'สวัสดี',
  vi: 'Xin chào',
  id: 'Halo',
  ms: 'Halo',
  ro: 'Bună',
  cs: 'Ahoj',
  hu: 'Szia',
  sv: 'Hej',
  no: 'Hei',
  da: 'Hej',
  fi: 'Hei',
  el: 'Γεια σου',
  he: 'שלום',
  bn: 'হ্যালো',
  ta: 'வணக்கம்',
  te: 'హలో',
  fa: 'سلام',
}

export function getBrowserGreeting(): string {
  if (typeof navigator === 'undefined') return GREETINGS.en
  const lang = navigator.language?.slice(0, 2)?.toLowerCase()
  return GREETINGS[lang] ?? GREETINGS.en
}
```

- [ ] **Step 2: Update `app/agent/page.tsx`**

Remove the local `GREETINGS` constant (lines 10-45) and `getBrowserGreeting` function (lines 47-51). Add import:

```typescript
import { getBrowserGreeting } from '@/lib/greetings'
```

- [ ] **Step 3: Update `app/opportunities/page.tsx`**

Same removal of local `GREETINGS` (lines 9-44) and `getBrowserGreeting` (lines 46-50). Add import:

```typescript
import { getBrowserGreeting } from '@/lib/greetings'
```

- [ ] **Step 4: Update `app/profile/page.tsx`**

Same removal of local `GREETINGS` (lines 9-43) and `getBrowserGreeting` (lines 45-49). Add import:

```typescript
import { getBrowserGreeting } from '@/lib/greetings'
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors. All three pages import from the shared module.

- [ ] **Step 6: Commit**

```bash
git add lib/greetings.ts app/agent/page.tsx app/opportunities/page.tsx app/profile/page.tsx
git commit -m "refactor: extract shared GREETINGS to lib/greetings.ts (DRY)"
```

---

### Task 2: Fix agent prompt vocabulary

**Files:**

- Modify: `lib/ai.ts:108-121`

- [ ] **Step 1: Fix vocabulary in `lib/ai.ts`**

Replace line 119:

```typescript
// OLD:
'- Use Be[X] vocabulary: Explorer (user), Host (employer), Opportunity (job/experience), Exchange (interaction), Discovery (search)'
// NEW:
'- Use Be[X] vocabulary: Pioneer (person seeking paths), Anchor (organization offering paths), Path (what Anchors post), Chapter (Pioneer engaging a Path), Venture (experience + professional placement), Compass (smart route wizard)'
```

Also fix line 53 — change `"the user's identity dimensions"` to `"the Pioneer's identity dimensions"`.
And line 115 — change `"the user's dimensions"` to `"the Pioneer's dimensions"`.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai.ts
git commit -m "fix: correct agent vocabulary to Pioneer/Anchor/Path/Chapter/Venture/Compass"
```

---

### Task 3: Country data audit

**Files:**

- Modify: `lib/country-selector.ts`

This is the largest task. Systematically verify all 120+ countries.

- [ ] **Step 1: Audit regions A-E (Africa, Americas, Asia, Europe — ~30 countries each)**

For each country in `COUNTRY_OPTIONS`, verify against known facts:

- `languages[]` — primary language first, include all major languages with valid LANGUAGE_REGISTRY codes
- `topSectors[]` — ordered by GDP/economic value (not country count), using the 15 canonical sectors
- `topFaiths[]` — ordered by population percentage
- `currency` — correct ISO 4217 code
- `payment[]` — realistic for that market
- `tz` — correct IANA timezone for the capital
- `lat/lng` — capital city coordinates

Use web search to verify any uncertain data points. Fix in place.

**Strategy:** Work through countries alphabetically within each region. Use parallel subagents for different regions if available.

- [ ] **Step 2: Verify no LANGUAGE_REGISTRY phantom codes**

Run a check: every language code in any country's `languages[]` array must exist as a key in `LANGUAGE_REGISTRY`. Log any mismatches.

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Verify no orphaned sector names**

Check that all sector names in `topSectors[]` match the canonical 15-sector taxonomy. Log any non-standard names.

- [ ] **Step 4: Run existing tests**

Run: `npm run test`
Expected: All existing tests still pass (no regressions from data corrections).

- [ ] **Step 5: Commit**

```bash
git add lib/country-selector.ts
git commit -m "data: audit and correct 120+ country entries (languages, sectors, faiths, currencies)"
```

---

### Task 4: Filter logic re-audit

**Files (read-only verification):**

- `app/api/map/enrich/route.ts`
- `app/api/map/dimensions/route.ts`
- `components/DimensionFilters.tsx`
- `components/DimensionOverlapBar.tsx`
- `components/CountryDimensions.tsx`

- [ ] **Step 1: Verify nodeCode format consistency**

Check that:

- Sector codes use `toLowerCase().replace(/[^a-z0-9]+/g, '-')` in both enrich (line 79) and dimensions (line 68)
- Faith codes are raw lowercase strings matching FAITH_OPTIONS ids
- Language codes match LANGUAGE_REGISTRY keys
- Currency codes are lowercase ISO

- [ ] **Step 2: Document any fixes needed**

If inconsistencies found after the data corrections in Task 3, fix them. Otherwise, confirm clean.

- [ ] **Step 3: Commit (if changes)**

```bash
git add app/api/map/enrich/route.ts app/api/map/dimensions/route.ts components/DimensionFilters.tsx components/DimensionOverlapBar.tsx components/CountryDimensions.tsx
git commit -m "fix: resolve any filter key inconsistencies from data audit"
```

---

## Chunk 2: Layer 2 — Route-Aware Agent

### Task 5: Extract route computation to `lib/route.ts`

**Files:**

- Create: `lib/route.ts`
- Modify: `components/DimensionOverlapBar.tsx`

- [ ] **Step 1: Create `lib/route.ts`**

Extract from `DimensionOverlapBar.tsx` (lines 81-139, 200-256):

```typescript
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

/** Haversine distance between two lat/lng points in km */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = Math.PI / 180
  const dLat = (lat2 - lat1) * toRad
  const dLng = (lng2 - lng1) * toRad
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** UTC offset in minutes for an IANA timezone */
export function getUtcOffsetMinutes(tz: string): number {
  try {
    const now = new Date()
    const str = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const match = str.match(/GMT([+-]\d{1,2}(?::?\d{2})?)/)
    if (!match) return 0
    const parts = match[1].replace(':', '').match(/^([+-])(\d{1,2})(\d{2})?$/)
    if (!parts) return 0
    const sign = parts[1] === '-' ? -1 : 1
    return sign * (parseInt(parts[2]) * 60 + parseInt(parts[3] ?? '0'))
  } catch {
    return 0
  }
}

/** Module-level exchange rate cache */
const rateCache: Record<string, Record<string, number>> = {}

/** Fetch exchange rates for a base currency (cached) */
export async function fetchExchangeRates(base: string): Promise<Record<string, number>> {
  if (rateCache[base]) return rateCache[base]
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    if (!res.ok) return {}
    const data = await res.json()
    rateCache[base] = data.rates ?? {}
    return rateCache[base]
  } catch {
    return {}
  }
}

/** Look up a country by code from COUNTRY_OPTIONS */
export function findCountry(code: string) {
  return COUNTRY_OPTIONS.find((c) => c.code === code)
}
```

- [ ] **Step 2: Refactor `DimensionOverlapBar.tsx`**

Replace local `haversineKm`, `getUtcOffsetMinutes`, `fetchRates` (and `rateCache`) with imports:

```typescript
import { haversineKm, getUtcOffsetMinutes, fetchExchangeRates, findCountry } from '@/lib/route'
```

Delete lines 81-139 (local implementations). Update all call sites:

- `fetchRates(` → `fetchExchangeRates(`
- Direct haversine/timezone calls stay the same (same signatures)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors. DimensionOverlapBar still works with extracted imports.

- [ ] **Step 4: Commit**

```bash
git add lib/route.ts components/DimensionOverlapBar.tsx
git commit -m "refactor: extract route computation to lib/route.ts (haversine, timezone, rates)"
```

---

### Task 6: Expand AgentDimensions + add route types

**Files:**

- Modify: `types/domain.ts`

- [ ] **Step 1: Add RouteContext, RouteHop, SharedDim types and expand AgentDimensions**

In `types/domain.ts`, after the existing `AgentDimensions` interface:

```typescript
// ─── Route types ─────────────────────────────────────────────

export interface RouteContext {
  countries: string[]
  hops: RouteHop[]
  sharedDimensions: SharedDim[]
}

export interface RouteHop {
  from: string
  to: string
  distanceKm: number
  timeDiffHrs: number
  fromCurrency: string
  toCurrency: string
  rate: number | null
  startRate: number | null
  isNewCurrency: boolean
}

export interface SharedDim {
  dimension: string
  value: string
  countryCodes: string[]
}
```

Update `AgentDimensions`:

```typescript
export interface AgentDimensions {
  country?: string
  language?: string // keep singular for backward compat
  languages?: string[] // all selected languages
  faith?: string
  faiths?: string[]
  sector?: string
  sectors?: string[]
  currency?: string
  culture?: string
  route?: RouteContext
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors. Existing consumers still work (singular fields preserved).

- [ ] **Step 3: Commit**

```bash
git add types/domain.ts
git commit -m "feat: add RouteContext/RouteHop/SharedDim types, expand AgentDimensions"
```

---

### Task 7: Build route context on agent page (client-side)

**Files:**

- Modify: `app/agent/page.tsx:94-107`

- [ ] **Step 1: Add route context builder functions to `lib/route.ts`**

Append to `lib/route.ts`:

```typescript
import type { RouteContext, RouteHop, SharedDim } from '@/types/domain'
import type { ActiveFilter } from '@/components/DimensionFilters'

/** Build full route context from ordered country codes and active filters */
export async function buildRouteContext(
  countryCodes: string[],
  filters: ActiveFilter[]
): Promise<RouteContext | undefined> {
  if (countryCodes.length < 1) return undefined

  const hops: RouteHop[] = []
  const seenCurrencies = new Set<string>()
  let startCurrency = ''

  // Find start currency
  const firstCountry = findCountry(countryCodes[0])
  if (firstCountry) {
    startCurrency = firstCountry.currency
    seenCurrencies.add(startCurrency)
  }

  // Fetch rates from start currency
  const rates = startCurrency ? await fetchExchangeRates(startCurrency) : {}

  // Build hops between sequential pairs
  for (let i = 0; i < countryCodes.length - 1; i++) {
    const fromC = findCountry(countryCodes[i])
    const toC = findCountry(countryCodes[i + 1])
    if (!fromC || !toC) continue

    const distanceKm = Math.round(haversineKm(fromC.lat, fromC.lng, toC.lat, toC.lng))
    const fromOffset = getUtcOffsetMinutes(fromC.tz)
    const toOffset = getUtcOffsetMinutes(toC.tz)
    const timeDiffHrs = (toOffset - fromOffset) / 60

    const isNewCurrency = !seenCurrencies.has(toC.currency)
    if (isNewCurrency) seenCurrencies.add(toC.currency)

    // Cross-rate: rates are relative to startCurrency
    const fromRate = fromC.currency === startCurrency ? 1 : (rates[fromC.currency] ?? null)
    const toRate = rates[toC.currency] ?? null
    const hopRate = fromRate && toRate ? toRate / fromRate : null
    const cumulativeRate = isNewCurrency && toRate ? toRate : null

    hops.push({
      from: fromC.code,
      to: toC.code,
      distanceKm,
      timeDiffHrs,
      fromCurrency: fromC.currency,
      toCurrency: toC.currency,
      rate: hopRate,
      startRate: cumulativeRate,
      isNewCurrency,
    })
  }

  // Build shared dimensions
  const sharedDimensions = buildSharedDimensions(filters, countryCodes)

  return { countries: countryCodes, hops, sharedDimensions }
}

/** Find dimensions shared by 2+ countries in the route */
export function buildSharedDimensions(
  filters: ActiveFilter[],
  countryCodes: string[]
): SharedDim[] {
  const routeSet = new Set(countryCodes)
  const shared: SharedDim[] = []
  const seen = new Set<string>()

  for (const f of filters) {
    if (!f.countryCodes) continue
    const key = `${f.dimension}:${f.nodeCode}`
    if (seen.has(key)) continue
    seen.add(key)

    const matchingRoute = f.countryCodes.filter((c) => routeSet.has(c))
    if (matchingRoute.length >= 2) {
      shared.push({
        dimension: f.dimension,
        value: f.label,
        countryCodes: matchingRoute,
      })
    }
  }

  return shared
}
```

- [ ] **Step 2: Update agent page dimension conversion**

In `app/agent/page.tsx`, replace the dimension conversion block (lines 94-107):

```typescript
import { buildRouteContext } from '@/lib/route'
import type { AgentDimensions, RouteContext } from '@/types/domain'

// State for route context
const [routeContext, setRouteContext] = useState<RouteContext | undefined>(undefined)

// Build route context when enriched countries or filters change
// Note: enrichedCountries is read from sessionStorage (set by parent),
// but we also key on filters which change when countries are enriched
useEffect(() => {
  const codes: string[] = []
  try {
    const raw = sessionStorage.getItem('bex-map-enriched')
    if (raw) codes.push(...JSON.parse(raw))
  } catch {
    /* ignore */
  }

  if (codes.length > 0) {
    void buildRouteContext(codes, filters).then(setRouteContext)
  } else {
    setRouteContext(undefined)
  }
}, [filters]) // filters change whenever countries are enriched/removed, so this captures both

// Convert filters to AgentDimensions
const dimensions: AgentDimensions = {}
const langSet: string[] = []
const faithSet: string[] = []
const sectorSet: string[] = []
for (const f of filters) {
  if (f.dimension === 'language') {
    dimensions.language = f.nodeCode
    langSet.push(f.nodeCode)
  }
  if (f.dimension === 'faith') {
    dimensions.faith = f.nodeCode
    faithSet.push(f.nodeCode)
  }
  if (f.dimension === 'sector') {
    dimensions.sector = f.nodeCode
    sectorSet.push(f.nodeCode)
  }
  if (f.dimension === 'culture') dimensions.culture = f.nodeCode
}
if (langSet.length > 0) dimensions.languages = langSet
if (faithSet.length > 0) dimensions.faiths = faithSet
if (sectorSet.length > 0) dimensions.sectors = sectorSet
if (routeContext) dimensions.route = routeContext

// Fallback country from map selection
if (!dimensions.country) {
  const selected = typeof window !== 'undefined' ? sessionStorage.getItem('bex-map-selected') : null
  if (selected) dimensions.country = selected
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add lib/route.ts app/agent/page.tsx
git commit -m "feat: build route context client-side on agent page"
```

---

### Task 8: Enrich agent system prompt with route context

**Files:**

- Modify: `lib/ai.ts:45-122`

- [ ] **Step 1: Add route context section to `buildPersonaPrompt`**

In `lib/ai.ts`, after the existing dimension loop (after line 106), add:

```typescript
import type { AgentDimensions, RouteContext } from '@/types/domain'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

// Inside buildPersonaPrompt, after the node loop and before behavior section:

// Route context — only if route is present and has valid hops
if (dimensions.route && dimensions.route.hops.length > 0) {
  const route = dimensions.route
  const countryNames = route.countries.map((code) => {
    const c = COUNTRY_OPTIONS.find((co) => co.code === code)
    return c?.name ?? code
  })

  parts.push('')
  parts.push(`## Pioneer's Route: ${countryNames.join(' → ')}`)
  parts.push('')
  parts.push('### Hops')

  let totalDistance = 0
  for (let i = 0; i < route.hops.length; i++) {
    const hop = route.hops[i]
    totalDistance += hop.distanceKm
    const fromName = COUNTRY_OPTIONS.find((c) => c.code === hop.from)?.name ?? hop.from
    const toName = COUNTRY_OPTIONS.find((c) => c.code === hop.to)?.name ?? hop.to
    const flightEst = (hop.distanceKm / 800).toFixed(1)
    const tzSign = hop.timeDiffHrs >= 0 ? '+' : ''

    let line = `${i + 1}. ${fromName} → ${toName}: ${hop.distanceKm.toLocaleString()} km (~${flightEst}h est.)`
    line += `, ${tzSign}${hop.timeDiffHrs}h timezone`

    if (hop.isNewCurrency && hop.rate != null) {
      line += `, ${hop.fromCurrency} → ${hop.toCurrency} (rate: ${hop.rate.toPrecision(4)}`
      if (hop.startRate != null) {
        line += `, cumulative: ${hop.startRate.toPrecision(4)}`
      }
      line += ')'
    }
    parts.push(line)
  }

  if (route.sharedDimensions.length > 0) {
    parts.push('')
    parts.push('### What Connects These Countries')
    for (const sd of route.sharedDimensions) {
      parts.push(`- ${sd.value} (${sd.dimension}): shared across ${sd.countryCodes.join(', ')}`)
    }
  }

  parts.push('')
  parts.push('### Total Route')
  parts.push(`- Distance: ${totalDistance.toLocaleString()} km`)
  const currencies = new Set(route.hops.flatMap((h) => [h.fromCurrency, h.toCurrency]))
  parts.push(`- Currencies: ${currencies.size} (${Array.from(currencies).join(' → ')})`)
}
```

- [ ] **Step 2: Update the filter in `buildPersonaPrompt` to handle route**

The existing line 47 filters out falsy values from dimensions before passing to `buildAgentContext`. The `route` object is truthy but not a string dimension — it should be excluded from the graph context lookup:

```typescript
// Replace line 47:
const dimensionStrings = Object.fromEntries(
  Object.entries(dimensions).filter(
    ([k, v]) => v && k !== 'route' && k !== 'languages' && k !== 'faiths' && k !== 'sectors'
  )
)
const context = await buildAgentContext(dimensionStrings)
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add lib/ai.ts
git commit -m "feat: enrich agent prompt with route context (distances, rates, shared dims)"
```

---

### Task 9: Pass route through AgentChat to API

**Files:**

- Modify: `components/AgentChat.tsx`
- Modify: `app/api/agent/chat/route.ts`

- [ ] **Step 1: AgentChat already passes `dimensions` as-is**

Verify that `AgentChat.tsx` line 40 sends `dimensions` directly:

```typescript
body: JSON.stringify({ dimensions, message: userMessage, conversationId })
```

Since `dimensions` now includes `route`, it flows through automatically. No changes needed here if the prop type is `AgentDimensions`.

- [ ] **Step 2: Update API route to pass full dimensions**

In `app/api/agent/chat/route.ts`, verify that `buildPersonaPrompt(dimensions)` receives the full object including `route`. The current code at line 49-50 already passes dimensions directly:

```typescript
const systemPrompt = await buildPersonaPrompt(dimensions)
```

This should work as-is since we updated `buildPersonaPrompt` to handle the route field.

- [ ] **Step 3: Verify end-to-end**

Run: `npx tsc --noEmit`
Test manually: Select 2+ countries on map → go to Agent → chat should include route context in system prompt.

- [ ] **Step 4: Commit (if any changes needed)**

```bash
git add components/AgentChat.tsx app/api/agent/chat/route.ts
git commit -m "feat: agent chat receives full route context from client"
```

---

### Task 10: Opportunities page — dimension-matched links

**Files:**

- Modify: `app/opportunities/page.tsx`
- Modify: `app/api/opportunities/route.ts` (or create if not exists)

- [ ] **Step 1: Add dimension filter params to opportunities fetch**

Update the `useEffect` fetch in `app/opportunities/page.tsx` (lines 108-123) to include active dimension filters as query params:

```typescript
useEffect(() => {
  async function fetchOpportunities() {
    try {
      // Build query params from active filters
      const params = new URLSearchParams()
      for (const f of filters) {
        if (f.dimension === 'sector') params.append('sector', f.label)
        if (f.dimension === 'language') params.append('language', f.nodeCode)
      }
      // Include route countries
      const enriched = sessionStorage.getItem('bex-map-enriched')
      if (enriched) {
        const codes = JSON.parse(enriched) as string[]
        for (const code of codes) params.append('country', code)
      }

      const url = `/api/opportunities${params.toString() ? `?${params}` : ''}`
      const res = await fetch(url)
      if (res.ok) {
        const data = (await res.json()) as Opportunity[]
        setOpportunities(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }
  void fetchOpportunities()
}, [filters])
```

- [ ] **Step 2: Show grouped results when filters active**

When opportunities are loaded and filters are active, group them by matching dimension. Display each group with a heading and clickable links:

```typescript
// In the render, replace or augment the opportunity grid:
{filters.length > 0 && opportunities.length > 0 && (
  <div className="mb-6 space-y-4">
    <h3 className="text-sm font-semibold text-brand-accent">Matching your route</h3>
    {opportunities.map((opp) => (
      <a
        key={opp.id}
        href={`/ventures/${opp.id}`}
        className="block rounded-lg border border-brand-accent/10 bg-brand-surface p-3 transition hover:border-brand-accent/30"
      >
        <p className="text-sm font-medium text-brand-text">{opp.title}</p>
        <p className="text-xs text-brand-text-muted">{opp.company} · {opp.sector}</p>
      </a>
    ))}
  </div>
)}
```

- [ ] **Step 3: Update API route to handle dimension filter params**

In `app/api/opportunities/route.ts`, update the GET handler to accept `sector`, `language`, and `country` query params and filter results accordingly:

```typescript
// Parse query params
const { searchParams } = new URL(req.url)
const sectors = searchParams.getAll('sector')
const languages = searchParams.getAll('language')
const countries = searchParams.getAll('country')

// Apply filters to query if present
let where: Record<string, unknown> = {}
if (sectors.length > 0) where.sector = { in: sectors }
if (countries.length > 0) where.country = { in: countries }
// Language filter: match opportunities where the country speaks the language
```

If the endpoint doesn't exist yet, create it based on existing API patterns (check `app/api/` for examples).

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors. Opportunities page shows filtered results when dimension filters are active.

- [ ] **Step 5: Commit**

```bash
git add app/opportunities/page.tsx app/api/opportunities/route.ts
git commit -m "feat: opportunities page shows dimension-matched links from active filters"
```

---

## Chunk 3: Layer 3 — Profile Identity Graph

### Task 11: Save/load Pioneer identity API

**Files:**

- Create: `app/api/profile/identity/route.ts`

- [ ] **Step 1: Create the identity API route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/profile/identity
 * Returns the Pioneer's saved countries and dimensions from graph edges.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      node: {
        include: {
          outEdges: {
            where: { relation: { in: ['SELECTED_COUNTRY', 'SELECTED_DIMENSION'] } },
            include: { to: true },
            orderBy: { weight: 'asc' }, // weight = click order
          },
        },
      },
    },
  })

  if (!user?.node) {
    return NextResponse.json({ countries: [], dimensions: [] })
  }

  const countries = user.node.outEdges
    .filter((e) => e.relation === 'SELECTED_COUNTRY')
    .map((e) => ({ code: e.to.code, name: e.to.label, order: e.weight ?? 0 }))
    .sort((a, b) => a.order - b.order)

  const dimensions = user.node.outEdges
    .filter((e) => e.relation === 'SELECTED_DIMENSION')
    .map((e) => ({
      dimension: e.to.type.toLowerCase(),
      code: e.to.code,
      label: e.to.label,
    }))

  return NextResponse.json({ countries, dimensions })
}

/**
 * PUT /api/profile/identity
 * Saves the Pioneer's selected countries and dimensions as graph edges.
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { countries, filters } = body as {
    countries: string[]
    filters: { dimension: string; nodeCode: string; label: string }[]
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { node: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Ensure user has a node
  let userNode = user.node
  if (!userNode) {
    userNode = await prisma.node.create({
      data: {
        type: 'PERSON',
        code: user.id,
        label: user.name ?? user.email,
        userId: user.id,
        active: true,
      },
    })
  }

  // Delete existing identity edges
  await prisma.edge.deleteMany({
    where: {
      fromId: userNode.id,
      relation: { in: ['SELECTED_COUNTRY', 'SELECTED_DIMENSION'] },
    },
  })

  // Create country edges (with click order as weight)
  for (let i = 0; i < countries.length; i++) {
    const countryNode = await prisma.node.findUnique({
      where: { type_code: { type: 'COUNTRY', code: countries[i] } },
    })
    if (countryNode) {
      await prisma.edge.create({
        data: {
          fromId: userNode.id,
          toId: countryNode.id,
          relation: 'SELECTED_COUNTRY',
          weight: i,
        },
      })
    }
  }

  // Create dimension edges
  for (const f of filters) {
    const nodeType = f.dimension.toUpperCase()
    const dimNode = await prisma.node.findUnique({
      where: { type_code: { type: nodeType as any, code: f.nodeCode } },
    })
    if (dimNode) {
      await prisma.edge.create({
        data: {
          fromId: userNode.id,
          toId: dimNode.id,
          relation: 'SELECTED_DIMENSION',
        },
      })
    }
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Add SELECTED_COUNTRY and SELECTED_DIMENSION to EdgeRelation enum**

In `prisma/schema.prisma`, find the `EdgeRelation` enum and add:

```prisma
  SELECTED_COUNTRY
  SELECTED_DIMENSION
```

Then sync the schema:

```bash
npx prisma db push
npx prisma generate
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/profile/identity/route.ts prisma/schema.prisma
git commit -m "feat: Pioneer identity save/load API via graph edges"
```

---

### Task 12: Save identity from map page

**Files:**

- Modify: `app/page.tsx`

- [ ] **Step 1: Auto-save identity when Pioneer is logged in and selects countries**

In `app/page.tsx`, add a debounced save effect after the existing sessionStorage sync (after line 119):

```typescript
// Auto-save identity to DB when logged in
useEffect(() => {
  if (!hydrated || !session?.user) return
  if (enrichedCountries.length === 0) return

  const timer = setTimeout(() => {
    void fetch('/api/profile/identity', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countries: enrichedCountries,
        filters: filters.map((f) => ({
          dimension: f.dimension,
          nodeCode: f.nodeCode,
          label: f.label,
        })),
      }),
    })
  }, 2000) // debounce 2s to avoid rapid saves

  return () => clearTimeout(timer)
}, [hydrated, session, enrichedCountries, filters])
```

- [ ] **Step 2: Restore identity on fresh session**

In the hydration `useEffect` (lines 75-87), add DB restore when sessionStorage is empty:

```typescript
useEffect(() => {
  let restored = false
  try {
    const rawEnriched = sessionStorage.getItem('bex-map-enriched')
    if (rawEnriched) {
      setEnrichedCountries(JSON.parse(rawEnriched) as string[])
      restored = true
    }
    const rawFilters = sessionStorage.getItem('bex-map-filters')
    if (rawFilters) setFilters(JSON.parse(rawFilters) as ActiveFilter[])
    const rawNames = sessionStorage.getItem('bex-map-enriched-names')
    if (rawNames) setEnrichedNames(JSON.parse(rawNames) as Record<string, string>)
  } catch {
    // Corrupted storage — start fresh
  }

  // If sessionStorage was empty and Pioneer is logged in, try DB restore
  // enrichCountry is already defined in this component (useCallback, line ~225)
  if (!restored && status === 'authenticated') {
    void fetch('/api/profile/identity')
      .then((r) => r.json())
      .then((data) => {
        if (data.countries?.length > 0) {
          const codes = data.countries.map((c: { code: string }) => c.code)
          const names: Record<string, string> = {}
          for (const c of data.countries) names[c.code] = c.name
          setEnrichedCountries(codes)
          setEnrichedNames(names)
          // Re-enrich each country to rebuild filters via existing enrichCountry callback
          for (const code of codes) {
            void enrichCountry(code, names[code] ?? code)
          }
        }
      })
      .catch(() => {
        /* silently fail */
      })
  }

  setHydrated(true)
}, [status, enrichCountry]) // use status (string) not session (object ref) to avoid re-renders
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: auto-save and restore Pioneer identity from graph DB"
```

---

### Task 13: Profile page shows identity

**Files:**

- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Fetch and display saved identity**

Replace the current minimal profile content with identity display:

```typescript
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getBrowserGreeting } from '@/lib/greetings'

interface SavedCountry { code: string; name: string; order: number }
interface SavedDimension { dimension: string; code: string; label: string }

function countryFlag(code: string): string {
  try {
    return String.fromCodePoint(
      ...code.toUpperCase().split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    )
  } catch { return '🌍' }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [greeting, setGreeting] = useState('Hello')
  const [countries, setCountries] = useState<SavedCountry[]>([])
  const [dimensions, setDimensions] = useState<SavedDimension[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setGreeting(getBrowserGreeting()) }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    void fetch('/api/profile/identity')
      .then((r) => r.json())
      .then((data) => {
        setCountries(data.countries ?? [])
        setDimensions(data.dimensions ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status])

  if (status === 'unauthenticated') redirect('/login')

  const name = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'Pioneer'

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">{greeting}, {name}</h1>
            <p className="text-sm text-brand-text-muted">Your Be[X] identity</p>
          </div>
          <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
            &larr; Map
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-6">
        <div className="text-center">
          {session?.user?.image && (
            <Image src={session.user.image} alt={name} width={80} height={80}
              className="mx-auto mb-4 rounded-full border-2 border-brand-accent/30" />
          )}
          <p className="text-lg text-brand-text">{name}</p>
          {session?.user?.email && (
            <p className="mt-1 text-sm text-brand-text-muted">{session.user.email}</p>
          )}
        </div>

        {/* Identity — countries */}
        {!loading && countries.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-brand-accent/70">Your Countries</h2>
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => (
                <span key={c.code}
                  className="rounded-full border border-brand-accent/20 bg-brand-surface px-3 py-1 text-sm text-brand-text">
                  {countryFlag(c.code)} {c.name}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-brand-text-muted">
              Route: {countries.map((c) => countryFlag(c.code)).join(' → ')}
            </p>
          </div>
        )}

        {/* Identity — dimensions */}
        {!loading && dimensions.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-brand-accent/70">Your Dimensions</h2>
            <div className="flex flex-wrap gap-2">
              {dimensions.map((d) => (
                <span key={`${d.dimension}:${d.code}`}
                  className="rounded-full border border-brand-accent/10 bg-brand-surface px-3 py-1 text-xs text-brand-text-muted">
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {!loading && countries.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-brand-text-muted">
              Select countries on the <a href="/" className="text-brand-accent hover:underline">map</a> to build your identity
            </p>
          </div>
        )}

        <div className="mt-auto pt-8 text-center">
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-full border border-brand-accent/30 px-5 py-2 text-sm text-brand-text-muted transition hover:border-brand-accent/50 hover:text-brand-accent">
            Sign out
          </button>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/profile/page.tsx
git commit -m "feat: profile page shows Pioneer identity (countries, dimensions, route)"
```

---

### Task 14: Final verification + push

- [ ] **Step 1: Run full test suite**

```bash
npm run test
npx tsc --noEmit
```

Expected: All tests pass, 0 type errors.

- [ ] **Step 2: Manual smoke test**

1. Open map → select 2-3 countries → verify glow + dimension chips
2. Open Agent → chat → verify route context in agent response
3. Open Opportunities → verify dimension-matched links appear
4. Sign in → select countries → sign out → sign back in → verify map restores
5. Open Profile → verify countries + dimensions shown

- [ ] **Step 3: Push**

```bash
git push origin main
```
