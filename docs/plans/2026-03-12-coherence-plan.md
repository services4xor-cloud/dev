# Be[Country] Coherence Plan

> **Goal:** Turn a prototype with 34 pages into a consistent, revenue-generating product.
> **Revenue Model:** C — Both Pioneer and Anchor pay a platform fee when they formalize a Path (Airbnb model).
> **Date:** 2026-03-12

---

## Current State (Honest)

### What works

- 6 core pages fully translated (Homepage, Exchange, World, Compass, Nav, IdentitySwitcher)
- Country/language switcher shows correct languages per country
- Auth works (email/password verified, Google OAuth needs human setup)
- 25/25 Jest tests, 102/102 Playwright tests pass
- Build compiles clean

### What's broken

- **9 pages with real content still hardcoded English** — fashion, media, referral, pricing, me, messages, privacy, experiences/[id], ventures/[id]
- **10 redirect-only pages** that add complexity for zero value
- **NetworkGraph on `/world`** — shows mock nodes, not real connections
- **Graph on homepage** — decorative, not functional
- **Corridor indicator (flag→flag)** — badge only, leads nowhere
- **Discovery wizard** — 59 hardcoded English strings
- **ExchangeCard** — 25 hardcoded English strings
- **Revenue = $0** — no payment flow, no platform fee, no formalization
- **Bots don't earn anything** — they match but can't transact

---

## Phase 1: CUT (1-2 days)

Remove everything that doesn't work or creates false expectations.

### 1.1 Remove redirect-only pages

These pages just redirect and add nav confusion:

- `/anchors` → redirects to `/anchors/dashboard` → redirects to `/me`
- `/pioneers/dashboard` → redirects to `/me`
- `/profile` → redirects to `/me`
- `/experiences` → redirects to `/ventures` → redirects to `/exchange`
- `/offerings` → redirects to `/exchange`
- `/onboarding` → redirects to `/signup`
- `/threads` → redirects to `/messages`

**Action:** Keep redirects for SEO but remove from nav and any visible links.

### 1.2 Remove or hide unfinished pages

These pages exist but are static mockups with no real functionality:

- `/fashion` — static listing, no booking, no payment
- `/media` — static listing, same problem
- `/referral` — shows referral program but nothing works

**Action:** Remove from nav. Keep files but don't link to them anywhere until they work.

### 1.3 Simplify nav structure

Current nav has too many items. After cuts:

**Public nav (not logged in):**

- Home, Exchange, Compass, About, Sign In, Begin

**Logged-in nav:**

- Home, Exchange, Compass, Messages, Me

That's it. No World (merge into Home), no Ventures (it IS Exchange), no Threads (it IS Messages).

### 1.4 Kill the decorative graph on homepage

The NetworkGraph on the returning-user homepage is mock data pretending to be real connections. Either:

- A) Replace with simple stats cards (your matches, your messages, your paths)
- B) Make it actually show real data (requires DB)

**Decision:** A — simple stats for now. Graph comes back when data is real.

---

## Phase 2: TRANSLATE (2-3 days)

Make language switching work on EVERY visible element.

### 2.1 Translate remaining pages

Files that need `useTranslation()` + i18n keys:

