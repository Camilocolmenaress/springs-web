// Juan David — Carrito de compras
// Desktop: drawer lateral sticky
// Mobile: bottom sheet con slide animation
// Empty state: "Su pedido esta vacio. La papa no se hornea sola."
// Barra de progreso domicilio gratis: umbral $60,000
// CTAs: "VER PEDIDO", "IR A PAGAR"

"use client";

import { useState } from "react";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const UMBRAL_GRATIS = 60000;
  const progreso = Math.min((total / UMBRAL_GRATIS) * 100, 100);

  return (
    <>
      {/* Boton flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-tinta text-cream font-mono text-xs tracking-[2px] px-5 py-3 z-50 hover:opacity-85 transition-opacity"
      >
        VER PEDIDO {items.length > 0 && `(${items.length})`}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-tinta/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md bg-cream border-l border-tinta/10 p-6 overflow-y-auto">
            <h2 className="font-display text-xl tracking-[3px] mb-6">
              SU PEDIDO
            </h2>

            {items.length === 0 ? (
              <p className="font-sans text-tinta/40 text-sm">
                Su pedido esta vacio. La papa no se hornea sola.
              </p>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-tinta/10"
                  >
                    <div>
                      <p className="font-sans text-sm font-medium">
                        {item.nombre}
                      </p>
                      <p className="font-mono text-xs text-tinta/50">
                        x{item.cantidad}
                      </p>
                    </div>
                    <span className="font-mono text-sm">
                      {(item.precio * item.cantidad).toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}

                {/* Barra domicilio gratis */}
                <div className="mt-6">
                  <div className="h-1 bg-tinta/10">
                    <div
                      className="h-full bg-mostaza transition-all"
                      style={{ width: `${progreso}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-tinta/40 mt-1 tracking-wider">
                    {total >= UMBRAL_GRATIS
                      ? "DOMICILIO GRATIS"
                      : `FALTAN ${(UMBRAL_GRATIS - total).toLocaleString("es-CO")} PARA DOMICILIO GRATIS`}
                  </p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-tinta/20">
                  <span className="font-display text-lg tracking-wide">
                    TOTAL
                  </span>
                  <span className="font-mono text-lg font-medium">
                    {total.toLocaleString("es-CO")}
                  </span>
                </div>

                <button className="w-full mt-6 bg-mostaza text-tinta font-display text-sm tracking-[3px] py-4 uppercase hover:opacity-85 transition-opacity">
                  IR A PAGAR
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
