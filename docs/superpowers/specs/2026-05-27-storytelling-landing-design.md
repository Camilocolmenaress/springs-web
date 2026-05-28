# Springs — Storytelling Landing Design

**Fecha:** 2026-05-27  
**Archivo objetivo:** `src/components/MobileLanding.tsx`  
**Tipo de cambio:** Reescritura completa (Opción A — clean rewrite)  
**Stack:** Next.js 14 · Framer Motion v12.38.0 · Tailwind CSS v4

---

## Contexto

`MobileLanding.tsx` actual tiene 7 secciones con scroll-reveal básico (opacity + y). El objetivo es reemplazarlo completamente con un storytelling-driven landing de 4 actos que usa scroll-pinned en las secciones centrales, generando una experiencia cinematográfica antes del lanzamiento.

No hay usuarios activos en riesgo — Springs está en pre-lanzamiento.

---

## Arquitectura general

### Flujo de scroll

```
[HERO — scroll-reveal] → [INGREDIENTES ×3 — scroll-pinned] → [MANIFIESTO — scroll-pinned] → [CTA — scroll-reveal]
```

### Altura total del documento

- Acto I (Hero): `100svh`
- Acto II (Ingredientes): `300svh` (100svh visible + 200svh de "scroll virtual" para los 3 ingredientes)
- Acto III (Manifiesto): `200svh` (100svh visible + 100svh para las 4 líneas)
- Acto IV (CTA): `100svh`
- Footer: altura natural

### Componentes

| Componente | Responsabilidad |
|------------|----------------|
| `MobileLanding` | Orquestador — composición de los 4 actos |
| `HeroSection` | Acto I — Ken Burns + stagger |
| `PinnedIngredients` | Acto II — 3 ingredientes scroll-pinned |
| `PinnedManifesto` | Acto III — clip reveal scroll-pinned |
| `CTASection` | Acto IV — clip reveal + botón bounce |
| `ClipRevealText` | Componente shared — animación de clip |
| `useScrollProgress` | Hook shared — mapea scroll range a 0→1 |

Todos los componentes viven en `src/components/MobileLanding.tsx` (archivo único, sin nuevos archivos).

---

## Acto I — Hero

### Comportamiento

Al cargar la página (sin ningún scroll):

1. La foto del producto (`hero-jacket.jpg`) ya es visible, haciendo Ken Burns: `scale 1.0 → 1.08` en loop de 20s, ease lineal, nunca para.
2. El wordmark `SPRINGS` entra desde la izquierda: `x: -40 → 0`, `opacity: 0 → 1`, duración 0.8s, delay 0s.
3. El botón `PEDIR AHORA` entra desde la derecha: `x: 40 → 0`, `opacity: 0 → 1`, duración 0.8s, delay 0.1s.
4. Primera línea del título ("CARNE &"): `x: -40 → 0`, `opacity: 0 → 1`, duración 0.8s, delay 0.3s.
5. Segunda línea ("QUESO"): misma animación, delay 0.45s.

Al hacer scroll hacia abajo:
- El título hace parallax suave hacia arriba (`y: 0 → -30px` mapeado con `useScroll`).
- La imagen permanece fija (no hace parallax — el Ken Burns es suficiente movimiento).

### Estructura visual

```
┌─────────────────────────────────┐
│ SPRINGS              PEDIR AHORA│  ← navbar fijo
│                                 │
│      [foto hero-jacket.jpg]     │  ← Ken Burns zoom
│                                 │
│                                 │
│ CARNE &                         │  ← SlideText
│ QUESO                           │  ← SlideText delay
│                    [wax-seal]   │
└─────────────────────────────────┘
```

### Easing

`[0.16, 1, 0.3, 1]` — ease out expo. Mismo que el componente actual.

---

## Acto II — Ingredientes (scroll-pinned)

### Comportamiento

Contenedor con `height: 300svh`. El panel visual interno tiene `position: sticky; top: 0; height: 100svh`.

`useScroll({ target: containerRef })` devuelve `scrollYProgress` 0→1.

`useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 2])` da el índice del ingrediente activo (0, 1, 2).

Ingredientes:
- `0` → CARNE OREADA. (fondo: `#1A0A0C`)
- `1` → HOGAO. (fondo: `#6B1419`)
- `2` → QUESO COSTEÑO. (fondo: `#F2E8D5`, texto `#1A0A0C`)

### Cada pantalla de ingrediente

```
┌─────────────────────────────────┐
│                                 │
│         01 / 03                 │  ← contador font-mono
│                                 │
│       CARNE                     │  ← Anton ~72px
│       OREADA.                   │
│                                 │
│         ────                    │  ← línea mostaza 32px
│                                 │
│       ● ○ ○                     │  ← dots de progreso
└─────────────────────────────────┘
```

### Transición entre ingredientes

Saliente: `opacity 1→0`, `y: 0→-24px`, duración 0.35s ease-in.  
Entrante: `opacity 0→1`, `y: 24px→0`, duración 0.35s ease-out.  
Implementado con `AnimatePresence mode="wait"`.

