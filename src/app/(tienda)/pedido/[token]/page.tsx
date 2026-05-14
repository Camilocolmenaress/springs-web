import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import TrackingClient from "./TrackingClient";

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, numero_pedido, estado, metodo_pago, pago_confirmado, nombre_cliente, subtotal, domicilio, total, created_at"
    )
    .eq("tracking_token", token)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("nombre_producto, cantidad, precio_unitario")
    .eq("order_id", order.id);

  return <TrackingClient order={order} items={items || []} />;
}
