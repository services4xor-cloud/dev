---
name: bex-review
description: Design + UI review — brand compliance, accessibility, vocabulary
---

# UI/Design Review

## Brand Compliance

- Colors: `brand-primary` (#5C0A14), `brand-accent` (#C9A227), `brand-bg` (#0A0A0F), `brand-surface` (#111118)
- **Forbidden:** orange-_, amber-_, yellow-\*, any raw hex in components
- Typography: phi scale (1.618 ratio)
- Dark theme only — no light mode

## Vocabulary

Check all user-facing text uses `lib/vocabulary.ts` terms:

- Explorer (not user/candidate), Host (not employer), Opportunity (not job)
- Exchange (not application), Discovery (not search), Hub (not dashboard)

## Accessibility

- All images have `alt` text
- Interactive elements are keyboard-accessible
- Color contrast meets WCAG AA (4.5:1 for text)
- Form inputs have labels

## Responsive

- Mobile-first, works at 320px+
- Map is fullscreen on all viewports
- Touch targets ≥ 44px on mobile
