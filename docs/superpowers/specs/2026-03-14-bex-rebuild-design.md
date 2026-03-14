# Be[X] v2 — Master Architecture & Rebuild Design

> **Date:** 2026-03-14
> **Status:** Review-complete, awaiting user approval
> **Scope:** Full platform rebuild — scratch the repo, keep what works, add triple architecture + fullscreen map + real AI agents

---

## 1. The Big Concept

**Be[X] is a living world map where humanity's dimensions are visible.**

Every human is a crossing of dimensions: Language, Faith, Sector, Location, Currency, Culture. The platform makes these crossings visible on a fullscreen interactive map. You can "draw borders" not by nations, but by **any dimension** — see where Swahili speakers live, where Muslims work in software engineering, where EUR is used, where Maasai culture reaches.

**Three core experiences:**

1. **The Map** — Fullscreen world view. Filter by any dimension. See borders shift.
2. **The Agent** — AI that takes any persona based on dimension crossings. Ask "BeNairobi" about tech jobs. Ask "BeMaasai" about cultural heritage. Ask "BeMuslim+Engineer+EUR" anything.
3. **The Identity** — You pick your country, your languages appear, the whole app translates. Less words, more visuals. Simple.

**Philosophy:**

- Connect people, not complicate things
- Digital simplification through automation and AI
- Anti-colonial: no Western-centric defaults, every culture equally represented
- One concept, infinitely extensible

---

## 2. What We Keep (Proven Assets)

### Keep 100% (no changes)

| Asset             | File(s)                                 | Why                                               |
| ----------------- | --------------------------------------- | ------------------------------------------------- |
| Google OAuth      | `lib/auth.ts`, `api/auth/[...nextauth]` | Production-grade, JWT with role/country           |
| Country dataset   | `lib/country-selector.ts`               | 120+ countries, coordinates, languages, corridors |
| Language registry | `lib/country-selector.ts`               | 100+ languages, Tier A/B/C, country mapping       |
| Vocabulary        | `lib/vocabulary.ts`                     | Explorer/Host/Exchange/Experience terms           |
| i18n system       | `lib/i18n.ts`                           | 1220+ keys × 4 languages, fallback cascade        |
| Endonyms          | `lib/endonyms.ts`                       | Localized country names                           |
| Dimensions        | `lib/dimensions.ts`                     | Faith, Craft, Reach, Culture registries           |
| Semantic skills   | `lib/semantic-skills.ts`                | 68 skills × 12 languages, cross-language matching |
| Prisma client     | `lib/db.ts`                             | Singleton pattern                                 |

### Keep with minor refactor

| Asset            | File(s)                                       | Change                                               |
| ---------------- | --------------------------------------------- | ---------------------------------------------------- |
| IdentitySwitcher | `components/IdentitySwitcher.tsx`             | Keep logic, redesign as map overlay                  |
| Matching engines | `lib/matching.ts`, `lib/dimension-scoring.ts` | Keep algorithms, feed from graph edges               |
| Agent personas   | `lib/agents.ts`                               | Keep persona data, add Claude API for real responses |

### Scratch (rebuild from zero)

| What                      | Why                                     |
| ------------------------- | --------------------------------------- |
| All page routes (`app/*`) | New UI concept: map-first, minimal text |
| Prisma schema             | Rebuild with Node+Edge triple layer     |
| Components (most)         | New visual-first design                 |
| Mock data                 | Generate from graph seeds               |
| Tests                     | New tests for new architecture          |

### Explicitly replaced by Graph layer

| Old Model                 | New Equivalent                                       | Notes                                                                                             |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Profile (flat arrays)     | User's Edge set                                      | `skills[]` → `HAS_SKILL` edges, `faith[]` → `PRACTICES` edges                                     |
| Thread + ThreadMembership | CULTURE/LOCATION/LANGUAGE nodes + `BELONGS_TO` edges | Community = a Node. Membership = an Edge. Moderation via edge `properties: { role: "moderator" }` |
| Path                      | EXPERIENCE nodes + `OFFERS` edges                    | Anchor creates Experience node, links via OFFERS edge                                             |
| Chapter                   | `SEEKS` edge + exchange record                       | Pioneer interest = SEEKS edge to Experience node                                                  |
| Forward                   | `CONNECTED_TO` edge + properties                     | Agent forwards tracked via edge properties                                                        |

