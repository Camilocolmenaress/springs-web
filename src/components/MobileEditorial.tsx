"use client";

import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans:    { fontFamily: "Inter, sans-serif" },
  mono:    { fontFamily: "JetBrains Mono, monospace" },
};

const JACKETS = [
  { name: "LA FIJA",    price: "32,900", image: "/images/la-fija.png" },
  { name: "LA PESADA",  price: "35,900", image: "/images/la-pesada.png" },
  { name: "LA BRAVA",   price: "34,900", image: "/images/la-brava.png" },
  { name: "LA SIMPLE",  price: "28,900", image: "/images/la-simple.png" },
  { name: "LA HONESTA", price: "28,900", image: "/images/la-honesta.png" },
];

const MARQUEE = "FAST, GOOD & LOUD · ESTO ES SPRINGS · ";

export default function MobileEditorial() {
  return (
    <div>

      {/* ══ SECTION 1 — HERO ══ */}
      <HeroSection />


      {/* ══ SECTION 2 — ART GALLERY (productos) ══ */}
      <section style={{ background: C.cream, padding: "48px 0 40px" }}>

        <div style={{ padding: "0 5vw", marginBottom: 24 }}>
          <Link
            href="/art-gallery"
            style={{ textDecoration: "none" }}
          >
            <h2
              style={{
                ...F.display,
                fontSize: "clamp(40px, 13vw, 64px)",
                color: C.tinta,
                margin: 0,
                letterSpacing: "-0.005em",
                textTransform: "uppercase",
              }}
            >
              ART GALLERY
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "0.2em",
                  color: C.burgundy,
                  animation: "cursorBlink 1s step-start infinite",
                }}
              >
                |
              </span>
            </h2>
          </Link>
        </div>

        {/* Carousel */}
        <div style={{
          display: "flex",
          gap: "4vw",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingLeft: "5vw",
          paddingRight: "5vw",
        }}>
          {JACKETS.map((p) => (
            <div
              key={p.name}
              style={{ flexShrink: 0, width: "72vw", scrollSnapAlign: "start" }}
            >
              <div style={{ position: "relative", width: "100%", paddingBottom: "75%", overflow: "hidden" }}>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  sizes="72vw"
                />
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.06em", color: C.tinta }}>{p.name}</div>
                <div style={{ ...F.mono, fontSize: "0.9rem", color: C.tinta }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "28px 5vw 0" }}>
          <Link
            href="/menu"
            style={{
              display: "block",
              textAlign: "center",
              ...F.display,
              fontSize: "1rem",
              letterSpacing: "0.1em",
              color: C.cream,
              background: C.burgundy,
              padding: "18px 24px",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            VER MENÚ COMPLETO →
          </Link>
        </div>

      </section>


      {/* ══ SECTION 3 — CULTURA ══ */}
      <section style={{ background: C.burgundy, padding: "48px 0 0", overflow: "hidden" }}>

        <div style={{ padding: "0 5vw", display: "flex", gap: "6vw", alignItems: "flex-start" }}>
          <div>
            <div style={{
              ...F.display,
              fontSize: "clamp(48px, 16vw, 80px)",
              color: C.cream,
              lineHeight: 0.88,
              letterSpacing: "-0.005em",
              textTransform: "uppercase",
            }}>
              THIS<br />IS<br />SPRINGS.
            </div>
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.mostaza, textTransform: "uppercase", marginBottom: 10 }}>
              BUCARAMANGA · BGA
            </div>
            <div style={{ ...F.sans, fontSize: "0.72rem", fontStyle: "italic", color: C.cream, opacity: 0.72, lineHeight: 1.5 }}>
              Dark kitchen.<br />Sin local físico.<br />La papa va a usted.
            </div>
          </div>
        </div>

        {/* Marquee — CSS animation only, no JS */}
        <div style={{ marginTop: 40, overflow: "hidden", borderTop: `1px solid rgba(242,232,213,0.15)`, paddingTop: 14 }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marquee 14s linear infinite",
          }}>
            <span style={{
              ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em",
              color: C.cream, opacity: 0.6, textTransform: "uppercase",
              whiteSpace: "nowrap", paddingRight: "8vw",
            }}>
              {MARQUEE}{MARQUEE}
            </span>
            <span style={{
              ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em",
              color: C.cream, opacity: 0.6, textTransform: "uppercase",
              whiteSpace: "nowrap", paddingRight: "8vw",
            }}>
              {MARQUEE}{MARQUEE}
            </span>
          </div>
        </div>

      </section>


      {/* ══ SECTION 4 — PEDIR YA ══ */}
      <section style={{
        background: C.tinta,
        padding: "48px 5vw",
        paddingBottom: "max(48px, env(safe-area-inset-bottom, 48px))",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
      }}>

        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 8 }}>
          ↗ SIN EXCUSAS · ESTO ES SPRINGS
        </div>

        <h2 style={{
          ...F.display,
          fontSize: "clamp(60px, 22vw, 110px)",
          lineHeight: 0.88,
          margin: "0 0 32px",
          letterSpacing: "-0.005em",
          textTransform: "uppercase",
          color: C.cream,
        }}>
          PEDIR<br />YA.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a
            href="#"
            style={{
              ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
              color: C.tinta, background: C.cream,
              padding: "18px 22px", textDecoration: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            RAPPI <span>→</span>
          </a>
          <a
            href="#"
            style={{
              ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
              color: C.cream, background: "transparent",
              border: `1px solid ${C.cream}`,
              padding: "18px 22px", textDecoration: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            DIDI FOOD <span>→</span>
          </a>
          <Link
            href="/menu"
            style={{
              ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
              color: C.mostaza, background: "transparent",
              border: `1px solid ${C.mostaza}`,
              padding: "18px 22px", textDecoration: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            PEDIDO DIRECTO <span>→</span>
          </Link>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {([
            { label: "Horario",           val: "12PM — 9PM",       sub: "Lunes a domingo" },
            { label: "Zona",              val: "BUCARAMANGA",       sub: "Cabecera · Cañaveral · Sotomayor" },
            { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · ahorra 9,900" },
          ] as const).map((item) => (
            <div key={item.label} style={{ borderTop: `1px solid rgba(242,232,213,0.12)`, paddingTop: 12 }}>
              <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
              <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.05em", color: C.cream }}>{item.val}</div>
              <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.55, marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
