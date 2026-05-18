"use client";

import { useState, useEffect } from "react";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const UMBRAL = 60000;

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CartProps {
  items: CartItem[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function Cart({ items, onAdd, onRemove, onDelete }: CartProps) {
  const [open, setOpen] = useState(false);

  const total      = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
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
      <button
        onClick={() => setOpen(true)}
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
          transition: "opacity 0.15s",
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
      </button>

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
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 24px 16px",
          borderBottom: "1px solid rgba(26,10,12,0.1)",
          flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "1.5rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.tinta,
            margin: 0,
          }}>
            SU PEDIDO
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: `1px solid ${C.tinta}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.85rem",
              color: C.tinta,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "0 24px", overflowY: "auto" }}>
          {items.length === 0 ? (
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.85rem",
              color: C.tinta,
              opacity: 0.4,
              lineHeight: 1.6,
              margin: "32px 0",
            }}>
              Su pedido está vacío. La papa no se hornea sola.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map(item => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(26,10,12,0.1)",
                  }}
                >
                  {/* Nombre + precio unitario */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: "Anton, sans-serif",
                      fontSize: "0.88rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: C.tinta,
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {item.nombre}
                    </span>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.68rem",
                      color: C.tinta,
                      opacity: 0.5,
                      display: "block",
                      marginTop: 2,
                    }}>
                      {fmt(item.precio)} c/u
                    </span>
                  </div>

                  {/* Stepper */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => onRemove(item.id)}
                      aria-label={`Quitar uno de ${item.nombre}`}
                      style={{
                        width: 24,
                        height: 24,
                        border: `1px solid ${C.tinta}`,
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.8rem",
                        color: C.tinta,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: 0,
                      }}
                    >
                      –
                    </button>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.9rem",
                      color: C.tinta,
                      minWidth: 18,
                      textAlign: "center",
                      flexShrink: 0,
                    }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => onAdd(item.id)}
                      aria-label={`Agregar uno más de ${item.nombre}`}
                      style={{
                        width: 24,
                        height: 24,
                        border: `1px solid ${C.tinta}`,
                        background: C.tinta,
                        color: C.cream,
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: 0,
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal del item */}
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.8rem",
                    color: C.tinta,
                    flexShrink: 0,
                    minWidth: 60,
                    textAlign: "right",
                  }}>
                    {fmt(item.precio * item.cantidad)}
                  </span>

                  {/* Eliminar */}
                  <button
                    onClick={() => onDelete(item.id)}
                    aria-label={`Eliminar ${item.nombre}`}
                    style={{
                      width: 20,
                      height: 20,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.72rem",
                      color: C.tinta,
                      opacity: 0.35,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: 0,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.35")}
                  >
                    ✕
                  </button>
                </li>
              ))}
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
