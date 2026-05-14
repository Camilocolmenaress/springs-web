# Springs Web — Backend Robusto: Spec de Diseño

**Fecha:** 2026-05-13
**Autor:** Camilo
**Estado:** Aprobado en brainstorming

## Resumen

Backend completo para soportar una experiencia de e-commerce nivel Vicio: pedidos en tiempo real, disponibilidad dinámica, horarios de operación, domicilio inteligente, checkout flexible (efectivo/Nequi/transferencia), tracking de pedido por link único, contenido dinámico, panel de administración y comandera de cocina.

Todo vive en la misma app Next.js 16. Un solo deploy en Vercel, un solo Supabase.

## Decisiones tomadas

| Decisión | Elección | Razón |
|----------|----------|-------|
| Admin vs Cocina | Separados (/admin y /cocina) | Steicy necesita vista simple; dueños necesitan control total |
| Confirmación de pago | Steicy confirma manual en /cocina | No hay pasarela de pagos; Nequi/transferencia se verifican a ojo |
| Contenido dinámico | Frase del día + producto destacado | Ambos editables desde /admin |
| Tracking del pedido | Link único enviado por WhatsApp | springs.com.co/pedido/[token] con estado en tiempo real |
| Autenticación | PIN numérico | Un PIN para /cocina, otro para /admin. Hasheado en DB |
| Zonas de cobertura | No aplica | Solo un punto (dark kitchen) |
| Pasarela de pagos | No para lanzamiento | Checkout flexible: efectivo, Nequi, transferencia |

## Arquitectura

### Estructura de archivos (solo backend — scope de Camilo)

```
src/
├── app/
│   ├── (tienda)/
│   │   └── pedido/
│   │       └── [token]/
│   │           └── page.tsx          ← Tracking en tiempo real (client component)
│   ├── cocina/
│   │   └── page.tsx                  ← Comandera Steicy (client component, PIN)
│   ├── admin/
│   │   └── page.tsx                  ← Panel de control (client component, PIN)
│   └── api/
│       ├── products/
│       │   └── route.ts              ← GET productos (ya existe)
│       ├── products/[id]/
│       │   └── route.ts              ← PATCH disponibilidad/precio
│       ├── orders/
│       │   └── route.ts              ← POST crear pedido (ya existe, se expande)
│       ├── orders/[id]/
│       │   └── route.ts              ← PATCH cambiar estado, GET detalle
│       ├── settings/
│       │   └── route.ts              ← GET/PUT horarios, domicilio, config
│       ├── content/
│       │   └── route.ts              ← GET/PUT frase del día, producto destacado
│       └── auth/
│           └── route.ts              ← POST verificar PIN, emitir cookie
├── lib/
│   ├── supabase.ts                   ← Cliente (ya existe)
│   ├── auth.ts                       ← Validación de PIN y cookie
│   └── horarios.ts                   ← Lógica de horarios y disponibilidad
└── data/
    └── productos.ts                  ← Fallback estático (ya existe)
```

### Base de datos — cambios en Supabase

#### Tabla `orders` — columnas nuevas

```sql
ALTER TABLE orders
  ADD COLUMN metodo_pago text CHECK (metodo_pago IN ('efectivo','nequi','transferencia')),
  ADD COLUMN tracking_token text UNIQUE,
  ADD COLUMN direccion text,
  ADD COLUMN nombre_cliente text,
  ADD COLUMN pago_confirmado boolean DEFAULT false,
  ADD COLUMN subtotal integer,
  ADD COLUMN domicilio integer DEFAULT 0;
```

Estados (ya existe el CHECK constraint, se actualiza):
```sql
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_estado_check;
ALTER TABLE orders ADD CONSTRAINT orders_estado_check
  CHECK (estado IN ('nuevo','confirmado','preparando','listo','en_camino','entregado','cancelado'));
```

#### Tabla nueva: `settings`

```sql
CREATE TABLE settings (
  id text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Lectura pública EXCEPTO los PINs (esos solo se leen server-side con service_role)
CREATE POLICY "settings visibles" ON settings FOR SELECT
  USING (id NOT IN ('pin_cocina', 'pin_admin'));
```

