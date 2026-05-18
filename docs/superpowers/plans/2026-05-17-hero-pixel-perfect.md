# Hero Pixel-Perfect — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer que la Zona 1 (hero) del landing desktop quede idéntica a la imagen de referencia #1.

**Architecture:** Todo el trabajo vive en `src/app/page.tsx`. No se tocan archivos de Camilo. Cada tarea cambia exactamente un elemento visual — reposición, rediseño o texto — para converger a la referencia de forma incremental y verificable.

**Tech Stack:** React/TSX, inline styles, Framer Motion DragSticker, SVG inline para iconos y efectos.

---

## Mapa de archivos

| Archivo | Cambio |
|---|---|
| `src/app/page.tsx` | Único archivo modificado. Contiene navbar, footer, Lenis canvas, stickers, hero |

---

### Task 1: Botón ENTRAR en SPRINGS Jacket Club

**Files:**
- Modify: `src/app/page.tsx` (línea ~273 — botón "ACCEDER")

- [ ] **Step 1: Localizar el botón**

Buscar en `src/app/page.tsx`:
```
ACCEDER
```
Está dentro del DragSticker 1, en un `<div>` con `background: C.tinta`.

- [ ] **Step 2: Cambiar el texto**

Reemplazar:
```tsx
<div style={{ marginTop: 10, background: C.tinta, color: C.cream, padding: "5px 16px", display: "inline-block", ...F.display, fontSize: "0.62rem", letterSpacing: "0.18em" }}>
  ACCEDER
</div>
```
Con:
```tsx
<div style={{ marginTop: 10, background: C.tinta, color: C.cream, padding: "5px 16px", display: "inline-block", ...F.display, fontSize: "0.62rem", letterSpacing: "0.18em", display: "flex", alignItems: "center", gap: 6 }}>
  ENTRAR <span style={{ fontSize: "0.55rem" }}>✦</span>
</div>
```

- [ ] **Step 3: Verificar visualmente**

Con el servidor corriendo (`npm run dev`), abrir http://localhost:3000 y confirmar que el sticker Jacket Club dice "ENTRAR ✦".

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): sticker Jacket Club — botón ENTRAR ✦"
```

---

### Task 2: Reposicionar y rediseñar el dark sticker (foto SPRINGS letrero)

**Files:**
- Modify: `src/app/page.tsx` (sticker 5 "SPRINGS banner negro" + texto S202/S suelto)

En la referencia, este sticker es un cuadrado oscuro que simula una foto de un letrero iluminado "SPRINGS", con el texto "S/2025" rotado en el borde derecho, posicionado en `left: "82vw", top: "45vh"`.

El código actual tiene:
1. Sticker 5 ("SPRINGS banner negro") en `left: "34vw", bottom: "26vh"` — POSICIÓN INCORRECTA
2. Texto "S202/S" suelto en `left: "97vw", top: "50%"` — debe integrarse al sticker

- [ ] **Step 1: Eliminar el texto S202/S suelto**

Localizar y eliminar este bloque completo:
```tsx
{/* S202/S — texto lateral rotado */}
<div style={{
  position: "absolute", left: "97vw", top: "50%",
  transform: "translateY(-50%) rotate(90deg)",
  ...F.mono, fontSize: "0.45rem", letterSpacing: "0.15em",
  color: C.tinta, opacity: 0.3, whiteSpace: "nowrap", zIndex: 5,
}}>
  S202/S
