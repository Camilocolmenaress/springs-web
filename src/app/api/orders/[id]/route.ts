import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const TRANSICIONES_VALIDAS: Record<string, string[]> = {
  nuevo: ["confirmado", "cancelado"],
  confirmado: ["preparando", "cancelado"],
  preparando: ["listo", "cancelado"],
  listo: ["en_camino", "cancelado"],
  en_camino: ["entregado", "cancelado"],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Buscar por ID (uuid) o por tracking_token (nanoid corto)
  let query = supabase.from("orders").select("*");
  if (id.length <= 12) {
    query = query.eq("tracking_token", id);
  } else {
    query = query.eq("id", id);
  }

  const { data: order, error } = await query.single();

  if (error || !order) {
    return NextResponse.json(
      { error: "Pedido no encontrado." },
      { status: 404 }
    );
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("nombre_producto, cantidad, precio_unitario")
    .eq("order_id", order.id);

  return NextResponse.json({ ...order, items: items || [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data: order } = await supabase
    .from("orders")
    .select("id, estado")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json(
      { error: "Pedido no encontrado." },
      { status: 404 }
    );
  }

  const updates: Record<string, unknown> = {};

  if (body.estado) {
    const permitidos = TRANSICIONES_VALIDAS[order.estado];
    if (!permitidos || !permitidos.includes(body.estado)) {
      return NextResponse.json(
        {
          error: `No se puede pasar de "${order.estado}" a "${body.estado}".`,
        },
        { status: 400 }
      );
    }
    updates.estado = body.estado;
  }

  if (typeof body.pago_confirmado === "boolean") {
    updates.pago_confirmado = body.pago_confirmado;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nada que actualizar." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select("id, numero_pedido, estado, pago_confirmado")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
