# Be[Country] Platform — Requirements & Agent Context
> Living document. Updated every session.
> Read this alongside CLAUDE.md + PRD.md + PROGRESS.md

---

## 1. Core User Requirements (from conversation history)

### R1 — Country Selection as First Action
**Source**: User session 5 — "first thing user does is selecting his countries in an order"

**Requirement**: The very first interaction a Pioneer has is selecting destination countries in **priority order**. First choice = highest match score. Allow up to 5 selections.

**Implementation**: `components/CountryPrioritySelector.tsx`
- Used in: `app/compass/page.tsx` (Step 1), `app/onboarding/page.tsx` (Step 3)
- Data source: `lib/country-selector.ts` (single source of truth)

### R2 — Proximity Clustering (Nearby Countries)
**Source**: User session 5 — "he can somehow mark very close places with intelligent design"

**Requirement**: Countries geographically close to the Pioneer's origin (< 1800km, Haversine) should be visually distinguished with:
- Green pulse animation (nearby indicator)
- Glow effect on card border
- "Nearby" badge on cluster header

**Implementation**: `lib/country-selector.ts` → `distanceKm()` + `NEARBY_KM` + `isNearby()`
- `getGroupedCountries(originCode)` returns countries grouped by region with `isNearby` flag
- Component: `components/CountryPrioritySelector.tsx` — applies glow + pulse for nearby

### R3 — No Duplicate Country Data
**Source**: Code audit — found 3 separate hardcoded country lists

**Requirement**: ONE canonical source of country data. All pages MUST import from `lib/country-selector.ts`.

**Eliminated duplicates**:
- ~~`DESTINATIONS` in `app/compass/page.tsx`~~ → removed
- ~~`DESTINATIONS` in `app/onboarding/page.tsx`~~ → removed
- ~~`COUNTRY_LIST` in `app/onboarding/page.tsx`~~ → removed

### R4 — Responsive: Watch → TV (All Formats)
**Source**: User session 4 — "For all formats! from watch to TV!"

**Implementation**:
- `tailwind.config.ts` — custom screens: `xs: 380px`, `3xl: 1920px`, `4xl: 2560px`
- `app/globals.css` — fluid typography with `clamp()`, TV media queries
- Components use `3xl:max-w-[1600px]` for ultra-wide

### R5 — Golden Ratio Design System (φ = 1.618)
**Source**: User session 4 — "There is the golden ratio, use it to make things harmonic"

**Implementation**: `tailwind.config.ts`
- `spacing.phi-N`: 4→6→10→16→26→42→68→110→178px
- `fontSize.phi-*`: 0.618rem → 6.854rem
- `borderRadius.phi-*`: 6→42px
- `lineHeight.phi`: 1.618
- Apply progressively: `rounded-phi-lg`, `gap-phi-4`, etc.

### R6 — Brand Consistency (No Old Orange)
**Source**: Brand guidelines — maroon #5C0A14 + gold #C9A227

**Requirement**: Remove all `#FF6B35` and `orange-*` Tailwind classes. Replace with:
- Primary: `#5C0A14` (maroon)
- Accent: `#C9A227` (gold)
- Dark background: `#0A0A0F`

**Status**: Fixed in compass, onboarding, about. Still remaining in: `app/ventures/page.tsx`, `app/jobs/`, `app/be/[country]/`, `app/business/`, `app/charity/`, components/JobCard.tsx, and others. (See R14)

### R7 — BeNetwork Vocabulary Everywhere
**Source**: CLAUDE.md section 4

**Requirement**: NEVER use old terms. Always use:
| Old | New |
|-----|-----|
| user, job seeker | Pioneer |
| employer, company | Anchor |
| job, vacancy | Path |
| application | Chapter |
| tour, booking | Venture |
| search, filter | Compass |

**Source file**: `lib/vocabulary.ts` — import `VOCAB`, `PIONEER_TYPES` from here.

### R8 — No Duplicate Navs / Footers
**Source**: UX audit (session 4) — pages had hardcoded navs inside

**Rule**: `app/layout.tsx` provides global `<Nav />` + `<Footer />` for ALL pages.
Pages MUST NOT include their own nav/footer.

**Exception**: Contextual app-shell headers (dashboard user avatar, stepper nav in post-path wizard) are preserved — they are NOT navs, they are page-level UI. Must use `sticky top-16 z-40` (stacks below global nav at z-50).

### R9 — Security: Next.js Patched
**Source**: npm audit (session 4)

**Status**: Next.js upgraded 14.2.5 → 14.2.35 (patches CVE-2024-46982, CVE-2024-56332, CVE-2024-34351, CVE-2024-46798).

### R10 — Preserve Functionality Before Removal
**Source**: User session 4 — "before removing stuff ensure the functionality is overtaken or was replaced by modern approach"

**Rule**: Before removing any UI element, verify:
1. Is it a redundant duplicate? (safe to remove)
2. Is it a unique UX feature? (preserve or migrate)
3. Document the decision in a comment or this file.

### R11 — Functionality Not Lost: Audit
| Feature | Status | Notes |
|---------|--------|-------|
| Stepper nav (post-path, post-job) | ✅ Preserved | Fixed z-index stacking only |
| Dashboard app-shell header | ✅ Preserved | Fixed z-index stacking only |
| Admin header + back-to-site | ✅ Preserved | Fixed z-index stacking only |
| Old brand navs (logo + Jobs links) | ✅ Removed | Global Nav covers all links |
| Old `© Bekenya` footers | ✅ Removed | Global Footer covers this |