### Migration Strategy

**Clean-slate deployment.** This is a full rebuild, not an incremental migration.

1. **New Neon database branch** — create `bex-v2` branch on Neon (free, instant). Old data preserved on `main` branch.
2. **User accounts survive** — Google OAuth re-authenticates automatically. Existing users get new Node+Edge identity on first login.
3. **No data transform script** — the 11 anchors, 22 paths, 8 pioneers are seed/test data, not production users. Fresh seed script replaces them.
4. **Old deployment stays live** until v2 is ready. Switch DNS when ready.

---

## 3. Triple/Graph Architecture (The Heart)

### Core Principle

Everything is a **Node**. Every relationship is an **Edge**. This is the "triangles/triples" architecture.

```
┌─────────┐     SPEAKS      ┌─────────┐
│  Tobias  │───────────────→│  German  │
│  (user)  │                │  (lang)  │
└────┬─────┘                └─────────┘
     │ PRACTICES         OFFICIAL_LANG ↗
     ▼                   ┌─────────┐
┌─────────┐              │ Germany  │──── COUNTRY_CURRENCY ──→┌─────────┐
│ Secular  │              │(country) │                        │   EUR   │
│ (faith)  │              └─────────┘                        │(currency)│
└─────────┘                                                  └─────────┘

All edges flow one direction: FROM → TO. Reverse lookups query the "to" side.
```

### Database Schema (Hybrid)

**Layer 1: Auth + Identity (Prisma — keep relational)**

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  passwordHash  String?
  role          UserRole  @default(EXPLORER)
  country       String    @default("KE")
  language      String    @default("en")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  node          Node?          // Link to graph identity
  payments      Payment[]
  sentMessages  Message[]
  conversations Conversation[] @relation("ConversationParticipants")
  agentChats    AgentChat[]
}

enum UserRole {
  EXPLORER  // Person seeking connections (was: PIONEER)
  HOST      // Org/person offering opportunities (was: ANCHOR)
  AGENT     // Human+AI hybrid connector
  ADMIN
}

// Account, Session, VerificationToken — unchanged (NextAuth requires these)
```

**Note on vocabulary migration:** The role enum changes from `PIONEER/ANCHOR` to `EXPLORER/HOST`. Since this is a clean-slate rebuild (new DB branch), no migration of existing role values needed. `lib/vocabulary.ts` will be updated to remove the legacy section and make Explorer/Host primary.

**Layer 2: The Graph (New — powers map + matching + AI)**

```prisma
// Everything that exists in the world
model Node {
  id         String   @id @default(cuid())
  type       NodeType
  code       String            // "tobias@email.com", "KE", "sw", "islam", "tech", "EUR"
  label      String            // Display name
  labelKey   String?           // i18n key for translation
  icon       String?           // Emoji or icon reference
  lat        Float?            // For map positioning
  lng        Float?
  properties Json?             // Flexible extra data (population, GDP, etc.)
  active     Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // User link (only for type=USER)
  userId     String?  @unique
  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  outEdges   Edge[]   @relation("EdgeFrom")
  inEdges    Edge[]   @relation("EdgeTo")

  @@unique([type, code])  // Scoped uniqueness: "COUNTRY:KE" unique, not just "KE"
  @@index([type])
  @@index([type, active])
}

enum NodeType {
  USER        // A person
  COUNTRY     // A nation (193)
  LANGUAGE    // A language (100+)
  FAITH       // A belief system
  SECTOR      // An industry/craft
  CURRENCY    // A currency
  LOCATION    // A city/region
  CULTURE     // An ethnic/tribal identity
  SKILL       // A specific skill
  EXPERIENCE  // An offering/venture
}

// Every relationship between any two things
model Edge {
  id         String   @id @default(cuid())
  fromId     String
  from       Node     @relation("EdgeFrom", fields: [fromId], references: [id], onDelete: Cascade)
  toId       String
  to         Node     @relation("EdgeTo", fields: [toId], references: [id], onDelete: Cascade)
  relation   EdgeRelation
  weight     Float?             // Strength (null = unweighted, 0.0–1.0 = weighted)
  properties Json?              // Extra data (proficiency level, years, role, etc.)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([fromId, toId, relation])  // No duplicate edges
  @@index([fromId])
  @@index([toId])
  @@index([relation])
  @@index([fromId, relation])
  @@index([toId, relation])
}

