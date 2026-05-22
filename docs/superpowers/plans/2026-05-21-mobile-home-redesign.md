# Mobile Home Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outdated horizontal-snap mobile home with a fast, brand-coherent vertical-scroll editorial page (4 sections: Hero → Productos → Cultura → Pedir Ya).

**Architecture:** `MobileCanvas` becomes a fixed vertical-scroll container (required because `html, body { overflow: hidden }` in globals.css blocks native page scroll). `MobileEditorial` is a full rewrite with 4 sections and `next/image` for all photos. `MobilePedir` is deleted — its content is absorbed into Section 4.

**Tech Stack:** Next.js `<Image>` (next/image), inline styles, CSS `@keyframes` in globals.css, TypeScript, no Framer Motion in mobile components.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/app/globals.css` | Modify | Add `@keyframes marquee` |
| `src/components/MobileCanvas.tsx` | Rewrite | Fixed vertical-scroll wrapper, no horizontal snap |
| `src/components/MobileEditorial.tsx` | Rewrite | 4 editorial sections with next/image |
| `src/components/MobilePedir.tsx` | Delete | Content absorbed into MobileEditorial Section 4 |

---

## Task 1: Add marquee keyframe to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add `@keyframes marquee` at the end of globals.css**

Append exactly this block at the end of the file:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

- [ ] **Step 2: Verify globals.css is still valid**

Run: `npm run dev` in background, check terminal for CSS parse errors. Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(CAM): add marquee keyframe for mobile cultura section"
```

---

## Task 2: Rewrite MobileCanvas.tsx

**Files:**
- Rewrite: `src/components/MobileCanvas.tsx`

**Why `position: fixed`:** `html, body { overflow: hidden }` in globals.css blocks native page scroll. The fixed container creates its own scroll context, bypassing that rule. This is the same pattern the previous horizontal version used.

- [ ] **Step 1: Replace the entire file with this content**

