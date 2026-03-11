# Be[Country] — Agent Operations

> How the agent reads, decides, and acts. Debug agent behavior here.

---

## Session Boot

```
1. CLAUDE.md     → mission, rules, vocabulary
2. PROGRESS.md   → current state, blockers
3. PRD.md        → requirements (if building)
4. DESIGN_SYSTEM.md → brand rules (if UI)
5. ARCHITECTURE.md  → structure (if lib/API)
6. HUMAN_MANUAL.md  → credentials (if blocked)
```

---

## Before Writing Code

1. Read the target file
2. Check related lib/ files
3. Check DESIGN_SYSTEM.md (if UI)
4. Check components/ for existing components
5. Check data/mock/ for existing data

**Never:** Create component without checking components/. Inline data from lib/ or mock/. Use colors without checking forbidden list.

---

## Decision Tree

```
"build X" → Does it exist? READ first. Does a lib exist? COMPOSE. Component exists? REUSE.
"fix X"   → grep ALL occurrences. Fix ALL. Update docs.
"improve"  → Audit docs → code → UI → fix data→logic→UI→docs order.
```

---

## Single Source of Truth

| Data              | Source                        |
| ----------------- | ----------------------------- |
| Country list      | `lib/countries.ts`            |
| Country geography | `lib/country-selector.ts`     |
| Vocabulary        | `lib/vocabulary.ts`           |
| Brand colors      | `DESIGN_SYSTEM.md` + Tailwind |
| Nav links         | `lib/nav-structure.ts`        |
| Mock data         | `data/mock/*.ts`              |

---

## Verification (after every change)

```
□ npx tsc --noEmit       → 0 errors
□ npx jest               → all pass
□ npx playwright test    → all pass (if UI)
□ grep forbidden colors  → zero violations
□ update PROGRESS.md     → session log
```

---

## Past Mistakes (prevent these)

| Mistake                   | Prevention                          |
| ------------------------- | ----------------------------------- |
| Kenya-hardcoded pages     | Check country architecture first    |
| Leftover color violations | grep AFTER claiming "done"          |
| Wrong test counts in docs | Search ALL .md files for the number |
| Duplicate components      | Read components/ before creating    |
| Inlined data              | Check File Authority Map above      |
| Stale session numbers     | Always update file header timestamp |

---

## Owner Expectations

- Quality over speed
- One source of truth per data type
- Clean up after yourself
- International scale (not just Kenya)
- Dark theme everywhere
- Use the docs
- KISS
- Questions → ASK.md (don't interrupt)

---

_Last updated: Session 20 (2026-03-11)_
