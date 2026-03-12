---
name: becountry-cleanup
description: Boy Scout Rule — leave code cleaner than you found it. Run after every feature to refactor, deduplicate, and improve the whole codebase.
---

# Be[X] Cleanup & Refactoring

> Boy Scout Rule: Leave the codebase cleaner than you found it. Every feature ends with cleanup.

## When to Use

- **ALWAYS** after finishing a feature (before push)
- When code smells accumulate
- When the same pattern appears in 3+ places (DRY violation)
- When a file exceeds 300 lines (consider splitting)

## Cleanup Checklist

### 1. Dead Code

```bash
# Find unused exports
grep -r "export" lib/ --include="*.ts" | # check if each is imported somewhere
# Find unused imports in changed files
npx tsc --noEmit  # TS will catch unused imports in strict mode
```

- Remove unused functions, components, types
- Remove commented-out code (git has history)
- Remove TODO comments that are done

### 2. DRY — Don't Repeat Yourself

Look for:

- Same fetch pattern in multiple pages → extract to a hook
- Same form layout in login/signup/forgot-password → extract component
- Same error handling in API routes → extract middleware
- Same Tailwind class patterns → extract component or use `@apply`

### 3. YAGNI — You Aren't Gonna Need It

Remove:

- Features built but never used
- Over-abstracted interfaces with one implementation
- Config options nobody changes
- "Future-proofing" that adds complexity without value

### 4. File Organization

- Components over 200 lines → split into sub-components
- Lib modules over 500 lines → split by domain
- Test files should mirror source file structure
- One export per file when possible

### 5. Naming

- Functions: verb + noun (`fetchPaths`, `validateEmail`)
- Components: PascalCase noun (`PathCard`, `CompassWizard`)
- Files: kebab-case matching export (`path-card.tsx`)
- No abbreviations unless universally understood (DB, API, URL)

### 6. Type Safety

- No `any` types (use `unknown` + type guards)
- No non-null assertions (`!`) in production code (tests OK)
- All API responses typed
- Zod schemas for all API inputs

### 7. Performance

- No unnecessary re-renders (check useEffect deps)
- Images use `next/image` with proper sizing
- Heavy computations wrapped in `useMemo`
- Lists use proper keys (not array index)

## Automation Efficiency

### For Multiagent Processing

- Each skill is self-contained — can run independently
- Skills produce structured output (markdown tables, checklists)
- Output from one skill feeds into another (e.g., cleanup findings → implement fixes)
- All skills read from the same .MD source of truth

### For Reusability

- Skills use `becountry-*` prefix — work for any Be[X] deployment
- No hardcoded country/language — always use identity context
- Patterns documented in skills can be followed by any agent session
- Git history + .MD files = full context for any new session

## Output Format

```markdown
## 🧹 Cleanup Report

### Dead Code Removed

- [file]: removed unused [function/import/component]

### DRY Improvements

- Extracted [pattern] into [new file/hook]

### Simplifications

- [file]: simplified [what] from [lines before] → [lines after]

### Type Safety

- [file]: replaced `any` with [proper type]

### No Action Needed

- Codebase is clean ✅
```
