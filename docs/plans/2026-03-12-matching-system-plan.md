# BeNetwork Matching & Personalization System — Architecture Plan

> **Goal:** Build a real matching engine that connects Pioneers to opportunities based on their identity dimensions, with AI agents that "auf den Menschen eingehen" (understand and respond to each person individually).

---

## 1. Vocabulary Alignment

**Problem:** "topic", "Handwerk", "craft", "interests", "exchange categories" — too many terms for overlapping concepts.

**Decision:** Use the BeNetwork vocabulary consistently:

| Dimension    | English  | German       | Purpose                                   |
| ------------ | -------- | ------------ | ----------------------------------------- |
| **Craft**    | Craft    | Handwerk     | Your skills/profession — what you DO      |
| **Passion**  | Passion  | Leidenschaft | Your interests — what you LOVE            |
| **Reach**    | Reach    | Reichweite   | How you can engage — travel, host, mentor |
| **Faith**    | Faith    | Glaube       | Spiritual identity                        |
| **Culture**  | Culture  | Kultur       | Ethnic/cultural identity                  |
| **Language** | Language | Sprache      | Languages you speak                       |
| **Location** | Location | Standort     | Where you are                             |
| **Market**   | Market   | Markt        | Economic opportunities in your corridor   |

**Rule:** These 8 dimensions appear everywhere with the same name. No aliases. Source: `lib/dimensions.ts` DIMENSION_META.

---

## 2. Profile Priority Settings

**Feature:** Let Pioneers set which dimensions matter most to THEM.

```
Profile → "What matters most to you?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Language      ████████████ HIGH
🛠️ Craft         ████████████ HIGH
📍 Location      ████████░░░░ MEDIUM
🙏 Faith         ████░░░░░░░░ LOW
🌿 Culture       ████████░░░░ MEDIUM
🌐 Reach         ████████████ HIGH
❤️ Passion       ████████░░░░ MEDIUM
📊 Market        ████░░░░░░░░ LOW
```

**Implementation:**

- Add `priorities: Record<string, 'high' | 'medium' | 'low'>` to Profile model
- Default: Language=HIGH, Craft=HIGH, Location=MEDIUM, others=MEDIUM
- Matching engine multiplies dimension scores by priority weight:
  - HIGH = 1.5x
  - MEDIUM = 1.0x
  - LOW = 0.5x

**DB field:** `priorities Json?` on Profile model

---

## 3. Real Matching Engine (No Hardcoded Data)

**Current state:** `lib/matching.ts` scores profiles against each other using 4 dimensions. It works on mock data.

**Target state:** Score against REAL Paths, REAL Pioneers, and REAL Opportunities from the database.

### Scoring Algorithm

```
TotalScore = Σ (DimensionScore × PriorityWeight × DimensionWeight)

DimensionWeights:
  Language overlap:     40 points (shared languages = collaboration)
  Craft match:          30 points (skill alignment)
  Passion overlap:      20 points (shared interests)
  Location proximity:   25 points (geographic closeness)
  Reach compatibility:  15 points (can-travel + can-host = match)
  Faith alignment:      8 points (optional, only if both set priority HIGH)
  Culture affinity:     10 points (same cultural background)
  Market opportunity:   20 points (corridor demand signals)
```

### Data Flow

```
Pioneer Profile (DB)
    ↓
Matching Engine (server-side)
    ↓ scores against
Available Paths (DB) + Other Pioneers (DB)
    ↓ ranked by
Priority-weighted composite score
    ↓
Personalized Feed (API → Frontend)
```

### API Endpoints

```
GET /api/matches
  → Returns top-N matches for current user
  → Params: type=paths|pioneers|all, limit=20
  → Uses DB queries with scoring

GET /api/feed
  → Personalized feed combining Paths + Pioneers + Experiences
  → Sorted by match score × recency
  → Paginated (cursor-based)
```

---

## 4. Agent Per Country — Personalization Layer

**Concept:** Each country deployment has a "virtual agent" persona that:

1. Knows the local market (sectors, demand, salaries)
2. Speaks the local languages
3. Understands cultural context
4. Can recommend specific actions

### Agent Architecture

```
lib/agents.ts (already exists)
  ↓ defines
AgentPersona per country
  ↓ powers
Compass recommendations
  ↓ fed by
Market signals (lib/market-data.ts)
  ↓ displayed on
Gate pages (/be/[country])
```

### Agent Intelligence (n8n Integration)

```
n8n Workflow:
  Trigger: New Pioneer signs up / updates profile
  ↓
  Fetch: Pioneer's dimensions from DB
  ↓
  Match: Run matching algorithm against available Paths
  ↓
  Notify: Send personalized recommendations via email/push
  ↓
  Track: Log engagement for feedback loop
```

### E-Service Automation

```
Services we can sell:
1. CV/Resume Enhancement  → n8n workflow: AI processes resume
2. Skill Assessment       → n8n workflow: quiz → certification
3. Visa Guidance          → n8n workflow: country-pair ruleset
4. Interview Prep         → n8n workflow: AI mock interview
5. Market Report          → n8n workflow: scrape + analyze demand
```

Each e-service:

- Listed on `/offerings` page
- Triggered by n8n webhook (`/api/webhooks/n8n`)
- Results stored in DB
- Charged via M-Pesa/Stripe

---

## 5. Implementation Phases

### Phase A: Foundation (This Sprint)

1. ✅ Profile dimensions persisted to DB
2. ✅ Pioneer ID for sharing
3. Add `priorities` field to Profile
4. Add priority selector UI to Me page
5. Ensure all UI text uses `t()` (no hardcoded English)

### Phase B: Real Matching

6. Create `/api/matches` endpoint with scoring algorithm
7. Create `/api/feed` endpoint for personalized feed
8. Replace mock data on homepage/ventures with real DB queries
9. Wire Compass wizard to store results in DB

### Phase C: Agent Intelligence

10. n8n webhook integration for profile events
11. Email notifications for new matches (via Resend)
12. Agent personas generate recommendations server-side
13. Gate pages show real market data + agent insights

### Phase D: E-Services

14. Offerings page connected to real service catalog
15. n8n workflows for each e-service
16. Payment integration for premium services
17. Results delivery and tracking

---

## 6. Single Source of Truth Rules

| Data        | Source                       | Never                            |
| ----------- | ---------------------------- | -------------------------------- |
| Countries   | `lib/country-selector.ts`    | Inline in pages                  |
| Languages   | `LANGUAGE_REGISTRY`          | Hardcode language names          |
| Categories  | `lib/exchange-categories.ts` | Duplicate in components          |
| Dimensions  | `lib/dimensions.ts`          | Inline dimension lists           |
| Vocabulary  | `lib/vocabulary.ts`          | Use "job", "user", "application" |
| UI Text     | `lib/i18n.ts` via `t()`      | Hardcode English strings         |
| Market Data | `lib/market-data.ts`         | Inline economic stats            |
| Nav Links   | `lib/nav-structure.ts`       | Inline nav items                 |
| Mock Data   | `data/mock/`                 | Inline fake data in pages        |

---

## 7. Verification Checklist

- [ ] All system text uses `t()` — zero hardcoded English in UI
- [ ] Profile saves all 8 dimensions to DB
- [ ] Priority weights affect matching scores
- [ ] Pioneer ID is unique and shareable
- [ ] Agent per country knows local market
- [ ] Matching algorithm uses real DB data
- [ ] n8n webhooks receive profile events
- [ ] All 4 languages have complete translations
