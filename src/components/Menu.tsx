"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productos, type Categoria, type Producto } from "@/data/productos";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
  plate: "#CBC4B0",
};

const CATEGORIAS: { key: Categoria; label: string }[] = [
  { key: "combo", label: "COMBOS" },
  { key: "jacket", label: "JACKETS" },
  { key: "loaded", label: "LOADED" },
  { key: "extra", label: "EXTRAS" },
  { key: "bebida", label: "BEBIDAS" },
];

const formatPrecio = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

type Props = { onAgregar?: (producto: Producto) => void };

export default function Menu({ onAgregar }: Props) {
  const [categoria, setCategoria] = useState<Categoria>("jacket");
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => productos.filter((p) => p.categoria === categoria).sort((a, b) => a.orden - b.orden),
    [categoria],
  );

  useEffect(() => { setIndex(0); }, [categoria]);

  const total = items.length;

  const signedDistance = useCallback(
    (i: number) => {
      if (total === 0) return 0;
      let d = i - index;
      if (d > total / 2) d -= total;
      if (d < -total / 2) d += total;
      return d;
    },
    [index, total],
  );

  const goPrev = useCallback(() => { if (total > 1) setIndex((i) => (i - 1 + total) % total); }, [total]);
  const goNext = useCallback(() => { if (total > 1) setIndex((i) => (i + 1) % total); }, [total]);
  const goTo  = useCallback((t: number) => { if (total > 1 && t !== index) setIndex(t); }, [index, total]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goPrev, goNext]);

  if (!items.length) return null;

  const categoriaActual = CATEGORIAS.find((c) => c.key === categoria)?.label ?? "";
  const activo = items[index];

  /* ── imgSrc helper ── */
  const imgSrc = (p: Producto) => p.imagen_url || "/images/jacket-placeholder.png";

  return (
    <section
      id="menu"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: C.cream,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingTop: "max(56px, env(safe-area-inset-top, 56px))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px) 18px" }}>
        <div style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.6rem", letterSpacing: "0.22em",
          color: C.tinta, opacity: 0.5, textTransform: "uppercase",
          marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "block", width: 12, height: 1, background: C.tinta, opacity: 0.4 }} />
          AQUÍ TIENES NUESTRO MENÚ
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIAS.map((c) => {
            const active = c.key === categoria;
            return (
              <button key={c.key} onClick={() => setCategoria(c.key)} style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase",
                padding: "10px 18px",
                background: active ? C.tinta : "transparent",
                color: active ? C.cream : C.tinta,
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

      {/* ── Watermark ── */}
      <div aria-hidden style={{
        pointerEvents: "none", position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-anton), sans-serif",
        fontSize: "clamp(100px, 20vw, 320px)", lineHeight: 0.85,
        color: C.tinta, opacity: 0.055,
        textTransform: "uppercase", whiteSpace: "nowrap",
        zIndex: 1, userSelect: "none",
      }}>
        {categoriaActual}
      </div>

      {/* ── Carousel + info ── */}
      <div style={{
        position: "relative", flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", zIndex: 2,
        overflow: "hidden",
      }}>

        {/* Cards track — images only */}
        <div style={{
          position: "relative",
          width: "100%",
          flex: 1,
          overflow: "visible",
        }}>
          {items.map((p, i) => {
            const d = signedDistance(i);
            const abs = Math.abs(d);
            const isCenter = d === 0;
            const visible = abs <= 2;
            const scale   = isCenter ? 1 : abs === 1 ? 0.6 : 0.38;
            const opacity = !visible ? 0 : isCenter ? 1 : abs === 1 ? 0.7 : 0.25;
            const zIndex  = 20 - abs * 3;

            return (
              <motion.div
                key={p.id}
                role={isCenter ? undefined : "button"}
                tabIndex={visible && !isCenter ? 0 : -1}
                onClick={isCenter ? undefined : () => goTo(i)}
                onKeyDown={(e) => {
                  if (!isCenter && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
                aria-label={!isCenter ? `Ir a ${p.nombre}` : undefined}
                aria-hidden={!visible}
                animate={{ x: `${d * 30}vw`, scale, opacity }}
                transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                  zIndex,
                  cursor: isCenter ? "default" : "pointer",
                  pointerEvents: visible ? "auto" : "none",
                  WebkitTapHighlightColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Potato image + plate */}
                <div style={{
                  position: "relative",
                  width: "min(340px, 56vw)",
                  height: "min(340px, 56vw)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}>
                  {/* Plate disc */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(290px, 48vw)",
                    height: "min(290px, 48vw)",
                    background: C.plate,
                    clipPath: "circle(50%)",
                    filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.22))",
                    zIndex: 1,
                  }} />
                  {/* Potato image */}
                  <img
                    src={imgSrc(p)}
                    alt={p.nombre}
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                {/* Side card info — shown scaled alongside image */}
                {!isCenter && (
                  <div style={{ textAlign: "center", marginTop: 8 }}>
                    <div style={{
                      fontFamily: "var(--font-anton), sans-serif",
                      fontSize: "clamp(16px, 3.2vw, 28px)",
                      textTransform: "uppercase",
                      color: C.tinta, margin: 0, letterSpacing: "0.01em",
                    }}>
                      {p.nombre.toUpperCase()}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.65rem", letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: C.tinta, opacity: 0.6,
                      margin: "4px 0 0",
                    }}>
                      {p.descripcion.toUpperCase()}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "0.85rem", color: C.tinta,
                      marginTop: 5, letterSpacing: "0.02em",
                    }}>
                      {formatPrecio(p.precio)} COP
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* ── Nav arrows — beside center potato ── */}
          {total > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Anterior"
                style={{
                  position: "absolute",
                  left: "calc(50% - min(220px, 38vw))",
                  top: "42%",
                  transform: "translate(-50%, -50%)",
                  width: 52, height: 52,
                  background: "rgba(242,232,213,0.85)",
                  boxShadow: `inset 0 0 0 1px ${C.tinta}`,
                  clipPath: "circle(50%)",
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "1.3rem", color: C.tinta,
                  zIndex: 30,
                  backdropFilter: "blur(4px)",
                }}
              >
                ‹
              </button>
              <button
                onClick={goNext}
                aria-label="Siguiente"
                style={{
                  position: "absolute",
                  left: "calc(50% + min(168px, 30vw))",
                  top: "42%",
                  transform: "translate(-50%, -50%)",
                  width: 52, height: 52,
                  background: "rgba(242,232,213,0.85)",
                  boxShadow: `inset 0 0 0 1px ${C.tinta}`,
                  clipPath: "circle(50%)",
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "1.3rem", color: C.tinta,
                  zIndex: 30,
                  backdropFilter: "blur(4px)",
                }}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* ── Center product info (fixed below carousel) ── */}
        <div style={{ textAlign: "center", paddingBottom: 8, width: "min(600px, 86vw)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Name + sparkles */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 12, marginBottom: 6,
              }}>
                <span style={{ color: C.tinta, fontSize: "0.8rem" }}>✦</span>
                <h3 style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "clamp(32px, 6vw, 64px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.01em", lineHeight: 1,
                  color: C.tinta, margin: 0,
                }}>
                  {activo.nombre}
                </h3>
                <span style={{ color: C.tinta, fontSize: "0.8rem" }}>✦</span>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.72rem", letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.tinta, opacity: 0.65,
                margin: "0 0 12px",
              }}>
                {activo.descripcion.toUpperCase()}
              </p>

              {/* Price + CTA */}
              <div style={{
                display: "flex", alignItems: "stretch",
                border: `1px solid ${C.tinta}`,
              }}>
                <div style={{
                  flex: 1, padding: "12px 24px",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  borderRight: `1px solid ${C.tinta}`,
                }}>
                  <span style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "1.5rem", color: C.tinta,
                    letterSpacing: "0.02em", display: "block",
                  }}>
                    {formatPrecio(activo.precio)}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "0.5rem", letterSpacing: "0.22em",
                    color: C.tinta, opacity: 0.5, marginTop: 2, display: "block",
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
                    fontSize: "0.85rem", letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0 32px",
                    background: C.burgundy, color: C.cream,
                    border: "none",
                    cursor: activo.disponible ? "pointer" : "not-allowed",
                    opacity: activo.disponible ? 1 : 0.4,
                    minWidth: 160,
                  }}
                >
                  {activo.disponible ? "AGREGAR ↗" : "AGOTADO"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Dot pagination ── */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Producto ${i + 1}`}
              style={{
                width: i === index ? 20 : 8, height: 8,
                background: i === index ? C.tinta : "transparent",
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
