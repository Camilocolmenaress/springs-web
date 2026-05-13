# Springs Web — Contexto para Claude Code

Este proyecto es EXCLUSIVAMENTE el e-commerce de Springs (springs.com.co). Todo lo que hagas aquí debe producir código funcional para la página web donde los clientes hacen pedidos de jacket potatoes para domicilio en Bucaramanga.

## Quién soy
Camilo, co-fundador de Springs, 21 años, vibe coder. Stack: Next.js 14, Supabase, Vercel. Este es mi proyecto con mi primo Juan David.

## Qué es este proyecto
E-commerce propio de Springs — dark kitchen de jacket potatoes (papas horneadas rellenas con proteína santandereana) en Bucaramanga, Colombia. 100% domicilios. El sitio es el canal principal de ventas.

## Stack técnico
- **Framework:** Next.js 14 (App Router) — migrar cuando se indique, actualmente boceto HTML estático.
- **Backend/DB:** Supabase (PostgreSQL + Realtime + Auth + Edge Functions).
- **Pagos:** Wompi (pasarela colombiana).
- **Automatizaciones:** n8n (flujos WhatsApp, notificaciones, reactivación).
- **Analytics:** Vercel Analytics + Meta Pixel + GA4.
- **Hosting:** Vercel.
- **Dominio objetivo:** springs.com.co

## Identidad visual (NO NEGOCIABLE)

### Paleta cromática absoluta
Solo estos 4 colores. Ningún otro. Nunca.
- **Burgundy** `#6B1419` — dominante, 65-75% de superficie visual.
- **Cream** `#F2E8D5` — fondo, texto sobre oscuros, 20-25%.
- **Tinta** `#1A0A0C` — contraste extremo, NO es negro puro, 5-8%.
- **Mostaza brasa** `#C5871F` — acento, CTAs, datos destacados, 3-5%.

### Tipografías (Google Fonts)
- **Anton** — titulares, wordmark, nombres de producto. All caps, condensada bold.
- **Inter** — texto funcional, descripciones, body copy.
- **JetBrains Mono** — precios, datos, contadores, badges. Monospace, all caps.

### Reglas visuales
- CERO border-radius. Bordes rectos siempre. La marca tiene actitud.
- CERO iconos decorativos (ni chef hat, ni papa, ni fuego, ni nada).
- CERO emojis en ninguna parte de la interfaz.
- CERO ilustraciones, patrones decorativos, o marcos ornamentales.
- CERO gradientes entre colores de la paleta.
- CERO colores fuera de paleta (verde, rosa, azul, naranja, morado).
- La tipografía y el espacio negativo SON la decoración.
- Wordmark "SPRINGS" y logomark "S gestual" NUNCA aparecen juntos en la misma vista.

