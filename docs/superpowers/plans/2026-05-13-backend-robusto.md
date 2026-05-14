# Backend Robusto Springs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Backend completo para Springs: pedidos en tiempo real, checkout flexible, tracking, disponibilidad dinámica, horarios, domicilio inteligente, contenido dinámico, comandera /cocina, panel /admin.

**Architecture:** Todo en la misma app Next.js 16. APIs en `src/app/api/`, lógica compartida en `src/lib/`, páginas protegidas por PIN en `src/app/cocina/` y `src/app/admin/`. Supabase como DB + Realtime. Dos clientes Supabase: anon (público) y service_role (server-side para PINs).

**Tech Stack:** Next.js 16, TypeScript, Supabase (PostgreSQL + Realtime + RLS), nanoid, bcryptjs

**Spec:** `docs/superpowers/specs/2026-05-13-backend-robusto-design.md`

---

## File Map

```
src/
├── app/
│   ├── (tienda)/pedido/[token]/page.tsx    ← CREATE: tracking page
│   ├── cocina/page.tsx                      ← CREATE: comandera
│   ├── admin/page.tsx                       ← CREATE: panel admin
│   └── api/
│       ├── auth/route.ts                    ← CREATE: PIN auth
│       ├── content/route.ts                 ← CREATE: GET/PUT contenido
│       ├── orders/route.ts                  ← MODIFY: expand POST
│       ├── orders/[id]/route.ts             ← CREATE: GET detail + PATCH estado
│       ├── products/route.ts                ← EXISTS: no changes
│       ├── products/[id]/route.ts           ← CREATE: PATCH producto
│       └── settings/route.ts                ← CREATE: GET/PUT settings
├── lib/
│   ├── supabase.ts                          ← EXISTS: no changes
│   ├── supabase-admin.ts                    ← CREATE: service_role client
│   ├── auth.ts                              ← CREATE: PIN + cookie logic
│   └── horarios.ts                          ← CREATE: schedule logic
```

---

### Task 1: Database Migrations

Run all SQL via Supabase MCP. This sets up the foundation everything else depends on.

**Files:** None (SQL executed via MCP)

- [ ] **Step 1: ALTER orders table — add new columns**

```sql
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS metodo_pago text CHECK (metodo_pago IN ('efectivo','nequi','transferencia')),
  ADD COLUMN IF NOT EXISTS tracking_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS direccion text,
  ADD COLUMN IF NOT EXISTS nombre_cliente text,
  ADD COLUMN IF NOT EXISTS pago_confirmado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS subtotal integer,
  ADD COLUMN IF NOT EXISTS domicilio integer DEFAULT 0;
```

- [ ] **Step 2: Update orders estado CHECK constraint**

```sql
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_estado_check;
ALTER TABLE orders ADD CONSTRAINT orders_estado_check
  CHECK (estado IN ('nuevo','confirmado','preparando','listo','en_camino','entregado','cancelado'));
```

- [ ] **Step 3: Add UPDATE RLS policy on orders (needed for PATCH)**

```sql
CREATE POLICY IF NOT EXISTS "orders actualizables" ON orders FOR UPDATE USING (true);
```

- [ ] **Step 4: CREATE settings table + seed data**

