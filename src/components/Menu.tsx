"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productos, type Categoria, type Producto } from "@/data/productos";
import type { PageConfig, SliderProp } from "@/types/design";

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
function Chevron({ dir, size = 10 }: { dir: "left" | "right"; size?: number }) {
  return (
    <span style={{
      display: "block",
      width: size, height: size,
      borderRight: `1.5px solid ${C.tinta}`,
      borderTop:   `1.5px solid ${C.tinta}`,
      transform: dir === "right"
        ? "rotate(45deg)  translate(-1px, 1px)"
        : "rotate(-135deg) translate(1px, -1px)",
    }} />
  );
}

/* ── Config helpers ─────────────────────────────────────── */
function sv(prop: unknown, fallback: number): number {
  if (prop && typeof prop === "object" && "value" in prop) return (prop as SliderProp).value;
  return fallback;
}
function su(prop: unknown, fallback: string): string {
  if (prop && typeof prop === "object" && "unit" in prop) return (prop as SliderProp).unit;
  return fallback;
}
function scv(prop: unknown, fallback: number): string {
  return `${sv(prop, fallback)}${su(prop, "")}`;
}

/* ── Main component ─────────────────────────────────────── */
type Props = { onAgregar?: (p: Producto) => void; config?: PageConfig };

export default function Menu({ onAgregar, config }: Props) {
  const z = config?.zones;
  const c  = z?.carousel?.elements;
  const wi = z?.watermark?.elements;
  const pi = z?.productInfo?.elements;

  // Center potato
  const centerImgSize = scv(c?.centerImage?.props?.size, 52) || "52vh";
  const centerOffsetY = sv(c?.centerImage?.props?.offsetY, 0);
  const centerOffsetX = sv(c?.centerImage?.props?.offsetX, 0);
  // Near potatoes (±1)
  const nearImgSize   = scv(c?.nearImage?.props?.size, 30) || "30vh";
  const nearOffsetY   = sv(c?.nearImage?.props?.offsetY, 0);
  const nearOffsetX   = sv(c?.nearImage?.props?.offsetX, 0);
  // Far potatoes (±2)
  const farImgSize    = scv(c?.farImage?.props?.size, 22) || "22vh";
  const farOffsetY    = sv(c?.farImage?.props?.offsetY, 0);
  const farOffsetX    = sv(c?.farImage?.props?.offsetX, 0);
  // Track
  const trackOffsetY  = sv(c?.track?.props?.offsetY, 0);
  const trackOffsetX  = sv(c?.track?.props?.offsetX, 0);
  // Spacing
  const carouselGap   = sv(c?.spacing?.props?.gap, 23);
  // Arrows
  const ai = z?.arrows?.elements;
  const arrowSize    = sv(ai?.btn?.props?.size,    72);
  const arrowOffsetX = sv(ai?.btn?.props?.offsetX, 30);
  const arrowOffsetY = sv(ai?.btn?.props?.offsetY, 0);
  // Watermark
  const wmFontSize    = scv(wi?.title?.props?.fontSize, 19) || "19vw";
  const wmOpacity     = sv(wi?.title?.props?.opacity, 5.5) / 100;
  const wmTop         = scv(wi?.title?.props?.top, 35) || "35%";
  const wmOffsetX     = sv(wi?.title?.props?.offsetX, 0);
  // Side card
  const sc = z?.sideCard?.elements;
  const scWidth   = sv(sc?.container?.props?.width,   200);
  const scOffsetY = sv(sc?.container?.props?.offsetY, 10);
  const scOffsetX = sv(sc?.container?.props?.offsetX, 0);
  const scNameFs  = scv(sc?.name?.props?.fontSize, 2.6) || "2.6vw";
  const scDescFs  = scv(sc?.desc?.props?.fontSize, 0.58) || "0.58rem";
  const scPriceFs = scv(sc?.price?.props?.fontSize, 0.78) || "0.78rem";
  // Product info
  const nameFontSize  = scv(pi?.name?.props?.fontSize, 5) || "5vw";
  const nameOffsetX   = sv(pi?.name?.props?.offsetX, 0);
  const starsFontSize = scv(pi?.stars?.props?.fontSize, 0.72) || "0.72rem";
  const starsOffsetX  = sv(pi?.stars?.props?.offsetX, 0);
  const cardWidth     = sv(pi?.priceCard?.props?.width, 420);
  const cardMarginTop = sv(pi?.priceCard?.props?.marginTop, -80);
  const cardOffsetX   = sv(pi?.priceCard?.props?.offsetX, 0);
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
      paddingTop:    "max(72px, env(safe-area-inset-top,    72px))",
      paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
    }}>

      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ padding: "0 clamp(16px, 5vw, 80px) 8px", flexShrink: 0 }}>
        {/* Fila 1: label bajo el botón VOLVER */}
        <div style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.55rem", letterSpacing: "0.2em",
          color: C.tinta, opacity: 0.45,
          marginBottom: 8,
        }}>
          — AQUÍ TIENES NUESTRO MENÚ
        </div>
        {/* Fila 2: pestañas de categoría */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIAS.map(c => {
            const active = c.key === categoria;
            return (
              <button key={c.key} onClick={() => setCategoria(c.key)} style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "7px 13px",
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
        top: wmTop, left: 0, right: 0,
        transform: `translate(${wmOffsetX}px, -50%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-anton), sans-serif",
        fontSize: wmFontSize, lineHeight: 0.85,
        color: C.tinta, opacity: wmOpacity,
        textTransform: "uppercase", whiteSpace: "nowrap",
        zIndex: 1, userSelect: "none",
      }}>
        {categoriaLabel}
      </div>

      {/* ── Main flex area ───────────────────────────────── */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", zIndex: 2, overflowX: "hidden", justifyContent: "center" }}>

        {/* Carousel track */}
        <div style={{ position: "relative", flexShrink: 0, height: centerImgSize, overflow: "visible", transform: `translate(${trackOffsetX}px, ${trackOffsetY}px)` }}>
          <AnimatePresence>
            {OFFSETS.map(offset => {
              const v   = vIdx + offset;
              const p   = getItem(v);
              const abs = Math.abs(offset);
              const isCenter = abs === 0;
              const isNear   = abs === 1;
              const visible  = abs <= 2;
              const scale   = isCenter ? 1 : isNear ? 1 : 0.70;
              const opacity = isCenter ? 1 : isNear ? 0.75 : 0.50;

              const imgSize  = isCenter ? centerImgSize : isNear ? nearImgSize : farImgSize;
              const extraY   = isCenter ? centerOffsetY : isNear ? nearOffsetY  : farOffsetY;
              const extraX   = isCenter ? centerOffsetX : isNear ? nearOffsetX * Math.sign(offset) : farOffsetX * Math.sign(offset);

              return (
                <motion.div
                  key={v}
                  initial={false}
                  animate={{ x: `calc(${offset * carouselGap}vw + ${extraX}px)`, y: extraY, scale, opacity }}
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
                    width: imgSize,
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
                      width:  imgSize,
                      height: imgSize,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />

                  {/* Side card text */}
                  {!isCenter && abs === 1 && (
                    <div style={{
                      textAlign: "center",
                      marginTop: scOffsetY,
                      width: scWidth,
                      transform: `translateX(${scOffsetX}px)`,
                      flexShrink: 0,
                    }}>
                      <div style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 600,
                        fontSize: scNameFs,
                        textTransform: "uppercase", color: C.tinta,
                        letterSpacing: "0.04em",
                      }}>
                        {p.nombre.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 400,
                        fontSize: scDescFs, letterSpacing: "0.08em",
                        textTransform: "uppercase", color: C.tinta,
                        opacity: 0.5, marginTop: 5, lineHeight: 1.5,
                      }}>
                        {p.descripcion.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: scPriceFs, color: C.tinta, marginTop: 6,
                        letterSpacing: "0.05em",
                      }}>
                        {fmt(p.precio)} COP
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* ── Nav arrows ───────────────────────────────── */}
          {total > 1 && (
            <>
              <button onClick={goPrev} aria-label="Anterior" style={{
                position: "absolute",
                left:  `calc(50% - ${arrowOffsetX}vw)`,
                top:   `calc(50% + ${arrowOffsetY}px)`,
                transform: "translate(-50%, -50%)",
                width: arrowSize, height: arrowSize,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer", zIndex: 30,
              }}>
                <img src="/images/arrow-circle.png" alt="Anterior"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
              </button>
              <button onClick={goNext} aria-label="Siguiente" style={{
                position: "absolute",
                left:  `calc(50% + ${arrowOffsetX}vw)`,
                top:   `calc(50% + ${arrowOffsetY}px)`,
                transform: "translate(-50%, -50%)",
                width: arrowSize, height: arrowSize,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer", zIndex: 30,
              }}>
                <img src="/images/arrow-circle.png" alt="Siguiente"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", transform: "scaleX(-1)" }} />
              </button>
            </>
          )}
        </div>

        {/* ── Center product info ───────────────────────── */}
        <div style={{ flexShrink: 0, padding: "0 clamp(16px, 4vw, 60px)", marginTop: `${cardMarginTop}px` }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activo.id}-${activeRealIdx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4, transform: `translateX(${nameOffsetX}px)` }}>
                <span style={{ color: C.tinta, fontSize: starsFontSize, transform: `translateX(${starsOffsetX}px)`, display: "inline-block" }}>✦</span>
                <h3 style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: nameFontSize,
                  textTransform: "uppercase", letterSpacing: "0.01em",
                  lineHeight: 1, color: C.tinta, margin: 0,
                }}>
                  {activo.nombre}
                </h3>
                <span style={{ color: C.tinta, fontSize: starsFontSize, transform: `translateX(${-starsOffsetX}px)`, display: "inline-block" }}>✦</span>
              </div>
              <p style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.68rem", letterSpacing: "0.12em",
                textTransform: "uppercase", color: C.tinta, opacity: 0.58,
                margin: "0 0 10px",
              }}>
                {activo.descripcion.toUpperCase()}
              </p>
              <div style={{ display: "flex", alignItems: "stretch", border: `1px solid ${C.tinta}`, maxWidth: cardWidth, margin: "0 auto", width: "100%", transform: `translateX(${cardOffsetX}px)` }}>
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