```tsx
"use client";

import MobileEditorial from "@/components/MobileEditorial";

export default function MobileCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        background: "#F2E8D5",
      }}
    >
      <MobileEditorial />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run dev server, open localhost:3000 at 375px width. Expected: page renders without horizontal scroll, vertical scroll works.

- [ ] **Step 3: Commit**

```bash
git add src/components/MobileCanvas.tsx
git commit -m "feat(CAM): simplify MobileCanvas to vertical scroll"
```

---

## Task 3: Rewrite MobileEditorial.tsx

**Files:**
- Rewrite: `src/components/MobileEditorial.tsx`

This is the main task. The component has 4 sections. All product images use `<Image>` from next/image — never CSS `backgroundImage`.

- [ ] **Step 1: Replace the entire file with this content**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";

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
      <section style={{
        position: "relative",
        height: "100svh",
        background: C.cream,
        overflow: "hidden",
      }}>

        {/* SPRINGS wordmark + tagline */}
        <div style={{ position: "absolute", top: "6vh", left: "5vw", zIndex: 3 }}>
          <h1 style={{
            ...F.display,
            fontSize: "clamp(52px, 16vw, 80px)",
            color: C.tinta,
            lineHeight: 0.88,
            letterSpacing: "-0.005em",
            margin: 0,
            textTransform: "uppercase",
          }}>
            SPRINGS
          </h1>
          <div style={{
            ...F.sans,
            fontSize: "clamp(10px, 3vw, 14px)",
            color: C.tinta,
            fontStyle: "italic",
            opacity: 0.72,
            marginTop: 6,
            letterSpacing: "0.01em",
          }}>
            Jackets different by default.
          </div>
        </div>

        {/* La Fija hero image */}
        <div style={{
          position: "absolute",
          bottom: 0,
          right: "-6vw",
          width: "74vw",
          height: "68vh",
        }}>
          <Image
            src="/images/la-fija.png"
            alt="La Fija"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="74vw"
          />
        </div>

        {/* Label La Fija */}
        <div style={{ position: "absolute", left: "5vw", bottom: "28vh", zIndex: 6 }}>
          <div style={{ ...F.sans, fontSize: "0.7rem", color: C.tinta, fontStyle: "italic" }}>La Fija ↗</div>
          <div style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.15em", color: C.tinta, opacity: 0.5, marginTop: 3 }}>W25 [BGA]</div>
        </div>

        {/* Sticker Jacket Club */}
        <div style={{
          position: "absolute", right: "4vw", top: "8vh", zIndex: 20,
          background: C.burgundy, color: C.cream,
          padding: "10px 14px",
          textAlign: "center",
          border: `2px solid ${C.tinta}`,
          transform: "rotate(-8deg)",
        }}>
          <div style={{ ...F.display, fontSize: "0.9rem", letterSpacing: "0.08em", lineHeight: 1 }}>SPRINGS</div>
          <div style={{ ...F.display, fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1, marginTop: 2 }}>Jacket Club</div>
          <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.1em", marginTop: 6, lineHeight: 1.4, textTransform: "uppercase" }}>
            ESTO ES ALGO ASÍ<br />COMO QUE TE PAGAMOS<br />POR COMER SPRINGS
          </div>
          <div style={{
            marginTop: 6, background: C.tinta, color: C.cream,
            padding: "3px 10px", display: "inline-block",
            ...F.mono, fontSize: "0.5rem", letterSpacing: "0.2em",
          }}>
            ACCEDER
          </div>
        </div>

        {/* Sticker Róbala */}
        <div style={{
          position: "absolute", right: "4vw", bottom: "30vh", zIndex: 22,
          background: C.mostaza, color: C.tinta,
          padding: "10px 14px",
          border: `2px solid ${C.tinta}`,
          textAlign: "center",
          transform: "rotate(12deg)",
        }}>
          <div style={{ ...F.display, fontSize: "1.2rem", letterSpacing: "0.06em", lineHeight: 1 }}>RÓBALA</div>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.14em", marginTop: 4, lineHeight: 1.4, textTransform: "uppercase" }}>
            BONO ESCONDIDO<br />EN LA CIUDAD
          </div>
          <div style={{
            marginTop: 6, background: C.tinta, color: C.mostaza,
            padding: "2px 10px", display: "inline-block",
            ...F.mono, fontSize: "0.44rem", letterSpacing: "0.2em",
          }}>
            STORIES ↗
          </div>
        </div>

        {/* Menu strip */}
        <div style={{ position: "absolute", left: "5vw", right: "5vw", bottom: "8vh", zIndex: 6 }}>
          <div style={{
            ...F.mono, fontSize: "0.44rem", letterSpacing: "0.08em",
            color: C.tinta, opacity: 0.5, lineHeight: 1.7, textTransform: "uppercase",
          }}>
            LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA /<br />
            LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO
          </div>
        </div>

      </section>


      {/* ══ SECTION 2 — PRODUCTOS ══ */}
      <section style={{ background: C.cream, padding: "48px 0 40px" }}>

        <div style={{ padding: "0 5vw", marginBottom: 24 }}>
          <h2 style={{
            ...F.display,
            fontSize: "clamp(40px, 13vw, 64px)",
            color: C.tinta,
            margin: 0,
            letterSpacing: "-0.005em",
            textTransform: "uppercase",
          }}>
            LA CARTA
          </h2>
        </div>

        {/* Carousel */}
        <div style={{
          display: "flex",
          gap: "4vw",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: "5vw",
          paddingRight: "5vw",
        }}>
          {JACKETS.map((p) => (
            <div
              key={p.name}
              style={{ flexShrink: 0, width: "72vw", scrollSnapAlign: "start" }}
            >
              <div style={{ position: "relative", width: "100%", paddingBottom: "75%", overflow: "hidden" }}>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  sizes="72vw"
                />
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.06em", color: C.tinta }}>{p.name}</div>
                <div style={{ ...F.mono, fontSize: "0.9rem", color: C.mostaza }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "28px 5vw 0" }}>
          <Link
            href="/menu"
            style={{
              display: "block",
              textAlign: "center",
              ...F.display,
              fontSize: "1rem",
              letterSpacing: "0.1em",
              color: C.cream,
              background: C.burgundy,
              padding: "18px 24px",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            VER MENÚ COMPLETO →
          </Link>
        </div>

      </section>


      {/* ══ SECTION 3 — CULTURA ══ */}
      <section style={{ background: C.burgundy, padding: "48px 0 0", overflow: "hidden" }}>

        <div style={{ padding: "0 5vw", display: "flex", gap: "6vw", alignItems: "flex-start" }}>
          <div>
            <div style={{
              ...F.display,
              fontSize: "clamp(48px, 16vw, 80px)",
              color: C.cream,
              lineHeight: 0.88,
              letterSpacing: "-0.005em",
              textTransform: "uppercase",
            }}>
              THIS<br />IS<br />SPRINGS.
            </div>
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.mostaza, textTransform: "uppercase", marginBottom: 10 }}>
              BUCARAMANGA · BGA
            </div>
            <div style={{ ...F.sans, fontSize: "0.72rem", fontStyle: "italic", color: C.cream, opacity: 0.72, lineHeight: 1.5 }}>
              Dark kitchen.<br />Sin local físico.<br />La papa va a usted.
            </div>
          </div>
        </div>

        {/* Marquee — CSS animation only, no JS */}
        <div style={{ marginTop: 40, overflow: "hidden", borderTop: `1px solid rgba(242,232,213,0.15)`, paddingTop: 14 }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marquee 14s linear infinite",
          }}>
            <span style={{
              ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em",
              color: C.cream, opacity: 0.6, textTransform: "uppercase",
              whiteSpace: "nowrap", paddingRight: "8vw",
            }}>
              {MARQUEE}{MARQUEE}
            </span>
            <span style={{
              ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em",
              color: C.cream, opacity: 0.6, textTransform: "uppercase",
              whiteSpace: "nowrap", paddingRight: "8vw",
            }}>
              {MARQUEE}{MARQUEE}
            </span>
          </div>
        </div>

      </section>


      {/* ══ SECTION 4 — PEDIR YA ══ */}
      <section style={{
        background: C.tinta,
        padding: "48px 5vw",
        paddingBottom: "max(48px, env(safe-area-inset-bottom, 48px))",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
      }}>

        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 8 }}>
          ↗ SIN EXCUSAS · ESTO ES SPRINGS
        </div>

        <h2 style={{
          ...F.display,
          fontSize: "clamp(60px, 22vw, 110px)",
          lineHeight: 0.88,
          margin: "0 0 32px",
          letterSpacing: "-0.005em",
          textTransform: "uppercase",
          color: C.cream,
        }}>
          PEDIR<br />YA.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a
            href="#"
            style={{
              ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
              color: C.tinta, background: C.cream,
              padding: "18px 22px", textDecoration: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            RAPPI <span>→</span>
          </a>
          <a
            href="#"
            style={{
              ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
              color: C.cream, background: "transparent",
              border: `1px solid ${C.cream}`,
              padding: "18px 22px", textDecoration: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            UBER EATS <span>→</span>
          </a>
          <Link
            href="/menu"
            style={{
              ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
              color: C.mostaza, background: "transparent",
              border: `1px solid ${C.mostaza}`,
              padding: "18px 22px", textDecoration: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            PEDIDO DIRECTO <span>→</span>
          </Link>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {([
            { label: "Horario",           val: "12PM — 9PM",       sub: "Lunes a domingo" },
            { label: "Zona",              val: "BUCARAMANGA",       sub: "Cabecera · Cañaveral · Sotomayor" },
            { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · ahorra 9,900" },
          ] as const).map((item) => (
            <div key={item.label} style={{ borderTop: `1px solid rgba(242,232,213,0.12)`, paddingTop: 12 }}>
              <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
              <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.05em", color: C.cream }}>{item.val}</div>
              <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.55, marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
```

