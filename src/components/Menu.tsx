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

/* ── Bebida image sub-component ─────────────────────────── */
function BebidaImg({ p, isCenter, sideRatio, getBebidaConfig, imgSrc }: {
  p: Producto; isCenter: boolean; sideRatio: number;
  getBebidaConfig: (id: string) => { size: number; offsetX: number; offsetY: number };
  imgSrc: (p: Producto) => string;
}) {
  const bc = getBebidaConfig(p.id);
  return (
    <img
      src={imgSrc(p)}
      alt={p.nombre}
      style={{
        width:  isCenter ? `${bc.size}vh` : `${bc.size * sideRatio}vh`,
        height: isCenter ? `${bc.size}vh` : `${bc.size * sideRatio}vh`,
        objectFit: "contain", display: "block",
        transform: isCenter
          ? `translate(${bc.offsetX}px, ${bc.offsetY}px)`
          : `translate(${bc.offsetX * sideRatio}px, ${bc.offsetY * sideRatio}px)`,
      }}
    />
  );
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
  // Para Uno images
  const ci = z?.comboImage?.elements;
  const comboPapaN      = sv(ci?.papa?.props?.size,    57);
  const comboBebidaN    = sv(ci?.bebida?.props?.size,  53);
  const comboPapaSize      = `${comboPapaN}vh`;
  const comboPapaOffsetY   = sv(ci?.papa?.props?.offsetY,  -40);
  const comboPapaOffsetX   = sv(ci?.papa?.props?.offsetX,  -24);
  const comboBebidaSize    = `${comboBebidaN}vh`;
  const comboBebidaOffsetY = sv(ci?.bebida?.props?.offsetY, -76);
  const comboBebidaOffsetX = sv(ci?.bebida?.props?.offsetX, -200);
  // Bebida image (per product)
  const bi = z?.bebidaImage?.elements;
  function getBebidaConfig(id: string) {
    const el = bi?.[id as keyof typeof bi];
    return {
      size:    sv(el?.props?.size,    80),
      offsetY: sv(el?.props?.offsetY, 0),
      offsetX: sv(el?.props?.offsetX, 0),
    };
  }
  // Loaded image (per product)
  const li = z?.loadedImage?.elements;
  function getLoadedConfig(id: string) {
    const el = li?.[id as keyof typeof li];
    return {
      size:    sv(el?.props?.size,    42),
      offsetY: sv(el?.props?.offsetY, 0),
      offsetX: sv(el?.props?.offsetX, 0),
    };
  }
  // Layout
  const lo = z?.layout?.elements;
  const contentPaddingTop = sv(lo?.content?.props?.paddingTop, 0);
  // Tabs
  const ti = z?.tabs?.elements;
  const tabFontSize = sv(ti?.btn?.props?.fontSize, 0.5);
  const tabFontUnit = ti?.btn?.props?.fontSize && typeof ti.btn.props.fontSize === "object" && "unit" in ti.btn.props.fontSize ? (ti.btn.props.fontSize as {unit:string}).unit : "rem";
  const tabPaddingX = sv(ti?.btn?.props?.paddingX, 10);
  const tabPaddingY = sv(ti?.btn?.props?.paddingY, 6);
  const tabGap      = sv(ti?.btn?.props?.gap,      4);
  // Scale ratio for side slots
  const centerSizeN = sv(c?.centerImage?.props?.size, 67);
  const nearSizeN   = sv(c?.nearImage?.props?.size, 41);
  const sideRatio   = nearSizeN / centerSizeN;
  // Para Dos images
  const cd = z?.comboDosImage?.elements;
  const dos = {
    papa1:   { size: scv(cd?.papa1?.props?.size,  48)||"48vh",  y: sv(cd?.papa1?.props?.offsetY, -20), x: sv(cd?.papa1?.props?.offsetX, -60)  },
    papa2:   { size: scv(cd?.papa2?.props?.size,  48)||"48vh",  y: sv(cd?.papa2?.props?.offsetY,  20), x: sv(cd?.papa2?.props?.offsetX, -20)  },
    bebida1: { size: scv(cd?.bebida1?.props?.size,40)||"40vh",  y: sv(cd?.bebida1?.props?.offsetY,-60), x: sv(cd?.bebida1?.props?.offsetX,-160) },
    bebida2: { size: scv(cd?.bebida2?.props?.size,40)||"40vh",  y: sv(cd?.bebida2?.props?.offsetY,-40), x: sv(cd?.bebida2?.props?.offsetX,-120) },
  };
  // Side card
  const sc = z?.sideCard?.elements;
  const scWidth        = sv(sc?.container?.props?.width,        260);
  const scOffsetY      = sv(sc?.container?.props?.offsetY,      -36);
  const scOffsetX      = sv(sc?.container?.props?.offsetX,      0);
  const scRightOffsetX = sv(sc?.container?.props?.rightOffsetX, 0);
  const scNameFs     = scv(sc?.name?.props?.fontSize, 2.6) || "2.6vw";
  const scNameWidth  = sv(sc?.name?.props?.width, 260);
  const scNameLS     = sv(sc?.name?.props?.letterSpacing, 0.12);
  const scNameWS     = sv(sc?.name?.props?.wordSpacing, 0);
  const scDescFs    = scv(sc?.desc?.props?.fontSize, 0.58) || "0.58rem";
  const scDescWidth = sv(sc?.desc?.props?.width, 260);
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
  const [vIdx, setVIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

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
  const imgSrc = (p: Producto) => p.imagen_url || "/images/jacket-placeholder.webp";

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
  const offsets = isMobile ? [0] : [-2, -1, 0, 1, 2];

  // Mobile fallbacks: only when no config is provided
  const noConfig = !config;
  const effCenterImgSize  = (noConfig && isMobile) ? "clamp(220px, 42vh, 320px)" : centerImgSize;
  const effCardMarginTop  = (noConfig && isMobile) ? 8   : cardMarginTop;
  const effNameFontSize   = (noConfig && isMobile) ? "clamp(24px, 7vw, 34px)" : nameFontSize;
  const effCardWidth      = (noConfig && isMobile) ? 360 : cardWidth;
  const effArrowSize      = (noConfig && isMobile) ? 52  : arrowSize;
  const effTrackOffsetY   = (noConfig && isMobile) ? 0   : trackOffsetY;

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
      <div style={{ padding: "0 16px 8px", flexShrink: 0 }}>
        {/* Fila 1: label */}
        <div style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.55rem", letterSpacing: "0.2em",
          color: C.tinta, opacity: 0.45,
          marginBottom: 8,
        }}>
          — AQUÍ TIENES NUESTRO MENÚ
        </div>
        {/* Fila 2: pestañas de categoría */}
        <div style={{ display: "flex", gap: tabGap, justifyContent: "flex-start" }}>
          {CATEGORIAS.map(c => {
            const active = c.key === categoria;
            return (
              <button key={c.key} onClick={() => setCategoria(c.key)} style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: config ? `${tabFontSize}${tabFontUnit}` : (isMobile ? "0.5rem" : "clamp(0.45rem, 1.8vw, 0.6rem)"),
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: config ? `${tabPaddingY}px ${tabPaddingX}px` : (isMobile ? "6px 10px" : "6px clamp(8px, 2.5vw, 13px)"),
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
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", zIndex: 2, overflowX: "hidden", justifyContent: "center", paddingTop: contentPaddingTop }}>

        {/* Carousel track */}
        <div style={{ position: "relative", flexShrink: 0, height: effCenterImgSize, overflow: "visible", transform: `translate(${trackOffsetX}px, ${effTrackOffsetY}px)` }}>
          <AnimatePresence>
            {offsets.map(offset => {
              const v   = vIdx + offset;
              const p   = getItem(v);
              const abs = Math.abs(offset);
              const isCenter = abs === 0;
              const isNear   = abs === 1;
              const visible  = abs <= 2;
              const scale   = isCenter ? 1 : isNear ? 1 : 0.70;
              const opacity = isCenter ? 1 : isNear ? 0.75 : 0.50;

              const imgSize  = isCenter ? effCenterImgSize : isNear ? nearImgSize : farImgSize;
              const extraY   = isCenter ? centerOffsetY : isNear ? nearOffsetY  : farOffsetY;
              const extraX   = isCenter ? centerOffsetX : isNear ? nearOffsetX * Math.sign(offset) : farOffsetX * Math.sign(offset);

              return (
                <motion.div
                  key={v}
                  initial={isMobile ? { opacity: 0 } : false}
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
                  {isCenter && p.id === "combo-1" ? (
                    <div style={{ display: "flex", alignItems: "flex-end", width: centerImgSize, height: centerImgSize, overflow: "visible" }}>
                      <img src="/images/combo-papa.webp" alt="Papa"
                        style={{ width: comboPapaSize, height: comboPapaSize, objectFit: "contain", display: "block", flexShrink: 0, transform: `translate(${comboPapaOffsetX}px, ${comboPapaOffsetY}px)` }} />
                      <img src="/images/combo-bebida.webp" alt="Bebida"
                        style={{ width: comboBebidaSize, height: comboBebidaSize, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -8, transform: `translate(${comboBebidaOffsetX}px, ${comboBebidaOffsetY}px)` }} />
                    </div>
                  ) : isCenter && p.id === "combo-2" ? (
                    <div style={{ display: "flex", alignItems: "flex-end", width: centerImgSize, height: centerImgSize, overflow: "visible" }}>
                      <img src="/images/combo-papa.webp" alt="Papa 1"
                        style={{ width: dos.papa1.size, height: dos.papa1.size, objectFit: "contain", display: "block", flexShrink: 0, transform: `translate(${dos.papa1.x}px, ${dos.papa1.y}px)` }} />
                      <img src="/images/combo-papa.webp" alt="Papa 2"
                        style={{ width: dos.papa2.size, height: dos.papa2.size, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -16, transform: `translate(${dos.papa2.x}px, ${dos.papa2.y}px)`, filter: "drop-shadow(-12px 8px 16px rgba(0,0,0,0.45))" }} />
                      <img src="/images/combo-bebida.webp" alt="Bebida 1"
                        style={{ width: dos.bebida1.size, height: dos.bebida1.size, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -8, transform: `translate(${dos.bebida1.x}px, ${dos.bebida1.y}px)` }} />
                      <img src="/images/combo-bebida.webp" alt="Bebida 2"
                        style={{ width: dos.bebida2.size, height: dos.bebida2.size, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -12, transform: `translate(${dos.bebida2.x}px, ${dos.bebida2.y}px)`, filter: "drop-shadow(-10px 6px 14px rgba(0,0,0,0.4))" }} />
                    </div>
                  ) : !isCenter && p.id === "combo-1" ? (
                    <div style={{ display: "flex", alignItems: "flex-end", width: imgSize, height: imgSize, overflow: "visible" }}>
                      <img src="/images/combo-papa.webp" alt="Papa"
                        style={{ width: `${comboPapaN * sideRatio}vh`, height: `${comboPapaN * sideRatio}vh`, objectFit: "contain", display: "block", flexShrink: 0, transform: `translate(${comboPapaOffsetX * sideRatio}px, ${comboPapaOffsetY * sideRatio}px)` }} />
                      <img src="/images/combo-bebida.webp" alt="Bebida"
                        style={{ width: `${comboBebidaN * sideRatio}vh`, height: `${comboBebidaN * sideRatio}vh`, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -8 * sideRatio, transform: `translate(${comboBebidaOffsetX * sideRatio}px, ${comboBebidaOffsetY * sideRatio}px)` }} />
                    </div>
                  ) : !isCenter && p.id === "combo-2" ? (
                    <div style={{ display: "flex", alignItems: "flex-end", width: imgSize, height: imgSize, overflow: "visible" }}>
                      <img src="/images/combo-papa.webp" alt="Papa 1"
                        style={{ width: `${sv(cd?.papa1?.props?.size, 34) * sideRatio}vh`, height: `${sv(cd?.papa1?.props?.size, 34) * sideRatio}vh`, objectFit: "contain", display: "block", flexShrink: 0, transform: `translate(${dos.papa1.x * sideRatio}px, ${dos.papa1.y * sideRatio}px)` }} />
                      <img src="/images/combo-papa.webp" alt="Papa 2"
                        style={{ width: `${sv(cd?.papa2?.props?.size, 39) * sideRatio}vh`, height: `${sv(cd?.papa2?.props?.size, 39) * sideRatio}vh`, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -16 * sideRatio, transform: `translate(${dos.papa2.x * sideRatio}px, ${dos.papa2.y * sideRatio}px)`, filter: "drop-shadow(-12px 8px 16px rgba(0,0,0,0.45))" }} />
                      <img src="/images/combo-bebida.webp" alt="Bebida 1"
                        style={{ width: `${sv(cd?.bebida1?.props?.size, 33) * sideRatio}vh`, height: `${sv(cd?.bebida1?.props?.size, 33) * sideRatio}vh`, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -8 * sideRatio, transform: `translate(${dos.bebida1.x * sideRatio}px, ${dos.bebida1.y * sideRatio}px)` }} />
                      <img src="/images/combo-bebida.webp" alt="Bebida 2"
                        style={{ width: `${sv(cd?.bebida2?.props?.size, 37) * sideRatio}vh`, height: `${sv(cd?.bebida2?.props?.size, 37) * sideRatio}vh`, objectFit: "contain", display: "block", flexShrink: 0, marginLeft: -12 * sideRatio, transform: `translate(${dos.bebida2.x * sideRatio}px, ${dos.bebida2.y * sideRatio}px)`, filter: "drop-shadow(-10px 6px 14px rgba(0,0,0,0.4))" }} />
                    </div>
                  ) : p.categoria === "bebida" ? (
                    <BebidaImg p={p} isCenter={isCenter} sideRatio={sideRatio} getBebidaConfig={getBebidaConfig} imgSrc={imgSrc} />
                  ) : p.categoria === "loaded" && li ? (() => {
                    const lc = getLoadedConfig(p.id);
                    const lSize = isCenter ? `${lc.size}vh` : `${lc.size * sideRatio}vh`;
                    const lX = isCenter ? lc.offsetX : lc.offsetX * sideRatio;
                    const lY = isCenter ? lc.offsetY : lc.offsetY * sideRatio;
                    return (
                      <img src={imgSrc(p)} alt={p.nombre} style={{
                        width: lSize, height: lSize, objectFit: "contain", display: "block",
                        transform: `translate(${lX}px, ${lY}px)`,
                      }} />
                    );
                  })() : (
                    <img
                      src={imgSrc(p)}
                      alt={p.nombre}
                      style={{ width: imgSize, height: imgSize, objectFit: "contain", display: "block" }}
                    />
                  )}

                  {/* Side card text */}
                  {!isCenter && abs === 1 && (
                    <div style={{
                      textAlign: "center",
                      marginTop: scOffsetY,
                      width: scWidth,
                      transform: `translateX(${offset > 0 ? scRightOffsetX : scOffsetX}px)`,
                      flexShrink: 0,
                      opacity: 0.68,
                    }}>
                      <div style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 500,
                        fontSize: scNameFs,
                        textTransform: "uppercase",
                        color: C.tinta,
                        letterSpacing: `${scNameLS}em`,
                        wordSpacing: `${scNameWS}em`,
                        lineHeight: 1.1,
                        opacity: 0.65,
                        width: scNameWidth,
                        margin: "0 auto",
                      }}>
                        {p.nombre.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 400,
                        fontSize: scDescFs, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: C.tinta,
                        opacity: 0.75, marginTop: 6, lineHeight: 1.55,
                        width: scDescWidth, margin: "6px auto 0",
                      }}>
                        {p.descripcion.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontWeight: 500,
                        fontSize: scPriceFs, color: C.tinta, marginTop: 7,
                        letterSpacing: "0.08em",
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
                left:  (noConfig && isMobile) ? "14px" : `calc(50% - ${arrowOffsetX}vw)`,
                top:   `calc(50% + ${arrowOffsetY}px)`,
                transform: (noConfig && isMobile) ? "translateY(-50%)" : "translate(-50%, -50%)",
                width: effArrowSize, height: effArrowSize,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer", zIndex: 30,
              }}>
                <img src="/images/arrow-circle.webp" alt="Anterior"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
              </button>
              <button onClick={goNext} aria-label="Siguiente" style={{
                position: "absolute",
                right: (noConfig && isMobile) ? "14px" : undefined,
                left:  (noConfig && isMobile) ? undefined : `calc(50% + ${arrowOffsetX}vw)`,
                top:   `calc(50% + ${arrowOffsetY}px)`,
                transform: (noConfig && isMobile) ? "translateY(-50%)" : "translate(-50%, -50%)",
                width: effArrowSize, height: effArrowSize,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer", zIndex: 30,
              }}>
                <img src="/images/arrow-circle.webp" alt="Siguiente"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", transform: "scaleX(-1)" }} />
              </button>
            </>
          )}
        </div>

        {/* ── Center product info ───────────────────────── */}
        <div style={{ flexShrink: 0, padding: isMobile ? "0 16px" : "0 clamp(16px, 4vw, 60px)", marginTop: `${effCardMarginTop}px` }}>
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
                  fontSize: effNameFontSize,
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
              <div style={{ display: "flex", alignItems: "stretch", border: `1px solid ${C.tinta}`, maxWidth: effCardWidth, margin: "0 auto", width: "100%", transform: isMobile ? undefined : `translateX(${cardOffsetX}px)` }}>
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
