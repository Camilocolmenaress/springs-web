import { supabase } from "@/lib/supabase";
import { esCocinaAbierta } from "@/lib/horarios";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

interface OrderItem {
  product_id: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

interface OrderRequest {
  items: OrderItem[];
  nombre_cliente: string;
  telefono: string;
  direccion: string;
  metodo_pago: "efectivo" | "nequi" | "transferencia";
}

export async function POST(request: Request) {
  const body: OrderRequest = await request.json();

  if (!body.items?.length) {
    return NextResponse.json(
      { error: "El pedido no tiene productos." },
      { status: 400 }
    );
  }
  if (!body.nombre_cliente || !body.telefono || !body.direccion) {
    return NextResponse.json(
      { error: "Faltan datos: nombre, telefono o direccion." },
      { status: 400 }
    );
  }
  if (!["efectivo", "nequi", "transferencia"].includes(body.metodo_pago)) {
    return NextResponse.json(
      { error: "Metodo de pago no valido." },
      { status: 400 }
    );
  }

  const { abierta, mensaje } = await esCocinaAbierta();
  if (!abierta) {
    return NextResponse.json(
      { error: "cocina_cerrada", mensaje },
      { status: 400 }
    );
  }

  const productIds = body.items.map((i) => i.product_id);
  const { data: productos } = await supabase
    .from("products")
    .select("id, nombre, disponible")
    .in("id", productIds);

  if (productos) {
    const noDisponibles = productos
      .filter((p) => !p.disponible)
      .map((p) => p.nombre);
    if (noDisponibles.length > 0) {
      return NextResponse.json(
        { error: "producto_no_disponible", productos: noDisponibles },
        { status: 400 }
      );
    }
  }

  const subtotal = body.items.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );

  const { data: domicilioConfig } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "domicilio")
    .single();

  const umbralGratis = domicilioConfig?.value?.umbral_gratis ?? 60000;
  const tarifaDomicilio = domicilioConfig?.value?.tarifa ?? 5000;
  const domicilio = subtotal >= umbralGratis ? 0 : tarifaDomicilio;
  const total = subtotal + domicilio;

  const tracking_token = nanoid(10);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      subtotal,
      domicilio,
      total,
      nombre_cliente: body.nombre_cliente,
      telefono: body.telefono,
      direccion: body.direccion,
      metodo_pago: body.metodo_pago,
      tracking_token,
    })
    .select("id, numero_pedido")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message || "Error al crear la orden." },
      { status: 500 }
    );
  }

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
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Error al guardar los productos del pedido." },
      { status: 500 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://springs.com.co";

  return NextResponse.json({
    numero_pedido: order.numero_pedido,
    tracking_token,
    tracking_url: `${baseUrl}/pedido/${tracking_token}`,
    subtotal,
    domicilio,
    total,
    metodo_pago: body.metodo_pago,
  });
}
