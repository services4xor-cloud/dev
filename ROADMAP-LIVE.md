# Be[Country] — Live Roadmap & Requirements

> **Purpose:** Make this platform work for real-life usage with agents and purpose.
> **Updated:** Session 52 (2026-03-12)
> **Status:** Phase 2 active — credentials partially set, flows wiring in progress.

---

## Current State (Session 52)

| Metric                  | Value                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| **Real Pages**          | 20+ (all functional, dark theme, brand colors)                         |
| **Restored Pages**      | signup, forgot-password, notifications (Session 52)                    |
| **AI Agents**           | ~700 deterministic personas across 193 countries                       |
| **Identity Dimensions** | 8 (Location, Languages, Faith, Craft, Passion, Reach, Culture, Market) |
| **Scoring Engine**      | 8-dimension complementary scoring (110 max → 100% display)             |
| **Auth**                | NextAuth v4 — Google OAuth + email/password (JWT strategy)             |
| **DB**                  | Prisma + Neon PostgreSQL (connected, schema pushed)                    |
| **i18n**                | 14 languages, 30+ pages wired, EN/DE/SW complete                       |
| **Tests**               | 785 Jest + 124 Playwright                                              |
| **TS Errors**           | 0 (1 pre-existing in test file)                                        |

---

## What Works NOW

### Core Flows

1. **First Visit:** WowHero animation → 5-step Discovery → Identity captured → Redirect to /world
2. **Returning User:** Rich dashboard with scored agents, matched paths, identity chips, stats
3. **Exchange Browse:** ~700 AI agents + paths scored by 8 dimensions, filterable by type/sector
4. **Exchange Detail:** Full agent profiles with dimension breakdown, bio, exchange proposals, connect action
5. **Messages:** Community channels + DM layout with top-matched agents
6. **Profile (/me):** Dual mode (Explorer/Host), all 8 dimensions editable, settings
7. **World Graph:** SVG network visualization with scored connections
8. **Auth:** Google OAuth + email/password login/signup with NextAuth
9. **Notifications:** Tabbed notifications (All/Matches/Messages/Paths) with read/unread state

### Supporting Pages

- About, Pricing, Contact, Business, Charity, Referral, Fashion, Media
- Country Gates (/be/[country]) — dynamic per 193 countries
- Privacy policy, forgot-password flow

### Infrastructure

- Neon PostgreSQL connected (DATABASE_URL set)
- Google OAuth configured (GOOGLE_CLIENT_ID/SECRET set)
- Resend email API key set
- NextAuth with PrismaAdapter + JWT strategy
- 12+ API routes (paths, chapters, bookings, contacts, auth)
- Service layer with DB-first + mock fallback

---

## What Needs to Become Real

### Priority 1: Make Flows Connect (ACTIVE)

| #   | Flow                                              | Current State | Target State                                                     |
| --- | ------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| 1   | **Click agent → detail → connect → message**      | ✅ Working    | Agent click opens detail with scoring, connect sends to messages |
| 2   | **Signup → Login → Discovery → Dashboard**        | ✅ Working    | Full auth flow with Google OAuth, redirects correct              |
| 3   | **Discovery → Identity saved → Homepage changes** | ✅ Working    | Identity persists in localStorage, homepage shows matched data   |
| 4   | **Exchange filter → results update**              | ✅ Working    | Type + sector filters update feed live                           |
| 5   | **Notification bell → notifications page**        | ✅ Working    | Bell in nav with unread indicator                                |
| 6   | **Path click → detail → apply**                   | ✅ Working    | Path details with tags, compensation, apply action               |

### Priority 2: Make Data Flow Between Pages