enum EdgeRelation {
  // User → Dimension (canonical direction: user is always "from")
  SPEAKS          // user → language
  PRACTICES       // user → faith
  WORKS_IN        // user → sector
  LOCATED_IN      // user → location/country
  USES_CURRENCY   // user → currency
  HAS_SKILL       // user → skill
  BELONGS_TO      // user → culture/tribe
  INTERESTED_IN   // user → sector/experience

  // Country → Dimension (canonical direction: country is always "from")
  OFFICIAL_LANG    // country → language (reverse lookup: query Edge WHERE toId=lang AND relation=OFFICIAL_LANG)
  DOMINANT_FAITH   // country → faith
  COUNTRY_CURRENCY // country → currency
  HAS_SECTOR       // country → sector (major industry)
  BORDERS          // country → country (geographic neighbor)
  CORRIDOR         // country → country (migration/trade route)

  // Structural (canonical: parent is always "from")
  PARENT_OF       // country → location, culture → subculture (reverse = child lookup)
  RELATED_TO      // any → any (generic link)

  // Human Exchange
  OFFERS          // user → experience/opportunity
  SEEKS           // user → experience/opportunity
  CONNECTED_TO    // user → user (friendship/network)
  EXCHANGED_WITH  // user → user (completed exchange)
}
```

**Edge direction rule:** Every EdgeRelation has ONE canonical direction. No reverse relations (SPOKEN_IN, CHILD_OF removed). To find "what countries speak Swahili," query `WHERE toId = swahili_node AND relation = OFFICIAL_LANG`. This eliminates data duplication and query ambiguity.

**Layer 3: Transactional Models (relational — not suited for graph)**

```prisma
// Payments are financial records, not graph relationships
model Payment {
  id                 String        @id @default(cuid())
  userId             String
  user               User          @relation(fields: [userId], references: [id])
  amount             Int           // Smallest currency unit
  currency           String        @default("KES")
  method             PaymentMethod
  status             PaymentStatus @default(PENDING)
  mpesaReceiptNumber String?
  stripePaymentId    String?
  description        String?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  @@index([userId])
  @@index([status])
}

// Direct messages are temporal streams, not graph edges
model Conversation {
  id            String    @id @default(cuid())
  participants  User[]    @relation("ConversationParticipants")
  messages      Message[]
  lastMessageAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation(fields: [senderId], references: [id])
  content        String       @db.Text
  read           Boolean      @default(false)
  createdAt      DateTime     @default(now())

  @@index([conversationId])
  @@index([senderId])
}

// AI Agent conversation history
model AgentChat {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dimensions Json     // { country: "KE", language: "sw", faith: "islam", sector: "tech" }
  messages   Json     // Array of { role, content, timestamp }
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
}

