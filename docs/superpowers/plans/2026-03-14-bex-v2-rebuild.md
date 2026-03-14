# Be[X] v2 — Full Rebuild Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Be[X] from scratch as a graph-powered world map with AI agents — clean, no legacy, KISS.

**Architecture:** Hybrid triple-store (Node+Edge in PostgreSQL) powers a fullscreen MapLibre world map. AI agents (Claude API) take dimension-crossing personas. Google auth kept. 7 routes replace 20+.

**Tech Stack:** Next.js 14, TypeScript, Tailwind, Prisma 5/PostgreSQL (Neon), MapLibre GL JS, MapTiler, Claude API, Gemini API, DeepL API, NextAuth v4

**Spec:** `docs/superpowers/specs/2026-03-14-bex-rebuild-design.md`

**Scope:** This plan covers Phases 1–4 (Foundation, Map, Agent, Identity). Phase 5 (Exchange creation, messaging UI, payments) is deferred to a follow-up plan — the graph and APIs will be ready, but no UI for posting opportunities or DMs in this round.

---

## Chunk 1: Nuclear Cleanup + New Foundation

### Task 1: Delete all legacy code

**Files:**

- Delete: ALL files in `app/` (95 files)
- Delete: ALL files in `components/` (24 files)
- Delete: ALL files in `data/mock/` (18 files)
- Delete: ALL files in `__tests__/` (47 files)
- Delete: ALL files in `tests/visual/` (9 files)
- Delete: ALL files in `services/` (6 files)
- Delete: ALL files in `types/` (3 files)
- Delete: `prisma/seed.ts`
- Delete: `middleware.ts`
- Keep: `prisma/schema.prisma` (will be rewritten in Task 2)
- Keep: ALL files in `lib/` (will be curated in Task 3)
- Keep: `public/` logos
- Keep: root configs (`package.json`, `tsconfig.json`, `tailwind.config.ts`, etc.)
- Keep: root docs (`CLAUDE.md`, `PROGRESS.md`, etc.)

- [ ] **Step 1: Create a backup branch**

```bash
git checkout -b backup/v1-complete
git push origin backup/v1-complete
git checkout main
```

- [ ] **Step 2: Delete app directory**

```bash
rm -rf app/
```

- [ ] **Step 3: Delete components, mock data, tests, services, types**

```bash
rm -rf components/ data/mock/ __tests__/ tests/ services/ types/ middleware.ts prisma/seed.ts
```

- [ ] **Step 4: Verify only lib/, prisma/schema.prisma, public/, configs, docs remain**

```bash
ls -la
ls lib/
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: nuclear cleanup — delete all legacy app, components, tests, services, types

Keep: lib/ (curated next), prisma schema (rewritten next), public/, configs, docs
Backup branch: backup/v1-complete"
```

---

### Task 2: Curate lib/ — keep gold, delete dead

**Files:**

- Keep as-is: `lib/auth.ts`, `lib/db.ts`, `lib/i18n.ts`, `lib/endonyms.ts`, `lib/country-selector.ts`, `lib/countries.ts`, `lib/vocabulary.ts`, `lib/dimensions.ts`, `lib/semantic-skills.ts`, `lib/dimension-scoring.ts`, `lib/matching.ts`, `lib/compass.ts`, `lib/geo.ts`, `lib/email.ts`
- Keep as-is: `lib/hooks/use-translation.ts`
- Delete: `lib/agents.ts` (will be rebuilt with Claude API)
- Delete: `lib/exchange-categories.ts`, `lib/emoji-map.ts`, `lib/graph.ts`, `lib/integrations.ts`, `lib/logger.ts`, `lib/market-data.ts`, `lib/mpesa.ts`, `lib/nav-structure.ts`, `lib/needs.ts`, `lib/offerings.ts`, `lib/payments.ts`, `lib/platform-config.ts`, `lib/profile-completeness.ts`, `lib/safari-packages.ts`, `lib/sectors.ts`, `lib/social-media.ts`, `lib/threads.ts`, `lib/whatsapp-templates.ts`, `lib/world-data.ts`, `lib/xp.ts`, `lib/country-highlights.ts`
- Delete: `lib/hooks/use-journey.ts`, `lib/hooks/use-paths.ts`, `lib/hooks/use-profile-sync.ts`, `lib/hooks/use-threads.ts`, `lib/hooks/use-xp.ts`
- Delete: `lib/identity-context.tsx` (will be rebuilt as graph-aware context)

- [ ] **Step 1: Delete dead lib files**

```bash
rm -f lib/agents.ts lib/exchange-categories.ts lib/emoji-map.ts lib/graph.ts lib/integrations.ts lib/logger.ts lib/market-data.ts lib/mpesa.ts lib/nav-structure.ts lib/needs.ts lib/offerings.ts lib/payments.ts lib/platform-config.ts lib/profile-completeness.ts lib/safari-packages.ts lib/sectors.ts lib/social-media.ts lib/threads.ts lib/whatsapp-templates.ts lib/world-data.ts lib/xp.ts lib/country-highlights.ts lib/identity-context.tsx
```

- [ ] **Step 2: Delete dead hooks**

```bash
rm -f lib/hooks/use-journey.ts lib/hooks/use-paths.ts lib/hooks/use-profile-sync.ts lib/hooks/use-threads.ts lib/hooks/use-xp.ts
```

- [ ] **Step 3: Verify surviving lib files**

```bash
ls lib/
ls lib/hooks/
```

Expected: `auth.ts`, `db.ts`, `i18n.ts`, `endonyms.ts`, `country-selector.ts`, `countries.ts`, `vocabulary.ts`, `dimensions.ts`, `semantic-skills.ts`, `dimension-scoring.ts`, `matching.ts`, `compass.ts`, `geo.ts`, `email.ts`, `hooks/use-translation.ts`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: curate lib/ — keep 15 gold modules, delete 23 dead files

Kept: auth, db, i18n, endonyms, country-selector, countries, vocabulary,
dimensions, semantic-skills, dimension-scoring, matching, compass, geo, email,
hooks/use-translation"
```

---

### Task 3: Update vocabulary.ts — remove legacy, Explorer/Host primary

**Files:**

- Modify: `lib/vocabulary.ts`

- [ ] **Step 1: Rewrite vocabulary.ts — clean, no legacy**

```typescript
/**
 * VOCABULARY.ts — Be[X] Human Exchange Network
 *
 * Every term chosen for: universal comprehension, positive connotation,
 * clean translation, distinctive brand identity.
 *
 * NEVER use: job, employer, candidate, application, booking, tour, search
 */

