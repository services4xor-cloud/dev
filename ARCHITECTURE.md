# Be[Country] — Architecture Document
> The technical and conceptual blueprint of the platform.

---

## 1. The Core Idea

Be[Country] is built on a single architectural insight:

**The same human desire — to build a good life — takes different paths in different countries.**

Instead of building separate apps for Kenya, Germany, America, and Nigeria, we build one smart engine that speaks every country's language:

```
One Codebase
     ↓
Country Config (lib/countries.ts)
     ↓
Localized Experience
(currency, payment, language, sectors, routes)
```

This is how you scale from BeKenya to Be[Country] without rewriting code.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   BeNetwork Platform                  │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Compass   │  │  Matching   │  │   Social    │  │
│  │  (Routing)  │  │  (Scoring)  │  │ (Automation)│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Countries  │  │ Vocabulary  │  │   Email/WA  │  │
│  │  (Config)   │  │  (Language) │  │ (Comms)     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│              Country Layer (Be[Country])              │
│                                                       │
│  BeKenya         BeGermany       BeNigeria            │
│  M-Pesa/KES      SEPA/EUR        Flutterwave/NGN      │
│  Safari/Eco      Tech/Mfg        Tech/Trade           │
│  UTAMADUNI       Local partners  Lagos network        │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    Data Layer                         │
│              Prisma ORM + Neon PostgreSQL             │
└─────────────────────────────────────────────────────┘
```

---

## 3. Core Libraries

### lib/vocabulary.ts — The Language Engine
Every word in the platform is defined here. This prevents drift across sessions.

```typescript
export const VOCAB = {
  pioneer: 'Pioneer',      // Never: user, job seeker
  anchor: 'Anchor',        // Never: employer, company
  path: 'Path',            // Never: job, vacancy
  chapter: 'Chapter',      // Never: application
  venture: 'Venture',      // Never: tour, booking
  compass: 'Compass',      // Never: search, finder
}
```

**Why this matters**: In a multi-country platform with multiple Claude sessions, vocabulary drift kills product coherence. One source of truth prevents this.

### lib/countries.ts — The Country Registry
```typescript
export interface CountryConfig {
  code: string
  name: string
  currency: string
  currencySymbol: string
  payment: 'mpesa' | 'stripe' | 'flutterwave' | 'paypal'
  language: string[]
  sectors: string[]
  routes: string[]        // Partner countries
  color: string           // Brand color for this gate
  whatsappCode: string    // Country calling code
}
```

12 countries configured: KE, DE, GB, US, AE, NG, ZA, CA, AU, IN, FR, NL

### lib/compass.ts — Route Corridors
```typescript
// Predefined country-to-country routes
export const COUNTRY_ROUTES: Record<string, RouteInfo> = {
  'KE-DE': { demand: 'high', sectors: ['hospitality', 'agriculture'], visaType: 'work' },
  'KE-GB': { demand: 'high', sectors: ['healthcare', 'hospitality'], visaType: 'skilled' },
  'KE-AE': { demand: 'very-high', sectors: ['construction', 'domestic'], visaType: 'work' },
  // ...
}
```

### lib/matching.ts — The Scoring Engine
4-dimension scoring for Pioneer-Path matching:

```
Score = (skillMatch × 0.35) + (locationFit × 0.25) + (culturalFit × 0.20) + (intentAlign × 0.20)
```

Returns explainable scores with human-readable reasons. This is what makes the Compass intelligent.

### lib/safari-packages.ts — Kenya Experiences
Real packages with real pricing, real operators. Not generic data.

---

## 4. Data Model

```prisma
model User {
  id            String      @id
  role          Role        // PIONEER | ANCHOR | ADMIN
  profile       Profile?
  chapters      Chapter[]   // As Pioneer
  paths         Path[]      // As Anchor
  payments      Payment[]
}

model Path {                // What anchors post
  id            String      @id
  title         String
  country       String      // ISO code
  type          PathType    // WORK | VENTURE | TRADE
  anchor        User
  chapters      Chapter[]
  payment       Payment?
}

model Chapter {             // What pioneers submit
  id            String      @id
  pioneer       User
  path          Path
  status        ChapterStatus
}

