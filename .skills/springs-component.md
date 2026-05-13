---
name: springs-component
description: Crear componentes UI siguiendo el design system de Springs. Usar cuando se pida crear cualquier elemento visual nuevo.
---

# Springs Component Builder

Guía para crear cualquier componente nuevo en el e-commerce de Springs.

## Cuándo usar
- Cuando se pida crear un componente, sección, o página nueva.
- Cuando se modifique un componente existente.

## CSS Variables (usar siempre, nunca hardcodear colores)
```css
:root {
  --burgundy: #6B1419;
  --cream: #F2E8D5;
  --tinta: #1A0A0C;
  --mostaza: #C5871F;
  --burgundy-dark: #4a0e12;
  --cream-dark: #e8dcc8;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

## Patrones de componentes aprobados

### Product card (horizontal, para listas)
```
[Imagen 90x90] [Nombre (Anton)] 
               [Descripción (Inter, muted)]
               [Precio (JetBrains Mono)] [Badge]
```
- Border-left: 3px transparent, burgundy on hover.
- Cursor pointer. Transition 0.15s.
- Click abre modal bottom-sheet.

### Combo card (bloque burgundy)
```
[Nombre (Anton, cream)]
[Descripción (Inter, cream muted)]
[Precio (JetBrains Mono, mostaza)] [AHORRA badge]
```
- Background burgundy. Border-left mostaza on hover.
- Precio en mostaza (sobre fondo oscuro = pasa WCAG AA).

### Section header
```
[TÍTULO (Anton, burgundy, 28px, uppercase)]
[Subtítulo (Inter italic, 13px, muted)]
```

### Modal bottom-sheet
- transform: translateY(100%) → translateY(0).
- transition: 0.35s cubic-bezier(0.32, 0.72, 0, 1).
- Drag handle: 40x4px, tinta 20% opacity, centrado.
- Swipe-to-close threshold: 100px.
- Backdrop: tinta 70% opacity, fade in.

### Sticky cart bar (mobile)
- Fixed bottom. Burgundy background.
- Left: count (cream square) + "VER PEDIDO" (Anton).
- Right: total (JetBrains Mono, mostaza).
- Safe area padding.
- Slide-up animation on first item.

### Toast notification
- Fixed top, centered. Tinta background.
- JetBrains Mono 12px, cream text.
- Slide down 0.35s. Auto-dismiss 2.5s.

### Extra/bebida row with stepper
```
[Nombre (Inter)] [Precio (JetBrains Mono)] [- qty +]
```
- Botón +: burgundy bg, cream text, 32x32px.
- Botón -: transparent, burgundy border, 32x32px.
- Qty: JetBrains Mono, centered, 28px wide.

## Animaciones aprobadas

| Tipo | Ease | Duración |
|------|------|----------|
| Modal slide | cubic-bezier(0.32, 0.72, 0, 1) | 0.35s |
| Fade in | ease | 0.3s |
| Stagger reveal | cubic-bezier(0.16, 1, 0.3, 1) | 0.5s |
| Hover states | ease | 0.15s |
| Price count-up | ease-out cubic | 0.4s |
| Cart bar slide | cubic-bezier(0.32, 0.72, 0, 1) | 0.35s |

## Regla final
Después de crear cualquier componente, ejecutar mentalmente el springs-design-check. Si algo no pasa, corregir antes de entregar.
