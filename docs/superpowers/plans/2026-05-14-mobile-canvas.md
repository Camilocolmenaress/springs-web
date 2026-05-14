# Mobile Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar el canvas horizontal en mobile (`<1024px`) reproduciendo 1:1 las zonas editoriales del desktop (zonas 1, 2, 3) vía `transform: scale`, más una zona 4 (PEDIR YA) rediseñada mobile-friendly. El desktop queda intacto.

**Architecture:** Tres componentes nuevos. `MobileCanvas` envuelve Lenis + un flex container con dos paneles. `MobileEditorial` (zonas 1-3) reproduce el desktop comprimido con scale = viewport/1440. `MobilePedir` (zona 4) se reescribe nativo mobile. `page.tsx` switchea desktop ↔ MobileCanvas según viewport. `MobileHome.tsx` queda obsoleto y se elimina.

**Tech Stack:** Next.js 16, React, TypeScript, Lenis (horizontal scroll), Framer Motion (drag + reveal), Tailwind v4. Playwright para verificación visual.

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/components/MobilePedir.tsx` | Crear | Panel zona 4 mobile-first (CTAs, info, volver) |
| `src/components/MobileEditorial.tsx` | Crear | Panel zonas 1-3 copia desktop con scale + vw→px |
| `src/components/MobileCanvas.tsx` | Crear | Wrapper Lenis horizontal + flex(editorial, pedir) |
| `src/app/page.tsx` | Modificar | Swap import `MobileHome` → `MobileCanvas` |
| `src/components/MobileHome.tsx` | Borrar | Reemplazado |
| `docs/superpowers/specs/2026-05-14-mobile-canvas-design.md` | (existente) | Spec aprobado |

---

## Task 1: MobilePedir — Panel zona 4 mobile-friendly

**Files:**
- Create: `src/components/MobilePedir.tsx`
- Test: visual (Playwright 390×844)

- [ ] **Step 1: Crear el archivo con el componente completo**

```tsx
"use client";

import Link from "next/link";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans: { fontFamily: "Inter, sans-serif" },
  mono: { fontFamily: "JetBrains Mono, monospace" },
};

type Props = {
  onBack?: () => void;
};

export default function MobilePedir({ onBack }: Props) {
  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        background: C.burgundy,
        color: C.cream,
        display: "flex",
        flexDirection: "column",
        padding: "max(20px, env(safe-area-inset-top, 20px)) 24px max(20px, env(safe-area-inset-bottom, 20px))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: `1px solid ${C.cream}`,
          color: C.cream,
          padding: "8px 14px",
          ...F.mono,
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        ← VOLVER
      </button>

      <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginTop: 18 }}>
        ↗ SIN EXCUSAS · ESTO ES SPRINGS
      </div>

      <h2
        style={{
          ...F.display,
          fontSize: "clamp(60px, 22vw, 110px)",
          lineHeight: 0.88,
          margin: "10px 0 0",
          letterSpacing: "-0.005em",
          textTransform: "uppercase",
          color: C.cream,
        }}
      >
        PEDIR<br />YA.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
        <a
          href="#"
          style={{
            ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
            color: C.tinta, background: C.cream,
            padding: "18px 22px", textDecoration: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            minHeight: 56,
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
            minHeight: 56,
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
            minHeight: 56,
          }}
        >
          PEDIDO DIRECTO <span>→</span>
        </Link>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Horario", val: "12PM — 9PM", sub: "Lunes a domingo" },
          { label: "Zona", val: "BUCARAMANGA", sub: "Cabecera · Cañaveral · Sotomayor" },
          { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · ahorrás 9,900" },
        ].map((i) => (
          <div key={i.label} style={{ borderTop: `1px solid rgba(242,232,213,0.15)`, paddingTop: 10 }}>
            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 2 }}>{i.label}</div>
            <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.05em", color: C.cream }}>{i.val}</div>
            <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.55, marginTop: 1 }}>{i.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar TypeScript compila**

Run: `npx tsc --noEmit`
Expected: no output (no errors).

- [ ] **Step 3: Commit task**

```bash
git add src/components/MobilePedir.tsx
git commit -m "feat(JD): MobilePedir panel mobile-first zona 4"
```

---

## Task 2: MobileEditorial — Panel zonas 1-3 escaladas 1:1

**Files:**
- Create: `src/components/MobileEditorial.tsx`
- Reference: `src/app/page.tsx:131-540` (zonas 1, 2, 3 a copiar)

**Conversión vw/vh → px** (tabla para reemplazar mientras se copia):

| Valor original | Reemplazo |
|---|---|
| `1vw` | `14.4px` |
| `1vh` | `9px` |
| `Nvw` | `(N * 14.4)px` |
| `Nvh` | `(N * 9)px` |
| `clamp(140px, 22vw, 380px)` | `316.8px` (= 22 × 14.4) |
| `clamp(80px, 14vw, 220px)` | `201.6px` |
| `clamp(100px, 16vw, 280px)` | `230.4px` |
| `clamp(60px, 7vw, 130px)` | `100.8px` |
| `clamp(40px, 5vw, 100px)` | `72px` |
| `clamp(40px, 5vw, 96px)` | `72px` |
| `clamp(28px, 3vw, 48px)` | `43.2px` |
| `clamp(34px, 3.4vw, 42px)` | `42px` |

- [ ] **Step 1: Crear el archivo con estructura base y constantes**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import DragSticker from "@/components/DragSticker";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans: { fontFamily: "Inter, sans-serif" },
  mono: { fontFamily: "JetBrains Mono, monospace" },
};

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

