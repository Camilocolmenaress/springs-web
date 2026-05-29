"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SensitiveImage from "@/components/SensitiveImage";

const EASE = [0.22, 1, 0.36, 1] as const;
const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const F = {
  display: { fontFamily: "Anton, sans-serif" } as React.CSSProperties,
  sans:    { fontFamily: "var(--font-inter)" } as React.CSSProperties,
  mono:    { fontFamily: "var(--font-jetbrains-mono)" } as React.CSSProperties,
};

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function MobileHome() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ background: C.cream, minHeight: "100dvh", overflowX: "hidden" }}>

      {/* ── Fixed header — igual que desktop ────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px",
        background: "rgba(242,232,213,0.55)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)",
      }}>
        {/* Logo + subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...F.display, fontSize: "1.35rem", letterSpacing: "0.04em", color: C.tinta }}>SPRINGS</span>
          <span style={{ color: C.tinta, fontSize: "0.65rem", opacity: 0.35 }}>✦</span>
          <div style={{ ...F.mono, fontSize: "0.32rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.5, textTransform: "uppercase", opacity: 0.5 }}>
            BRITISH SOUL<br />COLOMBIAN HEART.
          </div>
        </div>
        {/* PEDIR AHORA — burgundy como el desktop */}
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
          ZONA 1 — HERO (cream)
      ════════════════════════════════════════ */}
      <section style={{ background: C.cream, paddingTop: 52, position: "relative", overflow: "hidden" }}>

        {/* SPRINGS — cae desde arriba */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
          style={{ padding: "16px 18px 0 18px" }}
        >
          <h1 style={{
            ...F.display,
            fontSize: "clamp(78px, 27vw, 130px)",
            color: C.tinta,
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "visible",
          }}>
            SPRINGS
          </h1>
        </motion.div>

        {/* Subtítulo — JACKETS DIFFERENT BY DEFAULT. */}
        <motion.div
          initial={{ x: 40, opacity: 0, rotate: 2 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
          style={{ padding: "4px 18px 0 18px" }}
        >
          <div style={{
            ...F.display,
            fontSize: "clamp(12px, 4vw, 18px)",
            color: C.burgundy,
            lineHeight: 1.1,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}>
            JACKETS DIFFERENT BY DEFAULT.
          </div>
          <img src="/images/underline-stroke.png" alt="" aria-hidden="true"
            style={{ width: "70%", height: "auto", marginTop: 2, opacity: 0.85 }}
          />
        </motion.div>

        {/* ART GALLERY — entra desde la izquierda */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.5 }}
          style={{ padding: "8px 18px 0 18px" }}
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
              overflow: "hidden",
            }}>
              ART GALLERY
            </h2>
          </a>
        </motion.div>

        {/* Producto hero — sube desde abajo */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
          style={{ position: "relative", padding: "0 10px" }}
        >
          <img
            src="/images/la-fija.png"
            alt="SPRINGS Jacket — La Fija"
            style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto" }}
          />
        </motion.div>

        {/* ↖ Jacket / La Fija */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.6 }}
          style={{ padding: "0 18px 6px 18px" }}
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
        </motion.div>

        {/* ⊕ Ubicación */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.45 }}
          style={{ padding: "0 18px 16px 18px", display: "flex", alignItems: "flex-start", gap: 6 }}
        >
          <span style={{ ...F.mono, fontSize: "0.85rem", color: C.tinta, opacity: 0.5, lineHeight: 1 }}>⊕</span>
          <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.16em", color: C.tinta, lineHeight: 1.6, textTransform: "uppercase", opacity: 0.65 }}>
            Barbosa STDR – COLOMBIA<br />EST. 2025
          </div>
        </motion.div>

        {/* Lista de productos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
          style={{ padding: "12px 18px", borderTop: `1px solid ${C.tinta}18` }}
        >
          <p style={{
            ...F.mono, fontSize: "0.42rem", color: C.tinta,
            letterSpacing: "-0.01em", lineHeight: 1.5,
            textTransform: "uppercase", margin: 0, opacity: 0.7,
          }}>
            LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA / LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
          </p>
        </motion.div>

        {/* Stickers */}
        <div style={{ padding: "8px 18px 4px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <motion.a
            href="/springs-jacket-club"
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1.1 }}
            style={{ display: "block", flex: "0 0 38%" }}
          >
            <img src="/images/jacket-club-sticker.png" alt="SPRINGS Jacket Club" style={{ width: "100%", display: "block" }} />
          </motion.a>

          {/* Globe sticker */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 20, delay: 0.9 }}
            style={{ flex: "0 0 26%", aspectRatio: "1", position: "relative" }}
          >
            <svg viewBox="0 0 110 110" width="100%" height="100%">
              <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(26,10,12,0.45)" strokeWidth="1.2" opacity={0.8}/>
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <ellipse cx="55" cy="55" rx="16.6" ry="46" fill="none" stroke="rgba(26,10,12,0.4)" strokeWidth="0.9" opacity={0.6}/>
                <ellipse cx="55" cy="55" rx="35.4" ry="46" fill="none" stroke="rgba(26,10,12,0.4)" strokeWidth="0.9" opacity={0.5}/>
                <ellipse cx="55" cy="55" rx="46" ry="18.9" fill="none" stroke="rgba(26,10,12,0.4)" strokeWidth="0.9" opacity={0.6}/>
                <line x1="9" y1="55" x2="101" y2="55" stroke="rgba(26,10,12,0.4)" strokeWidth="0.8" opacity={0.45}/>
              </motion.g>
              <path id="mob-chimba-circle" fill="none" d="M9,55 a46,46 0 0,1 46,-46 a46,46 0 0,1 46,46"/>
              <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="1.0" fill="rgba(26,10,12,0.55)">
                <textPath href="#mob-chimba-circle" startOffset="11.5%">FOR THE MOST CHIMBA PEOPLE ✦ </textPath>
              </text>
            </svg>
          </motion.div>

          <motion.img
            src="/images/miercoles-dados-sticker.png"
            alt="Miércoles de Dados"
            initial={{ scale: 0, opacity: 0, rotate: 35 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 340, damping: 16, delay: 1.3 }}
            style={{ flex: "0 0 30%", display: "block" }}
          />
        </div>

        {/* Sensitive content card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            margin: "12px 18px 24px 18px",
            aspectRatio: "1402 / 1122",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <SensitiveImage src="/images/sensitive-hero.png" fontSize={3.5} opacity={60} />
        </motion.div>

      </section>

      {/* ════════════════════════════════════════
          MARQUEE TAPE — igual que desktop
      ════════════════════════════════════════ */}
      <div style={{
        overflow: "hidden",
        borderTop: `1.5px solid ${C.tinta}`,
        borderBottom: `1.5px solid ${C.tinta}`,
        padding: "5px 0",
        background: C.cream,
      }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
        >
          {[0, 1].map(copy => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: "clamp(18px, 5.5vw, 32px)", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>
                    SPRINGS
                  </span>
                  <span style={{ ...F.display, fontSize: "clamp(15px, 4.5vw, 26px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>&lt;</span>
                  <span style={{ ...F.display, fontSize: "clamp(18px, 5.5vw, 32px)", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>
                    SPRINGS
                  </span>
                  <span style={{ ...F.display, fontSize: "clamp(15px, 4.5vw, 26px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>&lt;</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          ZONA 1.5 — EMPAQUE
      ════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: "48px 18px 56px 18px", position: "relative", overflow: "hidden" }}>
        {/* SPRINGS fondo fantasma */}
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

        <FadeUp style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            ...F.display,
            fontSize: "clamp(36px, 13vw, 64px)",
            color: C.burgundy, lineHeight: 0.88,
            letterSpacing: "-0.02em", textTransform: "uppercase",
          }}>
            DIFFERENT<br />BY DEFAULT.
          </div>
          <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.22em", color: C.tinta, opacity: 0.4, marginTop: "1.6em", textTransform: "uppercase" }}>
            BUCARAMANGA · EST. 2025
          </div>
        </FadeUp>

        <FadeUp delay={0.15} style={{ position: "relative", zIndex: 1, marginTop: 32 }}>
          <img
            src="/images/packaging-bag.png"
            alt=""
            aria-hidden="true"
            style={{
              width: "75%", maxWidth: 300, display: "block", margin: "0 auto",
              filter: "drop-shadow(0 28px 52px rgba(26,10,12,0.18))",
            }}
          />
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════
          ZONA 1.7 — CULTURA
      ════════════════════════════════════════ */}
      <section style={{ background: C.tinta, padding: "56px 18px 64px 18px" }}>
        <FadeUp>
          <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.cream, opacity: 0.6, marginBottom: 20, textTransform: "uppercase" }}>
            #SPRINGSCLUB
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(18px, 5.5vw, 32px)",
              color: "transparent",
              WebkitTextStroke: `1.5px ${C.cream}`,
              lineHeight: 0.9, letterSpacing: "-0.01em",
              textTransform: "uppercase", whiteSpace: "nowrap", margin: 0,
            }}>
              THIS IS
            </h2>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(52px, 17vw, 84px)",
              color: C.cream,
              lineHeight: 0.9, letterSpacing: "-0.015em",
              textTransform: "uppercase", whiteSpace: "nowrap", margin: 0,
            }}>
              OUR CULTURE
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p style={{
            ...F.mono, fontSize: "0.56rem", color: C.cream,
            opacity: 0.6, lineHeight: 2.1,
            letterSpacing: "0.06em", textTransform: "uppercase",
            margin: "28px 0 0 0",
          }}>
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
      <footer style={{ background: C.tinta, padding: "32px 18px 100px 18px", borderTop: `1px solid rgba(242,232,213,0.08)` }}>
        {/* Sociales */}
        <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
          {["INSTAGRAM", "TIKTOK", "SPOTIFY"].map(s => (
            <a key={s} href="#" style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.18em", color: C.cream, textDecoration: "none", opacity: 0.5 }}>{s}</a>
          ))}
        </div>
        {/* Globe + copyright */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ opacity: 0.5 }}>
            <circle cx="9" cy="9" r="8" stroke={C.cream} strokeWidth="0.8"/>
            <ellipse cx="9" cy="9" rx="4" ry="8" stroke={C.cream} strokeWidth="0.8"/>
            <line x1="1" y1="9" x2="17" y2="9" stroke={C.cream} strokeWidth="0.8"/>
          </svg>
          <span style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.14em", color: C.cream, opacity: 0.5 }}>SPRINGS © 2025</span>
        </div>
        {/* Nav */}
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

      {/* ── Bottom nav fijo ──────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        height: 56,
        display: "flex", alignItems: "stretch",
        background: "rgba(10,8,6,0.42)",
        backdropFilter: "blur(28px) saturate(1.4)",
        WebkitBackdropFilter: "blur(28px) saturate(1.4)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {[
          {
            href: "/", label: "HOME", active: pathname === "/",
            icon: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
          },
          {
            href: "/art-gallery", label: "ART GALLERY", active: pathname === "/art-gallery",
            icon: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M9 3v18"/></svg>,
          },
          {
            href: "/menu", label: "CARTA", active: pathname === "/menu",
            icon: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
          },
        ].map(({ href, label, active, icon }) => (
          <a
            key={href}
            href={href}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 6,
              textDecoration: "none",
              color: active ? C.burgundy : C.cream,
              borderBottom: active ? `2px solid ${C.burgundy}` : "2px solid transparent",
            }}
          >
            <span style={{ color: "inherit", display: "flex" }}>{icon}</span>
            <span style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.12em", color: "inherit", textTransform: "uppercase" }}>{label}</span>
          </a>
        ))}
      </nav>

    </div>
  );
}
