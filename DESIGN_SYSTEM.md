# BeNetwork Design System

> The single source of truth for visual design.
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [PRD.md](./PRD.md) · [REQUIREMENTS.md](./REQUIREMENTS.md)
> **RULE: If it contradicts this doc, fix the code — not this doc.**

---

## 1. Brand Identity

### Core Palette

| Token        | Hex       | Usage                                    | Contrast on `#0A0A0F` |
| ------------ | --------- | ---------------------------------------- | --------------------- |
| Maroon       | `#5C0A14` | Primary buttons, hero gradients, accents | — (background)        |
| Maroon Light | `#7A1020` | Button hover states                      | —                     |
| Gold         | `#C9A227` | Accent text, icons, borders, progress    | 8.9:1 ✅ WCAG AAA     |
| Gold Light   | `#D4AF37` | Gold hover                               | 9.2:1 ✅              |
| Near-black   | `#0A0A0F` | Page background                          | —                     |
| Surface      | `#111118` | Card backgrounds                         | —                     |
| Surface 2    | `#1A1A25` | Nested cards, inputs                     | —                     |
| Text         | `#F5F0E8` | Body text                                | 14.3:1 ✅ WCAG AAA    |
| Text Muted   | `#9B8B72` | Secondary text                           | 4.8:1 ✅ WCAG AA      |
| Gray 800     | `#1f2937` | Card borders, dividers                   | —                     |
| Gray 700     | `#374151` | Input borders, tags                      | —                     |
| Gray 400     | `#9ca3af` | Placeholder text                         | 4.1:1 ✅              |

### Tailwind Classes (always prefer these over raw hex)

```
bg-[#0A0A0F]          → page background
bg-gray-900/60        → card background
border-gray-800       → card border
border-[#C9A227]/30   → gold accent border (subtle)
border-[#C9A227]/60   → gold accent border (visible)
text-[#C9A227]        → gold accent text
bg-[#5C0A14]          → maroon background element
```

### WCAG Contrast Minimums (enforce always)

| Text class          | Hex       | Ratio on `#0A0A0F` | Verdict                                   |
| ------------------- | --------- | ------------------ | ----------------------------------------- |
| `text-white`        | `#FFFFFF` | 19.6:1             | ✅ AAA                                    |
| `text-brand-text`   | `#F5F0E8` | 14.3:1             | ✅ AAA                                    |
| `text-brand-accent` | `#C9A227` | 8.9:1              | ✅ AAA                                    |
| `text-gray-300`     | `#d1d5db` | 11.1:1             | ✅ AAA                                    |
| `text-gray-400`     | `#9ca3af` | 7.9:1              | ✅ AAA — secondary text minimum           |
| `text-gray-500`     | `#6b7280` | 3.8:1              | ❌ FAILS AA — **NEVER for readable text** |

**Rule:** All readable text ≥ `text-gray-400`. Use `text-gray-500` ONLY for decorative/non-essential elements (dividers, disabled placeholders). When in doubt, go lighter.

### Approved Functional Colors (non-brand exceptions)

| Use case        | Color         | Class                    | Notes                      |
| --------------- | ------------- | ------------------------ | -------------------------- |
| Success / ✓     | Green 400/500 | `text-green-400`         | Checkmarks, included lists |
| Error / ✗       | Red 400       | `text-red-400`           | Not-included, error states |
| M-Pesa branding | Green 600     | `bg-green-600`           | M-Pesa is green by brand   |
| Card payment    | Brand primary | `bg-brand-primary-light` | NOT teal/cyan/blue         |

Never introduce Tailwind colors outside this list (no teal, cyan, indigo, etc.).

### Colors NEVER to use

