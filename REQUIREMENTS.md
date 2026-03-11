# Be[Country] — Requirements & Decisions

> User requirements + architecture rules.
> ← [CLAUDE.md](./CLAUDE.md) | [PRD.md](./PRD.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

## Requirements

| ID  | Requirement                                                        | Status | Source       |
| --- | ------------------------------------------------------------------ | ------ | ------------ |
| R1  | Country selection as first action (priority order, up to 5)        | ✅     | Session 5    |
| R2  | Proximity clustering (< 1800km, Haversine, green pulse)            | ✅     | Session 5    |
| R3  | No duplicate country data (single source: lib/country-selector.ts) | ✅     | Session 5    |
| R4  | Responsive watch → TV (xs:380 to 4xl:2560)                         | ✅     | Session 4    |
| R5  | Golden ratio design system (φ = 1.618 spacing + typography)        | ✅     | Session 4    |
| R6  | Brand consistency (no orange/amber/yellow)                         | ✅     | Session 6–16 |
| R7  | BeNetwork vocabulary everywhere (UI + API + Prisma)                | ✅     | Session 14   |
| R8  | No duplicate navs/footers (layout.tsx provides)                    | ✅     | Session 4    |
| R9  | Next.js patched (14.2.35, CVEs fixed)                              | ✅     | Session 4    |
| R10 | Preserve functionality before removal                              | ✅     | Session 4    |
| R11 | Dark theme all pages (bg-[#0A0A0F])                                | ✅     | Session 9    |
| R12 | Legacy route redirects (/jobs→/ventures, etc.)                     | ✅     | Session 6    |
| R13 | Centralized mock data (data/mock/, zero inline)                    | ✅     | Session 10   |
| R14 | Centralized nav/footer links (lib/nav-structure.ts)                | ✅     | Session 13   |
| R15 | International scale (no Kenya-hardcoded pages, country-aware)      | ✅     | Session 16   |
| R16 | Smart recommendations (purpose + market + corridor)                | ✅     | Session 16   |
| R17 | Be[Country/Tribe/Location] architecture (support all 3 levels)     | 🔄     | Session 20   |
| R18 | All non-generic visible data in mock (no hardcoded display data)   | 🔄     | Session 20   |
| R19 | Design from DESIGN_SYSTEM.md (no ad-hoc styling)                   | ✅     | Session 20   |
| R20 | KISS code (no over-engineering)                                    | ✅     | Session 20   |

---

## Architecture Rules

### Single Source of Truth

| Data                  | Source                    | Never                   |
| --------------------- | ------------------------- | ----------------------- |
| Country geography     | `lib/country-selector.ts` | Inline in pages         |
| Country config        | `lib/countries.ts`        | Inline in pages         |
| Vocabulary            | `lib/vocabulary.ts`       | Hardcode strings        |
| Route corridors       | `lib/compass.ts`          | Inline in pages         |
| Nav/Footer links      | `lib/nav-structure.ts`    | Inline in components    |
| Mock data             | `data/mock/`              | Inline in pages         |
| Domain types          | `types/domain.ts`         | Ad-hoc type definitions |
| API contracts         | `types/api.ts`            | Ad-hoc request types    |
| Brand colors/patterns | `DESIGN_SYSTEM.md`        | Ad-hoc styling          |

### Navigation

```
app/layout.tsx → <Nav /> (sticky z-50) + {children} + <Footer />
Secondary sticky: top-16 z-40
```

---

## Blocked Items

See [HUMAN_MANUAL.md](./HUMAN_MANUAL.md) for credentials needed.

---

_Last updated: Session 20 (2026-03-11)_
