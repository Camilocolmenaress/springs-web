import { supabase } from "./supabase";
import { cookies } from "next/headers";

const SESSION_COOKIE = "springs_session";

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
  const payload = `${tipo}:${Date.now()}:springs`;
  return Buffer.from(payload).toString("base64");
}

export async function setSessionCookie(tipo: "cocina" | "admin") {
  const token = createSessionToken(tipo);
  const cookieStore = await cookies();
  cookieStore.set(`${SESSION_COOKIE}_${tipo}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 12,
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
    return decoded.startsWith(`${tipo}:`) && decoded.endsWith(":springs");
  } catch {
    return false;
  }
}
