---
name: becountry-requirements
description: Requirements tracking for Be[Country] — PRD alignment, feature completeness, user flow verification, decision log maintenance.
---

# Be[Country] Requirements Tracking

## When to Use

Run before building features, when verifying completeness, or when the user asks "is this done?"

## Process

### 1. PRD Alignment Check

Read `PRD.md` and compare against implementation:

- List all user flows described in PRD
- For each flow, check if pages + API routes exist
- Flag flows that are described but not implemented
- Flag implementations that aren't in the PRD (scope creep)

### 2. Feature Completeness Matrix

For each major feature area, check implementation status:

| Feature       | PRD Section | Pages          | API Routes              | Tests | Status   |
| ------------- | ----------- | -------------- | ----------------------- | ----- | -------- |
| Auth          | Section X   | login, signup  | register, [...nextauth] | Y/N   | ✅/🔧/⬜ |
| Discovery     | Section X   | / (homepage)   | onboarding              | Y/N   | ✅/🔧/⬜ |
| Exchange      | Section X   | exchange, [id] | —                       | Y/N   | ✅/🔧/⬜ |
| Messages      | Section X   | messages       | —                       | Y/N   | ✅/🔧/⬜ |
| Profile       | Section X   | me             | —                       | Y/N   | ✅/🔧/⬜ |
| Paths         | Section X   | —              | paths                   | Y/N   | ✅/🔧/⬜ |
| Chapters      | Section X   | —              | chapters                | Y/N   | ✅/🔧/⬜ |
| Payments      | Section X   | —              | payments                | Y/N   | ✅/🔧/⬜ |
| Notifications | Section X   | notifications  | —                       | Y/N   | ✅/🔧/⬜ |
| Country Gates | Section X   | be/[country]   | —                       | Y/N   | ✅/🔧/⬜ |

### 3. User Flow Verification

For each critical user journey, trace the implementation:

**Pioneer Journey:**

1. Land on `/` → WowHero or Dashboard ✅/❌
2. Click "Begin" → Discovery flow ✅/❌
3. Complete 5 steps → Identity saved ✅/❌
4. See dashboard with scored agents ✅/❌
5. Browse `/exchange` → filterable feed ✅/❌
6. Click agent → `/exchange/[id]` detail ✅/❌
7. Click Connect → messages with agent DM ✅/❌
8. View `/notifications` → tabbed view ✅/❌
9. Edit `/me` → all 8 dimensions ✅/❌

**Anchor Journey:**

1. Sign up as Anchor ✅/❌
2. Post a Path ✅/❌
3. Review Chapters ✅/❌
4. Accept/Reject Pioneer ✅/❌
5. Receive email notifications ✅/❌

### 4. Decision Log Maintenance

Read `REQUIREMENTS.md` for architecture decisions:

- Are all decisions still valid?
- Any new decisions needed?
- Update decision log with rationale

### 5. Vocabulary Compliance

Read `lib/vocabulary.ts` — search codebase for violations:

- "user" should be "Pioneer" or "Anchor"
- "job" should be "Path"
- "application" should be "Chapter"
- "booking" should be "Venture"
- "search" should be "Compass"

## Output Format

```
## 📋 Requirements Report — Be[Country]

### PRD Alignment: X% features implemented
### Feature Matrix
| Feature | Status | Gap |
|---------|--------|-----|

### User Flow Status
| Journey | Steps Complete | Broken Steps |
|---------|---------------|-------------|

### Vocabulary Violations: X found
### Decision Log: Up to date / Needs update

### Requirements Score: X/10
### Top Priority Gaps:
1. [feature — impact — effort]
```
