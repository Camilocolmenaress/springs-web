"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans: { fontFamily: "Inter, sans-serif" },
  mono: { fontFamily: "JetBrains Mono, monospace" },
};

export default function MobileHome() {
  // Desbloquear el scroll del body solo mientras este componente esté montado
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyHeight = document.body.style.height;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlHeight = document.documentElement.style.height;
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.height = prevBodyHeight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.height = prevHtmlHeight;
    };
  }, []);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        background: C.cream,
        color: C.tinta,
        overflowX: "hidden",
        paddingTop: "max(20px, env(safe-area-inset-top, 20px))",
        paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
      }}
    >
      {/* TOP BAR */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px 16px",
        }}
      >
        <span style={{ ...F.display, fontSize: "1.4rem", letterSpacing: "0.18em", color: C.tinta }}>
          SPRINGS
        </span>
        <span style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.6, textAlign: "right", textTransform: "uppercase" }}>
          JACKET POTATOES<br />BUCARAMANGA
        </span>
      </header>

      {/* HERO */}
      <section style={{ position: "relative", padding: "8px 20px 28px" }}>
        <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.22em", color: C.tinta, opacity: 0.55, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 1, background: C.tinta, opacity: 0.5 }} />
          FOR THE HOTTEST PEOPLE
        </div>

        {/* Título gigante cortado al margen */}
        <h1
          style={{
            ...F.display,
            fontSize: "clamp(72px, 22vw, 132px)",
            color: C.tinta,
            lineHeight: 0.88,
            letterSpacing: "-0.005em",
            margin: "0 -8px 16px -2px",
            textTransform: "uppercase",
          }}
        >
          La Jacket<br />es el<br />producto<br />hoy.
        </h1>

        {/* Papa visual */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: "0 auto 20px",
            width: "min(82vw, 320px)",
            aspectRatio: "1 / 1.2",
            background:
              "radial-gradient(ellipse at 45% 38%, #D4A55A 0%, #9B6530 35%, #5C3514 70%, #2E1A08 100%)",
            clipPath: "ellipse(48% 50% at 50% 50%)",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              ...F.mono,
              fontSize: "0.52rem",
              letterSpacing: "0.22em",
              color: C.cream,
              opacity: 0.6,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            300g · Horneada
          </span>
        </motion.div>

        {/* CTA principal */}
        <Link
          href="/menu"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: C.burgundy,
            color: C.cream,
            padding: "20px 24px",
            border: `1px solid ${C.tinta}`,
            ...F.display,
            fontSize: "1.4rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          <span>Ver Menú</span>
          <span aria-hidden style={{ fontSize: "1rem" }}>↗</span>
        </Link>
        <p style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.16em", color: C.tinta, opacity: 0.55, textTransform: "uppercase", textAlign: "center" }}>
          30 — 45 min · Cabecera · Cañaveral · Sotomayor
        </p>
      </section>

      {/* CAMPAÑA RÓBALA */}
      <section style={{ padding: "32px 20px", background: C.tinta, color: C.cream, position: "relative", overflow: "hidden" }}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -40,
            right: -20,
            ...F.display,
            fontSize: "180px",
            color: C.burgundy,
            opacity: 0.25,
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            pointerEvents: "none",
          }}
        >
          RB
        </span>
        <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.22em", color: C.mostaza, marginBottom: 12 }}>
          CAMPAÑA ACTIVA
        </div>
        <h2
          style={{
            ...F.display,
            fontSize: "clamp(58px, 18vw, 96px)",
            color: C.mostaza,
            lineHeight: 0.88,
            letterSpacing: "-0.005em",
            margin: "0 0 16px",
          }}
        >
          RÓBALA.
        </h2>
        <p style={{ ...F.sans, fontSize: "0.95rem", lineHeight: 1.4, color: C.cream, opacity: 0.85, marginBottom: 14, fontStyle: "italic" }}>
          Hay un bono escondido en Bucaramanga. La pista entra a Stories una vez por semana. Si lo encontrás, es tuyo.
        </p>
        <a
          href="https://instagram.com/springs.col"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            ...F.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: C.cream,
            border: `1px solid ${C.cream}`,
            padding: "10px 16px",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          @SPRINGS.COL <span aria-hidden>↗</span>
        </a>
      </section>

      {/* PRODUCTOS DESTACADOS — banda horizontal */}
      <section style={{ padding: "28px 0" }}>
        <div style={{ padding: "0 20px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.22em", color: C.tinta, opacity: 0.55, textTransform: "uppercase", marginBottom: 4 }}>
              W25 · LA CARTA
            </div>
            <h3 style={{ ...F.display, fontSize: "2rem", letterSpacing: "0.02em", margin: 0, textTransform: "uppercase" }}>
              Jackets
            </h3>
          </div>
          <Link href="/menu" style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.2em", color: C.tinta, textDecoration: "none", textTransform: "uppercase" }}>
            VER TODO ↗
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            padding: "8px 20px 20px",
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {[
            { nombre: "LA FIJA", desc: "Pollo desmechado", precio: "32,900" },
            { nombre: "LA PESADA", desc: "Carne desmechada", precio: "35,900" },
            { nombre: "LA BRAVA", desc: "Chorizo santandereano", precio: "34,900" },
            { nombre: "LA SIMPLE", desc: "Carne molida", precio: "28,900" },
            { nombre: "LA HONESTA", desc: "Sin carne", precio: "28,900" },
          ].map((p) => (
            <Link
              key={p.nombre}
              href="/menu"
              style={{
                flexShrink: 0,
                width: "72vw",
                maxWidth: 280,
                border: `1px solid ${C.tinta}`,
                background: C.cream,
                textDecoration: "none",
                color: "inherit",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  aspectRatio: "4 / 3",
                  background:
                    "radial-gradient(ellipse at 50% 45%, #D4A55A 0%, #9B6530 35%, #5C3514 70%, #2E1A08 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderBottom: `1px solid ${C.tinta}`,
                }}
              >
                <span
                  style={{
                    ...F.display,
                    fontSize: "2rem",
                    color: C.cream,
                    letterSpacing: "0.02em",
                    textShadow: "0 4px 12px rgba(0,0,0,0.35)",
                  }}
                >
                  {p.nombre}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 10,
                    ...F.mono,
                    fontSize: "0.5rem",
                    color: C.cream,
                    opacity: 0.6,
                    letterSpacing: "0.2em",
                  }}
                >
                  W25 · BGA
                </span>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flex: 1 }}>
                <span style={{ ...F.sans, fontSize: "0.78rem", color: C.tinta, opacity: 0.7 }}>{p.desc}</span>
                <span style={{ ...F.mono, fontSize: "1rem", color: C.tinta, fontWeight: 500 }}>{p.precio}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMBOS */}
      <section style={{ padding: "12px 20px 28px" }}>
        <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.22em", color: C.tinta, opacity: 0.55, textTransform: "uppercase", marginBottom: 8 }}>
          COMBOS · MEJOR PRECIO
        </div>
        <Link
          href="/menu"
          style={{
            display: "block",
            background: C.burgundy,
            color: C.cream,
            padding: "20px",
            border: `1px solid ${C.tinta}`,
            textDecoration: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ ...F.display, fontSize: "2.2rem", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 6, textTransform: "uppercase" }}>
            Para Dos
          </div>
          <div style={{ ...F.sans, fontSize: "0.82rem", opacity: 0.8, marginBottom: 16 }}>
            2 Jackets + 2 Bebidas
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.2em", color: C.mostaza, marginBottom: 2, textTransform: "uppercase" }}>
                AHORRÁS 9,900
              </div>
              <div style={{ ...F.mono, fontSize: "1.4rem", letterSpacing: "0.04em" }}>69,900</div>
            </div>
            <span style={{ ...F.mono, fontSize: "0.7rem", letterSpacing: "0.2em" }}>PEDIR ↗</span>
          </div>
        </Link>
      </section>

      {/* MANIFESTO */}
      <section style={{ padding: "32px 20px 40px", borderTop: `1px solid ${C.tinta}`, borderBottom: `1px solid ${C.tinta}` }}>
        <h2 style={{ ...F.display, fontSize: "clamp(60px, 18vw, 110px)", lineHeight: 0.88, letterSpacing: "-0.005em", margin: "0 0 16px", color: C.tinta, textTransform: "uppercase" }}>
          Different<br />by default.
        </h2>
        <p style={{ ...F.sans, fontSize: "0.95rem", lineHeight: 1.5, color: C.tinta, opacity: 0.75, fontStyle: "italic", marginBottom: 20 }}>
          Solo delivery. Sin local físico. Dark kitchen en Bucaramanga, ingredientes santandereanos, papa horneada 300g — nunca frita.
        </p>
        <div style={{ display: "flex", gap: 16, ...F.mono, fontSize: "0.6rem", letterSpacing: "0.18em", color: C.tinta, opacity: 0.6, textTransform: "uppercase", flexWrap: "wrap" }}>
          <span>FAST</span><span>·</span><span>GOOD</span><span>·</span><span>LOUD</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 20px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.18em", color: C.tinta, opacity: 0.6, textTransform: "uppercase", lineHeight: 1.6 }}>
          12PM — 9PM · Lun a Dom<br />
          Bucaramanga · Solo delivery
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { label: "INSTAGRAM", href: "https://instagram.com/springs.col" },
            { label: "TIKTOK", href: "https://tiktok.com/@springs.col" },
            { label: "MENÚ", href: "/menu" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                ...F.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: C.tinta,
                textDecoration: "none",
                padding: "8px 12px",
                border: `1px solid ${C.tinta}`,
                textTransform: "uppercase",
              }}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
        <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.4, textTransform: "uppercase", marginTop: 8 }}>
          © SPRINGS™ — BGA 2026
        </div>
      </footer>
    </main>
  );
}
