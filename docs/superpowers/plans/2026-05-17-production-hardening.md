# Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar rate limiting, error tracking con Sentry y CI básico a Springs antes del lanzamiento.

**Architecture:** 3 tareas independientes — middleware Edge para rate limiting (Upstash Redis), instrumentación mínima de Sentry solo en rutas críticas, y un workflow de GitHub Actions que valida el build en cada push. Cada tarea produce un commit independiente y deployable.

**Tech Stack:** Next.js 16 App Router, @upstash/ratelimit + @upstash/redis, @sentry/nextjs, GitHub Actions.

---

## File Map

| Archivo | Acción | Tarea |
|---|---|---|
| `src/middleware.ts` | Crear | T1 |
| `next.config.ts` | Modificar (withSentryConfig) | T2 |
| `sentry.server.config.ts` | Crear | T2 |
| `sentry.client.config.ts` | Crear | T2 |
| `sentry.edge.config.ts` | Crear | T2 |
| `src/instrumentation.ts` | Crear | T2 |
| `.github/workflows/ci.yml` | Crear | T3 |

---

## Task 1: Rate Limiting con Upstash Redis

**Objetivo:** Proteger `POST /api/orders` (10 req/min/IP) y `POST /api/auth` (5 intentos/min/IP) con sliding window usando Edge Middleware.

**Por qué Upstash y no in-memory:** Vercel serverless es stateless — cada invocación es independiente. Un Map en memoria se resetea en cada request. Upstash Redis persiste el estado entre invocaciones con latencia <5ms desde su región más cercana.

**Files:**
- Create: `src/middleware.ts`

### Setup previo (hacer una sola vez, fuera del código)

- [ ] **Step 1: Crear cuenta Upstash y base de datos Redis**

  1. Ir a https://upstash.com → Sign Up (gratis, no requiere tarjeta).
  2. Create Database → Name: `springs-ratelimit` → Region: `US-East-1` (más cercana a Vercel) → Free tier.
  3. En el dashboard de la DB, copiar:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
  4. Agregar al `.env.local`:
     ```
     UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
     UPSTASH_REDIS_REST_TOKEN=AXxxxx
     ```
  5. Agregar las mismas vars en Vercel → Settings → Environment Variables.

- [ ] **Step 2: Instalar dependencias**

  ```bash
  npm install @upstash/ratelimit @upstash/redis
  ```

  Verificar que se agregaron a `package.json` antes de continuar.

### Implementación

- [ ] **Step 3: Crear `src/middleware.ts`**

  ```typescript
  import { Ratelimit } from "@upstash/ratelimit";
  import { Redis } from "@upstash/redis";
  import { NextResponse } from "next/server";
  import type { NextRequest } from "next/server";

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ordersLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "springs:orders",
  });

  const authLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "springs:auth",
  });

  export async function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";

    if (request.nextUrl.pathname === "/api/orders" && request.method === "POST") {
      const { success } = await ordersLimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intente en un momento." },
          { status: 429 }
        );
      }
    }

    if (request.nextUrl.pathname === "/api/auth" && request.method === "POST") {
      const { success } = await authLimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Demasiados intentos. Espere 1 minuto." },
          { status: 429 }
        );
      }
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ["/api/orders", "/api/auth"],
  };
  ```

### Verificación

- [ ] **Step 4: Verificar build local**

  ```bash
  npm run build
  ```

  Expected: build pasa sin errores. El middleware aparece en el output como ruta Edge.

- [ ] **Step 5: Verificar rate limit manualmente**

  Con el servidor corriendo (`npm run dev`):
  ```bash
  # Enviar 6 POSTs a /api/auth en rápida sucesión
  for i in {1..6}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/auth -H "Content-Type: application/json" -d '{"pin":"0000","tipo":"admin"}'; done
  ```
  Expected: primeros 5 retornan 400 o 401 (datos inválidos, pero pasaron el rate limit), el 6to retorna `429`.

- [ ] **Step 6: Commit**

  ```bash
  git add src/middleware.ts package.json package-lock.json
  git commit -m "feat(CAM): rate limiting Edge — orders 10/min, auth 5/min via Upstash"
  git push origin main
  ```

---

## Task 2: Error Tracking con Sentry

**Objetivo:** Capturar excepciones no manejadas en servidor (Node.js runtime) sin afectar archivos de Juan David.

**Alcance mínimo:** Solo server-side. No se instrumentan componentes de cliente (src/components/). Solo se registran errores, no se habilita tracing (tracesSampleRate: 0).

**Files:**
- Create: `sentry.server.config.ts`
- Create: `sentry.client.config.ts`
- Create: `sentry.edge.config.ts`
- Create: `src/instrumentation.ts`
- Modify: `next.config.ts`

### Setup previo

- [ ] **Step 1: Crear proyecto en Sentry**

  1. Ir a https://sentry.io → Sign Up (gratis hasta 5k errores/mes).
  2. Create Project → Platform: **Next.js** → Name: `springs-web`.
  3. Copiar el **DSN** (formato: `https://xxxx@oyyy.ingest.sentry.io/zzzz`).
  4. En Settings → API → Auth Tokens → Create token con scopes: `project:releases`, `org:read`.
  5. Agregar al `.env.local`:
     ```
     SENTRY_DSN=https://xxxx@oyyy.ingest.sentry.io/zzzz
     SENTRY_AUTH_TOKEN=sntrys_xxxx
     NEXT_PUBLIC_SENTRY_DSN=https://xxxx@oyyy.ingest.sentry.io/zzzz
     ```
  6. Agregar `SENTRY_DSN` y `SENTRY_AUTH_TOKEN` en Vercel → Environment Variables.