### Accesibilidad (WCAG AA)
- Mostaza (#C5871F) sobre cream (#F2E8D5) tiene ratio 2.5:1 — **FALLA WCAG AA**.
- NUNCA usar mostaza como color de texto sobre fondo cream.
- Mostaza solo como texto sobre fondos oscuros (burgundy, tinta) donde pasa AA.
- Precios y datos en tinta (#1A0A0C) sobre cream — ratio 5.8:1, pasa AA.

## La carta completa

### Jackets (5 productos)
Cada Jacket incluye: mantequilla + queso costeño integrados en la pulpa (técnica kumpir) + hogao + queso costeño + porción de Fuse.

| Nombre | Proteína | Descripción | Precio |
|--------|----------|-------------|--------|
| La Fija | Pollo desmechado | Pollo desmechado. Hogao. Queso costeño. | 32,900 |
| La Pesada | Carne desmechada | Carne desmechada. Hogao. Queso costeño. | 35,900 |
| La Brava | Chorizo santandereano | Chorizo santandereano. Hogao. Queso costeño. | 34,900 |
| La Simple | Carne molida | Carne molida sazonada. Hogao. Queso costeño. | 28,900 |
| La Honesta | Sin carne | Queso costeño doble. Hogao doble. Aguacate. | 28,900 |

### Loaded (4 productos)
| Nombre | Descripción | Precio |
|--------|-------------|--------|
| Loaded Pollo | Gajos. Pollo desmechado. Queso fundido. Fuse. | 24,900 |
| Loaded Molida | Gajos. Carne molida. Queso fundido. Cebolla crispy. | 22,500 |
| Loaded Desmechada | Gajos. Carne desmechada. Queso fundido. Fuse. | 24,900 |
| Loaded Chorizo | Gajos. Chorizo picado. Queso fundido. Hogao. | 24,900 |

### Salsa firma: Fuse
Tartara + ají. Color rosa/salmón. Incluida con cada Jacket. Extra disponible.

### Extras
| Extra | Precio |
|-------|--------|
| Extra queso costeño | 3,500 |
| Aguacate | 3,000 |
| Huevo frito | 2,500 |
| Hogao doble | 2,500 |
| Doble relleno | 6,900 |
| Fuse extra | 1,500 |

### Bebidas
| Bebida | Precio |
|--------|--------|
| Limonada natural | 5,000 |
| Limonada de panela | 5,500 |
| Agua | 3,000 |
| Gaseosa | 4,000 |

### Combos
| Combo | Contenido | Precio | Ahorro |
|-------|-----------|--------|--------|
| Para Uno | Jacket + Bebida | 36,900 | 4,000 |
| Para Dos | 2 Jackets + 2 Bebidas | 69,900 | 9,900 |

### Precios
- Sin símbolo $. Solo el número con separador de miles: `32,900`.
- Tipografía: JetBrains Mono.
- Color: tinta sobre cream, mostaza sobre fondos oscuros.

## Flujo de pedido (build path)
```
1. Elegir formato    → Jacket o Loaded
2. Elegir producto   → La Fija, Loaded Pollo, etc.
3. "Hágala mejor"    → Add-ons opcionales
4. "Complete pedido" → Bebida
```

## Orden del menú digital
```
1. COMBOS       ← anclan ticket alto
2. JACKETS      ← héroe
3. LOADED       ← compartible, precio de entrada
4. EXTRAS       ← add-ons sueltos
5. BEBIDAS      ← impulso al final
```

## Tono de voz en la interfaz
- Habla de **usted** siempre. Nunca tú, nunca vos.
- Directa, sin postureo, humor seco.
- Descripciones = lista de ingredientes separados por punto. No adjetivos.
- Palabras PROHIBIDAS en toda la interfaz: premium, gourmet, lujo, exclusivo, pasión, hecho con amor, tradición, artesanal, "rico".
- Modismos santandereanos permitidos con dosis: "mano" (máx 1 por vista).
- El producto se llama "Jacket" (nunca "papa horneada", "papa rellena", "jacket potato").
- CTAs: "AGREGAR AL PEDIDO", "IR A PAGAR", "VER PEDIDO", "HÁGALA MEJOR", "COMPLETE SU PEDIDO".

## UX implementado en el boceto actual
- Modal bottom-sheet con slide animation + swipe-to-close.
- Cart drawer expandible con items, remove, subtotal.
- Toast notifications al agregar items.
- Stepper (+/-) para extras y bebidas.
- Trust bar: "30-45 min · Cabecera · Cañaveral · Sotomayor".
- Inline education "PRIMERA VEZ?" dentro de sección Jackets (localStorage).
- "EMPIECE POR ESTA" highlight en La Fija para visitantes nuevos.
- Barra progreso domicilio gratis ($60K umbral).
- Staggered scroll-reveal (IntersectionObserver, 80ms stagger).
- Price count-up animation en totales.
- Desktop: layout 2 columnas (menú + cart sticky).
- WhatsApp flotante.
- iPhone safe area (env(safe-area-inset-bottom)).
- Empty states: "Su pedido está vacío. La papa no se hornea sola."

## Mejoras pendientes (investigadas, no implementadas)
- Dark mode (CSS custom properties, burgundy como fondo).
- Skeleton loading on-brand (shimmer mostaza).
- Order number como identidad (#047) post-checkout.
- Checkout real (Wompi integration).
- Order tracking page.
- Estado cocina en tiempo real (Supabase Realtime).
- Tipografía editorial como hero visual (Anton a 80px en cards).

## Reglas de desarrollo
- Mobile-first SIEMPRE. Diseñar para 375px, escalar a desktop.
- Cada cambio debe funcionar al abrir el HTML directamente en navegador.
- No agregar dependencias externas a menos que sea estrictamente necesario.
- Cuando migre a Next.js: App Router, Server Components por defecto, Client Components solo donde haya interactividad.
- Supabase: Row Level Security habilitado siempre.
- Código limpio, sin comentarios obvios. El código se explica solo.
