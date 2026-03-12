# Premium Design System Rework — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Be[Country] platform from functional dark theme to premium glassmorphism with ambient glows, animated borders, scroll-reveal animations, shimmer loading, and full phi-scale enforcement — all CSS-only, no JS animation libraries.

**Architecture:** Add ~100 lines of CSS utilities to globals.css (glassmorphism, glows, animations), create 4 small UI components (GlassCard, SectionLayout, StatCard, SkillChip), then sweep all 25+ pages to use them. Enforce phi typography/spacing everywhere. Fix journey gaps during sweep.

**Tech Stack:** Tailwind CSS, CSS custom properties, CSS @property, CSS keyframes. Zero new dependencies.

---

## Task 1: CSS Foundation — Glassmorphism + Glows + Animations

**Files:**

- Modify: `app/globals.css` (append to @layer components and add new utilities)

**Step 1: Add glassmorphism classes to @layer components**

After the existing `.badge-accent` block (~line 201), add:

```css
/* ── Glassmorphism ─────────────────────────────────────────────── */
.glass {
  @apply rounded-2xl;
  background: rgb(var(--color-surface-2-rgb) / 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.12);
}
.glass-strong {
  @apply rounded-2xl;
  background: rgb(var(--color-surface-rgb) / 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.2);
  box-shadow: 0 0 30px rgb(var(--color-accent-rgb) / 0.05);
}
.glass-subtle {
  @apply rounded-xl;
  background: rgb(var(--color-surface-2-rgb) / 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.08);
}

/* ── Glow Effects ──────────────────────────────────────────────── */
.glow-accent {
  box-shadow: 0 0 20px rgb(var(--color-accent-rgb) / 0.15);
}
.glow-primary {
  box-shadow: 0 0 30px rgb(var(--color-primary-rgb) / 0.2);
}

/* ── Disabled Button ───────────────────────────────────────────── */
.btn-disabled {
  @apply px-6 py-3 rounded-xl font-semibold cursor-not-allowed;
  background: rgb(var(--color-surface-2-rgb) / 0.6);
  color: rgb(var(--color-text-rgb) / 0.3);
  border: 1px solid rgb(var(--color-accent-rgb) / 0.1);
}

/* ── Gradient Text ─────────────────────────────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, #fff 30%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Nav Active Indicator ──────────────────────────────────────── */
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

**Step 2: Add ambient glow, shimmer, and animation utilities after @layer components**

After the `button, [role='button']` block (~line 208), add:

```css
/* ── Ambient Glow Backgrounds ──────────────────────────────────── */
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
.ambient-glow > * {
  position: relative;
  z-index: 1;
}

/* ── Animated Gradient Border ──────────────────────────────────── */
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.gradient-border {
  position: relative;
  overflow: hidden;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--gradient-angle),
    rgba(201, 162, 39, 0.4),
    rgba(92, 10, 20, 0.6),
    rgba(201, 162, 39, 0.4)
  );
  z-index: -1;
  animation: rotate-gradient 8s linear infinite;
}
.gradient-border > * {
  position: relative;
  z-index: 1;
}
@keyframes rotate-gradient {
  to {
    --gradient-angle: 360deg;
  }
}

/* ── Scroll Reveal + Stagger ───────────────────────────────────── */
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
  animation-delay: 80ms;
}
.reveal-stagger > *:nth-child(3) {
  animation-delay: 160ms;
}
.reveal-stagger > *:nth-child(4) {
  animation-delay: 240ms;
}
.reveal-stagger > *:nth-child(5) {
  animation-delay: 320ms;
}
.reveal-stagger > *:nth-child(6) {
  animation-delay: 400ms;
}
.reveal-stagger > *:nth-child(7) {
  animation-delay: 480ms;
}
.reveal-stagger > *:nth-child(8) {
  animation-delay: 560ms;
}