```sql
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings visibles" ON settings FOR SELECT
  USING (id NOT IN ('pin_cocina', 'pin_admin'));

INSERT INTO settings (id, value) VALUES
  ('horarios', '{"lunes":{"abre":"11:00","cierra":"21:00"},"martes":{"abre":"11:00","cierra":"21:00"},"miercoles":{"abre":"11:00","cierra":"21:00"},"jueves":{"abre":"11:00","cierra":"21:00"},"viernes":{"abre":"11:00","cierra":"22:00"},"sabado":{"abre":"11:00","cierra":"22:00"},"domingo":null}'),
  ('domicilio', '{"tarifa":5000,"umbral_gratis":60000}'),
  ('checkout', '{"metodos_pago":["efectivo","nequi","transferencia"],"nequi_numero":"","cuenta_banco":""}'),
  ('pin_cocina', '{"hash":""}'),
  ('pin_admin', '{"hash":""}')
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 5: CREATE content table + seed data**

```sql
CREATE TABLE IF NOT EXISTS content (
  id text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content visible" ON content FOR SELECT USING (true);

INSERT INTO content (id, value) VALUES
  ('frase_del_dia', '{"texto":"Hoy se hornea con criterio."}'),
  ('producto_destacado', '{"product_id":null}')
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 6: Verify — list all tables and confirm columns**

Run: `mcp__claude_ai_Supabase__list_tables` with verbose=true
Expected: orders has new columns, settings and content tables exist with seed data.

---

### Task 2: Dependencies + Supabase Service Role Client

Install nanoid and bcryptjs. Create a second Supabase client using the service_role key (for reading PINs server-side, bypassing RLS).

**Files:**
- Modify: `package.json`
- Modify: `.env.local`
- Create: `src/lib/supabase-admin.ts`

- [ ] **Step 1: Install dependencies**

Run: `npm install nanoid bcryptjs && npm install -D @types/bcryptjs`

- [ ] **Step 2: Get service_role key from Supabase**

Run: `mcp__claude_ai_Supabase__get_publishable_keys` for project `qacxqqclkiwylkbeqdrk`
Copy the `service_role` key.

- [ ] **Step 3: Add service_role key to .env.local**

Add to `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=<the key from step 2>
```

This key is NOT prefixed with NEXT_PUBLIC_ — it must never be exposed to the client.

- [ ] **Step 4: Create supabase-admin.ts**

Create `src/lib/supabase-admin.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: compiles successfully.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/supabase-admin.ts
git commit -m "feat: add nanoid, bcryptjs, supabase service_role client"
```

---

### Task 3: Lib — Horarios + Auth

Shared logic used by multiple API routes. horarios.ts checks if the kitchen is open. auth.ts handles PIN hashing and cookie-based sessions.

**Files:**
- Create: `src/lib/horarios.ts`
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Create horarios.ts**

Create `src/lib/horarios.ts`:
```typescript
import { supabase } from "./supabase";

interface Horario {
  abre: string;
  cierra: string;
}

type DiaSemana =
  | "domingo"
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado";

const DIAS: DiaSemana[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

export async function esCocinaAbierta(): Promise<{
  abierta: boolean;
  mensaje?: string;
}> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "horarios")
    .single();

  if (!data) return { abierta: false, mensaje: "No se pudieron cargar los horarios." };

  const ahora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
  const dia = DIAS[ahora.getDay()];
  const horario: Horario | null = data.value[dia];

  if (!horario) {
    return { abierta: false, mensaje: "Hoy no abrimos. Vuelva manana." };
  }

  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
  const [abreH, abreM] = horario.abre.split(":").map(Number);
  const [cierraH, cierraM] = horario.cierra.split(":").map(Number);
  const abreMin = abreH * 60 + abreM;
  const cierraMin = cierraH * 60 + cierraM;

  if (horaActual < abreMin) {
    return {
      abierta: false,
      mensaje: `Estamos descansando. Abrimos hoy a las ${horario.abre}.`,
    };
  }

  if (horaActual >= cierraMin) {
    return {
      abierta: false,
      mensaje: "Estamos descansando hasta manana.",
    };
  }

  return { abierta: true };
}
```

- [ ] **Step 2: Create auth.ts**

Create `src/lib/auth.ts`:
```typescript
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase-admin";

const SESSION_COOKIE = "springs_session";
const SESSION_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}

export async function verifyPin(
  pin: string,
  tipo: "cocina" | "admin"
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("settings")
    .select("value")
    .eq("id", `pin_${tipo}`)
    .single();

  if (!data || !data.value.hash) return false;
  return bcrypt.compare(pin, data.value.hash);
}

export async function isPinConfigured(
  tipo: "cocina" | "admin"
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("settings")
    .select("value")
    .eq("id", `pin_${tipo}`)
    .single();

  return Boolean(data?.value?.hash);
}

export async function setPin(
  pin: string,
  tipo: "cocina" | "admin"
): Promise<void> {
  const hash = await hashPin(pin);
  await supabaseAdmin
    .from("settings")
    .update({ value: { hash }, updated_at: new Date().toISOString() })
    .eq("id", `pin_${tipo}`);
}

export function createSessionToken(tipo: "cocina" | "admin"): string {
  const payload = `${tipo}:${Date.now()}`;
  return Buffer.from(`${payload}:${SESSION_SECRET.slice(0, 16)}`).toString(
    "base64"
  );
}

export async function setSessionCookie(tipo: "cocina" | "admin") {
  const token = createSessionToken(tipo);
  const cookieStore = await cookies();
  cookieStore.set(`${SESSION_COOKIE}_${tipo}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 12, // 12 horas
    path: `/${tipo}`,
  });
}