- [ ] **Step 2: Verify at 375px**

Run `npm run dev`, open `localhost:3000`. In DevTools set viewport to iPhone SE (375×667).
Expected:
- Section 1: Cream bg, SPRINGS wordmark top-left, La Fija photo bottom-right, both stickers visible, menu strip at bottom
- Section 2: "LA CARTA" header, 5 product cards swipeable, burgundy CTA button at bottom
- Section 3: Burgundy bg, "THIS IS SPRINGS." left, info right, marquee animating
- Section 4: Tinta bg, "PEDIR YA." large, 3 CTAs, info grid at bottom

- [ ] **Step 3: Commit**

```bash
git add src/components/MobileEditorial.tsx
git commit -m "feat(CAM): rewrite MobileEditorial — 4 vertical sections, next/image"
```

---

## Task 4: Delete MobilePedir.tsx and push

**Files:**
- Delete: `src/components/MobilePedir.tsx`

- [ ] **Step 1: Confirm MobilePedir is no longer imported anywhere**

Run:
```bash
grep -r "MobilePedir" src/
```
Expected output: only `src/components/MobileCanvas.tsx` (Task 2 already removed it) and possibly `src/components/MobilePedir.tsx` itself. If any other file still imports it, update that import first before deleting.

- [ ] **Step 2: Delete the file**

```bash
rm src/components/MobilePedir.tsx
```

- [ ] **Step 3: Run build to confirm no broken imports**

```bash
npm run build
```
Expected: build succeeds with no errors related to MobilePedir.

- [ ] **Step 4: Final visual check**

Open `localhost:3000` at 375px. Scroll through all 4 sections. Check:
- No console errors in DevTools
- Images load (may be large locally — on Vercel they'll be optimized)
- Marquee animates smoothly
- "VER MENÚ COMPLETO →" and "PEDIDO DIRECTO →" links work

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "feat(CAM): delete MobilePedir — content absorbed into MobileEditorial"
git push origin main
```
