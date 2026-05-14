# Mobile Canvas — Diseño

**Fecha:** 2026-05-14
**Owner:** Juan David (frontend)
**Estado:** Aprobado, listo para plan de implementación

## Contexto

La home (`/`) actualmente renderiza un canvas horizontal de 500vw con Lenis para desktop ≥1024px. En viewports `<1024`, hoy se renderiza `MobileHome.tsx`, un layout vertical stacked. Juan decidió que en mobile la home debe verse **igual que en desktop** — scroll horizontal con la misma composición editorial — pero adaptada a las proporciones del dispositivo.

## Decisión de modo mobile (acordada en brainstorming)

Alternar según zona:
- **Zonas 1, 2, 3 (Hero, Jackets editorial, About)** → 1:1 zoom out exacto. La composición editorial se preserva milímetro a milímetro como en desktop 1440px, solo comprimida al ancho del celular. Texto chiquito pero el layout es idéntico.
- **Zona 4 (Pedir Ya)** → reescrita mobile-friendly. Botones tappeables, tipografía legible, layout vertical centrado.

## Arquitectura

```
src/app/page.tsx                   ← hook detección + switch desktop/mobile (canvas desktop intacto)
src/components/MobileCanvas.tsx    ← NUEVO. Wrapper Lenis + dos paneles
src/components/MobileEditorial.tsx ← NUEVO. Zonas 1+2+3 escaladas 1:1
src/components/MobilePedir.tsx     ← NUEVO. Zona 4 reescrita mobile-first
src/components/MobileHome.tsx      ← BORRAR (reemplazado por MobileCanvas)
```

`page.tsx` queda con la misma lógica de detección que ya existe (`useIsDesktop`). Si `isDesktop !== true` → renderiza `<MobileCanvas />`. Si `isDesktop === true` → mantiene el canvas desktop actual sin tocar nada.

## Geometría y scaling

Variables base:

| Variable | Valor |
|---|---|
| `DESIGN_W` | `1440` (ancho lógico desktop) |
| `DESIGN_H` | `900` (alto lógico desktop) |
| `ZONES_EDITORIAL` | `3` (zonas 1, 2, 3) |
| `VIEWPORT_W` | `window.innerWidth` (ej. 390) |
| `scale` | `VIEWPORT_W / DESIGN_W` (ej. ≈ 0.271) |

### Panel Editorial

- **Wrapper exterior**: `width = 3 × DESIGN_W × scale`, `height = DESIGN_H × scale`. Ej. en iPhone 390: `width = 1170px`, `height = 244px`.
- **Inner**: `width = 3 × DESIGN_W = 4320px`, `height = DESIGN_H = 900px`, `transform: scale(scale); transformOrigin: 0 0`.
- **Conversión de `vw` a `px`**: las posiciones absolutas de las zonas (`left: 30vw`, `top: 18vh`, etc.) actualmente son interpretadas por el browser sobre el viewport real. Las convertimos a `px` sobre el mundo lógico 1440×900. Tabla:

| Original | Convertido |
|---|---|
| `1vw` | `14.4px` (1440 × 0.01) |
| `1vh` | `9px` (900 × 0.01) |
| `clamp(140px, 22vw, 380px)` | `clamp(140px, 316.8px, 380px)` = `316.8px` |
| `left: "30vw"` | `left: "432px"` |
| `top: "18vh"` | `top: "162px"` |

Esta conversión se aplica al copiar las zonas 1, 2, 3 al `MobileEditorial.tsx`.

### Letterbox vertical

En mobile portrait el aspect ratio del viewport (≈0.46) es muy distinto al editorial (1.6). El editorial escalado mide ~244px de alto, dejando ~600px vacíos verticalmente. Se centra verticalmente con franjas `var(--cream)` arriba y abajo. Sensación cinemática, no defectuosa.

### Panel Pedir

`width = 100vw`, `height = 100vh`. Sin scale, todo nativo mobile. Layout vertical centrado.

### Ancho total del canvas mobile

`(3 × DESIGN_W × scale) + 100vw`

En iPhone 390: `1170 + 390 = 1560px`. Lenis horizontal scrollea esos 1560.

## Panel Editorial — Detalles

Copiar tal cual de `page.tsx` (líneas que componen zonas 1+2+3) al componente `MobileEditorial`. Sin cambios en:
- Stickers draggables (SPRINGS Jacket Club, UNVRS, RÓBALA, MIÉRCOLES de Dados, PEDIDO GRANDE, SPRINGS logo, MUY RICA, DROP)
- Papa hero, papa final
- Tipografía gigante (`SPRINGS CITIES`, `CARTA 2025`, `ABOUT US`, `SOLO DELIVERY.`)
- Fotos editoriales, banners, FAQS rotado
- Reveal components con Framer Motion

