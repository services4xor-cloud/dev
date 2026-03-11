# BeNetwork — Testing Strategy

> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [ARCHITECTURE.md](./ARCHITECTURE.md)
> Two test layers: Jest unit tests (CI enforced) + Playwright visual tests (design quality gate).
> **Status: All tests passing (25 Jest + 100 Playwright)**

---

## Test Layers

```
Layer 1: Jest unit tests      → lib/* logic, API schema, scoring engine (25/25 ✅)
Layer 2: Playwright visual    → every page renders, brand is correct, responsive (100/100 ✅)
```

---

## Layer 1: Jest Unit Tests

### Run

```bash
npm run test            # all tests (25/25)
npm run test:coverage   # coverage report
npx jest --testPathPattern="matching"  # single file
```

### Test files (8 total)

```
__tests__/api/mpesa.test.ts             — M-Pesa phone number formatting
__tests__/api/paths.test.ts             — Path schema validation (createPathSchema)
__tests__/lib/vocabulary.test.ts        — BeNetwork term constants
__tests__/lib/matching.test.ts          — 4-dimension scoring engine
__tests__/lib/safari-packages.test.ts   — Package data shape
__tests__/lib/compass.test.ts           — Route corridor logic
__tests__/lib/whatsapp-templates.test.ts — Template rendering
__tests__/lib/social-media.test.ts      — Social platform config
```

### Adding a new test

```typescript
// __tests__/lib/example.test.ts
import { myFunction } from '@/lib/my-module'

describe('myFunction', () => {
  it('should do the expected thing', () => {
    expect(myFunction('input')).toBe('expected output')
  })
})
```

---

## Layer 2: Playwright Visual Tests

### Run

```bash
npx playwright test                        # all visual tests (100/100)
npx playwright test tests/visual/smoke     # smoke only (16/16)
npx playwright test tests/visual/brand     # brand only (30/30)
npx playwright test tests/visual/responsive # responsive only (54/54)
npx playwright test --headed               # watch mode
npx playwright show-report                 # view HTML report
```

### Test files

#### `tests/visual/smoke.spec.ts` — All pages load, no console errors (16/16 ✅)

Checks every route returns HTTP 200 and has no red console errors.
Viewports: desktop (1280x800) only — fast CI gate.

#### `tests/visual/brand.spec.ts` — Design system compliance (30/30 ✅)

- No `#FF6B35` hex visible in DOM or computed styles
- No `orange-` Tailwind classes rendered
- At least one `#C9A227` (gold) element visible per page
- Background is dark (`#0A0A0F` or `#111118` range)
- All buttons have dark theme (no `bg-white` on CTAs)
- 4 known light-bg exception pages handled correctly

#### `tests/visual/responsive.spec.ts` — Multi-breakpoint no-overflow (54/54 ✅)

Checks no horizontal scroll at any breakpoint (xs/sm/md/lg/3xl).

### Viewport config

```typescript
// playwright.config.ts — 3 projects (smoke/brand/responsive), 6 viewport presets
export const VIEWPORTS = {
  xs: { width: 380, height: 812 }, // Small phone
  sm: { width: 640, height: 812 }, // Standard mobile
  md: { width: 768, height: 1024 }, // Tablet
  lg: { width: 1024, height: 768 }, // Laptop
  '3xl': { width: 1920, height: 1080 }, // TV / 1080p
}
```

---

## CI Integration

`.github/workflows/ci.yml` runs in this order:

1. `npm run lint` — ESLint
2. `npx tsc --noEmit` — TypeScript
3. `npm run test` — Jest unit tests
4. `npm run build` — Next.js production build
5. `npx playwright test tests/visual/smoke` — smoke gate
6. `npx playwright test tests/visual/brand` — brand gate

---

## Tooling

| Tool       | Version | Config                                   |
| ---------- | ------- | ---------------------------------------- |
| Jest       | 30.2.0  | `jest.config.ts` (next/jest transformer) |
| Playwright | 1.58.2  | `playwright.config.ts` (Chromium)        |
| Node       | 24.13.0 | `.nvmrc` locks 20 for CI                 |

---

_Last updated: Session 15 (2026-03-11)_
