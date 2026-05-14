import { supabase } from "@/lib/supabase";
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
      return NextResponse.json(
        { error: "Contenido no encontrado." },
        { status: 404 }
      );
    }

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
    return NextResponse.json(
      { error: "Contenido no valido." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("content")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
