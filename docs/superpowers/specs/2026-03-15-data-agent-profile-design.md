# Be[X] Data Perfection + Route-Aware Agent + Identity Profile

**Date:** 2026-03-15
**Status:** Draft (rev 2 — post-review fixes)
**Scope:** 3-layer plan — data audit, agent enrichment, profile identity graph

---

## Problem

The platform has 120+ countries with 14 fields each, dimension filters across 5 types, an AI agent, and a profile stub. Three things must happen for an outstanding Pioneer experience:

1. **Data must be correct** — wrong languages, sectors, or faiths break the agent's advice AND the map's glow logic
2. **Agent must know the route** — currently gets 6 optional strings; doesn't know distances, exchange rates, timezone diffs, or which countries were selected in what order
3. **Profile must persist identity** — currently just a greeting; should save selected dimensions and restore them on return, making the map "light up your world"

Additionally, **Opportunities** must show real links when dimension filters produce matches.

---

## Layer 1: Data Foundation

### 1.1 Extract shared utilities

**Problem:** `GREETINGS` map + `getBrowserGreeting()` duplicated in 3 files (agent, opportunities, profile).

**Action:** Create `lib/greetings.ts`, export `GREETINGS` and `getBrowserGreeting()`. Import in all 3 pages. Delete duplicates.

### 1.2 Country data audit

**Scope:** Every entry in `COUNTRY_OPTIONS` (lib/country-selector.ts).

**What to verify per country:**

- `languages[]` — correct primary language first, all major languages included, no phantom codes
- `topSectors[]` — reflect actual GDP/employment sectors (3-6 per country), ordered by economic value (money flow / GDP contribution, not country count), use canonical taxonomy (the 15 standard sectors already defined)
- `topFaiths[]` — accurate ordering by population percentage
- `currency` — correct ISO 4217 code
- `payment[]` — realistic payment methods for that market
- `visa` — reasonable visa description relative to Kenya (home market)
- `tz` — correct IANA timezone
- `lat/lng` — capital city coordinates (for Haversine distance)
- `region` — correct cluster assignment
- `corridorStrength` — reasonable relative to Kenya

**Method:** Systematic pass through all 120+ countries. Fix in place. No schema changes needed — just data corrections.

### 1.3 Filter logic audit

**Scope:** Verify dimension filter keys are consistent across all consumers.

**Components to check:**

- `app/api/map/enrich/route.ts` — generates filters per country click
- `app/api/map/dimensions/route.ts` — returns all selectable options
- `components/DimensionFilters.tsx` — filter UI
- `components/DimensionOverlapBar.tsx` — overlap display
- `components/CountryDimensions.tsx` — /be/[code] page display

**What to verify:**

- `nodeCode` format matches across enrich (producer) and dimensions (consumer)
- Sector codes: `toLowerCase().replace(/[^a-z0-9]+/g, '-')` used consistently
- Faith codes: raw lowercase strings (christianity, islam, etc.) match FAITH_OPTIONS
- Language codes: match LANGUAGE_REGISTRY keys
- Currency codes: lowercase ISO match

**Previous audit (session 64) found all clean.** Re-verify after any data corrections in 1.2.

### 1.4 Fix agent prompt vocabulary

**Bug:** `lib/ai.ts` currently tells the agent to use "Explorer, Host, Opportunity, Exchange, Discovery" — these are wrong. CLAUDE.md canonical vocabulary is Pioneer, Anchor, Path, Chapter, Venture, Compass. Fix as part of Layer 1 since it's a data-level correction.

---

## Layer 2: Route-Aware Agent

### 2.1 Extract route computation to `lib/route.ts`

**Problem:** `DimensionOverlapBar.tsx` contains ~80 lines of pure computation (haversine, timezone offset, rate fetching, hop building) mixed into a UI component. Both the overlap bar and the agent page need this logic.

**Action:** Create `lib/route.ts` with:

- `haversineKm(lat1, lng1, lat2, lng2)` — already exists in overlap bar
- `getTimezoneOffsetHrs(tz1, tz2)` — timezone diff
- `fetchExchangeRates(baseCurrency)` — with module-level cache
- `buildRouteHops(countryCodes)` — computes full hop chain
- `buildSharedDimensions(filters, countryCodes)` — finds cross-country overlaps

