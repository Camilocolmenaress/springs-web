import { verifyPin, setPin, setSessionCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { pin, tipo } = await request.json();

  if (!pin || !tipo || !["cocina", "admin"].includes(tipo)) {
    return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
  }

  const result = await verifyPin(pin, tipo);

  // Primera vez: configurar el PIN
  if (!result.configured) {
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

  if (!result.valid) {
    return NextResponse.json({ error: "PIN incorrecto." }, { status: 401 });
  }

  await setSessionCookie(tipo);
  return NextResponse.json({ ok: true });
}
