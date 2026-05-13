---
name: springs-nextjs-migrate
description: Guía para migrar el boceto HTML estático a Next.js 14 App Router + Supabase. Usar cuando se inicie la migración.
---

# Springs — Migración a Next.js 14

Guía completa para migrar el boceto (`index.html`) a un proyecto Next.js 14 con Supabase.

## Estructura de proyecto objetivo

```
springs-web/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, cart provider)
│   ├── page.tsx            # Home/menú (server component)
│   ├── tracking/
│   │   └── [orderId]/
│   │       └── page.tsx    # Order tracking
│   ├── primera-vez/
│   │   └── page.tsx        # Landing migración Rappi
│   └── api/
│       ├── webhook/
│       │   └── wompi/
│       │       └── route.ts # Wompi payment webhooks
│       └── orders/
│           └── route.ts     # Order CRUD
├── components/
│   ├── menu/
│   │   ├── ProductCard.tsx
│   │   ├── ComboCard.tsx
│   │   ├── ProductModal.tsx
│   │   ├── ExtrasSection.tsx
│   │   └── CategoryNav.tsx
│   ├── cart/
│   │   ├── CartBar.tsx
│   │   ├── CartDrawer.tsx
│   │   └── CartProvider.tsx  # Context provider
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   └── WompiButton.tsx
│   ├── ui/
│   │   ├── Toast.tsx
│   │   ├── DeliveryProgress.tsx
│   │   └── TrustBar.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── WhatsAppButton.tsx
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── cart.ts             # Cart state logic
│   ├── products.ts         # Product data & types
│   └── utils.ts            # fmt(), animatePrice(), etc.
├── types/
│   └── index.ts            # TypeScript types
├── public/
│   ├── fonts/              # Local fonts si se decide
│   └── images/             # Product photos cuando existan
├── CLAUDE.md
└── .skills/
```

## Principios de migración

1. **Server Components por defecto.** Solo marcar `'use client'` donde haya interactividad (cart, modals, steppers).
2. **Cart state en Context.** Un `CartProvider` en el root layout que maneja todo el estado del carrito.
3. **Productos como data estática** inicialmente (archivo `lib/products.ts`), migrar a Supabase cuando haya admin panel.
4. **Supabase solo para:** orders, customers, waitlist, referral_codes, discount_codes. NO para productos (son estáticos por ahora).
5. **Wompi webhook** en API route para confirmar pagos.
6. **Metadata SEO** en cada page con `generateMetadata`.

## Supabase schema

```sql
CREATE SEQUENCE jacket_number_seq START 1;

CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  neighborhood TEXT,
  address TEXT,
  first_source TEXT DEFAULT 'web',
  total_orders INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jacket_number INTEGER DEFAULT nextval('jacket_number_seq'),
  customer_id UUID REFERENCES customers(id),
  source TEXT NOT NULL DEFAULT 'web',
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  delivery_address TEXT,
  rating INTEGER,
  utm_source TEXT,
  referral_code TEXT,
  discount_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  delivered_at TIMESTAMPTZ
);

CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  neighborhood TEXT,
  source TEXT DEFAULT 'organic',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  code TEXT UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Orden de migración
1. `npx create-next-app@latest` con TypeScript, Tailwind NO (CSS puro, on-brand), App Router.
2. Layout raíz con fonts (Google Fonts via next/font).
3. CartProvider (Context + useReducer).
4. Componentes UI base (Toast, TrustBar, Header, Footer).
5. Menú page con productos estáticos.
6. ProductModal con add-ons.
7. CartBar + CartDrawer.
8. Checkout form + Wompi integración.
9. Supabase: crear tablas, conectar orders.
10. Deploy a Vercel.

## Tailwind: NO
Springs usa CSS puro con variables. El design system es tan cerrado (4 colores, 3 fonts, 0 border-radius) que Tailwind agrega complejidad sin beneficio. Mantener CSS embebido o modules.
