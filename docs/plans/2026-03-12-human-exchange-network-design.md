# Be[Country] Redesign — The Human Exchange Network

> **Status:** Approved design. Ready for implementation planning.
> **Date:** 2026-03-12
> **Vision:** A market where everyone buys AND sells. Your identity connects you to people and possibilities worldwide.

---

## 1. Core Concept

Every human has something to offer and something to seek. Location, languages, skills, and resources are your currency. The platform connects you to people and possibilities for culture, work, health, travel, education, and investment.

**Not** a job board. **Not** a two-sided marketplace. A **human exchange network**.

---

## 2. User Model

**One user type: Human.**

- Every user has ONE profile with an **Explorer ↔ Host toggle**
- **Explorer mode:** "I'm looking" — see opportunities, people to connect with, places to go
- **Host mode:** "I'm offering" — create offerings, receive requests, earn
- Both modes share the same profile data (location, languages, skills, interests)
- Users can be both simultaneously — the toggle controls what the UI emphasizes

**Profile dimensions (progressive — starts with 3, grows over time):**

| Dimension                 | Captured When      | Example                                   |
| ------------------------- | ------------------ | ----------------------------------------- |
| Location (country + city) | Discovery step 1   | Dar es Salaam, Tanzania                   |
| Languages                 | Discovery step 1   | Swahili, English                          |
| Interests/Skills          | Discovery step 2   | Tech, Safari, Culture                     |
| Mode (Explorer/Host)      | After discovery    | Explorer                                  |
| Detailed skills           | Profile enrichment | React, Node.js, Photography               |
| Resources                 | Profile enrichment | Can travel, can invest, can host          |
| Bio / headline            | Profile enrichment | "Software engineer exploring East Africa" |

---

## 3. Information Architecture

### Core Routes (5)

| Route       | Name                | Purpose                                                       |
| ----------- | ------------------- | ------------------------------------------------------------- |
| `/`         | Landing + Discovery | 30s wow → 3-step identity builder → redirect to /world        |
| `/world`    | My World            | Network graph — YOU at center, connections radiating          |
| `/exchange` | Exchange            | Smart feed of people + opportunities filtered by profile      |
| `/messages` | Messages            | Direct conversations with connections                         |
| `/me`       | Me                  | Profile, Explorer/Host toggle, offerings, exchanges, settings |

### Supporting Routes

| Route            | Purpose                               | Access From            |
| ---------------- | ------------------------------------- | ---------------------- |
| `/be/[code]`     | Country deep-dive (SEO + content)     | Exchange cards, footer |
| `/exchange/[id]` | Detail view for person or opportunity | Exchange feed          |
| `/about`         | Platform mission                      | Footer                 |
| `/pricing`       | Freemium + commission details         | Footer                 |
| `/charity`       | Community impact (UTAMADUNI etc.)     | Footer                 |
| `/business`      | Legal structure                       | Footer                 |
| `/privacy`       | Privacy policy                        | Footer                 |
| `/contact`       | Contact form                          | Footer                 |
| `/login`         | Sign in                               | Nav (when logged out)  |
| `/admin`         | Platform management                   | Hidden, admin only     |

### Removed Routes (merged or deleted)

| Old Route                 | Merged Into                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `/compass`                | Discovery on `/`                                            |
| `/onboarding`             | Discovery on `/`                                            |
| `/ventures`               | `/exchange`                                                 |
| `/offerings`              | `/exchange` (filtered)                                      |
| `/pioneers/dashboard`     | `/me` (Explorer mode)                                       |
| `/pioneers/notifications` | `/me` notifications tab                                     |
| `/anchors/dashboard`      | `/me` (Host mode)                                           |
| `/anchors/post-path`      | `/me` → "Create Offering"                                   |
| `/agents/*`               | Removed — agents are Host-mode users with referral tracking |
| `/fashion`                | `/exchange?sector=fashion`                                  |
| `/media`                  | `/exchange?sector=media`                                    |
| `/referral`               | `/me` → Referral tab                                        |
| `/threads`                | `/messages`                                                 |
| `/threads/[slug]`         | `/messages/[slug]` or community channels                    |
| `/experiences/[id]`       | `/exchange/[id]`                                            |
| `/signup`                 | Discovery flow (creates account at end)                     |
| `/forgot-password`        | `/login` (inline)                                           |
| `/profile`                | `/me`                                                       |

