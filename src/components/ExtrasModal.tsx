"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const pendingExtras = useRef<CartExtra[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
  }, []);

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

  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "flex-end" }}>
        {/* Overlay */}
        <motion.div
          onClick={!launch ? onClose : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: launch ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.65)" }}
        />
        {/* Bottom sheet */}
        <AnimatePresence>
          {!launch && (
            <motion.div
              key="sheet"
              ref={modalRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "88vh",
                background: C.cream,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              {/* Handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                <div style={{ width: 36, height: 4, background: "rgba(26,10,12,0.2)" }} />
              </div>
              <ModalContentMobile
                product={product} extrasTotal={extrasTotal} qty={qty}
                add={add} remove={remove} onClose={onClose} onConfirm={handleConfirm}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {launch && (
          <GeniePill launch={launch} onComplete={() => { onConfirm(product, pendingExtras.current); onClose(); }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Overlay */}
      <motion.div
        onClick={!launch ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: launch ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", inset: 0, background: "rgba(26,10,12,0.7)" }}
      />

      {/* Modal — se desvanece con opacidad al lanzar */}
      <AnimatePresence>
        {!launch && (
          <motion.div
            key="modal"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
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

      {/* Pill — vuela simultáneamente mientras el modal se desvanece */}
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

// ─── Shooting star ────────────────────────────────────────────────────────────
// Píldora pequeña que nace en el centro del modal y vuela al carrito.
// El modal se desvanece por separado con opacidad.
function GeniePill({ launch, onComplete }: { launch: LaunchState; onComplete: () => void }) {
  const PW = 280; const PH = 70; // empieza grande para que el encogimiento sea visible
  const D  = 0.5;
  const ARC = -50;

  return (
    // Anclado al centro exacto del modal
    <div style={{
      position: "fixed",
      left: launch.cx - PW / 2,
      top:  launch.cy - PH / 2,
      width: PW, height: PH,
      pointerEvents: "none",
      zIndex: 200,
    }}>
      <motion.div style={{ width: "100%", height: "100%" }}
        initial={{ x: 0 }}
        animate={{ x: launch.dx }}
        transition={{ duration: D, ease: "easeIn" }}
      >
        <motion.div style={{ width: "100%", height: "100%" }}
          initial={{ y: 0 }}
          animate={{ y: [0, ARC, launch.dy] }}
          transition={{ duration: D, times: [0, 0.2, 1], ease: ["easeOut", "easeIn"] }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 0.35, 0.04], opacity: [1, 1, 0] }}
            transition={{ duration: D, times: [0, 0.55, 1], ease: "easeIn" }}
            style={{
              width: "100%", height: "100%",
              background: C.cream,
              borderRadius: 999,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Modal content mobile (single column bottom sheet) ───────────────────────
function ModalContentMobile({ product, extrasTotal, qty, add, remove, onClose, onConfirm }: {
  product: Producto; extrasTotal: number; qty: Record<string, number>;
  add: (id: string) => void; remove: (id: string) => void;
  onClose: () => void; onConfirm: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "8px 20px 12px", borderBottom: "1px solid rgba(26,10,12,0.1)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...MONO, fontSize: "0.48rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.4, textTransform: "uppercase", marginBottom: 3 }}>HÁGALA MEJOR</div>
          <div style={{ ...ANTON, fontSize: "1.3rem", letterSpacing: "0.02em", textTransform: "uppercase", color: C.tinta, lineHeight: 1 }}>{product.nombre}</div>
          <div style={{ ...MONO, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.4, marginTop: 3, textTransform: "uppercase" }}>{fmt(product.precio)} COP — adicionales opcionales</div>
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, background: "transparent", border: `1px solid ${C.tinta}`, cursor: "pointer", ...MONO, fontSize: "0.7rem", color: C.tinta, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12 }}>✕</button>
      </div>
      {/* Extras list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px" }}>
        {extrasList.map(extra => {
          const q = qty[extra.id] || 0;
          return (
            <div key={extra.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(26,10,12,0.07)" }}>
              <img src={extra.imagen_url || "/images/jacket-placeholder.png"} alt={extra.nombre} style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...ANTON, fontSize: "0.78rem", letterSpacing: "0.03em", textTransform: "uppercase", color: C.tinta, lineHeight: 1.1 }}>{extra.nombre}</div>
                <div style={{ ...MONO, fontSize: "0.54rem", color: C.tinta, opacity: 0.45, marginTop: 2 }}>+{fmt(extra.precio)} COP</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {q > 0 && (
                  <>
                    <button onClick={() => remove(extra.id)} style={{ width: 28, height: 28, border: "1px solid rgba(26,10,12,0.25)", background: "transparent", cursor: "pointer", ...MONO, fontSize: "0.9rem", color: C.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>–</button>
                    <span style={{ ...MONO, fontSize: "0.82rem", minWidth: 14, textAlign: "center", color: C.tinta }}>{q}</span>
                  </>
                )}
                <button onClick={() => add(extra.id)} style={{ width: 28, height: 28, border: `1px solid ${C.tinta}`, background: C.tinta, color: C.cream, cursor: "pointer", ...MONO, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
          );
        })}
      </div>
      {/* CTA */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(26,10,12,0.1)" }}>
        <button onClick={onConfirm} style={{ width: "100%", padding: "14px 20px", background: C.burgundy, color: C.cream, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", ...ANTON, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <span>AGREGAR AL PEDIDO ↗</span>
          <span style={{ ...MONO, fontSize: "0.9rem" }}>{fmt(product.precio + extrasTotal)}</span>
        </button>
      </div>
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
