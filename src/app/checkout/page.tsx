"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, saveOrder, clearCart, calcTotal, fmt, type CartItem, type OrderInfo } from "@/lib/cart-store";

const ZONAS = ["CABECERA DEL LLANO", "CAÑAVERAL", "SOTOMAYOR"];
const PAGOS = [
  { id: "tarjeta", label: "TARJETA DÉBITO / CRÉDITO" },
  { id: "nequi",   label: "NEQUI",                    badge: "PAGO INMEDIATO" },
  { id: "pse",     label: "PSE" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems]       = useState<CartItem[]>([]);
  const [zona, setZona]         = useState("CAÑAVERAL");
  const [direccion, setDir]     = useState("");
  const [notas, setNotas]       = useState("");
  const [nombre, setNombre]     = useState("");
  const [celular, setCelular]   = useState("");
  const [pago, setPago]         = useState("nequi");

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) { router.replace("/menu"); return; }
    setItems(cart);
  }, [router]);

  const subtotal = calcTotal(items);
  const domFree  = subtotal >= 60000;
  const total    = domFree ? subtotal : subtotal + 5000;
  const valid    = nombre.trim() && celular.trim() && direccion.trim();

  function handlePagar() {
    if (!valid) return;
    const order: OrderInfo = {
      numero:    Math.floor(Math.random() * 900) + 100,
      items,
      total:     subtotal,
      zona,
      direccion,
      notas,
      nombre,
      celular,
      pago,
      createdAt: new Date().toISOString(),
    };
    saveOrder(order);
    clearCart();
    router.push("/pedido/confirmacion");
  }

  if (!items.length) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-tinta font-sans text-cream" style={{ WebkitOverflowScrolling: "touch" }}>

      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 bg-tinta border-b-2 border-mostaza flex items-center px-6 h-16">
        <Link href="/menu" className="text-cream hover:text-mostaza transition-colors w-10 text-xl font-bold">
          ←
        </Link>
        <h1 className="flex-1 text-center font-display text-[20px] text-cream uppercase tracking-widest">
          SU PEDIDO
        </h1>
        <div className="w-10" />
      </header>

      {/* ── Content ── */}
      <main className="pt-24 pb-52 px-6 flex flex-col gap-12 max-w-[600px] mx-auto w-full">

        {/* RESUMEN */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-[18px] text-cream uppercase tracking-wider">RESUMEN</h2>
          <div className="flex flex-col">
            {items.map((item) => {
              const extTotal  = item.extras.reduce((e, x) => e + x.precio * x.cantidad, 0);
              const lineTotal = (item.precio + extTotal) * item.cantidad;
              return (
                <div key={item.cartId} className="flex items-center justify-between py-4 border-b border-mostaza/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-mostaza text-tinta w-6 h-6 flex items-center justify-center font-mono text-[12px] font-bold flex-shrink-0">
                      {item.cantidad}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[14px] text-cream">{item.nombre}</span>
                      {item.extras.length > 0 && (
                        <span className="font-mono text-[9px] text-mostaza/70 uppercase tracking-widest">
                          + {item.extras.map(x => x.nombre).join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[12px] text-cream flex-shrink-0">{fmt(lineTotal)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-cream/60 uppercase tracking-widest">SUBTOTAL</span>
              <span className="font-mono text-[12px] text-cream">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-mostaza uppercase tracking-widest">DOMICILIO</span>
              <span className="font-mono text-[12px] text-mostaza font-bold">
                {domFree ? "GRATIS" : fmt(5000)}
              </span>
            </div>
          </div>
        </section>

        {/* ZONA */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-[16px] text-cream uppercase tracking-wider">¿DÓNDE LE LLEVAMOS?</h2>
          <div className="flex flex-col gap-3">
            {ZONAS.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZona(z)}
                className={`flex items-center p-4 border text-left transition-colors ${
                  zona === z ? "border-mostaza bg-burgundy" : "border-cream/20 hover:border-mostaza"
                }`}
              >
                <span className={`font-sans font-medium text-[14px] uppercase tracking-wide ${zona === z ? "text-mostaza" : "text-cream"}`}>
                  {z}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-mostaza tracking-widest uppercase">DIRECCIÓN</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDir(e.target.value)}
                placeholder="Ej: Calle 45 # 29 - 14, Apto 201"
                className="w-full bg-transparent border-0 border-b border-cream/30 py-2 font-sans text-[14px] text-cream focus:outline-none focus:border-mostaza transition-colors placeholder:text-cream/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-mostaza tracking-widest uppercase">NOTAS PARA EL DOMICILIARIO</label>
              <input
                type="text"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: Dejar en portería, timbre dañado..."
                className="w-full bg-transparent border-0 border-b border-cream/30 py-2 font-sans text-[14px] text-cream focus:outline-none focus:border-mostaza transition-colors placeholder:text-cream/30"
              />
            </div>
          </div>
        </section>

        {/* DATOS */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-[16px] text-cream uppercase tracking-wider">SUS DATOS</h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-mostaza tracking-widest uppercase">NOMBRE</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Mateo O."
                className="w-full bg-transparent border-0 border-b border-cream/30 py-2 font-sans text-[14px] text-cream focus:outline-none focus:border-mostaza transition-colors placeholder:text-cream/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-mostaza tracking-widest uppercase">CELULAR</label>
              <input
                type="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="300 000 0000"
                className="w-full bg-transparent border-0 border-b border-cream/30 py-2 font-sans text-[14px] text-cream focus:outline-none focus:border-mostaza transition-colors placeholder:text-cream/30"
              />
            </div>
          </div>
          <p className="font-sans text-[11px] text-cream/50 italic leading-snug">
            Confirmaremos su pedido por WhatsApp antes de despachar.
          </p>
        </section>

        {/* PAGO */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-[16px] text-cream uppercase tracking-wider">CÓMO PAGA</h2>
          <div className="flex flex-col gap-3">
            {PAGOS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPago(p.id)}
                className={`flex flex-col p-4 border text-left transition-colors ${
                  pago === p.id ? "border-mostaza bg-burgundy" : "border-cream/20 hover:border-mostaza"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`font-sans font-medium text-[14px] uppercase tracking-wide ${pago === p.id ? "text-mostaza" : "text-cream"}`}>
                    {p.label}
                  </span>
                  {p.badge && pago === p.id && (
                    <span className="font-mono text-[9px] text-mostaza tracking-widest uppercase">{p.badge}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="font-mono text-[8px] text-cream/30 tracking-[0.2em] uppercase">
              PAGOS PROCESADOS POR WOMPI
            </span>
          </div>
        </section>
      </main>

      {/* ── Sticky bottom ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-tinta border-t border-mostaza/30 flex flex-col">
        <div className="px-6 py-4 flex flex-col gap-1 max-w-[600px] mx-auto w-full">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-cream/60 uppercase tracking-widest">SUBTOTAL</span>
            <span className="font-mono text-[12px] text-cream">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-mostaza uppercase tracking-widest">DOMICILIO</span>
            <span className="font-mono text-[12px] text-mostaza font-bold">{domFree ? "GRATIS" : fmt(5000)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-mostaza/20">
            <span className="font-display text-[16px] text-cream uppercase tracking-wider">TOTAL</span>
            <span className="font-mono text-[20px] text-mostaza font-bold">{fmt(total)}</span>
          </div>
        </div>
        <button
          onClick={handlePagar}
          disabled={!valid}
          className="w-full bg-mostaza text-tinta font-display text-[18px] py-5 text-center uppercase tracking-wider hover:bg-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          IR A PAGAR →
        </button>
      </div>
    </div>
  );
}