```
❌ #FF6B35           → old orange (eliminated session 6)
❌ text-orange-*     → Tailwind orange (brand.orange is now gold alias)
❌ bg-orange-*       → Tailwind orange
❌ text-teal-*       → Tailwind teal (brand.teal is now gold alias)
❌ bg-[#0891B2]      → off-brand teal (use brand-primary-light for card buttons)
❌ amber-*/yellow-*  → replaced with #C9A227 gold (session 11)
❌ text-gray-500     → fails WCAG AA for readable text (exception: decorative only)
❌ text-green-*      → Not brand (exception: ✓ checkmarks for inclusion lists)
```

---

## 2. Typography

### Font Stack

```css
--font-inter: 'Inter', system-ui, sans-serif; /* body */
--font-plus-jakarta: 'Plus Jakarta Sans', system-ui; /* headings */
```

Tailwind: `font-sans` (Inter) · `font-display` (Plus Jakarta Sans)

### Golden Ratio Scale (φ = 1.618)

Each step × √φ (1.272) from previous. Applied via `text-phi-*` classes:

| Class           | rem   | px     | Use                |
| --------------- | ----- | ------ | ------------------ |
| `text-phi-xs`   | 0.618 | ~10px  | Fine print, badges |
| `text-phi-sm`   | 0.764 | ~12px  | Captions, meta     |
| `text-phi-base` | 1.000 | 16px   | Body text          |
| `text-phi-lg`   | 1.272 | ~20px  | Lead text          |
| `text-phi-xl`   | 1.618 | ~26px  | H3 / subheadings   |
| `text-phi-2xl`  | 2.058 | ~33px  | H2                 |
| `text-phi-3xl`  | 2.618 | ~42px  | H1                 |
| `text-phi-4xl`  | 4.236 | ~68px  | Hero numbers       |
| `text-phi-5xl`  | 6.854 | ~110px | XL display         |

**Line heights:** `leading-phi` (1.618) for body · `leading-phi-tight` (1.272) for headings.

### Fluid Body Font (do not remove)

```css
html {
  font-size: clamp(14px, 1vw + 11px, 18px);
}
/* 14px on phones → 16px desktop → 18px on 1920px TV */
```

---

## 3. Spacing — Golden Ratio Scale

| Class     | px  | Use                          |
| --------- | --- | ---------------------------- |
| `p-phi-1` | 4   | Tight padding (badge insets) |
| `p-phi-2` | 6   | Small padding                |
| `p-phi-3` | 10  | Default input padding        |
| `p-phi-4` | 16  | Standard section padding     |
| `p-phi-5` | 26  | Card padding                 |
| `p-phi-6` | 42  | Section gap                  |
| `p-phi-7` | 68  | Section padding (py)         |
| `p-phi-8` | 110 | Large section padding        |
| `p-phi-9` | 178 | Hero vertical padding        |

**When to use phi vs standard Tailwind:**

