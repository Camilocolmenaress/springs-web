import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import { esCocinaAbierta } from "@/lib/horarios";
import { NextResponse } from "next/server";

export async function GET() {
  const { data } = await supabase.from("settings").select("id, value");

  if (!data) {
    return NextResponse.json(
      { error: "Error cargando settings." },
      { status: 500 }
    );
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

  const { error } = await supabase
    .from("settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