enum PaymentMethod { MPESA STRIPE FLUTTERWAVE PAYPAL SEPA TWINT }
enum PaymentStatus { PENDING SUCCESS FAILED REFUNDED }
```

### Query Strategy

For multi-dimension intersection queries (e.g., "Swahili + Muslim + Tech countries"), use **CTEs** (Common Table Expressions) rather than nested subqueries:

```sql
WITH swahili_countries AS (
  SELECT "fromId" FROM "Edge" WHERE relation = 'OFFICIAL_LANG'
  AND "toId" = (SELECT id FROM "Node" WHERE type = 'LANGUAGE' AND code = 'sw')
),
muslim_countries AS (
  SELECT "fromId" FROM "Edge" WHERE relation = 'DOMINANT_FAITH'
  AND "toId" = (SELECT id FROM "Node" WHERE type = 'FAITH' AND code = 'islam')
)
SELECT n.* FROM "Node" n
JOIN swahili_countries sc ON n.id = sc."fromId"
JOIN muslim_countries mc ON n.id = mc."fromId"
WHERE n.type = 'COUNTRY';
```

For map rendering with 3+ active dimension filters, pre-compute results via **materialized views** refreshed on edge changes (not on every request).

For `properties Json?` fields that need filtering: promote frequently-queried properties to real columns, or use PostgreSQL `@db.JsonB` with GIN indexes.

### Why This Works

1. **Map queries become edge queries:**
   - "Show all Swahili-speaking countries" = `SELECT n.* FROM Node n JOIN Edge e ON n.id = e."fromId" WHERE e.relation = 'OFFICIAL_LANG' AND e."toId" = (SELECT id FROM Node WHERE type='LANGUAGE' AND code='sw')`
   - "Draw faith borders" = Group countries by their `DOMINANT_FAITH` edges
   - "Filter by sector+currency" = Intersect edge CTEs (see Query Strategy below)

2. **AI Agent context becomes a subgraph:**
   - "BeNairobi+Muslim+TechEngineer" = Traverse edges from `location:nairobi` + `faith:islam` + `sector:tech` → get all connected nodes → feed as context to Claude

3. **User identity IS a set of edges:**
   - No more flat arrays in Profile (`skills String[]`, `faith String[]`)
   - Instead: `Edge(user:tobias → SPEAKS → lang:de)`, `Edge(user:tobias → PRACTICES → faith:secular)`
   - Adding a new dimension = adding a new EdgeRelation. No schema migration.

4. **The triple is universal:**
   ```
   Subject    →  Predicate       →  Object
   Tobias     →  SPEAKS          →  German
   Kenya      →  OFFICIAL_LANG   →  Swahili
   Kenya      →  PARENT_OF       →  Nairobi
   Indonesia  →  DOMINANT_FAITH  →  Islam
   ```

---

## 4. Fullscreen Map Architecture

### Stack

| Component          | Technology                            | Why                                                                           |
| ------------------ | ------------------------------------- | ----------------------------------------------------------------------------- |
| Map renderer       | **MapLibre GL JS**                    | Fully open source, WebGL, fast                                                |
| Map tiles          | **MapTiler** (free tier)              | 100K tiles/month free. For scale: self-host tiles via PMTiles or upgrade plan |
| Country boundaries | **Natural Earth GeoJSON**             | Public domain, 193 countries, bundled locally (no API call)                   |
| Data layer         | PostgreSQL Edge queries → GeoJSON API | Dimension borders from graph                                                  |
| Frontend           | React + MapLibre React wrapper        | Type-safe, component-based                                                    |

### Map Features

```
┌──────────────────────────────────────────────────┐
│  🌍 Be[X]                     [🔍] [🤖 Agent]  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │                                            │  │
│  │          FULLSCREEN WORLD MAP              │  │
│  │                                            │  │
│  │    Countries colored by active dimension   │  │
│  │    Click any country → Be[Country] hub     │  │
│  │    Clusters show people/opportunities      │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌─ Dimension Filters (horizontal pills) ─────┐ │
│  │ 🗣️ Language  ☪️ Faith  💼 Sector           │ │
│  │ 📍 Location  💱 Currency  🏛️ Culture       │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  [🇰🇪 BeKenya ▼]  ← Identity switcher (bottom) │
└──────────────────────────────────────────────────┘
```

### Dimension Filter Behavior

1. **No filter active** → All 193 countries shown, colored by region
2. **Language: Swahili** → Countries where Swahili is spoken light up (KE, TZ, UG, RW, CD, MZ). Others fade.
3. **Language: Swahili + Faith: Islam** → Only countries where BOTH edges exist glow
4. **Add Sector: Tech** → Further narrows to Swahili+Muslim+Tech intersections
5. Each filter = an edge query. Intersection = AND logic on edges.

### "Drawing Borders"

Instead of political borders, the map redraws borders based on dimensions:

- **Language borders** → Swahili-speaking region becomes one "territory" across KE/TZ/UG
- **Faith borders** → Islamic world, Christian world, Buddhist world overlay
- **Sector borders** → Tech hubs cluster (Nairobi, Lagos, Berlin, SF)
- **Currency borders** → EUR zone, USD zone, KES zone

This is achieved by:

1. Querying edges for the active dimension
2. Generating a GeoJSON FeatureCollection with matching countries
3. Coloring/grouping the map layer dynamically

---

## 5. AI Agent Architecture

### Concept

The AI Agent is a **dimension-crossing persona**. It doesn't just answer questions — it becomes the intersection of whatever dimensions you select.

```
User selects: 🇰🇪 Kenya + ☪️ Islam + 💻 Tech + 🗣️ Swahili
Agent becomes: A Swahili-speaking Muslim tech professional from Kenya
Agent answers: In that persona's voice, with real data about that intersection
```

### Stack

| Component      | Technology                         | Why                                              |
| -------------- | ---------------------------------- | ------------------------------------------------ |
| LLM (primary)  | **Claude API** (Anthropic)         | Superior reasoning, multilingual                 |
| LLM (fallback) | **Gemini API** (Google)            | Fast, cheap, good for translation                |
| Context        | Graph edges → system prompt        | Persona is built from subgraph                   |
| Translation    | **DeepL API** (free tier) + Claude | DeepL for EU languages, Claude for African/Asian |

### Agent Flow

```
1. User picks dimensions (or the map selection implies them)
2. System queries graph: "What nodes are connected to these dimensions?"
3. Build persona context:
   - Country data (from Node properties)
   - Language (determines response language)
   - Faith context (cultural norms, greetings)
   - Sector knowledge (industry data)
   - Currency (pricing context)
