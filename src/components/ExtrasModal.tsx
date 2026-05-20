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

type Phase = "idle" | "genie";
interface GenieTarget { dx: number; dy: number }

// Clip-path keyframes — embudo se cierra de abajo hacia arriba como Genie de macOS
const CP = [
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",          // full
  "polygon(0% 0%, 100% 0%, 92%  100%, 8%   100%)",          // bottom empieza a cerrarse
  "polygon(2%  0%, 98%  0%, 80%  100%, 20%  100%)",          // top sigue
  "polygon(10% 0%, 90%  0%, 65%  100%, 35%  100%)",          // embudo marcado
  "polygon(30% 0%, 70%  0%, 55%  100%, 45%  100%)",          // tira estrecha
  "polygon(45% 0%, 55%  0%, 51%  100%, 49%  100%)",          // casi línea
  "polygon(50% 0%, 50%  0%, 50%  100%, 50%  100%)",          // línea → nada
];

const GENIE_DURATION = 0.72;

export default function ExtrasModal({ product, onClose, onConfirm }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [genieTarget, setGenieTarget] = useState<GenieTarget>({ dx: 0, dy: 0 });
  const modalRef = useRef<HTMLDivElement | null>(null);
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

    const rect = modalRef.current?.getBoundingClientRect();
    if (!rect) { onConfirm(product, extras); onClose(); return; }

    const cartCx = window.innerWidth  - 24 - 80;
    const cartCy = window.innerHeight - 24 - 24;
    const modalCx = rect.left + rect.width  / 2;
    const modalCy = rect.top  + rect.height / 2;

    setGenieTarget({ dx: cartCx - modalCx, dy: cartCy - modalCy });
    setPhase("genie");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Overlay */}
      <motion.div
        onClick={phase === "idle" ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "genie" ? 0 : 1 }}
        transition={{ duration: phase === "genie" ? 0.4 : 0.2 }}
        style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.7)" }}
      />

      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="modal-idle"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
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
              product={product} extrasTotal={extrasTotal} qty={qty}
              add={add} remove={remove} onClose={onClose} onConfirm={handleConfirm}
            />
          </motion.div>
        )}

        {phase === "genie" && (
          <motion.div
            key="modal-genie"
            initial={{ clipPath: CP[0], x: 0, y: 0, scaleY: 1, opacity: 1 }}
            animate={{
              clipPath: CP,
              x: [0, genieTarget.dx*0.04, genieTarget.dx*0.12, genieTarget.dx*0.28, genieTarget.dx*0.52, genieTarget.dx*0.80, genieTarget.dx],
              y: [0, genieTarget.dy*0.08, genieTarget.dy*0.20, genieTarget.dy*0.38, genieTarget.dy*0.60, genieTarget.dy*0.85, genieTarget.dy],
              scaleY: [1, 0.92, 0.78, 0.58, 0.34, 0.15, 0.03],
              opacity: [1, 1, 1, 1, 0.9, 0.6, 0],
            }}
            transition={{
              duration: GENIE_DURATION,
              times: [0, 0.08, 0.20, 0.38, 0.60, 0.82, 1],
              ease: "easeIn",
            }}
            onAnimationComplete={() => {
              onConfirm(product, pendingExtras.current);
              onClose();
            }}
            style={{
              position: "relative",
              width: "min(880px, 96vw)",
              height: "min(580px, 92vh)",
              background: C.cream,
              display: "flex",
              overflow: "hidden",
              transformOrigin: "bottom right",
            }}
          >
            <ModalContent
              product={product} extrasTotal={extrasTotal} qty={qty}
              add={add} remove={remove} onClose={onClose} onConfirm={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalContent({ product, extrasTotal, qty, add, remove, onClose, onConfirm }: {
  product: Producto; extrasTotal: number; qty: Record<string, number>;
  add: (id: string) => void; remove: (id: string) => void;
  onClose: () => void; onConfirm: () => void;
}) {
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: "22px 24px 14px", borderBottom: "1px solid rgba(26,10,12,0.1)", flexShrink: 0 }}>
          <div style={{ ...MONO, fontSize: "0.5rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.4, textTransform: "uppercase", marginBottom: 4 }}>HÁGALA MEJOR</div>
          <div style={{ ...ANTON, fontSize: "1.5rem", letterSpacing: "0.02em", textTransform: "uppercase", color: C.tinta, lineHeight: 1 }}>{product.nombre}</div>
          <div style={{ ...MONO, fontSize: "0.55rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.4, marginTop: 4, textTransform: "uppercase" }}>{fmt(product.precio)} COP — adicionales opcionales</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px" }}>
          {extrasList.map(extra => {
            const q = qty[extra.id] || 0;
            return (
              <div key={extra.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid rgba(26,10,12,0.07)" }}>
                <img src={extra.imagen_url || "/images/jacket-placeholder.png"} alt={extra.nombre} style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...ANTON, fontSize: "0.82rem", letterSpacing: "0.03em", textTransform: "uppercase", color: C.tinta, lineHeight: 1.1 }}>{extra.nombre}</div>
                  <div style={{ ...MONO, fontSize: "0.58rem", color: C.tinta, opacity: 0.45, marginTop: 3 }}>+{fmt(extra.precio)} COP</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {q > 0 && (
                    <>
                      <button onClick={() => remove(extra.id)} style={{ width: 26, height: 26, border: "1px solid rgba(26,10,12,0.25)", background: "transparent", cursor: "pointer", ...MONO, fontSize: "0.9rem", color: C.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>–</button>
                      <span style={{ ...MONO, fontSize: "0.82rem", minWidth: 14, textAlign: "center", color: C.tinta }}>{q}</span>
                    </>
                  )}
                  <button onClick={() => add(extra.id)} style={{ width: 26, height: 26, border: `1px solid ${C.tinta}`, background: C.tinta, color: C.cream, cursor: "pointer", ...MONO, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(26,10,12,0.1)", flexShrink: 0 }}>
          <button onClick={onConfirm} style={{ width: "100%", padding: "13px 20px", background: C.burgundy, color: C.cream, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", ...ANTON, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            <span>AGREGAR AL PEDIDO ↗</span>
            <span style={{ ...MONO, fontSize: "0.9rem" }}>{fmt(product.precio + extrasTotal)}</span>
          </button>
          <button onClick={onClose} style={{ width: "100%", marginTop: 6, padding: "7px", background: "transparent", border: "none", cursor: "pointer", ...MONO, fontSize: "0.5rem", letterSpacing: "0.15em", color: C.tinta, opacity: 0.35, textTransform: "uppercase" }}>CANCELAR</button>
        </div>
      </div>

      <div style={{ width: "42%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "rgba(26,10,12,0.03)", borderLeft: "1px solid rgba(26,10,12,0.08)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 26, height: 26, background: "transparent", border: `1px solid ${C.tinta}`, cursor: "pointer", ...MONO, fontSize: "0.7rem", color: C.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        <img src={product.imagen_url || "/images/jacket-placeholder.png"} alt={product.nombre} style={{ width: "100%", maxHeight: "75%", objectFit: "contain" }} />
      </div>
    </>
  );
}