export const VOCAB = {
  // ── Core roles ──
  explorer: { singular: 'Explorer', plural: 'Explorers', verb: 'exploring' },
  host: { singular: 'Host', plural: 'Hosts', verb: 'hosting' },
  agent: { singular: 'Agent', plural: 'Agents', verb: 'connecting' },

  // ── Core objects ──
  opportunity: { singular: 'Opportunity', plural: 'Opportunities', verb: 'offering' },
  exchange: { singular: 'Exchange', plural: 'Exchanges', verb: 'exchanging' },
  experience: { singular: 'Experience', plural: 'Experiences', verb: 'experiencing' },
  discovery: { singular: 'Discovery', plural: 'Discoveries', verb: 'discovering' },

  // ── Places ──
  hub: { singular: 'Hub', plural: 'Hubs', verb: 'connecting' },
  corridor: { singular: 'Corridor', plural: 'Corridors', verb: 'routing' },

  // ── CTAs ──
  network_name: 'The BeNetwork',
  tagline: 'You are here. The world is connected to you.',
  explorer_cta: 'Explore',
  host_cta: 'Create Offering',
  connect_cta: 'Connect',
  discover_cta: 'Tell us who you are',
} as const

export type ExplorerType =
  | 'explorer'
  | 'professional'
  | 'artisan'
  | 'guardian'
  | 'creator'
  | 'healer'

export const EXPLORER_TYPES: Record<
  ExplorerType,
  { label: string; icon: string; description: string; sectors: string[] }
> = {
  explorer: {
    label: 'Explorer',
    icon: '🌿',
    description: 'Safari guides, eco-lodge staff, wildlife rangers, marine',
    sectors: ['Safari & Wildlife', 'Eco-Tourism', 'Marine & Fishing', 'Conservation'],
  },
  professional: {
    label: 'Professional',
    icon: '💼',
    description: 'Finance, tech, consulting, management',
    sectors: ['Technology', 'Finance & Banking', 'Consulting', 'Management'],
  },
  artisan: {
    label: 'Artisan',
    icon: '✨',
    description: 'Fashion, design, craft, beauty',
    sectors: ['Fashion & Design', 'Beauty & Wellness', 'Craft & Art', 'Jewelry'],
  },
  guardian: {
    label: 'Guardian',
    icon: '🛡️',
    description: 'Security, logistics, operations, infrastructure',
    sectors: ['Security', 'Logistics', 'Operations', 'Infrastructure'],
  },
  creator: {
    label: 'Creator',
    icon: '🎬',
    description: 'Media, content, photography, social media',
    sectors: ['Media & Content', 'Photography', 'Music & Entertainment', 'Digital Marketing'],
  },
  healer: {
    label: 'Healer',
    icon: '🌱',
    description: 'Healthcare, education, community, NGO',
    sectors: ['Healthcare', 'Education', 'Community Development', 'NGO & Charity'],
  },
}

export const EXPLORER_TYPE_OPTIONS = Object.entries(EXPLORER_TYPES).map(([key, val]) => ({
  value: key,
  label: `${val.icon} ${val.label}`,
}))
```

- [ ] **Step 2: Commit**

```bash
git add lib/vocabulary.ts
git commit -m "refactor: vocabulary.ts — remove all legacy terms, Explorer/Host primary

Removed: Pioneer, Anchor, Path, Chapter, Venture, Gate, Route, Compass
Now: Explorer, Host, Opportunity, Exchange, Experience, Discovery, Hub, Corridor"
```

---

### Task 4: New Prisma schema — User + Node + Edge + transactional models

**Files:**

- Rewrite: `prisma/schema.prisma`

- [ ] **Step 1: Write new schema**

```prisma
// Be[X] v2 — Graph-powered identity platform
// Hybrid: relational (auth, payments, messages) + graph (Node + Edge)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Layer 1: Auth (relational, required by NextAuth) ─────────────────────────

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
  node          Node?
  payments      Payment[]
  sentMessages  Message[]
  conversations Conversation[] @relation("ConversationParticipants")
  agentChats    AgentChat[]
}

enum UserRole {
  EXPLORER
  HOST
  AGENT
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Layer 2: The Graph (Node + Edge) ─────────────────────────────────────────

model Node {
  id         String   @id @default(cuid())
  type       NodeType
  code       String
  label      String
  labelKey   String?
  icon       String?
  lat        Float?
  lng        Float?
  properties Json?    @db.JsonB
  active     Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  userId     String?  @unique
  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  outEdges   Edge[]   @relation("EdgeFrom")
  inEdges    Edge[]   @relation("EdgeTo")

  @@unique([type, code])
  @@index([type])
  @@index([type, active])
}

enum NodeType {
  USER
  COUNTRY
  LANGUAGE
  FAITH
  SECTOR
  CURRENCY
  LOCATION
  CULTURE
  SKILL
  EXPERIENCE
}

model Edge {
  id         String       @id @default(cuid())
  fromId     String
  from       Node         @relation("EdgeFrom", fields: [fromId], references: [id], onDelete: Cascade)
  toId       String
  to         Node         @relation("EdgeTo", fields: [toId], references: [id], onDelete: Cascade)
  relation   EdgeRelation
  weight     Float?
  properties Json?        @db.JsonB
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@unique([fromId, toId, relation])
  @@index([fromId])
  @@index([toId])
  @@index([relation])
  @@index([fromId, relation])
  @@index([toId, relation])
}

enum EdgeRelation {
  // User → Dimension
  SPEAKS
  PRACTICES
  WORKS_IN
  LOCATED_IN
  USES_CURRENCY
  HAS_SKILL
  BELONGS_TO
  INTERESTED_IN

  // Country → Dimension
  OFFICIAL_LANG
  DOMINANT_FAITH
  COUNTRY_CURRENCY
  HAS_SECTOR
  BORDERS
  CORRIDOR

  // Structural
  PARENT_OF
  RELATED_TO

