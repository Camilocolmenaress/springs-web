# Springs Mobile Home — Redesign Spec
**Date:** 2026-05-21  
**Status:** Approved  
**Scope:** Rewrite mobile home page (Opción A — Editorial vertical)

---

## Problem

The current mobile home has three issues:
1. `MobileEditorial.tsx` is a stale, manually-maintained component that diverged from the desktop design. It shows outdated copy, old layout, and different visual identity.
2. All product images are loaded as CSS `backgroundImage` (7–9 MB PNGs, no optimization). On mobile this means downloading 20–40 MB uncompressed.
3. All desktop hooks (`useTransform`, `useMotionValue`, `useSpring`, `useDesignConfig`, Lenis) run on mobile too, adding unnecessary computation.

---

## Goal

A fast, editorially coherent mobile home page that:
- Reflects the current Springs visual identity (same elements as desktop)
- Loads in under 2 seconds on a 4G connection
- Has zero console errors
- Scrolls vertically (no horizontal snap)

---

## Architecture

### Files changed

| File | Change |
|------|--------|
| `src/components/MobileCanvas.tsx` | Simplify: remove horizontal snap scroll, render MobileEditorial in a normal vertical scroll div |
| `src/components/MobileEditorial.tsx` | Full rewrite: 4 vertical sections |
| `src/components/MobilePedir.tsx` | Delete: content absorbed into MobileEditorial Section 4 |

### Files untouched
- `src/app/page.tsx` — guard at line 380 (`if (isDesktop !== true) return <MobileCanvas />`) stays as-is
- Desktop canvas, DevPanel, useDesignConfig — untouched

### Performance rules
- All product/hero images use `<Image>` from `next/image` (never `backgroundImage` for content images)
- Hero image: `priority={true}`, `sizes="100vw"`
- Carousel product images: `priority={false}`, `sizes="72vw"`
- Culture section images (if any): `sizes="50vw"`
- Marquee animation: CSS `@keyframes` only, no Framer Motion
- No `useDesignConfig`, no Lenis, no motion values in mobile components

---

## Sections

### Section 1 — Hero (height: 100svh)
- Background: `#F2E8D5` (cream)
- **SPRINGS wordmark**: Anton, `~18vw`, `#1A0A0C` (tinta), top-left, uppercase
- **Hero image**: `<Image>` of `/images/la-fija.png`, positioned bottom-right, `object-fit: cover`, covers ~65% of viewport height
- **Tagline**: "JACKETS DIFFERENT BY DEFAULT" — Inter italic, `~3.2vw` clamped, `#1A0A0C`, 72% opacity, below wordmark
- **Sticker Jacket Club**: Static div, burgundy bg, cream text, Anton + mono copy, `rotate(-8deg)`, top-right
- **Sticker Róbala**: Static div, mostaza bg, tinta text, Anton + mono copy, `rotate(12deg)`, bottom-right above footer
- **Label La Fija**: `"La Fija ↗"` Inter italic 0.7rem + `"W25 [BGA]"` mono 0.52rem, over the image, bottom-left of image area
- **Menu strip**: Mono 0.48rem, tinta 50% opacity, all product names separated by ` / `, fixed at bottom

### Section 2 — Productos highlight (height: auto)
- Background: `#F2E8D5` (cream)
- **Section header**: "LA CARTA" — Anton, large, tinta
- **Carousel**: `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scrollbar-width: none`
  - Cards: `72vw` wide, `scroll-snap-align: start`, `4vw` gap
  - Each card: `<Image>` product photo (full card width), product name (Anton, tinta), price (JetBrains Mono, mostaza)
  - Products shown: La Fija, La Pesada, La Brava, La Simple, La Honesta (the 5 Jackets)
- **CTA**: `"VER MENÚ COMPLETO →"` — Anton, links to `/menu`, full-width button, burgundy bg, cream text

### Section 3 — Cultura (height: auto)
- Background: `#6B1419` (burgundy)
- **Left block**: "THIS IS" + "SPRINGS" — Anton, large, cream, stacked
- **Right text**: "Dark kitchen. Solo delivery. Bucaramanga." — Inter italic, cream 70%
- **Marquee strip** at bottom: `"FAST, GOOD & LOUD · "` repeated — CSS `@keyframes` animation, mono, cream, 60% opacity
- No Framer Motion, no JS animation

### Section 4 — Pedir Ya (height: auto, min-height: 70vh)
- Background: `#1A0A0C` (tinta)
- **Headline**: "PEDIR YA." — Anton, `clamp(60px, 22vw, 110px)`, cream
- **Tagline**: `"↗ SIN EXCUSAS · ESTO ES SPRINGS"` — mono, mostaza
- **CTAs** (stacked, full-width):
  - RAPPI → `href="#"` — cream bg, tinta text, Anton
  - UBER EATS → `href="#"` — outline cream, cream text, Anton
  - PEDIDO DIRECTO → `href="/menu"` — outline mostaza, mostaza text, Anton
- **Info grid** at bottom: Horario / Zona / Combo recomendado — mono labels (mostaza), Anton values (cream), Inter sub (cream 55%)

---

## Brand Constraints (non-negotiable)
- Colors: only `#6B1419`, `#F2E8D5`, `#1A0A0C`, `#C5871F`
- Fonts: Anton (`font-display`), Inter (`font-sans`), JetBrains Mono (`font-mono`)
- Zero border-radius, zero emojis, zero gradients
- Copy: "usted" form, no "premium/gourmet/lujo/exclusivo"
- All CTAs in uppercase: "VER MENÚ COMPLETO", "PEDIR YA"

---

## Out of Scope
- Menu page mobile (separate concern)
- Cart/ordering logic on home
- DevPanel / design config system for mobile
- Any changes to desktop page.tsx
