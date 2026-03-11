# Be[Country] — Component Architecture & User Workflow

> Full system concept. Component inventory, workflow visualization, redundancy map.
> ← [CLAUDE.md](./CLAUDE.md) | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [PRD.md](./PRD.md)
> Updated: Session 24 (2026-03-11)

---

## User Journey Workflow

The platform follows a **5-stage psychological progression**. Every page, component, and interaction maps to a stage.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PIONEER JOURNEY                                 │
│                                                                     │
│  ┌──────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐   ┌──────┐│
│  │ DISCOVER  │──▶│  TRUST  │──▶│ ENGAGE  │──▶│ BELONG │──▶│ADVOCATE│
│  └──────────┘   └─────────┘   └─────────┘   └────────┘   └──────┘│
│  Homepage       About         Compass        Dashboard    Referral │
│  Gate pages     Charity       Ventures       Profile      Media    │
│  Offerings      Pricing       Experiences    Onboarding   Stories  │
│                 Privacy       Post-Path      Communities           │
│                                                                     │
│  Psychology:    Psychology:   Psychology:    Psychology:   Psych:   │
│  Curiosity      Social proof  Purpose        Identity     Pride    │
│  Identity       Authority     Personalization Achievement  Reward  │
└─────────────────────────────────────────────────────────────────────┘
```

### Detailed Flow: Pioneer

```
Landing (/)
  ├── Hero with rotating Be[Country] teaser → Identity hook
  ├── Compass Preview → Quick engagement
  ├── Safari strip → Visual appeal
  ├── UTAMADUNI impact → Trust building
  └── CTA: "Start Compass" or "Browse Ventures"
        │
        ▼
Compass Wizard (/compass) — 4 steps
  Step 1: Select target countries (CountryPrioritySelector)
  Step 2: Select origin city
  Step 3: Select pioneer type
  Step 4: View route results + recommended ventures
        │
        ▼
Ventures Feed (/ventures)
  ├── Filter by category (chip row)
  ├── Featured Paths (PathCard featured=true)
  ├── All Paths (PathCard grid)
  └── Safari Experiences (ExperienceCard grid)
        │
        ▼
Experience Detail (/experiences/[id])
  ├── Hero with booking CTA
  ├── Highlights, itinerary, details
  └── Booking flow: Date → Payment → Confirmation
        │
        ▼
Onboarding (/onboarding) — 5 steps
  Step 1: Pioneer type
  Step 2: Current country
  Step 3: Target destinations
  Step 4: Skills
  Step 5: Profile details (headline, bio, phone)
        │
        ▼
Pioneer Dashboard (/pioneers/dashboard) — 5 tabs
  Tab 1: Compass (active readings)
  Tab 2: Chapters (applications)
  Tab 3: Saved paths
  Tab 4: Referral tracking
  Tab 5: Settings
```

### Detailed Flow: Anchor

```
Pricing (/pricing) → Learn about plans
  └── CTA: "Start Posting Paths"
        │
        ▼
Post-Path Wizard (/anchors/post-path) — 5 steps
  Step 1: Path basics (title, category, type)
  Step 2: Location details
  Step 3: Requirements (skills, experience)
  Step 4: Salary & payment
  Step 5: Review & publish
        │
        ▼
Anchor Dashboard (/anchors/dashboard) — 5 tabs
  Tab 1: Overview (stats, activity)
  Tab 2: Paths (manage listings)
  Tab 3: Chapters (review applications)
  Tab 4: Analytics (corridor breakdown)
  Tab 5: Settings
```

### Thread (Community) Flow — Future

```
Gate Page (/be/[slug])
  ├── Hero with thread identity (BeKenya, BeMaasai, BeTech...)
  ├── Thread stats (members, ventures, activity)
  ├── Curated ventures feed (filtered to this identity)
  ├── Success stories from this community
  ├── Related threads (cross-identity connections)
  └── Child threads (tribes within country, cities within country)