Datos iniciales:
```sql
INSERT INTO settings (id, value) VALUES
  ('horarios', '{
    "lunes": {"abre":"11:00","cierra":"21:00"},
    "martes": {"abre":"11:00","cierra":"21:00"},
    "miercoles": {"abre":"11:00","cierra":"21:00"},
    "jueves": {"abre":"11:00","cierra":"21:00"},
    "viernes": {"abre":"11:00","cierra":"22:00"},
    "sabado": {"abre":"11:00","cierra":"22:00"},
    "domingo": null
  }'),
  ('domicilio', '{"tarifa":5000,"umbral_gratis":60000}'),
  ('checkout', '{"metodos_pago":["efectivo","nequi","transferencia"],"nequi_numero":"","cuenta_banco":""}'),
  ('pin_cocina', '{"hash":""}'),
  ('pin_admin', '{"hash":""}');
```

#### Tabla nueva: `content`

```sql
CREATE TABLE content (
  id text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content visible" ON content FOR SELECT USING (true);
```

Datos iniciales:
```sql
INSERT INTO content (id, value) VALUES
  ('frase_del_dia', '{"texto":"Hoy se hornea con criterio."}'),
  ('producto_destacado', '{"product_id":null}');
```

## Contratos de API

### POST /api/orders (expandido)

**Request:**
```typescript
{
  items: [{
    product_id: string,
    nombre_producto: string,
    cantidad: number,
    precio_unitario: number
  }],
  nombre_cliente: string,
  telefono: string,
  direccion: string,
  metodo_pago: "efectivo" | "nequi" | "transferencia"
}
```

**Validaciones antes de crear:**
1. Verificar que la cocina está abierta (consultar settings.horarios)
2. Verificar que todos los productos tienen `disponible = true`
3. Calcular domicilio: subtotal >= umbral_gratis ? 0 : tarifa
4. Generar tracking_token (nanoid de 10 caracteres)

**Response 200:**
```typescript
{
  numero_pedido: number,
  tracking_token: string,
  tracking_url: string,
  subtotal: number,
  domicilio: number,
  total: number,
  metodo_pago: string
}
```

**Response 400 (cocina cerrada):**
```json
{ "error": "cocina_cerrada", "mensaje": "Estamos descansando hasta mañana 11 AM." }
```

**Response 400 (producto no disponible):**
```json
{ "error": "producto_no_disponible", "productos": ["La Brava"] }
```

### PATCH /api/orders/[id]

**Request:**
```typescript
{
  estado?: "confirmado" | "preparando" | "listo" | "en_camino" | "entregado" | "cancelado",
  pago_confirmado?: boolean
}
```

**Transiciones válidas:**
```
nuevo → confirmado
confirmado → preparando
preparando → listo
listo → en_camino
en_camino → entregado
cualquiera → cancelado
```

Transición inválida → Response 400.

**Response 200:**
```typescript
{ id: string, numero_pedido: number, estado: string, pago_confirmado: boolean }
```

### GET /api/orders/[id]

Devuelve orden completa con items. Se usa para la página de tracking y la comandera.

**Response 200:**
```typescript
{
  id: string,
  numero_pedido: number,
  estado: string,
  metodo_pago: string,
  pago_confirmado: boolean,
  nombre_cliente: string,
  telefono: string,
  direccion: string,
  subtotal: number,
  domicilio: number,
  total: number,
  tracking_token: string,
  created_at: string,
  items: [{
    nombre_producto: string,
    cantidad: number,
    precio_unitario: number
  }]
}
```

### PATCH /api/products/[id]

**Request:**
```typescript
{
  disponible?: boolean,
  precio?: number,
  nombre?: string,
  descripcion?: string
}
```

**Response 200:** el producto actualizado.

### GET /api/settings

**Response 200:**
```typescript
{
  horarios: { lunes: {abre, cierra} | null, ... },
  domicilio: { tarifa: number, umbral_gratis: number },
  checkout: { metodos_pago: string[], nequi_numero: string, cuenta_banco: string },
  cocina_abierta: boolean  // calculado server-side según hora actual
}
```

### PUT /api/settings

Actualiza un setting específico.

**Request:**
```typescript
{ id: "horarios" | "domicilio" | "checkout", value: object }
```

### GET /api/content/frase

**Response 200:**
```json
{ "texto": "Hoy se hornea con criterio." }
```

### GET /api/content/destacado

**Response 200:**
```json
{ "product_id": "uuid-de-la-brava", "nombre": "La Brava", "precio": 34900 }
```

### PUT /api/content

