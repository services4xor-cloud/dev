# Premium Design System Rework — Design Document

> **Date:** 2026-03-12
> **Approach:** B — Component Library Extraction + Premium Wow Effects
> **Style:** Premium & Elegant (Stripe/Linear polish)
> **Scope:** Design system rework + full page sweep + journey fixes
> **Status:** Approved

---

## 1. Goals

1. **Simplify** — Extract reusable premium components, reduce inline card/section styling by 60%+
2. **Wow** — Glassmorphism, ambient glows, animated borders, scroll-reveal, shimmer loading
3. **Harmonize** — Enforce phi typography + phi spacing across every page
4. **Fix** — Clean orphaned directories, add btn-disabled utility, wire profile save

---

## 2. CSS Additions (globals.css)

### 2.1 Glassmorphism System

```css
.glass {
  background: rgb(var(--color-surface-2-rgb) / 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.12);
}
.glass-strong {
  background: rgb(var(--color-surface-rgb) / 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.2);
  box-shadow: 0 0 30px rgb(var(--color-accent-rgb) / 0.05);
}
.glass-subtle {
  background: rgb(var(--color-surface-2-rgb) / 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.08);
}
```

### 2.2 Ambient Glow Backgrounds

```css
.ambient-glow {
  position: relative;
}
.ambient-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(800px circle at 70% 10%, rgba(201, 162, 39, 0.06), transparent),
    radial-gradient(600px circle at 20% 80%, rgba(92, 10, 20, 0.12), transparent);
  pointer-events: none;
  z-index: 0;
}
```

### 2.3 Glow Effects

```css
.glow-accent {
  box-shadow: 0 0 20px rgb(var(--color-accent-rgb) / 0.15);
}
.glow-accent-hover:hover {
  box-shadow: 0 0 25px rgb(var(--color-accent-rgb) / 0.25);
}
.glow-primary {
  box-shadow: 0 0 30px rgb(var(--color-primary-rgb) / 0.2);
}
```

### 2.4 Animated Gradient Border (Featured Cards)

```css
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  position: relative;
  border: 1px solid transparent;
  background-clip: padding-box;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--gradient-angle),
    var(--color-accent),
    var(--color-primary),
    var(--color-accent)
  );
  z-index: -1;
  animation: rotate-gradient 8s linear infinite;
}
@keyframes rotate-gradient {
  to {
    --gradient-angle: 360deg;
  }
}
```

### 2.5 Scroll-Reveal Stagger

```css
@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.reveal {
  animation: revealUp 0.5s ease-out both;
}
.reveal-stagger > * {
  animation: revealUp 0.5s ease-out both;
}
.reveal-stagger > *:nth-child(1) {
  animation-delay: 0ms;
}
.reveal-stagger > *:nth-child(2) {
  animation-delay: 100ms;
}
.reveal-stagger > *:nth-child(3) {
  animation-delay: 200ms;
}
.reveal-stagger > *:nth-child(4) {
  animation-delay: 300ms;
}
.reveal-stagger > *:nth-child(5) {
  animation-delay: 400ms;
}
.reveal-stagger > *:nth-child(6) {
  animation-delay: 500ms;
}
```

### 2.6 Enhanced btn-primary

```css
.btn-primary:hover {
  box-shadow: 0 0 20px rgb(var(--color-accent-rgb) / 0.2);
}
```

### 2.7 Shimmer Loading

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    rgb(var(--color-accent-rgb) / 0.08) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### 2.8 Hero Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #fff 30%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 2.9 Nav Underline Slide

```css
.nav-link-active {
  position: relative;
}
.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
  transform: translateX(-50%);
}
```

### 2.10 Disabled Button

```css
.btn-disabled {
  @apply px-6 py-3 rounded-xl font-semibold cursor-not-allowed;
  background: rgb(var(--color-surface-2-rgb) / 0.6);
  color: rgb(var(--color-text-rgb) / 0.3);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.1);
}
```

---

## 3. New Components (components/ui/)

### 3.1 GlassCard

```typescript
// components/ui/GlassCard.tsx
interface GlassCardProps {
  variant?: 'default' | 'featured' | 'subtle'
  hover?: boolean // Enable hover lift + glow
  padding?: 'sm' | 'md' | 'lg' // phi-3, phi-5, phi-7
  className?: string
  children: ReactNode
}
```

Renders:

- `default` → `.glass` + rounded-2xl
- `featured` → `.glass-strong` + `.gradient-border` (animated gold border)
- `subtle` → `.glass-subtle` + rounded-xl
- `hover` → `hover:-translate-y-1 glow-accent-hover`
- Padding maps to phi scale

### 3.2 SectionLayout

```typescript
// components/ui/SectionLayout.tsx
interface SectionLayoutProps {
  size?: 'sm' | 'md' | 'lg' // py-phi-6, py-phi-7, py-phi-8
  maxWidth?: string // default: max-w-6xl
  ambient?: boolean // Add ambient glow background
  stagger?: boolean // Add reveal-stagger to children
  className?: string
  children: ReactNode
}
```

