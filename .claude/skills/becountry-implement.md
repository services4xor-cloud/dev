---
name: becountry-implement
description: Implementation workflow for Be[X] features — the build phase that turns designs into working code with real DB, tests, and sync.
---

# Be[X] Implementation Workflow

> Test-Driven Development. Test first, then build, then cleanup. Everything syncs.

## When to Use

- After planning/design is approved
- When building ANY new feature or fixing bugs
- When wiring pages from mock data to real DB

## Implementation Flow (TDD)

```
1. UNDERSTAND → Read relevant .MD files + existing code
2. TEST FIRST → Write failing test that defines expected behavior
3. RUN TEST   → Verify it fails (red)
4. IMPLEMENT  → Write minimal code to pass the test (green)
5. RUN TEST   → Verify it passes
6. REFACTOR   → Clean up, DRY, boy scout rule
7. VERIFY     → TypeScript clean, full test suite, build passes
8. SYNC       → Update docs/skills that reference changed code
9. COMMIT     → Descriptive message, push to main
```

## TDD Rules

1. **No production code without a failing test first**
2. **Write the simplest test that fails** — don't over-test upfront
3. **Write the simplest code that passes** — refactor after green
4. **Mock data for tests only** — real DB for production code
5. **Run full suite before commit** — no broken tests shipped

## Code Standards

### Data Layer

- **Real app** → Prisma queries via `lib/db.ts`
- **Tests only** → Mock data from `data/mock/`
- **API routes** → Validate with Zod, return typed JSON
- **Client pages** → Fetch from API routes or use server components

### Wiring Pages to Real DB (Migration Pattern)

When a page currently imports from `data/mock/`:

```typescript
// BEFORE (mock)
import { MOCK_PATHS } from '@/data/mock'
const paths = MOCK_PATHS

// AFTER (real DB via API route)
const [paths, setPaths] = useState([])
useEffect(() => {
  fetch('/api/paths').then(r => r.json()).then(setPaths)
}, [])

// OR (server component — preferred for SEO pages)
import { db } from '@/lib/db'
export default async function PathsPage() {
  const paths = await db.path.findMany({ where: { status: 'ACTIVE' } })
  return <PathsList paths={paths} />
}
```

### File Organization

```
app/[feature]/page.tsx     → Page component (client or server)
app/api/[feature]/route.ts → API endpoint (Zod validation + Prisma)
lib/[feature].ts           → Business logic (pure functions)
__tests__/[feature].test.ts → Jest tests (mock data for isolation)
```

### Error Handling

```typescript
// API routes: always try/catch with logger
try {
  const result = await db.path.findMany()
  return NextResponse.json(result)
} catch (err) {
  logger.error('GET /api/paths failed', { error: String(err) })
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}

// Client pages: always show error + loading states
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
```

### Auth-Protected Routes

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... proceed with authenticated logic
}
```

## After Implementation

1. **Run tests**: `npm test` — all must pass
2. **TypeScript**: `npx tsc --noEmit` — 0 errors
3. **Build**: `npm run build` — must succeed
4. **Sync**: Run `becountry-sync` — update affected docs
5. **Commit**: Descriptive message, push to main

## Integration with Other Skills

```
becountry-sprint → picks the task
becountry-architecture → validates approach
  → THIS SKILL (becountry-implement) → builds it
becountry-testing → validates with tests
becountry-sync → updates all docs
becountry-push → deploys
```
