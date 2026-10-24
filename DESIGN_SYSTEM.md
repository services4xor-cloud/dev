# Be[X] — Design System

> Single source of truth for visual design. If code contradicts this, fix the code.
> Be[X] uses the **4xor.com design** (4XOR Software, Aesch), so the map app and 4xor.com read as one family.
> ← [CLAUDE.md](./CLAUDE.md)

---

## 1. Colours

Defined once in `app/globals.css` (`:root`, space-separated RGB) and mapped in `tailwind.config.ts`, so opacity modifiers work (`bg-brand-accent/10`).

| Token                  | Hex                   | Tailwind                | Use                                  |
| ---------------------- | --------------------- | ----------------------- | ------------------------------------ |
| Background             | `#0f1513`             | `bg-brand-bg`           | Page                                 |
| Surface                | `#151d1a`             | `bg-brand-surface`      | Cards, panels                        |
| Surface 2 (sunk)       | `#0b100e`             | `bg-brand-surface-2`    | Inputs, nested blocks, map base      |
| Line                   | `#26302c`             | `border-brand-line`     | Borders, dividers                    |
| Text                   | `#e6ebe8`             | `text-brand-text`       | Body                                 |
| Text muted             | `#93a09a`             | `text-brand-text-muted` | Secondary text                       |
| Accent (teal)          | `#7fb8a6`             | `text-brand-accent`     | Links, focus, highlights, primary bg |
| Primary (deep teal)    | `#1d5a4b`             | `bg-brand-primary`      | User chat bubbles, strong fills      |
| Deep band              | `#17483c`             | `bg-brand-deep`         | Header, footer, feature bands        |
| Gold                   | `#d9a93f`             | `text-brand-gold`       | Selected country, 4XOR highlights    |
| On deep: accent / gold | `#b8e4d5` / `#f7d27a` | inline                  | Text on the deep band                |

Pin colours per offering kind live in `lib/pin-colors.ts` (Journey teal, Experience amber, Service mint, Automation gold).

## 2. Type

| Role    | Font              | Class          | Use                                 |
| ------- | ----------------- | -------------- | ----------------------------------- |
| Sans    | Schibsted Grotesk | `font-sans`    | Everything by default               |
| Display | Newsreader        | `font-display` | Page titles, offering titles, h1/h2 |
| Brand   | Montserrat        | `font-brand`   | The BE[X] wordmark only             |

Fonts are self-hosted via `@fontsource-variable/*` (imported in `app/layout.tsx`).

## 3. Components (in `app/globals.css`, `@layer components`)

| Class                    | What                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `.btn`                   | Outline button. Add `.btn-primary` (teal fill) or `.btn-sm`. |
| `.btn-on-deep`           | Light button on the deep green header/footer                 |
| `.card`                  | Surface card with line border, 10px radius                   |
| `.input`                 | Text input / select / textarea                               |
| `.eyebrow`               | Small accent label with a short rule before it               |
| `.nav-link` `.foot-link` | Header and footer links with the 4XOR underline              |

## 4. Layout

- **Chrome:** `components/site/SiteChrome.tsx` wraps every page. Map pages (`/`, `/map`) get a compact header and a full-height map (`h-dvh`). Content pages get `SiteHeader` + `SiteFooter`. `/4xor` and `/offline` are bare.
- **Content pages** use `components/PageShell.tsx` (`eyebrow`, `title`, `intro`, `width`). Pages never draw their own header or "back to map" link.
- **iPhone:** use `h-dvh` / `min-h-[…dvh]`, never `h-screen` or `w-screen`. `viewportFit: 'cover'` is set; pad bottom-fixed UI with `pb-[env(safe-area-inset-bottom)]`.
- **Map on phones:** bottom sheet (collapsed peek, open up to 75%). Zoom buttons are hidden under 768px (pinch to zoom).

## 5. Rules

1. Real data only. No placeholder numbers, no fake "coming soon" controls in navigation.
2. No decorative chips. Filters are plain toggle buttons with `aria-pressed`, and only show options that exist in the data.
3. Sentence case everywhere. No ALL CAPS labels except the wordmark.
4. Vocabulary from `lib/vocabulary.ts` (Explorer, Host, offering, corridor).
5. Focus is always visible (`:focus-visible` outline in the accent).

## 6. Forbidden

- The old maroon/gold palette (`#5C0A14`, `#C9A227`, `#0A0A0F`).
- Glow/"rarity"/"saiyan" effects.
- `h-screen`, `w-screen`, own page headers.
