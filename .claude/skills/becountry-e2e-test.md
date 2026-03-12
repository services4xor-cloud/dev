---
name: becountry-e2e-test
description: Run end-to-end scenario tests for BeKenya — walk through complete user journeys, verify flows connect, report broken paths.
---

# BeKenya E2E Scenario Testing

## When to Use

Run after completing features, before deployment, or when the user asks to test flows.

## Test Scenarios

### Scenario 1: Pioneer Journey (Happy Path)

1. Visit `/` → Should show WowHero or Dashboard based on identity state
2. Navigate to `/signup` → Form renders with Pioneer/Anchor role selection
3. POST `/api/auth/register` with test data → Returns 201
4. Navigate to `/login` → Google OAuth button + email/password form
5. Complete Discovery (5 steps) → Identity saved to localStorage
6. Visit `/` again → Dashboard shows scored agents and paths
7. Visit `/exchange` → Shows ~700 agents + paths, filterable
8. Click agent → `/exchange/[id]` shows full profile with 8-dimension scoring
9. Click "Connect" → Success animation → redirect to `/messages`
10. Visit `/me` → Profile shows all 8 dimensions
11. Visit `/notifications` → Tabbed notifications render

### Scenario 2: Password Reset Flow

1. Visit `/forgot-password` → Email input form
2. POST `/api/auth/forgot-password` with test email → Returns 200
3. POST `/api/auth/reset-password` with token + new password → Returns 200

### Scenario 3: Data Flow Verification

1. Change identity in Discovery → Exchange scores update
2. Connect with agent → Agent context passed to Messages
3. Edit profile in `/me` → Homepage data updates
4. Complete Discovery → Nav switches from PUBLIC to MAIN links

### Scenario 4: Auth Edge Cases

1. POST `/api/auth/register` with existing email → Returns 409
2. POST `/api/auth/register` with short password → Returns 400
3. POST `/api/auth/reset-password` with expired token → Returns 400
4. POST `/api/auth/reset-password` with invalid token → Returns 400

## Execution Method

### API Tests (fast, no browser needed)

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test1234"}'

# Test forgot password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```

### Page Render Tests (verify no crashes)

For each page in `app/**/page.tsx`:

1. Read the file
2. Check for `'use client'` if it uses hooks
3. Verify imports resolve (no missing modules)
4. Check for hardcoded data vs proper data source imports

### Integration Tests (TypeScript compilation)

Run `npx tsc --noEmit` — all pages must compile without errors.

## Output Format

```
## 🧪 E2E Test Report

### Scenario Results
| Scenario | Steps | Pass | Fail | Skip |
|----------|-------|------|------|------|

### Failed Steps (details)
- Scenario X, Step Y: [what went wrong]

### Recommendations
1. [fix for each failure]

### Overall: ✅ PASS / ❌ FAIL (X/Y scenarios passing)
```