### 3.3 StatCard

```typescript
// components/ui/StatCard.tsx
interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}
```

Glass card with tabular-nums, subtle icon glow, trend indicator.

### 3.4 SkillChip

```typescript
// components/ui/SkillChip.tsx
interface SkillChipProps {
  label: string
  variant?: 'default' | 'accent' | 'muted'
  className?: string
}
```

Consistent skill/tag rendering with hover scale.

---

## 4. Component Updates

### 4.1 HeroSection

- Title: `gradient-text` class (gold→white gradient)
- Background: Add animated gradient mesh (CSS pseudo-elements)
- Children: wrap in `reveal-stagger`
- Padding: phi scale (`py-phi-7`, `py-phi-8`, `py-phi-9`)
- Add subtle floating particles (CSS-only)

### 4.2 SectionHeader

- Typography: `text-phi-2xl md:text-phi-3xl`
- Add accent underline decoration (thin gold line below title)
- Enforce `font-display`
- Spacing: `mb-phi-6`

### 4.3 PathCard

- Wrap content in GlassCard
- Typography: phi scale
- Spacing: phi
- Enhanced hover (lift + glow)

### 4.4 Nav

- Enhanced glass on scroll (`glass-strong`)
- Gold bottom border glow
- Active link gold dot (`.nav-link-active`)
- Logo glow on hover

### 4.5 Footer

- Glass separator line (gradient)
- Ambient glow behind logo section
- Phi spacing (already partially done)

### 4.6 Skeleton

- Replace `animate-pulse` with `.skeleton-shimmer`
- Gold-tinted shimmer matching brand

### 4.7 WizardShell

- Glass card wrapper for wizard content area

---

## 5. Typography & Spacing Enforcement

### Typography Migration

| Current (standard)                 | New (phi)                                      |
| ---------------------------------- | ---------------------------------------------- |
| `text-xs`                          | `text-phi-xs`                                  |
| `text-sm`                          | `text-phi-sm`                                  |
| `text-base`                        | `text-phi-base`                                |
| `text-lg`                          | `text-phi-lg`                                  |
| `text-xl`                          | `text-phi-xl`                                  |
| `text-2xl`                         | `text-phi-2xl`                                 |
| `text-3xl md:text-4xl`             | `text-phi-2xl md:text-phi-3xl`                 |
| `text-3xl sm:text-4xl md:text-5xl` | `text-phi-2xl sm:text-phi-3xl md:text-phi-4xl` |

### Spacing Migration

| Current | New                    |
| ------- | ---------------------- |
| `p-4`   | `p-phi-4`              |
| `p-5`   | `p-phi-5`              |
| `p-6`   | `p-phi-5` or `p-phi-6` |
| `py-16` | `py-phi-7`             |
| `py-20` | `py-phi-8`             |
| `py-28` | `py-phi-9`             |
| `gap-4` | `gap-phi-4`            |
| `gap-6` | `gap-phi-5`            |
| `mb-4`  | `mb-phi-4`             |
| `mb-12` | `mb-phi-6`             |

---

## 6. Page Sweep (All Pages)

Every page receives:

1. `SectionLayout` wrappers (ambient glow + phi spacing)
2. `GlassCard` for all card-like elements
3. Phi typography scale
4. `reveal-stagger` on key sections
5. Consistent hover states via `GlassCard hover`

### Pages to sweep:

- `/` (homepage)
- `/compass`
- `/ventures`
- `/ventures/[id]`
- `/experiences/[id]`
- `/be/[country]`
- `/login`, `/signup`, `/forgot-password`
- `/onboarding`
- `/pioneers/dashboard`
- `/anchors/dashboard`
- `/anchors/post-path`
- `/profile`
- `/threads`, `/threads/[slug]`
- `/offerings`
- `/about`, `/business`, `/contact`
- `/pricing`
- `/privacy`
- `/referral`
- `/charity`
- `/media`, `/fashion`
- `/agents`, `/agents/dashboard`
- `/admin`

---

## 7. Journey Fixes (During Sweep)

1. Delete orphaned directories: `/employers`, `/jobs`, `/post-job`, old `/dashboard`
2. Add `.btn-disabled` CSS utility
3. Wire profile save button with proper toast feedback

---

## 8. Quality Assurance

After implementation:

- `npm run typecheck` → 0 errors
- `npm run test` → all passing
- `npx playwright test` → all passing
- Visual check: every page has consistent premium feel
- Responsive check: xs → 4K
- Performance: no JS animation libraries, all CSS-only

---

## 9. Implementation Order

1. CSS utilities (globals.css) — foundation
2. New components (components/ui/) — building blocks
3. Update existing components (HeroSection, SectionHeader, PathCard, Nav, Footer, Skeleton)
4. Page sweep (homepage first, then all others)
5. Journey fixes (orphaned dirs, btn-disabled, profile save)
6. Test + verify

---

_Approved: 2026-03-12 | Style: Premium & Elegant | All CSS-only, no JS animation libs_