Refactor `DimensionOverlapBar` to import from `lib/route.ts`.

### 2.2 Expand AgentDimensions

**Current type:**

```typescript
interface AgentDimensions {
  country?: string
  language?: string
  faith?: string
  sector?: string
  currency?: string
  culture?: string
}
```

**New type:**

```typescript
interface AgentDimensions {
  country?: string
  languages?: string[] // plural — all selected, not just last
  faiths?: string[] // plural
  sectors?: string[] // plural
  currency?: string
  culture?: string
  /** Ordered country route from map selections */
  route?: RouteContext
}

interface RouteContext {
  countries: string[] // ordered codes: ["RU", "DE", "KE"]
  hops: RouteHop[] // between each pair
  sharedDimensions: SharedDim[] // what connects them
}

interface RouteHop {
  from: string // country code
  to: string // country code
  distanceKm: number
  timeDiffHrs: number // aligned with existing DimensionOverlapBar naming
  fromCurrency: string
  toCurrency: string
  rate: number | null // direct hop rate (aligned with HopInfo.rate)
  startRate: number | null // cumulative from route start (aligned with HopInfo.startRate)
  isNewCurrency: boolean // aligned with HopInfo.isNewCurrency
}

interface SharedDim {
  dimension: string // "language" | "sector" | "faith"
  value: string // "English", "Christianity", etc.
  countryCodes: string[] // which route countries share this
}
```

**Key decisions (from review):**

- Field names align with existing `HopInfo` in `DimensionOverlapBar` — no naming conflicts
- `languages/faiths/sectors` become arrays to capture all selected values, not just the last per dimension
- Backward compatible: `country` and `currency` stay singular strings

### 2.3 Build route context on agent page (CLIENT-SIDE)

**Where:** `app/agent/page.tsx`

**Critical:** Route context is computed **client-side** using `lib/route.ts`, then serialized into `dimensions.route` and sent to the API. The server does NOT fetch exchange rates or compute distances — it receives pre-computed data.

The agent page already reads `bex-map-enriched` from sessionStorage (the ordered country codes) and `bex-map-filters` (the dimension filters). Compute `RouteContext` from these:

- Countries: from `bex-map-enriched` (already in click order)
- Hops: via `buildRouteHops()` from `lib/route.ts` (reuses cached rates from overlap bar)
- Shared dimensions: via `buildSharedDimensions()` from filters that appear in 2+ countries

Pass as `dimensions.route` to `AgentChat`.

### 2.4 Enrich system prompt with route

**Where:** `lib/ai.ts` → `buildPersonaPrompt()`

When `dimensions.route` is present, add a "Route Context" section to the system prompt:

```
## Pioneer's Route: Russia → Germany → Kenya

### Hops
1. Moscow → Berlin: 1,600 km (~2h est.), UTC+3 → UTC+1 (-2h), RUB → EUR (rate: 0.0098)
2. Berlin → Nairobi: 6,300 km (~8h est.), UTC+1 → UTC+3 (+2h), EUR → KES (rate: 152.4, cumulative from RUB: 1.49)

### What Connects These Countries
- Christianity: shared across RU, DE, KE
- Financial Services: shared across DE, KE
- English: shared across DE, KE

### Total Route
- Distance: 7,900 km
- Currencies: 3 (RUB → EUR → KES)
- Time span: UTC+1 to UTC+3
```

**Graceful degradation:** If route context is incomplete (missing rates, unknown country), omit the section entirely rather than injecting nulls. The agent still works with the basic dimension strings.

**Flight times are estimates** (~distanceKm/800). The prompt labels them "est." so the agent doesn't state them as fact.

### 2.5 Opportunities page: dimension-matched links

**Where:** `app/opportunities/page.tsx`

**Data source:** Enhance the existing `/api/opportunities` endpoint with dimension-aware filtering. The DB already has seeded Paths (22 paths from 11 Anchors) tagged with country + sector.

**Behavior:**

- When dimension filters are active (from map selections), query Paths matching those dimensions
- Group results by dimension overlap: "Financial Services in Germany (3 Paths)", "Agriculture in Kenya (5 Paths)"
- Each result is a clickable link to the Path detail page
- When no filters active, show all opportunities (current behavior)
- Route context displayed in same `DimensionOverlapBar` as agent page

