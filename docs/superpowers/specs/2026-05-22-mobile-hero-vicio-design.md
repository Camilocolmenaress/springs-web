# Mobile Hero Section — Rediseño estilo Vicio

## Goal

Reconstruir la Section 1 (hero) del mobile editorial de Springs replicando la arquitectura técnica de vicio.com: capa de stickers separada con GSAP Draggable, animaciones de entrada coreografiadas con GSAP timeline, sizing en `vh`, y `mix-blend-mode: difference` en el wordmark.

## Architecture

### Stack de animación

| Herramienta | Rol | Reemplaza |
|---|---|---|
| `gsap` (core) | Timelines, tweens, easings | CSS `@keyframes heroReveal` |
| `gsap/ScrollTrigger` | Scroll-driven reveals para secciones 2-4 | CSS `animation` con delays |
| `gsap/Draggable` + `InertiaPlugin` | Stickers arrastrables con física real | `DragSticker.tsx` (Framer Motion drag) |
| `@gsap/react` | Hook `useGSAP()` con cleanup automático | `useEffect` manual |
| `framer-motion` | **Se mantiene** para UI: cart, modales, toasts, AnimatePresence | Sin cambio |

**Se elimina en este sprint:** `@use-gesture/react` (redundante con GSAP Draggable). Se desinstala del `package.json` y se eliminan imports. Si algún otro componente fuera del hero lo usa, se migra o se mantiene temporalmente.

### Unidad de sizing

Cambiar de `vw`/`svh` a `vh` como unidad principal en el hero. Razones:
- Vicio usa 738 valores en `vh` y solo 595 en `vw`
- `vh` escala proporcionalmente con la altura del viewport, que es lo que define el hero (100vh)
- Consistencia: un solo sistema de referencia

### DOM Structure

```
<section class="hero-section">
  <!-- position: relative; height: 100vh; overflow: hidden; background: var(--cream) -->

  <!-- CAPA 1: Contenido (z-index 1-10) -->

  <!-- Wordmark -->
  <h1 class="hero-wordmark">
    <!-- position: absolute; mix-blend-mode: difference; color: white; z-index: 3 -->
    SPRINGS
  </h1>

  <!-- Papa (La Fija) -->
  <div class="hero-potato">
    <!-- position: absolute; z-index: 4 -->
    <Image src="/images/la-fija.png" ... />
  </div>

  <!-- Ubicación -->
  <div class="hero-location">
    <!-- position: absolute; z-index: 5 -->
    ⊕ Barbosa STDR – COLOMBIA / EST. 2025
  </div>

  <!-- Globo -->
  <div class="hero-globe">
    <!-- position: absolute; z-index: 5 -->
    <svg>...</svg>
  </div>

  <!-- Label -->
  <div class="hero-label">
    <!-- position: absolute; z-index: 5 -->
    ↗ Jacket / La Fija
  </div>

  <!-- Subtitle -->
  <div class="hero-subtitle">
    <!-- position: absolute; z-index: 5; transform: rotate(-8deg) -->
    JACKETS DIFFERENT BY DEFAULT
  </div>

  <!-- Underline stroke -->
  <div class="hero-underline">
    <!-- position: absolute; z-index: 5 -->
    <Image src="/images/underline-stroke.png" ... />
  </div>

  <!-- SensitiveImage -->
  <div class="hero-sensitive">
    <!-- position: absolute; z-index: 8 -->
    <SensitiveImage ... />
  </div>

  <!-- Marquee tape -->
  <div class="hero-marquee">
    <!-- position: absolute; z-index: 6 -->
    SPRINGS < SPRINGS < ...
  </div>

  <!-- ART GALLERY strip -->
  <div class="hero-gallery-strip">
    <!-- position: absolute; z-index: 5 -->
    <a href="/art-gallery">ART GALLERY</a> + product list
  </div>

  <!-- CAPA 2: Stickers (z-index 500) -->
  <div class="sticker-wrapper">
    <!-- position: absolute; inset: 0; z-index: 500; pointer-events: none -->

    <div class="draggable-sticker sticker-dados">
      <!-- pointer-events: auto; cursor: grab -->
      <a href="/prueba-tu-suerte">
        <Image src="/images/miercoles-dados-sticker.png" ... />
      </a>
    </div>

    <div class="draggable-sticker sticker-jc">
      <!-- pointer-events: auto; cursor: grab -->
      <a href="/springs-jacket-club">
        <Image src="/images/jacket-club-sticker.png" ... />
      </a>
    </div>

  </div>
</section>
```

### Positioning

Todos los elementos usan `position: absolute` dentro del hero `position: relative`. Posiciones en `vh` units. Las posiciones exactas se definen en código basándose en proporciones visuales — NO en coordenadas de un editor externo.

Posicionamiento base (ajustable durante implementación):

| Elemento | left | top | width/height | z-index |
|---|---|---|---|---|
| SPRINGS wordmark | 2vh | 8vh | font-size: 11vh | 3 |
| Papa (La Fija) | auto (right: -2vh) | 0 | width: 45vh, height: 55vh | 4 |
| ⊕ Ubicación | 2vh | 20vh | auto | 5 |
| Globo | 2vh | 28vh | 7vh x 7vh | 5 |
| Dados sticker | 1vh | 35vh | 18vh | 500 (sticker layer) |
| Label ↗ | 2vh | 52vh | auto | 5 |
| JC sticker | 2vh | 60vh | 16vh | 500 (sticker layer) |
| JACKETS DIFFERENT... | 20vh | 55vh | auto, rotate(-8deg) | 5 |
| Underline | 30vh | 62vh | 25vh wide | 5 |
| SensitiveImage | 25vh | 64vh | 22vh wide | 8 |
| Marquee | 0 | 80vh | full width | 6 |
| ART GALLERY | 2vh | 88vh | auto | 5 |