### Navigation

**Logged out:** `[logo] [About] [Pricing]` ... `[Log in] [Begin →]`

**Logged in:** `[logo] [My World] [Exchange] [Messages] [Me]`

**Footer:** About · Pricing · Community · Business · Privacy · Contact

---

## 4. The Landing Page (`/`)

### Phase 1: The Wow (30 seconds)

- Dark screen, single gold dot (auto-detected location)
- Connection lines slowly pulse outward to other cities
- Text fades in: **"You are here. The world is connected to you."**
- Below: **"Tell us who you are."** → CTA button

### Phase 2: Discovery (3 steps, replaces Compass + Onboarding)

**Step 1: You + Your World**

- Auto-detect location (city + country via timezone/IP)
- User confirms or changes
- Language selector: visual grid, tap to select
- Live feedback: "Swahili connects you to 847M people across 6 countries"
- Preview: mini network dots appear as you select languages

**Step 2: What Matters**

- Visual grid of 8-12 categories:
  - 🌍 Culture · 💻 Tech · 🦁 Safari · ❤️ Health
  - 🎨 Art & Fashion · 📱 Media · 💰 Trade & Investment · 📚 Education
  - 🏨 Hospitality · 🌿 Agriculture · 🔧 Engineering · 🤝 Community
- Pick 3-5 (minimum 1)
- Live feedback: "42 people and 18 opportunities match you"

**Step 3: Your Network Appears**

- Graph animates into view — YOU at center
- Nodes = real matched people + opportunities from our data
- "This is your world. Explore it." → [Enter My World]
- At this point: save profile to localStorage (+ DB if authenticated)
- Redirect to `/world`

**State persistence:**

- localStorage for anonymous users (survives refresh, never lost)
- Sync to DB on authentication
- Progressive enrichment: profile grows richer over time through usage

---

## 5. My World (`/world`) — The Core Screen

### Network Graph

- **Center:** YOU (gold dot, your flag + name)
- **Nodes:** Sized by relevance score (our matching engine), colored by type:
  - 🟡 Gold nodes = People (other humans on the platform)
  - 🔴 Maroon nodes = Opportunities (things you can do, jobs, experiences)
  - 🟢 Green nodes = Communities (groups, threads, country hubs)
- **Lines:** Connect by shared attributes (thicker = more shared)
  - Language connections (dashed gold)
  - Skill connections (solid white)
  - Location proximity (dotted gray)
- **Interaction:**
  - Hover node → tooltip with name, location, match score
  - Click node → side panel with full detail + "Connect" button
  - Drag to explore, pinch to zoom
  - Filter bar: by type, language, sector, distance

### Implementation

- Use CSS/SVG or a lightweight lib (d3-force or vis-network)
- Start with simplified version: concentric circles layout (easier than force-directed)
- Inner ring = highest match, outer ring = lower match
- Mobile: list view with graph toggle

### Progressive Growth

- New users: sparse graph (based on Discovery inputs)
- As user browses Exchange, saves items, connects: graph grows
- As user completes profile: more matches appear
- Nudges: "Add German to your languages → unlock 3 new connections"

---

## 6. Exchange (`/exchange`) — The Smart Feed

### What It Shows

A unified feed of **People** and **Opportunities**, ranked by the matching engine based on YOUR profile.

### Card Types

**Person Card:**

- Avatar/initials, name, location, flag
- Languages (shared ones highlighted)
- Skills/interests (shared ones highlighted)
- Match score (percentage)
- Mode badge: "Explorer" or "Host"
- [Connect] button

**Opportunity Card:**

- Title, location, sector icon
- Posted by (person/org name)
- Languages required
- Skills required (matched ones highlighted)
- Salary/compensation range (currency-aware)
- Match score
- [View] / [Apply] / [Book] button

### Filters

- **Sector:** Culture, Tech, Safari, Health, Fashion, Media, Trade, Education...
- **Location:** Nearby, specific country, anywhere
- **Language:** Filter by shared language
- **Type:** People only, Opportunities only, Both
- **Mode:** Explorers, Hosts, Both

### Data Source

Uses existing `matching.ts` engine (4-dimension scoring) extended with:

- Language overlap bonus
- Location proximity bonus
- Interest overlap bonus

---

## 7. Messages (`/messages`)

### What It Replaces

- Current `/threads` (community discussions)
- Direct messaging (new feature)

### Structure