| #   | Flow                                      | Status     | What's Needed                                                |
| --- | ----------------------------------------- | ---------- | ------------------------------------------------------------ |
| 1   | **Identity changes → Exchange re-scores** | ✅ Done    | useIdentity context drives scoring                           |
| 2   | **Connect action → appears in Messages**  | 🔧 Partial | Currently redirects to /messages, need to pass agent context |
| 3   | **Profile edit → Homepage updates**       | ✅ Done    | Both read from useIdentity                                   |
| 4   | **Notification click → relevant page**    | 🔧 Partial | Notifications link to source page                            |
| 5   | **Discovery completion → Nav changes**    | ✅ Done    | PUBLIC_NAV_LINKS → MAIN_NAV_LINKS                            |

### Priority 3: Production Readiness

| #   | Item                           | Status     | Blocker                                  |
| --- | ------------------------------ | ---------- | ---------------------------------------- |
| 1   | **Google OAuth in production** | ✅ Ready   | Env vars set on Vercel                   |
| 2   | **Email/password signup**      | ✅ Ready   | DB connected, bcrypt working             |
| 3   | **Password reset flow**        | 🔧 UI only | Needs email send via Resend              |
| 4   | **M-Pesa payments**            | ⛔ Blocked | Need MPESA_CONSUMER_KEY/SECRET           |
| 5   | **Stripe payments**            | ⛔ Blocked | Need STRIPE_SECRET_KEY                   |
| 6   | **Real email sending**         | ✅ Ready   | Resend API key set                       |
| 7   | **DB seed with prod data**     | 🔧 Partial | Seed exists but uses fictional companies |

---

## Architecture: How It All Connects

```
┌─────────────────────────────────────────────────────────────────┐
│                        IDENTITY LAYER                            │
│  useIdentity() → country, languages, craft, faith, culture...   │
│  Persists in localStorage → drives all scoring + display         │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
    ┌────────────▼─────────────┐   ┌─────────────▼──────────────┐
    │     SCORING ENGINE       │   │     AGENT NETWORK          │
    │  scoreDimensions()       │   │  generateAllAgents()       │
    │  8 dims → 0-110 → 0-100%│   │  ~700 AI personas          │
    │  Complementary > Mirror  │   │  Deterministic from seed   │
    └────────────┬─────────────┘   └─────────────┬──────────────┘
                 │                               │
    ┌────────────▼───────────────────────────────▼──────────────┐
    │                    PAGE LAYER                              │
    │  Homepage  → Top 6 agents + Top 4 paths (scored)          │
    │  Exchange  → All agents + paths (filtered, scored)        │
    │  Detail    → Full profile + 8-dim breakdown sidebar       │
    │  Messages  → Top agents as DMs + community channels       │
    │  World     → SVG graph with scored connections             │
    │  Me        → All 8 dimensions editable + mode toggle      │
    └───────────────────────────────────────────────────────────┘
```

---

## Roadmap Phases

### Phase 2A: Live Usage (NOW)

**Goal:** Platform works end-to-end for a real user.

- [x] Auth working (Google OAuth + email/password)
- [x] Identity Discovery flow (5 steps, all 8 dimensions)
- [x] Post-discovery dashboard with live scored data
- [x] Exchange with real agent profiles and detail pages
- [x] All pages restored (signup, forgot-password, notifications)
- [x] Nav wired to all pages with notification bell
- [ ] Password reset email sends via Resend
- [ ] Connect action creates real DM thread in Messages
- [ ] Profile photo upload
- [ ] DB-backed notifications (not just mock)

### Phase 2B: Anchor Side

**Goal:** Businesses can post and manage paths.

- [ ] Path creation wizard (was deleted in rework — needs restoration or rebuild)
- [ ] Anchor dashboard (was gutted — /anchors/dashboard redirects to /me)
- [ ] Path management: edit, pause, close
- [ ] Chapter lifecycle: Pioneer applies → Anchor reviews → Accept/Reject
- [ ] Email notifications to Anchors on new chapters

### Phase 3: Traction

**Goal:** 500 Pioneers, 50 Paths, 20 safaris/month.

