---
name: springs-design-check
description: Auditar cualquier componente o página contra las reglas de diseño de Springs. Usar antes de commitear cambios visuales.
---

# Springs Design Check

Auditoría de compliance visual para cualquier archivo TSX/CSS del proyecto Springs.

## Cuándo usar
- Antes de commitear cualquier cambio que afecte UI.
- Después de crear un componente nuevo.
- Cuando se modifique globals.css o clases de Tailwind.

## Checklist (verificar en orden)

### Colores
- [ ] Solo usa burgundy (#6B1419), cream (#F2E8D5), tinta (#1A0A0C), mostaza (#C5871F).
- [ ] Solo clases Tailwind de paleta: `bg-burgundy`, `text-cream`, etc. Con opacidad: `text-tinta/50`.
- [ ] Ningún hex hardcodeado fuera de paleta ni clases como `bg-red-500`, `text-gray-400`.
- [ ] Mostaza NUNCA como texto sobre cream (ratio 2.5:1, falla WCAG AA).
- [ ] Mostaza solo como texto sobre burgundy o tinta.
- [ ] No hay gradientes entre colores de paleta.

### Tipografía
- [ ] Titulares y nombres de producto: `font-display` (Anton).
- [ ] Texto funcional: `font-sans` (Inter).
- [ ] Precios, datos y badges: `font-mono` (JetBrains Mono).
- [ ] No usa fuentes fuera de las 3 aprobadas (nada de `font-serif`, Google Fonts extras).
- [ ] Precios sin símbolo $ (solo número: 32,900).

### Forma
- [ ] CERO border-radius (`rounded-*` no debe aparecer en ningún componente).
- [ ] CERO iconos decorativos.
- [ ] CERO emojis.
- [ ] CERO ilustraciones o patrones.

### Accesibilidad
- [ ] Tap targets mínimo 44x44px (w-11 h-11 en Tailwind).
- [ ] Focus states visibles en elementos interactivos.
- [ ] aria-labels en botones que solo tienen símbolo (X, +, -).
- [ ] Contraste de texto cumple WCAG AA (4.5:1 para normal, 3:1 para large).

### Copy
- [ ] Todo en usted (no tú, no vos).
- [ ] Descripciones = ingredientes separados por punto. Sin adjetivos.
- [ ] Ninguna palabra prohibida (premium, gourmet, lujo, exclusivo, pasión, hecho con amor, tradición, artesanal, rico).
- [ ] CTAs usan el vocabulario aprobado (AGREGAR AL PEDIDO, IR A PAGAR, VER PEDIDO, HÁGALA MEJOR).

### Responsive
- [ ] Funciona en 375px de ancho (mobile-first).
- [ ] Funciona en 1024px+ (desktop 2 columnas si aplica).
- [ ] Safe area para iPhone (env(safe-area-inset-bottom)).

## Cómo ejecutar
1. Leer el archivo a auditar.
2. Grep por violaciones de color: hex codes fuera de paleta, clases de color Tailwind genéricas.
3. Grep por `rounded` (no debe existir en componentes).
4. Grep por palabras prohibidas en strings visibles.
5. Verificar que imports usan `@/` alias.
6. Reportar violaciones con línea exacta y fix sugerido.
