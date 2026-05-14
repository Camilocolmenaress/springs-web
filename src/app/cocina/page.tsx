"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Order {
  id: string;
  numero_pedido: number;
  estado: string;
  metodo_pago: string;
  pago_confirmado: boolean;
  nombre_cliente: string;
  telefono: string;
  direccion: string;
  total: number;
  created_at: string;
  items?: { nombre_producto: string; cantidad: number }[];
}

const SIGUIENTE_ESTADO: Record<string, string> = {
  nuevo: "confirmado",
  confirmado: "preparando",
  preparando: "listo",
  listo: "en_camino",
  en_camino: "entregado",
};

const ESTADO_LABEL: Record<string, string> = {
  nuevo: "NUEVO",
  confirmado: "CONFIRMADO",
  preparando: "PREPARANDO",
  listo: "LISTO",
  en_camino: "EN CAMINO",
};

const ESTADO_COLOR: Record<string, string> = {
  nuevo: "bg-mostaza text-tinta",
  confirmado: "bg-burgundy text-cream",
  preparando: "bg-tinta text-cream",
  listo: "bg-burgundy text-cream",
  en_camino: "bg-tinta/50 text-cream",
};

export default function CocinaPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .not("estado", "in", '("entregado","cancelado")')
      .order("created_at", { ascending: true });

    if (!data) return;

    const ordersWithItems = await Promise.all(
      data.map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("nombre_producto, cantidad")
          .eq("order_id", order.id);
        return { ...order, items: items || [] };
      })
    );

    setOrders(ordersWithItems);
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, tipo: "cocina" }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuthed(true);
      loadOrders();
    } else {
      setPinError(data.error);
    }
  };

  const avanzarEstado = async (orderId: string, nuevoEstado: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
  };

  const confirmarPago = async (orderId: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_confirmado: true }),
    });
  };

  useEffect(() => {
    if (!authed) return;

    const channel = supabase
      .channel("cocina-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authed, loadOrders]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-tinta flex items-center justify-center">
        <div className="w-72 text-center">
          <h1 className="font-display text-3xl text-cream tracking-[4px] mb-8">
            COCINA
          </h1>
          <input
            type="password"
            inputMode="numeric"
            placeholder="PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-cream/10 text-cream font-mono text-center text-2xl tracking-[8px] py-4 border border-cream/20 focus:border-mostaza outline-none"
          />
          {pinError && (
            <p className="font-mono text-xs text-mostaza mt-3">{pinError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full mt-4 bg-burgundy text-cream font-display tracking-[3px] py-4 hover:opacity-85 transition-opacity"
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  const newOrders = orders.filter((o) => o.estado === "nuevo");
  const activeOrders = orders.filter((o) => o.estado !== "nuevo");

  return (
    <div className="min-h-screen bg-tinta p-4 overflow-y-auto">
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ=="
        preload="auto"
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-cream tracking-[4px]">
          SPRINGS COCINA
        </h1>
        <span className="font-mono text-xs text-cream/30">
          {orders.length} activos
        </span>
      </div>

      {newOrders.length > 0 && (
        <div className="mb-6">
          <p className="font-mono text-[10px] text-mostaza tracking-[3px] mb-3">
            NUEVOS
          </p>
          {newOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAvanzar={avanzarEstado}
              onConfirmarPago={confirmarPago}
            />
          ))}
        </div>
      )}

      {activeOrders.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-cream/30 tracking-[3px] mb-3">
            EN PROCESO
          </p>
          {activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAvanzar={avanzarEstado}
              onConfirmarPago={confirmarPago}
            />
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <p className="font-sans text-cream/20 text-center mt-20">
          Sin pedidos activos.
        </p>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onAvanzar,
  onConfirmarPago,
}: {
  order: Order;
  onAvanzar: (id: string, estado: string) => void;
  onConfirmarPago: (id: string) => void;
}) {
  const siguiente = SIGUIENTE_ESTADO[order.estado];

  return (
    <div className="bg-cream/5 border border-cream/10 p-5 mb-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-display text-2xl text-cream">
            #{String(order.numero_pedido).padStart(3, "0")}
          </span>
          <span
            className={`ml-3 font-mono text-[10px] tracking-[2px] px-2 py-1 inline-block ${ESTADO_COLOR[order.estado] || "bg-cream/10 text-cream"}`}
          >
            {ESTADO_LABEL[order.estado]}
          </span>
        </div>
        <span className="font-mono text-xs text-cream/30">
          {new Date(order.created_at).toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {order.items?.map((item, i) => (
          <p key={i} className="font-sans text-sm text-cream/70">
            {item.cantidad}x {item.nombre_producto}
          </p>
        ))}
      </div>

      <div className="mt-3 font-mono text-xs text-cream/40">
        <p>
          {order.nombre_cliente} · {order.telefono}
        </p>
        <p>{order.direccion}</p>
        <p className="mt-1">
          Pago: {order.metodo_pago}
          {order.metodo_pago !== "efectivo" && (
            <span
              className={
                order.pago_confirmado ? " text-green-400" : " text-mostaza"
              }
            >
              {order.pago_confirmado ? " · CONFIRMADO" : " · PENDIENTE"}
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        {order.metodo_pago !== "efectivo" && !order.pago_confirmado && (
          <button
            onClick={() => onConfirmarPago(order.id)}
            className="flex-1 bg-mostaza text-tinta font-mono text-xs tracking-[2px] py-3 hover:opacity-85 transition-opacity"
          >
            CONFIRMAR PAGO
          </button>
        )}
        {siguiente && (
          <button
            onClick={() => onAvanzar(order.id, siguiente)}
            className="flex-1 bg-burgundy text-cream font-mono text-xs tracking-[2px] py-3 hover:opacity-85 transition-opacity"
          >
            {ESTADO_LABEL[siguiente] || siguiente.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
}
