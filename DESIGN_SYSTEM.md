# Be[Country] — Design System

> Single source of truth for visual design. If code contradicts this, fix the code.
> ← [CLAUDE.md](./CLAUDE.md) | [PRD.md](./PRD.md) · [REQUIREMENTS.md](./REQUIREMENTS.md)

---

## 1. Brand Colors

### Core Palette

| Token         | Hex       | Usage                   | Contrast on `#0A0A0F` |
| ------------- | --------- | ----------------------- | --------------------- |
| Primary       | `#5C0A14` | Buttons, hero gradients | — (background)        |
| Primary Hover | `#7A1020` | Button hover            | —                     |
| Accent        | `#C9A227` | Text, icons, borders    | 8.9:1 ✅ AAA          |
| Accent Hover  | `#D4AF37` | Gold hover              | 9.2:1 ✅              |
| Background    | `#0A0A0F` | Page background         | —                     |
| Surface       | `#111118` | Card backgrounds        | —                     |
| Surface 2     | `#1A1A25` | Nested cards, inputs    | —                     |
| Text          | `#F5F0E8` | Body text               | 14.3:1 ✅ AAA         |
| Text Muted    | `#9B8B72` | Secondary text          | 4.8:1 ✅ AA           |

### Tailwind Classes

```
bg-brand-bg           → page background
bg-brand-surface      → card background
bg-brand-primary      → maroon element
text-brand-accent     → gold text
border-brand-accent/30 → subtle gold border
```

### WCAG Contrast Rules

| Class               | Ratio  | Verdict                            |
| ------------------- | ------ | ---------------------------------- |
| `text-white`        | 19.6:1 | ✅ AAA                             |
| `text-brand-text`   | 14.3:1 | ✅ AAA                             |
| `text-brand-accent` | 8.9:1  | ✅ AAA                             |
| `text-gray-300`     | 11.1:1 | ✅ AAA                             |
| `text-gray-400`     | 7.9:1  | ✅ AAA — secondary text minimum    |
| `text-gray-500`     | 3.8:1  | ❌ FAILS — never for readable text |

**Rule:** All readable text ≥ `text-gray-400`.

### Functional Colors (exceptions)

| Use     | Class            | Notes              |
| ------- | ---------------- | ------------------ |
| Success | `text-green-400` | Checkmarks only    |
| Error   | `text-red-400`   | Error states       |
| M-Pesa  | `bg-green-600`   | M-Pesa brand green |

### NEVER Use

```
❌ #FF6B35, orange-*, amber-*, yellow-*
❌ teal-*, cyan-*, indigo-*
❌ text-gray-500 for readable text
```

---

## 2. Typography

### Fonts

```
Body:     Inter (font-sans)
Headings: Plus Jakarta Sans (font-display)
```

### Golden Ratio Scale (φ = 1.618)

| Class           | ~px | Use          |
| --------------- | --- | ------------ |
| `text-phi-xs`   | 10  | Fine print   |
| `text-phi-sm`   | 12  | Captions     |
| `text-phi-base` | 16  | Body         |
| `text-phi-lg`   | 20  | Lead text    |
| `text-phi-xl`   | 26  | H3           |
| `text-phi-2xl`  | 33  | H2           |
| `text-phi-3xl`  | 42  | H1           |
| `text-phi-4xl`  | 68  | Hero numbers |
| `text-phi-5xl`  | 110 | XL display   |

**Line heights:** `leading-phi` (1.618) body · `leading-phi-tight` (1.272) headings.

### Fluid Body Font

```css
html {
  font-size: clamp(14px, 1vw + 11px, 18px);
}
```

---

## 3. Spacing (φ Scale)

| Class     | px  | Use           |
| --------- | --- | ------------- |
| `p-phi-1` | 4   | Badge insets  |
| `p-phi-2` | 6   | Small padding |
| `p-phi-3` | 10  | Input padding |
| `p-phi-4` | 16  | Standard      |
| `p-phi-5` | 26  | Card padding  |
| `p-phi-6` | 42  | Section gap   |
| `p-phi-7` | 68  | Section py    |
| `p-phi-8` | 110 | Large section |
| `p-phi-9` | 178 | Hero padding  |

Use phi when close match exists (±4px). Standard Tailwind OK where no phi match. Never mix in same visual group.

---

## 4. Components

### Dark Card

```tsx
<div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6
                hover:border-[#C9A227]/30 transition-colors">
```

### Featured Card

```tsx
<div className="bg-[#5C0A14]/20 border border-[#C9A227]/40 rounded-2xl p-6
                hover:border-[#C9A227]/70 transition-colors">
```

### Primary Button

```tsx
<button className="btn-primary">  // or inline gradient
```

### Secondary Button

```tsx
<button className="btn-secondary"> // gold outline
```

### Section Header

```tsx
<div className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">Label</div>
<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Title</h2>
```

### Hero Gradient

```tsx
style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 40%)' }}
```

---

## 5. Responsive

| Breakpoint | Width  | Device      |
| ---------- | ------ | ----------- |
| `xs`       | 380px  | Small phone |
| `sm`       | 640px  | Mobile      |
| `md`       | 768px  | Tablet      |
| `lg`       | 1024px | Laptop      |
| `xl`       | 1280px | Desktop     |
| `2xl`      | 1536px | Large       |
| `3xl`      | 1920px | TV / 1080p  |
| `4xl`      | 2560px | 4K          |

TV cap: `3xl:max-w-[1600px]`

---

## 6. Animation

- **Cards:** `hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`
- **Buttons:** `hover:scale-105 transition-all`
- **Pulse:** `animate-pulse-slow` (3s cubic-bezier)

---

## 7. Layout

```
z-50 → Nav (sticky top-0)
z-40 → Sub-headers (sticky top-16)
z-30 → Floating CTAs
z-10 → Cards
```

Golden ratio splits: `grid md:grid-cols-[1.618fr_1fr]`

---

## 8. Rules

- ALL pages: dark theme (`bg-[#0A0A0F]`)
- ALL design decisions: reference this doc
- Touch targets ≥ 44px
- No inline nav/footer (layout provides)

---

_Last updated: Session 20 (2026-03-11)_