1. `components/Discovery.tsx` — 59 strings (CRITICAL, it's onboarding)
2. `components/ExchangeCard.tsx` — 25 strings
3. `app/me/page.tsx` — dashboard tabs and labels
4. `app/messages/page.tsx` — messaging UI
5. `app/pricing/page.tsx` — pricing tiers
6. `app/privacy/page.tsx` — legal content (keep English, add language note)
7. `app/ventures/[id]/page.tsx` — path detail
8. `app/experiences/[id]/page.tsx` — experience detail
9. `app/exchange/[id]/page.tsx` — agent/opportunity detail
10. `components/CookieConsent.tsx` — privacy UI
11. `components/ModeToggle.tsx` — Explorer/Host labels
12. `components/PathCard.tsx` — path display
13. `components/StatusBadge.tsx` — status labels

### 2.2 Per-country language options

When selecting BeKenya → show English + Kiswahili
When selecting BeGermany → show Deutsch + English
When selecting BeNigeria → show English + Hausa + Yoruba
etc.

**This already works** in `getCuratedLanguages()` in IdentitySwitcher. The problem is that the translations don't exist for most languages beyond en/de/sw.

### 2.3 Priority languages (3 languages, complete)

1. **English (en)** — master, 100% complete
2. **German (de)** — ~80% complete, needs remaining page keys
3. **Swahili (sw)** — ~70% complete after today's push, needs remaining page keys

Other languages (fr, ar, hi, etc.) — skeleton only, fill when needed.

---

## Phase 3: REVENUE (3-5 days)

Revenue model C: Platform fee when Pioneer + Anchor formalize a Path.

### 3.1 Formalization flow

1. Pioneer browses Exchange → finds Path → clicks "Open Chapter"
2. Pioneer fills mini-application (why this path, availability, etc.)
3. Anchor reviews Chapter → accepts/rejects
4. **On accept:** Both parties see platform fee
   - Pioneer pays X% of path value
   - Anchor pays Y% of path value
   - Platform earns X+Y%
5. Payment via M-Pesa (KE) or Stripe (INT)
6. Path status → ACTIVE

### 3.2 Bot matching that earns

AI agents in Exchange score Pioneers against Paths. When a bot-suggested match leads to formalization:

- Bot gets attribution
- Platform earns the fee
- Attribution shows "Matched by BeNetwork AI"

### 3.3 Database tables needed

```
Chapter {
  id
  pioneerId → User
  pathId → Path
  status: DRAFT | SUBMITTED | ACCEPTED | REJECTED | ACTIVE | COMPLETED
  pioneerFee: Decimal
  anchorFee: Decimal
  platformFee: Decimal
  matchedBy: 'manual' | 'ai-agent'
  createdAt
}

Transaction {
  id
  chapterId → Chapter
  type: PIONEER_FEE | ANCHOR_FEE
  amount: Decimal
  currency: String
  provider: 'mpesa' | 'stripe'
  status: PENDING | COMPLETED | FAILED
  externalRef: String
  createdAt
}
```

---

## Phase 4: POLISH (ongoing)

### 4.1 Consistent design

- All pages use `SectionLayout` + `GlassCard` + `SectionHeader`
- No ad-hoc margins, no competing layouts
- One typography scale (phi-based, already in tailwind.config)

### 4.2 Online presence

- Show active users count (stored in DB)
- "X Pioneers online" badge

### 4.3 Real graph

Once DB has real Chapters + matches:

- Network graph shows ACTUAL connections
- Edges = formalized Chapters between Pioneer ↔ Anchor
- Node size = activity level

---

## Execution Order

| #   | Task                                    | Blocked by     | Days |
| --- | --------------------------------------- | -------------- | ---- |
| 1   | Remove/hide broken pages from nav       | Nothing        | 0.5  |
| 2   | Replace homepage graph with stats       | Nothing        | 0.5  |
| 3   | Translate Discovery.tsx (59 strings)    | Nothing        | 0.5  |
| 4   | Translate ExchangeCard.tsx (25 strings) | Nothing        | 0.5  |
| 5   | Translate remaining 8 pages             | Nothing        | 1.5  |
| 6   | Complete German translations            | Task 3-5       | 0.5  |
| 7   | Complete Swahili translations           | Task 3-5       | 0.5  |
| 8   | Chapter formalization flow (UI + API)   | DB credentials | 2    |
| 9   | Payment integration (M-Pesa + Stripe)   | Task 8         | 2    |
| 10  | Bot attribution tracking                | Task 8         | 1    |

**Total:** ~10 days of focused work.

**Blocker:** Tasks 8-10 require DATABASE_URL (Neon PostgreSQL credentials). Everything else can happen now.

---

## What NOT to build

- No social features (likes, follows, feeds)
- No messaging persistence (keep mock until DB)
- No premium tier (ship basic first)
- No mobile app (responsive web is enough)
- No complex dashboards (simple stats only)
- No fashion/media verticals (focus on core Exchange + Compass)
