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

interface LaunchState {
  // posición fija del centro del modal
  cx: number; cy: number;
  // delta al centro del botón VER PEDIDO
  dx: number; dy: number;
}

export default function ExtrasModal({ product, onClose, onConfirm }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [launch, setLaunch] = useState<LaunchState | null>(null);
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

    setLaunch({
      cx: rect.left + rect.width  / 2,
      cy: rect.top  + rect.height / 2,
      dx: cartCx - (rect.left + rect.width  / 2),
      dy: cartCy - (rect.top  + rect.height / 2),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Overlay */}
      <motion.div
        onClick={!launch ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: launch ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.7)" }}
      />

      {/* Modal — sale con squeeze + fade cuando launch */}
      <AnimatePresence>
        {!launch && (
          <motion.div
            key="modal"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1,  scale: 1,    y: 0  }}
            exit={{
              scale: 0.88,
              opacity: 0,
              transition: { duration: 0.22, ease: "easeIn" },
            }}
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
      </AnimatePresence>

      {/* Genie pill — aparece en el centro del modal y vuela al carrito */}
      {launch && (
        <GeniePill
          launch={launch}
          onComplete={() => {
            onConfirm(product, pendingExtras.current);
            onClose();
          }}
        />
      )}
    </div>
  );
}

// ─── Genie pill ───────────────────────────────────────────────────────────────
// Arranca como un rectángulo del tamaño del modal, se aplana (squish),
// y vuela como un óvalo hacia VER PEDIDO. Sin contenido = forma limpia.
function GeniePill({ launch, onComplete }: { launch: LaunchState; onComplete: () => void }) {
  // Dimensiones iniciales del modal (mismo min() que el modal)
  const W = Math.min(880, window.innerWidth  * 0.96);
  const H = Math.min(580, window.innerHeight * 0.92);
  const ARC = -Math.max(80, Math.abs(launch.dx) * 0.08); // altura del arco

  return (
    // Contenedor posicionado en el centro exacto del modal
    <div style={{
      position: "fixed",
      left: launch.cx - W / 2,
      top:  launch.cy - H / 2,
      width: W,
      height: H,
      pointerEvents: "none",
      zIndex: 200,
    }}>
      {/* Capa horizontal: mueve en X con ease linear */}
      <motion.div
        style={{ width: "100%", height: "100%" }}
        initial={{ x: 0 }}
        animate={{ x: launch.dx }}
        transition={{ duration: 0.7, ease: "linear" }}
      >
        {/* Capa vertical: parábola — sube luego cae */}
        <motion.div
          style={{ width: "100%", height: "100%" }}
          initial={{ y: 0 }}
          animate={{ y: [0, ARC, launch.dy] }}
          transition={{ duration: 0.7, times: [0, 0.35, 1], ease: ["easeOut", "easeIn"] }}
          onAnimationComplete={onComplete}
        >
          {/* La forma visual: empieza como rectángulo, se aplana y encoge */}
          <motion.div
            initial={{ scaleX: 1, scaleY: 1, borderRadius: "0%", opacity: 1 }}
            animate={{
              scaleX: [1, 1.08, 0.6,  0.15, 0.04],
              scaleY: [1, 0.65, 0.35, 0.12, 0.03],
              borderRadius: ["0%", "4%", "50%", "50%", "50%"],
              opacity: [1, 1, 1, 0.7, 0],
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.12, 0.30, 0.70, 1],
            }}
            style={{
              width: "100%",
              height: "100%",
              background: C.cream,
              transformOrigin: "center center",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Modal content ────────────────────────────────────────────────────────────
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