type Props = {
  pauseScroll?: () => void;
  resumeScroll?: () => void;
};

export default function MobileEditorial({ pauseScroll, resumeScroll }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: 4320, // 3 × 1440
        height: 900,
        flexShrink: 0,
        transformOrigin: "0 0",
      }}
    >
      {/* Zonas 1, 2, 3 vienen aquí en los siguientes steps */}
    </div>
  );
}
```

Nota: el `transform: scale(...)` se aplica desde fuera (MobileCanvas lo wrappea). Este componente vive en su mundo lógico 1440×900 × 3.

- [ ] **Step 2: Copiar zona 1 (Hero) desde page.tsx con conversión vw→px**

Copiar el bloque entre comentario `ZONA 1 — HERO (0 → 100vw)` y `ZONA 2 — JACKETS GRID` (líneas ~123-294 de `page.tsx`), pegarlo dentro del `<div>` raíz del componente, reemplazando los valores según la tabla.

Ejemplo de conversión a aplicar:

Original:
```tsx
<div style={{
  position: "absolute", left: "-4vw", top: "8vh",
  width: "44vw", height: "84vh",
  ...
}}>
```

Convertido:
```tsx
<div style={{
  position: "absolute", left: "-57.6px", top: "72px",
  width: "633.6px", height: "756px",
  ...
}}>
```

Para los `clamp(...)`, reemplazar la fracción `vw`/`vh` por el px equivalente (ver tabla). Los `rem`/`em`/`px` quedan iguales.

Mantener los `<DragSticker pauseScroll={pauseScroll} resumeScroll={resumeScroll}>` con sus props pasadas como prop.

**IMPORTANTE:** Los `<DragSticker onDragStart={pauseScroll} onDragEnd={resumeScroll}>` deben recibir las funciones desde props, no usar variables locales.

- [ ] **Step 3: Copiar zona 2 (Jackets grid) con conversión**

Líneas ~296-401 de `page.tsx`, dentro del mismo `<div>` raíz. Mantener offsets originales: la zona 2 arranca en `left: 100vw` desktop → en este componente lógico será `left: 1440px` ABS, o equivalente `left: (100 × 14.4)px = 1440px`.

NOTA: las zonas 2 y 3 desktop usan `left: 108vw`, `left: 131vw`, etc. — esos vw son sobre el viewport del desktop. En el mundo lógico 4320, `108vw` → `1555.2px`, etc. Aplicar tabla.

- [ ] **Step 4: Copiar zona 3 (About / Loaded) con conversión**

Líneas ~403-540 de `page.tsx`. Zona 3 arranca en `left: 220vw` desktop → en este componente `left: 3168px`. Aplicar tabla.

- [ ] **Step 5: Verificar TypeScript compila**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 6: Commit task**

```bash
git add src/components/MobileEditorial.tsx
git commit -m "feat(JD): MobileEditorial copia zonas 1-3 con vw->px"
```

---

## Task 3: MobileCanvas — Wrapper Lenis + flex con scale

**Files:**
- Create: `src/components/MobileCanvas.tsx`

- [ ] **Step 1: Crear archivo con la estructura del canvas mobile**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import MobileEditorial from "@/components/MobileEditorial";
import MobilePedir from "@/components/MobilePedir";

const DESIGN_W = 1440;
const DESIGN_H = 900;

export default function MobileCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [viewportW, setViewportW] = useState<number>(0);
  const [viewportH, setViewportH] = useState<number>(0);

  const pauseScroll = () => lenisRef.current?.stop();
  const resumeScroll = () => lenisRef.current?.start();

  // Medir viewport y actualizar al rotar
  useEffect(() => {
    const measure = () => {
      setViewportW(window.innerWidth);
      setViewportH(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Desbloquear body overflow para que Lenis pueda controlar el scroll
  useEffect(() => {
    const prevBody = document.body.style.cssText;
    const prevHtml = document.documentElement.style.cssText;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    return () => {
      document.body.style.cssText = prevBody;
      document.documentElement.style.cssText = prevHtml;
    };
  }, []);

  // Inicializar Lenis horizontal
  useEffect(() => {
    if (!viewportW) return;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [viewportW]);

  const scrollToStart = () => {
    lenisRef.current?.scrollTo(0, { duration: 1.6 });
  };

  if (!viewportW) {
    return <div style={{ width: "100vw", height: "100vh", background: "#F2E8D5" }} />;
  }

  const scale = viewportW / DESIGN_W;
  const editorialWidth = 3 * DESIGN_W * scale; // visual width tras escalar
  const editorialHeight = DESIGN_H * scale;
  const verticalPad = Math.max(0, (viewportH - editorialHeight) / 2);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--cream)",
        position: "relative",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "100vh",
          width: editorialWidth + viewportW, // editorial + pedir
        }}
      >
        {/* Letterbox vertical para editorial */}
        <div
          style={{
            flexShrink: 0,
            width: editorialWidth,
            height: "100vh",
            position: "relative",
            background: "var(--cream)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: verticalPad,
              left: 0,
              width: editorialWidth,
              height: editorialHeight,
            }}
          >
            <div
              style={{
                width: 3 * DESIGN_W,
                height: DESIGN_H,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              <MobileEditorial pauseScroll={pauseScroll} resumeScroll={resumeScroll} />
            </div>
          </div>
        </div>

        <MobilePedir onBack={scrollToStart} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar TypeScript compila**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 3: Commit task**

```bash
git add src/components/MobileCanvas.tsx
git commit -m "feat(JD): MobileCanvas wrapper Lenis + scale + flex(editorial,pedir)"
```

---

## Task 4: Wire en page.tsx + borrar MobileHome

**Files:**
- Modify: `src/app/page.tsx` (swap import)
- Delete: `src/components/MobileHome.tsx`

- [ ] **Step 1: Swap el import en page.tsx**

Editar `src/app/page.tsx`:

Reemplazar:
```tsx
import MobileHome from "@/components/MobileHome";
```
Por:
```tsx
import MobileCanvas from "@/components/MobileCanvas";
```

Y reemplazar la línea del render:
```tsx
if (isDesktop !== true) {
  return <MobileHome />;
}
```
Por:
```tsx
if (isDesktop !== true) {
  return <MobileCanvas />;
}
```

- [ ] **Step 2: Borrar el archivo MobileHome.tsx**

```bash
git rm src/components/MobileHome.tsx
```

- [ ] **Step 3: Verificar TypeScript compila**

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Commit task**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): swap MobileHome -> MobileCanvas en home"
```

