"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { productos, type Categoria, type Producto } from "@/data/productos";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
  plate: "#CEC8B4",
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

type Props = {
  onAgregar?: (producto: Producto) => void;
};

export default function Menu({ onAgregar }: Props) {
  const [categoria, setCategoria] = useState<Categoria>("jacket");
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () =>
      productos
        .filter((p) => p.categoria === categoria)
        .sort((a, b) => a.orden - b.orden),
    [categoria],
  );

  useEffect(() => {
    setIndex(0);
  }, [categoria]);

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

  const goPrev = useCallback(() => {
    if (total < 2) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total < 2) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goTo = useCallback(
    (targetIdx: number) => {
      if (total < 2 || targetIdx === index) return;
      setIndex(targetIdx);
    },
    [index, total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (!items.length) return null;

  const categoriaActual = CATEGORIAS.find((c) => c.key === categoria)?.label ?? "";

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
        paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
      }}
    >
      {/* Header */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px) 20px" }}>
        <div style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          color: C.tinta,
          opacity: 0.5,
          textTransform: "uppercase",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ display: "block", width: 12, height: 1, background: C.tinta, opacity: 0.4 }} />
          AQUÍ TIENES NUESTRO MENÚ
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIAS.map((c) => {
            const active = c.key === categoria;
            return (
              <button
                key={c.key}
                onClick={() => setCategoria(c.key)}
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "10px 18px",
                  background: active ? C.tinta : "transparent",
                  color: active ? C.cream : C.tinta,
                  border: `1px solid ${C.tinta}`,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Watermark */}
      <div
        aria-hidden
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-anton), sans-serif",
          fontSize: "clamp(100px, 20vw, 320px)",
          lineHeight: 0.85,
          color: C.tinta,
          opacity: 0.055,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          zIndex: 1,
          userSelect: "none",
        }}
      >
        {categoriaActual}
      </div>

      {/* Carousel area */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>

        {/* Cards track */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "min(68vh, 580px)",
            perspective: "1400px",
            perspectiveOrigin: "50% 45%",
          }}
        >
          {items.map((p, i) => {
            const d = signedDistance(i);
            const isCenter = d === 0;
            return (
              <WheelCard
                key={p.id}
                producto={p}
                distance={d}
                onClick={() => { if (!isCenter) goTo(i); }}
                onAgregar={onAgregar}
              />
            );
          })}
        </div>

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <NavBtn direction="prev" onClick={goPrev} style={{ position: "absolute", left: "clamp(10px, 5vw, 60px)", top: "42%" }} />
            <NavBtn direction="next" onClick={goNext} style={{ position: "absolute", right: "clamp(10px, 5vw, 60px)", top: "42%" }} />
          </>
        )}

        {/* Dot pagination */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Producto ${i + 1}`}
              style={{
                width: i === index ? 20 : 8,
                height: 8,
                background: i === index ? C.tinta : "transparent",
                border: `1px solid ${C.tinta}`,
                cursor: "pointer",
                padding: 0,
                transition: "width 0.25s, background 0.25s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NavBtn({ direction, onClick, style }: { direction: "prev" | "next"; onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Anterior" : "Siguiente"}
      style={{
        width: 52,
        height: 52,
        background: C.cream,
        boxShadow: `inset 0 0 0 1px ${C.tinta}`,
        clipPath: "circle(50%)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontFamily: "var(--font-anton), sans-serif",
        fontSize: "1.4rem",
        color: C.tinta,
        lineHeight: 1,
        transform: "translateY(-50%)",
        zIndex: 10,
        ...style,
      }}
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}

function WheelCard({
  producto,
  distance,
  onClick,
  onAgregar,
}: {
  producto: Producto;
  distance: number;
  onClick: () => void;
  onAgregar?: (p: Producto) => void;
}) {
  const abs = Math.abs(distance);
  const isCenter = distance === 0;
  const visible = abs <= 2;

  const scale = isCenter ? 1 : abs === 1 ? 0.62 : 0.38;
  const opacity = !visible ? 0 : isCenter ? 1 : abs === 1 ? 0.55 : 0.18;
  const zIndex = 20 - abs * 3;

  return (
    <motion.div
      role={isCenter ? undefined : "button"}
      tabIndex={visible && !isCenter ? 0 : -1}
      onClick={isCenter ? undefined : onClick}
      onKeyDown={(e) => {
        if (!isCenter && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={!isCenter ? `Ir a ${producto.nombre}` : undefined}
      aria-hidden={!visible}
      animate={{
        x: `${distance * 28}vw`,
        rotateY: -distance * 22,
        scale,
        opacity,
      }}
      transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        translateX: "-50%",
        translateY: "-50%",
        width: "min(380px, 68vw)",
        zIndex,
        cursor: isCenter ? "default" : "pointer",
        pointerEvents: visible ? "auto" : "none",
        transformStyle: "preserve-3d",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <ProductoCard producto={producto} expanded={isCenter} onAgregar={onAgregar} />
    </motion.div>
  );
}

function ProductoCard({
  producto,
  expanded,
  onAgregar,
}: {
  producto: Producto;
  expanded: boolean;
  onAgregar?: (p: Producto) => void;
}) {
  const imgSrc = producto.imagen_url || "/images/jacket-placeholder.png";

  return (
    <article style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "transparent" }}>

      {/* Image + plate */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <img
          src={imgSrc}
          alt={producto.nombre}
          style={{
            width: "min(260px, 54vw)",
            height: "min(260px, 54vw)",
            objectFit: "contain",
            position: "relative",
            zIndex: 2,
            display: "block",
          }}
        />
        <div style={{
          width: "68%",
          height: 20,
          background: C.plate,
          clipPath: "ellipse(50% 50% at 50% 50%)",
          marginTop: -14,
          position: "relative",
          zIndex: 1,
        }} />
      </div>

      {/* Center — expanded info */}
      {expanded ? (
        <div style={{ textAlign: "center", marginTop: 14, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ color: C.tinta, fontSize: "0.8rem" }}>✦</span>
            <h3 style={{
              fontFamily: "var(--font-anton), sans-serif",
              fontSize: "clamp(28px, 5.5vw, 58px)",
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              lineHeight: 1,
              color: C.tinta,
              margin: 0,
            }}>
              {producto.nombre}
            </h3>
            <span style={{ color: C.tinta, fontSize: "0.8rem" }}>✦</span>
          </div>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.tinta,
            opacity: 0.6,
            margin: "8px 0 0",
          }}>
            {producto.descripcion.toUpperCase()}
          </p>
          <div style={{
            display: "flex",
            alignItems: "stretch",
            marginTop: 14,
            border: `1px solid ${C.tinta}`,
          }}>
            <div style={{
              flex: 1,
              padding: "12px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRight: `1px solid ${C.tinta}`,
            }}>
              <span style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "1.3rem",
                color: C.tinta,
                letterSpacing: "0.02em",
                display: "block",
              }}>
                {formatPrecio(producto.precio)}
              </span>
              <span style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                color: C.tinta,
                opacity: 0.5,
                marginTop: 2,
                display: "block",
              }}>
                COP
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAgregar?.(producto); }}
              disabled={!producto.disponible}
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "12px 22px",
                background: C.burgundy,
                color: C.cream,
                border: "none",
                cursor: producto.disponible ? "pointer" : "not-allowed",
                opacity: producto.disponible ? 1 : 0.4,
              }}
            >
              {producto.disponible ? "AGREGAR ↗" : "AGOTADO"}
            </button>
          </div>
        </div>
      ) : (
        /* Side — compact info */
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <h3 style={{
            fontFamily: "var(--font-anton), sans-serif",
            fontSize: "clamp(15px, 3vw, 24px)",
            textTransform: "uppercase",
            color: C.tinta,
            margin: 0,
          }}>
            {producto.nombre}
          </h3>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: C.tinta,
            opacity: 0.55,
            margin: "4px 0 0",
          }}>
            {producto.descripcion.toUpperCase()}
          </p>
          <div style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.82rem",
            color: C.tinta,
            marginTop: 5,
          }}>
            {formatPrecio(producto.precio)} COP
          </div>
        </div>
      )}
    </article>
  );
}
