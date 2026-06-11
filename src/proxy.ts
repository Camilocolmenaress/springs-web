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

const METODOS_ESCRITURA = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const ORIGENES_PERMITIDOS = new Set([
  "https://springs.com.co",
  "https://www.springs.com.co",
  "http://localhost:3000",
]);

export async function proxy(request: NextRequest) {
  // Bloquea escrituras cross-origin: solo el propio sitio puede mutar datos
  const origin = request.headers.get("origin");
  if (origin && METODOS_ESCRITURA.has(request.method)) {
    const esMismoOrigen = origin === request.nextUrl.origin;
    if (!esMismoOrigen && !ORIGENES_PERMITIDOS.has(origin)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }
  }

  const ip =
    (request as NextRequest & { ip?: string }).ip ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    "anon";

  if (request.nextUrl.pathname === "/api/orders" && request.method === "POST") {
    try {
      const { success } = await ordersLimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intente en un momento." },
          { status: 429 }
        );
      }
    } catch {
      console.error("[rate-limit] Redis no disponible — permitiendo solicitud");
    }
  }

  if (request.nextUrl.pathname === "/api/auth" && request.method === "POST") {
    try {
      const { success } = await authLimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Demasiados intentos. Espere 1 minuto." },
          { status: 429 }
        );
      }
    } catch {
      console.error("[rate-limit] Redis no disponible — permitiendo solicitud");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