4. System prompt to Claude:
   "You are Be{Country}, a {faith} {sector} professional
    who speaks {language} and works with {currency}.
    Answer from this perspective using real-world knowledge."
5. Stream response to user
```

### Agent Personas (Seeded from Graph)

The existing `lib/agents.ts` deterministic persona generator stays — but now each persona is ALSO a set of edges in the graph. When a user chats with "BeKenya," we:

1. Look up `node:agent-ke-001`
2. Traverse edges: `SPEAKS → sw, en`, `LOCATED_IN → KE`, `WORKS_IN → tech`
3. Feed this subgraph as context to Claude
4. Claude responds in-character with real knowledge

### Key API Route

```
POST /api/agent/chat
Body: {
  dimensions: { country: "KE", language: "sw", faith: "islam", sector: "tech" },
  message: "What tech opportunities are there in Nairobi?",
  conversationId?: string
}
Response: Streamed Claude response in-character
```

---

## 6. Identity & i18n Architecture

### How Language Switching Works

```
User selects: 🇰🇪 Kenya
  → Available languages: English, Swahili
  → User picks: Swahili
  → ENTIRE APP translates to Swahili
  → Map labels in Swahili
  → AI Agent responds in Swahili
  → Country names in Swahili (endonyms)
```

### Language Support Tiers

| Tier                | Languages                                                                                   | Coverage                    | How                                      |
| ------------------- | ------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------- |
| **A (Full)**        | English, Swahili, German, French, Italian, Kenyan languages                                 | 100% UI + AI                | Manual translations in `i18n.ts`         |
| **B (AI-assisted)** | Spanish, Portuguese, Arabic, Hindi, Chinese, Japanese, Korean, Turkish, Russian, Indonesian | 80% UI + AI                 | DeepL/Claude auto-translate from English |
| **C (Label-only)**  | 90+ others                                                                                  | Country/language names only | `nativeName` in language registry        |

### ENABLED Flag

```typescript
interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  enabled: boolean // true = full UI translation available
  tier: 'A' | 'B' | 'C'
  countries: string[]
}
```

Only `enabled: true` languages appear in the language picker. Others show as "Coming soon" with a visual indicator.

### "Less Words, More Visuals" Principle

- Icons/emojis replace text labels where possible
- Map IS the primary interface (no text-heavy pages)
- Numbers and stats shown as visual charts, not paragraphs
- Agent chat is the main text interaction (conversational, not formal)

---

## 7. Page Architecture (Minimal)

### Routes (drastically simplified)

```
/                    → Fullscreen map (THE app)
/agent               → AI Agent chat (also accessible as overlay on map)
/me                  → Your identity + edges (visual graph of YOU)
/be/[code]           → Country hub (click country on map)
/exchange/[id]       → Single opportunity detail
/login               → Google auth (keep existing)
/signup              → Role selection + Google auth
/onboarding          → Identity builder (creates your edges)
```

**That's 7 routes.** Down from 20+. The map IS the app.

### UI Concept

```
┌─ / (Homepage = The Map) ─────────────────────────┐
│                                                   │
│  FULLSCREEN MAP                                   │
│  - Click country → slide-in panel with Be[X] hub │
│  - Dimension pills at bottom                      │
│  - Agent button (floating)                        │
│  - Identity switcher (top-left, minimal)          │
│                                                   │
│  No hero section. No paragraphs. No marketing.    │
│  THE MAP IS THE PRODUCT.                          │
│                                                   │
└───────────────────────────────────────────────────┘
```

```
┌─ /me (Your Identity Graph) ──────────────────────┐
│                                                   │
│  Visual node graph showing YOUR edges:            │
│  YOU → speaks → [German, Swahili, English]        │
│  YOU → practices → [Secular]                      │
│  YOU → works_in → [Process Automation, AI]        │
│  YOU → located_in → [Germany, Kenya]              │
│  YOU → uses → [EUR, KES]                          │
│                                                   │
│  Click any node → see who else shares that edge   │
│  Edit inline — add/remove dimensions              │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 8. Seed Data Strategy

