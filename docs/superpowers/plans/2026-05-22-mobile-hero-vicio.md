# Mobile Hero Section — Rediseño estilo Vicio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir Section 1 (hero) del mobile editorial usando la arquitectura de vicio.com: GSAP (timeline + Draggable + InertiaPlugin), sticker wrapper pattern, vh-based sizing, mix-blend-mode: difference.

**Architecture:** Dos capas: contenido (z-index 1-10) con 10 elementos posicionados absolutamente en vh, y sticker wrapper (z-index 500) con pointer-events: none y 2 stickers GSAP Draggable. Entrada coreografiada con GSAP timeline (easings per-element). Sections 2-4 intactas.

**Tech Stack:** Next.js 16, GSAP (core + ScrollTrigger + Draggable + InertiaPlugin), @gsap/react, Framer Motion (se mantiene para UI), Lenis (se mantiene).

---

## File Structure

### New files
- `src/components/HeroSection.tsx` — Hero completo: 12 elementos posicionados + GSAP timeline de entrada + globo giratorio. Reemplaza Section 1 de MobileEditorial.
- `src/components/StickerLayer.tsx` — Wrapper de stickers con init de GSAP Draggable. Recibe children, aplica pointer-events pattern.

### Modified files
- `package.json` — Agregar `gsap`, `@gsap/react`. Eliminar `@use-gesture/react`.
- `src/app/globals.css` — Text rendering (optimizeLegibility, antialiased, subpixel trick).
- `src/components/MobileEditorial.tsx` — Reemplazar Section 1 inline por `<HeroSection />`. Eliminar imports de DragSticker y SensitiveImage (se mueven al hero).

### Unchanged files
- `src/components/DragSticker.tsx` — Se mantiene (no se usa en hero, pero puede usarse en otros lugares).
- `src/components/SensitiveImage.tsx` — Se mantiene tal cual, importado dentro de HeroSection.
- `src/components/MobileCanvas.tsx` — Sin cambio.
- `src/app/mobile-editor/page.tsx` — Sin cambio (usa @use-gesture pero es herramienta dev, no producción).

---

### Task 1: Install GSAP and update dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install gsap and @gsap/react**

```bash
npm install gsap @gsap/react
```

- [ ] **Step 2: Verify installation**

```bash
node -e "const g = require('gsap'); console.log('GSAP version:', g.gsap.version)"
```

Expected: `GSAP version: 3.x.x`

- [ ] **Step 3: Verify build still passes**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds with all routes.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(CAM): install gsap + @gsap/react for hero animations"
```

---

### Task 2: Add text rendering optimizations to globals.css

**Files:**
- Modify: `src/app/globals.css:29-39`

- [ ] **Step 1: Add text rendering properties to html,body rule**

In `src/app/globals.css`, find the existing `html, body` rule and add text rendering optimizations. The current rule is:

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  background: var(--cream);
  color: var(--tinta);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

Replace with:

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  background: var(--cream);
  color: var(--tinta);
  font-family: var(--font-sans), system-ui, sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-shadow: rgba(0,0,0,.01) 0 0 1px;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(CAM): add text rendering optimizations from Vicio"
```

---

### Task 3: Create StickerLayer component

**Files:**
- Create: `src/components/StickerLayer.tsx`

- [ ] **Step 1: Create the StickerLayer component**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface StickerLayerProps {
  children: ReactNode;
  boundsRef: React.RefObject<HTMLElement | null>;
}

export default function StickerLayer({ children, boundsRef }: StickerLayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrapperRef.current || !boundsRef.current) return;

    const stickers = wrapperRef.current.querySelectorAll(".draggable-sticker");

    stickers.forEach((el) => {
      Draggable.create(el, {
        type: "x,y",
        edgeResistance: 0.85,
        bounds: boundsRef.current!,
        inertia: true,
        zIndexBoost: false,
        onPress() {
          gsap.to(el, { scale: 1.05, duration: 0.15 });
        },
        onRelease() {
          gsap.to(el, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
        },
      });
    });
  }, { scope: wrapperRef, dependencies: [] });

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 500,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds (component not mounted yet).

- [ ] **Step 3: Commit**

```bash
git add src/components/StickerLayer.tsx
git commit -m "feat(CAM): add StickerLayer with GSAP Draggable + InertiaPlugin"
```

---

### Task 4: Create HeroSection component

