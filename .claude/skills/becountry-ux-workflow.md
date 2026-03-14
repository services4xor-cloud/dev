# Be[Country] UX Workflow Review

> Reviews user experience flows, journey mapping, and interaction design across the platform.

## When to Use

- Before building a new feature (design the user flow)
- After building a feature (validate the experience)
- When reviewing conversion funnels or drop-off points
- When planning multi-step wizards (Compass, Onboarding, Post-Path)

## Process

### 1. Identify the Flow

Read `PRD.md` and `REQUIREMENTS.md` for the target user journey. Determine:

- **Who**: Pioneer or Anchor?
- **Goal**: What are they trying to accomplish?
- **Entry point**: How do they arrive at this flow?
- **Exit point**: What's the successful outcome?

### 2. Map the Current Flow

Trace the actual implementation:

```
app/[feature]/page.tsx → What pages exist?
components/ → What UI components are used?
lib/ → What business logic drives decisions?
data/mock/ → What data shapes the experience?
```

### 3. Evaluate Against UX Principles

#### Be[Country] UX Principles

1. **Identity First** — Every flow should reinforce the Pioneer's/Anchor's identity
2. **Progressive Disclosure** — Don't overwhelm; reveal complexity gradually
3. **Mobile First** — 70%+ traffic from mobile in target markets (Kenya)
4. **Offline Tolerant** — Graceful degradation for poor connectivity
5. **Cultural Sensitivity** — Language, imagery, metaphors match the country
6. **Minimal Steps** — Reduce friction; every click must earn its place

#### Check Each Step

For each step in the flow:

- [ ] Is the action clear? (Can the user tell what to do?)
- [ ] Is feedback immediate? (Loading states, success/error messages)
- [ ] Can they go back? (Navigation, breadcrumbs, back buttons)
- [ ] Is it mobile-friendly? (Touch targets, scroll behavior)
- [ ] Does it use BeNetwork vocabulary? (Pioneer, Path, Chapter — not user, job, application)
- [ ] Is it translated? (Uses `useTranslation()` / `t()` function)

### 4. Key Flows to Review

| Flow                       | Pages                           | Steps         | Critical Metric   |
| -------------------------- | ------------------------------- | ------------- | ----------------- |
| **Compass** (Route Wizard) | `app/compass/`                  | 4 steps       | Completion rate   |
| **Onboarding**             | `app/onboarding/`               | 5 steps       | Drop-off per step |
| **Pioneer Sign-up**        | `app/signup/` → onboarding      | 2+5 steps     | Conversion        |
| **Anchor Post Path**       | `app/anchors/post-path/`        | Multi-step    | Path publish rate |
| **Connect → Message**      | `app/exchange/[id]/` → messages | 2 steps       | Response rate     |
| **Book Experience**        | `app/experiences/[id]/`         | Detail → book | Booking rate      |
| **Password Reset**         | `app/forgot-password/` → reset  | 2 steps       | Completion rate   |

### 5. Output Format

```markdown
## UX Flow Review: [Flow Name]

### Flow Map

Step 1: [Page] → Step 2: [Page] → ... → Success

### Friction Points

1. **[Step N]**: [Issue] → Recommendation
2. **[Step N]**: [Issue] → Recommendation

### Mobile Experience

- [Assessment of touch targets, scroll, responsive layout]

### Accessibility

- [Keyboard navigation, screen reader, contrast]

### Recommendations

- Priority 1: [Critical UX fix]
- Priority 2: [Important improvement]
- Priority 3: [Nice to have]
```

### 6. Multi-Country UX

- Check that flows adapt to country context (currency, payment method, language)
- Verify `useIdentity()` hook provides correct brand name
- Confirm RTL support readiness for Arabic-speaking countries
- Validate that cultural metaphors are appropriate per country