### World Nodes (auto-seeded on deploy)

| NodeType | Count | Source                                         |
| -------- | ----- | ---------------------------------------------- |
| COUNTRY  | 193   | UN member states (from `country-selector.ts`)  |
| LANGUAGE | 100+  | Language registry (from `country-selector.ts`) |
| FAITH    | 8     | Faith options (from `dimensions.ts`)           |
| SECTOR   | 30+   | Craft suggestions + PATH_CATEGORIES            |
| CURRENCY | 50+   | From country data                              |
| CULTURE  | 100+  | Ethnic groups per country (new dataset)        |
| LOCATION | 500+  | Major cities (top 3 per country)               |

### World Edges (auto-seeded)

| Relation         | Count | Source                                  |
| ---------------- | ----- | --------------------------------------- |
| OFFICIAL_LANG    | ~400  | Country → languages mapping             |
| DOMINANT_FAITH   | ~200  | Country → faith (real-world data)       |
| COUNTRY_CURRENCY | ~200  | Country → currency                      |
| HAS_SECTOR       | ~1000 | Country → major industries              |
| BORDERS          | ~600  | Geographic neighbors                    |
| CORRIDOR         | ~100  | Existing compass routes                 |
| PARENT_OF        | ~700  | Country → cities, culture → subcultures |

**Total seed: ~3,500 nodes, ~3,000 edges** — enough to power the map from day one.

---

## 9. API Keys Required

| Key                     | Service          | Free Tier           | Purpose                              |
| ----------------------- | ---------------- | ------------------- | ------------------------------------ |
| `ANTHROPIC_API_KEY`     | Anthropic        | Via Claude Code Max | AI Agent responses                   |
| `GOOGLE_GEMINI_API_KEY` | Google AI Studio | 1M tokens/day       | Fallback LLM + bulk translation      |
| `MAPTILER_API_KEY`      | MapTiler         | 100K tiles/month    | Map tiles for MapLibre               |
| `DEEPL_API_KEY`         | DeepL            | 500K chars/month    | Automated translation (EU languages) |
| `GOOGLE_CLIENT_ID`      | Google Cloud     | Free                | OAuth (already have)                 |
| `GOOGLE_CLIENT_SECRET`  | Google Cloud     | Free                | OAuth (already have)                 |
| `DATABASE_URL`          | Neon PostgreSQL  | Free tier           | Database (already have)              |
| `NEXTAUTH_SECRET`       | Self-generated   | Free                | Auth secret (already have)           |
| `RESEND_API_KEY`        | Resend           | 100 emails/day      | Magic link emails (already have)     |

**New keys to get: 3** (Anthropic API, MapTiler, DeepL)
**Gemini: already have**

---

## 10. Tech Stack (Final)

| Layer         | Technology                | Notes                      |
| ------------- | ------------------------- | -------------------------- |
| Framework     | Next.js 14 App Router     | Keep                       |
| Language      | TypeScript (strict)       | Keep                       |
| Styling       | Tailwind CSS              | Keep                       |
| Database      | PostgreSQL (Neon)         | Keep, add Node+Edge tables |
| ORM           | Prisma 5                  | Keep, new schema           |
| Auth          | NextAuth.js v4 (Google)   | Keep exactly               |
| Map           | MapLibre GL JS + MapTiler | NEW                        |
| AI (primary)  | Claude API (Anthropic)    | NEW                        |
| AI (fallback) | Gemini API (Google)       | NEW                        |
| Translation   | DeepL API + Claude        | NEW                        |
| Email         | Resend                    | Keep                       |
| Deploy        | Vercel                    | Keep                       |
| Testing       | Jest + Playwright         | Rebuild tests              |