- [ ] **Step 2: Instalar @sentry/nextjs**

  ```bash
  npm install @sentry/nextjs
  ```

### Implementación

- [ ] **Step 3: Crear `sentry.server.config.ts` (raíz del proyecto)**

  ```typescript
  import * as Sentry from "@sentry/nextjs";

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
    environment: process.env.NODE_ENV,
  });
  ```

- [ ] **Step 4: Crear `sentry.client.config.ts` (raíz del proyecto)**

  ```typescript
  import * as Sentry from "@sentry/nextjs";

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
    environment: process.env.NODE_ENV,
    // Solo captura errores reales, no rechazos de promesas no manejadas de terceros
    ignoreErrors: ["Non-Error promise rejection captured"],
  });
  ```

- [ ] **Step 5: Crear `sentry.edge.config.ts` (raíz del proyecto)**

  ```typescript
  import * as Sentry from "@sentry/nextjs";

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
  });
  ```

- [ ] **Step 6: Crear `src/instrumentation.ts`**

  Next.js 15+ usa este hook para registrar instrumentación al arrancar el servidor.

  ```typescript
  export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }
    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  }

  export const onRequestError = async (
    err: unknown,
    request: { path: string; method: string },
    context: { routerKind: string }
  ) => {
    const { captureRequestError } = await import("@sentry/nextjs");
    captureRequestError(err, request, context);
  };
  ```

- [ ] **Step 7: Modificar `next.config.ts`**

  ```typescript
  import type { NextConfig } from "next";
  import { withSentryConfig } from "@sentry/nextjs";

  const nextConfig: NextConfig = {};

  export default withSentryConfig(nextConfig, {
    org: "{{TU_ORG_SLUG_DE_SENTRY}}",   // ← reemplazar con tu org slug
    project: "springs-web",
    silent: true,
    widenClientFileUpload: true,
    disableLogger: true,
    automaticVercelMonitors: false,
  });
  ```

  El `org` slug se encuentra en Sentry → Settings → Organization → slug (ej: `springs-co`).

### Verificación

- [ ] **Step 8: Verificar build local**

  ```bash
  npm run build
  ```

  Expected: build pasa. Sentry puede mostrar un warning sobre source maps — es normal si no tienes `SENTRY_AUTH_TOKEN` configurado localmente.

- [ ] **Step 9: Verificar que Sentry captura errores**

  Agregar temporalmente a `src/app/api/orders/route.ts` al inicio del POST handler:
  ```typescript
  // TEST SENTRY — borrar después
  throw new Error("Test Sentry Springs");
  ```
  Hacer un request al endpoint, verificar que el error aparece en el dashboard de Sentry, luego **borrar la línea**.

- [ ] **Step 10: Commit**

  ```bash
  git add sentry.server.config.ts sentry.client.config.ts sentry.edge.config.ts src/instrumentation.ts next.config.ts package.json package-lock.json
  git commit -m "feat(CAM): Sentry error tracking — server + edge, tracing desactivado"
  git push origin main
  ```

---

## Task 3: CI con GitHub Actions

**Objetivo:** Que cualquier push a `main` (o PR) corra `npm run build` automáticamente y falle visiblemente si algo rompe.

**Por qué importa:** JD pushea cambios de frontend frecuentemente. Sin CI, un error de TypeScript o import roto llega a producción silenciosamente.

**Files:**
- Create: `.github/workflows/ci.yml`

### Setup previo

- [ ] **Step 1: Agregar secrets al repo de GitHub**

  En GitHub → repo `Camilocolmenaress/springs-web` → Settings → Secrets and variables → Actions → New repository secret:

  | Secret | Valor |
  |---|---|
  | `NEXT_PUBLIC_SUPABASE_URL` | El valor de tu `.env.local` |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | El valor de tu `.env.local` |
  | `SENTRY_DSN` | El DSN de Sentry |

  Estas variables son necesarias para que el build de Next.js no falle al inicializar el cliente de Supabase.

### Implementación

- [ ] **Step 2: Crear `.github/workflows/ci.yml`**

  ```bash
  mkdir -p .github/workflows
  ```

  Contenido del archivo `.github/workflows/ci.yml`:

  ```yaml
  name: CI

  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]

  jobs:
    build:
      name: Build Check
      runs-on: ubuntu-latest

      steps:
        - name: Checkout
          uses: actions/checkout@v4

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: npm

        - name: Install dependencies
          run: npm ci

        - name: Build
          run: npm run build
          env:
            NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
            NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
            SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
            # Desactiva upload de source maps en CI para no necesitar SENTRY_AUTH_TOKEN
            SENTRY_UPLOAD_SOURCE_MAPS: false
  ```

### Verificación

- [ ] **Step 3: Commit y verificar que el workflow corre**

  ```bash
  git add .github/workflows/ci.yml
  git commit -m "feat(CAM): GitHub Actions CI — build check en cada push a main"
  git push origin main
  ```

  Ir a GitHub → repo → pestaña **Actions**. Debe aparecer el workflow corriendo.
  Expected: check verde en ~2-3 minutos.

- [ ] **Step 4: Verificar que el CI falla cuando debe**

  Introducir un error de TypeScript deliberado en cualquier archivo de API (ej: agregar `const x: string = 123;`), hacer commit, verificar que el CI marca rojo. Luego revertir el commit:
  ```bash
  git revert HEAD --no-edit
  git push origin main
  ```

---

## Orden de ejecución recomendado

1. **Task 1 primero** — rate limiting es el riesgo más inmediato antes de lanzar.
2. **Task 3 segundo** — CI primero que Sentry para que los próximos commits de Sentry estén validados.
3. **Task 2 tercero** — Sentry requiere cuenta externa y más pasos de setup.
