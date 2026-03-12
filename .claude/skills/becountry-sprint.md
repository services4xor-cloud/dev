---
name: becountry-sprint
description: Agile sprint planning and coordination for BeKenya — reads ROADMAP-LIVE.md, identifies next priorities, creates sprint backlog.
---

# BeKenya Sprint Planning

## When to Use

Run at the start of a session or when the user asks "what's next?" or wants sprint planning.

## Process

### 1. Read Current State

- Read `ROADMAP-LIVE.md` for current phase and priorities
- Read `PROGRESS.md` for session history and what's done
- Run `git log --oneline -10` for recent commits
- Check `ASK.md` for owner questions/decisions needed

### 2. Identify Sprint Backlog

From ROADMAP-LIVE.md, extract items marked with 🔧 (partial) or ⬜ (todo):

- Group by priority (P1: Flow connections, P2: Data flow, P3: Production readiness)
- Estimate effort: S (< 30 min), M (30-120 min), L (2-4 hrs), XL (4+ hrs)
- Identify dependencies and blockers

### 3. Propose Sprint

Create a focused sprint (2-4 items, achievable in one session):

- Lead with highest-impact, unblocked items
- Include at least one "quick win" (S-sized)
- Flag any items needing owner input → write to ASK.md

### 4. Track Progress

- Use TodoWrite to create sprint items
- Update PROGRESS.md after each completed item
- Update ROADMAP-LIVE.md status markers

## Output Format

```
## 🏃 Sprint [N] — [Date]

### Goal: [One sentence]

### Backlog
| # | Item | Size | Priority | Blocked? |
|---|------|------|----------|----------|
| 1 | ...  | S/M/L | P1/P2/P3 | No/Yes  |

### Proposed Sprint (this session)
1. ✅ [Quick win item] — S
2. 🔧 [Main item] — M
3. 🔧 [Second item] — M

### Blockers
- [If any, with who needs to act]

### Definition of Done
- [ ] Code compiles (0 TS errors)
- [ ] Tests pass
- [ ] PROGRESS.md updated
- [ ] Committed and pushed
```
