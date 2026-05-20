"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const UMBRAL = 60000;

export interface CartExtra {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface CartItem {
  cartId: string;
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  extras: CartExtra[];
}

interface CartProps {
  items: CartItem[];
  onAdd: (cartId: string) => void;
  onRemove: (cartId: string) => void;
  onDelete: (cartId: string) => void;
  bumpSignal?: number;
}

export default function Cart({ items, onAdd, onRemove, onDelete, bumpSignal = 0 }: CartProps) {
  const [open, setOpen] = useState(false);
  const btnAnim = useAnimation();
  const prevBump = useRef(0);

  useEffect(() => {
    if (bumpSignal > prevBump.current) {
      prevBump.current = bumpSignal;
      btnAnim.start({
        scale: [1, 1.22, 0.88, 1.1, 0.96, 1],
        transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeOut" },
      });
    }
  }, [bumpSignal, btnAnim]);

  const total      = items.reduce((s, i) => {
    const extrasTotal = i.extras.reduce((e, x) => e + x.precio * x.cantidad, 0);
    return s + (i.precio + extrasTotal) * i.cantidad;
  }, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);
  const pct        = Math.min((total / UMBRAL) * 100, 100);
  const falta      = UMBRAL - total;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Floating button ──────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(true)}
        animate={btnAnim}
        aria-label={`Ver pedido${totalItems > 0 ? `, ${totalItems} items` : ""}`}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 20px",
          background: C.tinta,
          color: C.cream,
          border: "none",
          cursor: "pointer",
          fontFamily: "Anton, sans-serif",
          fontSize: "0.82rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 24px rgba(26,10,12,0.28)",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        VER PEDIDO
        {totalItems > 0 && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            background: C.mostaza,
            color: C.tinta,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}>
            {totalItems}
          </span>
        )}
      </motion.button>

      {/* ── Overlay ──────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,10,12,0.55)",
          zIndex: 60,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* ── Drawer ───────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Su pedido"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(400px, 100vw)",
          background: C.cream,
          borderLeft: "1px solid rgba(26,10,12,0.12)",
          zIndex: 70,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Header — factura */}
        <div style={{
          padding: "20px 24px 14px",
          borderBottom: "1px dashed rgba(26,10,12,0.2)",
          flexShrink: 0,
          position: "relative",
        }}>
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            style={{
              position: "absolute",
              top: 20, right: 24,
              width: 28, height: 28,
              background: "transparent",
              border: `1px solid ${C.tinta}`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.75rem",
              color: C.tinta,
            }}
          >
            ✕
          </button>

          {/* Brand */}
          <div style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "2rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: C.tinta,
            lineHeight: 1,
          }}>
            SPRINGS
          </div>

          {/* Receipt meta */}
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color: C.tinta,
            opacity: 0.5,
            textTransform: "uppercase",
            marginTop: 4,
          }}>
            BUCARAMANGA
          </div>

          {/* Divider line */}
          <div style={{
            borderTop: "1px solid rgba(26,10,12,0.15)",
            margin: "10px 0",
          }} />

          {/* Order info row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}>
            <div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.18em",
                color: C.tinta,
                opacity: 0.4,
                textTransform: "uppercase",
              }}>
                SU PEDIDO
              </div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.48rem",
                letterSpacing: "0.1em",
                color: C.tinta,
                opacity: 0.3,
                marginTop: 2,
              }}>
                {new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                {" · "}
                {new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.1em",
              color: C.tinta,
              opacity: 0.3,
              textTransform: "uppercase",
            }}>
              {totalItems > 0 ? `${totalItems} ítem${totalItems > 1 ? "s" : ""}` : "VACÍO"}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "0 24px", overflowY: "auto" }}>
          {items.length === 0 ? (
            <p style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              color: C.tinta,
              opacity: 0.35,
              lineHeight: 1.8,
              margin: "32px 0",
              textTransform: "uppercase",
            }}>
              Su pedido está vacío.<br />La papa no se hornea sola.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map(item => {
                const extrasTotal = item.extras.reduce((e, x) => e + x.precio * x.cantidad, 0);
                const lineTotal = (item.precio + extrasTotal) * item.cantidad;
                return (
                <li key={item.cartId} style={{ padding: "16px 0", borderBottom: "1px dashed rgba(26,10,12,0.15)" }}>
                  {/* Fila principal: cantidad×nombre + precio */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontFamily: "Anton, sans-serif",
                        fontSize: "1.15rem",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        color: C.tinta,
                        lineHeight: 1.1,
                        display: "block",
                      }}>
                        {item.cantidad}× {item.nombre}
                      </span>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.58rem",
                        letterSpacing: "0.1em",
                        color: C.tinta,
                        opacity: 0.4,
                        display: "block",
                        marginTop: 3,
                        textTransform: "uppercase",
                      }}>
                        {fmt(item.precio)} c/u
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: C.tinta,
                      flexShrink: 0,
                      paddingTop: 2,
                    }}>
                      {fmt(lineTotal)}
                    </span>
                  </div>

                  {/* Extras */}
                  {item.extras.length > 0 && (
                    <div style={{ marginTop: 6, paddingLeft: 2 }}>
                      {item.extras.map(x => (
                        <div key={x.id} style={{
                          display: "flex", justifyContent: "space-between",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.52rem",
                          letterSpacing: "0.08em",
                          color: C.tinta,
                          opacity: 0.45,
                          textTransform: "uppercase",
                          marginTop: 3,
                        }}>
                          <span>+ {x.nombre}{x.cantidad > 1 ? ` ×${x.cantidad}` : ""}</span>
                          <span>{fmt(x.precio * x.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fila stepper + eliminar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => onRemove(item.cartId)}
                      aria-label={`Quitar uno de ${item.nombre}`}
                      style={{
                        width: 28, height: 28,
                        border: `1px solid rgba(26,10,12,0.3)`,
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1rem", color: C.tinta,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, padding: 0,
                      }}
                    >–</button>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.85rem",
                      color: C.tinta,
                      minWidth: 16,
                      textAlign: "center",
                    }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => onAdd(item.cartId)}
                      aria-label={`Agregar uno más de ${item.nombre}`}
                      style={{
                        width: 28, height: 28,
                        border: `1px solid ${C.tinta}`,
                        background: C.tinta, color: C.cream,
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, padding: 0,
                      }}
                    >+</button>
                    <button
                      onClick={() => onDelete(item.cartId)}
                      aria-label={`Eliminar ${item.nombre}`}
                      style={{
                        marginLeft: "auto",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        color: C.tinta,
                        opacity: 0.3,
                        textTransform: "uppercase",
                        padding: 0,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "0.3")}
                    >
                      QUITAR
                    </button>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px 24px",
          borderTop: "1px solid rgba(26,10,12,0.1)",
          flexShrink: 0,
        }}>
          {/* Barra domicilio gratis */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              height: 4,
              background: "rgba(26,10,12,0.1)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${pct}%`,
                background: C.mostaza,
                transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }} />
            </div>
            <p style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              color: C.tinta,
              opacity: 0.45,
              margin: "6px 0 0",
              textTransform: "uppercase",
            }}>
              {total >= UMBRAL
                ? "DOMICILIO GRATIS"
                : `FALTAN ${fmt(falta)} PARA DOMICILIO GRATIS`}
            </p>
          </div>

          {/* Subtotal total */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
          }}>
            <span style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              color: C.tinta,
              textTransform: "uppercase",
            }}>
              SUBTOTAL
            </span>
            <span style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "1.3rem",
              color: C.tinta,
            }}>
              {fmt(total)}
            </span>
          </div>

          {/* CTA */}
          <button
            disabled={items.length === 0}
            style={{
              width: "100%",
              height: 56,
              background: items.length === 0 ? "rgba(26,10,12,0.18)" : C.burgundy,
              color: C.cream,
              border: "none",
              cursor: items.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "Anton, sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => { if (items.length > 0) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            IR A PAGAR →
          </button>
        </div>
      </aside>
    </>
  );
}