---

## Acto III — Manifiesto (scroll-pinned)

### Comportamiento

Contenedor con `height: 200svh`. Panel interno `position: sticky; top: 0; height: 100svh`.

`useScroll` en el contenedor. Progreso 0→1 mapea a 4 líneas que se revelan secuencialmente.

Umbrales: línea 1 en 0.0, línea 2 en 0.25, línea 3 en 0.5, línea 4 en 0.75.

### Líneas del manifiesto

1. `BIEN`
2. `HECHA.`
3. `Bucaramanga ya tenía suficientes hamburguesas iguales.`
4. `Springs nace porque pedir comida también es respeto propio.`

Líneas 1 y 2: Anton ~72px, `text-cream`.  
Líneas 3 y 4: Inter 14px italic, `text-cream`.

### Animación clip reveal (componente `ClipRevealText`)

Cada línea está en un contenedor `overflow: hidden`.

```tsx
// Estado inicial (oculto)
translateY: "100%", opacity: 0

// Estado final (visible)
translateY: "0%", opacity: 1

// Spring config
stiffness: 80, damping: 20, mass: 1
```

El componente recibe `isVisible: boolean` y usa `animate` de Framer Motion para transicionar entre estados.

### Fondo

Imagen de producto con `opacity: 0.2` + overlay `bg-burgundy/60`. La imagen no se mueve.

---

## Acto IV — CTA

### Comportamiento

Scroll-reveal normal. Al entrar al viewport (`useInView`, `amount: 0.2`):

1. Imagen del packaging entra con `opacity: 0→1`, duración 0.6s.
2. "PEDÍ" entra con clip reveal, delay 0.2s.
3. "AHORA." entra con clip reveal, delay 0.4s.
4. Botón "IR A PEDIR" entra desde abajo: `y: 20→0`, `opacity: 0→1`, delay 0.6s, con spring `stiffness: 200, damping: 15` (leve bounce).
5. Trust bar fade-in, delay 0.8s.

### Estructura visual

```
┌─────────────────────────────────┐
│  [imagen packaging — 300px]     │
├─────────────────────────────────┤
│  PEDÍ                           │  ← clip reveal
│  AHORA.                         │  ← clip reveal
│                                 │
│  [IR A PEDIR →]                 │  ← botón mostaza full-width
│                                 │
│  30–45 MIN · CABECERA · ...     │  ← trust bar font-mono
└─────────────────────────────────┘
```

---

## Componente `ClipRevealText` (shared)

```tsx
interface ClipRevealTextProps {
  children: React.ReactNode;
  isVisible: boolean;
  delay?: number;
  className?: string;
}
```

Usado en: Acto III (manifiesto) y Acto IV (CTA). Mismo comportamiento, misma spring config. Garantiza consistencia visual entre ambas secciones.

---

## Hook `useScrollProgress`

```tsx
function useScrollProgress(
  containerRef: React.RefObject<HTMLElement>
): MotionValue<number>
```

Wrapper mínimo sobre `useScroll` que devuelve `scrollYProgress` (0→1) del contenedor. Los `useTransform` específicos (ingrediente activo, umbral de línea) se definen en cada componente según sus propias necesidades — no en el hook.

---

## Paleta y tipografía

Sin cambios respecto al manual de marca:

| Token | Valor |
|-------|-------|
| `bg-burgundy` | `#6B1419` |
| `bg-cream` | `#F2E8D5` |
| `bg-tinta` | `#1A0A0C` |
| `text-mostaza` | `#C5871F` |
| `font-display` | Anton |
| `font-sans` | Inter |
| `font-mono` | JetBrains Mono |

CERO border-radius. CERO gradientes entre colores de paleta. CERO emojis.

---

## Accesibilidad

- `prefers-reduced-motion`: si activo, todas las animaciones se desactivan (duración 0, sin parallax, sin Ken Burns). Implementado con `useReducedMotion()` de Framer Motion.
- Touch targets mínimo 44×44px en botón CTA.
- `alt` text en todas las imágenes.
- Scroll-pinned funciona correctamente en iOS Safari con `100svh`.

---

## Lo que NO cambia

- `src/app/page.tsx` — sin tocar
- `src/app/layout.tsx` — sin tocar
- `src/data/productos.ts` — sin tocar
- `public/images/` — sin tocar (se usan las imágenes existentes)
- Footer — se conserva idéntico al actual

---

## Criterios de éxito

- [ ] Ken Burns en hero no causa layout shift
- [ ] Scroll-pinned funciona en iOS Safari (iPhone 12+)
- [ ] Transición entre ingredientes sin flicker
- [ ] Clip reveal visible en Android Chrome
- [ ] `prefers-reduced-motion` desactiva todas las animaciones
- [ ] `npm run build` sin errores
- [ ] Viewport 375px sin scroll horizontal
