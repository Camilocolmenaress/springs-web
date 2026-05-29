"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SensitiveImage from "@/components/SensitiveImage";

const EASE = [0.22, 1, 0.36, 1] as const;
const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const dim = "rgba(26,10,12,0.5)";
const F = {
  display: { fontFamily: "Anton, sans-serif" } as React.CSSProperties,
  sans:    { fontFamily: "var(--font-inter)" } as React.CSSProperties,
  mono:    { fontFamily: "var(--font-jetbrains-mono)" } as React.CSSProperties,
};

// once: false → re-anima al volver con scroll
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

// Mismo globo exacto que Art Gallery — spinning, texto completo, sin drag
function GlobeExact({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 110 110" width={size} height={size}>
      <circle cx="55" cy="55" r={33} fill="none" stroke={dim} strokeWidth="1.2" opacity={0.85}/>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {/* meridians */}
        <ellipse cx="55" cy="55" rx={8}  ry={33} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.55}/>
        <ellipse cx="55" cy="55" rx={18} ry={33} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.5}/>
        <ellipse cx="55" cy="55" rx={27} ry={33} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.45}/>
        {/* parallels */}
        <ellipse cx="55" cy="55" rx={33} ry={9}  fill="none" stroke={dim} strokeWidth="0.85" opacity={0.55}/>
        <ellipse cx="55" cy="55" rx={33} ry={19} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.5}/>
        <ellipse cx="55" cy="55" rx={33} ry={28} fill="none" stroke={dim} strokeWidth="0.85" opacity={0.45}/>
        {/* equator cross */}
        <line x1={22} y1="55" x2={88} y2="55" stroke={dim} strokeWidth="0.8" opacity={0.45}/>
        <line x1="55" y1={22} x2="55" y2={88} stroke={dim} strokeWidth="0.8" opacity={0.45}/>
      </motion.g>
      {/* full-circle text path — mismo que Art Gallery */}
      <path id="mob-home-chimba" fill="none" d="M34,91.4 a42,42 0 0,1 42,-72.7 a42,42 0 0,1 -42,72.7"/>
      <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="1.0" fill={dim} fillOpacity={0.9}>
        <textPath href="#mob-home-chimba" startOffset="7%">FOR THE MOST CHIMBA PEOPLE ✦ </textPath>
      </text>
    </svg>
  );
}

