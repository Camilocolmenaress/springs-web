---
name: springs-design-check
description: Auditar cualquier componente o página contra las reglas de diseño de Springs. Usar antes de commitear cambios visuales.
---

# Springs Design Check

Auditoría de compliance visual para cualquier archivo HTML/CSS/JSX del proyecto Springs.

## Cuándo usar
- Antes de commitear cualquier cambio que afecte UI.
- Después de crear un componente nuevo.
- Cuando se modifique CSS.

## Checklist (verificar en orden)

### Colores
- [ ] Solo usa `#6B1419` (burgundy), `#F2E8D5` (cream), `#1A0A0C` (tinta), `#C5871F` (mostaza).
- [ ] Ningún color fuera de paleta (grep por hex codes, rgb, hsl que no sean los 4).
- [ ] Mostaza NUNCA como texto sobre cream (ratio 2.5:1, falla WCAG AA).
- [ ] Mostaza solo como texto sobre burgundy o tinta.
- [ ] No hay gradientes entre colores de paleta.

### Tipografía
- [ ] Titulares y nombres de producto en Anton.
- [ ] Texto funcional en Inter.
- [ ] Precios, datos y badges en JetBrains Mono.
- [ ] No hay fonts fuera de las 3 aprobadas.
- [ ] Precios sin símbolo $ (solo número: 32,900).

### Forma
- [ ] CERO border-radius en cualquier elemento.
- [ ] CERO iconos decorativos.
- [ ] CERO emojis.
- [ ] CERO ilustraciones o patrones.

### Accesibilidad
- [ ] Tap targets mínimo 44x44px.
- [ ] Focus states visibles en elementos interactivos.
- [ ] aria-labels en botones que solo tienen símbolo (X, +, -).
- [ ] Contraste de texto cumple WCAG AA (4.5:1 para normal, 3:1 para large).

### Copy
- [ ] Todo en usted (no tú, no vos).
- [ ] Descripciones = ingredientes separados por punto. Sin adjetivos.
- [ ] Ninguna palabra prohibida (premium, gourmet, lujo, exclusivo, pasión, hecho con amor, tradición, artesanal, rico).
- [ ] CTAs usan el vocabulario aprobado (AGREGAR AL PEDIDO, IR A PAGAR, VER PEDIDO, HÁGALA MEJOR).

### Responsive
- [ ] Funciona en 375px de ancho.
- [ ] Funciona en 1024px+ (desktop 2 columnas si aplica).
- [ ] Safe area para iPhone (env(safe-area-inset-bottom)).

## Cómo ejecutar
1. Leer el archivo a auditar.
2. Grep por violaciones de color (`grep -E '#[0-9a-fA-F]{3,6}' | exclude palette`).
3. Grep por fonts no aprobadas (`grep -i 'font-family' | exclude Anton, Inter, JetBrains`).
4. Grep por border-radius (`grep 'border-radius'`).
5. Grep por palabras prohibidas en strings visibles.
6. Reportar violaciones con línea exacta y fix sugerido.
