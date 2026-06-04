"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import SensitiveImage from "@/components/SensitiveImage";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import type { SliderProp, PageConfig } from "@/types/design";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const dim = "rgba(26,10,12,0.5)";
const EASE = [0.22, 1, 0.36, 1] as const;
const F = {
  display: { fontFamily: "Anton, sans-serif" } as React.CSSProperties,
  sans:    { fontFamily: "var(--font-inter)" } as React.CSSProperties,
  mono:    { fontFamily: "var(--font-jetbrains-mono)" } as React.CSSProperties,
};

function sv(zones: PageConfig["zones"], zone: string, element: string, prop: string, fallback: number): number {
  return ((zones[zone]?.elements[element]?.props[prop] as SliderProp)?.value ?? fallback);
}

// translateY/X independiente — no afecta el flujo de los vecinos
function tx(y = 0, x = 0) {
  return `translateY(${y}px) translateX(${x}px)`;
}

function FadeUp({ children, delay = 0, style, root, fromY = 24 }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; root?: React.RefObject<HTMLElement | null>; fromY?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: fromY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15, root }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function GlobeExact({ size, textOffset }: { size: number; textOffset: number }) {
  return (
    <svg viewBox="0 0 110 110" width={size} height={size}>
      <circle cx="55" cy="55" r={33} fill="none" stroke={dim} strokeWidth="1.2" opacity={0.85}/>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <ellipse cx="55" cy="55" rx={8}  ry={33} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.55}/>
        <ellipse cx="55" cy="55" rx={18} ry={33} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.5}/>
        <ellipse cx="55" cy="55" rx={27} ry={33} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.45}/>
        <ellipse cx="55" cy="55" rx={33} ry={9}  fill="none" stroke={dim} strokeWidth="0.85" opacity={0.55}/>
        <ellipse cx="55" cy="55" rx={33} ry={19} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.5}/>
        <ellipse cx="55" cy="55" rx={33} ry={28} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.45}/>
        <line x1={22} y1="55" x2={88} y2="55" stroke={dim} strokeWidth="0.8" opacity={0.45}/>
        <line x1="55" y1={22} x2="55" y2={88} stroke={dim} strokeWidth="0.8" opacity={0.45}/>
      </motion.g>
      <path id="mob-home-chimba" fill="none" d="M34,91.4 a42,42 0 0,1 42,-72.7 a42,42 0 0,1 -42,72.7"/>
      <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="1.0" fill={dim} fillOpacity={0.9}>
        <textPath href="#mob-home-chimba" startOffset={`${textOffset}%`}>FOR THE MOST CHIMBA PEOPLE ✦ </textPath>
      </text>
    </svg>
  );
}

