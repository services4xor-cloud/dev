---
name: becountry-big-picture
description: Strategic overview for Be[Country] ecosystem — vision alignment, phase tracking, multi-country expansion, metrics, and decision log.
---

# Be[Country] Big Picture

## When to Use

Run at the start of a planning session, when reviewing strategy, or when the user asks "where are we?"

## Vision Stack

```
Mission: Reverse colonial economic flows — people in the Global South
         move, work, and thrive on their own terms.

Scale:   Be[Country] → Be[Tribe] → Be[Location]
         One codebase, infinite identities.

Model:   Freemium (Pioneers free, Anchors $29-99/mo)
         Agent commission: 10% on placements
         Experience bookings: platform fee
```

## Strategic Review Process

### 1. Phase Assessment

Read `ROADMAP-LIVE.md` and `ROADMAP.md`:

- Which phase are we in? (1-5)
- What % of current phase items are complete?
- What's blocking the next phase?
- Are we on track for phase goals?

### 2. Multi-Country Expansion Status

Read `lib/countries.ts` for deployment configs:

| Country     | Code | Brand         | Currency | Payment       | Status   |
| ----------- | ---- | ------------- | -------- | ------------- | -------- |
| Kenya       | KE   | BeKenya       | KES      | M-Pesa        | ✅ Live  |
| Germany     | DE   | BeDeutschland | EUR      | SEPA          | ⬜ Ready |
| Nigeria     | NG   | BeNigeria     | NGN      | Flutterwave   | ⬜ Ready |
| Switzerland | CH   | BeSwitzerland | CHF      | TWINT         | ⬜ Ready |
| Thailand    | TH   | BeThailand    | THB      | Bank Transfer | ⬜ Ready |
| USA         | US   | BeUSA         | USD      | Stripe        | ⬜ Ready |

For each country, check:

- Env vars configured on Vercel?
- Payment provider credentials available?
- Language translations complete?
- Local agents generated?
- Country-specific content (hero, sectors, impact partner)?

### 3. Metrics Dashboard

| Metric        | Current                      | Phase Target | How to Measure |
| ------------- | ---------------------------- | ------------ | -------------- |
| Real Pages    | Count `app/**/page.tsx`      | 20+          | Glob count     |
| AI Agents     | `generateAllAgents().length` | ~700         | Code check     |
| DB Models     | Count in `schema.prisma`     | 16           | Schema check   |
| Test Coverage | Jest + Playwright            | 900+         | npm test       |
| Languages     | `LANGUAGE_REGISTRY` count    | 14           | Code check     |
| Countries     | `COUNTRY_OPTIONS` count      | 16           | Code check     |

### 4. Key Decisions Log

Read `REQUIREMENTS.md` for architecture decisions:

- Identity-first (language + culture > geography) ✅
- Tribes are top-level (`/be/maasai` not `/be/ke/maasai`) ✅
- One codebase, infinite identities ✅
- Complementary scoring (diversity > similarity) ✅
- Human Premium (+10 score bonus for real humans) ✅
- Mock → Real swap (service layer pattern) ✅

### 5. Risk Assessment

| Risk                        | Impact          | Mitigation                |
| --------------------------- | --------------- | ------------------------- |
| Payment credentials missing | Revenue blocked | HUMAN_MANUAL.md           |
| Single DB for all countries | Data isolation  | Per-country Neon projects |
| Agent quality               | User trust      | Deterministic + curated   |
| i18n gaps                   | Market reach    | 14 languages, expand      |

## Output Format

```
## 🌍 Be[Country] Big Picture

### Current Phase: [X] — [Name]
### Progress: [X]% complete
### Next Milestone: [description]

### Country Expansion
| Country | Ready | Blocker |
|---------|-------|---------|

### Key Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|

### Strategic Risks
1. [risk — mitigation]

### Recommended Next Actions
1. [action — impact — effort]
```