  // Human Exchange
  OFFERS
  SEEKS
  CONNECTED_TO
  EXCHANGED_WITH
}

// ─── Layer 3: Transactional (relational) ──────────────────────────────────────

model Payment {
  id                 String        @id @default(cuid())
  userId             String
  user               User          @relation(fields: [userId], references: [id])
  amount             Int
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

enum PaymentMethod {
  MPESA
  STRIPE
  FLUTTERWAVE
  PAYPAL
  SEPA
  TWINT
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

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

model AgentChat {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dimensions Json     @db.JsonB
  messages   Json     @db.JsonB
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
}
```

- [ ] **Step 2: Generate Prisma client**

```bash
npx prisma generate
```

- [ ] **Step 3: Push to database (new branch on Neon)**

```bash
npx prisma db push
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: new Prisma schema — User + Node + Edge + Payment + Message + AgentChat

Hybrid architecture: relational auth/payments + graph Node+Edge layer
Dropped: Profile, Path, Chapter, Thread, Forward, XPEvent, etc."
```

---

### Task 5: Update auth.ts — new role enum + Node creation on login

**Files:**

- Modify: `lib/auth.ts`

**Why here:** Must happen immediately after Task 4 (new schema) because `lib/auth.ts` references `UserRole` enum. Old schema has `PIONEER/ANCHOR`, new schema has `EXPLORER/HOST`. TypeScript will break if we don't update auth.ts before any build step.

- [ ] **Step 1: Read current auth.ts to understand structure**

```bash
cat lib/auth.ts
```

- [ ] **Step 2: Update auth.ts**

Key changes:

1. Change all `PIONEER` references to `EXPLORER`, `ANCHOR` to `HOST`
2. Add `language` to JWT and session callbacks
3. Add `events.createUser` to auto-create a USER Node on signup:

```typescript
events: {
  async createUser({ user }) {
    if (user.id) {
      const { prisma } = await import('@/lib/db')
      await prisma.node.create({
        data: {
          type: 'USER',
          code: user.email ?? user.id,
          label: user.name ?? 'Explorer',
          icon: '👤',
          userId: user.id,
        },
      })
    }
  },
},
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit --pretty 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: auth.ts — EXPLORER/HOST roles, Node creation on signup, language in session"
```

---

### Task 6: New types — domain.ts and api.ts

**Files:**

- Create: `types/domain.ts`
- Create: `types/api.ts`
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: Create types directory**

```bash
mkdir -p types
```

- [ ] **Step 2: Write types/domain.ts**

```typescript
/**
 * Domain types for Be[X] v2
 * Mirrors Prisma schema + adds frontend-only types
 */

import type { NodeType, EdgeRelation, UserRole, PaymentMethod, PaymentStatus } from '@prisma/client'

export type { NodeType, EdgeRelation, UserRole, PaymentMethod, PaymentStatus }

// ─── Graph types ──────────────────────────────────────────────

export interface GraphNode {
  id: string
  type: NodeType
  code: string
  label: string
  labelKey?: string | null
  icon?: string | null
  lat?: number | null
  lng?: number | null
  properties?: Record<string, unknown> | null
  active: boolean
}

export interface GraphEdge {
  id: string
  fromId: string
  toId: string
  relation: EdgeRelation
  weight?: number | null
  properties?: Record<string, unknown> | null
}

export interface NodeWithEdges extends GraphNode {
  outEdges: (GraphEdge & { to: GraphNode })[]
  inEdges: (GraphEdge & { from: GraphNode })[]
}

// ─── Map types ────────────────────────────────────────────────

export interface DimensionFilter {
  dimension: 'language' | 'faith' | 'sector' | 'location' | 'currency' | 'culture'
  nodeCode: string // e.g., "sw", "islam", "tech"
}

export interface MapCountry {
  code: string
  name: string
  lat: number
  lng: number
  matchStrength: number // 0.0–1.0 based on dimension filters
}

// ─── Agent types ──────────────────────────────────────────────

export interface AgentDimensions {
  country?: string
  language?: string
  faith?: string
  sector?: string
  currency?: string
  culture?: string
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

// ─── Identity types ───────────────────────────────────────────

export interface UserIdentity {
  userId: string
  country: string
  language: string
  edges: GraphEdge[]
  node: GraphNode
}
```

- [ ] **Step 3: Write types/api.ts**

```typescript
/**
 * API request/response contracts for Be[X] v2
 */

import type { AgentDimensions, DimensionFilter, GraphEdge, GraphNode, MapCountry } from './domain'

// ─── Map API ──────────────────────────────────────────────────

export interface MapFilterRequest {
  filters: DimensionFilter[]
}

export interface MapFilterResponse {
  countries: MapCountry[]
  totalMatches: number
}

// ─── Graph API ────────────────────────────────────────────────

export interface CreateEdgeRequest {
  fromCode: string
  fromType: string
  toCode: string
  toType: string
  relation: string
  weight?: number
  properties?: Record<string, unknown>
}

export interface UserEdgesResponse {
  node: GraphNode
  edges: (GraphEdge & { to: GraphNode })[]
}

// ─── Agent API ────────────────────────────────────────────────

export interface AgentChatRequest {
  dimensions: AgentDimensions
  message: string
  conversationId?: string
}

export interface AgentChatResponse {
  conversationId: string
  response: string // Streamed in practice
}

// ─── Auth API ─────────────────────────────────────────────────

export interface RegisterRequest {
  email: string
  password: string
  name: string
  country: string
  language: string
  role: 'EXPLORER' | 'HOST'
}

// ─── Onboarding API ──────────────────────────────────────────

export interface OnboardingRequest {
  languages: string[] // Language codes
  faith: string[] // Faith IDs
  crafts: string[] // Skill/craft tags
  interests: string[] // Sector codes
  locations: string[] // Country/city codes
  cultures: string[] // Culture IDs
}
```

- [ ] **Step 4: Write types/next-auth.d.ts**

```typescript
import type { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      country: string
      language: string
    }
  }

  interface User {
    role: UserRole
    country: string
    language: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    country: string
    language: string
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add types/
git commit -m "feat: new type system — domain.ts (graph/map/agent types) + api.ts + next-auth.d.ts"
```

---

### Task 7: Graph query utilities — lib/graph.ts

**Files:**

- Create: `lib/graph.ts`

- [ ] **Step 1: Write graph.ts — core CRUD + dimension queries**

```typescript
/**
 * Graph query utilities for Be[X] v2
 *
 * All graph operations go through here. No raw Prisma graph queries elsewhere.
 */

import { prisma } from '@/lib/db'
import type { EdgeRelation, NodeType } from '@prisma/client'

// ─── Node operations ─────────────────────────────────────────

export async function getNode(type: NodeType, code: string) {
  return prisma.node.findUnique({
    where: { type_code: { type, code } },
  })
}

export async function getNodeWithEdges(type: NodeType, code: string) {
  return prisma.node.findUnique({
    where: { type_code: { type, code } },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })
}

export async function getUserNode(userId: string) {
  return prisma.node.findUnique({
    where: { userId },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })
}

// ─── Edge operations ─────────────────────────────────────────

export async function createEdge(
  fromType: NodeType,
  fromCode: string,
  toType: NodeType,
  toCode: string,
  relation: EdgeRelation,
  weight?: number,
  properties?: Record<string, unknown>
) {
  const from = await getNode(fromType, fromCode)
  const to = await getNode(toType, toCode)
  if (!from || !to) return null

  return prisma.edge.upsert({
    where: { fromId_toId_relation: { fromId: from.id, toId: to.id, relation } },
    create: { fromId: from.id, toId: to.id, relation, weight, properties: properties ?? undefined },
    update: { weight, properties: properties ?? undefined },
  })
}

export async function deleteEdge(fromId: string, toId: string, relation: EdgeRelation) {
  return prisma.edge.deleteMany({
    where: { fromId, toId, relation },
  })
}

export async function getUserEdges(userId: string, relation?: EdgeRelation) {
  const node = await prisma.node.findUnique({ where: { userId } })
  if (!node) return []

  return prisma.edge.findMany({
    where: { fromId: node.id, ...(relation ? { relation } : {}) },
    include: { to: true },
  })
}

// ─── Dimension queries (for map) ─────────────────────────────

/**
 * Find all countries connected to a specific dimension node.
 * E.g., "Which countries have Swahili as official language?"
 * → getCountriesByDimension('LANGUAGE', 'sw', 'OFFICIAL_LANG')
 */
export async function getCountriesByDimension(
  dimensionType: NodeType,
  dimensionCode: string,
  relation: EdgeRelation
) {
  const dimensionNode = await getNode(dimensionType, dimensionCode)
  if (!dimensionNode) return []

  // Countries are always "from" in canonical direction
  const edges = await prisma.edge.findMany({
    where: { toId: dimensionNode.id, relation },
    include: { from: true },
  })

  return edges.filter((e) => e.from.type === 'COUNTRY').map((e) => e.from)
}

/**
 * Intersect multiple dimension filters.
 * Returns countries that match ALL active filters.
 */
export async function filterCountries(
  filters: { dimensionType: NodeType; dimensionCode: string; relation: EdgeRelation }[]
) {
  if (filters.length === 0) {
    return prisma.node.findMany({ where: { type: 'COUNTRY', active: true } })
  }

  // Get country sets for each filter
  const countrySets = await Promise.all(
    filters.map((f) => getCountriesByDimension(f.dimensionType, f.dimensionCode, f.relation))
  )

  // Intersect: keep only countries present in ALL sets
  const countryIds = countrySets.reduce(
    (intersection, set) => {
      const ids = new Set(set.map((n) => n.id))
      return intersection.filter((id) => ids.has(id))
    },
    countrySets[0]?.map((n) => n.id) ?? []
  )

  return prisma.node.findMany({
    where: { id: { in: countryIds }, type: 'COUNTRY' },
  })
}

// ─── Subgraph extraction (for AI agent) ──────────────────────

/**
 * Build a subgraph context for an AI agent persona.
 * Given dimensions, returns all connected nodes and their properties.
 */
export async function buildAgentContext(dimensions: Record<string, string>) {
  const nodes: Record<string, unknown>[] = []

  for (const [dimType, code] of Object.entries(dimensions)) {
    const nodeType = dimType.toUpperCase() as NodeType
    const node = await getNodeWithEdges(nodeType, code)
    if (node) {
      nodes.push({
        type: node.type,
        code: node.code,
        label: node.label,
        properties: node.properties,
        connections: node.outEdges.map((e) => ({
          relation: e.relation,
          target: e.to.label,
          targetType: e.to.type,
        })),
      })
    }
  }

  return nodes
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/graph.ts
git commit -m "feat: lib/graph.ts — graph CRUD, dimension queries, agent context builder"
```

---

### Task 8: Seed script — 193 countries + languages + faiths + currencies + edges

**Files:**

- Create: `prisma/seed.ts`

- [ ] **Step 1: Write seed script**

The seed script must:

1. Import country data from `lib/country-selector.ts` (COUNTRY_OPTIONS, LANGUAGE_REGISTRY)
2. Import faith data from `lib/dimensions.ts` (FAITH_OPTIONS)
3. Create COUNTRY nodes for all 193 countries (use COUNTRY_OPTIONS + fill gaps)
4. Create LANGUAGE nodes for all languages in LANGUAGE_REGISTRY
5. Create FAITH nodes from FAITH_OPTIONS
6. Create CURRENCY nodes (extracted from country data)
7. Create SECTOR nodes from EXPLORER_TYPES sectors
8. Create OFFICIAL_LANG edges (country → language)
9. Create COUNTRY_CURRENCY edges (country → currency)
10. Create DOMINANT_FAITH edges (country → faith, from real-world data)
11. Create PARENT_OF edges (country → major cities)
12. Create CORRIDOR edges (from existing compass routes)

**Important:** Use `prisma.node.upsert` for idempotency. Seed must be re-runnable.

```typescript
import { PrismaClient } from '@prisma/client'
// Import existing data sources
// Note: These imports will need adjustment based on actual export names
// The seed script should read from the existing lib/ data files

const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Seeding Be[X] v2 graph...')

  // Phase 1: Create dimension nodes
  await seedFaiths()
  await seedCurrencies()
  await seedLanguages()
  await seedSectors()
  await seedCountries()

  // Phase 2: Create edges
  await seedCountryLanguageEdges()
  await seedCountryCurrencyEdges()
  await seedCountryFaithEdges()

  console.log('✅ Seed complete')
}

// ... (implementation reads from lib/country-selector.ts data)
```

**Data sources — what actually exists in lib/:**

- `COUNTRY_OPTIONS` (from `country-selector.ts`) → COUNTRY nodes + coordinates + currencies + languages
- `LANGUAGE_REGISTRY` (from `country-selector.ts`) → LANGUAGE nodes
- `FAITH_OPTIONS` (from `dimensions.ts`) → FAITH nodes (8 total)
- `EXPLORER_TYPES` (from `vocabulary.ts`) → SECTOR nodes (6 categories → ~24 sectors)
- Currency codes → extracted from `COUNTRY_OPTIONS.currency`

**Edges seeded from existing mappings:**

- `OFFICIAL_LANG` → from `LANGUAGE_REGISTRY[lang].countries` (already maps lang → countries)
- `COUNTRY_CURRENCY` → from `COUNTRY_OPTIONS[country].currency`

**Deferred (no existing data source):**

- `LOCATION` nodes (cities) → deferred, requires new dataset
- `CULTURE` nodes (ethnic groups) → deferred, requires new dataset
- `BORDERS` edges (geographic neighbors) → deferred, requires adjacency data
- `DOMINANT_FAITH` edges (country → faith) → deferred, requires 193-entry research
- `CORRIDOR` edges → can be extracted from `lib/compass.ts` later

- [ ] **Step 2: Add db:seed script to package.json**

Add to `scripts` in `package.json`:

```json
"db:seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
```

- [ ] **Step 3: Run seed**

```bash
npm run db:seed
```

- [ ] **Step 4: Verify counts**

```bash
npx prisma studio
```

Expected: ~120 COUNTRY nodes, ~100 LANGUAGE nodes, 8 FAITH nodes, ~50 CURRENCY nodes, ~24 SECTOR nodes, ~400 OFFICIAL_LANG edges, ~120 COUNTRY_CURRENCY edges.

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: seed script — countries, languages, faiths, currencies, sectors + edges

Data sourced from existing lib/ modules. LOCATION, CULTURE, BORDERS deferred."
```

---

### Task 9: Install new dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install MapLibre + React wrapper**

```bash
npm install maplibre-gl react-map-gl
```

- [ ] **Step 2: Install Anthropic SDK for Claude AI**

```bash
npm install @anthropic-ai/sdk
```

- [ ] **Step 3: Install Google Generative AI SDK for Gemini**

```bash
npm install @google/generative-ai
```

- [ ] **Step 4: Verify package.json**

```bash
cat package.json | grep -E "maplibre|anthropic|google.*generative"
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install maplibre-gl, react-map-gl, @anthropic-ai/sdk, @google/generative-ai"
```

---

### Task 10: Minimal app shell — layout + homepage stub + login

**Files:**

- Create: `app/layout.tsx`
- Create: `app/page.tsx` (map stub)
- Create: `app/login/page.tsx`
- Create: `app/signup/page.tsx`
- Create: `app/globals.css`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `components/Providers.tsx`

- [ ] **Step 1: Create app directory**

```bash
mkdir -p app/login app/signup app/api/auth/\[...nextauth\] components
```

- [ ] **Step 2: Write app/globals.css — brand tokens**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #5c0a14;
  --color-accent: #c9a227;
  --color-bg: #0a0a0f;
  --color-surface: #111118;
  --color-text: #e8e6e3;
  --color-text-muted: #9ca3af;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

- [ ] **Step 3: Write components/Providers.tsx**

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

- [ ] **Step 4: Write app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Be[X] — The world is connected to you',
  description: 'Identity-first world map. Explore humanity by language, faith, sector, location, currency.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Write app/page.tsx — map placeholder**

```typescript
export default function HomePage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-brand-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-accent">Be[X]</h1>
        <p className="mt-2 text-brand-text-muted">The world is connected to you.</p>
        <p className="mt-4 text-sm text-brand-text-muted">Map loading in Phase 2...</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Write app/api/auth/[...nextauth]/route.ts**

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

- [ ] **Step 7: Write app/login/page.tsx and app/signup/page.tsx**

Minimal Google auth button pages using the existing auth pattern from `lib/auth.ts`.

- [ ] **Step 8: Verify build**

```bash
npm run build
```

- [ ] **Step 9: Commit**

```bash
git add app/ components/Providers.tsx
git commit -m "feat: minimal app shell — layout, map placeholder, auth routes

7 routes planned: /, /agent, /me, /be/[code], /exchange/[id], /login, /signup
Currently: /, /login, /signup + auth API"
```

---

### Task 11: First test — graph queries

**Files:**

- Create: `__tests__/lib/graph.test.ts`

- [ ] **Step 1: Create test directory**

```bash
mkdir -p __tests__/lib
```

- [ ] **Step 2: Write graph query tests**

```typescript
/**
 * Tests for lib/graph.ts — the graph query engine
 */
import { getNode, getNodeWithEdges, filterCountries, buildAgentContext } from '@/lib/graph'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    node: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    edge: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

describe('Graph queries', () => {
  test('getNode returns node by type+code', async () => {
    const { prisma } = require('@/lib/db')
    prisma.node.findUnique.mockResolvedValue({
      id: '1',
      type: 'COUNTRY',
      code: 'KE',
      label: 'Kenya',
    })

    const node = await getNode('COUNTRY', 'KE')
    expect(node?.code).toBe('KE')
    expect(prisma.node.findUnique).toHaveBeenCalledWith({
      where: { type_code: { type: 'COUNTRY', code: 'KE' } },
    })
  })

  test('filterCountries with no filters returns all countries', async () => {
    const { prisma } = require('@/lib/db')
    prisma.node.findMany.mockResolvedValue([
      { id: '1', type: 'COUNTRY', code: 'KE' },
      { id: '2', type: 'COUNTRY', code: 'DE' },
    ])

    const countries = await filterCountries([])
    expect(countries).toHaveLength(2)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test -- __tests__/lib/graph.test.ts
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add __tests__/
git commit -m "test: graph query tests — getNode, filterCountries"
```

---

### Task 11.5: Create .env.example

**Files:**

- Create: `.env.example`

- [ ] **Step 1: Write .env.example with all required vars**

```bash
# Auth (required)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Database (required)
DATABASE_URL=

# Email (required for magic link)
RESEND_API_KEY=

# Map (required for map tiles)
NEXT_PUBLIC_MAPTILER_KEY=

# AI Agent (required for chat)
ANTHROPIC_API_KEY=

# AI Fallback + Translation (optional)
GOOGLE_GEMINI_API_KEY=
DEEPL_API_KEY=

# Country deployment
NEXT_PUBLIC_COUNTRY_CODE=KE
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: .env.example — all required environment variables for Be[X] v2"
```

---

## Chunk 2: The Map

### Task 12: GeoJSON country boundaries

**Files:**

- Create: `public/geo/countries.json`

- [ ] **Step 1: Download simplified Natural Earth GeoJSON (~500KB)**

Use the 110m simplified version (NOT the full ~24MB version — too large for Vercel static hosting):

```bash
mkdir -p public/geo
curl -L "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json" -o public/geo/countries-topo.json
```

Or if TopoJSON, convert to GeoJSON:

```bash
npm install -D topojson-client
node -e "const t=require('topojson-client'),d=require('./public/geo/countries-topo.json');const g=t.feature(d,d.objects.countries);require('fs').writeFileSync('./public/geo/countries.json',JSON.stringify(g))"
npm uninstall topojson-client
```

Target: <1MB GeoJSON with ISO_A2 or ISO_A3 property per feature.

- [ ] **Step 2: Verify GeoJSON is valid and check property names**

```bash
node -e "const g=require('./public/geo/countries.json');console.log(g.type,g.features.length,'countries');console.log('Properties:',Object.keys(g.features[0].properties))"
```

Expected: ~177+ features. Note the actual ISO property name (may be `ISO_A2`, `ISO_A3`, `iso_a2`, or `name`). Update WorldMap.tsx to use the correct property name.

- [ ] **Step 3: Commit**

```bash
git add public/geo/
git commit -m "feat: add Natural Earth country boundaries GeoJSON (193 countries)"
```

---

### Task 13: Map component

**Files:**

- Create: `components/WorldMap.tsx`
- Create: `components/DimensionFilters.tsx`
- Create: `components/CountryPanel.tsx`

- [ ] **Step 1: Write WorldMap.tsx — fullscreen MapLibre component**

**Note:** MapLibre CSS must be imported in `app/globals.css`, NOT in the component (Next.js App Router does not allow CSS imports from node_modules in client components).

Add to `app/globals.css` at the top:

```css
@import 'maplibre-gl/dist/maplibre-gl.css';
```

```typescript
'use client'

import { useCallback, useRef } from 'react'
import { Map, Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { MapCountry } from '@/types/domain'

interface WorldMapProps {
  countries: MapCountry[]
  onCountryClick: (code: string) => void
}

export default function WorldMap({ countries, onCountryClick }: WorldMapProps) {
  const mapRef = useRef<MapRef>(null)

  // Note: Update 'ISO_A2' below to match your GeoJSON's actual property name
  const handleClick = useCallback((e: MapLayerMouseEvent) => {
    const features = e.features
    if (features?.[0]?.properties?.ISO_A2) {
      onCountryClick(features[0].properties.ISO_A2)
    }
  }, [onCountryClick])

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 20, latitude: 10, zoom: 2 }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      onClick={handleClick}
      interactiveLayerIds={['country-fill']}
    >
      <Source id="countries" type="geojson" data="/geo/countries.json">
        <Layer
          id="country-fill"
          type="fill"
          paint={{
            'fill-color': '#C9A227',
            'fill-opacity': 0.15,
          }}
        />
        <Layer
          id="country-border"
          type="line"
          paint={{
            'line-color': '#C9A227',
            'line-width': 0.5,
            'line-opacity': 0.3,
          }}
        />
      </Source>
    </Map>
  )
}
```

- [ ] **Step 2: Write DimensionFilters.tsx — horizontal pill bar**

```typescript
'use client'

import { useState } from 'react'
import type { DimensionFilter } from '@/types/domain'

const DIMENSIONS = [
  { key: 'language', label: '🗣️', name: 'Language' },
  { key: 'faith', label: '☪️', name: 'Faith' },
  { key: 'sector', label: '💼', name: 'Sector' },
  { key: 'location', label: '📍', name: 'Location' },
  { key: 'currency', label: '💱', name: 'Currency' },
  { key: 'culture', label: '🏛️', name: 'Culture' },
] as const

interface DimensionFiltersProps {
  activeFilters: DimensionFilter[]
  onFilterChange: (filters: DimensionFilter[]) => void
}

export default function DimensionFilters({ activeFilters, onFilterChange }: DimensionFiltersProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-brand-surface/90 backdrop-blur px-4 py-2 rounded-full border border-brand-accent/20">
      {DIMENSIONS.map((dim) => {
        const isActive = activeFilters.some((f) => f.dimension === dim.key)
        return (
          <button
            key={dim.key}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              isActive
                ? 'bg-brand-accent text-brand-bg'
                : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
            }`}
            title={dim.name}
          >
            {dim.label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Write CountryPanel.tsx — slide-in panel on country click**

```typescript
'use client'

interface CountryPanelProps {
  countryCode: string | null
  onClose: () => void
}

export default function CountryPanel({ countryCode, onClose }: CountryPanelProps) {
  if (!countryCode) return null

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-brand-surface border-l border-brand-accent/20 z-30 p-6 overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-muted hover:text-brand-text">
        ✕
      </button>
      <h2 className="text-2xl font-bold text-brand-accent">Be{countryCode}</h2>
      {/* Country hub content populated from graph edges */}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/WorldMap.tsx components/DimensionFilters.tsx components/CountryPanel.tsx
git commit -m "feat: map components — WorldMap (MapLibre), DimensionFilters, CountryPanel"
```

---

### Task 14: Map filter API

**Files:**

- Create: `app/api/map/filter/route.ts`

- [ ] **Step 1: Write filter API**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { filterCountries } from '@/lib/graph'
import type { NodeType, EdgeRelation } from '@prisma/client'

const DIMENSION_TO_EDGE: Record<string, { nodeType: NodeType; relation: EdgeRelation }> = {
  language: { nodeType: 'LANGUAGE', relation: 'OFFICIAL_LANG' },
  faith: { nodeType: 'FAITH', relation: 'DOMINANT_FAITH' },
  sector: { nodeType: 'SECTOR', relation: 'HAS_SECTOR' },
  currency: { nodeType: 'CURRENCY', relation: 'COUNTRY_CURRENCY' },
  location: { nodeType: 'LOCATION', relation: 'PARENT_OF' },
  // Note: culture filter deferred — no COUNTRY→CULTURE edge yet.
  // Will be added when CULTURE nodes + edges are seeded (follow-up plan).
}

export async function POST(req: NextRequest) {
  const { filters } = await req.json()

  const graphFilters = filters
    .map((f: { dimension: string; nodeCode: string }) => {
      const mapping = DIMENSION_TO_EDGE[f.dimension]
      if (!mapping) return null
      return {
        dimensionType: mapping.nodeType,
        dimensionCode: f.nodeCode,
        relation: mapping.relation,
      }
    })
    .filter(Boolean)

  const countries = await filterCountries(graphFilters)

  return NextResponse.json({
    countries: countries.map((c) => ({
      code: c.code,
      name: c.label,
      lat: c.lat,
      lng: c.lng,
      matchStrength: 1.0,
    })),
    totalMatches: countries.length,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/map/
git commit -m "feat: /api/map/filter — dimension intersection queries for map coloring"
```

---

### Task 15: Wire map into homepage

**Files:**

- Modify: `app/page.tsx`

- [ ] **Step 1: Replace stub with real map**

```typescript
'use client'

import { useState } from 'react'
import WorldMap from '@/components/WorldMap'
import DimensionFilters from '@/components/DimensionFilters'
import CountryPanel from '@/components/CountryPanel'
import type { DimensionFilter, MapCountry } from '@/types/domain'

export default function HomePage() {
  const [filters, setFilters] = useState<DimensionFilter[]>([])
  const [countries, setCountries] = useState<MapCountry[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <WorldMap
        countries={countries}
        onCountryClick={setSelectedCountry}
      />

      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-xl font-bold text-brand-accent">Be[X]</h1>
      </div>

      <DimensionFilters
        activeFilters={filters}
        onFilterChange={setFilters}
      />

      <CountryPanel
        countryCode={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </main>
  )
}
```

- [ ] **Step 2: Verify dev server renders map**

```bash
npm run dev
# Open http://localhost:3000 — should show dark world map with dimension pills
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage is now fullscreen world map with dimension filters"
```

---

## Chunk 3: The AI Agent

### Task 16: Claude API integration — lib/ai.ts

**Files:**

- Create: `lib/ai.ts`

- [ ] **Step 1: Write ai.ts — Claude + Gemini with persona builder**

```typescript
/**
 * AI Agent — Claude API primary, Gemini fallback
 *
 * Builds dimension-crossing personas from graph edges.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AgentDimensions } from '@/types/domain'
import { buildAgentContext } from '@/lib/graph'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Build a system prompt for an AI agent based on dimension crossings.
 */
export async function buildPersonaPrompt(dimensions: AgentDimensions): Promise<string> {
  const context = await buildAgentContext(
    Object.fromEntries(Object.entries(dimensions).filter(([, v]) => v))
  )

  const parts = [
    `You are a Be[X] agent — a knowledgeable, warm persona representing the intersection of:`,
  ]

  for (const node of context) {
    const n = node as {
      type: string
      label: string
      connections?: { relation: string; target: string }[]
    }
    parts.push(`- ${n.type}: ${n.label}`)
    if (n.connections?.length) {
      parts.push(
        `  Connected to: ${n.connections.map((c) => `${c.target} (${c.relation})`).join(', ')}`
      )
    }
  }

  parts.push('')
  parts.push('Rules:')
  parts.push('- Respond in the language specified by the language dimension (or English if none)')
  parts.push('- Be warm, knowledgeable, and culturally aware')
  parts.push('- Use real-world knowledge about these dimensions')
  parts.push('- Be concise — less words, more value')
  parts.push('- Never make up statistics or data')

  return parts.join('\n')
}

/**
 * Chat with an AI agent persona. Returns streamed response.
 */
export async function chatWithAgent(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

/**
 * Stream chat with agent (for real-time UI).
 */
export function streamChatWithAgent(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
) {
  return anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/ai.ts
git commit -m "feat: lib/ai.ts — Claude API integration with graph-powered persona builder"
```

---

### Task 17: Agent chat API route

**Files:**

- Create: `app/api/agent/chat/route.ts`

- [ ] **Step 1: Write streaming agent chat endpoint**

```typescript
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildPersonaPrompt, streamChatWithAgent } from '@/lib/ai'
import { prisma } from '@/lib/db'
import type { AgentChatRequest } from '@/types/api'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body: AgentChatRequest = await req.json()
  const { dimensions, message, conversationId } = body

  // Load or create conversation
  let history: { role: 'user' | 'assistant'; content: string }[] = []
  let chatId = conversationId

  if (chatId) {
    const chat = await prisma.agentChat.findUnique({ where: { id: chatId } })
    if (chat) {
      history = (chat.messages as { role: 'user' | 'assistant'; content: string }[]) ?? []
    }
  }

  // Build persona from graph
  const systemPrompt = await buildPersonaPrompt(dimensions)

  // Add new user message
  history.push({ role: 'user', content: message })

  // Stream response
  const stream = streamChatWithAgent(systemPrompt, history)

  // Collect full response for storage
  let fullResponse = ''

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const response = await stream.finalMessage()
      fullResponse = response.content[0].type === 'text' ? response.content[0].text : ''

      controller.enqueue(encoder.encode(fullResponse))
      controller.close()

      // Save conversation
      history.push({ role: 'assistant', content: fullResponse })

      if (chatId) {
        await prisma.agentChat.update({
          where: { id: chatId },
          data: { messages: history, dimensions },
        })
      } else {
        const chat = await prisma.agentChat.create({
          data: {
            userId: session.user.id,
            dimensions,
            messages: history,
          },
        })
        chatId = chat.id
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain',
      'X-Conversation-Id': chatId ?? '',
    },
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/agent/
git commit -m "feat: /api/agent/chat — streaming Claude agent with graph persona context"
```

---

### Task 18: Agent chat UI

**Files:**

- Create: `components/AgentChat.tsx`
- Create: `app/agent/page.tsx`

- [ ] **Step 1: Write AgentChat.tsx — floating chat overlay**

Minimal chat bubble UI: input, messages list, dimension selector at top. Uses `fetch('/api/agent/chat')` for streaming.

- [ ] **Step 2: Write app/agent/page.tsx — standalone agent page**

Full-page version of the agent chat, also accessible as overlay on the map.

- [ ] **Step 3: Commit**

```bash
git add components/AgentChat.tsx app/agent/
git commit -m "feat: agent chat UI — floating overlay + standalone /agent page"
```

---

## Chunk 4: Identity & Remaining Routes

### Task 19: Identity context — graph-aware

**Files:**

- Create: `lib/identity-context.tsx`

- [ ] **Step 1: Write graph-aware identity context**

React context that:

1. Reads user session (NextAuth)
2. Loads user's Node + edges from graph
3. Provides `{ country, language, edges, node }` to all components
4. Triggers i18n language switch when identity changes

- [ ] **Step 2: Commit**

---

### Task 20: /me page — visual identity graph

**Files:**

- Create: `app/me/page.tsx`

- [ ] **Step 1: Write /me page**

Shows user's edges as a visual graph: YOU → speaks → [German, English], YOU → practices → [Secular], etc. Each node is clickable → shows who else shares that edge.

- [ ] **Step 2: Commit**

---

### Task 21: /onboarding — creates edges

**Files:**

- Create: `app/onboarding/page.tsx`
- Create: `app/api/onboarding/route.ts`

- [ ] **Step 1: Write onboarding page**

Step-by-step identity builder. Each step creates edges:

1. Select languages → SPEAKS edges
2. Select faith → PRACTICES edge
3. Select crafts/sectors → WORKS_IN + HAS_SKILL edges
4. Select locations → LOCATED_IN edges
5. Select cultures → BELONGS_TO edges

- [ ] **Step 2: Write onboarding API**

POST endpoint that creates all edges for a user at once.

- [ ] **Step 3: Commit**

---

### Task 22: /be/[code] — country hub

**Files:**

- Create: `app/be/[code]/page.tsx`

- [ ] **Step 1: Write country hub page**

Pulls country data from graph Node + edges. Shows: languages, faiths, sectors, corridors, people located there.

- [ ] **Step 2: Commit**

---

### Task 23: /exchange/[id] — opportunity detail

**Files:**

- Create: `app/exchange/[id]/page.tsx`

- [ ] **Step 1: Write exchange detail page**

Shows an Experience node with its edges (who offers it, what dimensions it connects to).

- [ ] **Step 2: Commit**

---

## Chunk 5: Tests & Polish

### Task 24: Core test suite

**Files:**

- Create: `__tests__/lib/graph.test.ts` (expand from Task 11)
- Create: `__tests__/lib/ai.test.ts`
- Create: `__tests__/api/map-filter.test.ts`
- Create: `__tests__/api/agent-chat.test.ts`
- Create: `__tests__/lib/vocabulary.test.ts`

- [ ] **Step 1: Write comprehensive graph tests**
- [ ] **Step 2: Write AI persona builder tests**
- [ ] **Step 3: Write map filter API tests**
- [ ] **Step 4: Write agent chat API tests**
- [ ] **Step 5: Write vocabulary tests (no legacy terms)**
- [ ] **Step 6: Run full suite**

```bash
npm test
```

- [ ] **Step 7: Commit**

---

### Task 25: Playwright E2E tests

**Files:**

- Create: `tests/visual/map.spec.ts`
- Create: `tests/visual/agent.spec.ts`
- Create: `tests/visual/identity.spec.ts`

- [ ] **Step 1: Write map interaction tests**
- [ ] **Step 2: Write agent chat tests**
- [ ] **Step 3: Write identity/language switch tests**
- [ ] **Step 4: Run E2E suite**

```bash
npx playwright test
```

- [ ] **Step 5: Commit**

---

### Task 26: Build verification + cleanup

- [ ] **Step 1: TypeScript check**

```bash
npm run typecheck
```

Expected: 0 errors

- [ ] **Step 2: Full build**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 3: Lint + format**

```bash
npm run format
npm run lint
```

- [ ] **Step 4: Verify no dead imports**

```bash
grep -r "Pioneer\|Anchor\|PIONEER\|ANCHOR\|Path\b\|Chapter\b" lib/ app/ components/ types/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".md"
```

Expected: 0 matches (no legacy vocabulary in code)

- [ ] **Step 5: Final commit + push**

```bash
git add -A
git commit -m "feat: Be[X] v2 complete — graph architecture, world map, AI agents

Nuclear rebuild: 364 files → ~40 files. Node+Edge graph, MapLibre map,
Claude AI agents, 7 routes. Clean, no legacy, KISS."
git push origin main
```

---

## Summary

| Chunk         | Tasks | What it delivers                                                             |
| ------------- | ----- | ---------------------------------------------------------------------------- |
| 1: Foundation | 1–11  | Clean repo, new schema, auth, graph utils, seed data, types, .env, app shell |
| 2: The Map    | 12–15 | Fullscreen MapLibre map with dimension filtering                             |
| 3: The Agent  | 16–18 | Claude AI with graph-powered personas                                        |
| 4: Identity   | 19–23 | /me, /onboarding, /be/[code], /exchange/[id]                                 |
| 5: Tests      | 24–26 | Jest + Playwright + build verification + legacy cleanup                      |

**Total: 27 tasks. Each task = one commit. Clean, traceable, reversible.**

**Deferred to follow-up plan (Phase 5):**

- Exchange/opportunity creation UI (Host creates Experience nodes)
- Messaging UI (Conversation + Message models ready, no frontend)
- Payment integration (Payment model ready, no checkout flow)
- LOCATION, CULTURE, BORDERS seed data (requires new datasets)
- DeepL translation integration (Tier B auto-translate)
- Gemini fallback LLM