export async function isAuthenticated(
  tipo: "cocina" | "admin"
): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(`${SESSION_COOKIE}_${tipo}`);
  if (!token?.value) return false;

  try {
    const decoded = Buffer.from(token.value, "base64").toString("utf-8");
    return decoded.endsWith(`:${SESSION_SECRET.slice(0, 16)}`);
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles successfully (libs are tree-shaken, only used when imported).

- [ ] **Step 4: Commit**

```bash
git add src/lib/horarios.ts src/lib/auth.ts
git commit -m "feat: add horarios + auth libs (schedule check, PIN, sessions)"
```

---

### Task 4: API — /api/auth

PIN verification endpoint. Used by /cocina and /admin login screens.

**Files:**
- Create: `src/app/api/auth/route.ts`

- [ ] **Step 1: Create auth route**

Create `src/app/api/auth/route.ts`:
```typescript
import { verifyPin, isPinConfigured, setPin, setSessionCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { pin, tipo } = await request.json();

  if (!pin || !tipo || !["cocina", "admin"].includes(tipo)) {
    return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
  }

  const configured = await isPinConfigured(tipo);

  // Primera vez: configurar el PIN
  if (!configured) {
    if (pin.length < 4) {
      return NextResponse.json(
        { error: "El PIN debe tener al menos 4 digitos." },
        { status: 400 }
      );
    }
    await setPin(pin, tipo);
    await setSessionCookie(tipo);
    return NextResponse.json({ ok: true, first_setup: true });
  }

  // Verificar PIN existente
  const valid = await verifyPin(pin, tipo);
  if (!valid) {
    return NextResponse.json({ error: "PIN incorrecto." }, { status: 401 });
  }

  await setSessionCookie(tipo);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles, `/api/auth` appears as dynamic route.

- [ ] **Step 3: Test — set up initial PIN**

Run dev server, then:
```bash
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"pin":"1234","tipo":"cocina"}' | python3 -m json.tool
```
Expected: `{ "ok": true, "first_setup": true }`

- [ ] **Step 4: Test — verify PIN**

```bash
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"pin":"1234","tipo":"cocina"}' | python3 -m json.tool
```
Expected: `{ "ok": true }`

- [ ] **Step 5: Test — wrong PIN**

```bash
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"pin":"9999","tipo":"cocina"}' | python3 -m json.tool
```
Expected: `{ "error": "PIN incorrecto." }` with status 401.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/auth/route.ts
git commit -m "feat: POST /api/auth — PIN verification + first-time setup"
```

---

### Task 5: API — /api/settings + /api/content

Settings: horarios, domicilio, checkout config. Content: frase del día, producto destacado.

**Files:**
- Create: `src/app/api/settings/route.ts`
- Create: `src/app/api/content/route.ts`

- [ ] **Step 1: Create settings route**