- Use phi tokens when a close match exists (±4px): `p-phi-5` (26px) for card padding instead of `p-6` (24px)
- Standard Tailwind is fine where phi tokens don't have a close match (e.g., `gap-3` = 12px has no phi equivalent)
- Never mix phi and standard spacing in the same visual group (e.g., don't have `p-phi-5` on one card and `p-6` on the next)
- Hero: `py-phi-7` (68px) · Content: `py-phi-6` (42px) · Cards: `p-phi-5` (26px)

---

## 4. Component Patterns

### Dark Card (standard)

```tsx
<div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6
                hover:border-[#C9A227]/30 transition-colors">
```

### Featured Card (highlighted)

```tsx
<div className="bg-[#5C0A14]/20 border border-[#C9A227]/40 rounded-2xl p-6
                hover:border-[#C9A227]/70 transition-colors">
```

### Primary Button (maroon gradient)

```tsx
<button
  className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl
             transition-all hover:scale-105"
  style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)',
           border: '1px solid rgba(201,162,39,0.40)',
           boxShadow: '0 8px 24px rgba(92,10,20,0.35)' }}
>
```

Or use `className="btn-primary"` (defined in `globals.css`).

### Secondary Button (gold outline)

```tsx
<button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold
                   border border-[#C9A227]/40 text-[#C9A227]
                   hover:bg-[#C9A227]/10 transition-all">
```

Or use `className="btn-secondary"`.

### Input (dark)

```tsx
<input
  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#C9A227] transition-colors"
/>
```

Or use `className="input"`.

### Section Header (label + title)

```tsx
<div className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">
  Section Label
</div>
<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
  Section Title
</h2>
```

### Hero Gradient (page hero)

```tsx
style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 40%)' }}
```

### Gold Badge

```tsx
<span
  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20"
>
  Label
</span>
```

---

## 5. Responsive Breakpoints

| Breakpoint | Width  | Device          | Notes                          |
| ---------- | ------ | --------------- | ------------------------------ |
| `xs`       | 380px  | Small phones    | Min viable web width           |
| `sm`       | 640px  | Standard mobile | Tailwind default               |
| `md`       | 768px  | Tablet          |                                |
| `lg`       | 1024px | Laptop          |                                |
| `xl`       | 1280px | Desktop         |                                |
| `2xl`      | 1536px | Large desktop   |                                |
| `3xl`      | 1920px | TV / 1080p      | Custom in `tailwind.config.ts` |
| `4xl`      | 2560px | 4K / ultrawide  | Custom in `tailwind.config.ts` |

**Max content widths:**

```
max-w-lg     → 512px  → modals, small content
max-w-3xl    → 768px  → articles, forms
max-w-4xl    → 896px  → compass wizard
max-w-5xl    → 1024px → standard sections
max-w-6xl    → 1152px → wide sections
3xl:max-w-[1600px] → TV layout cap
```

---

## 6. Animation

### Hover Lift (cards)

```tsx
className = 'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200'
```

### Scale Up (buttons/CTAs)

```tsx
className = 'hover:scale-105 transition-all'
```

### Gold Pulse (nearby badge, active status)

```tsx
className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
style={{ background: '#C9A227' }}
```

### Slow Pulse (live indicator)

```tsx
className = 'animate-pulse-slow'
// defined: animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
```

---

## 7. Layout Rules

### Navigation Stack

```
z-50 → Global Nav (sticky top-0)  ← ALWAYS on top
z-40 → Page sub-headers (sticky top-16)
z-30 → Floating CTAs, sticky rails
z-10 → Cards, content
```

### Column Splits (Golden Ratio)

```tsx
// 61.8% / 38.2% — mission/content sections
<div className="grid md:grid-cols-[1.618fr_1fr] gap-12 items-center">

// 2:1 main/sidebar
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2"> /* main */
  <div className="lg:col-span-1"> /* sidebar */
```

### Sticky Sidebar

```tsx
<div className="sticky top-6">  // sticks below global nav
```

---

## 8. Dark Theme Only

**ALL pages use dark theme.** Background: `bg-[#0A0A0F]` or `bg-gray-950`.

✅ **Status: Complete (Session 9).** All 20+ pages converted. Zero light-bg page roots remaining. Any new page MUST use `bg-[#0A0A0F]` as its root background.

---

## 9. Design Quality Checklist (run before every commit)

- [ ] No `#FF6B35` or `orange-*` classes anywhere
- [ ] No `bg-white` or light backgrounds on pages
- [ ] All text has sufficient contrast (gold on dark = 8.9:1)
- [ ] Touch targets ≥ 44px height
- [ ] Cards use dark card pattern (not light card)
- [ ] Buttons use maroon gradient (primary) or gold outline (secondary)
- [ ] Section headers use `text-[#C9A227] uppercase tracking-widest`
- [ ] Typography uses `font-display` for headings, `font-sans` for body
- [ ] Max content width set for TV (`3xl:max-w-[1600px]`)
- [ ] No inline nav/footer in pages (global layout provides these)

---

_Last updated: Session 19 (2026-03-11) — added WCAG contrast rules, approved functional colors, phi spacing guidance_
