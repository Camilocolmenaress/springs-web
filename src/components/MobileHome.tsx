"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;
const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};
const F = {
  display: { fontFamily: "Anton, sans-serif" } as React.CSSProperties,
  sans:    { fontFamily: "var(--font-inter)" } as React.CSSProperties,
  mono:    { fontFamily: "var(--font-jetbrains-mono)" } as React.CSSProperties,
};

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: EASE, delay }}
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
    <div style={{ background: C.tinta, minHeight: "100dvh", overflowX: "hidden" }}>

      {/* ── Fixed header ─────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
        background: "rgba(10,8,6,0.42)",
        backdropFilter: "blur(28px) saturate(1.4)",
        WebkitBackdropFilter: "blur(28px) saturate(1.4)",
      }}>
        <span style={{ ...F.display, fontSize: "1.4rem", letterSpacing: "0.04em", color: C.cream }}>
          SPRINGS
        </span>
        <button
          onClick={() => router.push("/menu")}
          style={{
            ...F.mono, fontSize: "0.52rem", letterSpacing: "0.14em",
            background: "transparent", color: C.cream,
            border: `1px solid ${C.cream}`, padding: "6px 14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          PEDIR AHORA
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </header>

      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <section style={{
        minHeight: "100dvh",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 0 120px 0",
        position: "relative", overflow: "hidden",
        background: C.tinta,
      }}>
        {/* Product image */}
        <motion.img
          src="/images/la-fija-hero.jpg"
          alt="La Fija"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />
        {/* Dark overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,10,12,0.92) 0%, rgba(26,10,12,0.3) 50%, transparent 100%)",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          >
            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.2em", color: C.mostaza, marginBottom: 8, textTransform: "uppercase" }}>
              BRITISH SOUL · COLOMBIAN HEART
            </div>
            <h1 style={{ ...F.display, fontSize: "clamp(64px, 22vw, 96px)", color: C.cream, lineHeight: 0.9, letterSpacing: "-0.02em", margin: "0 0 16px 0" }}>
              SPRINGS
            </h1>
            <div style={{ ...F.sans, fontSize: "1rem", color: C.cream, opacity: 0.7, marginBottom: 28, fontStyle: "italic" }}>
              Different by default.
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
            onClick={() => router.push("/menu")}
            style={{
              ...F.mono, fontSize: "0.6rem", letterSpacing: "0.18em",
              background: C.burgundy, color: C.cream,
              border: "none", padding: "14px 28px", cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            VER LA CARTA
          </motion.button>
        </div>
      </section>

      {/* ── Section 2: ART GALLERY ──────────────────────────────────── */}
      <section style={{
        minHeight: "80dvh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 24px",
        background: C.burgundy,
        position: "relative", overflow: "hidden",
      }}>
        <FadeUp delay={0}>
          <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.22em", color: C.cream, opacity: 0.6, marginBottom: 16, textTransform: "uppercase" }}>
            SPRINGS ✦ 2025
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 style={{ ...F.display, fontSize: "clamp(56px, 18vw, 80px)", color: C.cream, lineHeight: 0.9, letterSpacing: "-0.02em", margin: "0 0 24px 0" }}>
            ART<br />GALLERY
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p style={{ ...F.sans, fontSize: "0.85rem", color: C.cream, opacity: 0.7, lineHeight: 1.6, marginBottom: 32, maxWidth: 260 }}>
            Cada exhibit es una pieza. Cada Jacket, un objeto de deseo.
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <a
            href="/art-gallery"
            style={{
              ...F.mono, fontSize: "0.58rem", letterSpacing: "0.16em",
              color: C.cream, textDecoration: "none",
              border: `1px solid ${C.cream}`, padding: "12px 24px",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            ENTRAR
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </a>
        </FadeUp>
      </section>

      {/* ── Section 3: THIS IS OUR CULTURE ─────────────────────────── */}
      <section style={{
        minHeight: "80dvh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 24px",
        background: C.tinta,
      }}>
        <FadeUp delay={0}>
          <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.22em", color: C.mostaza, marginBottom: 16, textTransform: "uppercase" }}>
            THIS IS
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 style={{ ...F.display, fontSize: "clamp(52px, 16vw, 72px)", color: C.cream, lineHeight: 0.92, letterSpacing: "-0.02em", margin: "0 0 28px 0" }}>
            OUR<br />CULTURE
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p style={{ ...F.mono, fontSize: "0.6rem", color: C.cream, opacity: 0.65, lineHeight: 2.2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            MÚSICA. CALLE. HUMOR.<br />
            AMIGOS. PLANES.<br />
            NOCHES QUE SÍ CUENTAN.<br />
            ESTO ES SPRINGS.
          </p>
        </FadeUp>
      </section>

      {/* ── Section 4: Carta links ──────────────────────────────────── */}
      <section style={{
        background: C.cream,
        padding: "64px 24px 120px 24px",
      }}>
        <FadeUp>
          <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.22em", color: C.tinta, opacity: 0.5, marginBottom: 32, textTransform: "uppercase" }}>
            SPRINGS · BUCARAMANGA · DOMICILIO
          </div>
        </FadeUp>

        {[
          { label: "JACKETS", sub: "desde 28,900", href: "/menu" },
          { label: "LOADED",  sub: "desde 22,500", href: "/menu" },
          { label: "EL CLUB", sub: "Jacket Club",  href: "/springs-jacket-club" },
        ].map(({ label, sub, href }, i) => (
          <FadeUp key={label} delay={i * 0.08}>
            <a
              href={href}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "18px 0",
                borderBottom: `1px solid ${C.tinta}20`,
                textDecoration: "none",
              }}
            >
              <div>
                <div style={{ ...F.display, fontSize: "1.6rem", color: C.tinta, letterSpacing: "-0.01em" }}>{label}</div>
                <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, textTransform: "uppercase", marginTop: 2 }}>{sub}</div>
              </div>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke={C.tinta} strokeWidth="1.4"/>
              </svg>
            </a>
          </FadeUp>
        ))}
      </section>

      {/* ── Bottom nav ──────────────────────────────────────────────── */}
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
            <span style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.12em", color: "inherit", textTransform: "uppercase" }}>
              {label}
            </span>
          </a>
        ))}
      </nav>

    </div>
  );
}