model Payment {
  id            String      @id
  provider      String      // mpesa | stripe | flutterwave
  amount        Float
  currency      String
  utamaduniPct  Float       // % routed to community
}
```

---

## 5. API Architecture

All routes under `app/api/`:

```
/api/paths          GET (list + filter) | POST (create)
/api/paths/[id]     GET | PATCH | DELETE
/api/compass        POST → geo-detect + route matching
/api/search         GET → full-text + scored results
/api/onboarding     POST → Pioneer profile creation
/api/social         POST → queue social media posts
/api/mpesa/stkpush  POST → initiate M-Pesa payment
/api/mpesa/callback POST → Safaricom webhook (signature verified)
/api/auth/[...nextauth] → NextAuth handlers
/api/profile        GET | PATCH → Pioneer/Anchor profile
```

Every API route:
- Validates input with Zod schemas
- Returns typed JSON responses
- Handles errors with proper HTTP codes
- Logs to console (Vercel logs)

---

## 6. Payment Architecture

### Kenya: M-Pesa Daraja API v2
```
Pioneer/Anchor → STK Push request
                      ↓
           Safaricom sends push to phone
                      ↓
           User confirms on phone (PIN)
                      ↓
        Safaricom → /api/mpesa/callback
                      ↓
          Verify signature → activate Path/booking
```

### International: Stripe
```
Anchor → Stripe Checkout session
             ↓
     Card payment (saved or new)
             ↓
     Stripe → webhook → activate Path
```

### Impact Routing (UTAMADUNI)
Every payment: 5-10% routed to UTAMADUNI CBO
Tracked in `Payment.utamaduniPct` field
Shown in impact dashboard at /charity

---

## 7. Multi-Country Deployment Strategy

```
GitHub repo: services4xor-cloud/dev (one repo)
                    ↓
            Push to main branch
                    ↓
┌──────────────────────────────────────┐
│         Vercel Build Triggers        │
├──────────────┬───────────────────────┤
│  BeKenya     │  BeGermany (future)   │
│  COUNTRY=KE  │  COUNTRY=DE           │
│  bekenya.com │  begermany.com        │
└──────────────┴───────────────────────┘
```

Each Vercel project builds the same code with different env vars:
- `NEXT_PUBLIC_COUNTRY_CODE` → switches the active country config
- `NEXT_PUBLIC_APP_URL` → country-specific domain
- Country-specific payment keys

---

## 8. The Mission Architecture (Conceptual)

```
Colonial Economics (historic):
  Resources → Developing World → Developed World (one-way)

Be[Country] Architecture (reversal):
  Skills + Culture + Products → Any Country (multi-directional)

  Kenya Pioneer ←→ German Anchor (direct, fair, no middlemen)
  Kenyan Safari ←→ Dutch Explorer (direct booking, lodges paid)
  Kenyan Goods ←→ US Market (direct trade, no extraction)
```

The platform's "under the hood" work:
1. **Fair pricing**: Path listing prices are calibrated to local income levels
2. **Local payment**: M-Pesa means no Western payment gate required
3. **Community impact**: UTAMADUNI % creates local wealth circulation
4. **Language equity**: Swahili templates alongside English/German
5. **Route intelligence**: Matching prioritizes dignified work, not just any work

---

## 9. Agentic Development Patterns

### How Claude Sessions Work With This Codebase

1. **Session starts** → reads CLAUDE.md + PROGRESS.md
2. **Understands state** → knows exactly what's done and what's next
3. **Builds feature** → follows vocabulary, brand, architecture
4. **Updates PROGRESS.md** → leaves clear state for next session
5. **Commits + pushes** → Vercel deploys automatically
6. **No manual steps** between sessions

### File Ownership by Layer

| File | Layer | Stability |
|------|-------|-----------|
| lib/vocabulary.ts | Core | Never change terms |
| lib/countries.ts | Core | Add countries, don't rename fields |
| lib/compass.ts | Core | Add routes, don't change interface |
| lib/matching.ts | Core | Tune weights, keep 4-dimension model |
| app/page.tsx | BeKenya | Change freely |
| app/be/[country]/ | Platform | Add countries here |
| prisma/schema.prisma | Data | Migrate carefully |

---

## 10. Testing Strategy

```
Unit tests: lib/* functions (scoring, matching, formatting)
API tests: API routes with mocked DB
Integration tests: Booking flows end-to-end (future)
Visual tests: Playwright screenshots (future)
```

All tests in `__tests__/`. Run with `npm run test`.
CI enforces: lint → typecheck → test → build (in that order).
