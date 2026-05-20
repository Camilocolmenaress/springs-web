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

interface BulletState {
  // bullet start: center of the confirm button (fixed coords)
  startX: number;
  startY: number;
  // delta to cart button center
  dx: number;
  dy: number;
}

export default function ExtrasModal({ product, onClose, onConfirm }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [bullet, setBullet] = useState<BulletState | null>(null);
  const [pressing, setPressing] = useState(false);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
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

    // Bullet starts at center of confirm button
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Cart button: fixed bottom:24 right:24, estimate center
    const cartCx = window.innerWidth - 24 - 75;
    const cartCy = window.innerHeight - 24 - 24;

    // Button press effect first, then launch
    setPressing(true);
    setTimeout(() => {
      setPressing(false);
      setBullet({ startX, startY, dx: cartCx - startX, dy: cartCy - startY });
    }, 120);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Overlay — fades when bullet is flying */}
      <motion.div
        onClick={!bullet ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: bullet ? 0 : 1 }}
        transition={{ duration: bullet ? 0.2 : 0.2 }}
        style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.7)" }}
      />

      {/* Modal */}
      <AnimatePresence>
        {!bullet && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8, transition: { duration: 0.22, ease: "easeIn" } }}
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
              pressing={pressing}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bullet — small pill that flies to cart */}
      {bullet && (
        <Bullet
          bullet={bullet}
          onComplete={() => {
            onConfirm(product, pendingExtras.current);
            onClose();
          }}
        />
      )}
    </div>
  );
}

// ─── Bullet ──────────────────────────────────────────────────────────────────
// Técnica de doble div: eje X con ease lineal, eje Y parabólico (easeOut subida, easeIn bajada)
// Esto produce un arco natural como física real — igual que Apple/iOS "add to cart"
function Bullet({ bullet, onComplete }: { bullet: BulletState; onComplete: () => void }) {
  const SIZE = 36;
  const DURATION = 0.72;
  // Arco proporcional: sube entre 90-140px dependiendo de la distancia horizontal
  const ARC_UP = -(90 + Math.min(Math.abs(bullet.dx) * 0.07, 50));

  return (
    // Contenedor fijo en origen
    <div style={{ position: "fixed", left: bullet.startX - SIZE / 2, top: bullet.startY - SIZE / 2, zIndex: 200, pointerEvents: "none" }}>

      {/* Capa X: movimiento horizontal lineal */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: bullet.dx }}
        transition={{ duration: DURATION, ease: "linear" }}
      >
        {/* Capa Y: parábola — easeOut hasta el pico, easeIn hacia abajo */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, ARC_UP, bullet.dy] }}
          transition={{
            duration: DURATION,
            times: [0, 0.38, 1],
            ease: ["easeOut", "easeIn"],
          }}
          onAnimationComplete={onComplete}
        >
          {/* El bullet visual: escala y opacidad */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.3, 1.1, 1, 0.6, 0.08],
              opacity: [1, 1,   1,   1, 0.8, 0],
            }}
            transition={{
              duration: DURATION,
              times: [0, 0.1, 0.2, 0.5, 0.82, 1],
            }}
            style={{
              width: SIZE,
              height: SIZE,
              borderRadius: "50%",
              background: C.burgundy,
              boxShadow: `0 2px 12px rgba(107,20,25,0.5)`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Modal content ────────────────────────────────────────────────────────────
function ModalContent({
  product, extrasTotal, qty, add, remove, onClose, onConfirm, confirmRef, pressing,
}: {
  product: Producto;
  extrasTotal: number;
  qty: Record<string, number>;
  add: (id: string) => void;
  remove: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmRef: React.RefObject<HTMLButtonElement | null>;
  pressing: boolean;
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
          <motion.button
            ref={confirmRef}
            onClick={onConfirm}
            animate={pressing
              ? { scaleY: 0.88, scaleX: 1.03 }
              : { scaleY: 1, scaleX: 1 }
            }
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
            style={{
              width: "100%", padding: "13px 20px",
              background: C.burgundy, color: C.cream, border: "none", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              ...ANTON, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase",
              transformOrigin: "bottom center",
            }}
          >
            <span>AGREGAR AL PEDIDO ↗</span>
            <span style={{ ...MONO, fontSize: "0.9rem" }}>{fmt(product.precio + extrasTotal)}</span>
          </motion.button>
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