**Request:**
```typescript
{ id: "frase_del_dia" | "producto_destacado", value: object }
```

### POST /api/auth

**Request:**
```typescript
{ pin: string, tipo: "cocina" | "admin" }
```

**Response 200:** Set-Cookie httpOnly con token de sesión.
**Response 401:** `{ "error": "PIN incorrecto" }` + contador de intentos.
**Response 429:** `{ "error": "Demasiados intentos. Espere 5 minutos." }`

## Flujo completo de un pedido

```
1. Cliente arma carrito en la web
2. Cliente llena formulario: nombre, teléfono, dirección, método de pago
3. Frontend llama POST /api/orders
4. Backend:
   a. Valida horario → si cerrado, retorna error
   b. Valida disponibilidad → si algo agotado, retorna error
   c. Calcula domicilio
   d. Genera tracking_token
   e. Inserta orden + items en Supabase
   f. Retorna numero_pedido + tracking_url
5. Frontend muestra confirmación con #número y link de tracking
6. Supabase Realtime notifica a /cocina → pedido aparece
7. Steicy ve el pedido:
   - Si método = nequi/transferencia: espera la transferencia, confirma pago
   - Si método = efectivo: procede directo
   - Marca como "confirmado"
8. Steicy marca: preparando → listo → en_camino
9. Cliente ve cada cambio en /pedido/[token] en tiempo real
10. Domiciliario entrega → Steicy marca "entregado"
```

## Interfaces protegidas

### /cocina (Steicy)

- **Auth:** PIN numérico de 4 dígitos
- **Layout:** Pantalla completa, optimizada para tablet
- **Contenido:**
  - Lista de pedidos activos (no entregados/cancelados)
  - Ordenados: nuevos primero, luego por antigüedad
  - Cada tarjeta: #número, hora, items, método pago, dirección
  - Botón grande para avanzar estado (un toque)
  - Indicador de pago confirmado/pendiente
  - Sonido cuando llega pedido nuevo
- **Realtime:** Supabase channel en tabla orders (INSERT + UPDATE)
- **No incluye:** edición de productos, horarios, ni contenido

### /admin (Camilo + Juan David)

- **Auth:** PIN numérico de 6 dígitos
- **Layout:** Sidebar con secciones, optimizado para desktop
- **Secciones:**
  1. **Pedidos** — tabla con todos los pedidos, filtros por estado/fecha, detalle expandible
  2. **Productos** — lista de 21 productos, switch disponible/no disponible, editar precio inline
  3. **Horarios** — formulario: hora apertura/cierre por día, toggle abierto/cerrado
  4. **Domicilio** — editar tarifa y umbral de domicilio gratis
  5. **Contenido** — textarea para frase del día, dropdown para producto destacado
  6. **Configuración** — cambiar PIN de cocina, cambiar PIN de admin

## Supabase Realtime

Dos canales:

1. **Canal /cocina:** Suscrito a `orders` INSERT + UPDATE. Cuando llega un pedido nuevo o cambia estado, /cocina se actualiza sin refresh.

2. **Canal /pedido/[token]:** Suscrito a `orders` UPDATE filtrado por order ID. Cuando Steicy cambia el estado, la página de tracking del cliente se actualiza en vivo.

## Dependencias nuevas

- `nanoid` — generación de tracking tokens cortos y URL-safe
- `bcryptjs` — hash de PINs (o alternativa: usar crypto.subtle del runtime)

## Notas de seguridad

- Los PINs se guardan como hash bcrypt en la tabla `settings`. La RLS policy excluye los rows `pin_cocina` y `pin_admin` del SELECT público — solo se leen server-side con la service_role key.
- La service_role key de Supabase va en `.env.local` como `SUPABASE_SERVICE_ROLE_KEY` (no NEXT_PUBLIC, nunca expuesta al cliente).
- Las cookies de sesión de /admin y /cocina son httpOnly + secure + sameSite=strict.
- Los PINs iniciales están vacíos — la primera visita a /admin fuerza configuración del PIN.

## Qué NO incluye este spec

- Zonas de cobertura (no aplica, un solo punto)
- Pasarela Wompi (no para lanzamiento)
- Notificaciones WhatsApp automáticas (manual al inicio, n8n después)
- Registro/login de clientes (no hay cuentas)
- Analytics (Vercel Analytics + Meta Pixel se configuran aparte)
- Fotos de productos (responsabilidad de Juan David)