---

## Task 5: Verificación visual + cross-viewport

**Files:**
- Test: Playwright en `localhost:3000/` a 3 viewports

- [ ] **Step 1: Verificar dev server vivo**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

- [ ] **Step 2: Visual check mobile portrait (iPhone)**

Vía Playwright MCP:
- Resize a `390 × 844`
- Navegar a `http://localhost:3000/`
- Esperar 2s
- Screenshot

Verificar visualmente:
- ✓ Editorial visible centrado verticalmente (letterbox arriba y abajo cream)
- ✓ Papa hero, título "SPRINGS CITIES", stickers en sus posiciones del desktop pero comprimidos
- ✓ Scroll horizontal funciona (rueda o swipe)
- ✓ Al llegar al final del editorial entra al panel burgundy "PEDIR YA."
- ✓ Botón "← VOLVER" en pedir scrollea al inicio

- [ ] **Step 3: Visual check tablet portrait**

Vía Playwright:
- Resize a `768 × 1024`
- Screenshot

Verificar:
- ✓ Renderiza igual que mobile pero con scale ≈ 0.533 (más legible)
- ✓ Letterbox vertical menor (~152px arriba y abajo)

- [ ] **Step 4: Visual check desktop sin regresión**

Vía Playwright:
- Resize a `1440 × 900`
- Screenshot

