"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { productos, type Categoria, type Producto } from "@/data/productos";

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
  const [categoria, setCategoria] = useState<Categoria>("combo");
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
  const activo = items[index];

  // Distancia signada más corta entre item i e índice actual (con wrap circular)
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

  if (!activo) return null;

  const categoriaActual = CATEGORIAS.find((c) => c.key === categoria)?.label ?? "";

  return (
    <section
      id="menu"
      className="relative w-full bg-cream overflow-hidden"
      style={{
        height: "100vh",
        paddingTop: "max(56px, env(safe-area-inset-top, 56px))",
        paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header — selector de categorías */}
      <div className="px-6 md:px-12 mb-8 md:mb-10">
        <div className="flex items-center gap-2 text-tinta/50 font-mono text-[0.6rem] tracking-[0.22em] uppercase mb-4">
          <span className="block w-3 h-px bg-tinta/40" />
          AQUÍ TIENES NUESTRO MENÚ
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIAS.map((c) => {
            const active = c.key === categoria;
            return (
              <button
                key={c.key}
                onClick={() => setCategoria(c.key)}
                className="font-mono text-[0.65rem] md:text-[0.7rem] tracking-[0.22em] uppercase shrink-0 transition-colors"
                style={{
                  padding: "10px 18px",
                  background: active ? "var(--tinta)" : "transparent",
                  color: active ? "var(--cream)" : "var(--tinta)",
                  border: `1px solid var(--tinta)`,
                  cursor: "pointer",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tipografía gigante de fondo — nombre de la categoría */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[42%] -translate-y-1/2 text-center whitespace-nowrap font-display"
        style={{
          fontSize: "clamp(140px, 24vw, 380px)",
          lineHeight: 0.85,
          letterSpacing: "-0.005em",
          color: "var(--tinta)",
          opacity: 0.06,
          textTransform: "uppercase",
          zIndex: 1,
        }}
      >
        {categoriaActual}
      </div>

      {/* Carrusel rueda — área central */}
      <div className="relative flex-1 flex flex-col justify-center" style={{ zIndex: 2 }}>
        <div
          className="relative mx-auto"
          style={{
            width: "100%",
            maxWidth: "1100px",
            height: "min(64vh, 540px)",
            perspective: "1400px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {items.map((p, i) => {
            const d = signedDistance(i);
            const isCenter = d === 0;
            const onClickCard = () => {
              if (isCenter) {
                onAgregar?.(p);
              } else {
                goTo(i);
              }
            };
            return (
              <WheelCard
                key={p.id}
                producto={p}
                distance={d}
                onClick={onClickCard}
                onAgregar={onAgregar}
              />
            );
          })}
        </div>

        {/* Controles — flechas y paginador */}
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-4 md:gap-6">
          <button
            onClick={goPrev}
            disabled={total < 2}
            aria-label="Anterior"
            className="font-display text-2xl text-tinta disabled:opacity-30"
            style={{
              padding: "8px 14px",
              border: `1px solid var(--tinta)`,
              background: "var(--cream)",
              cursor: total < 2 ? "default" : "pointer",
            }}
          >
            ←
          </button>
          <div
            className="font-mono text-tinta tabular-nums"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              padding: "10px 16px",
              border: `1px solid var(--tinta)`,
            }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <button
            onClick={goNext}
            disabled={total < 2}
            aria-label="Siguiente"
            className="font-display text-2xl text-tinta disabled:opacity-30"
            style={{
              padding: "8px 14px",
              border: `1px solid var(--tinta)`,
              background: "var(--cream)",
              cursor: total < 2 ? "default" : "pointer",
            }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────── */

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

  // Geometría de la rueda: a más lejos del centro, más giro, menos escala, menos opacidad
  const CARD_OFFSET_VW = 26; // separación entre slots en vw (responsive)
  const x = distance * CARD_OFFSET_VW;
  const rotateY = -distance * 38;
  const scale = isCenter ? 1 : abs === 1 ? 0.62 : 0.4;
  const opacity = !visible ? 0 : isCenter ? 1 : abs === 1 ? 0.55 : 0.18;
  const zIndex = 20 - abs * 3;
  const blur = abs >= 2 ? 4 : 0;

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
        x: `${x}vw`,
        rotateY,
        scale,
        opacity,
        filter: `blur(${blur}px)`,
      }}
      transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        translateX: "-50%",
        translateY: "-50%",
        width: "min(420px, 78vw)",
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
  return (
    <article className="flex flex-col bg-cream text-left" style={{ border: `1px solid var(--tinta)` }}>
      <div
        className="relative flex items-center justify-center"
        style={{
          aspectRatio: "4 / 3",
          background:
            "radial-gradient(ellipse at 50% 45%, #D4A55A 0%, #9B6530 35%, #5C3514 70%, #2E1A08 100%)",
          borderBottom: `1px solid var(--tinta)`,
        }}
      >
        <span
          className="font-display uppercase text-center px-4"
          style={{
            fontSize: "clamp(34px, 5.5vw, 64px)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
            textShadow: "0 4px 14px rgba(0,0,0,0.35)",
          }}
        >
          {producto.nombre}
        </span>
        <span
          className="absolute top-3 left-3 font-mono uppercase"
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "var(--cream)",
            opacity: 0.6,
          }}
        >
          W25 · BGA
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 p-5 md:p-6">
        <div className="font-mono uppercase text-tinta/50" style={{ fontSize: "0.55rem", letterSpacing: "0.22em" }}>
          {CATEGORIAS.find((c) => c.key === producto.categoria)?.label}
        </div>
        <h3 className="font-display text-tinta uppercase" style={{ fontSize: "clamp(24px, 3.2vw, 40px)", lineHeight: 0.95, letterSpacing: "0.01em" }}>
          {producto.nombre}
        </h3>

        {expanded && producto.descripcion && (
          <p className="font-sans text-tinta/80" style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-4">
          <div className="font-mono text-tinta tabular-nums" style={{ fontSize: expanded ? "1.4rem" : "1rem", letterSpacing: "0.04em" }}>
            {formatPrecio(producto.precio)}
          </div>
          {expanded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAgregar?.(producto);
              }}
              disabled={!producto.disponible}
              className="font-display uppercase disabled:opacity-40"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.18em",
                padding: "14px 22px",
                background: "var(--burgundy)",
                color: "var(--cream)",
                border: `1px solid var(--tinta)`,
                cursor: producto.disponible ? "pointer" : "not-allowed",
              }}
            >
              {producto.disponible ? "AGREGAR ↗" : "AGOTADO"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

