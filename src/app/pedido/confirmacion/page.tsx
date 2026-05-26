"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrder, fmt, type OrderInfo } from "@/lib/cart-store";

export default function ConfirmacionPage() {
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    setOrder(getOrder());
  }, []);

  if (!order) {
    return (
      <div className="fixed inset-0 bg-tinta flex flex-col items-center justify-center gap-6">
        <div className="font-display text-[48px] text-cream uppercase tracking-wide">SPRINGS</div>
        <Link
          href="/menu"
          className="font-mono text-[10px] text-mostaza uppercase tracking-widest hover:text-cream transition-colors"
        >
          IR AL MENÚ →
        </Link>
      </div>
    );
  }

  const waText = encodeURIComponent(
    `Hola Springs! Confirmo mi pedido #${order.numero} — ${order.nombre} — ${order.zona} — ${order.direccion}. Total: ${fmt(order.total)} COP. Pago: ${order.pago.toUpperCase()}.`
  );
  const waLink = `https://wa.me/573001234567?text=${waText}`;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-tinta font-sans text-cream" style={{ WebkitOverflowScrolling: "touch" }}>

      {/* 1. HERO */}
      <section className="bg-burgundy pt-20 pb-12 px-6 flex flex-col items-center text-center w-full">
        <div className="font-display text-[13px] text-cream tracking-[0.2em] uppercase mb-4">PEDIDO</div>
        <div className="font-mono text-[64px] text-mostaza leading-none mb-4">#{order.numero}</div>
        <div className="font-display text-[40px] text-cream tracking-tight uppercase">CONFIRMADO.</div>
        <div className="w-full h-px bg-mostaza/40 my-8" />
        <div className="font-mono text-[9px] text-cream mb-2 tracking-[0.15em] uppercase">SU JACKET LLEGA EN</div>
        <div className="font-display text-[32px] text-mostaza uppercase mb-8">30–45 MIN</div>
        <div className="font-mono text-[10px] text-cream/40 uppercase">CABECERA · CAÑAVERAL · SOTOMAYOR</div>
      </section>

      {/* 2. RESUMEN */}
      <section className="bg-cream py-10 px-6 w-full border-t border-b border-tinta">
        <h2 className="font-display text-[20px] text-burgundy uppercase mb-6">LO QUE PIDIÓ</h2>
        {order.items.map((item) => {
          const extTotal  = item.extras.reduce((e, x) => e + x.precio * x.cantidad, 0);
          const lineTotal = (item.precio + extTotal) * item.cantidad;
          return (
            <div key={item.cartId} className="flex flex-col border-b border-tinta/20 py-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col pr-4">
                  <span className="font-display text-[18px] text-tinta uppercase leading-tight">
                    {item.cantidad}x {item.nombre}
                  </span>
                  {item.extras.length > 0 && (
                    <span className="font-mono text-[9px] text-tinta/50 mt-1 uppercase tracking-widest">
                      + {item.extras.map(x => x.nombre).join(" · ")}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[13px] text-tinta whitespace-nowrap pt-1">{fmt(lineTotal)}</span>
              </div>
            </div>
          );
        })}
        <div className="pt-6 mt-2 border-t-2 border-tinta">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[11px] text-tinta uppercase">SUBTOTAL</span>
            <span className="font-mono text-[11px] text-tinta">{fmt(order.total)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-[11px] text-tinta uppercase">DOMICILIO</span>
            <span className="font-mono text-[11px] text-mostaza uppercase font-bold">GRATIS</span>
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-tinta/20">
            <span className="font-display text-[24px] text-tinta uppercase">TOTAL</span>
            <span className="font-mono text-[18px] text-tinta font-bold">{fmt(order.total)}</span>
          </div>
        </div>
      </section>

      {/* 3. ENTREGA */}
      <section className="bg-tinta py-10 px-6 w-full">
        <h2 className="font-display text-[20px] text-cream uppercase mb-8">DÓNDE LE LLEVAMOS</h2>
        <div className="flex flex-col gap-6">
          {(
            [
              { label: "ZONA",      value: order.zona      },
              { label: "DIRECCIÓN", value: order.direccion },
              { label: "CONTACTO",  value: order.nombre    },
            ] as const
          ).map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 border-l-2 border-mostaza pl-4">
              <span className="font-mono text-[10px] text-mostaza uppercase">{label}</span>
              <span className="font-sans text-[14px] text-cream uppercase">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SIGUIENTE PASO */}
      <section className="bg-burgundy py-12 px-6 w-full flex flex-col items-center border-t-2 border-cream">
        <h2 className="font-display text-[24px] text-cream uppercase mb-4 text-center">¿QUÉ SIGUE?</h2>
        <p className="font-sans text-[14px] text-cream text-center mb-8 max-w-sm leading-relaxed">
          Le confirmamos el pedido por WhatsApp antes de despachar.
        </p>
        <div className="w-full flex flex-col gap-4">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-cream text-burgundy font-display text-[18px] py-5 px-4 text-center uppercase tracking-wide hover:bg-mostaza transition-colors"
          >
            CONFIRMAR POR WHATSAPP
          </a>
          <Link
            href="/menu"
            className="w-full border-2 border-cream text-cream font-display text-[18px] py-5 px-4 text-center uppercase tracking-wide hover:bg-cream hover:text-burgundy transition-colors"
          >
            PEDIR DE NUEVO
          </Link>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-tinta py-16 px-6 w-full flex flex-col items-center border-t-2 border-cream/10">
        <div className="font-display text-[40px] text-cream mb-2 uppercase tracking-wide">SPRINGS</div>
        <div className="font-sans italic text-cream/70 mb-12 text-[16px]">Jacket de autor.</div>
        <span className="font-mono text-[10px] text-cream/40 uppercase">© 2026 SPRINGS. BUCARAMANGA, COL.</span>
      </footer>
    </div>
  );
}