---

## 11. Build Sequence (High Level)

### Phase 1a: Schema + Seed (Week 1)

1. New Prisma schema (User + Node + Edge + Auth + Payment + Message + AgentChat)
2. Seed script: 193 countries + 100 languages + 8 faiths + 50 currencies + all edges
3. Graph query utilities (`lib/graph.ts`) — CRUD for nodes and edges
4. Basic edge API (`/api/graph/edges`) — create/read/delete edges for a user
5. Tests: seed integrity, graph queries, edge CRUD

### Phase 1b: Auth + i18n Migration (Week 1–2)

6. Migrate `lib/auth.ts` — update role enum (EXPLORER/HOST), link User → Node on login
7. Update `lib/vocabulary.ts` — remove legacy section, Explorer/Host primary
8. Keep i18n, country-selector, dimensions, semantic-skills as-is
9. Tests: auth flow, role assignment, Node creation on signup

### Phase 2: The Map (Week 2–3)

10. MapLibre setup + MapTiler tiles
11. Country boundaries GeoJSON (bundled, not fetched)
12. Dimension filter API (`/api/map/filter`) — CTE-based edge intersection queries
13. Interactive map component with click → country slide-in panel
14. Tests: filter API returns correct country sets, map renders

### Phase 3: The Agent (Week 3–4, parallelizable with Phase 2)

15. Claude API integration (`lib/ai.ts`) + Gemini fallback
16. Persona builder from graph edges → system prompt
17. Agent chat API (`/api/agent/chat`) + AgentChat persistence
18. Chat UI overlay on map
19. Tests: persona generation, streaming response, conversation persistence

### Phase 4: Identity & Polish (Week 4–5)

20. `/me` page — visual identity graph (your edges)
21. Onboarding flow → creates SPEAKS, PRACTICES, WORKS_IN, LOCATED_IN edges
22. Language switching → full app translation (i18n hook + endonyms)
23. Country hub pages (`/be/[code]`) — powered by graph data
24. Tests: onboarding creates correct edges, language switch updates UI

### Phase 5: Exchange & Connect (Week 5+)

25. Opportunity posting (Host creates Experience node + OFFERS edge)
26. Matching engine (reads graph edges, dimension-scoring)
27. Messaging (Conversation + Message models)
28. Payment integration (keep M-Pesa + Stripe patterns)
29. Tests: full exchange flow end-to-end

---

## 12. Design Principles

1. **The Map is the product** — Not a feature. THE interface.
2. **Less words, more visuals** — Icons > labels. Maps > lists. Graphs > tables.
3. **Every dimension is equal** — No hierarchy. Language is not "more important" than faith.
4. **AI is a persona, not a chatbot** — It becomes the intersection you select.
5. **Simplicity is the feature** — If it needs explanation, it's too complex.
6. **Anti-colonial by design** — No defaults favoring any culture. 193 countries, equal weight.
7. **Open source first** — MapLibre (not Mapbox), PostgreSQL (not Neo4j), standard APIs.
8. **Real data or nothing** — No fake stats. Graph edges represent real relationships.

---

## 13. What This Enables (Your Vision)

| You Said                                                | How It Works                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| "Fullscreen map with all countries"                     | MapLibre + 193 country GeoJSON + dimension coloring                  |
| "Filter by language, faith, sector, location, currency" | Edge queries on the graph, update map colors                         |
| "Draw borders based on dimensions"                      | GeoJSON regions grouped by shared edges                              |
| "AI Agent for every crossing of 1-5"                    | Claude API with persona built from edge subgraph                     |
| "Change country → translates whole app"                 | Identity switcher → i18n hook → all UI updates                       |
| "Less words more visuals"                               | Map-first, icon-first, 7 routes not 20+                              |
| "Connecting people"                                     | Graph edges = connections. Click any node → see who shares it        |
| "Kenya trips"                                           | Experience nodes with OFFERS edges, visible on map                   |
| "Process automation"                                    | AI Agent handles matching, translation, onboarding automatically     |
| "Simple concept"                                        | One map. Pick dimensions. See the world through them. Talk to it.    |
| "Bring the world together digitally"                    | 193 countries, 100+ languages, every faith, every sector — one graph |

---

_This is the master architecture. Everything builds from: Node + Edge + Map + AI._
