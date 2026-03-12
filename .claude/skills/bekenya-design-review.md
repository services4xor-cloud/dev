---
name: bekenya-design-review
description: Review BeKenya UI/UX — brand compliance, accessibility, responsive design, and visual consistency across pages.
---

# BeKenya Design Review

## When to Use

Run after UI changes or when the user asks to review design quality.

## Review Process

### 1. Brand Compliance Check

Read `DESIGN_SYSTEM.md` for brand tokens, then scan modified files for violations:

- **Forbidden colors**: `#FF6B35`, `orange-*`, `amber-*`, `yellow-*`
- **Required tokens**: `brand-primary` (#5C0A14), `brand-accent` (#C9A227), `brand-bg` (#0A0A0F)
- **Typography**: phi-ratio spacing tokens (`phi-xs`, `phi-sm`, `phi-lg`, etc.)
- **Components**: GlassCard, SectionLayout usage patterns

### 2. Accessibility Audit

For each page component file:

- Check all `<img>` tags have `alt` attributes
- Check all interactive elements have `aria-label` or visible text
- Check color contrast (brand-accent on brand-bg = ✅, white/40 on brand-bg = ⚠️)
- Check focus states exist on interactive elements
- Check semantic HTML (`<main>`, `<nav>`, `<section>`, `<h1>`-`<h6>` hierarchy)

### 3. Responsive Design

- Check for `responsive` grid classes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Check text doesn't overflow on small screens (`truncate`, `line-clamp-*`, or responsive text sizes)
- Check padding/margins use responsive variants (`px-4 md:px-8`)

### 4. Consistency Check

- Nav uses `lib/nav-structure.ts` links (never inline)
- Footer uses `FOOTER_COLUMNS` from same file
- Vocabulary matches `lib/vocabulary.ts` (Pioneer not "user", Path not "job", etc.)
- All pages use `SectionLayout` or consistent layout patterns

## Output Format

```
## 🎨 Design Review: [page/component]

### Brand Compliance: ✅/⚠️/❌
- [findings]

### Accessibility: ✅/⚠️/❌
- [findings]

### Responsive: ✅/⚠️/❌
- [findings]

### Consistency: ✅/⚠️/❌
- [findings]

### Score: X/10
### Recommendations:
1. [actionable fix]
```
