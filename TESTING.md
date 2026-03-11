# Be[Country] — Testing Strategy

> ← [CLAUDE.md](./CLAUDE.md) | [ARCHITECTURE.md](./ARCHITECTURE.md)
> **All tests passing: 25 Jest + 102 Playwright**

---

## Two Layers

```
Jest unit tests     → lib/* logic, API schemas     (25/25 ✅)
Playwright visual   → page renders, brand, responsive (102/102 ✅)
```

---

## Jest (25/25)

```bash
npm run test                              # all
npx jest --testPathPattern="matching"     # single
```

| Test File                                  | Tests                  |
| ------------------------------------------ | ---------------------- |
| `__tests__/api/mpesa.test.ts`              | Phone formatting       |
| `__tests__/api/paths.test.ts`              | Path schema validation |
| `__tests__/lib/vocabulary.test.ts`         | Term constants         |
| `__tests__/lib/matching.test.ts`           | 4-dimension scoring    |
| `__tests__/lib/safari-packages.test.ts`    | Package data           |
| `__tests__/lib/compass.test.ts`            | Route corridors        |
| `__tests__/lib/whatsapp-templates.test.ts` | Template rendering     |
| `__tests__/lib/social-media.test.ts`       | Social config          |

---

## Playwright (102/102)

```bash
npx playwright test                         # all
npx playwright test tests/visual/smoke      # 16 tests
npx playwright test tests/visual/brand      # 32 tests
npx playwright test tests/visual/responsive # 54 tests
```

- **Smoke (16):** All pages return 200, no console errors
- **Brand (32):** No `#FF6B35`, no `orange-*`, dark bg, gold present
- **Responsive (54):** No horizontal scroll at xs/sm/md/lg/3xl

---

## CI Pipeline

`.github/workflows/ci.yml`:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run test` (Jest)
4. `npm run build`
5. `npx playwright test tests/visual/smoke`
6. `npx playwright test tests/visual/brand`

---

## Tooling

| Tool       | Version | Config                 |
| ---------- | ------- | ---------------------- |
| Jest       | 30.2.0  | `jest.config.ts`       |
| Playwright | 1.58.2  | `playwright.config.ts` |

---

_Last updated: Session 20 (2026-03-11)_
