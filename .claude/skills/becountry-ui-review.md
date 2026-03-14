---
name: becountry-ui-review
description: Review Be[Country] UI — components, visual design, interactions, design system compliance, responsive and accessibility.
---

# Be[Country] UI Functionality & Design Review

> Reviews UI components, visual design, interactions, and design system compliance.

## When to Use

- After building or modifying any UI component
- During design system audits
- Before deploying visual changes
- When reviewing responsive behavior

## Process

### 1. Design System Compliance

Read `DESIGN_SYSTEM.md` and check every modified component:

#### Color Tokens

```
✅ bg-brand-primary    (#5C0A14)
✅ text-brand-accent   (#C9A227)
✅ bg-brand-bg         (#0A0A0F)
✅ bg-brand-surface    (#111118)
❌ NEVER: #FF6B35, orange-*, amber-*, yellow-*
```

#### Typography (Golden Ratio φ=1.618)

- Uses `text-phi-*` scale tokens
- Font weights: regular (400), medium (500), bold (700)
- Line heights follow φ ratio

#### Spacing

- Uses `p-phi-*`, `m-phi-*`, `gap-phi-*` tokens
- Consistent padding inside GlassCard components

### 2. Component Audit

For each component on the page:

```markdown
| Component | Brand Compliant | Responsive | Accessible | Interactive |
| --------- | --------------- | ---------- | ---------- | ----------- |
| GlassCard | ✅/❌           | ✅/❌      | ✅/❌      | ✅/❌       |
| Button    | ✅/❌           | ✅/❌      | ✅/❌      | ✅/❌       |
| Input     | ✅/❌           | ✅/❌      | ✅/❌      | ✅/❌       |
```

### 3. Visual Checks

#### Layout

- [ ] Page fills viewport properly (no unnecessary scrollbars)
- [ ] Content is centered with appropriate max-width
- [ ] Spacing is consistent and follows φ ratio
- [ ] No orphaned elements or broken layouts

#### Dark Theme

- [ ] All text readable against dark backgrounds
- [ ] Proper contrast ratios (WCAG AA minimum)
- [ ] No white flashes on page load
- [ ] Glass morphism effects render correctly

#### Responsive Breakpoints

- [ ] Mobile (375px) — single column, touch-friendly
- [ ] Tablet (768px) — adaptive layout
- [ ] Desktop (1280px) — full layout with sidebars

#### Interactions

- [ ] Hover states on all interactive elements
- [ ] Focus rings visible for keyboard navigation
- [ ] Loading states for async operations
- [ ] Error states styled consistently
- [ ] Transitions smooth (not jarring)
- [ ] `ambient-glow` effect on main pages

### 4. Shared Component Usage

Verify pages use shared components from `components/`:

```
components/ui/GlassCard.tsx    → Card containers
components/layout/Navbar.tsx   → Navigation
components/layout/Footer.tsx   → Footer
```

Pages should NOT create ad-hoc styled containers when a shared component exists.

### 5. BeNetwork Vocabulary in UI

- All labels use `t()` translation function
- Button text matches vocabulary (e.g., "Start Chapter" not "Apply Now" — unless design decision)
- Navigation labels from `lib/nav-structure.ts`
- Country-specific content adapts via `useIdentity()`

### 6. Output Format

```markdown
## UI Review: [Page/Component Name]

### Design System Compliance

- Colors: ✅ All brand tokens | ❌ Found [violation]
- Typography: ✅ φ scale | ❌ Found [violation]
- Spacing: ✅ Consistent | ❌ Found [violation]

### Visual Issues

1. **[Component]**: [Issue] → Fix: [Solution]

### Responsive Issues

1. **[Breakpoint]**: [Issue] → Fix: [Solution]

### Interaction Issues

1. **[Element]**: [Missing state] → Fix: [Solution]

### Recommendations

- [Prioritized list of fixes]
```

### 7. Automated Checks

Run Playwright visual tests after review:

```bash
npx playwright test tests/visual/
```

All Playwright tests must pass (run `npx playwright test`). If any fail, investigate before deploying.