/* ── Shimmer Loading ───────────────────────────────────────────── */
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
    rgb(var(--color-surface-rgb)) 25%,
    rgb(var(--color-accent-rgb) / 0.08) 50%,
    rgb(var(--color-surface-rgb)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

**Step 3: Enhance existing btn-primary hover**

Replace the existing `.btn-primary:hover` block with:

```css
.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-light), #9a1220);
  border-color: rgb(var(--color-accent-rgb) / 0.55);
  box-shadow: 0 0 20px rgb(var(--color-accent-rgb) / 0.2);
}
```

**Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors (CSS-only changes)

**Step 5: Commit**

```bash
git add app/globals.css
git commit -m "style: add premium CSS utilities — glassmorphism, glows, shimmer, reveal animations"
```

---

## Task 2: Create GlassCard Component

**Files:**

- Create: `components/ui/GlassCard.tsx`

**Step 1: Create the component**

```tsx
import type { ReactNode } from 'react'

interface GlassCardProps {
  /** Visual variant */
  variant?: 'default' | 'featured' | 'subtle'
  /** Enable hover lift + glow effect */
  hover?: boolean
  /** Padding size using phi scale */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Additional classes */
  className?: string
  children: ReactNode
}

const VARIANT_CLASSES = {
  default: 'glass',
  featured: 'glass-strong gradient-border',
  subtle: 'glass-subtle',
} as const

const PADDING_CLASSES = {
  none: '',
  sm: 'p-phi-3',
  md: 'p-phi-5',
  lg: 'p-phi-7',
} as const

export default function GlassCard({
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  children,
}: GlassCardProps) {
  return (
    <div
      className={`${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${
        hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/10'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/ui/GlassCard.tsx
git commit -m "feat: add GlassCard component — glassmorphism with 3 variants"
```

---

## Task 3: Create SectionLayout Component

**Files:**

- Create: `components/ui/SectionLayout.tsx`

**Step 1: Create the component**

```tsx
import type { ReactNode } from 'react'

interface SectionLayoutProps {
  /** Vertical padding using phi scale */
  size?: 'sm' | 'md' | 'lg'
  /** Max width constraint */
  maxWidth?: string
  /** Add ambient glow background effect */
  ambient?: boolean
  /** Add staggered reveal animation to children */
  stagger?: boolean
  /** HTML element to render as */
  as?: 'section' | 'div'
  /** Additional classes */
  className?: string
  children: ReactNode
}

const SIZE_CLASSES = {
  sm: 'py-phi-6',
  md: 'py-phi-7',
  lg: 'py-phi-8',
} as const

export default function SectionLayout({
  size = 'md',
  maxWidth = 'max-w-6xl 3xl:max-w-[1600px]',
  ambient = false,
  stagger = false,
  as: Tag = 'section',
  className = '',
  children,
}: SectionLayoutProps) {
  return (
    <Tag className={`${SIZE_CLASSES[size]} ${ambient ? 'ambient-glow' : ''} ${className}`}>
      <div className={`${maxWidth} mx-auto px-4 xl:px-8 ${stagger ? 'reveal-stagger' : ''}`}>
        {children}
      </div>
    </Tag>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/ui/SectionLayout.tsx
git commit -m "feat: add SectionLayout component — phi spacing, ambient glow, stagger reveal"
```

---

## Task 4: Create StatCard Component

**Files:**

- Create: `components/ui/StatCard.tsx`

**Step 1: Create the component**

```tsx
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  /** Highlight this stat with accent color */
  accent?: boolean
  className?: string
}

export default function StatCard({
  label,
  value,
  icon,
  accent = false,
  className = '',
}: StatCardProps) {
  return (
    <div className={`glass p-phi-5 ${className}`}>
      <div className="flex items-center gap-phi-3">
        {icon && (
          <div className={`text-xl ${accent ? 'text-brand-accent' : 'text-gray-400'}`}>{icon}</div>
        )}
        <div>
          <p className="text-phi-sm text-gray-400">{label}</p>
          <p
            className={`text-phi-xl font-bold tabular-nums ${
              accent ? 'text-brand-accent' : 'text-white'
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/ui/StatCard.tsx
git commit -m "feat: add StatCard component — glass stat display with phi typography"
```

---

## Task 5: Create SkillChip Component

**Files:**

- Create: `components/ui/SkillChip.tsx`

**Step 1: Create the component**

```tsx
interface SkillChipProps {
  label: string
  variant?: 'default' | 'accent' | 'muted'
  className?: string
}

const VARIANT_CLASSES = {
  default: 'bg-gray-800/80 text-gray-300 border-gray-700',
  accent: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  muted: 'bg-gray-800/40 text-gray-500 border-gray-700/50',
} as const

export default function SkillChip({ label, variant = 'default', className = '' }: SkillChipProps) {
  return (
    <span
      className={`inline-flex items-center px-phi-3 py-phi-1 rounded-full text-phi-sm font-medium border
        transition-transform duration-150 hover:scale-105
        ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {label}
    </span>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/ui/SkillChip.tsx
git commit -m "feat: add SkillChip component — consistent skill/tag badges with phi sizing"
```

---

## Task 6: Update HeroSection — Premium Hero

**Files:**

- Modify: `components/HeroSection.tsx`

**Step 1: Update the component**

Replace the entire file with:

```tsx
import type { ReactNode } from 'react'

interface HeroSectionProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  badge?: string
  badgeIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  /** Use gradient text effect on title */
  gradientTitle?: boolean
}

const PADDING = {
  sm: 'py-phi-7',
  md: 'py-phi-8',
  lg: 'py-phi-9',
} as const

export default function HeroSection({
  title,
  subtitle,
  icon,
  badge,
  badgeIcon,
  size = 'md',
  children,
  gradientTitle = false,
}: HeroSectionProps) {
  return (
    <section
      className={`relative bg-gradient-to-b from-brand-primary to-brand-bg ${PADDING[size]} text-center overflow-hidden`}
    >
      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)]" />

      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-brand-accent/20 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-brand-accent/15 rounded-full animate-pulse-slow [animation-delay:1s]" />
        <div className="absolute bottom-1/3 left-1/2 w-0.5 h-0.5 bg-brand-accent/10 rounded-full animate-pulse-slow [animation-delay:2s]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 reveal-stagger">
        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 glass-subtle px-phi-4 py-phi-2 text-phi-sm font-medium mb-phi-4 text-brand-accent">
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* Icon */}
        {icon && <div className="mb-phi-4">{icon}</div>}

        {/* Title */}
        <h1
          className={`font-display text-phi-2xl sm:text-phi-3xl md:text-phi-4xl font-black leading-phi-tight mb-phi-3 ${
            gradientTitle ? 'gradient-text' : 'text-white'
          }`}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-300 text-phi-lg max-w-xl mx-auto leading-phi">{subtitle}</p>
        )}

        {/* Children */}
        {children}
      </div>
    </section>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "style: upgrade HeroSection — gradient text, particles, phi typography, glass badges"
```

---

## Task 7: Update SectionHeader — Premium Typography

**Files:**

- Modify: `components/SectionHeader.tsx`

**Step 1: Update the component**

Replace entire file with:

```tsx
interface SectionHeaderProps {
  title: string
  subtitle?: string
  /** Show decorative accent line below title */
  accent?: boolean
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  accent = true,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-phi-6 ${className}`}>
      <h2 className="font-display text-phi-2xl md:text-phi-3xl font-bold text-white mb-phi-3">
        {title}
      </h2>
      {accent && (
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-phi-4" />
      )}
      {subtitle && (
        <p className="text-gray-400 text-phi-lg max-w-xl mx-auto leading-phi">{subtitle}</p>
      )}
    </div>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/SectionHeader.tsx
git commit -m "style: upgrade SectionHeader — phi typography, accent underline decoration"
```

---

## Task 8: Update PathCard — Glass + Phi

**Files:**

- Modify: `components/PathCard.tsx`

**Step 1: Update the component**

Replace the outer Link's className and inner spacing with glass + phi classes. The full replacement:

```tsx
'use client'

import Link from 'next/link'
import { MapPin, Clock, DollarSign, Globe, Star } from 'lucide-react'
import SkillChip from '@/components/ui/SkillChip'

interface PathCardProps {
  id: string
  title: string
  company: string
  logo: string
  location: string
  isRemote: boolean
  pathType: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  skills: string[]
  posted: string
  isFeatured: boolean
  tier?: string
}

export default function PathCard({
  id,
  title,
  company,
  logo,
  location,
  isRemote,
  pathType,
  salaryMin,
  salaryMax,
  currency,
  skills,
  posted,
  isFeatured,
  tier,
}: PathCardProps) {
  return (
    <Link
      href={`/ventures/${id}`}
      className={`block p-phi-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/10 ${
        isFeatured ? 'glass-strong gradient-border' : 'glass'
      }`}
    >
      <div className="flex items-start gap-phi-4">
        {/* Logo */}
        <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          {logo}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-phi-2">
            <div>
              <h3 className="font-semibold text-white truncate">{title}</h3>
              <p className="text-phi-sm text-gray-400">{company}</p>
            </div>
            {isFeatured && (
              <span className="badge-accent flex-shrink-0">
                <Star className="w-3 h-3" fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-phi-2 mt-phi-2">
            <span className="flex items-center gap-1 text-phi-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
            {isRemote && (
              <span className="flex items-center gap-1 text-phi-xs text-brand-accent">
                <Globe className="w-3 h-3" />
                Remote
              </span>
            )}
            <span className="flex items-center gap-1 text-phi-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {posted}
            </span>
            {salaryMin && (
              <span className="flex items-center gap-1 text-phi-xs text-brand-accent font-medium">
                <DollarSign className="w-3 h-3" />
                {currency} {(salaryMin / 1000).toFixed(0)}k
                {salaryMax ? `–${(salaryMax / 1000).toFixed(0)}k` : '+'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-phi-1 mt-phi-2">
            {skills.slice(0, 4).map((skill) => (
              <SkillChip key={skill} label={skill} />
            ))}
            {skills.length > 4 && <SkillChip label={`+${skills.length - 4}`} variant="muted" />}
          </div>
        </div>
      </div>
    </Link>
  )
}
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add components/PathCard.tsx
git commit -m "style: upgrade PathCard — glass variants, SkillChip, phi spacing"
```

---

## Task 9: Update Skeleton — Shimmer Loading

**Files:**

- Modify: `components/Skeleton.tsx`

**Step 1: Replace animate-pulse references with shimmer**

In `SkeletonLine`: Replace `bg-gray-800/60` with `skeleton-shimmer`
In `SkeletonBlock`: Replace `bg-gray-800/40` with `skeleton-shimmer`
In `SkeletonCard`: Replace `bg-gray-800/40` and `bg-gray-800/60` blocks with `skeleton-shimmer`
Replace the outer `bg-gray-900/60 border border-brand-primary/30` with `glass`

The key changes are:

- All skeleton blocks: `className` includes `skeleton-shimmer` instead of `bg-gray-800/*`
- Outer card wrappers: use `glass` class
- Maintain same dimensions and layout

**Step 2: Run typecheck and test**

Run: `npx tsc --noEmit && npm run test -- --passWithNoTests`
Expected: 0 errors, tests pass

**Step 3: Commit**

```bash
git add components/Skeleton.tsx
git commit -m "style: upgrade Skeleton — gold shimmer loading, glass card wrappers"
```

---

## Task 10: Update Nav — Enhanced Glass + Active Indicator

**Files:**

- Modify: `components/Nav.tsx`

**Step 1: Enhance the scroll-aware background**

Find the nav element's className (around line 100+). The current scrolled state applies background changes. Update to use glass-strong when scrolled:

Current pattern: `scrolled ? 'bg-brand-bg/95 backdrop-blur ...' : 'bg-transparent'`

Replace with: `scrolled ? 'glass-strong border-b border-brand-accent/10' : 'bg-transparent'`

**Step 2: Add active link indicator**

Find the PRIMARY_LINKS mapping (where nav links render). Add `nav-link-active` class when `pathname === link.href`:

```tsx
className={`... ${pathname === link.href ? 'nav-link-active text-brand-accent' : ''}`}
```

**Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 4: Commit**

```bash
git add components/Nav.tsx
git commit -m "style: upgrade Nav — glass-strong on scroll, active link gold dot indicator"
```

---

## Task 11: Update Footer — Glass Separator + Phi Spacing

**Files:**

- Modify: `components/Footer.tsx`

**Step 1: Replace border-t with gradient separator**

Replace `border-t border-brand-accent/15` on the footer element with a gradient line:

```tsx
<footer className="bg-brand-bg relative">
  {/* Gradient separator */}
  <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
  <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-phi-7 3xl:py-phi-8">
```

**Step 2: Ensure phi spacing throughout**

Replace any remaining `gap-10` with `gap-phi-6` or similar phi values. Replace `mb-12` with `mb-phi-6`.

**Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 4: Commit**

```bash
git add components/Footer.tsx
git commit -m "style: upgrade Footer — gradient separator, phi spacing"
```

---

## Task 12: Update WizardShell — Glass + Disabled Button

**Files:**

- Modify: `components/WizardShell.tsx`

**Step 1: Replace disabled button inline styling**

Find the continue button (around line 182):

```tsx
canContinue && !submitting ? 'btn-primary' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
```

Replace with:

```tsx
canContinue && !submitting ? 'btn-primary' : 'btn-disabled'
```

**Step 2: Add glass to wizard navigation footer**

Replace `bg-brand-bg/95 backdrop-blur` with `glass-strong`:

```tsx
<div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-brand-accent/10 z-40">
```

**Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 4: Commit**

```bash
git add components/WizardShell.tsx
git commit -m "style: upgrade WizardShell — glass footer, btn-disabled utility"
```

---

## Task 13: Page Sweep — Homepage

**Files:**

- Modify: `app/page.tsx`

**Step 1: Apply premium patterns to homepage**

Key changes:

1. Hero section: Use `gradient-text` on main heading, add `reveal-stagger` to hero content
2. BeNetwork Pillars section: Wrap each pillar card in `GlassCard hover`
3. Compass CTA section: `SectionLayout ambient` wrapper
4. Experiences strip: `GlassCard` for each experience card
5. Impact Partner: `GlassCard variant="featured"`
6. Country expansion: `SectionLayout stagger`
7. Testimonials: `GlassCard variant="subtle"` for each testimonial
8. All sections: phi typography and spacing

The page is large (~400+ lines). Apply changes systematically:

- Import `GlassCard` from `@/components/ui/GlassCard`
- Import `SectionLayout` from `@/components/ui/SectionLayout`
- Replace inline card styling with `GlassCard`
- Wrap sections in `SectionLayout`
- Replace `text-3xl` → `text-phi-2xl`, `text-4xl` → `text-phi-3xl`, etc.
- Replace `py-16` → `py-phi-7`, `p-6` → `p-phi-5`, etc.

**Step 2: Run typecheck and dev server check**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "style: homepage premium sweep — glass cards, ambient glow, phi scale, stagger reveal"
```

---

## Task 14: Page Sweep — All Public Pages (Batch)

**Files (modify all):**

- `app/about/page.tsx`
- `app/business/page.tsx`
- `app/contact/page.tsx`
- `app/pricing/page.tsx`
- `app/privacy/page.tsx`
- `app/referral/page.tsx`
- `app/charity/page.tsx`
- `app/media/page.tsx`
- `app/fashion/page.tsx`
- `app/agents/page.tsx`

**Step 1: Apply consistent patterns to each page**

For each page:

1. If it uses `HeroSection` — add `gradientTitle` prop where appropriate
2. Wrap content sections in `SectionLayout` (with `ambient` on first content section)
3. Replace inline card divs with `GlassCard`
4. Replace standard typography with phi scale
5. Replace standard spacing with phi spacing
6. Add `reveal-stagger` to card grids

Pattern for pages that already use HeroSection + SectionHeader:

```tsx
<HeroSection title="..." subtitle="..." gradientTitle />
<SectionLayout ambient stagger>
  <SectionHeader title="..." />
  <div className="grid ... gap-phi-5">
    <GlassCard hover>...</GlassCard>
    <GlassCard hover>...</GlassCard>
  </div>
</SectionLayout>
```

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add app/about/page.tsx app/business/page.tsx app/contact/page.tsx app/pricing/page.tsx app/privacy/page.tsx app/referral/page.tsx app/charity/page.tsx app/media/page.tsx app/fashion/page.tsx app/agents/page.tsx
git commit -m "style: public pages premium sweep — glass cards, phi scale, ambient glow"
```

---

## Task 15: Page Sweep — Auth Pages

**Files:**

- Modify: `app/login/page.tsx`
- Modify: `app/signup/page.tsx`
- Modify: `app/forgot-password/page.tsx`

**Step 1: Apply glass form containers**

For each auth page:

1. Wrap the form in `GlassCard padding="lg"`
2. Apply `ambient-glow` to the page wrapper
3. Phi typography on headings
4. Ensure `.input` class is used consistently

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add app/login/page.tsx app/signup/page.tsx app/forgot-password/page.tsx
git commit -m "style: auth pages premium sweep — glass form containers, ambient glow"
```

---

## Task 16: Page Sweep — Core Journey Pages

**Files:**

- Modify: `app/compass/page.tsx`
- Modify: `app/ventures/page.tsx`
- Modify: `app/experiences/[id]/page.tsx`
- Modify: `app/be/[country]/page.tsx`
- Modify: `app/onboarding/page.tsx`
- Modify: `app/offerings/page.tsx`
- Modify: `app/threads/page.tsx`

**Step 1: Apply premium patterns**

For each page:

1. `SectionLayout` wrappers with phi spacing
2. `GlassCard` for all card elements
3. `reveal-stagger` on card grids
4. Phi typography
5. `ambient-glow` on first content section
6. Country gate hero: `gradientTitle`

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add app/compass/page.tsx app/ventures/page.tsx app/experiences/[id]/page.tsx app/be/[country]/page.tsx app/onboarding/page.tsx app/offerings/page.tsx app/threads/page.tsx
git commit -m "style: core journey pages premium sweep — glass, phi, ambient, stagger"
```

---

## Task 17: Page Sweep — Dashboard Pages

**Files:**

- Modify: `app/pioneers/dashboard/page.tsx`
- Modify: `app/anchors/dashboard/page.tsx`
- Modify: `app/anchors/post-path/page.tsx`
- Modify: `app/profile/page.tsx`
- Modify: `app/agents/dashboard/page.tsx`
- Modify: `app/admin/page.tsx`

**Step 1: Apply premium dashboard patterns**

For each dashboard:

1. Import `StatCard` from `@/components/ui/StatCard` — replace inline stat cards
2. Import `GlassCard` — replace inline card styling
3. Tab content areas: wrap in `SectionLayout`
4. Chapter/Path cards: `GlassCard` with hover
5. Phi typography and spacing throughout

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add app/pioneers/dashboard/page.tsx app/anchors/dashboard/page.tsx app/anchors/post-path/page.tsx app/profile/page.tsx app/agents/dashboard/page.tsx app/admin/page.tsx
git commit -m "style: dashboard pages premium sweep — StatCard, glass cards, phi scale"
```

---

## Task 18: Update Loading Skeletons

**Files:**

- All `loading.tsx` files across app/ (21 files)

**Step 1: Update skeleton patterns**

For each loading.tsx:

1. Replace `animate-pulse` wrapper with individual `skeleton-shimmer` classes
2. Replace `bg-gray-800/*` blocks with `skeleton-shimmer`
3. Replace outer card wrappers with `glass` class
4. Apply phi spacing

**Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add app/**/loading.tsx
git commit -m "style: all loading skeletons — gold shimmer effect, glass containers"
```

---

## Task 19: Journey Fix — Delete Orphaned Directories

**Files:**

- Delete: `app/employers/` (entire directory)
- Delete: `app/jobs/` (entire directory)
- Delete: `app/post-job/` (entire directory)
- Delete: `app/dashboard/` (entire directory — old, moved to /pioneers/dashboard)

**Step 1: Verify no references**

Search codebase for imports/links to these directories. Ensure nothing active references them.

Run: `grep -r "employers\|/jobs\|post-job\|app/dashboard" --include="*.tsx" --include="*.ts" lib/ components/ app/page.tsx`

**Step 2: Delete directories**

```bash
rm -rf app/employers app/jobs app/post-job app/dashboard
```

**Step 3: Run typecheck and tests**

Run: `npx tsc --noEmit && npm run test`
Expected: 0 errors, all tests pass

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete orphaned legacy directories — employers, jobs, post-job, dashboard"
```

---

## Task 20: Final Verification + PROGRESS.md Update

**Step 1: Full build check**

Run: `npm run build`
Expected: Build succeeds with 0 errors

**Step 2: Run all tests**

Run: `npm run test`
Expected: All 635 tests pass

**Step 3: Run Playwright tests**

Run: `npx playwright test`
Expected: All passing (some may need snapshot updates)

**Step 4: Update PROGRESS.md**

Add session log entry:

```markdown
### Session 49 (2026-03-12) — Premium Design System Rework

Complete design system overhaul for premium glassmorphism aesthetic.

- [x] **CSS Foundation**: Glassmorphism (3 tiers), ambient glows, animated gradient borders, scroll-reveal stagger, gold shimmer loading, gradient text, glow effects, btn-disabled
- [x] **4 New Components**: GlassCard (3 variants + hover), SectionLayout (phi spacing + ambient + stagger), StatCard (glass + tabular-nums), SkillChip (3 variants + hover scale)
- [x] **Component Upgrades**: HeroSection (gradient text + particles + phi), SectionHeader (accent underline + phi), PathCard (glass + SkillChip), Nav (glass-strong + active dot), Footer (gradient separator), Skeleton (gold shimmer), WizardShell (glass footer + btn-disabled)
- [x] **Full Page Sweep (25+ pages)**: All pages use GlassCard, SectionLayout, phi typography, phi spacing, reveal-stagger, ambient glow
- [x] **Journey Fixes**: Deleted orphaned dirs (employers, jobs, post-job, dashboard), added btn-disabled utility
- [x] All CSS-only — zero JS animation libraries
- [x] Jest: pass | TS: 0 errors | Clean build
```

**Step 5: Commit**

```bash
git add PROGRESS.md
git commit -m "docs: update PROGRESS.md — Session 49 premium design system rework"
```

**Step 6: Push**

```bash
git push
```

---

_Plan complete. 20 tasks. Estimated: CSS foundation (Tasks 1), Components (Tasks 2-5), Component upgrades (Tasks 6-12), Page sweep (Tasks 13-18), Cleanup (Tasks 19-20)._
