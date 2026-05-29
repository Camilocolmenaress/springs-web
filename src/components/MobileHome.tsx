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

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
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

  // recibe config en tiempo real desde el editor padre (iframe postMessage)
  const [msgConfig, setMsgConfig] = useState<PageConfig | null>(null);
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === "SPRINGS_CONFIG") setMsgConfig(e.data.config as PageConfig);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const z = (msgConfig ?? savedConfig).zones;

  const d = {
    imgWidth:         sv(z, "hero", "productImage",      "width",        100),
    imgOffY:          sv(z, "hero", "productImage",      "offsetY",      0),
    jcSize:           sv(z, "hero", "jacketClubSticker", "size",         36),
    jcTop:            sv(z, "hero", "jacketClubSticker", "top",          12),
    jcRight:          sv(z, "hero", "jacketClubSticker", "right",        4),
    jcRotation:       sv(z, "hero", "jacketClubSticker", "rotation",     8),
    globeSize:        sv(z, "hero", "globe",             "size",         72),
    globeOffY:        sv(z, "hero", "globe",             "offsetY",      6),
    globeTextOffset:  sv(z, "hero", "globe",             "textOffset",   7),
    underlineWidth:   sv(z, "hero", "underline",         "width",        68),
    underlineMarginT: sv(z, "hero", "underline",         "marginTop",    4),
    sensMarginH:      sv(z, "hero", "sensitiveImage",    "marginH",      18),
    sensMarginV:      sv(z, "hero", "sensitiveImage",    "marginV",      16),
    sensFontSize:     sv(z, "hero", "sensitiveImage",    "fontSize",     3.5),
    sensOpacity:      sv(z, "hero", "sensitiveImage",    "opacity",      60),
    agFontSize:       sv(z, "hero", "artGallery",        "fontSize",     18),
    agOffY:           sv(z, "hero", "artGallery",        "offsetY",      0),
    mdSize:           sv(z, "hero", "miercolesSticker",  "size",         38),
    mdRight:          sv(z, "hero", "miercolesSticker",  "right",        12),
    mdTop:            sv(z, "hero", "miercolesSticker",  "top",          0),
    mdRotation:       sv(z, "hero", "miercolesSticker",  "rotation",     -8),
    listFontSize:     sv(z, "hero", "productList",       "fontSize",     0.42),
    listMarginT:      sv(z, "hero", "productList",       "marginTop",    12),
    bagWidth:         sv(z, "packaging", "bag",    "width",        70),
    bagMbottom:       sv(z, "packaging", "bag",    "marginBottom", -40),
    boxWidth:         sv(z, "packaging", "box",    "width",        55),
    boxRotation:      sv(z, "packaging", "box",    "rotation",     4),
    boxMbottom:       sv(z, "packaging", "box",    "marginBottom", -30),
    cupWidth:         sv(z, "packaging", "cup",    "width",        40),
    cupRotation:      sv(z, "packaging", "cup",    "rotation",     -3),
    cupPaddingLeft:   sv(z, "packaging", "cup",    "paddingLeft",  8),
    scrollStiffness:  sv(z, "packaging", "scroll", "stiffness",    90),
    scrollDamping:    sv(z, "packaging", "scroll", "damping",      22),
    dbdFontSize:      sv(z, "cultura", "differentByDefault", "fontSize",   15),
    dbdOpacity:       sv(z, "cultura", "differentByDefault", "opacity",    18),
    hashFontSize:     sv(z, "cultura", "hashtag",            "fontSize",   0.5),
    thisIsFontSize:   sv(z, "cultura", "thisIs",             "fontSize",   5.5),
    ourCultureFs:     sv(z, "cultura", "ourCulture",         "fontSize",   17),
    descFontSize:     sv(z, "cultura", "description",        "fontSize",   0.56),
    descLineHeight:   sv(z, "cultura", "description",        "lineHeight", 2.1),
    descMarginT:      sv(z, "cultura", "description",        "marginTop",  28),
    pedirTitleFs:     sv(z, "pedirYa", "title",   "fontSize",     25),
    pedirTitleMb:     sv(z, "pedirYa", "title",   "marginBottom", 40),
    pedirTaglineFs:   sv(z, "pedirYa", "tagline", "fontSize",     0.5),
    pedirTaglineMb:   sv(z, "pedirYa", "tagline", "marginBottom", 16),
    appsGap:          sv(z, "pedirYa", "apps",    "gap",          10),
    appsPaddingV:     sv(z, "pedirYa", "apps",    "paddingV",     16),
    appsMb:           sv(z, "pedirYa", "apps",    "marginBottom", 40),
    infoPaddingV:     sv(z, "pedirYa", "info",    "paddingV",     16),
    infoGap:          sv(z, "pedirYa", "info",    "gap",          1),
  };

  // scroll-driven packaging
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const packagingRef       = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: packagingRef,
    container: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  const bagXRaw = useTransform(scrollYProgress, [0.0,  0.35], [-140, 0]);
  const bagOpRaw= useTransform(scrollYProgress, [0.0,  0.28], [0, 1]);
  const boxXRaw = useTransform(scrollYProgress, [0.15, 0.50], [140, 0]);
  const boxOpRaw= useTransform(scrollYProgress, [0.15, 0.43], [0, 1]);
  const cupXRaw = useTransform(scrollYProgress, [0.30, 0.65], [-120, 0]);
  const cupOpRaw= useTransform(scrollYProgress, [0.30, 0.58], [0, 1]);
  const sp = { stiffness: d.scrollStiffness, damping: d.scrollDamping };
  const bagX  = useSpring(bagXRaw,  sp);
  const bagOp = useSpring(bagOpRaw, sp);
  const boxX  = useSpring(boxXRaw,  sp);
  const boxOp = useSpring(boxOpRaw, sp);
  const cupX  = useSpring(cupXRaw,  sp);
  const cupOp = useSpring(cupOpRaw, sp);

  return (
    <div
      ref={scrollContainerRef}
      style={{ background: C.cream, height: "100dvh", overflowY: "auto", overflowX: "hidden" }}
    >

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px",
        background: "rgba(242,232,213,0.72)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...F.display, fontSize: "1.35rem", letterSpacing: "0.04em", color: C.tinta }}>SPRINGS</span>
          <span style={{ color: C.tinta, opacity: 0.3 }}>✦</span>
          <div style={{ ...F.mono, fontSize: "0.32rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.5, textTransform: "uppercase", opacity: 0.5 }}>
            BRITISH SOUL<br />COLOMBIAN HEART.
          </div>
        </div>
        <button
          onClick={() => router.push("/menu")}
          style={{
            ...F.mono, fontSize: "0.48rem", letterSpacing: "0.14em",
            background: C.burgundy, color: C.cream,
            border: "none", padding: "7px 12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          PEDIR AHORA
          <svg aria-hidden="true" width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        </button>
      </header>

      {/* ════════ HERO ════════ */}
      <section style={{ background: C.cream, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <motion.img
            src="/images/la-fija.png"
            alt="SPRINGS Jacket — La Fija"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: d.imgOffY, opacity: 1 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
            style={{ width: `${d.imgWidth}%`, display: "block" }}
          />
          <motion.img
            src="/images/jacket-club-sticker.png"
            alt="SPRINGS Jacket Club"
            drag dragMomentum={false} whileDrag={{ scale: 1.06, zIndex: 50 }}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: d.jcRotation }}
            transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1.1 }}
            style={{ position: "absolute", top: `${d.jcTop}%`, right: `${d.jcRight}%`, width: `${d.jcSize}%`, touchAction: "none", zIndex: 20, cursor: "grab" }}
            onClick={() => router.push("/springs-jacket-club")}
          />
        </div>

        <motion.div
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
          style={{ padding: "0 18px", overflow: "hidden" }}
        >
          <h1 style={{ ...F.display, fontSize: "clamp(78px, 27vw, 130px)", color: C.tinta, lineHeight: 0.88, letterSpacing: "-0.02em", margin: 0, whiteSpace: "nowrap" }}>
            SPRINGS
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          style={{ padding: `${d.globeOffY}px 18px 0 18px` }}
        >
          <GlobeExact size={d.globeSize} textOffset={d.globeTextOffset} />
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.45 }}
          style={{ padding: "0 18px" }}
        >
          <img src="/images/underline-stroke.png" alt="" aria-hidden="true"
            style={{ width: `${d.underlineWidth}%`, height: "auto", marginTop: d.underlineMarginT, opacity: 0.85 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{ margin: `${d.sensMarginV}px ${d.sensMarginH}px`, aspectRatio: "1402 / 1122", position: "relative", overflow: "hidden" }}
        >
          <SensitiveImage src="/images/sensitive-hero.png" fontSize={d.sensFontSize} opacity={d.sensOpacity} />
        </motion.div>

        <motion.div
          initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.6 }}
          style={{ padding: `${d.agOffY}px 18px 0 18px`, overflow: "hidden" }}
        >
          <a href="/art-gallery" style={{ textDecoration: "none", display: "block" }}>
            <h2 style={{ ...F.display, fontSize: `${d.agFontSize}vw`, color: C.tinta, lineHeight: 0.88, letterSpacing: "-0.02em", margin: 0, whiteSpace: "nowrap" }}>
              ART GALLERY
            </h2>
          </a>
        </motion.div>

        <div style={{ position: "relative", padding: "8px 18px 0 18px", minHeight: 80 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.65 }}>
            <div style={{ ...F.display, fontSize: "clamp(16px, 5.5vw, 28px)", color: C.tinta, lineHeight: 1.1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25em" }}>
                <svg aria-hidden="true" width="0.65em" height="0.65em" viewBox="0 0 24 24" fill="none">
                  <line x1="21" y1="21" x2="3" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round"/>
                  <polyline points="3,11 3,3 11,3" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Jacket
              </div>
              <div style={{ paddingLeft: "calc(0.65em + 0.25em)" }}>La Fija</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 6 }}>
              <span style={{ ...F.mono, fontSize: "0.8rem", color: C.tinta, opacity: 0.5, lineHeight: 1 }}>⊕</span>
              <div style={{ ...F.mono, fontSize: "0.4rem", letterSpacing: "0.14em", color: C.tinta, lineHeight: 1.6, textTransform: "uppercase", opacity: 0.6 }}>
                Barbosa STDR – COLOMBIA<br />EST. 2025
              </div>
            </div>
          </motion.div>
          <motion.img
            src="/images/miercoles-dados-sticker.png" alt="Miércoles de Dados"
            drag dragMomentum={false} whileDrag={{ scale: 1.06, zIndex: 50 }}
            initial={{ scale: 0, opacity: 0, rotate: 35 }}
            animate={{ scale: 1, opacity: 1, rotate: d.mdRotation }}
            transition={{ type: "spring", stiffness: 340, damping: 16, delay: 1.3 }}
            style={{ position: "absolute", right: d.mdRight, top: d.mdTop, width: `${d.mdSize}%`, touchAction: "none", zIndex: 20, cursor: "grab" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.7 }}
          style={{ padding: "20px 18px 28px 18px", borderTop: `1px solid ${C.tinta}18`, marginTop: d.listMarginT }}
        >
          <p style={{ ...F.mono, fontSize: `${d.listFontSize}rem`, color: C.tinta, letterSpacing: "-0.01em", lineHeight: 1.6, textTransform: "uppercase", margin: 0, opacity: 0.65 }}>
            LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA / LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
          </p>
        </motion.div>
      </section>

      {/* ════════ MARQUEE ════════ */}
      <div style={{ overflow: "hidden", borderTop: `1.5px solid ${C.tinta}`, borderBottom: `1.5px solid ${C.tinta}`, padding: "5px 0", background: C.cream }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
        >
          {[0, 1].map(copy => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: "clamp(18px, 5.5vw, 32px)", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "clamp(15px, 4.5vw, 26px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>&lt;</span>
                  <span style={{ ...F.display, fontSize: "clamp(18px, 5.5vw, 32px)", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "clamp(15px, 4.5vw, 26px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>&lt;</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ════════ EMPAQUE scroll-driven ════════ */}
      <section ref={packagingRef} style={{ background: C.cream, padding: "48px 18px 64px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "-5%", top: "50%", transform: "translateY(-50%)", ...F.display, fontSize: "45vw", color: C.tinta, opacity: 0.03, letterSpacing: "-0.02em", whiteSpace: "nowrap", zIndex: 0, pointerEvents: "none", userSelect: "none" }}>
          SPRINGS
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <motion.div style={{ x: bagX, opacity: bagOp, display: "flex", justifyContent: "center", marginBottom: d.bagMbottom }}>
            <img src="/images/packaging-bag.png" alt="Bolsa Springs" style={{ width: `${d.bagWidth}%`, maxWidth: 280, display: "block", filter: "drop-shadow(0 28px 52px rgba(26,10,12,0.20))" }}/>
          </motion.div>
          <motion.div style={{ x: boxX, opacity: boxOp, display: "flex", justifyContent: "flex-end", marginBottom: d.boxMbottom }}>
            <img src="/images/packaging-box.png" alt="Caja Springs" style={{ width: `${d.boxWidth}%`, maxWidth: 220, display: "block", filter: "drop-shadow(0 20px 40px rgba(26,10,12,0.18))", transform: `rotate(${d.boxRotation}deg)` }}/>
          </motion.div>
          <motion.div style={{ x: cupX, opacity: cupOp, display: "flex", justifyContent: "flex-start", paddingLeft: `${d.cupPaddingLeft}%` }}>
            <img src="/images/packaging-cup.png" alt="Vaso Springs" style={{ width: `${d.cupWidth}%`, maxWidth: 160, display: "block", filter: "drop-shadow(0 16px 32px rgba(26,10,12,0.16))", transform: `rotate(${d.cupRotation}deg)` }}/>
          </motion.div>
        </div>
      </section>

      {/* ════════ CULTURA ════════ */}
      <section style={{ background: C.tinta, padding: "56px 18px 64px 18px" }}>
        <FadeUp>
          <div style={{ ...F.display, fontSize: `${d.dbdFontSize}vw`, color: "transparent", WebkitTextStroke: `1.5px ${C.cream}`, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase", opacity: d.dbdOpacity / 100, margin: "0 0 24px 0" }}>
            DIFFERENT<br />BY DEFAULT.
          </div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <div style={{ ...F.mono, fontSize: `${d.hashFontSize}rem`, letterSpacing: "0.22em", color: C.cream, opacity: 0.6, marginBottom: 20, textTransform: "uppercase" }}>
            #SPRINGSCLUB
          </div>
        </FadeUp>
        <FadeUp delay={0.12}>
          <div>
            <h2 style={{ ...F.display, fontSize: `${d.thisIsFontSize}vw`, color: "transparent", WebkitTextStroke: `1.5px ${C.cream}`, lineHeight: 0.9, letterSpacing: "-0.01em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>THIS IS</h2>
            <h2 style={{ ...F.display, fontSize: `${d.ourCultureFs}vw`, color: C.cream, lineHeight: 0.9, letterSpacing: "-0.015em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>OUR CULTURE</h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.22}>
          <p style={{ ...F.mono, fontSize: `${d.descFontSize}rem`, color: C.cream, opacity: 0.6, lineHeight: d.descLineHeight, letterSpacing: "0.06em", textTransform: "uppercase", margin: `${d.descMarginT}px 0 0 0` }}>
            MÚSICA. CALLE. HUMOR.<br />AMIGOS. PLANES.<br />NOCHES QUE SÍ CUENTAN.<br />ESTO ES SPRINGS.
          </p>
        </FadeUp>
      </section>

      {/* ════════ PEDIR YA ════════ */}
      <section style={{ background: C.burgundy, padding: "56px 18px 72px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "10%", right: "-15%", ...F.display, fontSize: "22vw", color: C.cream, opacity: 0.04, letterSpacing: "-0.02em", whiteSpace: "nowrap", zIndex: 0, pointerEvents: "none", userSelect: "none", transform: "rotate(-12deg)", transformOrigin: "right bottom" }}>
          SPRINGS
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <FadeUp>
            <div style={{ ...F.mono, fontSize: `${d.pedirTaglineFs}rem`, letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: d.pedirTaglineMb }}>
              ↗ SIN EXCUSAS · ESTO ES SPRINGS
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 style={{ ...F.display, fontSize: `${d.pedirTitleFs}vw`, color: C.cream, lineHeight: 0.85, letterSpacing: "-0.01em", textTransform: "uppercase", margin: `0 0 ${d.pedirTitleMb}px 0` }}>
              PEDIR<br />YA.
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <div style={{ display: "flex", flexDirection: "column", gap: d.appsGap, marginBottom: d.appsMb }}>
              <a href="#" style={{ ...F.display, fontSize: "1rem", letterSpacing: "0.12em", color: C.tinta, background: C.cream, padding: `${d.appsPaddingV}px 24px`, textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>RAPPI <span>→</span></a>
              <a href="#" style={{ ...F.display, fontSize: "1rem", letterSpacing: "0.12em", color: C.cream, background: "transparent", border: `1px solid ${C.cream}`, opacity: 0.9, padding: `${d.appsPaddingV}px 24px`, textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>UBER EATS <span>→</span></a>
              <a href="/menu" style={{ ...F.display, fontSize: "1rem", letterSpacing: "0.12em", color: C.mostaza, background: "transparent", border: `1px solid ${C.mostaza}`, padding: `${d.appsPaddingV}px 24px`, textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>PEDIDO DIRECTO <span>→</span></a>
            </div>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div style={{ display: "flex", flexDirection: "column", gap: d.infoGap }}>
              {[
                { label: "Horario",  val: "12PM — 9PM",   sub: "Lunes a domingo" },
                { label: "Zona",     val: "BUCARAMANGA",  sub: "Cabecera · Cañaveral · Sotomayor" },
                { label: "Síguenos",val: "@SPRINGS.COL", sub: "Instagram · TikTok" },
              ].map(item => (
                <div key={item.label} style={{ background: "rgba(242,232,213,0.06)", padding: `${d.infoPaddingV}px 0`, borderBottom: `1px solid rgba(242,232,213,0.08)` }}>
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