- [ ] M-Pesa integration (sandbox → production)
- [ ] Stripe integration (international payments)
- [ ] Experience booking flow (safari, eco-tourism)
- [ ] Real email notifications (welcome, chapter updates, matches)
- [ ] WhatsApp agent forwarding (human agents)
- [ ] SEO optimization (structured data, sitemap)
- [ ] PostHog analytics integration
- [ ] Referral tracking with rewards

### Phase 4: Multi-Country

**Goal:** BeGermany + BeNigeria live.

- [ ] Deploy DE instance (env var swap, EUR/SEPA)
- [ ] Deploy NG instance (env var swap, NGN/Flutterwave)
- [ ] Cross-country routing (KE→DE, KE→GB corridors)
- [ ] Country-specific impact partners
- [ ] Localized SEO per country

### Phase 5: Platform

**Goal:** Mobile + AI + Tribes.

- [ ] React Native mobile app
- [ ] AI-powered Compass (Claude API for route suggestions)
- [ ] Be[Tribe] routes (/be/maasai, /be/kikuyu)
- [ ] Be[Location] routes (/be/nairobi, /be/mombasa)
- [ ] Real-time messaging (WebSocket or Supabase Realtime)
- [ ] Agent marketplace (human agents earn commission)

---

## Credentials Status

| Credential                | Status    | Unlocks                      |
| ------------------------- | --------- | ---------------------------- |
| DATABASE_URL (Neon)       | ✅ Set    | DB queries, user persistence |
| NEXTAUTH_SECRET           | ✅ Set    | Auth security                |
| GOOGLE_CLIENT_ID/SECRET   | ✅ Set    | Google Sign-In               |
| RESEND_API_KEY            | ✅ Set    | Transactional email          |
| MPESA_CONSUMER_KEY/SECRET | ⛔ Needed | M-Pesa payments (KE)         |
| STRIPE_SECRET_KEY         | ⛔ Needed | International card payments  |

---

## Key Architecture Decisions (Locked In)

1. **Identity-first:** Language + Culture > Geography
2. **Tribes are top-level:** `/be/maasai` not `/be/ke/maasai`
3. **One codebase, infinite identities:** env var swaps per country
4. **Freemium:** Pioneers free, Anchors pay ($29-99/mo)
5. **Agent commission:** 10% on placements
6. **Mock → Real swap:** Service layer with DB-first + mock fallback
7. **Complementary scoring:** Software engineer + designer > two engineers
8. **Human Premium:** Real humans get +10 score bonus over AI agents

---

## File Map (Key Files)

### Data Sources (Single Source of Truth)

```
lib/agents.ts              → ~700 AI agent personas (2,450 lines)
lib/world-data.ts          → 193 countries + ~70 languages (2,900 lines)
lib/dimension-scoring.ts   → 8-dimension scoring engine
lib/market-data.ts         → 30+ market signals
lib/exchange-categories.ts → 12 interest categories
lib/country-selector.ts    → 16 deployment countries + proximity
lib/identity-context.tsx   → Global identity state (8 dimensions)
lib/nav-structure.ts       → Nav + Footer link arrays
lib/i18n.ts                → 14-language translation dictionary
```

### Core Pages

```
app/page.tsx               → Homepage (WowHero → Discovery → Dashboard)
app/exchange/page.tsx      → Smart feed (agents + paths, scored)
app/exchange/[id]/page.tsx → Detail page (agent profile OR path detail)
app/me/page.tsx            → Profile + dashboard (Explorer/Host modes)
app/world/page.tsx         → Network graph visualization
app/messages/page.tsx      → Channels + DMs
app/notifications/page.tsx → Tabbed notifications
```

### Auth

```
lib/auth.ts                → NextAuth config (Google + Credentials)
app/login/page.tsx         → Sign in (Google OAuth + email/password)
app/signup/page.tsx        → Registration (role + details)
app/forgot-password/page.tsx → Password reset
```

---

_This roadmap is the source of truth for what's done, what's next, and what matters._
