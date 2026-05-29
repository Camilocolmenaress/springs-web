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

const PRODUCTS = "LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA / LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /";

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
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
    <div style={{ background: C.cream, minHeight: "100dvh", overflowX: "hidden" }}>

      {/* ── Fixed header ─────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
        background: "rgba(242,232,213,0.55)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...F.display, fontSize: "1.4rem", letterSpacing: "0.04em", color: C.tinta }}>
            SPRINGS
          </span>
          <span style={{ color: C.tinta, fontSize: "0.7rem", opacity: 0.4 }}>✦</span>
          <div style={{ ...F.mono, fontSize: "0.36rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.4, textTransform: "uppercase", opacity: 0.5 }}>
            BRITISH SOUL<br />COLOMBIAN HEART.
          </div>
        </div>
        <button
          onClick={() => router.push("/menu")}
          style={{
            ...F.mono, fontSize: "0.5rem", letterSpacing: "0.14em",
            background: C.burgundy, color: C.cream,
            border: "none", padding: "7px 14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          PEDIR AHORA
          <svg aria-hidden="true" width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        </button>
      </header>

      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <section style={{
        background: C.cream,
        paddingTop: 52,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* SPRINGS title — overflow like desktop */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          style={{
            padding: "20px 20px 0 20px",
            overflow: "hidden",
          }}
        >
          <h1 style={{
            ...F.display,
            fontSize: "clamp(80px, 28vw, 140px)",
            color: C.tinta,
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}>
            SPRINGS
          </h1>
        </motion.div>

        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          style={{ position: "relative", margin: "0 0 -24px 0" }}
        >
          <img
            src="/images/la-fija.png"
            alt="La Fija — Jacket de pollo desmechado"
            style={{
              width: "88%",
              maxWidth: 360,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              position: "relative",
              zIndex: 2,
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          style={{ padding: "0 20px 8px 20px" }}
        >
          <div style={{
            ...F.display,
            fontSize: "clamp(13px, 4.2vw, 20px)",
            color: C.burgundy,
            letterSpacing: "0.01em",
            fontStyle: "italic",
            lineHeight: 1.1,
          }}>
            JACKETS DIFFERENT BY DEFAULT.
          </div>
        </motion.div>

        {/* Globe label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
          style={{
            padding: "4px 20px 12px 20px",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            border: `1px solid ${C.tinta}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tinta} strokeWidth="1" opacity={0.5}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
          </div>
          <div>
            <div style={{ ...F.mono, fontSize: "0.46rem", letterSpacing: "0.06em", color: C.tinta, opacity: 0.55, textTransform: "uppercase" }}>
              ↖ Jacket La Fija
            </div>
            <div style={{ ...F.mono, fontSize: "0.4rem", letterSpacing: "0.06em", color: C.tinta, opacity: 0.4, textTransform: "uppercase" }}>
              BARBOSA STDR — COLOMBIA EST. 2025
            </div>
          </div>
        </motion.div>

        {/* Product list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.7 }}
          style={{
            padding: "12px 20px 24px 20px",
            borderTop: `1px solid ${C.tinta}18`,
          }}
        >
          <div style={{
            ...F.mono,
            fontSize: "0.42rem",
            letterSpacing: "0.04em",
            color: C.tinta,
            opacity: 0.55,
            lineHeight: 1.9,
            textTransform: "uppercase",
          }}>
            {PRODUCTS}
          </div>
        </motion.div>

        {/* CTA button */}
        <div style={{ padding: "0 20px 56px 20px" }}>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
            onClick={() => router.push("/menu")}
            style={{
              ...F.mono, fontSize: "0.58rem", letterSpacing: "0.16em",
              background: C.tinta, color: C.cream,
              border: "none", padding: "13px 28px", cursor: "pointer",
              textTransform: "uppercase",
              width: "100%",
            }}
          >
            VER LA CARTA
          </motion.button>
        </div>
      </section>

      {/* ── Section 2: ART GALLERY ──────────────────────────────────── */}
      <section style={{
        background: C.cream,
        padding: "48px 20px 56px 20px",
        borderTop: `1px solid ${C.tinta}14`,
      }}>
        <FadeUp>
          <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.18em", color: C.tinta, opacity: 0.4, marginBottom: 10, textTransform: "uppercase" }}>
            SPRINGS ✦ 2025
          </div>
        </FadeUp>
        <FadeUp delay={0.08}>
          <a href="/art-gallery" style={{ textDecoration: "none", display: "block" }}>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(64px, 22vw, 110px)",
              color: C.tinta,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              margin: "0 0 20px 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}>
              ART<br />GALLERY
            </h2>
          </a>
        </FadeUp>
        <FadeUp delay={0.16}>
          <a
            href="/art-gallery"
            style={{
              ...F.mono, fontSize: "0.52rem", letterSpacing: "0.14em",
              color: C.tinta, textDecoration: "none",
              border: `1px solid ${C.tinta}50`, padding: "10px 20px",
              display: "inline-flex", alignItems: "center", gap: 7,
              opacity: 0.8,
            }}
          >
            ENTRAR
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </a>
        </FadeUp>
      </section>

      {/* ── Section 3: Stickers ─────────────────────────────────────── */}
      <section style={{
        background: C.cream,
        padding: "8px 20px 48px 20px",
        borderTop: `1px solid ${C.tinta}10`,
        display: "flex", gap: 16, alignItems: "flex-start",
      }}>
        <FadeUp style={{ flex: 1 }}>
          <a href="/springs-jacket-club" style={{ display: "block" }}>
            <img
              src="/images/jacket-club-sticker.png"
              alt="Springs Jacket Club"
              style={{ width: "100%", maxWidth: 160, display: "block" }}
            />
          </a>
        </FadeUp>
        <FadeUp delay={0.1} style={{ flex: 1 }}>
          <img
            src="/images/miercoles-dados-sticker.png"
            alt="Miércoles de Dados"
            style={{ width: "100%", maxWidth: 160, display: "block" }}
          />
        </FadeUp>
      </section>

      {/* ── Section 4: Ticker ───────────────────────────────────────── */}
      <section style={{
        background: C.tinta,
        overflow: "hidden",
        padding: "14px 0",
        borderTop: `2px solid ${C.tinta}`,
      }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          style={{
            display: "flex", gap: 0, whiteSpace: "nowrap", width: "max-content",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{
              ...F.display,
              fontSize: "clamp(22px, 7vw, 36px)",
              color: C.cream,
              opacity: 0.15,
              letterSpacing: "0.02em",
              paddingRight: 32,
            }}>
              SPRINGS &lt;
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{
        background: C.tinta,
        padding: "40px 20px 100px 20px",
      }}>
        <div style={{ ...F.display, fontSize: "2.8rem", color: C.cream, letterSpacing: "0.04em", marginBottom: 4 }}>
          SPRINGS
        </div>
        <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.1em", color: C.cream, opacity: 0.4, marginBottom: 32, textTransform: "uppercase" }}>
          SPRINGS © 2025 · BUCARAMANGA, COL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { label: "CARTA",       href: "/menu" },
            { label: "ART GALLERY", href: "/art-gallery" },
            { label: "EL CLUB",     href: "/springs-jacket-club" },
            { label: "INSTAGRAM",   href: "https://instagram.com/springs.col" },
            { label: "TIKTOK",      href: "https://tiktok.com/@springs.col" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                ...F.mono, fontSize: "0.5rem", letterSpacing: "0.14em",
                color: C.cream, opacity: 0.55, textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </footer>

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