**Files:**
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: Create the HeroSection component with all 12 elements + GSAP timeline**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StickerLayer from "@/components/StickerLayer";
import SensitiveImage from "@/components/SensitiveImage";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" } as const,
  sans: { fontFamily: "Inter, sans-serif" } as const,
  mono: { fontFamily: "JetBrains Mono, monospace" } as const,
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".hero-wordmark", { opacity: 0, y: 30, duration: 0.6, ease: "back.out(1.7)" })
      .from(".hero-potato", { opacity: 0, scale: 0.95, duration: 0.5 }, "-=0.3")
      .from(".hero-location", { opacity: 0, y: 15, duration: 0.4 }, "-=0.2")
      .from(".hero-globe", { opacity: 0, scale: 0.8, duration: 0.4 }, "-=0.15")
      .from(".hero-label", { opacity: 0, x: -20, duration: 0.4 }, "-=0.1")
      .from(".hero-subtitle", { opacity: 0, y: 15, rotation: -12, duration: 0.5, ease: "back.out(1.4)" }, "-=0.1")
      .from(".hero-underline", { opacity: 0, scaleX: 0, duration: 0.3 }, "-=0.1")
      .from(".hero-sensitive", { opacity: 0, scale: 0.9, duration: 0.4 }, "-=0.1")
      .from(".hero-marquee", { opacity: 0, y: 10, duration: 0.3 }, "-=0.05")
      .from(".hero-gallery-strip", { opacity: 0, y: 10, duration: 0.3 }, "-=0.05")
      .from(".sticker-dados", { opacity: 0, scale: 0.5, rotation: 15, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
      .from(".sticker-jc", { opacity: 0, scale: 0.5, rotation: -10, duration: 0.5, ease: "back.out(2)" }, "-=0.3");

    // Globe spin (continuous)
    gsap.to(".hero-globe-inner", {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        position: "relative",
        height: "100vh",
        background: C.cream,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >

      {/* ── SPRINGS wordmark ── */}
      <h1
        className="hero-wordmark"
        style={{
          position: "absolute",
          left: "2vh",
          top: "8vh",
          zIndex: 3,
          ...F.display,
          fontSize: "11vh",
          color: "white",
          mixBlendMode: "difference",
          lineHeight: 0.88,
          letterSpacing: "-0.01em",
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        SPRINGS
      </h1>

      {/* ── Papa (La Fija) ── */}
      <div
        className="hero-potato"
        style={{
          position: "absolute",
          right: "-2vh",
          top: 0,
          width: "45vh",
          height: "55vh",
          zIndex: 4,
        }}
      >
        <Image
          src="/images/la-fija.png"
          alt="La Fija — Springs Jacket"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="(max-width: 768px) 60vw, 45vh"
        />
      </div>

      {/* ── Location ── */}
      <div
        className="hero-location"
        style={{
          position: "absolute",
          left: "2vh",
          top: "20vh",
          zIndex: 5,
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        <span style={{ ...F.mono, fontSize: "0.78rem", color: C.tinta, opacity: 0.5, lineHeight: 1 }}>
          ⊕
        </span>
        <div
          style={{
            ...F.mono,
            fontSize: "0.46rem",
            letterSpacing: "0.18em",
            color: C.tinta,
            lineHeight: 1.6,
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          Barbosa STDR – COLOMBIA<br />EST. 2025
        </div>
      </div>

      {/* ── Globe ── */}
      <div
        className="hero-globe"
        style={{
          position: "absolute",
          left: "2vh",
          top: "28vh",
          zIndex: 5,
          width: "7vh",
          height: "7vh",
          background: "rgba(26,10,12,0.88)",
          border: "1px solid rgba(242,232,213,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(242,232,213,0.45)"
          strokeWidth="1.2"
          width="55%"
          height="55%"
        >
          <circle cx="12" cy="12" r="10" />
          <g className="hero-globe-inner" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </g>
        </svg>
      </div>

      {/* ── Label ── */}
      <div
        className="hero-label"
        style={{
          position: "absolute",
          left: "2vh",
          top: "52vh",
          zIndex: 5,
        }}
      >
        <div
          style={{
            ...F.display,
            fontSize: "2.2vh",
            color: C.tinta,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
            <svg width="0.72em" height="0.72em" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <line x1="3" y1="21" x2="21" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" />
              <polyline points="13,3 21,3 21,11" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Jacket
          </div>
          <div style={{ paddingLeft: "calc(0.72em + 0.3em)" }}>La Fija</div>
        </div>
      </div>

      {/* ── Subtitle ── */}
      <div
        className="hero-subtitle"
        style={{
          position: "absolute",
          left: "20vh",
          top: "55vh",
          zIndex: 5,
          transform: "rotate(-8deg)",
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-marker), cursive",
            fontSize: "2.4vh",
            color: C.burgundy,
            lineHeight: 1,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          JACKETS DIFFERENT BY DEFAULT
        </div>
      </div>

      {/* ── Underline stroke ── */}
      <div
        className="hero-underline"
        style={{
          position: "absolute",
          left: "30vh",
          top: "62vh",
          width: "25vh",
          zIndex: 5,
          transform: "rotate(-2deg)",
          transformOrigin: "left center",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "1.4vh" }}>
          <Image
            src="/images/underline-stroke.png"
            alt=""
            fill
            style={{ objectFit: "contain", objectPosition: "left center" }}
            sizes="25vh"
          />
        </div>
      </div>

      {/* ── SensitiveImage ── */}
      <div
        className="hero-sensitive"
        style={{
          position: "absolute",
          left: "25vh",
          top: "64vh",
          width: "22vh",
          aspectRatio: "1402 / 1122",
          zIndex: 8,
        }}
      >
        <SensitiveImage src="/images/sensitive-hero.png" fontSize={3.2} opacity={65} />
      </div>

      {/* ── Marquee tape ── */}
      <div
        className="hero-marquee"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "80vh",
          overflow: "hidden",
          zIndex: 6,
          borderTop: `1.5px solid ${C.tinta}`,
          borderBottom: `1.5px solid ${C.tinta}`,
          padding: "5px 0",
          background: C.cream,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            animation: "marquee 18s linear infinite",
          }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: "2.2vh", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "1.8vh", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                  <span style={{ ...F.display, fontSize: "2.2vh", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "1.8vh", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── ART GALLERY strip ── */}
      <div
        className="hero-gallery-strip"
        style={{
          position: "absolute",
          left: "2vh",
          right: "2vh",
          top: "88vh",
          zIndex: 5,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2vh",
        }}
      >
        <Link
          href="/art-gallery"
          style={{
            ...F.display,
            fontSize: "1.8vh",
            color: C.tinta,
            letterSpacing: "-0.025em",
            textDecoration: "none",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ART GALLERY
        </Link>
        <p
          style={{
            ...F.mono,
            fontSize: "0.9vh",
            color: C.tinta,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            textTransform: "uppercase",
            margin: 0,
            opacity: 0.65,
            textAlign: "right",
          }}
        >
          LA FIJA / LA PESADA / LA BRAVA /<br />
          LA SIMPLE / LA HONESTA
        </p>
      </div>

      {/* ── STICKER LAYER ── */}
      <StickerLayer boundsRef={sectionRef}>

        {/* Dados sticker */}
        <div
          className="draggable-sticker sticker-dados"
          style={{
            position: "absolute",
            left: "1vh",
            top: "35vh",
            width: "18vh",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/prueba-tu-suerte" style={{ display: "block" }}>
            <Image
              src="/images/miercoles-dados-sticker.png"
              alt="Miércoles de Dados"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="18vh"
            />
          </Link>
        </div>

        {/* JC sticker */}
        <div
          className="draggable-sticker sticker-jc"
          style={{
            position: "absolute",
            left: "2vh",
            top: "60vh",
            width: "16vh",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/springs-jacket-club" style={{ display: "block" }}>
            <Image
              src="/images/jacket-club-sticker.png"
              alt="SPRINGS Jacket Club"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="16vh"
            />
          </Link>
        </div>

      </StickerLayer>

    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds (component not mounted yet).

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat(CAM): add HeroSection with GSAP timeline + vh positioning + mix-blend-mode"
```

---

### Task 5: Integrate HeroSection into MobileEditorial

**Files:**
- Modify: `src/components/MobileEditorial.tsx:1-397`

- [ ] **Step 1: Replace Section 1 with HeroSection**

Replace the entire Section 1 block (lines 35-397 of MobileEditorial.tsx) with `<HeroSection />` and update imports.

The new file should look like this at the top:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans:    { fontFamily: "Inter, sans-serif" },
  mono:    { fontFamily: "JetBrains Mono, monospace" },
};

const JACKETS = [
  { name: "LA FIJA",    price: "32,900", image: "/images/la-fija.png" },
  { name: "LA PESADA",  price: "35,900", image: "/images/la-pesada.png" },
  { name: "LA BRAVA",   price: "34,900", image: "/images/la-brava.png" },
  { name: "LA SIMPLE",  price: "28,900", image: "/images/la-simple.png" },
  { name: "LA HONESTA", price: "28,900", image: "/images/la-honesta.png" },
];

const MARQUEE = "FAST, GOOD & LOUD · ESTO ES SPRINGS · ";

export default function MobileEditorial() {
  return (
    <div>

      {/* ══ SECTION 1 — HERO ══ */}
      <HeroSection />


      {/* ══ SECTION 2 — ART GALLERY (productos) ══ */}
      {/* ... rest of sections 2-4 unchanged ... */}
```

Remove imports of `DragSticker` and `SensitiveImage` from MobileEditorial (they are now imported inside HeroSection).

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds. All routes render.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | head -20
```

Open `http://localhost:3000` in mobile simulator (375px width). Verify:
- Hero renders with all 12 elements
- SPRINGS wordmark uses mix-blend-mode: difference
- Stickers are draggable
- Entrance animation plays on load
- Sections 2-4 render unchanged below the hero

- [ ] **Step 4: Commit**

```bash
git add src/components/MobileEditorial.tsx
git commit -m "feat(CAM): integrate HeroSection into MobileEditorial, replace Section 1"
```

---

### Task 6: Remove @use-gesture/react dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Check no production code uses @use-gesture**

```bash
grep -r "@use-gesture" src/ --include="*.tsx" --include="*.ts" -l
```

Expected: No files found (only `src/app/mobile-editor/page.tsx` which is a dev tool, not production).

- [ ] **Step 2: Uninstall the package**

```bash
npm uninstall @use-gesture/react
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds. If mobile-editor fails, that page can be updated separately (it's a dev tool, not production).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "refactor(CAM): remove @use-gesture/react — replaced by GSAP Draggable"
```

---

### Task 7: Final verification and push

**Files:**
- None (verification only)

- [ ] **Step 1: Full build check**

```bash
npm run build 2>&1 | tail -20
```

Expected: All routes build successfully. No TypeScript errors.

- [ ] **Step 2: Visual checklist**

Open `http://localhost:3000` in mobile viewport (375x812). Verify each item:

1. SPRINGS wordmark renders with mix-blend-mode: difference (appears dark on cream, inverts on potato)
2. Papa (La Fija) image loads with priority, covers right side
3. ⊕ Location text visible
4. Globe renders with spinning inner ellipse
5. Dados sticker is draggable with momentum (flick and release — it should continue moving then decelerate)
6. JC sticker is draggable with same physics
7. Stickers have scale feedback (grows on press, elastic snap on release)
8. Label ↗ Jacket / La Fija visible
9. JACKETS DIFFERENT BY DEFAULT text rotated
10. Underline stroke image visible
11. SensitiveImage blur overlay works (tap to reveal)
12. Marquee tape scrolls infinitely
13. ART GALLERY strip at bottom with product names
14. Entrance animation plays: elements stagger in with different easings
15. Sections 2-4 render correctly below hero (no regression)
16. Text rendering appears crisp (antialiased)

- [ ] **Step 3: Push**

```bash
git pull origin main --no-rebase && git push origin main
```

---

## Self-Review

### Spec coverage check
- [x] GSAP stack installation — Task 1
- [x] Text rendering optimizations — Task 2
- [x] Sticker wrapper pattern (pointer-events, z-index 500) — Task 3
- [x] GSAP Draggable config (edgeResistance 0.85, InertiaPlugin, zIndexBoost false) — Task 3
- [x] HeroSection with 12 elements in vh units — Task 4
- [x] GSAP timeline entrance with per-element easings — Task 4
- [x] Globe spin via GSAP — Task 4
- [x] mix-blend-mode: difference on wordmark — Task 4
- [x] isolation: isolate on hero section — Task 4
- [x] Marquee CSS animation (no GSAP) — Task 4
- [x] Only 1 image with priority (papa) — Task 4
- [x] Z-index 3 capas: content (1-10), stickers (500), nav (999) — Tasks 3+4
- [x] Integration into MobileEditorial — Task 5
- [x] Remove @use-gesture/react — Task 6
- [x] Sections 2-4 unchanged — Task 5
- [x] SensitiveImage maintained as-is — Task 4

### Placeholder scan
No TBDs, TODOs, or "implement later" found. All code blocks contain complete implementation.

### Type consistency
- `StickerLayerProps.boundsRef` is `React.RefObject<HTMLElement | null>` — matches `sectionRef` in HeroSection (useRef<HTMLElement>)
- `F` and `C` constants defined identically in both HeroSection and MobileEditorial
- Class names (`.hero-wordmark`, `.draggable-sticker`, etc.) consistent between HeroSection JSX and GSAP selectors