Create `src/app/api/settings/route.ts`:
```typescript
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAuthenticated } from "@/lib/auth";
import { esCocinaAbierta } from "@/lib/horarios";
import { NextResponse } from "next/server";

export async function GET() {
  const { data } = await supabase
    .from("settings")
    .select("id, value");

  if (!data) {
    return NextResponse.json({ error: "Error cargando settings." }, { status: 500 });
  }

  const settings: Record<string, unknown> = {};
  for (const row of data) {
    settings[row.id] = row.value;
  }

  const { abierta } = await esCocinaAbierta();
  settings.cocina_abierta = abierta;

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated("admin");
  if (!authed) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id, value } = await request.json();
  const allowedIds = ["horarios", "domicilio", "checkout"];

  if (!allowedIds.includes(id)) {
    return NextResponse.json({ error: "Setting no valido." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create content route**

Create `src/app/api/content/route.ts`:
```typescript
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAuthenticated } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const { data } = await supabase
      .from("content")
      .select("value")
      .eq("id", id)
      .single();

    if (!data) {
      return NextResponse.json({ error: "Contenido no encontrado." }, { status: 404 });
    }

    // Si es producto_destacado, enriquecer con datos del producto
    if (id === "producto_destacado" && data.value.product_id) {
      const { data: producto } = await supabase
        .from("products")
        .select("nombre, precio")
        .eq("id", data.value.product_id)
        .single();

      return NextResponse.json({ ...data.value, ...producto });
    }

    return NextResponse.json(data.value);
  }

  // Sin id: devolver todo el contenido
  const { data } = await supabase.from("content").select("id, value");
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated("admin");
  if (!authed) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id, value } = await request.json();
  const allowedIds = ["frase_del_dia", "producto_destacado"];

  if (!allowedIds.includes(id)) {
    return NextResponse.json({ error: "Contenido no valido." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("content")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles, both routes appear.

- [ ] **Step 4: Test settings GET**

```bash
curl -s http://localhost:3000/api/settings | python3 -m json.tool
```
Expected: JSON with horarios, domicilio, checkout, cocina_abierta fields.

- [ ] **Step 5: Test content GET**

```bash
curl -s "http://localhost:3000/api/content?id=frase_del_dia" | python3 -m json.tool
```
Expected: `{ "texto": "Hoy se hornea con criterio." }`

- [ ] **Step 6: Commit**

```bash
git add src/app/api/settings/route.ts src/app/api/content/route.ts
git commit -m "feat: GET/PUT /api/settings + /api/content"
```

---

### Task 6: API — PATCH /api/products/[id]

Toggle product availability and edit fields from /admin.

**Files:**
- Create: `src/app/api/products/[id]/route.ts`

- [ ] **Step 1: Create product patch route**

Create `src/app/api/products/[id]/route.ts`:
```typescript
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated("admin");
  if (!authed) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const allowed = ["disponible", "precio", "nombre", "descripcion"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/products/\[id\]/route.ts
git commit -m "feat: PATCH /api/products/[id] — toggle availability, edit fields"
```

---

### Task 7: Expand POST /api/orders + GET/PATCH /api/orders/[id]

The big one. Expand the existing orders POST with validations (horario, disponibilidad, domicilio, tracking_token). Create orders/[id] for state transitions and order detail.

**Files:**
- Modify: `src/app/api/orders/route.ts`
- Create: `src/app/api/orders/[id]/route.ts`

- [ ] **Step 1: Rewrite orders POST**

Replace `src/app/api/orders/route.ts` entirely:
```typescript
import { supabase } from "@/lib/supabase";
import { esCocinaAbierta } from "@/lib/horarios";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

interface OrderItem {
  product_id: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

interface OrderRequest {
  items: OrderItem[];
  nombre_cliente: string;
  telefono: string;
  direccion: string;
  metodo_pago: "efectivo" | "nequi" | "transferencia";
}

export async function POST(request: Request) {
  const body: OrderRequest = await request.json();

  // Validar campos requeridos
  if (!body.items?.length) {
    return NextResponse.json(
      { error: "El pedido no tiene productos." },
      { status: 400 }
    );
  }
  if (!body.nombre_cliente || !body.telefono || !body.direccion) {
    return NextResponse.json(
      { error: "Faltan datos: nombre, telefono o direccion." },
      { status: 400 }
    );
  }
  if (!["efectivo", "nequi", "transferencia"].includes(body.metodo_pago)) {
    return NextResponse.json(
      { error: "Metodo de pago no valido." },
      { status: 400 }
    );
  }

  // Validar horario
  const { abierta, mensaje } = await esCocinaAbierta();
  if (!abierta) {
    return NextResponse.json(
      { error: "cocina_cerrada", mensaje },
      { status: 400 }
    );
  }

  // Validar disponibilidad de productos
  const productIds = body.items.map((i) => i.product_id);
  const { data: productos } = await supabase
    .from("products")
    .select("id, nombre, disponible")
    .in("id", productIds);

  if (productos) {
    const noDisponibles = productos
      .filter((p) => !p.disponible)
      .map((p) => p.nombre);
    if (noDisponibles.length > 0) {
      return NextResponse.json(
        { error: "producto_no_disponible", productos: noDisponibles },
        { status: 400 }
      );
    }
  }

  // Calcular subtotal y domicilio
  const subtotal = body.items.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );

  const { data: domicilioConfig } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "domicilio")
    .single();

  const umbralGratis = domicilioConfig?.value?.umbral_gratis ?? 60000;
  const tarifaDomicilio = domicilioConfig?.value?.tarifa ?? 5000;
  const domicilio = subtotal >= umbralGratis ? 0 : tarifaDomicilio;
  const total = subtotal + domicilio;

  // Generar tracking token
  const tracking_token = nanoid(10);

  // Insertar orden
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      subtotal,
      domicilio,
      total,
      nombre_cliente: body.nombre_cliente,
      telefono: body.telefono,
      direccion: body.direccion,
      metodo_pago: body.metodo_pago,
      tracking_token,
    })
    .select("id, numero_pedido")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message || "Error al crear la orden." },
      { status: 500 }
    );
  }

  // Insertar items
  const itemsToInsert = body.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    nombre_producto: item.nombre_producto,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Error al guardar los productos del pedido." },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://springs.com.co";

  return NextResponse.json({
    numero_pedido: order.numero_pedido,
    tracking_token,
    tracking_url: `${baseUrl}/pedido/${tracking_token}`,
    subtotal,
    domicilio,
    total,
    metodo_pago: body.metodo_pago,
  });
}
```

- [ ] **Step 2: Create orders/[id] route**

Create `src/app/api/orders/[id]/route.ts`:
```typescript
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const TRANSICIONES_VALIDAS: Record<string, string[]> = {
  nuevo: ["confirmado", "cancelado"],
  confirmado: ["preparando", "cancelado"],
  preparando: ["listo", "cancelado"],
  listo: ["en_camino", "cancelado"],
  en_camino: ["entregado", "cancelado"],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Buscar por ID o por tracking_token
  let query = supabase.from("orders").select("*");
  if (id.length <= 12) {
    query = query.eq("tracking_token", id);
  } else {
    query = query.eq("id", id);
  }

  const { data: order, error } = await query.single();

  if (error || !order) {
    return NextResponse.json(
      { error: "Pedido no encontrado." },
      { status: 404 }
    );
  }

  // Cargar items
  const { data: items } = await supabase
    .from("order_items")
    .select("nombre_producto, cantidad, precio_unitario")
    .eq("order_id", order.id);

  return NextResponse.json({ ...order, items: items || [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Obtener estado actual
  const { data: order } = await supabase
    .from("orders")
    .select("id, estado")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json(
      { error: "Pedido no encontrado." },
      { status: 404 }
    );
  }

  const updates: Record<string, unknown> = {};

  // Validar transición de estado
  if (body.estado) {
    const permitidos = TRANSICIONES_VALIDAS[order.estado];
    if (!permitidos || !permitidos.includes(body.estado)) {
      return NextResponse.json(
        {
          error: `No se puede pasar de "${order.estado}" a "${body.estado}".`,
        },
        { status: 400 }
      );
    }
    updates.estado = body.estado;
  }

  if (typeof body.pago_confirmado === "boolean") {
    updates.pago_confirmado = body.pago_confirmado;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nada que actualizar." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select("id, numero_pedido, estado, pago_confirmado")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles, `/api/orders` and `/api/orders/[id]` appear.

- [ ] **Step 4: Test expanded POST /api/orders**

Start dev server, get a real product ID, then:
```bash
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":"<REAL_ID>","nombre_producto":"La Fija","cantidad":1,"precio_unitario":32900}],"nombre_cliente":"Test","telefono":"3001234567","direccion":"Cra 33 #48-20","metodo_pago":"nequi"}' | python3 -m json.tool
```
Expected: response with numero_pedido, tracking_token, tracking_url, subtotal, domicilio, total.

- [ ] **Step 5: Test GET /api/orders/[id]**

Using the tracking_token from step 4:
```bash
curl -s http://localhost:3000/api/orders/<tracking_token> | python3 -m json.tool
```
Expected: full order with items array.

- [ ] **Step 6: Test PATCH state transition**

Using the order id from step 4:
```bash
curl -s -X PATCH http://localhost:3000/api/orders/<order_id> \
  -H "Content-Type: application/json" \
  -d '{"estado":"confirmado","pago_confirmado":true}' | python3 -m json.tool
```
Expected: `{ "id": "...", "numero_pedido": N, "estado": "confirmado", "pago_confirmado": true }`

- [ ] **Step 7: Clean up test data and commit**

```sql
DELETE FROM order_items; DELETE FROM orders;
ALTER SEQUENCE orders_numero_pedido_seq RESTART WITH 1;
```

```bash
git add src/app/api/orders/route.ts src/app/api/orders/\[id\]/route.ts
git commit -m "feat: expand POST /api/orders (validations, tracking) + GET/PATCH /api/orders/[id]"
```

---

### Task 8: Page — /pedido/[token] (Order Tracking)

Customer-facing page. Loads order by tracking token, shows status in real time via Supabase Realtime.

**Files:**
- Create: `src/app/(tienda)/pedido/[token]/page.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/app/\(tienda\)/pedido/\[token\]
```

- [ ] **Step 2: Create tracking page**

Create `src/app/(tienda)/pedido/[token]/page.tsx`:
```tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import TrackingClient from "./TrackingClient";

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select("id, numero_pedido, estado, metodo_pago, pago_confirmado, nombre_cliente, subtotal, domicilio, total, created_at")
    .eq("tracking_token", token)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("nombre_producto, cantidad, precio_unitario")
    .eq("order_id", order.id);

  return <TrackingClient order={order} items={items || []} />;
}
```

- [ ] **Step 3: Create TrackingClient component**

Create `src/app/(tienda)/pedido/[token]/TrackingClient.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface OrderData {
  id: string;
  numero_pedido: number;
  estado: string;
  metodo_pago: string;
  pago_confirmado: boolean;
  nombre_cliente: string;
  subtotal: number;
  domicilio: number;
  total: number;
  created_at: string;
}

interface OrderItem {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

const ESTADOS = ["nuevo", "confirmado", "preparando", "listo", "en_camino", "entregado"];
const ESTADO_LABEL: Record<string, string> = {
  nuevo: "PEDIDO RECIBIDO",
  confirmado: "PAGO CONFIRMADO",
  preparando: "EN PREPARACION",
  listo: "LISTO",
  en_camino: "EN CAMINO",
  entregado: "ENTREGADO",
  cancelado: "CANCELADO",
};

export default function TrackingClient({
  order: initialOrder,
  items,
}: {
  order: OrderData;
  items: OrderItem[];
}) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const estadoIndex = ESTADOS.indexOf(order.estado);
  const isCancelado = order.estado === "cancelado";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <p className="font-mono text-xs text-tinta/40 tracking-[3px] mb-2">
          PEDIDO
        </p>
        <h1 className="font-display text-6xl text-tinta">
          #{String(order.numero_pedido).padStart(3, "0")}
        </h1>

        <div className="mt-8 border-t border-tinta/10 pt-6">
          <p className="font-display text-xl tracking-[2px] text-burgundy">
            {isCancelado ? "CANCELADO" : ESTADO_LABEL[order.estado]}
          </p>

          {!isCancelado && (
            <div className="flex gap-1 mt-4">
              {ESTADOS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 ${
                    i <= estadoIndex ? "bg-burgundy" : "bg-tinta/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-tinta/10 pt-6">
          <p className="font-mono text-[10px] text-tinta/40 tracking-[2px] mb-3">
            DETALLE
          </p>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-tinta/5"
            >
              <span className="font-sans text-sm">
                {item.cantidad}x {item.nombre_producto}
              </span>
              <span className="font-mono text-sm">
                {(item.cantidad * item.precio_unitario).toLocaleString("es-CO")}
              </span>
            </div>
          ))}

          {order.domicilio > 0 && (
            <div className="flex justify-between py-2 border-b border-tinta/5">
              <span className="font-sans text-sm text-tinta/50">Domicilio</span>
              <span className="font-mono text-sm">
                {order.domicilio.toLocaleString("es-CO")}
              </span>
            </div>
          )}

          <div className="flex justify-between py-3 mt-1">
            <span className="font-display text-lg tracking-wide">TOTAL</span>
            <span className="font-mono text-lg font-medium">
              {order.total.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <p className="font-sans text-xs text-tinta/30 mt-8 text-center">
          Esta pagina se actualiza automaticamente.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: compiles, `/pedido/[token]` appears.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(tienda)/pedido/[token]/page.tsx" "src/app/(tienda)/pedido/[token]/TrackingClient.tsx"
git commit -m "feat: /pedido/[token] — order tracking page with Realtime"
```

---

### Task 9: Page — /cocina (Comandera)

Steicy's kitchen view. PIN login, list of active orders, state change buttons, Supabase Realtime for live updates.

**Files:**
- Create: `src/app/cocina/page.tsx`

- [ ] **Step 1: Create cocina page**

Create `src/app/cocina/page.tsx`:
```tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Order {
  id: string;
  numero_pedido: number;
  estado: string;
  metodo_pago: string;
  pago_confirmado: boolean;
  nombre_cliente: string;
  telefono: string;
  direccion: string;
  total: number;
  created_at: string;
  items?: { nombre_producto: string; cantidad: number }[];
}

const SIGUIENTE_ESTADO: Record<string, string> = {
  nuevo: "confirmado",
  confirmado: "preparando",
  preparando: "listo",
  listo: "en_camino",
  en_camino: "entregado",
};

const ESTADO_LABEL: Record<string, string> = {
  nuevo: "NUEVO",
  confirmado: "CONFIRMADO",
  preparando: "PREPARANDO",
  listo: "LISTO",
  en_camino: "EN CAMINO",
};

const ESTADO_COLOR: Record<string, string> = {
  nuevo: "bg-mostaza text-tinta",
  confirmado: "bg-burgundy text-cream",
  preparando: "bg-tinta text-cream",
  listo: "bg-burgundy text-cream",
  en_camino: "bg-tinta/50 text-cream",
};

export default function CocinaPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .not("estado", "in", '("entregado","cancelado")')
      .order("created_at", { ascending: true });

    if (!data) return;

    const ordersWithItems = await Promise.all(
      data.map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("nombre_producto, cantidad")
          .eq("order_id", order.id);
        return { ...order, items: items || [] };
      })
    );

    setOrders(ordersWithItems);
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, tipo: "cocina" }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuthed(true);
      loadOrders();
    } else {
      setPinError(data.error);
    }
  };

  const avanzarEstado = async (orderId: string, nuevoEstado: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
  };

  const confirmarPago = async (orderId: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_confirmado: true }),
    });
  };

  useEffect(() => {
    if (!authed) return;

    const channel = supabase
      .channel("cocina-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadOrders();
          // Play sound on new order
          audioRef.current?.play().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authed, loadOrders]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-tinta flex items-center justify-center">
        <div className="w-72 text-center">
          <h1 className="font-display text-3xl text-cream tracking-[4px] mb-8">
            COCINA
          </h1>
          <input
            type="password"
            inputMode="numeric"
            placeholder="PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-cream/10 text-cream font-mono text-center text-2xl tracking-[8px] py-4 border border-cream/20 focus:border-mostaza outline-none"
          />
          {pinError && (
            <p className="font-mono text-xs text-mostaza mt-3">{pinError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full mt-4 bg-burgundy text-cream font-display tracking-[3px] py-4 hover:opacity-85 transition-opacity"
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  const newOrders = orders.filter((o) => o.estado === "nuevo");
  const activeOrders = orders.filter((o) => o.estado !== "nuevo");

  return (
    <div className="min-h-screen bg-tinta p-4">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHjqDq8jPmUQfK2mew9i1YDcjTYOqy9CaRSAqdZbE2bJcNiZNga3N0JlFIytzm8fYsl04Jk+Crc3QmUUjKnOaw9iyXTgmT4KtzdCZRSMqc5rD2LJdOCZPgq3N0JlFIypzmsP" preload="auto" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-cream tracking-[4px]">
          SPRINGS COCINA
        </h1>
        <span className="font-mono text-xs text-cream/30">
          {orders.length} activos
        </span>
      </div>

      {newOrders.length > 0 && (
        <div className="mb-6">
          <p className="font-mono text-[10px] text-mostaza tracking-[3px] mb-3">
            NUEVOS
          </p>
          {newOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAvanzar={avanzarEstado}
              onConfirmarPago={confirmarPago}
            />
          ))}
        </div>
      )}

      {activeOrders.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-cream/30 tracking-[3px] mb-3">
            EN PROCESO
          </p>
          {activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAvanzar={avanzarEstado}
              onConfirmarPago={confirmarPago}
            />
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <p className="font-sans text-cream/20 text-center mt-20">
          Sin pedidos activos.
        </p>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onAvanzar,
  onConfirmarPago,
}: {
  order: Order;
  onAvanzar: (id: string, estado: string) => void;
  onConfirmarPago: (id: string) => void;
}) {
  const siguiente = SIGUIENTE_ESTADO[order.estado];

  return (
    <div className="bg-cream/5 border border-cream/10 p-5 mb-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-display text-2xl text-cream">
            #{String(order.numero_pedido).padStart(3, "0")}
          </span>
          <span
            className={`ml-3 font-mono text-[10px] tracking-[2px] px-2 py-1 ${ESTADO_COLOR[order.estado] || "bg-cream/10 text-cream"}`}
          >
            {ESTADO_LABEL[order.estado]}
          </span>
        </div>
        <span className="font-mono text-xs text-cream/30">
          {new Date(order.created_at).toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {order.items?.map((item, i) => (
          <p key={i} className="font-sans text-sm text-cream/70">
            {item.cantidad}x {item.nombre_producto}
          </p>
        ))}
      </div>

      <div className="mt-3 font-mono text-xs text-cream/40">
        <p>{order.nombre_cliente} · {order.telefono}</p>
        <p>{order.direccion}</p>
        <p className="mt-1">
          Pago: {order.metodo_pago}
          {order.metodo_pago !== "efectivo" && (
            <span className={order.pago_confirmado ? " text-green-400" : " text-mostaza"}>
              {order.pago_confirmado ? " · CONFIRMADO" : " · PENDIENTE"}
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        {order.metodo_pago !== "efectivo" && !order.pago_confirmado && (
          <button
            onClick={() => onConfirmarPago(order.id)}
            className="flex-1 bg-mostaza text-tinta font-mono text-xs tracking-[2px] py-3 hover:opacity-85 transition-opacity"
          >
            CONFIRMAR PAGO
          </button>
        )}
        {siguiente && (
          <button
            onClick={() => onAvanzar(order.id, siguiente)}
            className="flex-1 bg-burgundy text-cream font-mono text-xs tracking-[2px] py-3 hover:opacity-85 transition-opacity"
          >
            → {ESTADO_LABEL[siguiente] || siguiente.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles, `/cocina` appears.

- [ ] **Step 3: Commit**

```bash
git add src/app/cocina/page.tsx
git commit -m "feat: /cocina — comandera con PIN, pedidos Realtime, cambio de estado"
```

---

### Task 10: Page — /admin (Panel de Control)

Full admin panel with sidebar navigation: pedidos, productos, horarios, domicilio, contenido, configuración. Protected by PIN.

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create admin page**

Create `src/app/admin/page.tsx` — this is a large Client Component with tab navigation. Each section is a function within the same file (keeps it simple, no router needed for internal navigation).

The admin page has these sections:
- **Pedidos**: table with all orders, expandable detail, state/payment controls
- **Productos**: list with availability toggle (switch) and inline price edit
- **Horarios**: form with open/close time per day, closed toggle
- **Domicilio**: edit tarifa and umbral_gratis
- **Contenido**: textarea for frase del dia, product dropdown for destacado
- **Config**: change PINs for cocina and admin

Due to file size, this will be the largest single file. The implementation should use the same design tokens (burgundy, cream, tinta, mostaza, font-display, font-mono, font-sans) and follow Springs visual rules (zero border-radius, no icons, no emojis).

Write the complete page with all 6 sections functional: fetching from and writing to the APIs created in Tasks 4-7.

Key implementation details:
- Use `useState` for active tab
- Each section fetches its own data on mount
- Mutations call the corresponding API (PUT /api/settings, PUT /api/content, PATCH /api/products/[id])
- Pedidos section uses Supabase Realtime for live updates
- All forms use controlled inputs
- Auth check: call POST /api/auth on login, cookie handles the rest

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles, `/admin` appears.

- [ ] **Step 3: Manual test**

Open `http://localhost:3000/admin` in browser:
1. PIN login screen appears
2. After entering PIN, sidebar with sections appears
3. Navigate between sections
4. Toggle a product's availability
5. Change horario for a day
6. Edit frase del dia

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: /admin — panel completo (pedidos, productos, horarios, domicilio, contenido, config)"
```

---

### Task 11: Final Integration + Push

Verify everything works together end-to-end, then push.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: all routes compile.

- [ ] **Step 2: End-to-end flow test**

Start dev server and manually test the full flow:
1. `GET /api/settings` → verify cocina_abierta
2. `GET /api/products` → verify products with availability
3. `POST /api/orders` → create order with all new fields
4. `GET /api/orders/<tracking_token>` → verify tracking works
5. Open `/pedido/<token>` in browser → tracking page loads
6. `PATCH /api/orders/<id>` → advance state
7. Verify tracking page updates in real time
8. Open `/cocina` → login with PIN → verify order appears
9. Open `/admin` → login with PIN → verify all sections work

- [ ] **Step 3: Clean up test data**

```sql
DELETE FROM order_items; DELETE FROM orders;
ALTER SEQUENCE orders_numero_pedido_seq RESTART WITH 1;
```

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```
