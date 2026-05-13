---
name: springs-component
description: Crear componentes UI siguiendo el design system de Springs. Usar cuando se pida crear cualquier elemento visual nuevo.
---

# Springs Component Builder

Guía para crear cualquier componente nuevo en el e-commerce de Springs.
Stack: React/TSX + Tailwind CSS v4 con tokens custom.

## Cuándo usar
- Cuando se pida crear un componente, sección, o página nueva.
- Cuando se modifique un componente existente.

## Tokens disponibles en Tailwind

### Colores
`bg-burgundy`, `text-burgundy`, `border-burgundy`
`bg-cream`, `text-cream`, `border-cream`
`bg-tinta`, `text-tinta`, `border-tinta`
`bg-mostaza`, `text-mostaza`, `border-mostaza`

Opacidad con slash: `text-cream/60`, `bg-tinta/50`, `border-tinta/10`

### Fuentes
`font-display` → Anton (titulares, nombres de producto)
`font-sans` → Inter (texto funcional, body)
`font-mono` → JetBrains Mono (precios, datos, badges)

### Forma
`border-radius: 0` está forzado globalmente. No usar `rounded-*` nunca.

## Patrones de componentes aprobados

### Product card (horizontal, para listas)
```tsx
<div className="border border-tinta/10 p-5">
  <h3 className="font-display text-lg uppercase tracking-wide">{nombre}</h3>
  <p className="font-sans text-tinta/50 text-sm mt-1">{descripcion}</p>
  <div className="flex items-center justify-between mt-4">
    <span className="font-mono text-sm font-medium">{precio}</span>
    <button className="bg-tinta text-cream font-mono text-xs tracking-[2px] px-4 py-2 uppercase hover:opacity-85 transition-opacity">
      AGREGAR AL PEDIDO
    </button>
  </div>
</div>
```

### Combo card (bloque burgundy)
```tsx
<div className="bg-burgundy p-6 hover:border-l-4 hover:border-mostaza transition-all">
  <h3 className="font-display text-cream text-xl uppercase tracking-wide">{nombre}</h3>
  <p className="font-sans text-cream/50 text-sm mt-1">{descripcion}</p>
  <div className="flex items-center gap-3 mt-4">
    <span className="font-mono text-mostaza text-lg">{precio}</span>
    <span className="font-mono text-cream/30 text-xs tracking-[2px]">AHORRA {ahorro}</span>
  </div>
</div>
```

### Section header
```tsx
<h2 className="font-display text-3xl tracking-[4px] text-tinta border-b border-tinta/10 pb-3">
  {titulo}
</h2>
```

### Toast notification
```tsx
<div className="fixed top-4 left-1/2 -translate-x-1/2 bg-tinta text-cream font-mono text-xs tracking-[1px] px-5 py-3 z-50 animate-slide-down">
  {mensaje}
</div>
```

### Extra/bebida row with stepper
```tsx
<div className="flex items-center justify-between py-3 border-b border-tinta/10">
  <span className="font-sans text-sm">{nombre}</span>
  <span className="font-mono text-sm">{precio}</span>
  <div className="flex items-center gap-2">
    <button className="w-8 h-8 border border-burgundy text-burgundy font-mono">-</button>
    <span className="font-mono w-7 text-center">{qty}</span>
    <button className="w-8 h-8 bg-burgundy text-cream font-mono">+</button>
  </div>
</div>
```

## Animaciones aprobadas

| Tipo | Ease | Duración |
|------|------|----------|
| Modal slide | cubic-bezier(0.32, 0.72, 0, 1) | 0.35s |
| Fade in | ease | 0.3s |
| Stagger reveal | cubic-bezier(0.16, 1, 0.3, 1) | 0.5s |
| Hover states | ease | 0.15s |
| Price count-up | ease-out cubic | 0.4s |
| Cart bar slide | cubic-bezier(0.32, 0.72, 0, 1) | 0.35s |

## Reglas
- Componentes con interactividad llevan `"use client"` al inicio.
- Props tipadas con interfaces de TypeScript.
- Datos de productos vienen de `@/data/productos` (tipo `Producto`).
- Después de crear cualquier componente, ejecutar mentalmente el springs-design-check.
