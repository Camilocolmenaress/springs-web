import { productos } from "@/data/productos";
import { NextResponse } from "next/server";

// Datos estaticos por ahora — se conecta a Supabase en CAM-3
export const revalidate = 60;

export async function GET() {
  const disponibles = productos
    .filter((p) => p.disponible)
    .sort((a, b) => a.orden - b.orden);

  return NextResponse.json(disponibles);
}