</div>
```

- [ ] **Step 2: Reemplazar el sticker "SPRINGS banner negro"**

Localizar sticker 5 que empieza con `{/* 5. SPRINGS banner negro */}` y reemplazarlo completo:

```tsx
{/* 5. Dark sticker — letrero SPRINGS iluminado */}
<DragSticker rotate={2} idleRotateRange={1.5} idleDuration={8}
  onDragStart={pauseScroll} onDragEnd={resumeScroll}
  style={{
    position: "absolute", left: "82vw", top: "45vh", zIndex: 20,
    width: "10vw",
    background: C.tinta,
    boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px ${C.tinta}`,
    overflow: "hidden",
  }}
>
  {/* Cinta de tape en la parte superior */}
  <div style={{
    position: "absolute", top: 6, left: "50%",
    transform: "translateX(-50%)",
    width: "40%", height: 8,
    background: "rgba(200,195,185,0.55)",
    zIndex: 2,
  }} />
  {/* Foto oscura simulada */}
  <div style={{
    padding: "22px 16px 14px",
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "radial-gradient(ellipse at 40% 40%, #2a0a0c 0%, #0d0407 100%)",
    minHeight: "10vw",
    justifyContent: "center",
    position: "relative",
  }}>
    {/* Glow effect */}
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 50% 50%, rgba(107,20,25,0.35) 0%, transparent 70%)",
    }} />
    {/* Letrero SPRINGS */}
    <div style={{
      ...F.display, fontSize: "clamp(14px, 1.6vw, 22px)",
      color: C.burgundy, letterSpacing: "0.08em", lineHeight: 1,
      textShadow: `0 0 12px ${C.burgundy}, 0 0 24px rgba(107,20,25,0.6)`,
      position: "relative", zIndex: 1,
    }}>
      SPRINGS
    </div>
  </div>
  {/* S/2025 texto rotado en borde derecho */}
  <div style={{
    position: "absolute", right: -18, top: "50%",
    transform: "translateY(-50%) rotate(90deg)",
    ...F.mono, fontSize: "0.38rem", letterSpacing: "0.2em",
    color: C.cream, opacity: 0.45, whiteSpace: "nowrap",
  }}>
    S/2025
  </div>
</DragSticker>
```

- [ ] **Step 3: Verificar en browser**

Confirmar que el sticker dark aparece a la derecha del hero, aproximadamente al 82% del ancho, con el letrero iluminado y el "S/2025" lateral.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): dark sticker repositionado — letrero SPRINGS iluminado"
```

---

### Task 3: Reposicionar RÓBALA, DELIVERY y TU PLAN

**Files:**
- Modify: `src/app/page.tsx` (stickers 4, 7 y 8)

- [ ] **Step 1: Ajustar RÓBALA**

Localizar `{/* 4. RÓBALA */}` y cambiar:
```tsx
style={{ position: "absolute", left: "78vw", top: "10vh", ...
```
Por:
```tsx
style={{ position: "absolute", left: "90vw", top: "10vh", ...
```

- [ ] **Step 2: Ajustar TU PLAN YA ESTÁ EN LA PUERTA**

Localizar `{/* 7. TU PLAN YA ESTÁ EN LA PUERTA */}` y cambiar:
```tsx
<div style={{
  position: "absolute", left: "63vw", bottom: "10vh", zIndex: 8,
```
Por:
```tsx
<div style={{
  position: "absolute", left: "73vw", bottom: "8vh", zIndex: 8,
```

- [ ] **Step 3: Ajustar DELIVERY EN TODA BGA**

Localizar `{/* 8. DELIVERY EN TODA BGA */}` y cambiar:
```tsx
<div style={{
  position: "absolute", left: "78vw", bottom: "10vh", zIndex: 8,
```
Por:
```tsx
<div style={{
  position: "absolute", left: "86vw", bottom: "8vh", zIndex: 8,
```

- [ ] **Step 4: Verificar en browser**

Confirmar que los 3 stickers están en la columna derecha del hero sin solaparse entre sí ni con el dark sticker.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): reposicionados RÓBALA, TU PLAN y DELIVERY"
```

---

### Task 4: Añadir icono linterna a TU PLAN sticker

**Files:**
- Modify: `src/app/page.tsx` (sticker 7 — `{/* 7. TU PLAN... */}`)

En la referencia, el sticker TU PLAN tiene un icono de linterna/farol debajo del texto.

- [ ] **Step 1: Reemplazar el placeholder de linterna**

Localizar dentro del sticker TU PLAN:
```tsx
<div style={{ width: 18, height: 26, border: `1px solid ${C.tinta}`, opacity: 0.3, margin: "0 auto" }} />
```
Reemplazar con SVG de linterna:
```tsx
<svg viewBox="0 0 32 44" width={28} height={38} style={{ display: "block", margin: "0 auto", opacity: 0.55 }}>
  {/* Base */}
  <rect x="12" y="38" width="8" height="4" rx="0" fill={C.tinta}/>
  {/* Cuerpo */}
  <rect x="9" y="18" width="14" height="20" fill="none" stroke={C.tinta} strokeWidth="1.5"/>
  {/* Asa */}
  <path d="M13 18 L13 12 Q16 8 19 12 L19 18" fill="none" stroke={C.tinta} strokeWidth="1.4"/>
  {/* Cristal/luz */}
  <rect x="11" y="20" width="10" height="14" fill={C.mostaza} opacity={0.25}/>
  {/* Lineas ventilación */}
  <line x1="9" y1="18" x2="23" y2="18" stroke={C.tinta} strokeWidth="1.2"/>
  <line x1="9" y1="38" x2="23" y2="38" stroke={C.tinta} strokeWidth="1.2"/>
</svg>
```

- [ ] **Step 2: Verificar en browser**

Confirmar que el sticker TU PLAN muestra el texto + icono linterna debajo.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): icono linterna en sticker TU PLAN"
```

---

### Task 5: Añadir efecto de cinta/tape a SPRINGS™ [UNVRS]

**Files:**
- Modify: `src/app/page.tsx` (sticker 3 — `{/* 3. SPRINGS™ [UNVRS] */}`)

En la referencia, el sticker tiene una tira de cinta adhesiva plateada/gris sobre la parte superior, como si estuviese pegado con tape.

- [ ] **Step 1: Añadir tape encima del sticker**

Localizar el DragSticker 3 que tiene `{/* 3. SPRINGS™ [UNVRS] */}` y añadir un elemento de tape dentro, antes del contenido:

```tsx
<DragSticker rotate={3} idleRotateRange={2.5} idleDuration={6}
  onDragStart={pauseScroll} onDragEnd={resumeScroll}
  style={{
    position: "absolute", left: "57vw", top: "9vh", zIndex: 20,
    padding: "18px 16px 10px", textAlign: "center",
    background: "#EDEAE4",
    boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px rgba(26,10,12,0.35)`,
    maxWidth: "13vw",
    position: "absolute", left: "57vw", top: "9vh", zIndex: 20,
  }}
>
  {/* Tape strip */}
  <div style={{
    position: "absolute", top: -7, left: "50%",
    transform: "translateX(-50%)",
    width: "55%", height: 14,
    background: "rgba(195,190,178,0.6)",
    border: "0.5px solid rgba(150,145,135,0.4)",
    zIndex: 1,
  }} />
  <div style={{ ...F.display, fontSize: "0.9rem", letterSpacing: "0.04em", color: C.tinta }}>SPRINGS™ [UNVRS]</div>
  <div style={{ ...F.mono, fontSize: "0.41rem", letterSpacing: "0.14em", color: C.tinta, marginTop: 4, textTransform: "uppercase", lineHeight: 1.55, opacity: 0.7 }}>
    SPRINGS (SPACE) JACKET CLUB X BGA<br />LIMITED EDITION
  </div>
</DragSticker>
```

> Nota: el DragSticker wrapper tiene `position: relative` por defecto, lo que permite que el tape con `position: absolute, top: -7` salga hacia arriba.

- [ ] **Step 2: Verificar que DragSticker soporte overflow visible**

Revisar `src/components/DragSticker.tsx` — si tiene `overflow: hidden` en el wrapper, el tape no se verá. Si lo tiene, cambiar a `overflow: visible` en el wrapper externo.

- [ ] **Step 3: Verificar en browser**

Confirmar que el sticker SPRINGS™ [UNVRS] muestra la tira de tape gris encima.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): efecto tape/cinta en sticker SPRINGS™ UNVRS"
```

---

### Task 6: Mejorar stamp circular — icono linterna + estrellas

**Files:**
- Modify: `src/app/page.tsx` (SVG stamp "HECHA PARA LOS DE VERDAD" — líneas ~187-197)

En la referencia, el interior del stamp circular tiene un icono de farol/linterna y estrellas ★.

- [ ] **Step 1: Reemplazar el SVG del stamp**

Localizar el bloque del stamp (empieza con `{/* Sello circular "HECHA PARA LOS DE VERDAD" */}`) y reemplazarlo:

```tsx
{/* Sello circular "HECHA PARA LOS DE VERDAD" */}
<svg
  viewBox="0 0 130 130" width="120" height="120"
  style={{ position: "absolute", left: "-1vw", top: "37vh", zIndex: 5 }}
>
  {/* Círculos del sello */}
  <circle cx="65" cy="65" r="58" fill="none" stroke={C.tinta} strokeWidth="1.2" opacity={0.5} />
  <circle cx="65" cy="65" r="50" fill="none" stroke={C.tinta} strokeWidth="0.5" opacity={0.25} />
  {/* Texto circular */}
  <path id="stamp-path" fill="none" d="M65,65 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
  <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="2.5" fill={C.tinta} fillOpacity={0.7}>
    <textPath href="#stamp-path">★ HECHA PARA LOS DE VERDAD ★ </textPath>
  </text>
  {/* Estrellas decorativas interiores */}
  <text x="44" y="52" fontFamily="sans-serif" fontSize="8" fill={C.tinta} fillOpacity={0.5}>★</text>
  <text x="76" y="52" fontFamily="sans-serif" fontSize="8" fill={C.tinta} fillOpacity={0.5}>★</text>
  {/* Icono linterna — centro del sello */}
  {/* Base */}
  <rect x="60" y="86" width="10" height="4" fill={C.tinta} opacity={0.55}/>
  {/* Cuerpo linterna */}
  <rect x="57" y="68" width="16" height="18" fill="none" stroke={C.tinta} strokeWidth="1.4" opacity={0.55}/>
  {/* Asa */}
  <path d="M61 68 L61 62 Q65 57 69 62 L69 68" fill="none" stroke={C.tinta} strokeWidth="1.3" opacity={0.55}/>
  {/* Luz interior */}
  <rect x="59" y="70" width="12" height="12" fill={C.mostaza} opacity={0.15}/>
  {/* Líneas horizontales */}
  <line x1="57" y1="68" x2="73" y2="68" stroke={C.tinta} strokeWidth="1.2" opacity={0.55}/>
  <line x1="57" y1="86" x2="73" y2="86" stroke={C.tinta} strokeWidth="1.2" opacity={0.55}/>
</svg>
```

- [ ] **Step 2: Verificar en browser**

Confirmar que el stamp circular muestra el texto circular con ★ y el icono de linterna en el centro.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): stamp circular — icono linterna + estrellas ★"
```

---

### Task 7: Corregir ✦ sparkle dentro del título SPRINGS

**Files:**
- Modify: `src/app/page.tsx` (h1 SPRINGS, línea ~209)

En la referencia, el ✦ está dentro del título, aproximadamente entre la "N" y la "G" del título SPRINGS.

- [ ] **Step 1: Ajustar posición del sparkle**

Localizar dentro del `<h1>`:
```tsx
<span style={{ position: "absolute", top: "18%", right: "-8%", fontSize: "0.1em", color: C.tinta }}>✦</span>
```
Reemplazar con:
```tsx
<span style={{ position: "absolute", top: "30%", right: "20%", fontSize: "0.12em", color: C.tinta, opacity: 0.9 }}>✦</span>
```
Esto lo coloca visualmente dentro de las letras, entre N-G-S al final del título.

- [ ] **Step 2: Verificar en browser**

Confirmar que el ✦ aparece superpuesto al interior del título SPRINGS, no fuera del borde derecho.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(JD): sparkle ✦ reposicionado dentro del título SPRINGS"
```

---

### Task 8: Verificación final con Playwright

**Files:**
- No code changes — solo verificación visual

- [ ] **Step 1: Tomar screenshot del hero completo**

Con el servidor corriendo, tomar screenshot via Playwright en viewport 1440×900 y comparar contra la imagen de referencia.

Checklist visual:
- [ ] Navbar: SPRINGS + ✦ + "BRITISH SOUL / FOR HUNGRY PEOPLE." | CARTA JACKETS LOADED NOSOTROS EL CLUB | PEDIR AHORA ↗
- [ ] Footer: INSTAGRAM · TIKTOK · SPOTIFY | barcode | LA JACKET ES EL PRODUCTO HOY. ✦
- [ ] Papa (producto) centrada-izquierda, grande
- [ ] SPRINGS título masivo
- [ ] "JACKETS THAT HIT DIFFERENT." subtitle burgundi con underline
- [ ] Body copy: "NO ES SOLO COMIDA. ES UN PLAN. ES UN LUGAR. ES SPRINGS."
- [ ] Sticker 1: SPRINGS Jacket Club (burgundy, top-left) con "ENTRAR ✦"
- [ ] Stamp: HECHA PARA LOS DE VERDAD (circular, left) con linterna
- [ ] Globe + BGA - COLOMBIA / EST. 2024
- [ ] Sticker 3: SPRINGS™ [UNVRS] (tape, top-center) con cinta
- [ ] Sticker 5: Dark sticker (foto, `left:82vw top:45vh`) con letrero iluminado + S/2025
- [ ] Sticker 4: RÓBALA (mostaza, top `left:90vw`)
- [ ] Sticker 7: TU PLAN YA ESTÁ EN LA PUERTA + linterna (`left:73vw`)
- [ ] Sticker 8: DELIVERY EN TODA BGA (`left:86vw`)
- [ ] Sticker 9: MIÉRCOLES DE DADOS (bottom-left)
- [ ] + crosshair (far right)
- [ ] ✦ sparkle dentro del título

- [ ] **Step 2: Push final**

```bash
git add src/app/page.tsx
git push origin main
```

---

## Resumen de cambios por tarea

| Task | Líneas aprox | Impacto visual |
|---|---|---|
| 1 — ENTRAR button | 1 línea | Bajo |
| 2 — Dark sticker | ~40 líneas, reposición crítica | Alto |
| 3 — Reposicionar RÓBALA/DELIVERY/TU PLAN | 3 propiedades | Medio |
| 4 — Linterna en TU PLAN | ~15 líneas SVG | Medio |
| 5 — Tape en SPRINGS™ [UNVRS] | ~8 líneas + check DragSticker | Medio |
| 6 — Stamp con linterna | ~30 líneas SVG | Medio |
| 7 — ✦ sparkle | 1 línea | Bajo |
| 8 — Verificación Playwright | 0 líneas | Crítico |
