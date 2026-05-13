import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("id, nombre, descripcion, precio, categoria, disponible, imagen_url")
    .eq("disponible", true)
    .order("orden", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