### Animation System

#### Entrada del hero (GSAP Timeline)

```javascript
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
```

Cada elemento tiene su propio easing, duración, y offset. Los stickers entran con `back.out(2)` (bounce más agresivo) y `scale: 0.5` (aparecen "lanzados").

#### Globo giratorio

```javascript
gsap.to(".hero-globe svg g", {
  rotation: 360,
  duration: 12,
  repeat: -1,
  ease: "none",
  transformOrigin: "center center"
});
```

#### Marquee (CSS puro, no GSAP)

Se mantiene `@keyframes marquee` en CSS. Es una animación infinita simple que no necesita GSAP.

#### GSAP Draggable (stickers)

```javascript
import { Draggable, InertiaPlugin } from "gsap/all";
gsap.registerPlugin(Draggable, InertiaPlugin);

document.querySelectorAll(".draggable-sticker").forEach(el => {
  Draggable.create(el, {
    type: "x,y",
    edgeResistance: 0.85,
    bounds: ".hero-section",
    inertia: true,
    zIndexBoost: false,
    onPress() { gsap.to(el, { scale: 1.05, duration: 0.15 }); },
    onRelease() { gsap.to(el, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" }); }
  });
});
```

Config idéntica a Vicio: `edgeResistance: 0.85`, `zIndexBoost: false`. Agregamos `bounds` para limitar al hero y feedback táctil (scale up on press, elastic snap on release).

### mix-blend-mode: difference

```css
.hero-wordmark {
  color: white;
  mix-blend-mode: difference;
}
```

Con fondo cream (`#F2E8D5`), el texto aparece como `#0D1726` (casi negro). Sobre la papa (tonos marrones/dorados), aparece como colores invertidos contrastantes. El efecto: el wordmark SIEMPRE es legible sin importar qué haya detrás.

### Text Rendering (globals.css)

```css
html {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-shadow: rgba(0,0,0,.01) 0 0 1px;
}
```

Truco de subpixel rendering de Vicio. Mejora la nitidez tipográfica en todos los navegadores.

### Componentes

#### Archivos nuevos
- `src/components/HeroSection.tsx` — El hero completo (reemplaza Section 1 de MobileEditorial)
- `src/components/StickerLayer.tsx` — Wrapper de stickers con GSAP Draggable init
- `src/components/GsapSticker.tsx` — Sticker individual (reemplaza DragSticker para el hero)

#### Archivos modificados
- `src/components/MobileEditorial.tsx` — Section 1 reemplazada por `<HeroSection />`
- `src/app/globals.css` — Text rendering + clases del hero
- `package.json` — Agregar `gsap`, `@gsap/react`. Eliminar `@use-gesture/react`

#### Archivos sin cambio
- `src/components/DragSticker.tsx` — Se mantiene para uso fuera del hero (si se necesita)
- `src/components/SensitiveImage.tsx` — Se mantiene tal cual, se usa dentro del hero
- `src/components/MobileCanvas.tsx` — Sin cambio (wrapper + nav)

### SensitiveImage: backdrop-filter concern

`SensitiveImage.tsx` usa `backdrop-filter: blur(22px)`. Vicio también usa `backdrop-filter: blur(15px)` en 3 lugares. Es costoso en GPU pero aceptable si:
- Solo 1 elemento lo usa simultáneamente en el viewport
- No se anima (estático hasta que el usuario toca)

Se mantiene como está. Si hay problemas de rendimiento en Android mid-range, se reemplaza por un fondo sólido semi-transparente.

### Performance Rules

1. Solo 1 imagen con `priority` (la papa, LCP candidate)
2. Stickers son imágenes pequeñas (<50KB cada una), lazy load
3. `will-change: transform` solo durante drag (GSAP lo maneja automáticamente)
4. Z-index en 3 capas: contenido (1-10), stickers (500), nav (999)
5. `isolation: isolate` en `.hero-section` para contener stacking contexts
6. Marquee usa CSS puro, no GSAP (no consume JS thread)

### What This Replaces

| Antes | Después |
|---|---|
| 12 elementos con `position: absolute` y coordenadas de editor | Mismos 12 elementos con posiciones en `vh`, definidas en código |
| `@keyframes heroReveal` (uniform) | GSAP timeline con easing per-element |
| DragSticker (Framer Motion drag) | GSAP Draggable + InertiaPlugin |
| `@use-gesture/react` | Eliminado |
| z-index: 1-22 (7 niveles) | z-index: 1-10, 500, 999 (3 capas) |
| `vw`/`svh` units | `vh` units |
| Sin `mix-blend-mode` | `mix-blend-mode: difference` en wordmark |
| Sin text rendering optimization | `optimizeLegibility` + antialiased + subpixel trick |

### Scope

Este spec cubre SOLO la Section 1 (hero) del mobile editorial. Sections 2-4 no se tocan. La migración de esas secciones a GSAP ScrollTrigger será un spec separado.

### Success Criteria

1. El hero se ve como un collage editorial tipo revista/zine
2. Los stickers se sienten físicos al arrastrar (momentum, edge resistance)
3. La entrada se siente coreografiada (cada elemento con su timing y easing)
4. El wordmark SPRINGS es legible sobre cualquier fondo (mix-blend-mode)
5. 60fps en iPhone SE y Samsung A15 (mid-range)
6. Build de Next.js pasa sin errores
7. No hay regresión en secciones 2-4
