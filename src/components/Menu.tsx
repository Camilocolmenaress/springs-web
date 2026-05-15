"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productos, type Categoria, type Producto } from "@/data/productos";

/* ── Design tokens ─────────────────────────────────────── */
const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const CATEGORIAS: { key: Categoria; label: string }[] = [
  { key: "combo",  label: "COMBOS"  },
  { key: "jacket", label: "JACKETS" },
  { key: "loaded", label: "LOADED"  },
  { key: "extra",  label: "EXTRAS"  },
  { key: "bebida", label: "BEBIDAS" },
];

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


/* ── Chevron ────────────────────────────────────────────── */
function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <span style={{
      display: "block",
      width: 11, height: 11,
      borderRight: `2px solid ${C.tinta}`,
      borderTop:   `2px solid ${C.tinta}`,
      transform: dir === "right"
        ? "rotate(45deg)  translate(-2px, 2px)"
        : "rotate(-135deg) translate(2px, -2px)",
    }} />
  );
}

/* ── Main component ─────────────────────────────────────── */
type Props = { onAgregar?: (p: Producto) => void };

export default function Menu({ onAgregar }: Props) {
  const [categoria, setCategoria] = useState<Categoria>("jacket");
  /*
   * vIdx es un índice virtual MONOTÓNICO (crece / decrece infinitamente).
   * Nunca hace wrap en pantalla → elimina el "ghost" que cruzaba rapidísimo.
   * getItem() convierte vIdx → índice real con modulo.
   */
  const [vIdx, setVIdx] = useState(0);

  const items = useMemo(
    () => productos.filter(p => p.categoria === categoria).sort((a, b) => a.orden - b.orden),
    [categoria],
  );

  useEffect(() => { setVIdx(0); }, [categoria]);

  const total = items.length;
  const getItem = useCallback(
    (v: number): Producto => items[((v % total) + total) % total],
    [items, total],
  );

  const activo         = total > 0 ? getItem(vIdx) : null;
  const activeRealIdx  = total > 0 ? ((vIdx % total) + total) % total : 0;
  const imgSrc = (p: Producto) => p.imagen_url || "/images/jacket-placeholder.png";

  const goPrev = useCallback(() => setVIdx(v => v - 1), []);
  const goNext = useCallback(() => setVIdx(v => v + 1), []);
  const goTo   = useCallback((target: number) => {
    if (total < 2) return;
    const cur = ((vIdx % total) + total) % total;
    let d = target - cur;
    if (d >  total / 2) d -= total;
    if (d < -total / 2) d += total;
    setVIdx(v => v + d);
  }, [vIdx, total]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goPrev, goNext]);

  if (!activo || !items.length) return null;

  const categoriaLabel = CATEGORIAS.find(c => c.key === categoria)?.label ?? "";
  const OFFSETS = [-2, -1, 0, 1, 2] as const;

  return (
    <section id="menu" style={{
      position: "relative",
      width: "100%", height: "100vh",
      background: C.cream,
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      paddingTop:    "max(56px, env(safe-area-inset-top,    56px))",
      paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
    }}>

      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px) 16px", flexShrink: 0 }}>
        <div style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.6rem", letterSpacing: "0.22em",
          color: C.tinta, opacity: 0.5, textTransform: "uppercase",
          marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "block", width: 12, height: 1, background: C.tinta, opacity: 0.4 }} />
          AQUÍ TIENES NUESTRO MENÚ
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIAS.map(c => {
            const active = c.key === categoria;
            return (
              <button key={c.key} onClick={() => setCategoria(c.key)} style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase",
                padding: "10px 18px",
                background: active ? C.tinta : "transparent",
                color:      active ? C.cream : C.tinta,
                border: `1px solid ${C.tinta}`,
                cursor: "pointer", flexShrink: 0,
                transition: "background 0.15s, color 0.15s",
              }}>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Watermark ────────────────────────────────────── */}
      <div aria-hidden style={{
        pointerEvents: "none",
        position: "absolute",
        /* Offset below header ≈ 120px, so watermark centers in carousel area */
        top: "50%", left: 0, right: 0,
        transform: "translateY(calc(-50% + 40px))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-anton), sans-serif",
        fontSize: "clamp(100px, 19vw, 300px)", lineHeight: 0.85,
        color: C.tinta, opacity: 0.055,
        textTransform: "uppercase", whiteSpace: "nowrap",
        zIndex: 1, userSelect: "none",
      }}>
        {categoriaLabel}
      </div>

      {/* ── Main flex area ───────────────────────────────── */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", zIndex: 2, overflowX: "hidden" }}>

        {/* Carousel track */}
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          <AnimatePresence>
            {OFFSETS.map(offset => {
              const v   = vIdx + offset;
              const p   = getItem(v);
              const abs = Math.abs(offset);
              const isCenter = abs === 0;
              const visible  = abs <= 2;
              const scale   = isCenter ? 1 : abs === 1 ? 0.58 : 0.36;
              const opacity = isCenter ? 1 : abs === 1 ? 0.75 : 0.28;

              return (
                <motion.div
                  key={v}
                  initial={false}
                  animate={{ x: `${offset * 30}vw`, scale, opacity }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ type: "spring", stiffness: 150, damping: 24, mass: 0.85 }}
                  onClick={isCenter ? undefined : () => goTo(((v % total) + total) % total)}
                  role={!isCenter && visible ? "button" : undefined}
                  tabIndex={!isCenter && visible ? 0 : -1}
                  aria-label={!isCenter ? `Ir a ${p.nombre}` : undefined}
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    translateX: "-50%", translateY: "-50%",
                    width: "min(340px, 60vw)",
                    zIndex: 20 - abs * 3,
                    cursor: isCenter ? "default" : "pointer",
                    pointerEvents: visible ? "auto" : "none",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <img
                    src={imgSrc(p)}
                    alt={p.nombre}
                    style={{
                      width:  isCenter ? "clamp(300px, 82vw, 700px)" : "min(260px, 44vw)",
                      height: isCenter ? "clamp(300px, 82vw, 700px)" : "min(260px, 44vw)",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />

                  {/* Side card text */}
                  {!isCenter && (
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                      <div style={{
                        fontFamily: "var(--font-anton), sans-serif",
                        fontSize: "clamp(13px, 2.6vw, 20px)",
                        textTransform: "uppercase", color: C.tinta,
                        letterSpacing: "0.01em",
                      }}>
                        {p.nombre.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.58rem", letterSpacing: "0.06em",
                        textTransform: "uppercase", color: C.tinta,
                        opacity: 0.55, marginTop: 3, lineHeight: 1.4,
                      }}>
                        {p.descripcion.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "0.78rem", color: C.tinta, marginTop: 4,
                      }}>
                        {fmt(p.precio)} COP
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* ── Nav arrows — beside center potato ─────────── */}
          {total > 1 && (
            <>
              <button onClick={goPrev} aria-label="Anterior" style={{
                position: "absolute",
                left:  "calc(50% - min(210px, 34vw))",
                top:   "40%",
                transform: "translate(-50%, -50%)",
                width: 50, height: 50,
                background: "rgba(242,232,213,0.88)",
                boxShadow: `inset 0 0 0 1px rgba(26,10,12,0.45)`,
                clipPath: "circle(50%)",
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 30,
              }}>
                <Chevron dir="left" />
              </button>
              <button onClick={goNext} aria-label="Siguiente" style={{
                position: "absolute",
                left:  "calc(50% + min(160px, 28vw))",
                top:   "40%",
                transform: "translate(-50%, -50%)",
                width: 50, height: 50,
                background: "rgba(242,232,213,0.88)",
                boxShadow: `inset 0 0 0 1px rgba(26,10,12,0.45)`,
                clipPath: "circle(50%)",
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 30,
              }}>
                <Chevron dir="right" />
              </button>
            </>
          )}
        </div>

        {/* ── Center product info ───────────────────────── */}
        <div style={{ flexShrink: 0, padding: "0 clamp(20px, 9vw, 140px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activo.id}-${activeRealIdx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ color: C.tinta, fontSize: "0.72rem" }}>✦</span>
                <h3 style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "clamp(28px, 5vw, 56px)",
                  textTransform: "uppercase", letterSpacing: "0.01em",
                  lineHeight: 1, color: C.tinta, margin: 0,
                }}>
                  {activo.nombre}
                </h3>
                <span style={{ color: C.tinta, fontSize: "0.72rem" }}>✦</span>
              </div>
              <p style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.68rem", letterSpacing: "0.12em",
                textTransform: "uppercase", color: C.tinta, opacity: 0.58,
                margin: "0 0 10px",
              }}>
                {activo.descripcion.toUpperCase()}
              </p>
              <div style={{ display: "flex", alignItems: "stretch", border: `1px solid ${C.tinta}` }}>
                <div style={{
                  flex: 1, padding: "8px 20px",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  borderRight: `1px solid ${C.tinta}`,
                }}>
                  <span style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "1.15rem", color: C.tinta, display: "block",
                  }}>
                    {fmt(activo.precio)}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "0.45rem", letterSpacing: "0.22em",
                    color: C.tinta, opacity: 0.5, display: "block",
                  }}>
                    COP
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onAgregar?.(activo)}
                  disabled={!activo.disponible}
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "0.78rem", letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "8px 28px",
                    background: C.burgundy, color: C.cream,
                    border: "none",
                    cursor: activo.disponible ? "pointer" : "not-allowed",
                    opacity: activo.disponible ? 1 : 0.4,
                    minWidth: 130,
                  }}
                >
                  {activo.disponible ? "AGREGAR ↗" : "AGOTADO"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Dot pagination ────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, padding: "10px 0 0", justifyContent: "center", flexShrink: 0 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Producto ${i + 1}`}
              style={{
                width:  i === activeRealIdx ? 20 : 8,
                height: 8,
                background: i === activeRealIdx ? C.tinta : "transparent",
                border: `1px solid ${C.tinta}`,
                cursor: "pointer", padding: 0,
                transition: "width 0.25s, background 0.25s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
