import { supabase } from "./supabase";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "springs_session";
const SESSION_MAX_AGE_S = 60 * 60 * 12;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no esta configurado en las env vars.");
  }
  return secret;
}

function firmar(payload: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export async function verifyPin(
  pin: string,
  tipo: "cocina" | "admin"
): Promise<{ valid: boolean; configured: boolean }> {
  const { data } = await supabase.rpc("verify_pin", {
    pin_tipo: tipo,
    pin_value: pin,
  });
  return data || { valid: false, configured: false };
}

export async function setPin(
  pin: string,
  tipo: "cocina" | "admin"
): Promise<void> {
  await supabase.rpc("set_pin", { pin_tipo: tipo, pin_value: pin });
}

export function createSessionToken(tipo: "cocina" | "admin"): string {
  const payload = `${tipo}:${Date.now()}`;
  return Buffer.from(`${payload}:${firmar(payload)}`).toString("base64url");
}

export async function setSessionCookie(tipo: "cocina" | "admin") {
  const token = createSessionToken(tipo);
  const cookieStore = await cookies();
  cookieStore.set(`${SESSION_COOKIE}_${tipo}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE_S,
    // path "/" para que la cookie llegue tambien a /api/* (con /admin no llegaba)
    path: "/",
  });
}

export async function isAuthenticated(
  tipo: "cocina" | "admin"
): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(`${SESSION_COOKIE}_${tipo}`);
  if (!token?.value) return false;

  try {
    const decoded = Buffer.from(token.value, "base64url").toString("utf-8");
    const [t, ts, sig] = decoded.split(":");
    if (t !== tipo || !ts || !sig) return false;

    const issuedAt = Number(ts);
    if (
      !Number.isFinite(issuedAt) ||
      Date.now() - issuedAt > SESSION_MAX_AGE_S * 1000
    ) {
      return false;
    }

    const expected = Buffer.from(firmar(`${t}:${ts}`), "hex");
    const received = Buffer.from(sig, "hex");
    return (
      expected.length === received.length &&
      timingSafeEqual(expected, received)
    );
  } catch {
    return false;
  }
}