export default function MobileHome() {
  const router = useRouter();
  const { config: savedConfig } = useDesignConfig("home-mobile");

  // recibe config en tiempo real desde el editor (iframe postMessage)
  const [msgConfig, setMsgConfig] = useState<PageConfig | null>(null);
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === "SPRINGS_CONFIG") setMsgConfig(e.data.config as PageConfig);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const z = (msgConfig ?? savedConfig).zones;

  // ── Valores del config ──────────────────────────────────────
  const d = {
    // hero section
    heroPaddingBottom: sv(z, "hero", "section", "paddingBottom", 60),
    // productImage
    imgWidth:        sv(z, "hero", "productImage",      "width",        100),
    imgOffY:         sv(z, "hero", "productImage",      "offsetY",      0),
    // jacket club sticker
    jcSize:          sv(z, "hero", "jacketClubSticker", "size",         36),
    jcTop:           sv(z, "hero", "jacketClubSticker", "top",          12),
    jcRight:         sv(z, "hero", "jacketClubSticker", "right",        4),
    jcRotation:      sv(z, "hero", "jacketClubSticker", "rotation",     8),
    // SPRINGS title
    springsFontSize: sv(z, "hero", "springsTitle",      "fontSize",     27),
    springsOffY:     sv(z, "hero", "springsTitle",      "offsetY",      0),
    springsOffX:     sv(z, "hero", "springsTitle",      "offsetX",      0),
    // globe
    globeSize:       sv(z, "hero", "globe",             "size",         72),
    globeOffY:       sv(z, "hero", "globe",             "offsetY",      0),
    globeOffX:       sv(z, "hero", "globe",             "offsetX",      0),
    globeTextOffset: sv(z, "hero", "globe",             "textOffset",   7),
    // underline
    underlineWidth:  sv(z, "hero", "underline",         "width",        68),
    underlineOffY:   sv(z, "hero", "underline",         "offsetY",      0),
    underlineOffX:   sv(z, "hero", "underline",         "offsetX",      0),
    // sensitive image
    sensMarginH:     sv(z, "hero", "sensitiveImage",    "marginH",      18),
    sensOffY:        sv(z, "hero", "sensitiveImage",    "offsetY",      0),
    sensFontSize:    sv(z, "hero", "sensitiveImage",    "fontSize",     3.5),
    sensOpacity:     sv(z, "hero", "sensitiveImage",    "opacity",      60),
    // art gallery
    agFontSize:      sv(z, "hero", "artGallery",        "fontSize",     18),
    agOffY:          sv(z, "hero", "artGallery",        "offsetY",      0),
    agOffX:          sv(z, "hero", "artGallery",        "offsetX",      0),
    // location label
    locFontSize:     sv(z, "hero", "locationLabel",     "fontSize",     5.5),
    locOffY:         sv(z, "hero", "locationLabel",     "offsetY",      0),
    locOffX:         sv(z, "hero", "locationLabel",     "offsetX",      0),
    // location info (barbosa)
    locInfoFontSize: sv(z, "hero", "locationInfo",      "fontSize",     0.4),
    locInfoOffY:     sv(z, "hero", "locationInfo",      "offsetY",      0),
    locInfoOffX:     sv(z, "hero", "locationInfo",      "offsetX",      0),
    // miercoles sticker
    mdSize:          sv(z, "hero", "miercolesSticker",  "size",         38),
    mdRight:         sv(z, "hero", "miercolesSticker",  "right",        12),
    mdTop:           sv(z, "hero", "miercolesSticker",  "top",          0),
    mdRotation:      sv(z, "hero", "miercolesSticker",  "rotation",     -8),
    // product list
    listFontSize:    sv(z, "hero", "productList",       "fontSize",     0.42),
    listOffY:        sv(z, "hero", "productList",       "offsetY",      0),
    // packaging
    bagWidth:        sv(z, "packaging", "bag",       "width",        70),
    bagOffY:         sv(z, "packaging", "bag",       "offsetY",      0),
    bagOffX:         sv(z, "packaging", "bag",       "offsetX",      0),
    bagMbottom:      sv(z, "packaging", "bag",       "marginBottom", -40),
    boxWidth:        sv(z, "packaging", "box",       "width",        55),
    boxRotation:     sv(z, "packaging", "box",       "rotation",     4),
    boxOffY:         sv(z, "packaging", "box",       "offsetY",      0),
    boxOffX:         sv(z, "packaging", "box",       "offsetX",      0),
    boxMbottom:      sv(z, "packaging", "box",       "marginBottom", -30),
    cupWidth:        sv(z, "packaging", "cup",       "width",        40),
    cupRotation:     sv(z, "packaging", "cup",       "rotation",     -3),
    cupOffY:         sv(z, "packaging", "cup",       "offsetY",      0),
    cupOffX:         sv(z, "packaging", "cup",       "offsetX",      0),
    cupPaddingLeft:  sv(z, "packaging", "cup",       "paddingLeft",  8),
    scrollStiffness: sv(z, "packaging", "scroll",    "stiffness",    90),
    scrollDamping:   sv(z, "packaging", "scroll",    "damping",      22),
    watermarkFontSize: sv(z, "packaging", "watermark", "fontSize",   45),
    watermarkOffY:     sv(z, "packaging", "watermark", "offsetY",    0),
    watermarkOffX:     sv(z, "packaging", "watermark", "offsetX",    0),
    // cultura
    culturaPaddingBottom: sv(z, "cultura", "section", "paddingBottom", 180),
    receiptWidth:    sv(z, "cultura", "receipt", "width",    72),
    receiptOffY:     sv(z, "cultura", "receipt", "offsetY",  0),
    receiptOffX:     sv(z, "cultura", "receipt", "offsetX",  0),
    receiptRotation: sv(z, "cultura", "receipt", "rotation", -3),
    dbdFontSize:     sv(z, "cultura", "differentByDefault", "fontSize",  15),
    dbdOpacity:      sv(z, "cultura", "differentByDefault", "opacity",   18),
    dbdOffY:         sv(z, "cultura", "differentByDefault", "offsetY",   0),
    hashFontSize:    sv(z, "cultura", "hashtag",            "fontSize",  0.5),
    hashOffY:        sv(z, "cultura", "hashtag",            "offsetY",   0),
    thisIsFontSize:  sv(z, "cultura", "thisIs",             "fontSize",  5.5),
    thisIsOffY:      sv(z, "cultura", "thisIs",             "offsetY",   0),
    ourCultureFs:    sv(z, "cultura", "ourCulture",         "fontSize",  17),
    ourCultureOffY:  sv(z, "cultura", "ourCulture",         "offsetY",   0),
    descFontSize:    sv(z, "cultura", "description",        "fontSize",  0.56),
    descLineHeight:  sv(z, "cultura", "description",        "lineHeight",2.1),
    descOffY:        sv(z, "cultura", "description",        "offsetY",   0),
    descOffX:        sv(z, "cultura", "description",        "offsetX",   0),
    // subtitle
    subtitleFontSize: sv(z, "hero", "subtitle", "fontSize",  6),
    subtitleRotation: sv(z, "hero", "subtitle", "rotation",  -2),
    subtitleOffY:     sv(z, "hero", "subtitle", "offsetY",   0),
    subtitleOffX:     sv(z, "hero", "subtitle", "offsetX",   0),
    // marquee
    marqueeFontSize: sv(z, "hero", "marquee", "fontSize", 5.5),
    marqueeSpeed:    sv(z, "hero", "marquee", "speed",    18),
    marqueePaddingV: sv(z, "hero", "marquee", "paddingV", 5),
    marqueeOffY:     sv(z, "hero", "marquee", "offsetY",  0),
    // pedir ya
    pedirTitleFs:    sv(z, "pedirYa", "title",   "fontSize",     25),
    pedirTitleOffY:  sv(z, "pedirYa", "title",   "offsetY",      0),
    pedirTaglineFs:  sv(z, "pedirYa", "tagline", "fontSize",     0.5),
    pedirTaglineOffY:sv(z, "pedirYa", "tagline", "offsetY",      0),
    appsGap:         sv(z, "pedirYa", "apps",    "gap",          10),
    appsPaddingV:    sv(z, "pedirYa", "apps",    "paddingV",     16),
    appsOffY:        sv(z, "pedirYa", "apps",    "offsetY",      0),
    infoPaddingV:    sv(z, "pedirYa", "info",    "paddingV",     16),
    infoPaddingH:    sv(z, "pedirYa", "info",    "paddingH",     16),
    infoOffY:        sv(z, "pedirYa", "info",    "offsetY",      0),
    wmFontSize:      sv(z, "pedirYa", "watermark", "fontSize",   22),
    wmRotation:      sv(z, "pedirYa", "watermark", "rotation",   -12),
    wmOffY:          sv(z, "pedirYa", "watermark", "offsetY",    10),
    wmOffX:          sv(z, "pedirYa", "watermark", "offsetX",    -15),
    // menu overlay
    menuNavFontSize: sv(z, "menu", "navLinks",          "fontSize", 19),
    menuNavGap:      sv(z, "menu", "navLinks",          "gap",      4),
    menuNavOffY:     sv(z, "menu", "navLinks",          "offsetY",  -140),
    menuNavOffX:     sv(z, "menu", "navLinks",          "offsetX",  12),
    menuMdSize:      sv(z, "menu", "miercolesSticker",  "size",     38),
    menuMdTop:       sv(z, "menu", "miercolesSticker",  "top",      72),
    menuMdRight:     sv(z, "menu", "miercolesSticker",  "right",    -10),
    menuMdRotation:  sv(z, "menu", "miercolesSticker",  "rotation", -2),
    menuJcSize:      sv(z, "menu", "jacketClubSticker", "size",     38),
    menuJcBottom:    sv(z, "menu", "jacketClubSticker", "bottom",   80),
    menuJcLeft:      sv(z, "menu", "jacketClubSticker", "left",     -10),
    menuJcRotation:  sv(z, "menu", "jacketClubSticker", "rotation", -2),
    menuBtnFontSize: sv(z, "menu", "pedirAhora",   "fontSize", 0.88),
    menuBtnTop:      sv(z, "menu", "pedirAhora",   "top",      13),
    menuBtnRight:    sv(z, "menu", "pedirAhora",   "right",    18),
    menuSocialSize:  sv(z, "menu", "socialIcons",  "size",     20),
    menuSocialOffY:  sv(z, "menu", "socialIcons",  "offsetY",  400),
    menuSocialOffX:  sv(z, "menu", "socialIcons",  "offsetX",  20),
    menuSocialGap:   sv(z, "menu", "socialIcons",  "gap",      16),
  };

  // ── Scroll-driven packaging + cultura ────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const packagingRef       = useRef<HTMLDivElement>(null);
  const culturaRef         = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: packagingRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: culturaProgress } = useScroll({
    target: culturaRef,
    offset: ["start end", "start -1.0"],
  });
  // arranca desde el borde inferior (400px) y entra rápido hasta posición sticky (440px desde top)
  const cultureYRaw = useTransform(culturaProgress, (p) => {
    const t = Math.max(0, (p - 0.28) / 0.40);
    return Math.pow(1 - Math.min(1, t), 4) * 400;
  });
  const cultureY = useSpring(cultureYRaw, { stiffness: 120, damping: 20 });
  const counterY = useTransform(cultureY, v => -v);

  // receipt: cae del cielo sincronizado con la llegada del panel
  const receiptYRaw = useTransform(culturaProgress, (p) => {
    const t = Math.max(0, (p - 0.22) / 0.22);
    return (1 - Math.min(1, t)) * -160;
  });
  const receiptOpacity = useTransform(culturaProgress, (p) => Math.min(1, Math.max(0, (p - 0.22) / 0.18)));
  const receiptYAnim = useSpring(receiptYRaw, { stiffness: 90, damping: 18 });
  const sp = { stiffness: 180, damping: 28 };
  // diagonal: bolsa izquierda-arriba → derecha-abajo
  const bagXRaw = useTransform(scrollYProgress, [0.30, 0.50], [-180, 0]);
  const bagYRaw = useTransform(scrollYProgress, [0.30, 0.50], [-130, 0]);
  const bagX  = useSpring(bagXRaw, sp);
  const bagY  = useSpring(bagYRaw, sp);
  const bagOp = useTransform(scrollYProgress, [0.30, 0.36], [0, 1]);
  // diagonal: caja derecha-arriba → izquierda-abajo
  const boxXRaw = useTransform(scrollYProgress, [0.36, 0.56], [180, 0]);
  const boxYRaw = useTransform(scrollYProgress, [0.36, 0.56], [-110, 0]);
  const boxX  = useSpring(boxXRaw, sp);
  const boxY  = useSpring(boxYRaw, sp);
  const boxOp = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  // diagonal: vaso derecha-arriba → izquierda-abajo
  const cupXRaw = useTransform(scrollYProgress, [0.42, 0.62], [160, 0]);
  const cupYRaw = useTransform(scrollYProgress, [0.42, 0.62], [-90, 0]);
  const cupX  = useSpring(cupXRaw, sp);
  const cupY  = useSpring(cupYRaw, sp);
  const cupOp = useTransform(scrollYProgress, [0.42, 0.48], [0, 1]);

  const [culturaHeaderY, setCulturaHeaderY] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    // offsetTop: posición en el layout SIN transforms de Framer Motion.
    // getBoundingClientRect incluiría el y:400 inicial del panel y daría un valor erróneo.
    const measure = () => {
      if (!culturaRef.current) return;
      setCulturaHeaderY((culturaRef.current as HTMLElement).offsetTop + 48);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // globals.css fija height:100% + overflow:hidden en html/body para el scroll horizontal del desktop.
  // Aquí los reseteamos para que el documento crezca naturalmente y window.scrollY funcione en mobile.
  useEffect(() => {
    const htmlStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const prev = {
      htmlOverflow: htmlStyle.overflow,
      htmlHeight:   htmlStyle.height,
      bodyOverflow: bodyStyle.overflow,
      bodyHeight:   bodyStyle.height,
    };
    htmlStyle.overflow = "visible";
    htmlStyle.height   = "auto";
    bodyStyle.overflow = "visible";
    bodyStyle.height   = "auto";
    return () => {
      htmlStyle.overflow = prev.htmlOverflow;
      htmlStyle.height   = prev.htmlHeight;
      bodyStyle.overflow = prev.bodyOverflow;
      bodyStyle.height   = prev.bodyHeight;
    };
  }, []);

  // Pre-decodifica las imágenes del reveal de packaging. Arrancan en opacity:0,
  // así que el navegador difiere su decode hasta que aparecen a ~37% de scroll
  // y lo hace en el main thread de golpe → long task ~135ms. Decodificarlas al
  // montar las deja listas en caché antes del reveal.
  useEffect(() => {
    ["/images/packaging-bag.webp", "/images/packaging-box.webp", "/images/packaging-cup.webp"].forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.decode().catch(() => {});
    });
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      style={{ background: C.cream, overflowX: "clip", position: "relative" }}
    >

      {/* ── Menu overlay (fixed, zIndex 200) ─────────────── */}
      <motion.div
        animate={{ clipPath: menuOpen ? "circle(150% at 24px 26px)" : "circle(0% at 24px 26px)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: C.tinta,
          pointerEvents: menuOpen ? "auto" : "none",
          overflow: "hidden",
        }}
      >
        {/* Botón cerrar — arriba izquierda */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
          style={{
            position: "absolute", top: 14, left: 18,
            background: "none", border: "none", cursor: "pointer",
            width: 34, height: 34, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 0, zIndex: 1,
          }}
        >
          <span style={{ display: "block", width: 22, height: 1.5, background: C.cream, transform: "rotate(45deg) translateY(0.75px)" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: C.cream, transform: "rotate(-45deg) translateY(-0.75px)" }} />
        </button>

        {/* PEDIR AHORA — arriba derecha */}
        <button
          onClick={() => { setMenuOpen(false); router.push("/menu"); }}
          style={{ ...F.display, position: "absolute", top: d.menuBtnTop, right: d.menuBtnRight, zIndex: 1, fontSize: `${d.menuBtnFontSize}rem`, letterSpacing: "0.1em", background: C.burgundy, color: C.cream, border: "none", padding: "8px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          PEDIR AHORA
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="11" x2="11" y2="1"/>
            <polyline points="4,1 11,1 11,8"/>
          </svg>
        </button>

        {/* Sticker miércoles — arriba derecha */}
        <img
          src="/images/miercoles-dados-sticker.webp" alt="" aria-hidden="true" decoding="async"
          style={{
            position: "absolute",
            top: d.menuMdTop,
            right: d.menuMdRight,
            width: `${d.menuMdSize}%`,
            transform: `rotate(${d.menuMdRotation}deg)`,
            pointerEvents: "none",
          }}
        />

        {/* Sticker jacket club — abajo izquierda */}
        <img
          src="/images/jacket-club-sticker.webp" alt="" aria-hidden="true" decoding="async"
          style={{
            position: "absolute",
            bottom: d.menuJcBottom,
            left: d.menuJcLeft,
            width: `${d.menuJcSize}%`,
            transform: `rotate(${d.menuJcRotation}deg)`,
            pointerEvents: "none",
          }}
        />

        {/* Social icons — vertical, lado derecho */}
        <div style={{
          position: "absolute",
          top: d.menuSocialOffY,
          right: d.menuSocialOffX,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: d.menuSocialGap,
        }}>
          <a href="https://www.tiktok.com/@springs.col" target="_blank" rel="noreferrer"
            style={{ color: C.cream, display: "flex", opacity: 0.9 }}>
            <svg width={d.menuSocialSize} height={d.menuSocialSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.93a8.17 8.17 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1-.31z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/springs.col" target="_blank" rel="noreferrer"
            style={{ color: C.cream, display: "flex", opacity: 0.9 }}>
            <svg width={d.menuSocialSize} height={d.menuSocialSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </div>

        {/* Nav links */}
        <nav style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          gap: d.menuNavGap,
          padding: "80px 28px 60px 28px", height: "100%", boxSizing: "border-box",
          transform: tx(d.menuNavOffY, d.menuNavOffX),
        }}>
          {[
            { label: "CARTA",       href: "/menu" },
            { label: "ART GALLERY", href: "/art-gallery" },
            { label: "NOSOTROS",    href: "#" },
            { label: "EL CLUB",     href: "/springs-jacket-club" },
            { label: "FAQS",        href: "#faqs" },
          ].map(({ label, href }, i) => (
            <motion.a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              initial={false}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.55, ease: EASE, delay: menuOpen ? 0.28 + i * 0.07 : 0 }}
              style={{
                ...F.display,
                fontSize: `${d.menuNavFontSize}vw`,
                color: C.cream,
                textDecoration: "none",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                display: "block",
              }}
            >
              {label}
            </motion.a>
          ))}
        </nav>
      </motion.div>

      {/* ── Header sticky ──────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px",
        background: "rgba(242,232,213,0.72)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)",
      }}>
        {/* Hamburger + logo — izquierda juntos */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: -6 }}>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 5,
              padding: 6, flexShrink: 0,
            }}
          >
            <span style={{ display: "block", width: 22, height: 1.5, background: C.tinta }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: C.tinta }} />
            <span style={{ display: "block", width: 16, height: 1.5, background: C.tinta }} />
          </button>
          <span style={{ ...F.display, fontSize: "1.35rem", letterSpacing: "0.04em", color: C.tinta }}>SPRINGS</span>
          <span style={{ color: C.tinta, opacity: 0.3 }}>✦</span>
          <div style={{ ...F.mono, fontSize: "0.32rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.5, textTransform: "uppercase", opacity: 0.5 }}>
            BRITISH SOUL<br />COLOMBIAN HEART.
          </div>
        </div>

        {/* PEDIR AHORA — derecha */}
        <button
          onClick={() => router.push("/menu")}
          style={{ ...F.display, fontSize: "0.58rem", letterSpacing: "0.1em", background: C.burgundy, color: C.cream, border: "none", padding: "8px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
        >
          PEDIR AHORA
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="11" x2="11" y2="1"/>
            <polyline points="4,1 11,1 11,8"/>
          </svg>
        </button>
      </header>

      {/* ════════════════════════════
          HERO — cada elemento usa
          transform independiente
      ════════════════════════════ */}
      <section style={{ background: C.cream, position: "relative", paddingBottom: d.heroPaddingBottom }}>

        {/* Producto */}
        <div style={{ transform: tx(d.imgOffY) }}>
          <motion.img
            src="/images/la-fija.webp" alt="SPRINGS Jacket — La Fija" decoding="async"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
            style={{ width: `${d.imgWidth}%`, display: "block" }}
          />
        </div>

        {/* SPRINGS — transform independiente */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
          style={{ padding: "0 18px", overflow: "hidden", transform: tx(d.springsOffY, d.springsOffX) }}
        >
          <h1 style={{ ...F.display, fontSize: `${d.springsFontSize}vw`, color: C.tinta, lineHeight: 0.88, letterSpacing: "-0.02em", margin: 0, whiteSpace: "nowrap" }}>
            SPRINGS
          </h1>
        </motion.div>

        {/* Globo — wrapper de posición separado del animation div para que tx() no lo sobreescriba Framer */}
        <div style={{ padding: "6px 18px 0 18px", transform: tx(d.globeOffY, d.globeOffX) }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          >
            <GlobeExact size={d.globeSize} textOffset={d.globeTextOffset} />
          </motion.div>
        </div>

        {/* Underline — transform independiente */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.45 }}
          style={{ padding: "0 18px", transform: tx(d.underlineOffY, d.underlineOffX) }}
        >
          <img src="/images/underline-stroke.webp" alt="" aria-hidden="true" decoding="async"
            style={{ width: `${d.underlineWidth}%`, height: "auto", marginTop: 4, opacity: 0.85 }}
          />
        </motion.div>

        {/* Subtitle — JACKETS DIFFERENT BY DEFAULT */}
        <div style={{ padding: "0 18px", transform: tx(d.subtitleOffY, d.subtitleOffX) }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.52 }}
            style={{ transform: `rotate(${d.subtitleRotation}deg)`, transformOrigin: "left center", display: "inline-block" }}
          >
            <span style={{ fontFamily: "var(--font-marker), cursive", fontSize: `${d.subtitleFontSize}vw`, color: C.burgundy, lineHeight: 1, letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              JACKETS DIFFERENT BY DEFAULT
            </span>
          </motion.div>
        </div>

        {/* Sensitive Content — wrapper de posición separado del motion para que tx() no lo pise y */}
        <div style={{ margin: `16px ${d.sensMarginH}px`, transform: tx(d.sensOffY) }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ aspectRatio: "1402 / 1122", position: "relative", overflow: "hidden" }}
          >
            <SensitiveImage src="/images/sensitive-hero.webp" fontSize={d.sensFontSize} opacity={d.sensOpacity} />
          </motion.div>
        </div>

        {/* height:0 — estos elementos usan offsetY negativo grande, no deben aportar altura al layout */}
        <div style={{ height: 0, overflow: "visible" }}>
          {/* ART GALLERY */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.6 }}
            style={{ padding: "0 18px", transform: tx(d.agOffY, d.agOffX) }}
          >
            <a href="/art-gallery" style={{ textDecoration: "none", display: "block" }}>
              <h2 style={{ ...F.display, fontSize: `${d.agFontSize}vw`, color: C.tinta, lineHeight: 0.88, letterSpacing: "-0.02em", margin: 0, whiteSpace: "nowrap" }}>
                ART GALLERY
              </h2>
            </a>
          </motion.div>

          {/* Jacket La Fija */}
          <div style={{ padding: "0 18px", transform: tx(d.locOffY, d.locOffX) }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.65 }}
            >
              <div style={{ ...F.display, fontSize: `${d.locFontSize}vw`, color: C.tinta, lineHeight: 1.1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25em" }}>
                  <svg aria-hidden="true" width="0.65em" height="0.65em" viewBox="0 0 24 24" fill="none">
                    <line x1="21" y1="21" x2="3" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round"/>
                    <polyline points="3,11 3,3 11,3" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Jacket
                </div>
                <div style={{ paddingLeft: "calc(0.65em + 0.25em)" }}>La Fija</div>
              </div>
            </motion.div>
          </div>

          {/* Barbosa info */}
          <div style={{ padding: "0 18px", transform: tx(d.locInfoOffY, d.locInfoOffX) }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.7 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ ...F.mono, fontSize: `${d.locInfoFontSize}rem`, color: C.tinta, opacity: 0.5, lineHeight: 1 }}>⊕</span>
                <span style={{ ...F.mono, fontSize: `${d.locInfoFontSize}rem`, letterSpacing: "0.14em", color: C.tinta, lineHeight: 1, textTransform: "uppercase", opacity: 0.6, whiteSpace: "nowrap" }}>
                  BARBOSA STDR – COLOMBIA · EST. 2025
                </span>
              </div>
            </motion.div>
          </div>

          {/* Lista de productos */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.7 }}
            style={{ padding: "0 18px", transform: tx(d.listOffY) }}
          >
            <p style={{ ...F.mono, fontSize: `${d.listFontSize}rem`, color: C.tinta, letterSpacing: "-0.01em", lineHeight: 1.6, textTransform: "uppercase", margin: 0, opacity: 0.65 }}>
              LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA / LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
            </p>
          </motion.div>
        </div>
        {/* ── Stickers — fuera de cualquier contenedor con transform para que zIndex funcione ── */}
        <motion.img
          src="/images/jacket-club-sticker.webp" alt="SPRINGS Jacket Club" decoding="async"
          drag dragMomentum={false} whileDrag={{ scale: 1.06 }}
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: d.jcRotation }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1.1 }}
          style={{ position: "absolute", top: `${d.jcTop}%`, right: `${d.jcRight}%`, width: `${d.jcSize}%`, touchAction: "none", zIndex: 9999, cursor: "grab" }}
          onClick={() => router.push("/springs-jacket-club")}
        />
        <motion.img
          src="/images/miercoles-dados-sticker.webp" alt="Miércoles de Dados" decoding="async"
          drag dragMomentum={false} whileDrag={{ scale: 1.06 }}
          initial={{ scale: 0, opacity: 0, rotate: 35 }}
          animate={{ scale: 1, opacity: 1, rotate: d.mdRotation }}
          transition={{ type: "spring", stiffness: 340, damping: 16, delay: 1.3 }}
          style={{ position: "absolute", right: d.mdRight, top: d.mdTop, width: `${d.mdSize}%`, touchAction: "none", zIndex: 9999, cursor: "grab" }}
        />
      </section>

      {/* ════════ MARQUEE ════════ */}
      <div style={{ overflow: "hidden", borderTop: `1.5px solid ${C.tinta}`, borderBottom: `1.5px solid ${C.tinta}`, padding: `${d.marqueePaddingV}px 0`, background: C.cream, transform: tx(d.marqueeOffY) }}>
        <motion.div
          key={d.marqueeSpeed}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: d.marqueeSpeed, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
        >
          {[0, 1].map(copy => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: `${d.marqueeFontSize}vw`, color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: `${d.marqueeFontSize * 0.82}vw`, color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>&lt;</span>
                  <span style={{ ...F.display, fontSize: `${d.marqueeFontSize}vw`, color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: `${d.marqueeFontSize * 0.82}vw`, color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>&lt;</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ════════ EMPAQUE scroll-driven ════════ */}
      <section ref={packagingRef} style={{ background: C.cream, padding: "48px 18px 24px 18px", position: "relative", overflowX: "clip" }}>
        <div style={{ position: "absolute", left: 0, top: "50%", transform: `translateY(calc(-50% + ${d.watermarkOffY}px)) translateX(${d.watermarkOffX}px)`, ...F.display, fontSize: `${d.watermarkFontSize}vw`, color: C.tinta, opacity: 0.03, letterSpacing: "-0.02em", whiteSpace: "nowrap", zIndex: 0, pointerEvents: "none", userSelect: "none" }}>
          SPRINGS
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ transform: `translateX(${d.bagOffX}px) translateY(${d.bagOffY}px)` }}>
            <motion.div style={{ x: bagX, y: bagY, opacity: bagOp, willChange: "transform", display: "flex", justifyContent: "center", marginBottom: d.bagMbottom }}>
              <img src="/images/packaging-bag.webp" alt="Bolsa Springs" decoding="async"
                style={{ width: `${d.bagWidth}%`, maxWidth: 280, display: "block", filter: "drop-shadow(0 28px 52px rgba(26,10,12,0.20))" }}
              />
            </motion.div>
          </div>
          <div style={{ height: 0, overflow: "visible" }}>
            <div style={{ transform: `translateX(${d.boxOffX}px) translateY(${d.boxOffY}px)` }}>
              <motion.div style={{ x: boxX, y: boxY, opacity: boxOp, willChange: "transform", display: "flex", justifyContent: "flex-end", marginBottom: d.boxMbottom }}>
                <img src="/images/packaging-box.webp" alt="Caja Springs" decoding="async"
                  style={{ width: `${d.boxWidth}%`, maxWidth: 220, display: "block", filter: "drop-shadow(0 20px 40px rgba(26,10,12,0.18))", transform: `rotate(${d.boxRotation}deg)` }}
                />
              </motion.div>
            </div>
          </div>
          <div style={{ height: 0, overflow: "visible" }}>
            <div style={{ transform: `translateX(${d.cupOffX}px) translateY(${d.cupOffY}px)` }}>
              <motion.div style={{ x: cupX, y: cupY, opacity: cupOp, willChange: "transform", display: "flex", justifyContent: "flex-start", paddingLeft: `${d.cupPaddingLeft}%` }}>
                <img src="/images/packaging-cup.webp" alt="Vaso Springs" decoding="async"
                  style={{ width: `${d.cupWidth}%`, maxWidth: 160, display: "block", filter: "drop-shadow(0 16px 32px rgba(26,10,12,0.16))", transform: `rotate(${d.cupRotation}deg)` }}
                />
              </motion.div>
            </div>
          </div>
        </div>

      </section>

      {/* ════════ CULTURA TEXT OVERLAY — fijo, el panel oscuro sube por detrás ════════ */}
      {culturaHeaderY !== null && (
        <div style={{ position: "absolute", top: culturaHeaderY, left: 18, right: 18, zIndex: 10, pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, transform: tx(d.thisIsOffY) }}>
            <h2 style={{ ...F.display, fontSize: `${d.thisIsFontSize}vw`, color: "transparent", WebkitTextStroke: `1.5px ${C.cream}`, lineHeight: 0.9, letterSpacing: "-0.01em", textTransform: "uppercase", margin: 0 }}>
              THIS IS
            </h2>
            <div style={{ ...F.mono, fontSize: `${d.hashFontSize}rem`, letterSpacing: "0.22em", color: C.cream, opacity: 0.6, textTransform: "uppercase", paddingTop: 4 }}>
              #SPRINGSCLUB
            </div>
          </div>
          <h2 style={{ ...F.display, fontSize: `${d.ourCultureFs}vw`, color: C.cream, lineHeight: 0.88, letterSpacing: "-0.015em", textTransform: "uppercase", margin: "0 0 32px 0", transform: tx(d.ourCultureOffY) }}>
            OUR CULTURE
          </h2>
          {/* Receipt — en el overlay, después de los títulos en DOM = encima de ellos */}
          <div style={{ transform: tx(d.receiptOffY, d.receiptOffX) }}>
            <motion.div style={{ y: receiptYAnim, opacity: receiptOpacity }}>
              <img src="/images/culture-receipt.webp" alt="" decoding="async" style={{ width: `${d.receiptWidth}%`, maxWidth: 280, display: "block", margin: "0 auto 40px auto", transform: `rotate(${d.receiptRotation}deg)`, filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }} />
            </motion.div>
          </div>
        </div>
      )}

      {/* ════════ CULTURA ════════ */}
      <motion.section ref={culturaRef} style={{ background: C.tinta, padding: `48px 18px ${d.culturaPaddingBottom}px 18px`, position: "relative", zIndex: 2, y: cultureY }}>
        {/* THIS IS + #SPRINGSCLUB row — invisible spacer para preservar layout */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, visibility: "hidden" }}>
          <h2 style={{ ...F.display, fontSize: `${d.thisIsFontSize}vw`, lineHeight: 0.9, margin: 0 }}>
            THIS IS
          </h2>
          <div style={{ ...F.mono, fontSize: `${d.hashFontSize}rem`, paddingTop: 4 }}>
            #SPRINGSCLUB
          </div>
        </div>
        <h2 style={{ ...F.display, fontSize: `${d.ourCultureFs}vw`, lineHeight: 0.88, margin: "0 0 32px 0", visibility: "hidden" }}>
          OUR CULTURE
        </h2>
        {/* Receipt + DIFFERENT BY DEFAULT — counter-animados: no siguen el y del panel */}
        <motion.div style={{ y: counterY }}>
          <div style={{ transform: tx(d.dbdOffY) }}>
            <FadeUp  delay={0.7} fromY={32}>
              <div style={{ ...F.display, fontSize: `${d.dbdFontSize}vw`, color: C.burgundy, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase", margin: "0 0 24px 0" }}>
                DIFFERENT<br />BY DEFAULT.
              </div>
            </FadeUp>
          </div>
          {/* Description — dentro del counterY: no se mueve con el panel */}
          <div style={{ transform: tx(d.descOffY, d.descOffX) }}>
            <FadeUp  delay={0.22}>
              <p style={{ ...F.mono, fontSize: `${d.descFontSize}rem`, color: C.cream, opacity: 0.6, lineHeight: d.descLineHeight, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, textAlign: "right" }}>
                MÚSICA. CALLE. HUMOR.<br />AMIGOS. PLANES.<br />NOCHES QUE SÍ CUENTAN.<br />ESTO ES SPRINGS.
              </p>
            </FadeUp>
          </div>
        </motion.div>
      </motion.section>

      {/* ════════ PEDIR YA ════════ */}
      <section style={{ background: `linear-gradient(180deg, ${C.tinta} 0%, ${C.tinta} 6%, ${C.burgundy} 28%, ${C.burgundy} 100%)`, padding: "88px 18px 72px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: `${d.wmOffY}%`, right: `${d.wmOffX * -1}%`, ...F.display, fontSize: `${d.wmFontSize}vw`, color: C.cream, opacity: 0.04, letterSpacing: "-0.02em", whiteSpace: "nowrap", zIndex: 0, pointerEvents: "none", userSelect: "none", transform: `rotate(${d.wmRotation}deg)`, transformOrigin: "right bottom" }}>
          SPRINGS
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <FadeUp  style={{ transform: tx(d.pedirTaglineOffY) }}>
            <div style={{ ...F.mono, fontSize: `${d.pedirTaglineFs}rem`, letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 40 }}>
              ↗ SIN EXCUSAS · ESTO ES SPRINGS
            </div>
          </FadeUp>
          <FadeUp  delay={0.08} style={{ transform: tx(d.pedirTitleOffY) }}>
            <h2 style={{ ...F.display, fontSize: `${d.pedirTitleFs}vw`, color: C.cream, lineHeight: 0.92, letterSpacing: "-0.01em", textTransform: "uppercase", margin: "0 0 48px 0" }}>
              PEDIR<br />YA.
            </h2>
          </FadeUp>
          <FadeUp  delay={0.16} style={{ transform: tx(d.appsOffY) }}>
            <div style={{ marginBottom: 40 }}>
              <a href="/menu" style={{ ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em", color: C.tinta, background: C.cream, padding: `${d.appsPaddingV}px 24px`, textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                PEDIR AHORA <span>→</span>
              </a>
            </div>
          </FadeUp>
          <FadeUp  delay={0.24} style={{ transform: tx(d.infoOffY) }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Horario",  val: "12PM — 9PM",   sub: "Lunes a domingo" },
                { label: "Zona",     val: "BUCARAMANGA",  sub: "Cabecera · Cañaveral · Sotomayor" },
                { label: "Síguenos",val: "@SPRINGS.COL", sub: "Instagram · TikTok" },
              ].map(item => (
                <div key={item.label} style={{ background: "rgba(242,232,213,0.06)", padding: `${d.infoPaddingV}px ${d.infoPaddingH}px`, borderBottom: `1px solid rgba(242,232,213,0.08)` }}>
                  <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.05em", color: C.cream }}>{item.val}</div>
                  <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.4, marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ background: C.tinta, padding: "32px 18px 48px 18px", borderTop: `1px solid rgba(242,232,213,0.08)` }}>
        <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
          {["INSTAGRAM", "TIKTOK", "SPOTIFY"].map(s => (
            <a key={s} href="#" style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.18em", color: C.cream, textDecoration: "none", opacity: 0.5 }}>{s}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ opacity: 0.5 }}>
            <circle cx="9" cy="9" r="8" stroke={C.cream} strokeWidth="0.8"/>
            <ellipse cx="9" cy="9" rx="4" ry="8" stroke={C.cream} strokeWidth="0.8"/>
            <line x1="1" y1="9" x2="17" y2="9" stroke={C.cream} strokeWidth="0.8"/>
          </svg>
          <span style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.14em", color: C.cream, opacity: 0.5 }}>SPRINGS © 2025</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "CARTA",       href: "/menu" },
            { label: "ART GALLERY", href: "/art-gallery" },
            { label: "NOSOTROS",    href: "#" },
            { label: "EL CLUB",     href: "/springs-jacket-club" },
            { label: "FAQS",        href: "#" },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.16em", color: C.cream, opacity: 0.55, textDecoration: "none", textTransform: "uppercase" }}>{label}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}
