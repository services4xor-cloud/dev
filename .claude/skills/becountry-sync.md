---
name: becountry-sync
description: Enforces bidirectional sync between code, documentation (.MD), and skills. Run after ANY change to code, docs, or skills to keep everything aligned.
---

# Be[X] Sync — Code ↔ Docs ↔ Skills

## RULE: Everything stays in sync. Always.

When code changes → docs and skills update.
When docs change → code and skills follow.
When skills change → code and docs align.

**This is not optional. This is how the ecosystem works.**

## When to Use

- **AUTOMATICALLY** after every code change
- **AUTOMATICALLY** after every doc edit
- **AUTOMATICALLY** after every skill edit
- Before every push (integrated into `becountry-push`)
- When running any review skill

## The Sync Map

Every file has dependencies. Change one, update the others.

### Code → Doc → Skill Relationships

```
prisma/schema.prisma
  ├── ARCHITECTURE.md        (data model section)
  ├── becountry-data.md      (schema reference)
  └── becountry-testing.md   (test data shapes)

app/api/**
  ├── ARCHITECTURE.md        (API routes section)
  ├── PROGRESS.md            (API route count)
  └── becountry-security.md  (endpoint list)

app/**/page.tsx
  ├── PROGRESS.md            (route list)
  ├── PRD.md                 (feature completeness)
  ├── becountry-e2e-test.md  (test scenarios)
  └── becountry-ux-workflow.md (flow steps)

lib/*.ts
  ├── ARCHITECTURE.md        (library modules section)
  ├── PROGRESS.md            (module count)
  └── becountry-architecture.md (dependency map)

components/**
  ├── DESIGN_SYSTEM.md       (component catalog)
  └── becountry-ui-review.md (component checklist)

data/mock/**
  ├── PROGRESS.md            (mock module count)
  └── becountry-data.md      (mock layer reference)

__tests__/** or tests/**
  ├── TESTING.md             (test strategy + counts)
  ├── PROGRESS.md            (test counts)
  └── becountry-testing.md   (test coverage map)

lib/countries.ts or lib/country-selector.ts
  ├── ARCHITECTURE.md        (country architecture)
  ├── becountry-country-deploy.md (deployment configs)
  └── CLAUDE.md              (country architecture section)

.claude/skills/*.md
  ├── becountry-process.md   (master skill map)
  └── PROGRESS.md            (skill count + categories)

package.json
  ├── CLAUDE.md              (tech stack section)
  └── ARCHITECTURE.md        (dependencies)
```

## Sync Check Process

### Step 1: Detect What Changed

```bash
# Get all changed files since last commit
git diff --name-only HEAD
git diff --name-only --cached
git status --short
```

### Step 2: Identify Affected Docs

For each changed file, look up the sync map above and note which docs/skills need updating.

### Step 3: Check Each Affected Doc

For each affected document:

1. **Read the current doc**
2. **Compare against code reality:**
   - Route counts match actual `app/` pages?
   - API route counts match actual `app/api/` routes?
   - Test counts match actual test results?
   - Module counts match actual `lib/` files?
   - Schema description matches `prisma/schema.prisma`?
   - Skill references match actual `.claude/skills/` files?
3. **Update if stale** — fix numbers, add new entries, remove deleted ones

### Step 4: Check Reverse Direction

If a `.md` file changed:

1. Does the code implement what the doc describes?
2. Are there new requirements in PRD.md not yet in code?
3. Are there new architecture decisions in ARCHITECTURE.md not yet reflected?
4. Are skill process steps actually possible with current code?

### Step 5: Report

```markdown
## 🔄 Sync Report

### Changes Detected

- [list of changed files]

### Docs Updated

- ✅ PROGRESS.md — updated route count (17 → 18)
- ✅ ARCHITECTURE.md — added new API endpoint
- ⚠️ PRD.md — new feature not yet documented
- ✅ No skill updates needed

### Sync Status

- Code ↔ Docs: ✅ Synced
- Code ↔ Skills: ✅ Synced
- Docs ↔ Skills: ✅ Synced
```

## Critical Sync Points

### Numbers That Must Match Reality

| Metric             | Source of Truth                       | Docs That Reference It             |
| ------------------ | ------------------------------------- | ---------------------------------- |
| Route count        | `ls app/**/page.tsx`                  | PROGRESS.md, CLAUDE.md             |
| API route count    | `ls app/api/**/route.ts`              | PROGRESS.md, ARCHITECTURE.md       |
| Test count         | `npm test` output                     | PROGRESS.md, TESTING.md            |
| Playwright count   | `npx playwright test` output          | PROGRESS.md, TESTING.md            |
| Lib module count   | `ls lib/*.ts`                         | PROGRESS.md, CLAUDE.md             |
| Mock module count  | `ls data/mock/*.ts`                   | PROGRESS.md                        |
| Skill count        | `ls .claude/skills/becountry-*.md`    | PROGRESS.md, becountry-process.md  |
| Country count      | `COUNTRY_OPTIONS.length`              | PROGRESS.md, CLAUDE.md             |
| Prisma model count | `grep "^model " prisma/schema.prisma` | ARCHITECTURE.md, becountry-data.md |
| TS error count     | `npx tsc --noEmit`                    | PROGRESS.md                        |

### Content That Must Match

| Code                          | Doc                           |
| ----------------------------- | ----------------------------- |
| `lib/vocabulary.ts` exports   | CLAUDE.md vocabulary table    |
| `lib/nav-structure.ts` links  | Actual nav/footer rendered    |
| `tailwind.config.ts` tokens   | DESIGN_SYSTEM.md color tokens |
| `prisma/schema.prisma` models | ARCHITECTURE.md data model    |
| Actual page routes            | CLAUDE.md repo map            |
| `lib/countries.ts` configs    | becountry-country-deploy.md   |

## Integration

This skill is called by:

- `becountry-push` — before every push
- `becountry-status` — during status checks
- Any review skill — to ensure docs match reality

## Auto-Sync Triggers

When the agent detects ANY of these, run sync immediately:

- New file created in `app/`, `lib/`, `components/`, `app/api/`
- File deleted from any tracked directory
- `prisma/schema.prisma` modified
- Any `.md` doc in root modified
- Any skill in `.claude/skills/` modified
- Test count changes (new tests added/removed)
- Package.json dependencies changed
