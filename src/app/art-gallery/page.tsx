"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import type { SliderProp, PageConfig } from "@/types/design";

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
  display: { fontFamily: "Anton, sans-serif" }           as const,
  sans:    { fontFamily: "var(--font-inter)" }            as const,
  mono:    { fontFamily: "var(--font-jetbrains-mono)" }   as const,
};
const EASE = [0.22, 1, 0.36, 1] as const;

const EXHIBITS = [
  {
    id: "001", name: "LA FIJA",    subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    gallery: ["/images/gallery-001-macro.png", "/images/gallery-001-crew.png", "/images/gallery-001-side.png"],
    ingredients: ["POLLO DESMECHADO.", "HOGAO.", "QUESO COSTEÑO.", "FUSE SAUCE."],
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
    ingredients: ["CARNE DESMECHADA.", "HOGAO.", "QUESO COSTEÑO.", "FUSE SAUCE."],
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
    ingredients: ["CHORIZO SANTANDEREANO.", "HOGAO.", "QUESO COSTEÑO.", "FUSE SAUCE."],
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
    ingredients: ["CARNE MOLIDA SAZONADA.", "HOGAO.", "QUESO COSTEÑO.", "FUSE SAUCE."],
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
  const [idx, setIdx]         = useState(0);
  const [activated, setActivated] = useState<Set<number>>(new Set([0]));
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [msgConfig, setMsgConfig] = useState<PageConfig | null>(null);
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const lenisRef        = useRef<Lenis | null>(null);
  const iframeRef       = useRef<HTMLIFrameElement>(null);
  const ex              = EXHIBITS[idx];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#000000";
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.documentElement.style.backgroundColor = prev;
      document.body.style.backgroundColor = "";
    };
  }, []);

  const { config, editMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("art-gallery");
  const mobile = useDesignConfig("art-gallery-mobile");
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
    if (isMobile) return;
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
      setActivated(prev => {
        if (prev.has(newIdx)) return prev;
        const next = new Set(prev);
        next.add(newIdx);
        return next;
      });
    });

    let raf: number;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, [isMobile]);

  const goTo = (i: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !lenisRef.current) return;
    lenisRef.current.scrollTo(i * wrapper.clientWidth, { duration: 1.2 });
  };

  // receive config from parent editor (when inside iframe)
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === "SPRINGS_CONFIG") setMsgConfig(e.data.config as PageConfig);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // push config to iframe on every slider change
  useEffect(() => {
    if (!editMode) return;
    const send = () =>
      iframeRef.current?.contentWindow?.postMessage(
        { type: "SPRINGS_CONFIG", config: mobile.config }, "*"
      );
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (iframe.contentDocument?.readyState === "complete") { send(); }
    else { iframe.addEventListener("load", send, { once: true }); }
  }, [mobile.config, editMode]);

  async function handleMobileSave() {
    await mobile.save();
    iframeRef.current?.contentWindow?.location.reload();
  }

  // mobile config values (active = live preview override or saved config)
  const mz = (msgConfig ?? mobile.config).zones as Record<string, { elements: Record<string, { props: Record<string, unknown> }> }>;
  const m = {
    imageWidth:       sv(mz, "hero", "productImage", "width",        75),
    imageHeight:      sv(mz, "hero", "productImage", "height",       100),
    imageOffsetY:     sv(mz, "hero", "productImage", "offsetY",      0),
    imageOffsetX:     sv(mz, "hero", "productImage", "offsetX",      0),
    imageObjectY:     sv(mz, "hero", "productImage", "objectY",      15),
    overlayTop:       sv(mz, "hero", "overlayText",  "top",          16),
    overlayLeft:      sv(mz, "hero", "overlayText",  "left",         34),
    overlayOffsetY:   sv(mz, "hero", "overlayText",  "offsetY",      0),
    overlayOffsetX:   sv(mz, "hero", "overlayText",  "offsetX",      0),
    galleryLabelFs:   sv(mz, "hero", "galleryLabel", "fontSize",     0.44),
    galleryLabelOffY: sv(mz, "hero", "galleryLabel", "offsetY",      0),
    galleryLabelOffX: sv(mz, "hero", "galleryLabel", "offsetX",      0),
    productNameFs:    sv(mz, "hero", "productName",  "fontSize",     13),
    productNameOffY:  sv(mz, "hero", "productName",  "offsetY",      0),
    productNameOffX:  sv(mz, "hero", "productName",  "offsetX",      0),
    sidebarW:         sv(mz, "hero", "sidebar",      "width",        36),
    sidebarFs:        sv(mz, "hero", "sidebar",      "fontSize",     0.37),
    sidebarOffY:      sv(mz, "hero", "sidebar",      "offsetY",      0),
    sidebarOffX:      sv(mz, "hero", "sidebar",      "offsetX",      0),
    globeSize:        sv(mz, "hero", "globe",        "size",         64),
    globeOffY:        sv(mz, "hero", "globe",        "offsetY",      0),
    globeOffX:        sv(mz, "hero", "globe",        "offsetX",      0),
    globeTextOffset:  sv(mz, "hero", "globe",        "textOffset",   7),
    vignetteH:        sv(mz, "hero", "vignette",     "height",       55),
    vignetteOp:       sv(mz, "hero", "vignette",     "opacity",      90),
    detailMarginTop:  sv(mz, "detail", "layout",     "marginTop",    -52),
    detailPadTop:     sv(mz, "detail", "layout",     "paddingTop",   24),
    detailPadH:       sv(mz, "detail", "layout",     "paddingH",     16),
    leftColW:         sv(mz, "detail", "layout",     "leftColWidth", 44),
    pullQuoteFs:      sv(mz, "detail", "pullQuote",  "fontSize",     0.78),
    pullQuoteOffY:    sv(mz, "detail", "pullQuote",  "offsetY",      0),
    pullQuoteOffX:    sv(mz, "detail", "pullQuote",  "offsetX",      0),
    ingFs:            sv(mz, "detail", "ingredients","fontSize",       2.9),
    ingLS:            sv(mz, "detail", "ingredients","letterSpacing",  0.1),
    ingOffY:          sv(mz, "detail", "ingredients","offsetY",        0),
    ingOffX:          sv(mz, "detail", "ingredients","offsetX",        0),
    descFs:           sv(mz, "detail", "description","fontSize",       2.4),
    descLS:           sv(mz, "detail", "description","letterSpacing",  0.04),
    descOffY:         sv(mz, "detail", "description","offsetY",        0),
    descOffX:         sv(mz, "detail", "description","offsetX",        0),
    taglineFs:        sv(mz, "detail", "tagline",    "fontSize",       2.7),
    taglineLS:        sv(mz, "detail", "tagline",    "letterSpacing",  0.1),
    taglineOffY:      sv(mz, "detail", "tagline",    "offsetY",        0),
    taglineOffX:      sv(mz, "detail", "tagline",    "offsetX",        0),
    galleryH:         sv(mz, "detail", "gallery",     "height",       100),
    galleryGap:       sv(mz, "detail", "gallery",     "gap",          3),
    galleryOffY:      sv(mz, "detail", "gallery",     "offsetY",      0),
    galleryOffX:      sv(mz, "detail", "gallery",     "offsetX",      0),
    metaLabelFs:      sv(mz, "detail", "metadata",    "labelFs",      0.42),
    metaValueFs:      sv(mz, "detail", "metadata",    "valueFs",      0.48),
    metaScale:        sv(mz, "detail", "metadata",    "scale",        100),
    metaOffY:         sv(mz, "detail", "metadata",    "offsetY",      0),
    metaOffX:         sv(mz, "detail", "metadata",    "offsetX",      0),
    barcodeH:            sv(mz, "detail", "barcode",     "height",       20),
    barcodeOffY:         sv(mz, "detail", "barcode",     "offsetY",      0),
    barcodeOffX:         sv(mz, "detail", "barcode",     "offsetX",      0),
    barcodeLabelFs:      sv(mz, "detail", "barcodeText", "fontSize",     0.28),
    barcodeLabelOffY:    sv(mz, "detail", "barcodeText", "offsetY",      0),
    barcodeLabelOffX:    sv(mz, "detail", "barcodeText", "offsetX",      0),
    quoteFs:          sv(mz, "detail", "quote",       "fontSize",     1.0),
    quoteMarkFs:      sv(mz, "detail", "quote",       "markFs",       1.5),
    quoteMarkOffY:    sv(mz, "detail", "quote",       "markOffY",     0),
    quoteOffY:        sv(mz, "detail", "quote",       "offsetY",      0),
    quoteOffX:        sv(mz, "detail", "quote",       "offsetX",      0),
    springsCrewFs:    sv(mz, "detail", "springsCrew", "fontSize",     1.1),
    springsCrewOffY:  sv(mz, "detail", "springsCrew", "offsetY",      0),
    springsCrewOffX:  sv(mz, "detail", "springsCrew", "offsetX",      0),
  };

  // SSR-safe: avoid flash
  if (isMobile === null) return null;

  // ── MOBILE EDITOR ──────────────────────────────────────────────────
  if (editMode) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0d0d0d", display: "flex", overflow: "hidden" }}>
        {/* Left: device frame + iframe */}
        <div style={{ flexShrink: 0, overflowY: "auto", paddingBottom: 24 }}>
          <div style={{
            width: 390, height: 20, background: "#1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.42rem",
            letterSpacing: "0.2em", color: "rgba(242,232,213,0.3)",
            position: "sticky", top: 0, zIndex: 10,
          }}>
            390 × 844 — MOBILE PREVIEW
          </div>
          <iframe
            ref={iframeRef}
            src="/art-gallery"
            style={{
              display: "block",
              width: 390, height: 844,
              border: "none",
              outline: "1px solid rgba(242,232,213,0.12)",
            }}
            title="Mobile preview"
          />
        </div>
        <DevPanel
          config={mobile.config}
          saved={mobile.saved}
          onUpdate={mobile.updateProp}
          onSave={handleMobileSave}
          onExport={mobile.exportValues}
          onReset={mobile.reset}
          startLeft={406}
        />
      </div>
    );
  }

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <main style={{ background: BG, color: C.cream, overflowX: "hidden", overflowY: "auto", height: "100dvh" }}>

        {/* Fixed top nav */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
          height: 52,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px",
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(242,232,213,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/" style={{ ...F.display, fontSize: "1.15rem", letterSpacing: "0.04em", color: C.cream, textDecoration: "none" }}>
              SPRINGS
            </Link>
            <span style={{ ...F.mono, fontSize: "0.45rem", color: "rgba(242,232,213,0.3)" }}>+</span>
            <div style={{ ...F.mono, fontSize: "0.34rem", letterSpacing: "0.12em", color: "rgba(242,232,213,0.38)", lineHeight: 1.5 }}>
              BRITISH SOUL<br />COLOMBIAN HEART.
            </div>
          </div>
          <Link href="/menu" style={{
            ...F.display, fontSize: "0.58rem", letterSpacing: "0.1em",
            background: "transparent", color: C.cream,
            border: `1px solid ${C.cream}`,
            padding: "8px 13px",
            textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
          }}>
            PEDIR AHORA
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="11" x2="11" y2="1"/>
              <polyline points="4,1 11,1 11,8"/>
            </svg>
          </Link>
        </header>

        {/* Fixed bottom nav */}
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300,
          height: 56,
          display: "flex", alignItems: "stretch",
          background: "rgba(0,0,0,0.96)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(242,232,213,0.08)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}>
          {([
            {
              label: "CARTA", href: "/menu",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="3" width="14" height="18" rx="1"/>
                  <line x1="9" y1="8" x2="15" y2="8"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="12" y2="16"/>
                </svg>
              ),
            },
            {
              label: "ART GALLERY", href: "/art-gallery", active: true,
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="1"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              ),
            },
            {
              label: "NOSOTROS", href: "#",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
            },
            {
              label: "EL CLUB", href: "#",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              ),
            },
            {
              label: "FAQS", href: "#",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ),
            },
          ] as { label: string; href: string; active?: boolean; icon: React.ReactNode }[]).map(item => (
            <Link key={item.label} href={item.href} style={{
              flex: 1,
              display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
              gap: 6,
              textDecoration: "none",
              color: item.active ? C.burgundy : C.cream,
              position: "relative",
            }}>
              {item.active && (
                <span style={{
                  position: "absolute", bottom: 0, left: "10%", right: "10%",
                  height: 2, background: C.burgundy,
                }} />
              )}
              {item.icon}
              <span style={{
                ...F.mono, fontSize: "0.42rem", letterSpacing: "0.08em",
                color: item.active ? C.burgundy : C.cream,
              }}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Scrollable content */}
        <div style={{ paddingTop: 52, paddingBottom: 60 }}>
          {EXHIBITS.map((exhibit) => (
            <div key={exhibit.id}>

              {/* ── HERO ── */}
              <section style={{
                height: "calc(100dvh - 52px)",
                position: "relative",
                background: BG,
                overflow: "hidden",
              }}>

                {/* Product image — right side, contains full dramatic shot */}
                <img
                  src={exhibit.img}
                  alt={exhibit.name}
                  style={{
                    position: "absolute", right: 0, top: 0,
                    width: `${m.imageWidth}%`, height: `${m.imageHeight}%`,
                    objectFit: "contain", objectPosition: `center ${m.imageObjectY}%`,
                    transform: `translate(${m.imageOffsetX}px, ${m.imageOffsetY}px)`,
                    zIndex: 1,
                  }}
                />

                {/* Vignette — linear, bottom edge blends image into dark background */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: `${m.vignetteH}%`,
                  zIndex: 2, pointerEvents: "none",
                  background: `linear-gradient(to top, rgba(0,0,0,${(m.vignetteOp / 100).toFixed(2)}) 0%, transparent 100%)`,
                }} />

                {/* Gallery label + product name + subtitle — absolute, overlaid on image */}
                <div style={{
                  position: "absolute", top: `${m.overlayTop}%`, left: `${m.overlayLeft}%`, right: "4%",
                  zIndex: 10, textAlign: "center",
                  transform: `translate(${m.overlayOffsetX}px, ${m.overlayOffsetY}px)`,
                }}>
                  <div style={{
                    ...F.mono, fontSize: `${m.galleryLabelFs}rem`, letterSpacing: "0.18em", color: C.burgundy, marginBottom: 8,
                    transform: `translate(${m.galleryLabelOffX}px, ${m.galleryLabelOffY}px)`,
                  }}>
                    SPRINGS ART GALLERY +
                  </div>
                  <h2 style={{
                    ...F.display, fontSize: `clamp(2rem, ${m.productNameFs}vw, 6rem)`, color: C.cream,
                    lineHeight: 0.92, letterSpacing: "-0.01em",
                    margin: "0 0 10px",
                    transform: `translate(${m.productNameOffX}px, ${m.productNameOffY}px)`,
                  }}>
                    {exhibit.name}
                  </h2>
                  <div style={{ ...F.mono, fontSize: `${m.galleryLabelFs}rem`, letterSpacing: "0.16em", color: C.dim }}>
                    {exhibit.subtitle} <span style={{ color: C.burgundy }}>+</span>
                  </div>
                </div>

                {/* LEFT SIDEBAR — absolute, full height */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${m.sidebarW}%`, padding: "14px 0 0 16px",
                  zIndex: 10, display: "flex", flexDirection: "column",
                  transform: `translate(${m.sidebarOffX}px, ${m.sidebarOffY}px)`,
                }}>

                  {/* Globe */}
                  <div style={{ width: m.globeSize, height: m.globeSize, marginBottom: 14, flexShrink: 0, transform: `translate(${m.globeOffX}px, ${m.globeOffY}px)` }}>
                    <svg viewBox="0 0 110 110" width="100%" height="100%">
                      <circle cx="55" cy="55" r={33} fill="none" stroke={C.dim} strokeWidth="1.2" opacity={0.85}/>
                      <motion.g
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        {/* meridians */}
                        <ellipse cx="55" cy="55" rx={8}  ry={33} fill="none" stroke={C.dim} strokeWidth="0.85" opacity={0.55}/>
                        <ellipse cx="55" cy="55" rx={18} ry={33} fill="none" stroke={C.dim} strokeWidth="0.85" opacity={0.5}/>
                        <ellipse cx="55" cy="55" rx={27} ry={33} fill="none" stroke={C.dim} strokeWidth="0.85" opacity={0.45}/>
                        {/* parallels */}
                        <ellipse cx="55" cy="55" rx={33} ry={9}  fill="none" stroke={C.dim} strokeWidth="0.85" opacity={0.55}/>
                        <ellipse cx="55" cy="55" rx={33} ry={19} fill="none" stroke={C.dim} strokeWidth="0.85" opacity={0.5}/>
                        <ellipse cx="55" cy="55" rx={33} ry={28} fill="none" stroke={C.dim} strokeWidth="0.85" opacity={0.45}/>
                        {/* equator cross */}
                        <line x1={22} y1="55" x2={88} y2="55" stroke={C.dim} strokeWidth="0.8" opacity={0.45}/>
                        <line x1="55" y1={22} x2="55" y2={88} stroke={C.dim} strokeWidth="0.8" opacity={0.45}/>
                      </motion.g>
                      {/* full-circle text path (same formula as home desktop) */}
                      <path id={`mob-c-${exhibit.id}`} fill="none" d="M34,91.4 a42,42 0 0,1 42,-72.7 a42,42 0 0,1 -42,72.7"/>
                      <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="1.0" fill={C.dim} fillOpacity={0.8}>
                        <textPath href={`#mob-c-${exhibit.id}`} startOffset={`${m.globeTextOffset}%`}>FOR THE MOST CHIMBA PEOPLE ✦ </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Exhibit metadata */}
                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, letterSpacing: "0.2em", color: C.dim, marginBottom: 2 }}>EXHIBIT</div>
                  <div style={{ ...F.display, fontSize: "2.6rem", color: C.burgundy, lineHeight: 1, marginBottom: 10 }}>{exhibit.id}</div>

                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, letterSpacing: "0.12em", color: C.cream, marginBottom: 1 }}>JACKET SERIES</div>
                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, letterSpacing: "0.12em", color: C.dim, marginBottom: 10 }}>{exhibit.year}</div>

                  <div style={{ width: 28, height: "1px", background: "rgba(242,232,213,0.28)", marginBottom: 10 }} />

                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, letterSpacing: "0.1em", color: C.cream, marginBottom: 1 }}>BUCARAMANGA</div>
                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, letterSpacing: "0.1em", color: C.dim, marginBottom: 10 }}>COLOMBIA</div>

                  <div style={{ width: 28, height: "1px", background: "rgba(242,232,213,0.28)", marginBottom: 10 }} />

                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, color: C.cream, marginBottom: 1 }}>7.1254° N</div>
                  <div style={{ ...F.mono, fontSize: `${m.sidebarFs}rem`, color: C.cream, marginBottom: 14 }}>73.1198° W</div>

                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.burgundy }} />
                </div>
              </section>

              {/* ── DETAIL ── */}
              <section style={{ background: "transparent", padding: `${m.detailPadTop}px 0 0 0`, marginTop: `${m.detailMarginTop}dvh`, position: "relative", zIndex: 20 }}>

                {/* Ingredients / description / tagline — full width */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ ...F.mono, fontSize: `${m.ingFs}vw`, letterSpacing: `${m.ingLS}em`, color: C.cream, lineHeight: 1.4, whiteSpace: "nowrap", marginBottom: 10, transform: `translate(${m.ingOffX}px, ${m.ingOffY}px)` }}>
                    {exhibit.ingredients.join(" · ")}
                  </div>
                  <p style={{ ...F.mono, fontSize: `${m.descFs}vw`, letterSpacing: `${m.descLS}em`, color: C.dim, lineHeight: 1.62, margin: "0 0 8px", whiteSpace: "nowrap", transform: `translate(${m.descOffX}px, ${m.descOffY}px)` }}>
                    {exhibit.description.replace(/\n/g, " ")}
                  </p>
                  <div style={{ ...F.mono, fontSize: `${m.taglineFs}vw`, letterSpacing: `${m.taglineLS}em`, color: C.mostaza, whiteSpace: "nowrap", transform: `translate(${m.taglineOffX}px, ${m.taglineOffY}px)` }}>
                    {exhibit.tagline}
                  </div>
                </div>

                {/* Gallery: 3 photos */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  gap: m.galleryGap, marginBottom: 20,
                  transform: `translate(${m.galleryOffX}px, ${m.galleryOffY}px)`,
                }}>
                  {exhibit.gallery.map((src, gi) => (
                    <div key={gi} style={{ height: m.galleryH, overflow: "hidden" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  ))}
                </div>

                {/* Metadata table + globe */}
                <div style={{
                  marginBottom: 20,
                  transform: `translate(${m.metaOffX}px, ${m.metaOffY}px)`,
                }}>
                <div style={{
                  display: "flex",
                  border: "1px solid rgba(242,232,213,0.1)",
                  transform: `scale(${m.metaScale / 100})`,
                  transformOrigin: "top left",
                }}>
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {([
                      { label: "ORIGIN",      val: exhibit.origin   },
                      { label: "CREATED",     val: exhibit.created  },
                      { label: "CATEGORY",    val: exhibit.category },
                      { label: "TEMPERATURE", val: exhibit.temp     },
                    ] as { label: string; val: string }[]).map((item, mi) => (
                      <div key={item.label} style={{
                        padding: "8px 10px",
                        borderRight: mi % 2 === 0 ? "1px solid rgba(242,232,213,0.1)" : "none",
                        borderBottom: mi < 2      ? "1px solid rgba(242,232,213,0.1)" : "none",
                      }}>
                        <div style={{ ...F.mono, fontSize: `${m.metaLabelFs}rem`, letterSpacing: "0.14em", color: "rgba(242,232,213,0.42)", marginBottom: 2 }}>{item.label}</div>
                        <div style={{ ...F.mono, fontSize: `${m.metaValueFs}rem`, letterSpacing: "0.06em", color: C.cream }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Globe wireframe */}
                  <div style={{ width: 56, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(242,232,213,0.1)", flexShrink: 0 }}>
                    <svg viewBox="0 0 110 110" width="40" height="40">
                      <circle cx="55" cy="55" r={33} fill="none" stroke={C.dim} strokeWidth="1.2" opacity={0.7}/>
                      <ellipse cx="55" cy="55" rx={10} ry={33} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.5}/>
                      <ellipse cx="55" cy="55" rx={22} ry={33} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.45}/>
                      <ellipse cx="55" cy="55" rx={33} ry={10} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.5}/>
                      <ellipse cx="55" cy="55" rx={33} ry={22} fill="none" stroke={C.dim} strokeWidth="0.9" opacity={0.45}/>
                      <line x1={22} y1="55" x2={88} y2="55" stroke={C.dim} strokeWidth="0.8" opacity={0.4}/>
                      <line x1="55" y1={22} x2="55" y2={88} stroke={C.dim} strokeWidth="0.8" opacity={0.4}/>
                    </svg>
                  </div>
                </div>
                </div>

                {/* Quote + Springs Crew + Barcode */}
                <div style={{
                  display: "flex", alignItems: "flex-start",
                  paddingBottom: 28, marginBottom: 0,
                  borderBottom: "1px solid rgba(242,232,213,0.07)",
                  transform: `translate(${m.quoteOffX}px, ${m.quoteOffY}px)`,
                }}>
                  {/* Quote text */}
                  <div style={{ display: "flex", flex: 1, gap: 6, alignItems: "flex-start" }}>
                    <span style={{ ...F.sans, fontSize: `${m.quoteMarkFs}rem`, color: C.cream, lineHeight: 0.8, flexShrink: 0, transform: `translateY(${m.quoteMarkOffY}px)` }}>"</span>
                    <div>
                      <p style={{ ...F.sans, fontSize: `${m.quoteFs}rem`, fontWeight: 500, color: C.cream, lineHeight: 1.5, margin: "0 0 6px", whiteSpace: "pre-line" }}>
                        {exhibit.quote}
                      </p>
                      <div style={{
                        fontFamily: "var(--font-caveat, cursive)",
                        fontSize: `${m.springsCrewFs}rem`,
                        color: C.burgundy,
                        transform: `translate(${m.springsCrewOffX}px, ${m.springsCrewOffY}px)`,
                      }}>
                        Springs Crew.
                      </div>
                    </div>
                  </div>
                  {/* Barcode image — independent position */}
                  <div style={{ flexShrink: 0, marginLeft: 12, transform: `translate(${m.barcodeOffX}px, ${m.barcodeOffY}px)` }}>
                    <img
                      src="/images/barcode-springs.png" alt=""
                      style={{ height: m.barcodeH, width: "auto", opacity: 0.65, transform: "rotate(90deg)", transformOrigin: "center", display: "block" }}
                    />
                  </div>
                  {/* Barcode text — independent position */}
                  <div style={{ ...F.mono, lineHeight: 1.6, flexShrink: 0, transform: `translate(${m.barcodeLabelOffX}px, ${m.barcodeLabelOffY}px)` }}>
                    <div style={{ fontSize: `${m.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: "rgba(242,232,213,0.8)" }}>+</div>
                    <div style={{ fontSize: `${m.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: C.cream }}>SPRINGS</div>
                    <div style={{ fontSize: `${m.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: C.cream }}>ART GALLERY</div>
                    <div style={{ fontSize: `${m.barcodeLabelFs}rem`, letterSpacing: "0.1em", color: C.dim }}>{exhibit.id}</div>
                  </div>
                </div>

              </section>
            </div>
          ))}
        </div>

      </main>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────
  return (
    <main style={{ background: BG, height: "100vh", overflow: "hidden", color: C.cream }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
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
      <aside
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
        <motion.div
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.12 }}
          style={{ flexShrink: 0, marginBottom: 18 }}
        >
          <div style={{ width: d.globeSize, height: d.globeSize, transform: `translate(${d.globeOffsetX}px, ${d.globeOffsetY}px)` }}>
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
        </motion.div>

        {/* Exhibit label + number — re-anima al navegar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: EASE }}
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

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.28 }}
          style={{ width: 48, height: "1px", background: "rgba(242,232,213,0.35)", marginBottom: 14, transformOrigin: "left" }}
        />

        {/* Jacket series */}
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
          style={{ transform: `translate(${d.jacketSeriesX}px, ${d.jacketSeriesY}px)`, marginBottom: 4 }}
        >
          <div style={{ ...F.mono, fontSize: `${d.jacketSeriesFs}rem`, letterSpacing: "0.14em", color: C.cream }}>JACKET SERIES</div>
          <div style={{ ...F.mono, fontSize: `${d.jacketSeriesFs}rem`, letterSpacing: "0.14em", color: C.dim }}>{ex.year}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.36 }}
          style={{ width: 48, height: "1px", background: "rgba(242,232,213,0.35)", margin: "14px 0", transformOrigin: "left" }}
        />

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
          style={{ transform: `translate(${d.locationX}px, ${d.locationY}px)`, marginBottom: 22 }}
        >
          <div style={{ marginBottom: 8 }}>
            <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, letterSpacing: "0.1em", color: C.cream }}>BUCARAMANGA</div>
            <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, letterSpacing: "0.1em", color: C.dim }}>COLOMBIA</div>
          </div>
          <div style={{ width: 48, height: "1px", background: "rgba(242,232,213,0.35)", marginBottom: 8 }} />
          <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, color: C.cream }}>7.1254° N</div>
          <div style={{ ...F.mono, fontSize: `${d.locationFs}rem`, color: C.cream }}>73.1198° W</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.44 }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: C.burgundy, marginBottom: 16 }}
        />

        {/* Exhibit list */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.48 }}
          style={{ transform: `translate(${d.exhibitListX}px, ${d.exhibitListY}px)`, display: "flex", flexDirection: "column", gap: d.exhibitListGap }}
        >
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.54 }}
          style={{ marginTop: "auto", marginBottom: d.scrollIndicatorBottom, display: "flex", flexDirection: "column", gap: 4 }}
        >
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
        </motion.div>
      </aside>

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
          {EXHIBITS.map((exhibit, i) => {
            const isActivated = activated.has(i);
            return (
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
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", isolation: "isolate" }}>
                {/* Imagen: brightness de 0 → 1 */}
                <motion.img
                  src={exhibit.img}
                  alt={exhibit.name}
                  initial={{ filter: "brightness(0.06) saturate(0.3)" }}
                  animate={{ filter: isActivated ? "brightness(1) saturate(1)" : "brightness(0.06) saturate(0.3)" }}
                  transition={{ duration: 2.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
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

                {/* Capa 1: oscuridad general, top transparente → top aparece primero */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isActivated ? 0 : 1 }}
                  transition={{ duration: 1.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
                    background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.97) 38%, rgba(0,0,0,0.97) 100%)",
                  }}
                />

                {/* Capa 2: zona media — se va más despacio */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isActivated ? 0 : 1 }}
                  transition={{ duration: 2.0, delay: 0.65, ease: [0.3, 0, 0.2, 1] }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                    background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.95) 100%)",
                  }}
                />

                {/* Capa 3: sombra en el fondo — aguanta la oscuridad abajo hasta el final */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isActivated ? 0 : 1 }}
                  transition={{ duration: 2.2, delay: 1.05, ease: [0.2, 0, 0.3, 1] }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
                    background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0) 62%)",
                  }}
                />

                {/* Placa museo — aparece cuando ya hay luz */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActivated ? 1 : 0 }}
                  transition={{ duration: 0.9, delay: 2.75, ease: EASE }}
                  style={{
                    position: "absolute", bottom: d.placaBottom, left: "50%", zIndex: 6,
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
                zIndex: 10,
              }}>

                {/* COLUMNA TEXTO */}
                <div style={{
                  flex: 1,
                  padding: `${d.infoPadT}px ${d.infoPadH}px 24px`,
                  overflowY: "auto",
                  display: "flex", flexDirection: "column",
                  transform: `translateX(${d.infoPadOffsetX}px)`,
                  position: "relative", zIndex: 2,
                }}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
                    style={{ transform: `translate(${d.artGalleryLabelLeft}px, ${d.artGalleryLabelTop}px)`, marginBottom: 6 }}
                  >
                    <div style={{ ...F.mono, fontSize: `${d.artGalleryLabelFs}rem`, letterSpacing: "0.22em", color: "#6B1419" }}>
                      SPRINGS ART GALLERY
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 22 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                    transition={{ duration: 0.65, ease: EASE, delay: 0.26 }}
                    style={{ transform: `translate(${d.tituloLeft}px, ${d.tituloTop}px)`, marginBottom: 10 }}
                  >
                    <h2 style={{ ...F.display, fontSize: `${d.tituloFs}rem`, color: C.cream, lineHeight: 0.95, letterSpacing: "-0.01em", margin: 0 }}>
                      {exhibit.name}
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.33 }}
                    style={{ transform: `translate(${d.subtituloLeft}px, ${d.subtituloTop}px)`, marginBottom: 14 }}
                  >
                    <div style={{ ...F.mono, fontSize: `${d.subtituloFs}rem`, letterSpacing: "0.18em" }}>
                      <span style={{ color: C.cream }}>{exhibit.subtitle} </span>
                      <span style={{ color: "#6B1419" }}>+</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }} animate={isActivated ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.38 }}
                    style={{ height: "1px", background: "rgba(242,232,213,0.25)", marginBottom: 14, transformOrigin: "left" }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.43 }}
                    style={{ transform: `translate(${d.ingredientesLeft}px, ${d.ingredientesTop}px)`, marginBottom: 12 }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: d.ingredientesGap }}>
                      {exhibit.ingredients.map(ing => (
                        <div key={ing} style={{ ...F.mono, fontSize: `${d.ingredientesFs}rem`, letterSpacing: "0.09em", color: C.cream }}>
                          {ing}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
                    style={{ transform: `translate(${d.descripcionLeft}px, ${d.descripcionTop}px)`, marginBottom: 10 }}
                  >
                    <p style={{ ...F.mono, fontSize: `${d.descripcionFs}rem`, letterSpacing: "0.06em", color: C.dim, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                      {exhibit.description}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -12 }} animate={isActivated ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.56 }}
                    style={{ transform: `translate(${d.taglineLeft}px, ${d.taglineTop}px)`, marginBottom: 16 }}
                  >
                    <div style={{ ...F.mono, fontSize: `${d.taglineFs}rem`, letterSpacing: "0.1em", color: C.burgundy }}>
                      {exhibit.tagline}
                    </div>
                  </motion.div>

                  {/* Specs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.62 }}
                    style={{ transform: `translate(${d.specsLeft}px, ${d.specsTop}px)`, marginBottom: 16 }}
                  >
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
                  </motion.div>
                </div>

                {/* COLUMNA FOTOS */}
                <div
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
                    initial={{ opacity: 0, x: 22 }} animate={isActivated ? { opacity: 1, x: 0 } : { opacity: 0, x: 22 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={isActivated ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.14 }}
                    style={{ position: "absolute", bottom: 0, left: 0, pointerEvents: "none" }}
                  >
                    <div style={{ transform: `translate(${d.quoteLeft}px, ${d.quoteTop}px)` }}>
                      <span style={{ ...F.sans, fontSize: "1.2rem", color: C.cream, lineHeight: 0.8, display: "block", marginBottom: 2 }}>"</span>
                      <p style={{ ...F.sans, fontSize: `${d.quoteFs}rem`, fontWeight: 500, color: C.cream, lineHeight: 1.5, margin: 0, whiteSpace: "pre-line" }}>
                        {exhibit.quote}
                      </p>
                    </div>
                  </motion.div>

                  {/* Springs Crew */}
                  <motion.div
                    initial={{ opacity: 0, rotate: d.springsCrewRot - 6 }}
                    animate={isActivated ? { opacity: 1, rotate: d.springsCrewRot } : { opacity: 0, rotate: d.springsCrewRot - 6 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
                    style={{ position: "absolute", bottom: 80, left: 0, pointerEvents: "none" }}
                  >
                    <div style={{
                      transform: `translate(${d.springsCrewLeft}px, ${d.springsCrewTop}px)`,
                      fontFamily: "var(--font-caveat)",
                      fontSize: `${d.springsCrewFs}rem`,
                      color: "#6B1419",
                      whiteSpace: "nowrap",
                    }}>
                      Springs Crew.
                    </div>
                  </motion.div>

                  {/* Barcode */}
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: isActivated ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.22 }}
                    style={{ position: "absolute", bottom: 24, right: 0, transform: `translate(${d.barcodeLeft}px, ${d.barcodeTop}px)`, display: "flex", gap: 6, alignItems: "flex-start" }}
                  >
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
                  </motion.div>
                </div>

              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
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
