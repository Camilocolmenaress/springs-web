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

interface Projectile {
  // starting rect of the confirm button (fixed coords)
  x: number; y: number; w: number; h: number;
  // delta to cart button center
  dx: number; dy: number;
}

export default function ExtrasModal({ product, onClose, onConfirm }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
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

    const rect = confirmRef.current?.getBoundingClientRect();
    if (!rect) { onConfirm(product, extras); onClose(); return; }

    // Cart button is fixed: bottom 24, right 24 — approx center
    const cartCx = window.innerWidth - 24 - 80; // ~80px half-width of button
    const cartCy = window.innerHeight - 24 - 24; // ~24px half-height

    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;

    setProjectile({
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height,
      dx: cartCx - btnCx,
      dy: cartCy - btnCy,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Overlay */}
      <motion.div
        onClick={!projectile ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: projectile ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.7)" }}
      />

      {/* Modal — fades out when projectile launches */}
      <AnimatePresence>
        {!projectile && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
              confirmRef={confirmRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projectile — the flying pill */}
      {projectile && (
        <Projectile
          p={projectile}
          onComplete={() => {
            onConfirm(product, pendingExtras.current);
            onClose();
          }}
        />
      )}
    </div>
  );
}

// ─── Projectile ──────────────────────────────────────────────────────────────
function Projectile({ p, onComplete }: { p: Projectile; onComplete: () => void }) {
  // Arc control point: halfway laterally, pull upward for natural arc
  const arcX = p.dx * 0.45;
  const arcY = p.dy * 0.35 - 60; // bias upward for a nice lob

  return (
    <motion.div
      style={{
        position: "fixed",
        left: p.x,
        top: p.y,
        width: p.w,
        height: p.h,
        background: C.burgundy,
        zIndex: 200,
        transformOrigin: "center center",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      initial={{ scaleX: 1, scaleY: 1, x: 0, y: 0, borderRadius: "0%", opacity: 1 }}
      animate={{
        // Squish phase → round → travel → shrink
        scaleX:       [1,    1.18,  0.7,   0.55,  0.12,  0.05],
        scaleY:       [1,    0.72,  1.1,   0.9,   0.12,  0.05],
        x:            [0,    0,     arcX,  p.dx * 0.75, p.dx, p.dx],
        y:            [0,    0,     arcY,  p.dy * 0.6,  p.dy, p.dy],
        borderRadius: ["0%", "10%", "50%", "50%",       "50%", "50%"],
        opacity:      [1,    1,     1,     1,            0.6,   0],
      }}
      transition={{
        duration: 0.72,
        times:    [0,   0.12,  0.26,  0.55,  0.85,  1],
        ease:     "easeInOut",
      }}
      onAnimationComplete={onComplete}
    />
  );
}

// ─── Modal content ────────────────────────────────────────────────────────────
function ModalContent({
  product, extrasTotal, qty, add, remove, onClose, onConfirm, confirmRef,
}: {
  product: Producto;
  extrasTotal: number;
  qty: Record<string, number>;
  add: (id: string) => void;
  remove: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <>
      {/* ── Left ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
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

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px" }}>
          {extrasList.map(extra => {
            const q = qty[extra.id] || 0;
            return (
              <div key={extra.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "11px 0", borderBottom: "1px solid rgba(26,10,12,0.07)",
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
                        width: 26, height: 26, border: "1px solid rgba(26,10,12,0.25)",
                        background: "transparent", cursor: "pointer",
                        ...MONO, fontSize: "0.9rem", color: C.tinta,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>–</button>
                      <span style={{ ...MONO, fontSize: "0.82rem", minWidth: 14, textAlign: "center", color: C.tinta }}>{q}</span>
                    </>
                  )}
                  <button onClick={() => add(extra.id)} style={{
                    width: 26, height: 26, border: `1px solid ${C.tinta}`,
                    background: C.tinta, color: C.cream, cursor: "pointer",
                    ...MONO, fontSize: "0.9rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(26,10,12,0.1)", flexShrink: 0 }}>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              width: "100%", padding: "13px 20px",
              background: C.burgundy, color: C.cream, border: "none", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              ...ANTON, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase",
            }}
          >
            <span>AGREGAR AL PEDIDO ↗</span>
            <span style={{ ...MONO, fontSize: "0.9rem" }}>{fmt(product.precio + extrasTotal)}</span>
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

      {/* ── Right: product image ── */}
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
          width: 26, height: 26, background: "transparent", border: `1px solid ${C.tinta}`,
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