Verificar:
- ✓ Renderiza el canvas desktop como antes (papa hero, SPRINGS CITIES, stickers, etc.)
- ✓ No hay diff visual respecto al baseline (`desktop-home.jpeg` actual)

- [ ] **Step 5: Smoke test funcional**

En mobile portrait:
- Probar drag de un sticker (ej. RÓBALA). Confirmar que el sticker se mueve y Lenis se pausa durante el drag.
- Click sobre "¡VER MENÚ!" en zona 1 → debe navegar a `/menu`.
- Click sobre "PEDIDO DIRECTO" en panel pedir → debe navegar a `/menu`.

- [ ] **Step 6: Commit + push (pull primero por regla #1 CLAUDE.md)**

```bash
git pull origin main
git push origin main
```

---

## Self-Review Post-Plan

**Spec coverage:**
- ✓ MobileCanvas (sección Arquitectura del spec) → Task 3
- ✓ MobileEditorial con vw→px (sección Geometría + Panel Editorial) → Task 2
- ✓ MobilePedir mobile-first (sección Panel Pedir) → Task 1
- ✓ Detección desktop/mobile (sección Detección) → Task 4 (page.tsx swap)
- ✓ Testing 3 viewports (sección Testing) → Task 5
- ✓ Borrar MobileHome.tsx → Task 4 step 2

**Placeholder scan:** ninguno detectado. Todos los `vw→px` están con tabla concreta, todos los pasos tienen comando o código real.

**Type consistency:** MobilePedir recibe `onBack?: () => void`. MobileEditorial recibe `pauseScroll?: () => void` y `resumeScroll?: () => void`. MobileCanvas pasa `pauseScroll`, `resumeScroll` a editorial y `onBack={scrollToStart}` a pedir. Tipos coherentes.

**Riesgos identificados:**
- El `transform: scale` puede afectar el hit-target de los DragStickers. Si en el step 5 los drags no responden, fix conocido: ajustar `transformTemplate` en `DragSticker.tsx` o usar `dragConstraints` relativos al parent escalado. No bloquea el merge; iteramos.
- En Safari iOS muy viejo (<14) el `env(safe-area-inset-*)` puede no resolver. Aceptado, el fallback 20px funciona.
