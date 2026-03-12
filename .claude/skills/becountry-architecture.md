---
name: becountry-architecture
description: Architecture review for Be[Country] — data flow, single sources of truth, layer boundaries, multi-country readiness, scale assessment.
---

# Be[Country] Architecture Review

## When to Use

Run before refactoring, after adding new lib/ files, or when reviewing system design decisions.

## Architecture Layers

```
┌─ PRESENTATION ─────────────────────────────────────┐
│ app/**/page.tsx → React Server/Client Components    │
│ components/** → Shared UI (GlassCard, SectionLayout)│
└────────────────────────┬───────────────────────────┘
                         │
┌─ IDENTITY ─────────────┴───────────────────────────┐
│ lib/identity-context.tsx → useIdentity() hook       │
│ lib/country-selector.ts → 16 countries, proximity   │
│ lib/countries.ts → deployment configs per country   │
└────────────────────────┬───────────────────────────┘
                         │
┌─ BUSINESS LOGIC ───────┴───────────────────────────┐
│ lib/dimension-scoring.ts → 8-dimension engine       │
│ lib/agents.ts → ~700 AI personas (deterministic)    │
│ lib/market-data.ts → 30+ market signals             │
│ lib/compass.ts → Route corridors                    │
└────────────────────────┬───────────────────────────┘
                         │
┌─ DATA ─────────────────┴───────────────────────────┐
│ services/** → DB-first + mock fallback              │
│ data/mock/** → 15 mock modules                      │
│ prisma/schema.prisma → 16 models                    │
│ lib/db.ts → Prisma singleton                        │
└─────────────────────────────────────────────────────┘
```

## Review Checklist

### 1. Single Source of Truth Audit

Each data domain MUST have exactly ONE source file:

| Domain            | Source File                | Violation Check                         |
| ----------------- | -------------------------- | --------------------------------------- |
| Countries         | `lib/country-selector.ts`  | Grep for hardcoded country arrays       |
| Deployment config | `lib/countries.ts`         | Grep for hardcoded currency/payment     |
| Vocabulary        | `lib/vocabulary.ts`        | Grep for "user", "job", "employer"      |
| Nav links         | `lib/nav-structure.ts`     | Grep for hardcoded hrefs in Nav/Footer  |
| Brand colors      | `globals.css` :root        | Grep for `#FF6B35`, `orange-`, `amber-` |
| Agents            | `lib/agents.ts`            | Grep for hardcoded agent arrays         |
| Scoring           | `lib/dimension-scoring.ts` | Grep for scoring logic elsewhere        |

### 2. Layer Boundary Check

- Pages MUST NOT import from `prisma/` directly (use services/)
- Client components MUST NOT call Prisma (server-only)
- `lib/` files MUST NOT import from `app/` or `components/`
- `data/mock/` MUST NOT import from `services/`
- `types/` MUST NOT import from `lib/` (pure type definitions)

### 3. Multi-Country Architecture (Be[X])

- `NEXT_PUBLIC_COUNTRY_CODE` drives all country-specific behavior
- `getCountryConfig()` returns payment, currency, sectors, brand for any country
- `useIdentity()` provides `brandName` (BeKenya, BeDeutschland, etc.)
- Agents generated per country via `generateAllAgents()` with deterministic seeding
- Language system: 14 languages in `LANGUAGE_REGISTRY`, endonyms for localized names
- Thread system ready for Be[Tribe] and Be[Location] expansion

### 4. Scale Assessment

- How many pages? (target: 20+)
- How many API routes? (target: 12+)
- How many mock modules? (target: 15)
- How many test files? (target: 44 suites)
- DB model count vs schema.prisma model count
- Are all services using DB-first + mock fallback pattern?

### 5. Dependency Health

- Run `npm audit` for vulnerabilities
- Check for unused dependencies: `npx depcheck`
- Verify Prisma version alignment (client + CLI)
- Check Next.js version for security patches

## Output Format

```
## 🏗️ Architecture Review — Be[Country]

### Layer Integrity: ✅/⚠️/❌
### Single Source of Truth: ✅/⚠️/❌
### Multi-Country Ready: ✅/⚠️/❌
### Scale Assessment: X pages, Y routes, Z models
### Dependency Health: ✅/⚠️/❌

### Violations Found
1. [file:line — what's wrong — how to fix]

### Architecture Score: X/10
### Recommendations:
1. [actionable improvement]
```
