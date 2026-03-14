---
name: becountry-testing
description: Testing strategy and execution for Be[Country] — Jest unit tests, Playwright E2E, coverage gaps, multi-country test scenarios.
---

# Be[Country] Testing

## When to Use

Run after implementing features, before pushing, or when asked about test coverage.

## Test Infrastructure

| Layer            | Tool       | Count (see PROGRESS.md) | Config                 |
| ---------------- | ---------- | ----------------------- | ---------------------- |
| Unit/Integration | Jest       | 872 tests, 46 suites    | `jest.config.ts`       |
| E2E/Visual       | Playwright | 159 tests, 7 files      | `playwright.config.ts` |

## Testing Process

### 1. Run Existing Tests

```bash
# Unit tests (fast)
npm test

# With coverage
npm run test:coverage

# Playwright (requires dev server)
npx playwright test

# TypeScript check
npx tsc --noEmit
```

### 2. Coverage Gap Analysis

Read `TESTING.md` for strategy, then:

- Check which `lib/` files have test coverage: `ls __tests__/lib/`
- Check which `app/api/` routes have tests
- Check which components have tests
- Identify critical paths without tests:
  - Auth flow (register → login → session)
  - Scoring engine (dimension-scoring.ts)
  - Agent generation (agents.ts)
  - Password reset flow (forgot → token → reset)
  - Country switching (identity-context.tsx)

### 3. Multi-Country Test Scenarios

Each feature should work for ANY Be[Country]:

| Scenario         | Test                                                              |
| ---------------- | ----------------------------------------------------------------- |
| KE deployment    | `NEXT_PUBLIC_COUNTRY_CODE=KE` → M-Pesa, KES, BeKenya brand        |
| DE deployment    | `NEXT_PUBLIC_COUNTRY_CODE=DE` → SEPA, EUR, BeDeutschland brand    |
| NG deployment    | `NEXT_PUBLIC_COUNTRY_CODE=NG` → Flutterwave, NGN, BeNigeria brand |
| Unknown code     | Fallback to KE gracefully                                         |
| Language switch  | All 14 languages render without crashes                           |
| Agent generation | Every country produces valid agents                               |
| Scoring          | Same algorithm, different market signals per country              |

### 4. Write Missing Tests

For any feature without tests, follow TDD:

1. Write the failing test first
2. Verify it fails
3. Run existing tests to confirm no regressions
4. Add to appropriate `__tests__/` directory

### 5. Test Quality Check

- No `test.skip` or `test.todo` left behind
- No `any` type assertions in tests
- Mock data matches real data shape
- Tests are deterministic (no Date.now() or Math.random() without seeds)
- Error cases tested (not just happy path)

## Output Format

```
## 🧪 Testing Report — Be[Country]

### Test Results
| Suite | Pass | Fail | Skip |
|-------|------|------|------|
| Jest | X/Y | | |
| Playwright | X/Y | | |
| TypeScript | ✅/❌ | | |

### Coverage Gaps
1. [file — what's untested — risk level]

### Multi-Country Coverage
| Country | Tested | Issues |
|---------|--------|--------|

### Testing Score: X/10
### Priority Tests to Add:
1. [test description — why it matters]
```