---

## Layer 3: Profile Identity Graph

### 3.1 Save Pioneer identity to DB

**When:** Pioneer is logged in and selects countries/dimensions on the map.

**Storage approach:** Use the existing graph model (Node + Edge tables) rather than adding new columns or tables. The Pioneer's User record already has a `Node` association. Store selected countries and dimensions as edges from the Pioneer's node:

- `SELECTED_COUNTRY` edges → country nodes
- `SELECTED_DIMENSION` edges → dimension nodes (language, sector, faith)
- Edge properties include `order` (for country click order) and `updatedAt`

This avoids schema migration and uses the graph layer as designed.

### 3.2 Restore on login

**When:** Pioneer returns to the map page while logged in (`session` exists).

**Action:** Fetch saved identity from DB via `/api/profile/identity` endpoint, hydrate sessionStorage, map glows with their saved countries. Agent remembers their route.

**Precedence rule:** If the Pioneer has manually selected countries in the current browser session (sessionStorage non-empty), that takes precedence over DB-saved state. DB restore only happens when sessionStorage is empty (fresh tab/session). This respects the Pioneer's current exploration without overwriting it.

### 3.3 Profile page shows identity

**Where:** `app/profile/page.tsx`

Expand the current stub to show:

- Greeting in browser language (already done)
- Avatar + name + email (already done)
- **Your Countries:** flags + names of saved countries
- **Your Dimensions:** language bridges, shared sectors, faith connections
- **Your Route:** summary (total distance, currencies crossed, timezone span)
- Sign out (already done)

No extra nav links. Minimalistic. Data-driven.

---

## Testing

- **Layer 1:** Snapshot tests for country data audit (verify no regressions after corrections). Unit tests for `lib/greetings.ts`.
- **Layer 2:** Unit tests for `lib/route.ts` (haversine, timezone, hop building). Unit tests for prompt generation with route context. Integration test for `/api/agent/chat` with route dimensions.
- **Layer 3:** API route tests for `/api/profile/identity` (save/load). Component test for profile page with mock session.

---

## Out of Scope

- Real-time "other Pioneers on your route" — future layer
- Cost of living, climate, cultural norms enrichment — future data expansion
- Multi-tab sessionStorage sync — works for now
- Streaming agent responses — current full-response approach is fine

---

## Dependencies

| Layer                     | Depends On            | Blocks                  |
| ------------------------- | --------------------- | ----------------------- |
| 1 (Data)                  | Nothing               | Layer 2, Layer 3        |
| 2 (Agent + Opportunities) | Layer 1               | Layer 3 (route context) |
| 3 (Profile)               | Layer 2 (route types) | Nothing                 |

---

## Files Changed

### Layer 1

- **New:** `lib/greetings.ts`
- **Modified:** `lib/country-selector.ts` (data corrections)
- **Modified:** `lib/ai.ts` (fix vocabulary: Explorer→Pioneer, Host→Anchor, etc.)
- **Modified:** `app/agent/page.tsx`, `app/opportunities/page.tsx`, `app/profile/page.tsx` (import greetings)

### Layer 2

- **New:** `lib/route.ts` (extracted route computation utilities)
- **Modified:** `types/domain.ts` (RouteContext, RouteHop, SharedDim types; AgentDimensions arrays)
- **Modified:** `components/DimensionOverlapBar.tsx` (import from lib/route.ts)
- **Modified:** `app/agent/page.tsx` (compute route context client-side, pass to chat)
- **Modified:** `components/AgentChat.tsx` (pass route to API)
- **Modified:** `lib/ai.ts` → `buildPersonaPrompt()` (route section in prompt, graceful degradation)
- **Modified:** `app/opportunities/page.tsx` (dimension-matched links from existing API)
- **Modified:** `app/api/opportunities/route.ts` (dimension filter query params)

### Layer 3

- **New:** `app/api/profile/identity/route.ts` (save/load Pioneer identity via graph edges)
- **Modified:** `app/profile/page.tsx` (show identity graph)
- **Modified:** `app/page.tsx` (restore saved identity on login when sessionStorage empty)