export default function MobileHome() {
  const router = useRouter();

  return (
    <div style={{ background: C.cream, height: "100dvh", overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, left: 0, right: 0, zIndex: 100,
        height: 52,
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

      {/* ════════════════════════════════════════
          ZONA 1 — HERO COLLAGE
      ════════════════════════════════════════ */}
      <section style={{ background: C.cream, position: "relative" }}>

        {/* Producto hero — full width, Jacket Club sticker encima */}
        <div style={{ position: "relative" }}>
          <motion.img
            src="/images/la-fija.png"
            alt="SPRINGS Jacket — La Fija"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
            style={{ width: "100%", display: "block" }}
          />

          {/* Jacket Club sticker — esquina superior derecha, draggable */}
          <motion.img
            src="/images/jacket-club-sticker.png"
            alt="SPRINGS Jacket Club"
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.06, zIndex: 50 }}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1.1 }}
            style={{
              position: "absolute", top: "12%", right: "4%",
              width: "36%", touchAction: "none",
              zIndex: 20, cursor: "grab",
            }}
            onClick={() => router.push("/springs-jacket-club")}
          />
        </div>

        {/* SPRINGS — justo debajo de la papa */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
          style={{ padding: "0 18px 0 18px", overflow: "hidden" }}
        >
          <h1 style={{
            ...F.display,
            fontSize: "clamp(78px, 27vw, 130px)",
            color: C.tinta,
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            SPRINGS
          </h1>
        </motion.div>

        {/* Globo — debajo de SPRINGS, mismo que Art Gallery, sin drag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          style={{ padding: "6px 18px 0 18px" }}
        >
          <GlobeExact size={72} />
        </motion.div>

        {/* Subtítulo + underline */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.45 }}
          style={{ padding: "4px 18px 0 18px" }}
        >
          <img src="/images/underline-stroke.png" alt="" aria-hidden="true" style={{ width: "68%", height: "auto", marginTop: 4, opacity: 0.85 }} />
        </motion.div>

        {/* Sensitive Content — entre SPRINGS y ART GALLERY */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{ margin: "16px 18px", aspectRatio: "1402 / 1122", position: "relative", overflow: "hidden" }}
        >
          <SensitiveImage src="/images/sensitive-hero.png" fontSize={3.5} opacity={60} />
        </motion.div>

        {/* ART GALLERY */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.6 }}
          style={{ padding: "0 18px", overflow: "hidden" }}
        >
          <a href="/art-gallery" style={{ textDecoration: "none", display: "block" }}>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(52px, 18vw, 88px)",
              color: C.tinta,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              margin: 0,
              whiteSpace: "nowrap",
            }}>
              ART GALLERY
            </h2>
          </a>
        </motion.div>

        {/* ↖ Jacket La Fija + Miércoles de Dados */}
        <div style={{ position: "relative", padding: "8px 18px 0 18px", minHeight: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.65 }}
          >
            <div style={{ ...F.display, fontSize: "clamp(16px, 5.5vw, 28px)", color: C.tinta, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
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

          {/* Miércoles de Dados — derecha, draggable */}
          <motion.img
            src="/images/miercoles-dados-sticker.png"
            alt="Miércoles de Dados"
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.06, zIndex: 50 }}
            initial={{ scale: 0, opacity: 0, rotate: 35 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 340, damping: 16, delay: 1.3 }}
            style={{
              position: "absolute", right: 12, top: 0,
              width: "38%",
              touchAction: "none", zIndex: 20, cursor: "grab",
            }}
          />
        </div>

        {/* Lista de productos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.7 }}
          style={{ padding: "20px 18px 28px 18px", borderTop: `1px solid ${C.tinta}18`, marginTop: 12 }}
        >
          <p style={{
            ...F.mono, fontSize: "0.42rem", color: C.tinta,
            letterSpacing: "-0.01em", lineHeight: 1.6,
            textTransform: "uppercase", margin: 0, opacity: 0.65,
          }}>
            LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA / LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
          </p>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE — igual que desktop
      ════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════
          ZONA EMPAQUE — 3 items con scroll
          once:false → aparecen y desaparecen
      ════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: "48px 18px 56px 18px", position: "relative" }}>
        {/* SPRINGS fantasma de fondo */}
        <div style={{
          position: "absolute", left: "-5%", top: "50%",
          transform: "translateY(-50%)",
          ...F.display, fontSize: "45vw",
          color: C.tinta, opacity: 0.03,
          letterSpacing: "-0.02em", whiteSpace: "nowrap",
          zIndex: 0, pointerEvents: "none", userSelect: "none",
        }}>
          SPRINGS
        </div>

        {/* 3 items de empaque — escalonados, re-animan al scrollear */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>

          <FadeUp delay={0.0}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: -40 }}>
              <img
                src="/images/packaging-bag.png"
                alt="Bolsa Springs"
                style={{
                  width: "70%", maxWidth: 280, display: "block",
                  filter: "drop-shadow(0 28px 52px rgba(26,10,12,0.20))",
                }}
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -30 }}>
              <img
                src="/images/packaging-box.png"
                alt="Caja Springs"
                style={{
                  width: "55%", maxWidth: 220, display: "block",
                  filter: "drop-shadow(0 20px 40px rgba(26,10,12,0.18))",
                  transform: "rotate(4deg)",
                }}
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8%" }}>
              <img
                src="/images/packaging-cup.png"
                alt="Vaso Springs"
                style={{
                  width: "40%", maxWidth: 160, display: "block",
                  filter: "drop-shadow(0 16px 32px rgba(26,10,12,0.16))",
                  transform: "rotate(-3deg)",
                }}
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ZONA CULTURA — fondo tinta
          "DIFFERENT BY DEFAULT" vive aquí
      ════════════════════════════════════════ */}
      <section style={{ background: C.tinta, padding: "56px 18px 64px 18px" }}>

        {/* DIFFERENT BY DEFAULT — en el fondo oscuro, igual que desktop */}
        <FadeUp>
          <div>
            <div style={{
              ...F.display,
              fontSize: "clamp(42px, 15vw, 72px)",
              color: "transparent",
              WebkitTextStroke: `1.5px ${C.cream}`,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              opacity: 0.18,
              margin: "0 0 24px 0",
            }}>
              DIFFERENT<br />BY DEFAULT.
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.cream, opacity: 0.6, marginBottom: 20, textTransform: "uppercase" }}>
            #SPRINGSCLUB
          </div>
        </FadeUp>
        <FadeUp delay={0.12}>
          <div>
            <h2 style={{ ...F.display, fontSize: "clamp(18px, 5.5vw, 32px)", color: "transparent", WebkitTextStroke: `1.5px ${C.cream}`, lineHeight: 0.9, letterSpacing: "-0.01em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
              THIS IS
            </h2>
            <h2 style={{ ...F.display, fontSize: "clamp(52px, 17vw, 84px)", color: C.cream, lineHeight: 0.9, letterSpacing: "-0.015em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
              OUR CULTURE
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.22}>
          <p style={{ ...F.mono, fontSize: "0.56rem", color: C.cream, opacity: 0.6, lineHeight: 2.1, letterSpacing: "0.06em", textTransform: "uppercase", margin: "28px 0 0 0" }}>
            MÚSICA. CALLE. HUMOR.<br />
            AMIGOS. PLANES.<br />
            NOCHES QUE SÍ CUENTAN.<br />
            ESTO ES SPRINGS.
          </p>
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
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
            <a key={label} href={href} style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.16em", color: C.cream, opacity: 0.55, textDecoration: "none", textTransform: "uppercase" }}>
              {label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
