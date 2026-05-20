"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productos, type Producto } from "@/data/productos";
import type { CartExtra } from "@/components/Cart";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const MONO = { fontFamily: "var(--font-jetbrains-mono), monospace" } as const;
const ANTON = { fontFamily: "var(--font-anton), sans-serif" } as const;

const extrasList = productos.filter(p => p.categoria === "extra");

interface Props {
  product: Producto;
  onClose: () => void;
  onConfirm: (product: Producto, extras: CartExtra[]) => void;
}

export default function ExtrasModal({ product, onClose, onConfirm }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [flying, setFlying] = useState(false);
  const [flyTo, setFlyTo] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const pendingExtras = useRef<CartExtra[]>([]);

  const add    = (id: string) => setQty(q => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const remove = (id: string) => setQty(q => {
    const n = { ...q, [id]: Math.max(0, (q[id] || 0) - 1) };
    if (!n[id]) delete n[id];
    return n;
  });

  const extrasTotal = extrasList.reduce((s, e) => s + (qty[e.id] || 0) * e.precio, 0);

  const handleConfirm = () => {
    const extras: CartExtra[] = extrasList
      .filter(e => (qty[e.id] || 0) > 0)
      .map(e => ({ id: e.id, nombre: e.nombre, precio: e.precio, cantidad: qty[e.id] }));
    pendingExtras.current = extras;

    // Calculate where the cart button is relative to modal center
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      const modalCx = rect.left + rect.width / 2;
      const modalCy = rect.top + rect.height / 2;
      // VER PEDIDO button: bottom-right, approx (window.innerWidth - 100, window.innerHeight - 48)
      const targetX = window.innerWidth - 100 - modalCx;
      const targetY = window.innerHeight - 48 - modalCy;
      setFlyTo({ x: targetX, y: targetY });
    }
    setFlying(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Overlay */}
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: flying ? 0 : 1 }}
        transition={{ duration: flying ? 0.3 : 0.2 }}
        style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.7)" }}
      />

      {/* Modal */}
      <AnimatePresence>
        {!flying ? (
          <motion.div
            ref={modalRef}
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              width: "min(880px, 96vw)",
              height: "min(580px, 92vh)",
              background: C.cream,
              display: "flex",
              overflow: "hidden",
            }}
          >
            <ModalContent
              product={product}
              extrasTotal={extrasTotal}
              qty={qty}
              add={add}
              remove={remove}
              onClose={onClose}
              onConfirm={handleConfirm}
            />
          </motion.div>
        ) : (
          <motion.div
            key="flying"
            initial={{ scale: 1, x: 0, y: 0, opacity: 1, borderRadius: 0 }}
            animate={{
              scale: 0.04,
              x: flyTo.x,
              y: flyTo.y,
              opacity: 0,
              borderRadius: "50%",
            }}
            transition={{ duration: 0.55, ease: [0.36, 0, 0.66, -0.2] }}
            onAnimationComplete={() => {
              onConfirm(product, pendingExtras.current);
              onClose();
            }}
            style={{
              position: "relative",
              width: "min(880px, 96vw)",
              height: "min(580px, 92vh)",
              background: C.burgundy,
              display: "flex",
              overflow: "hidden",
              transformOrigin: "center center",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalContent({
  product, extrasTotal, qty, add, remove, onClose, onConfirm,
}: {
  product: Producto;
  extrasTotal: number;
  qty: Record<string, number>;
  add: (id: string) => void;
  remove: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      {/* ── Left: extras ──────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: "22px 24px 14px", borderBottom: "1px solid rgba(26,10,12,0.1)", flexShrink: 0 }}>
          <div style={{ ...MONO, fontSize: "0.5rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.4, textTransform: "uppercase", marginBottom: 4 }}>
            HÁGALA MEJOR
          </div>
          <div style={{ ...ANTON, fontSize: "1.5rem", letterSpacing: "0.02em", textTransform: "uppercase", color: C.tinta, lineHeight: 1 }}>
            {product.nombre}
          </div>
          <div style={{ ...MONO, fontSize: "0.55rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.4, marginTop: 4, textTransform: "uppercase" }}>
            {fmt(product.precio)} COP — adicionales opcionales
          </div>
        </div>

        {/* Extras list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px" }}>
          {extrasList.map(extra => {
            const q = qty[extra.id] || 0;
            return (
              <div key={extra.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "11px 0",
                borderBottom: "1px solid rgba(26,10,12,0.07)",
              }}>
                <img
                  src={extra.imagen_url || "/images/jacket-placeholder.png"}
                  alt={extra.nombre}
                  style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...ANTON, fontSize: "0.82rem", letterSpacing: "0.03em", textTransform: "uppercase", color: C.tinta, lineHeight: 1.1 }}>
                    {extra.nombre}
                  </div>
                  <div style={{ ...MONO, fontSize: "0.58rem", color: C.tinta, opacity: 0.45, marginTop: 3 }}>
                    +{fmt(extra.precio)} COP
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {q > 0 && (
                    <>
                      <button onClick={() => remove(extra.id)} style={{
                        width: 26, height: 26,
                        border: "1px solid rgba(26,10,12,0.25)",
                        background: "transparent", cursor: "pointer",
                        ...MONO, fontSize: "0.9rem", color: C.tinta,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>–</button>
                      <span style={{ ...MONO, fontSize: "0.82rem", minWidth: 14, textAlign: "center", color: C.tinta }}>{q}</span>
                    </>
                  )}
                  <button onClick={() => add(extra.id)} style={{
                    width: 26, height: 26,
                    border: `1px solid ${C.tinta}`,
                    background: C.tinta, color: C.cream, cursor: "pointer",
                    ...MONO, fontSize: "0.9rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(26,10,12,0.1)", flexShrink: 0 }}>
          <button onClick={onConfirm} style={{
            width: "100%", padding: "13px 20px",
            background: C.burgundy, color: C.cream, border: "none", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            ...ANTON, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase",
          }}>
            <span>AGREGAR AL PEDIDO ↗</span>
            <span style={{ ...MONO, fontSize: "0.9rem" }}>
              {fmt(product.precio + extrasTotal)}
            </span>
          </button>
          <button onClick={onClose} style={{
            width: "100%", marginTop: 6, padding: "7px",
            background: "transparent", border: "none", cursor: "pointer",
            ...MONO, fontSize: "0.5rem", letterSpacing: "0.15em",
            color: C.tinta, opacity: 0.35, textTransform: "uppercase",
          }}>
            CANCELAR
          </button>
        </div>
      </div>

      {/* ── Right: product image ───────────────────────── */}
      <div style={{
        width: "42%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 32,
        background: "rgba(26,10,12,0.03)",
        borderLeft: "1px solid rgba(26,10,12,0.08)",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          width: 26, height: 26,
          background: "transparent", border: `1px solid ${C.tinta}`,
          cursor: "pointer", ...MONO, fontSize: "0.7rem", color: C.tinta,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
        <img
          src={product.imagen_url || "/images/jacket-placeholder.png"}
          alt={product.nombre}
          style={{ width: "100%", maxHeight: "75%", objectFit: "contain" }}
        />
      </div>
    </>
  );
}
