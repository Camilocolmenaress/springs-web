# CAMILO — Desarrollo y Técnica

Esta carpeta es tuya. Juan David no toca nada aquí.

---

## Qué va aquí

### Código fuente
- App Next.js 14 (App Router) — cuando migres del boceto HTML
- Componentes reutilizables (cart, modal, product card, etc.)
- Páginas y layouts
- Server Actions y API routes

### Base de datos
- Esquemas de Supabase (tablas: products, orders, order_items, etc.)
- Migraciones SQL
- Row Level Security policies
- Edge Functions

### Integraciones
- Wompi (pasarela de pagos colombiana)
- n8n (flujos de WhatsApp, notificaciones, reactivación)
- Meta Pixel + GA4
- Vercel Analytics

### Infraestructura
- Configuración de Vercel (vercel.json, env vars)
- Variables de entorno (.env.example — nunca el .env real)
- Configuración de dominio springs.com.co

### Documentación técnica
- Decisiones de arquitectura
- Notas de debugging resuelto
- TODOs técnicos con contexto

---

## Lo que NO va aquí
- Decisiones de qué decir, cómo llamar los productos, o colores — eso es de Juan David (`/juan-david`)
- Briefings de campañas o contenido de redes
- Cambios de carta o pricing sin aprobación previa

---

## Stack de referencia
```
Framework:    Next.js 14 (App Router)
Base de datos: Supabase (PostgreSQL + Realtime + Auth)
Pagos:        Wompi
Automatización: n8n
Analytics:    Vercel Analytics + Meta Pixel + GA4
Hosting:      Vercel
Dominio:      springs.com.co
```

---

## Cómo trabajar
1. Recibís un brief de Juan David → lo implementás aquí sin inventar copy ni cambiar colores
2. Si algo técnico bloquea una decisión de diseño → documentarlo y notificárselo a Juan David
3. Antes de tocar la paleta de colores o tipografías → revisar `/juan-david` o preguntar

---

**Regla de oro:** Si funciona, tú lo construiste. Aquí está el cómo.