---

## 2. Architecture Rules (Enforced)

### Data Layer
- **Country data** → `lib/country-selector.ts` only (geographic, proximity, corridor)
- **Country config** (payment, sectors, locale) → `lib/countries.ts`
- **Pioneer types + vocabulary** → `lib/vocabulary.ts`
- **Route corridors** → `lib/compass.ts`
- **M-Pesa** → `lib/mpesa.ts`
- **Email** → `lib/email.ts`
- **Safari packages** → `lib/safari-packages.ts`

### Component Data Flow
```
lib/country-selector.ts
    ↓
components/CountryPrioritySelector.tsx
    ↓ used by
app/compass/page.tsx (Step 1)
app/onboarding/page.tsx (Step 3 destination selection)
```

### Navigation Architecture
```
app/layout.tsx
├── <Nav />          ← sticky top-0 z-50 (global, always present)
├── {children}       ← all page content here
└── <Footer />       ← always present
```
Secondary sticky elements use `sticky top-16 z-40`.

### Responsive Breakpoints
```
xs    380px   ← small phones
sm    640px   ← standard Tailwind
md    768px   ← tablet
lg    1024px  ← laptop
xl    1280px  ← desktop
2xl   1536px  ← large desktop
3xl   1920px  ← TV / 1080p
4xl   2560px  ← 4K
```

---

## 3. Immediate Next Steps (Priority Order)

### Phase 2 — Live (Requires Human Credentials)
1. **DATABASE_URL** (Neon PostgreSQL) → enables real Prisma queries
2. **MPESA_CONSUMER_KEY + SECRET** → enables real M-Pesa payments
3. **GOOGLE_CLIENT_ID + SECRET** → enables real OAuth login
4. **RESEND_API_KEY** → enables real email sending

*See HUMAN_MANUAL.md for setup steps*

### Phase 2 — Can Build Now
1. ✅ Country priority selector (done — `components/CountryPrioritySelector.tsx`)
2. ✅ About page brand rewrite (done)
3. ✅ Remove DESTINATIONS duplicates (done)
4. Sweep remaining orange colors → maroon (ventures, jobs, be/[country], business, charity)
5. Kenya Offerings pages (`/offerings/safaris`, `/offerings/eco-tourism`, `/offerings/trade`)
6. End-to-end M-Pesa booking flow (mock for now)
7. Apply φ tokens progressively in Nav, Footer, cards

---

## 4. Duplicate / Multi-Implementation Inventory

### Resolved
| What | Where found | Resolution |
|------|-------------|------------|
| `DESTINATIONS[]` | compass/page.tsx + onboarding/page.tsx | Removed — use `COUNTRY_OPTIONS` from `lib/country-selector.ts` |
| `COUNTRY_LIST[]` | onboarding/page.tsx | Removed — use `COUNTRY_OPTIONS` |
| `STRENGTH_COLORS` | onboarding/page.tsx | Removed — use `CORRIDOR_BADGE` from `lib/country-selector.ts` |
| Hardcoded `<nav>` | page.tsx (homepage) | Removed — global Nav provides this |
| Hardcoded `<footer>` | page.tsx, about/page.tsx | Removed — global Footer provides this |

### Known Remaining (to address)
| What | Where | Priority |
|------|-------|----------|
| Orange `#FF6B35` brand color | ventures, jobs, be/[country], business, charity, JobCard.tsx | Medium |
| `app/jobs/` vs BeNetwork "Paths" vocab | Full rename scope needed | Medium |
| `app/post-job/` vs `app/anchors/post-path/` | Both exist — audit needed | Low |
| `app/dashboard/` vs `app/pioneers/dashboard/` | Potential duplicate | Low |
| `app/employers/dashboard/` vs `app/anchors/dashboard/` | Potential duplicate | Low |

---

## 5. Agent Context Links

| Context File | Purpose |
|--------------|---------|
| `CLAUDE.md` | Operating rules, tech stack, commands |
| `PRD.md` | What to build and why (v4.0) |
| `ARCHITECTURE.md` | System architecture |
| `PROGRESS.md` | Live execution tracker — **UPDATE after every feature** |
| `REQUIREMENTS.md` | This file — user requirements, data rules, duplicates inventory |
| `STEPS.md` | Maps conversation prompts → build outputs |
| `HUMAN_MANUAL.md` | Steps only humans can do (credentials, DNS) |
| `WAR_PLAN.md` | Strategic roadmap |

---

## 6. Session Notes

### Session 5 (2026-03-10)
- Built `lib/country-selector.ts` — geographic source of truth with Haversine proximity
- Built `components/CountryPrioritySelector.tsx` — elegant ordered multi-select
- Rewrote `app/compass/page.tsx` — uses new selector, fixed brand, removed DESTINATIONS
- Fixed `app/onboarding/page.tsx` — removed duplicate data, fixed brand colors
- Rewrote `app/about/page.tsx` — dark theme, BeNetwork vocabulary, golden ratio layout
- TypeScript: 0 errors ✅

### Session 4 (2026-03-09)
- Next.js 14.2.35 security patch
- Full responsive system (xs → 4K)
- Golden ratio φ tokens in tailwind.config.ts
- PRD v4.0 comprehensive rewrite
- STEPS.md created
- Fixed all duplicate nav/footer stacking issues
- About page brand audit

---

*Last updated: 2026-03-10 Session 5*