Solo se cambian valores `vw`/`vh` por `px` sobre 1440/900 (ver tabla arriba).

Los `DragSticker` siguen siendo draggables. La interacción de drag respeta el scale del wrapper — Framer Motion `drag` con `transformTemplate` funciona bien dentro de un parent scaled.

**Pausa de Lenis durante drag**: igual que desktop, `onDragStart={pauseScroll}`, `onDragEnd={resumeScroll}`. La instancia de Lenis es la misma que vive en `MobileCanvas`.

## Panel Pedir — Detalles

Diseño nuevo, mobile-first:

```
┌──────────────────────────┐
│  ← VOLVER                │ ← arriba izq, mono pequeño
│                          │
│  ↗ SIN EXCUSAS · ESTO    │ ← mostaza, mono
│    ES SPRINGS            │
│                          │
│    P E D I R             │ ← Anton ~80px, cream
│    Y A .                 │
│                          │
│ ┌──────────────────────┐ │
│ │ RAPPI            →   │ │ ← bg cream, full-width
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ UBER EATS        →   │ │ ← outline cream
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ PEDIDO DIRECTO   →   │ │ ← outline mostaza, link a /menu
│ └──────────────────────┘ │
│                          │
│  HORARIO  12PM - 9PM     │ ← mono, mostaza/cream
│  ZONA     BUCARAMANGA    │
│           Cab · Cañ · Sot│
│  COMBO    PARA DOS       │
│           69,900         │
│                          │
│  @SPRINGS.COL · TIKTOK   │ ← footer mini
└──────────────────────────┘
```

- Fondo: `burgundy (#6B1419)`
- Padding: `24px` lateral, `max(24px, safe-area-inset-top)` arriba, `max(24px, safe-area-inset-bottom)` abajo
- Botones: `padding 18px 22px`, mínimo `56px` alto (apto dedo)
- "← VOLVER" envía a la izquierda del canvas (scroll Lenis a 0)
- Tipografía "PEDIR YA." en `clamp(60px, 22vw, 110px)`

## Lenis

```ts
new Lenis({
  wrapper,
  content,
  orientation: "horizontal",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
```

Idéntica config a desktop. Touch en mobile usa el comportamiento nativo de Lenis (no requiere `smoothTouch`). La pista de scroll es `[editorial-wrapper(1170px), pedir-panel(390px)]`.

## Detección desktop/mobile

`useIsDesktop` ya existente en `page.tsx`:

```ts
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}
```

Render condicional en `Home`:
```tsx
if (isDesktop !== true) return <MobileCanvas />;
// ... canvas desktop actual sin cambios
```

`MobileCanvas` desbloquea `body { overflow: hidden, height: 100% }` de `globals.css` para que Lenis pueda hijackear el scroll. Restaura al desmontar.

## Testing

Playwright en tres viewports:

| Viewport | Comportamiento esperado |
|---|---|
| `390×844` (iPhone portrait) | MobileCanvas activo. Swipe horizontal recorre editorial → pedir |
| `768×1024` (iPad portrait) | MobileCanvas activo (mismo que 390 pero con scale ≈ 0.533) |
| `1440×900` (desktop) | Canvas desktop intacto, sin regresiones |

Casos a verificar:
- Editorial mantiene proporciones 1:1 del desktop (visual comparison)
- Stickers siguen siendo draggables en mobile
- Letterbox vertical centrado sin glitches
- Panel Pedir es tappeable cómodamente (buttons ≥56px alto)
- "← VOLVER" en pedir hace scroll al inicio del editorial
- Transición editorial → pedir es suave (no salto)

## Tradeoffs y limitaciones aceptadas

- **Texto chiquito en editorial mobile**: a propósito. Juan priorizó fidelidad visual sobre legibilidad de microcopy. El microcopy del editorial es atmosférico, no transaccional.
- **Letterbox vertical**: ~600px de espacio cream vacío arriba/abajo del editorial en iPhone portrait. Aceptado como recurso editorial cinemático.
- **Bundle size**: 3 componentes nuevos × ~150 líneas + duplicación del editorial. Aceptable (~+10KB gzipped).

## Plan de implementación

Cubrido en el doc paralelo de writing-plans (siguiente paso).