```

---

## Component System

### Layer 1: Design Tokens (globals.css)

Already defined — the foundation. Do NOT create new component files for what CSS classes handle.

| CSS Class        | Purpose                    | Usage                       |
| ---------------- | -------------------------- | --------------------------- |
| `.btn-primary`   | Gradient maroon button     | All primary CTAs            |
| `.btn-secondary` | Surface + gold outline     | Secondary actions           |
| `.card`          | Surface bg + accent border | Content containers          |
| `.input`         | Form input styling         | All text/select inputs      |
| `.badge`         | Small pill label           | Status, category indicators |

**Missing (add to globals.css):**

| CSS Class      | Purpose                   |
| -------------- | ------------------------- |
| `.btn-outline` | Transparent + gold border |
| `.btn-ghost`   | No bg, gold text hover    |
| `.btn-accent`  | Gold bg, dark text        |
| `.btn-sm`      | Smaller padding variant   |
| `.btn-lg`      | Larger padding variant    |

### Layer 2: Shared Components (components/)

| Component                     | Status  | Purpose                                          |
| ----------------------------- | ------- | ------------------------------------------------ |
| `Nav.tsx`                     | ✅ Done | Global nav with Be[Country] teaser               |
| `Footer.tsx`                  | ✅ Done | Global footer with dynamic brand links           |
| `HeroSection.tsx`             | ✅ Done | Gradient hero with optional icon/badge           |
| `PathCard.tsx`                | ✅ Done | Path listing card (ventures feed)                |
| `CountryPrioritySelector.tsx` | ✅ Done | Multi-select country grid (compass)              |
| `Skeleton.tsx`                | ✅ Done | 8 loading skeleton primitives                    |
| `MpesaModal.tsx`              | ✅ Done | M-Pesa payment flow modal                        |
| `SectionHeader.tsx`           | ✅ Done | Section heading (h2 + subtitle)                  |
| `WizardShell.tsx`             | ✅ Done | Shared wizard progress + navigation + nav footer |
| `StatCard.tsx`                | 🔧 TODO | Icon + value + label metric card                 |
| `TabsContainer.tsx`           | 🔧 TODO | Tab header with keyboard nav                     |

### Layer 3: Page-Specific Components (inline in page files)

These are intentionally NOT extracted — they're too page-specific to reuse.

| Component              | Page                | Why inline                      |
| ---------------------- | ------------------- | ------------------------------- |
| `ConfettiBlast`        | onboarding/page.tsx | Celebration-only, single use    |
| `StatusBadge`          | pioneers/dashboard  | Pioneer-specific status logic   |
| `PathStatusBadge`      | anchors/dashboard   | Anchor-specific status logic    |
| `ChapterStatusBadge`   | anchors/dashboard   | Chapter-specific status logic   |
| `ProfileRing`          | pioneers/dashboard  | SVG progress ring, single use   |
| `Chip` (removable tag) | anchors/post-path   | Could extract if used elsewhere |

---

## Redundancy Audit

### ❌ Eliminated

| Issue                                          | Fix                                                           | Status |
| ---------------------------------------------- | ------------------------------------------------------------- | ------ |
| `LoadingSkeleton.tsx` unused dead code         | Deleted                                                       | ✅     |
| Hardcoded "BeKenya" in footer links            | Dynamic from country config                                   | ✅     |
| 13 copy-pasted hero gradient sections          | `HeroSection.tsx` component (3 pages converted, 10 remaining) | 🔧     |
| Duplicate progress bar (compass vs onboarding) | Extract `StepIndicator.tsx`                                   | 🔧     |
| Duplicate tab patterns (2 dashboards)          | Extract `TabsContainer.tsx`                                   | 🔧     |

### ⚠️ Acceptable Duplication

| Pattern                                       | Why it's OK                                                                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `PathCard` in components/ vs ventures/ inline | Different data interfaces — ventures uses `PathListItem`, component uses raw props. Keep both until data model stabilizes. |
| Step content differs per wizard               | Each wizard collects different data. Only the shell (progress bar, nav buttons) should be shared, not step content.        |
| Dashboard stat cards vary by context          | Pioneer dashboard shows compass readings, anchor dashboard shows path metrics. Visual similarity ≠ semantic identity.      |

---

## Input Optimization (Questioning All Inputs)

### Forms: What data do we ACTUALLY need?

| Wizard         | Current Inputs                                                                | Questioned                                        | Recommendation                                                                                  |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Compass**    | Target countries, origin city, pioneer type                                   | Do we need city? AI agent can infer from country. | Remove city — simplify to 3 steps                                                               |
| **Onboarding** | Pioneer type, country, destinations, skills, headline, bio, phone             | Phone on step 5 feels invasive. Bio is friction.  | Move phone to profile settings. Make bio optional with AI-generated suggestion.                 |
| **Post-Path**  | Title, category, type, location, remote toggle, requirements, salary, payment | 5 steps is a lot. Category + type can merge.      | Reduce to 4 steps: Basics (title+category+type+location) → Requirements → Compensation → Review |
| **Booking**    | Date, guests, payment                                                         | Good — minimal.                                   | Keep as-is.                                                                                     |

### Pages: What's the actual purpose?

| Page               | Current State            | Question                               | Optimization                                                         |
| ------------------ | ------------------------ | -------------------------------------- | -------------------------------------------------------------------- |
| `/media`           | Shows media projects     | Is this a landing page or content hub? | Make it a showcase of Pioneer success stories (trust-building)       |
| `/fashion`         | Shows fashion paths      | Why a separate page from ventures?     | Merge into ventures with category filter. Remove as standalone page. |
| `/business`        | Shows company structure  | Who reads this?                        | Keep minimal — legal/compliance requirement                          |
| `/referral`        | Referral program details | Works well.                            | Add sharing integration (WhatsApp, Twitter)                          |
| `/forgot-password` | Password reset           | Standard.                              | Keep as-is                                                           |

### Data Model: What should be centralized?

| Data               | Current Location          | Issue                     | Fix                                         |
| ------------------ | ------------------------- | ------------------------- | ------------------------------------------- |
| Wizard step labels | Inline in page            | Different per wizard — OK | Keep inline                                 |
| Form validation    | None                      | No validation at all!     | Create `lib/validation.ts` with Zod schemas |
| Pioneer type data  | `lib/vocabulary.ts`       | Correct                   | ✅                                          |
| Country data       | `lib/country-selector.ts` | Correct                   | ✅                                          |
| Thread data        | `data/mock/threads.ts`    | New — correct location    | ✅                                          |
| Contact/legal      | `data/mock/config.ts`     | Correct                   | ✅                                          |

---

## AI Agent Integration Concept

The platform serves as **data capture** for an AI agent that automates operations:

```
┌─────────────────────────────────────────────────────┐
│                  PLATFORM (Frontend)                 │
│                                                      │
│  Wizards capture structured data:                    │
│  ├── Compass → Pioneer preferences + route match     │
│  ├── Onboarding → Pioneer identity + skills          │
│  ├── Post-Path → Anchor requirements                 │
│  └── Booking → Experience selection + payment         │
│                                                      │
│  This data feeds into:                               │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                  AI AGENT (Backend)                   │
│                                                      │
│  Agent reads structured form data and:               │
│  ├── Matches Pioneers to Paths (lib/matching.ts)     │
│  ├── Generates route recommendations                 │
│  ├── Automates Anchor digital operations:            │
│  │   ├── Post to social media                        │
│  │   ├── Send confirmation emails                    │
│  │   ├── Schedule bookings                           │
│  │   └── Distribute content                          │
│  ├── Sends notifications (push, email, WhatsApp)     │
│  └── Tracks UTAMADUNI impact                         │
└─────────────────────────────────────────────────────┘
```

**Key principle:** The frontend captures data in machine-readable structured format. The agent processes it. Anchors don't need to be digital-savvy — the form captures everything the agent needs.

---

## Component Decision Tree

When building new UI, follow this:

```
Is it a full-page section with gradient bg?
  → Use <HeroSection />

Is it a form input (text, email, select, textarea)?
  → Use className="input" (from globals.css)

Is it a primary action button?
  → Use className="btn-primary"

Is it a secondary/cancel button?
  → Use className="btn-secondary"

Is it a content container with border?
  → Use className="card"

Is it a status/category label?
  → Use className="badge"

Is it a multi-step wizard?
  → Use <WizardShell /> (when created)

Is it page-specific with unique logic?
  → Keep inline in the page file
```

---

_Last updated: Session 24 (2026-03-11)_
