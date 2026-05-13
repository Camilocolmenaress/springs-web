import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

interface OrderItem {
  product_id: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

interface OrderRequest {
  items: OrderItem[];
  telefono?: string;
}

export async function POST(request: Request) {
  const body: OrderRequest = await request.json();

  if (!body.items || body.items.length === 0) {
    return NextResponse.json(
      { error: "El pedido no tiene productos." },
      { status: 400 }
    );
  }

  const total = body.items.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );

  // Insertar orden — numero_pedido se genera automaticamente con la secuencia
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ total, telefono: body.telefono || null })
    .select("id, numero_pedido")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message || "Error al crear la orden." },
      { status: 500 }
    );
  }

  // Insertar items vinculados a la orden
  const itemsToInsert = body.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    nombre_producto: item.nombre_producto,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // Rollback: eliminar la orden huerfana
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Error al guardar los productos del pedido." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: order.id,
    numero_pedido: order.numero_pedido,
    total,
  });
}
