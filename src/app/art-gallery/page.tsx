"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import type { SliderProp } from "@/types/design";

const BG = "#000000";
const C = {
  cream:   "rgba(242,232,213,0.88)",
  burgundy:"#6B1419",
  mostaza: "#C5871F",
  dim:     "rgba(242,232,213,0.72)",
  faint:   "rgba(242,232,213,0.1)",
  fainter: "rgba(242,232,213,0.06)",
};
const F = {
  display: { fontFamily: "Anton, sans-serif" }         as const,
  sans:    { fontFamily: "Inter, sans-serif" }          as const,
  mono:    { fontFamily: "JetBrains Mono, monospace" }  as const,
};
const EASE = [0.22, 1, 0.36, 1] as const;

const EXHIBITS = [
  {
    id: "001", name: "LA FIJA",    subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    gallery: ["/images/gallery-001-macro.png", "/images/gallery-001-crew.png", "/images/gallery-001-side.png"],
    ingredients: ["POLLO DESMECHADO.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "UNA COMBINACIÓN TAN SIMPLE COMO PODEROSA,\nTAN DIRECTA COMO INOLVIDABLE.",
    tagline: "THE ORIGINAL. THE REASON.",
    origin: "BUCARAMANGA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "68°C",
    quote: "NO ES SOLO COMIDA.\nES UN PLAN.",
    price: "32,900",
  },
  {
    id: "002", name: "LA PESADA",  subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    gallery: ["/images/gallery-001-macro.png", "/images/gallery-001-crew.png", "/images/gallery-001-side.png"],
    ingredients: ["CARNE DESMECHADA.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "PARA LOS QUE NO SE QUEDAN CON HAMBRE.\nLA VERSIÓN SIN CONCESIONES.",
    tagline: "HEAVY. INTENTIONAL.",
    origin: "BUCARAMANGA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "68°C",
    quote: "NADA SOBRA.\nNADA FALTA.",
    price: "35,900",
  },
  {
    id: "003", name: "LA BRAVA",   subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    gallery: ["/images/gallery-001-macro.png", "/images/gallery-001-crew.png", "/images/gallery-001-side.png"],
    ingredients: ["CHORIZO SANTANDEREANO.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "EL SABOR QUE AQUÍ NUNCA SE NEGOCIA.\nEL CHORIZO QUE MANDA.",
    tagline: "BORN IN SANTANDER.",
    origin: "BUCARAMANGA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "70°C",
    quote: "CARÁCTER SIN\nPEDIR PERMISO.",
    price: "34,900",
  },
  {
    id: "004", name: "LA SIMPLE",  subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    gallery: ["/images/gallery-001-macro.png", "/images/gallery-001-crew.png", "/images/gallery-001-side.png"],
    ingredients: ["CARNE MOLIDA SAZONADA.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "SIN RODEOS, SIN EXCESOS.\nLO ESENCIAL EJECUTADO PERFECTO.",
    tagline: "SIMPLE IS THE STATEMENT.",
    origin: "BUCARAMANGA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "68°C",
    quote: "LO SIMPLE\nES LO HONESTO.",
    price: "28,900",
  },
  {
    id: "005", name: "LA HONESTA", subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    gallery: ["/images/gallery-001-macro.png", "/images/gallery-001-crew.png", "/images/gallery-001-side.png"],
    ingredients: ["QUESO COSTEÑO DOBLE.", "HOGAO DOBLE.", "AGUACATE.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "SIN CARNE, CON TODO.\nLA QUE DEMUESTRA QUE NO NECESITAS MÁS.",
    tagline: "HONEST BY DESIGN.",
    origin: "BUCARAMANGA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "66°C",
    quote: "SIN MENTIRAS.\nSIN CARNE.",
    price: "28,900",
  },
];

function sv(zones: Record<string, { elements: Record<string, { props: Record<string, unknown> }> }>, zone: string, elem: string, prop: string, fallback: number): number {
  return (zones[zone]?.elements[elem]?.props[prop] as SliderProp)?.value ?? fallback;
}

export default function ArtGallery() {
  const [idx, setIdx]   = useState(0);
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const lenisRef        = useRef<Lenis | null>(null);
  const ex              = EXHIBITS[idx];

  const { config, editMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("art-gallery");
  const z = config.zones as Record<string, { elements: Record<string, { props: Record<string, unknown> }> }>;

  const d = {
    // layout
    sidebarW:      sv(z, "layout",            "sidebar",      "width",      168),
    navH:          sv(z, "layout",            "nav",          "height",     52),
    navLogoFs:     sv(z, "layout",            "nav",          "fontSize",   1.3),
    footerH:          sv(z, "layout", "footer",          "height",     46),
    footerPadH:       sv(z, "layout", "footer",          "horizontal", 28),
    footerSocialsFs:  sv(z, "layout", "footerSocials",   "fontSize",   0.41),
    footerSocialsX:   sv(z, "layout", "footerSocials",   "offsetX",    0),
    footerSocialsY:   sv(z, "layout", "footerSocials",   "offsetY",    0),
    footerCopyFs:     sv(z, "layout", "footerCopyright", "fontSize",   0.41),
    footerCopyX:      sv(z, "layout", "footerCopyright", "offsetX",    0),
    footerCopyY:      sv(z, "layout", "footerCopyright", "offsetY",    0),
    footerNavFs:      sv(z, "layout", "footerNav",       "fontSize",   0.41),
    footerNavX:       sv(z, "layout", "footerNav",       "offsetX",    0),
    footerNavY:       sv(z, "layout", "footerNav",       "offsetY",    0),
    infoPanelW:    sv(z, "layout",            "infoPanel",    "width",      380),
    // sidebar
    globeSize:     sv(z, "sidebar_contenido", "globe",        "size",        144),
    globeRadius:   sv(z, "sidebar_contenido", "globe",        "globeRadius", 33),
    textRadius:    sv(z, "sidebar_contenido", "globe",        "textRadius",  46),
    globeFontSize: sv(z, "sidebar_contenido", "globe",        "fontSize",    8),
    globeTextOff:  sv(z, "sidebar_contenido", "globe",        "textOffset",  16),
    globeOffsetX:  sv(z, "sidebar_contenido", "globe",        "left",        0),
    globeOffsetY:  sv(z, "sidebar_contenido", "globe",        "top",         0),
    sidebarPadT:   sv(z, "sidebar_contenido", "paddingSidebar","top",        32),
    sidebarPadH:   sv(z, "sidebar_contenido", "paddingSidebar","horizontal", 18),
    exhibitLabelFs:sv(z, "sidebar_contenido", "exhibitLabel", "fontSize",   0.44),
    exhibitLabelX: sv(z, "sidebar_contenido", "exhibitLabel", "left",       0),
    exhibitLabelY: sv(z, "sidebar_contenido", "exhibitLabel", "top",        0),
    exhibitNumFs:  sv(z, "sidebar_contenido", "exhibitNum",   "fontSize",   3.8),
    exhibitNumX:   sv(z, "sidebar_contenido", "exhibitNum",   "left",       0),
    exhibitNumY:   sv(z, "sidebar_contenido", "exhibitNum",   "top",        0),
    jacketSeriesFs:sv(z, "sidebar_contenido", "jacketSeries", "fontSize",   0.44),
    jacketSeriesX: sv(z, "sidebar_contenido", "jacketSeries", "left",       0),
    jacketSeriesY: sv(z, "sidebar_contenido", "jacketSeries", "top",        0),
    locationFs:    sv(z, "sidebar_contenido", "location",     "fontSize",   0.44),
    locationX:     sv(z, "sidebar_contenido", "location",     "left",       0),
    locationY:     sv(z, "sidebar_contenido", "location",     "top",        0),
    exhibitListFs: sv(z, "sidebar_contenido", "exhibitList",  "fontSize",   0.39),
    exhibitListGap:sv(z, "sidebar_contenido", "exhibitList",  "gap",        8),
    exhibitListX:  sv(z, "sidebar_contenido", "exhibitList",  "left",       0),
    exhibitListY:  sv(z, "sidebar_contenido", "exhibitList",  "top",        0),
    scrollIndicatorBottom: sv(z, "sidebar_contenido", "scrollIndicator", "bottom", 0),
    // galería fotos
    galeriaW:      sv(z, "galeria",           "columna",      "width",      460),
    galeriaTop:    sv(z, "galeria",           "columna",      "top",        79),
    galeriaGap:    sv(z, "galeria",           "columna",      "gap",        6),
    galeriaLeft:   sv(z, "galeria",           "columna",      "left",       8),
    galeriaRight:  sv(z, "galeria",           "columna",      "right",      14),
    galeriaScale:  sv(z, "galeria",           "columna",      "scale",      1),
    galeriaGridX:  sv(z, "galeria",           "grid",         "left",       0),
    galeriaGridY:  sv(z, "galeria",           "grid",         "top",        0),
    fotoGrandeFlex:sv(z, "galeria",           "fotoGrande",   "flex",       3),
    fotosSmallFlex:sv(z, "galeria",           "fotosPequenas","flex",       2),
    springsCrewFs:   sv(z, "galeria",         "springsCrew",  "fontSize",   1.2),
    springsCrewRot:  sv(z, "galeria",         "springsCrew",  "rotation",   -6),
    springsCrewLeft: sv(z, "galeria",         "springsCrew",  "left",       0),
    springsCrewTop:  sv(z, "galeria",         "springsCrew",  "top",        0),
    barcodeSize:     sv(z, "galeria",         "barcode",      "size",       60),
    barcodeLeft:     sv(z, "galeria",         "barcode",      "left",       0),
    barcodeTop:      sv(z, "galeria",         "barcode",      "top",        0),
    barcodeLabelFs:  sv(z, "galeria",         "barcode",      "fontSize",   0.36),
    barcodeLabelLeft:sv(z, "galeria",         "barcode",      "labelLeft",  0),
    barcodeLabelTop: sv(z, "galeria",         "barcode",      "labelTop",   0),
    // foto
    imageH:        sv(z, "foto",              "imagen",       "height",     90),
    imageOffsetY:  sv(z, "foto",              "imagen",       "top",        0),
    imageOffsetX:  sv(z, "foto",              "imagen",       "left",       0),
    vignetteH:     sv(z, "foto",              "viñeta",       "height",     35),
    placaBottom:   sv(z, "foto",              "placa",        "bottom",     52),
    placaLeft:     sv(z, "foto",              "placa",        "left",       0),
    placaScale:    sv(z, "foto",              "placa",        "scale",      1),
    placaFs:       sv(z, "foto",              "placa",        "fontSize",   1),
    placaPadH:     sv(z, "foto",              "placa",        "paddingH",   28),
    placaPadV:     sv(z, "foto",              "placa",        "paddingV",   12),
    // info panel
    artGalleryLabelFs:   sv(z, "infoPanel_contenido","artGalleryLabel","fontSize", 0.44),
    artGalleryLabelLeft: sv(z, "infoPanel_contenido","artGalleryLabel","left",     0),
    artGalleryLabelTop:  sv(z, "infoPanel_contenido","artGalleryLabel","top",      0),
    infoPadT:       sv(z, "infoPanel_contenido","paddingInfo",  "top",        32),
    infoPadH:       sv(z, "infoPanel_contenido","paddingInfo",  "horizontal", 22),
    infoPadOffsetX: sv(z, "infoPanel_contenido","paddingInfo",  "offsetX",    0),
    tituloFs:       sv(z, "infoPanel_contenido","titulo",       "fontSize",   3.8),
    tituloLeft:     sv(z, "infoPanel_contenido","titulo",       "left",       0),
    tituloTop:      sv(z, "infoPanel_contenido","titulo",       "top",        0),
    subtituloFs:    sv(z, "infoPanel_contenido","subtitulo",    "fontSize",   0.48),
    subtituloLeft:  sv(z, "infoPanel_contenido","subtitulo",    "left",       0),
    subtituloTop:   sv(z, "infoPanel_contenido","subtitulo",    "top",        0),
    ingredientesFs: sv(z, "infoPanel_contenido","ingredientes", "fontSize",   0.44),
    ingredientesGap:sv(z, "infoPanel_contenido","ingredientes", "gap",        4),
    ingredientesLeft:sv(z,"infoPanel_contenido","ingredientes", "left",       0),
    ingredientesTop: sv(z,"infoPanel_contenido","ingredientes", "top",        0),
    descripcionFs:  sv(z, "infoPanel_contenido","descripcion",  "fontSize",   0.44),
    descripcionLeft:sv(z, "infoPanel_contenido","descripcion",  "left",       0),
    descripcionTop: sv(z, "infoPanel_contenido","descripcion",  "top",        0),
    taglineFs:      sv(z, "infoPanel_contenido","tagline",      "fontSize",   0.46),
    taglineLeft:    sv(z, "infoPanel_contenido","tagline",      "left",       0),
    taglineTop:     sv(z, "infoPanel_contenido","tagline",      "top",        0),
    quoteFs:        sv(z, "infoPanel_contenido","quote",        "fontSize",   0.58),
    quoteLeft:      sv(z, "infoPanel_contenido","quote",        "left",       0),
    quoteTop:       sv(z, "infoPanel_contenido","quote",        "top",        0),
    specsFs:        sv(z, "infoPanel_contenido","specs",        "fontSize",   0.43),
    specsWidth:     sv(z, "infoPanel_contenido","specs",        "width",      440),
    specsLeft:      sv(z, "infoPanel_contenido","specs",        "left",       0),
    specsTop:       sv(z, "infoPanel_contenido","specs",        "top",        0),
  };

  // Globe text path — recalculated from textRadius
  const gr  = d.globeRadius;
  const tr  = d.textRadius;
  const gsx = +(55 - tr * 0.5).toFixed(1);
  const gsy = +(55 + tr * 0.866).toFixed(1);
  const gdy = +(tr * 1.732).toFixed(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      const panelW = wrapper.clientWidth;
      const newIdx = Math.min(
        Math.max(Math.round(lenis.scroll / panelW), 0),
        EXHIBITS.length - 1
      );
      setIdx(newIdx);
    });

    let raf: number;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  const goTo = (i: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !lenisRef.current) return;
    lenisRef.current.scrollTo(i * wrapper.clientWidth, { duration: 1.2 });
  };

  return (
    <main style={{ background: BG, height: "100vh", overflow: "hidden", color: C.cream }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: d.navH, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", background: "transparent",
        }}
      >
        <Link href="/" style={{ ...F.display, fontSize: `${d.navLogoFs}rem`, letterSpacing: "0.05em", color: C.cream, textDecoration: "none" }}>
          SPRINGS
        </Link>
        <Link href="/menu" style={{
          ...F.display, fontSize: "0.7rem", letterSpacing: "0.12em",
          background: C.burgundy, color: C.cream, padding: "10px 20px",
          textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
        }}>
          PEDIR AHORA <span>↗</span>
        </Link>
      </motion.div>

      {/* ── SIDEBAR FIJO ─────────────────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
        style={{
          position: "fixed",
          left: 0, top: 0, bottom: 0, width: d.sidebarW,
          zIndex: 100,
          borderRight: `1px solid rgba(242,232,213,0.08)`,
          padding: `${d.sidebarPadT}px ${d.sidebarPadH}px 24px`,
          display: "flex", flexDirection: "column",
          background: "rgba(10,8,6,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          overflow: "hidden",
        }}
      >

        {/* Globe con texto circular */}
        <div style={{ width: d.globeSize, height: d.globeSize, flexShrink: 0, marginBottom: 18, transform: `translate(${d.globeOffsetX}px, ${d.globeOffsetY}px)` }}>
          <svg viewBox="0 0 110 110" width="100%" height="100%">
            <circle cx="55" cy="55" r={gr} fill="none" stroke={C.dim} strokeWidth="1.2" opacity={0.8}/>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <ellipse cx="55" cy="55" rx={+(gr*0.36).toFixed(1)} ry={gr} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.6}/>
              <ellipse cx="55" cy="55" rx={+(gr*0.77).toFixed(1)} ry={gr} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.5}/>
              <ellipse cx="55" cy="55" rx={gr} ry={+(gr*0.41).toFixed(1)} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.6}/>
              <ellipse cx="55" cy="55" rx={gr} ry={+(gr*0.77).toFixed(1)} fill="none" stroke={C.dim} strokeWidth="0.8" opacity={0.45}/>
              <line x1={55-gr} y1="55" x2={55+gr} y2="55" stroke={C.dim} strokeWidth="0.8" opacity={0.45}/>
              <line x1="55" y1={55-gr} x2="55" y2={55+gr} stroke={C.dim} strokeWidth="0.8" opacity={0.45}/>
            </motion.g>
            <path id="gallery-chimba-circle" fill="none" d={`M${gsx},${gsy} a${tr},${tr} 0 0,1 ${tr},${-gdy} a${tr},${tr} 0 0,1 ${-tr},${gdy}`}/>
            <text fontFamily="JetBrains Mono, monospace" fontSize={d.globeFontSize} letterSpacing="1.0" fill={C.dim} fillOpacity={0.9}>
              <textPath href="#gallery-chimba-circle" startOffset={`${d.globeTextOff}%`}>FOR THE MOST CHIMBA PEOPLE ✦ </textPath>
            </text>
          </svg>
        </div>

        {/* Exhibit label + number — re-anima al navegar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ex.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div style={{ transform: `translate(${d.exhibitLabelX}px, ${d.exhibitLabelY}px)`, marginBottom: 2 }}>
              <div style={{ ...F.mono, fontSize: `${d.exhibitLabelFs}rem`, letterSpacing: "0.2em", color: C.dim }}>EXHIBIT</div>
            </div>
            <div style={{ transform: `translate(${d.exhibitNumX}px, ${d.exhibitNumY}px)`, marginBottom: 14 }}>
              <div style={{ ...F.display, fontSize: `${d.exhibitNumFs}rem`, color: C.burgundy, lineHeight: 1 }}>
                {ex.id}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ width: 48, height: "1px", background: "rgba(242,232,213,0.35)", marginBottom: 14 }} />

        {/* Jacket series */}
        <div style={{ transform: `translate(${d.jacketSeriesX}px, ${d.jacketSeriesY}px)`, marginBottom: 4 }}>
          <div style={{ ...F.mono, fontSize: `${d.jacketSeriesFs}rem`, letterSpacing: "0.14em", color: C.cream }}>JACKET SERIES</div>
          <div style={{ ...F.mono, fontSize: `${d.jacketSeriesFs}rem`, letterSpacing: "0.14em", color: C.dim }}>{ex.year}</div>
        </div>

        <div style={{ width: 48, height: "1px", background: "rgba(242,232,213,0.35)", margin: "14px 0" }} />

        {/* Location */}
        <div style={{ transform: `translate(${d.locationX}px, ${d.locationY}px)`, marginBottom: 22 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, letterSpacing: "0.1em", color: C.cream }}>BUCARAMANGA</div>
            <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, letterSpacing: "0.1em", color: C.dim }}>COLOMBIA</div>
          </div>
          <div style={{ width: 48, height: "1px", background: "rgba(242,232,213,0.35)", marginBottom: 8 }} />
          <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, color: C.cream }}>7.1254° N</div>
          <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, color: C.cream }}>73.1198° W</div>
        </div>

        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.burgundy, marginBottom: 16 }} />

        {/* Exhibit list */}
        <div style={{ transform: `translate(${d.exhibitListX}px, ${d.exhibitListY}px)`, display: "flex", flexDirection: "column", gap: d.exhibitListGap }}>
          {EXHIBITS.map((e, i) => (
            <button key={e.id} onClick={() => goTo(i)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7, padding: 0,
            }}>
              <span style={{ ...F.mono, fontSize: `${d.exhibitListFs}rem`, color: i === idx ? C.burgundy : C.cream }}>
                {e.id}
              </span>
              <span style={{ ...F.mono, fontSize: `${d.exhibitListFs}rem`, letterSpacing: "0.06em", color: C.cream }}>
                {e.name}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: "auto", marginBottom: d.scrollIndicatorBottom, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {EXHIBITS.map((_, i) => (
              <div key={i} style={{
                height: 2, flex: 1,
                background: i === idx ? C.cream : "rgba(242,232,213,0.15)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <div style={{ ...F.mono, fontSize: "0.38rem", color: C.cream, marginTop: 4 }}>
            {idx + 1} / {EXHIBITS.length}
          </div>
        </div>
      </motion.aside>

      {/* ── LENIS WRAPPER ────────────────────────────────── */}
      <div
        ref={wrapperRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "flex",
            height: "100%",
            width: `calc(100vw * ${EXHIBITS.length})`,
          }}
        >
          {EXHIBITS.map((exhibit) => (
            <div
              key={exhibit.id}
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* ── Foto — ocupa todo el panel ── */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Imagen: brightness de 0 → 1 */}
                <motion.img
                  src={exhibit.img}
                  alt={exhibit.name}
                  initial={{ filter: "brightness(0.06) saturate(0.3)" }}
                  animate={{ filter: "brightness(1) saturate(1)" }}
                  transition={{ duration: 2.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    height: `${d.imageH}%`,
                    width: "auto",
                    objectFit: "contain",
                    transform: `translate(${d.imageOffsetX}px, ${d.imageOffsetY}px)`,
                    display: "block",
                    flexShrink: 0,
                  }}
                />

                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: `${d.vignetteH}%`,
                  background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
                  pointerEvents: "none",
                }} />

                {/* Overlay 1: oscuridad general que se levanta — top primero */}
                <motion.div
                  initial={{ opacity: 0.96 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 2.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
                    background: `linear-gradient(to bottom, ${BG} 0%, rgba(0,0,0,0.75) 60%, ${BG} 100%)`,
                  }}
                />

                {/* Overlay 2: gradiente pesado abajo — el fondo aguanta más oscuro */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 3.2, delay: 0.5, ease: [0.55, 0, 0.3, 1] }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                    background: "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 72%)",
                  }}
                />

                {/* Placa museo — aparece cuando ya hay luz */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.1, delay: 2.4, ease: EASE }}
                  style={{
                    position: "absolute", bottom: d.placaBottom, left: "50%", zIndex: 4,
                    transform: `translateX(calc(-50% + ${d.placaLeft}px)) scale(${d.placaScale})`,
                    border: "1px solid rgba(242,232,213,0.25)",
                    padding: `${d.placaPadV}px ${d.placaPadH}px`, textAlign: "center",
                    background: "rgba(10,8,6,0.7)", backdropFilter: "blur(6px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ ...F.display, fontSize: `${d.placaFs}rem`, letterSpacing: "0.14em", color: C.cream }}>
                    {exhibit.name}
                  </div>
                  <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.2em", color: C.dim, marginTop: 3 }}>
                    {exhibit.subtitle}
                  </div>
                  <div style={{ ...F.mono, fontSize: "0.38rem", letterSpacing: "0.14em", color: C.cream, marginTop: 2 }}>
                    {exhibit.year}
                  </div>
                </motion.div>
              </div>

              {/* ── Info panel — dos columnas: texto | fotos ── */}
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0,
                width: `${d.infoPanelW}px`,
                display: "flex",
              }}>

                {/* COLUMNA TEXTO */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
                  style={{
                    flex: 1,
                    padding: `${d.infoPadT}px ${d.infoPadH}px 24px`,
                    overflowY: "auto",
                    display: "flex", flexDirection: "column",
                    transform: `translateX(${d.infoPadOffsetX}px)`,
                    position: "relative", zIndex: 2,
                  }}
                >
                  <div style={{ transform: `translate(${d.artGalleryLabelLeft}px, ${d.artGalleryLabelTop}px)`, marginBottom: 6 }}>
                    <div style={{ ...F.mono, fontSize: `${d.artGalleryLabelFs}rem`, letterSpacing: "0.22em", color: "#6B1419" }}>
                      SPRINGS ART GALLERY
                    </div>
                  </div>

                  <div style={{ transform: `translate(${d.tituloLeft}px, ${d.tituloTop}px)`, marginBottom: 10 }}>
                    <h2 style={{ ...F.display, fontSize: `${d.tituloFs}rem`, color: C.cream, lineHeight: 0.95, letterSpacing: "-0.01em", margin: 0 }}>
                      {exhibit.name}
                    </h2>
                  </div>

                  <div style={{ transform: `translate(${d.subtituloLeft}px, ${d.subtituloTop}px)`, marginBottom: 14 }}>
                    <div style={{ ...F.mono, fontSize: `${d.subtituloFs}rem`, letterSpacing: "0.18em" }}>
                      <span style={{ color: C.cream }}>{exhibit.subtitle} </span>
                      <span style={{ color: "#6B1419" }}>+</span>
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "rgba(242,232,213,0.25)", marginBottom: 14 }} />

                  <div style={{ transform: `translate(${d.ingredientesLeft}px, ${d.ingredientesTop}px)`, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: d.ingredientesGap }}>
                      {exhibit.ingredients.map(ing => (
                        <div key={ing} style={{ ...F.mono, fontSize: `${d.ingredientesFs}rem`, letterSpacing: "0.09em", color: C.cream }}>
                          {ing}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ transform: `translate(${d.descripcionLeft}px, ${d.descripcionTop}px)`, marginBottom: 10 }}>
                    <p style={{ ...F.mono, fontSize: `${d.descripcionFs}rem`, letterSpacing: "0.06em", color: C.dim, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                      {exhibit.description}
                    </p>
                  </div>

                  <div style={{ transform: `translate(${d.taglineLeft}px, ${d.taglineTop}px)`, marginBottom: 16 }}>
                    <div style={{ ...F.mono, fontSize: `${d.taglineFs}rem`, letterSpacing: "0.1em", color: C.burgundy }}>
                      {exhibit.tagline}
                    </div>
                  </div>

                  {/* Specs */}
                  <div style={{ transform: `translate(${d.specsLeft}px, ${d.specsTop}px)`, marginBottom: 16 }}>
                    <div style={{
                      border: `1px solid ${C.faint}`, padding: "12px 14px",
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 6px",
                      width: d.specsWidth,
                    }}>
                      {[
                        { label: "ORIGIN",      val: exhibit.origin   },
                        { label: "CREATED",     val: exhibit.created  },
                        { label: "CATEGORY",    val: exhibit.category },
                        { label: "TEMPERATURE", val: exhibit.temp     },
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ ...F.mono, fontSize: "0.37rem", letterSpacing: "0.14em", color: C.cream, marginBottom: 2 }}>
                            {item.label}
                          </div>
                          <div style={{ ...F.mono, fontSize: `${d.specsFs}rem`, letterSpacing: "0.07em", color: C.cream }}>
                            {item.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* COLUMNA FOTOS */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
                  style={{
                    width: d.galeriaW,
                    paddingTop: d.galeriaTop,
                    paddingRight: d.galeriaRight,
                    paddingBottom: 24,
                    paddingLeft: d.galeriaLeft,
                    display: "flex", flexDirection: "column",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {/* Grid de 3 fotos */}
                  <motion.div
                    initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                    style={{ flex: 1, minHeight: 0, marginBottom: 14, overflow: "hidden" }}
                  >
                    <div style={{
                      width: "100%", height: "100%",
                      transform: `translate(${d.galeriaGridX}px, ${d.galeriaGridY}px) scale(${d.galeriaScale})`,
                      transformOrigin: "top left",
                      display: "flex", flexDirection: "column", gap: d.galeriaGap,
                    }}>
                      {/* Foto grande arriba */}
                      <div style={{ flex: d.fotoGrandeFlex, overflow: "hidden", minHeight: 0 }}>
                        <img src={exhibit.gallery[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                      {/* Dos fotos abajo */}
                      <div style={{ flex: d.fotosSmallFlex, display: "flex", gap: d.galeriaGap, minHeight: 0 }}>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <img src={exhibit.gallery[1]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <img src={exhibit.gallery[2]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quote */}
                  <div style={{ transform: `translate(${d.quoteLeft}px, ${d.quoteTop}px)` }}>
                    <span style={{ ...F.sans, fontSize: "1.2rem", color: C.cream, lineHeight: 0.8, display: "block", marginBottom: 2 }}>"</span>
                    <p style={{ ...F.sans, fontSize: `${d.quoteFs}rem`, fontWeight: 500, color: C.cream, lineHeight: 1.5, margin: 0, whiteSpace: "pre-line" }}>
                      {exhibit.quote}
                    </p>
                  </div>

                  {/* Springs Crew */}
                  <div style={{
                    position: "absolute",
                    bottom: 80, left: 0,
                    transform: `translate(${d.springsCrewLeft}px, ${d.springsCrewTop}px) rotate(${d.springsCrewRot}deg)`,
                    fontFamily: "var(--font-caveat)",
                    fontSize: `${d.springsCrewFs}rem`,
                    color: "#6B1419",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}>
                    Springs Crew.
                  </div>

                  {/* Barcode */}
                  <div style={{ position: "absolute", bottom: 24, right: 0, transform: `translate(${d.barcodeLeft}px, ${d.barcodeTop}px)`, display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <img
                      src="/images/barcode-springs.png" alt=""
                      style={{
                        height: d.barcodeSize,
                        width: "auto",
                        opacity: 0.75,
                        display: "block",
                        transform: "rotate(90deg)",
                        transformOrigin: "center center",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ ...F.mono, lineHeight: 1.6, transform: `translate(${d.barcodeLabelLeft}px, ${d.barcodeLabelTop}px)` }}>
                      <div style={{ fontSize: `${d.barcodeLabelFs * 1.2}rem`, color: C.cream, marginBottom: 1 }}>❝❞</div>
                      <div style={{ fontSize: `${d.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: C.cream }}>SPRINGS</div>
                      <div style={{ fontSize: `${d.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: C.cream }}>ART GALLERY</div>
                      <div style={{ fontSize: `${d.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: C.dim }}>{exhibit.id}</div>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: d.footerH, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `0 ${d.footerPadH}px`,
        background: "transparent",
        }}>
        <div style={{ display: "flex", gap: 18, transform: `translate(${d.footerSocialsX}px, ${d.footerSocialsY}px)` }}>
          {["INSTAGRAM", "TIKTOK", "SPOTIFY"].map(s => (
            <span key={s} style={{ ...F.mono, fontSize: `${d.footerSocialsFs}rem`, letterSpacing: "0.1em", color: C.cream, cursor: "pointer" }}>{s}</span>
          ))}
        </div>

        <div style={{ ...F.mono, fontSize: `${d.footerCopyFs}rem`, letterSpacing: "0.1em", color: C.cream, transform: `translate(${d.footerCopyX}px, ${d.footerCopyY}px)` }}>
          SPRINGS © 2025 ©
        </div>

        <div style={{ display: "flex", gap: 20, transform: `translate(${d.footerNavX}px, ${d.footerNavY}px)` }}>
          {[
            { label: "CARTA",       href: "/menu"         },
            { label: "ART GALLERY", href: "/art-gallery", active: true },
            { label: "NOSOTROS",    href: "#"              },
            { label: "EL CLUB",     href: "#"              },
            { label: "FAQS",        href: "#"              },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              ...F.mono, fontSize: `${d.footerNavFs}rem`, letterSpacing: "0.1em",
              color: C.cream,
              textDecoration: "none",
              borderBottom: item.active ? `1px solid ${C.burgundy}` : "none",
              paddingBottom: item.active ? 2 : 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>

      </motion.footer>

      {/* ── EDITOR ───────────────────────────────────────── */}
      {editMode && (
        <DevPanel
          config={config}
          saved={saved}
          onUpdate={updateProp}
          onSave={save}
          onExport={exportValues}
          onReset={reset}
        />
      )}

    </main>
  );
}
