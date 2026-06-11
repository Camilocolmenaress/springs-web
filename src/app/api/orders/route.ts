import { supabase } from "@/lib/supabase";
import { esCocinaAbierta } from "@/lib/horarios";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

interface OrderItem {
  product_id: string;
  cantidad: number;
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
  for (const item of body.items) {
    if (
      !item.product_id ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad < 1 ||
      item.cantidad > 50
    ) {
      return NextResponse.json(
        { error: "Cantidad no valida en el pedido." },
        { status: 400 }
      );
    }
  }

  const { abierta, mensaje } = await esCocinaAbierta();
  if (!abierta) {
    return NextResponse.json(
      { error: "cocina_cerrada", mensaje },
      { status: 400 }
    );
  }

  const productIds = body.items.map((i) => i.product_id);
  const { data: productos, error: productosError } = await supabase
    .from("products")
    .select("id, nombre, precio, disponible")
    .in("id", productIds);

  if (productosError || !productos) {
    return NextResponse.json(
      { error: "Error verificando los productos." },
      { status: 500 }
    );
  }

  const productosPorId = new Map(productos.map((p) => [p.id, p]));

  const noEncontrados = productIds.filter((id) => !productosPorId.has(id));
  if (noEncontrados.length > 0) {
    return NextResponse.json(
      { error: "producto_no_encontrado", productos: noEncontrados },
      { status: 400 }
    );
  }

  const noDisponibles = productos
    .filter((p) => !p.disponible)
    .map((p) => p.nombre);
  if (noDisponibles.length > 0) {
    return NextResponse.json(
      { error: "producto_no_disponible", productos: noDisponibles },
      { status: 400 }
    );
  }

  // Precio SIEMPRE desde la BD — nunca confiar en el precio que manda el cliente
  const subtotal = body.items.reduce(
    (sum, item) =>
      sum + productosPorId.get(item.product_id)!.precio * item.cantidad,
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

  const itemsToInsert = body.items.map((item) => {
    const producto = productosPorId.get(item.product_id)!;
    return {
      order_id: order.id,
      product_id: item.product_id,
      nombre_producto: producto.nombre,
      cantidad: item.cantidad,
      precio_unitario: producto.precio,
    };
  });

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