- **Channels:** Community threads (BeKenya, BeMaasai, BeSwahili, etc.)
- **Direct:** 1:1 conversations from Exchange connections
- **Group:** Created by users for specific topics

### Implementation

- Start with mock/placeholder UI
- Community channels populated from existing `MOCK_THREADS` data
- Direct messages: local state (until DB connected)

---

## 8. Me (`/me`) — Your Identity Hub

### Structure

**Header:** Avatar, name, location, flag, languages, match count

**Explorer ↔ Host toggle** (prominent, always visible)

**Explorer Mode Tabs:**

- **Dashboard:** Quick stats (connections, matches, active exchanges)
- **Saved:** Bookmarked opportunities and people
- **Exchanges:** Active conversations/applications
- **Referrals:** Refer friends, earn credits

**Host Mode Tabs:**

- **Dashboard:** Quick stats (views, requests, earnings)
- **Offerings:** Your posted opportunities (create/edit/pause)
- **Requests:** Incoming applications/bookings
- **Earnings:** Revenue tracking

**Shared:**

- **Profile:** Edit all identity dimensions (location, languages, skills, interests, bio, resources)
- **Settings:** Notifications, privacy, payment methods, account

### "Create Offering" (replaces Anchor Post Path)

Simplified flow:

1. What are you offering? (title + description)
2. Category (from same visual grid as Discovery)
3. Location (where)
4. Requirements (languages, skills)
5. Compensation (optional — can be free exchange)
6. Publish

---

## 9. Vocabulary Update

| Old Term | New Term               | Why                                   |
| -------- | ---------------------- | ------------------------------------- |
| Pioneer  | Explorer (mode)        | Everyone is human, Explorer is a mode |
| Anchor   | Host (mode)            | Everyone is human, Host is a mode     |
| Path     | Opportunity / Offering | Clearer, universal                    |
| Chapter  | Exchange / Connection  | More human                            |
| Venture  | Experience             | Already clear                         |
| Compass  | Discovery              | It's a discovery flow, not a compass  |
| Gate     | Country Hub            | Clearer                               |
| Route    | Corridor               | Keep — it's accurate                  |

**Keep:** Be[Country] branding, country-specific impact partners, all real-world data.

---

## 10. Data Architecture Changes

### What Stays (untouched)

- `lib/country-selector.ts` — 16 countries, 14 languages, proximity engine
- `lib/countries.ts` — deployment configs
- `lib/matching.ts` — scoring engine (extend, don't replace)
- `lib/safari-packages.ts` — experience data
- `lib/geo.ts` — geolocation
- `lib/payments.ts` — payment methods
- `lib/i18n.ts` + translations — all languages
- `data/mock/` — all mock data (reuse, extend)

### What Changes

- `lib/vocabulary.ts` — update terms (Pioneer→Explorer mode, Anchor→Host mode)
- `lib/nav-structure.ts` — new 4-item nav + simplified footer
- `lib/compass.ts` — refactor into Discovery flow logic
- `lib/identity-context.tsx` — extend with languages, interests, mode

### What's New

- `lib/discovery.ts` — Discovery flow state machine
- `lib/graph.ts` — Network graph data preparation
- `components/NetworkGraph.tsx` — SVG/Canvas graph visualization
- `components/Discovery.tsx` — 3-step interactive flow
- `components/ExchangeCard.tsx` — unified person/opportunity card

---

## 11. Implementation Priority

### Phase 1: Core Flow (must work e2e)

1. New landing page (wow + discovery)
2. `/world` with simplified network graph
3. `/exchange` with smart feed
4. `/me` with Explorer/Host toggle
5. Updated nav + footer

### Phase 2: Polish

6. Messages (channels + placeholder DM)
7. Country hubs (`/be/[code]`) adapted to new design
8. Info pages (about, pricing, charity) simplified
9. Auth flow (login integrates with Discovery)

### Phase 3: Cleanup

10. Delete old pages (compass, onboarding, ventures, etc.)
11. Update all tests
12. Update all docs

---

## 12. Revenue Model

**Freemium + Commission:**

- Free: Discovery, network graph, basic Exchange browsing, messaging
- Free: Create up to 3 offerings
- Commission: Platform takes 5-10% when money changes hands (booking, hiring)
- Premium: Unlimited offerings, priority matching, verified badge, analytics

---

_Approved by owner. Ready for implementation planning._
