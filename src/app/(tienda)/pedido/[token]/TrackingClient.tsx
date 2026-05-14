"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface OrderData {
  id: string;
  numero_pedido: number;
  estado: string;
  metodo_pago: string;
  pago_confirmado: boolean;
  nombre_cliente: string;
  subtotal: number;
  domicilio: number;
  total: number;
  created_at: string;
}

interface OrderItem {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

const ESTADOS = [
  "nuevo",
  "confirmado",
  "preparando",
  "listo",
  "en_camino",
  "entregado",
];
const ESTADO_LABEL: Record<string, string> = {
  nuevo: "PEDIDO RECIBIDO",
  confirmado: "PAGO CONFIRMADO",
  preparando: "EN PREPARACION",
  listo: "LISTO",
  en_camino: "EN CAMINO",
  entregado: "ENTREGADO",
  cancelado: "CANCELADO",
};

export default function TrackingClient({
  order: initialOrder,
  items,
}: {
  order: OrderData;
  items: OrderItem[];
}) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const estadoIndex = ESTADOS.indexOf(order.estado);
  const isCancelado = order.estado === "cancelado";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <p className="font-mono text-xs text-tinta/40 tracking-[3px] mb-2">
          PEDIDO
        </p>
        <h1 className="font-display text-6xl text-tinta">
          #{String(order.numero_pedido).padStart(3, "0")}
        </h1>

        <div className="mt-8 border-t border-tinta/10 pt-6">
          <p className="font-display text-xl tracking-[2px] text-burgundy">
            {isCancelado ? "CANCELADO" : ESTADO_LABEL[order.estado]}
          </p>

          {!isCancelado && (
            <div className="flex gap-1 mt-4">
              {ESTADOS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 ${
                    i <= estadoIndex ? "bg-burgundy" : "bg-tinta/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-tinta/10 pt-6">
          <p className="font-mono text-[10px] text-tinta/40 tracking-[2px] mb-3">
            DETALLE
          </p>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-tinta/5"
            >
              <span className="font-sans text-sm">
                {item.cantidad}x {item.nombre_producto}
              </span>
              <span className="font-mono text-sm">
                {(item.cantidad * item.precio_unitario).toLocaleString("es-CO")}
              </span>
            </div>
          ))}

          {order.domicilio > 0 && (
            <div className="flex justify-between py-2 border-b border-tinta/5">
              <span className="font-sans text-sm text-tinta/50">
                Domicilio
              </span>
              <span className="font-mono text-sm">
                {order.domicilio.toLocaleString("es-CO")}
              </span>
            </div>
          )}

          <div className="flex justify-between py-3 mt-1">
            <span className="font-display text-lg tracking-wide">TOTAL</span>
            <span className="font-mono text-lg font-medium">
              {order.total.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <p className="font-sans text-xs text-tinta/30 mt-8 text-center">
          Esta pagina se actualiza automaticamente.
        </p>
      </div>
    </div>
  );
}
