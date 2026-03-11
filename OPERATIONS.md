# Agent Operations Runbook

> How the AI agent reads, decides, and acts. Read this to debug agent behavior.

---

## 1. Session Boot Sequence (every conversation)

```
Step 1 → CLAUDE.md         # Mission, rules, vocabulary, stack, forbidden patterns
Step 2 → PROGRESS.md       # Current state, what's done, what's next, blockers
Step 3 → (if building)     # PRD.md for requirements, DESIGN_SYSTEM.md for UI
Step 4 → (if refactoring)  # ARCHITECTURE.md for structure, REQUIREMENTS.md for rules
Step 5 → (if blocked)      # HUMAN_MANUAL.md for env vars / credentials needed
```

**If the agent skips Step 2, it will rebuild things already done or miss context.**

---

## 2. Before Writing Any Code

```
READ ORDER:
1. Target file          → understand what exists before changing it
2. Related lib/ files   → check for shared types, exports, data sources
3. DESIGN_SYSTEM.md     → if touching UI (colors, spacing, components)
4. Related test files   → know what tests cover this area
5. components/          → check for existing reusable components before creating new ones

NEVER DO:
- Write a new component without checking components/ first
- Inline data that exists in lib/ or data/mock/
- Use colors without checking DESIGN_SYSTEM.md forbidden list
- Create a page without adding it to nav-structure.ts and test arrays
```

---

## 3. Decision Tree: What to Do When

```
User says "build X"
  ├─ Does X exist partially? → READ it first, extend it
  ├─ Does a lib/ engine exist? → COMPOSE from it, don't duplicate
  ├─ Is there a component for this? → REUSE it, don't create new
  └─ None of the above → CREATE, but add to nav + tests + docs

User says "fix X"
  ├─ grep for all occurrences → fix ALL, not just the first one
  ├─ check if docs claim it's fixed → update docs too
  └─ verify with TypeScript + tests after fix

User says "improve quality"
  ├─ Audit docs for contradictions/staleness
  ├─ Audit code for dead exports, typos, violations
  ├─ Audit UI for consistency with DESIGN_SYSTEM.md
  └─ Fix in order: data layer → logic → UI → docs
```

---

## 4. File Authority Map (single source of truth)

| Data              | Canonical Source                       | Never Duplicate In                        |
| ----------------- | -------------------------------------- | ----------------------------------------- |
| Country list      | `lib/countries.ts` (12 deployed)       | signup forms, inline arrays               |
| Country geography | `lib/country-selector.ts` (16 records) | page components                           |
| Vocabulary        | `lib/vocabulary.ts`                    | any hardcoded Pioneer/Anchor/Path strings |
| Brand colors      | `DESIGN_SYSTEM.md` + Tailwind config   | inline hex outside approved tokens        |
| Nav links         | `lib/nav-structure.ts`                 | hardcoded navs in components              |
| Safari packages   | `lib/safari-packages.ts`               | page-level arrays                         |
| Route corridors   | `lib/compass.ts`                       | page-level route data                     |
| Test page lists   | `playwright.config.ts` PAGES array     | hardcoded in test files                   |
| Mock data         | `data/mock/*.ts` via barrel export     | inline in page components                 |

---

## 5. Verification Checklist (after every change)

```
□ TypeScript:    npx tsc --noEmit         → 0 errors
□ Jest:          npx jest                  → all pass
□ Playwright:    npx playwright test       → all pass (if UI changed)
□ Preview:       preview_start + screenshot → visual check
□ Brand:         grep for forbidden colors  → zero amber/yellow/orange/#FF6B35
□ Docs:          update PROGRESS.md        → session log + counts
```

---

## 6. Common Mistakes This Agent Has Made

| Mistake                       | Root Cause                                | Prevention                                        |
| ----------------------------- | ----------------------------------------- | ------------------------------------------------- |
| Built Kenya-hardcoded pages   | Didn't read ARCHITECTURE.md first         | Always check country architecture before building |
| Left amber/yellow violations  | Claimed done without verifying            | Always grep after "cleanup" claims                |
| Wrong test counts in docs     | Updated one file, not all                 | Search all .md files for the number being changed |
| Created duplicate components  | Didn't check components/ first            | Read components/ directory before creating        |
| Inlined country data in pages | Didn't know about lib/country-selector.ts | Check File Authority Map above                    |
| Stale session numbers         | Updated content but not header            | Always update file header timestamp               |

---

## 7. What the Owner Expects

- **Quality over speed** — read before writing, verify after writing
- **No redundancy** — one source of truth per data type
- **Clean up after yourself** — delete dead code, update docs, remove stale references
- **International scale** — everything must work for all countries, not just Kenya
- **Dark theme everywhere** — `#0A0A0F` background, `#111118` cards, maroon + gold accents
- **Use the docs** — CLAUDE.md, DESIGN_SYSTEM.md, ARCHITECTURE.md exist for a reason

---

_Last updated: Session 17 (2026-03-11)_
