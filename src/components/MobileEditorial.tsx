"use client";

import Image from "next/image";
import Link from "next/link";
import DragSticker from "@/components/DragSticker";
import SensitiveImage from "@/components/SensitiveImage";

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
      <section
        style={{
          position: "relative",
          height: "100svh",
          background: C.cream,
          overflow: "hidden",
        }}
      >

        {/* La Fija — potato */}
        <div
          style={{
            position: "absolute",
            left: "31.5vw",
            top: "4.3svh",
            width: "82vw",
            height: "58svh",
            zIndex: 4,
            transform: "scale(0.72) rotate(-0.9deg)",
            transformOrigin: "left top",
          }}
        >
          <Image
            src="/images/la-fija.png"
            alt="La Fija — Springs Jacket"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="82vw"
          />
        </div>

        {/* SPRINGS title */}
        <div
          style={{
            position: "absolute",
            left: "10.4vw",
            top: "2.6svh",
            zIndex: 3,
            transform: "scale(1.37) rotate(0.1deg)",
            transformOrigin: "left top",
            animation: "heroReveal 0.55s ease both",
          }}
        >
          <h1
            style={{
              ...F.display,
              fontSize: "clamp(52px, 20vw, 88px)",
              color: C.tinta,
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              margin: 0,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            SPRINGS
          </h1>
        </div>

        {/* Location — ⊕ Barbosa STDR */}
        <div
          style={{
            position: "absolute",
            left: "3.2vw",
            top: "13.3svh",
            zIndex: 5,
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
            animation: "heroReveal 0.55s ease 0.12s both",
          }}
        >
          <span style={{ ...F.mono, fontSize: "0.78rem", color: C.tinta, opacity: 0.5, lineHeight: 1 }}>⊕</span>
          <div
            style={{
              ...F.mono,
              fontSize: "0.46rem",
              letterSpacing: "0.18em",
              color: C.tinta,
              lineHeight: 1.6,
              textTransform: "uppercase",
              opacity: 0.65,
            }}
          >
            Barbosa STDR – COLOMBIA<br />EST. 2025
          </div>
        </div>

        {/* Globe sticker */}
        <div
          style={{
            position: "absolute",
            left: "11.2vw",
            top: "35.7svh",
            zIndex: 10,
            width: "14vw",
            height: "14vw",
            background: "rgba(26,10,12,0.88)",
            border: "1px solid rgba(242,232,213,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "heroReveal 0.55s ease 0.18s both",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(242,232,213,0.45)"
            strokeWidth="1.2"
            width="55%"
            height="55%"
          >
            <circle cx="12" cy="12" r="10" />
            <g
              style={{
                animation: "globeSpin 12s linear infinite",
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              <ellipse cx="12" cy="12" rx="4" ry="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </g>
          </svg>
        </div>

        {/* Dados sticker — DragSticker, editor position */}
        <DragSticker
          rotate={-3}
          idleRotateRange={4}
          style={{
            position: "absolute",
            left: "4.0vw",
            top: "20.2svh",
            width: "60vw",
            zIndex: 22,
          }}
        >
          <Link href="/prueba-tu-suerte" style={{ display: "block" }}>
            <Image
              src="/images/miercoles-dados-sticker.png"
              alt="Miércoles de Dados"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="60vw"
            />
          </Link>
        </DragSticker>

        {/* Label — ↗ Jacket / La Fija */}
        <div
          style={{
            position: "absolute",
            left: "22.1vw",
            top: "52.8svh",
            zIndex: 5,
            animation: "heroReveal 0.55s ease 0.22s both",
          }}
        >
          <div
            style={{
              ...F.display,
              fontSize: "clamp(15px, 4.5vw, 21px)",
              color: C.tinta,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
              <svg width="0.72em" height="0.72em" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <line x1="3" y1="21" x2="21" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="13,3 21,3 21,11" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Jacket
            </div>
            <div style={{ paddingLeft: "calc(0.72em + 0.3em)" }}>La Fija</div>
          </div>
        </div>

        {/* Jacket Club sticker — DragSticker, editor position */}
        <DragSticker
          rotate={-6}
          idleRotateRange={4}
          style={{
            position: "absolute",
            left: "12.3vw",
            top: "60.2svh",
            width: "39vw",
            zIndex: 21,
          }}
        >
          <Link href="/springs-jacket-club" style={{ display: "block" }}>
            <Image
              src="/images/jacket-club-sticker.png"
              alt="SPRINGS Jacket Club"
              width={300}
              height={300}
              priority
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="39vw"
            />
          </Link>
        </DragSticker>

        {/* Subtitle — JACKETS DIFFERENT BY DEFAULT */}
        <div
          style={{
            position: "absolute",
            left: "39.2vw",
            top: "55.4svh",
            zIndex: 5,
            transform: "scale(1.14) rotate(-10.5deg)",
            transformOrigin: "left top",
            animation: "heroReveal 0.55s ease 0.28s both",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-marker), cursive",
              fontSize: "clamp(15px, 4.4vw, 22px)",
              color: C.burgundy,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            JACKETS DIFFERENT BY DEFAULT
          </div>
        </div>

        {/* Underline stroke */}
        <div
          style={{
            position: "absolute",
            left: "64.8vw",
            top: "58.5svh",
            width: "50vw",
            zIndex: 5,
            transform: "scale(1.27) rotate(1.4deg)",
            transformOrigin: "left top",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: 11 }}>
            <Image
              src="/images/underline-stroke.png"
              alt=""
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              sizes="50vw"
            />
          </div>
        </div>

        {/* SensitiveImage */}
        <div
          style={{
            position: "absolute",
            left: "46.9vw",
            top: "62.7svh",
            width: "46vw",
            aspectRatio: "1402 / 1122",
            zIndex: 8,
            transform: "scale(0.71) rotate(-0.9deg)",
            transformOrigin: "left top",
            animation: "heroReveal 0.55s ease 0.4s both",
          }}
        >
          <SensitiveImage src="/images/sensitive-hero.png" fontSize={3.2} opacity={65} />
        </div>

        {/* Marquee tape */}
        <div
          style={{
            position: "absolute",
            left: "1.1vw",
            top: "79.2svh",
            right: 0,
            overflow: "hidden",
            zIndex: 6,
            transform: "scale(1.15) rotate(0.1deg)",
            transformOrigin: "left top",
            borderTop: `1.5px solid ${C.tinta}`,
            borderBottom: `1.5px solid ${C.tinta}`,
            padding: "5px 0",
            background: C.cream,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              animation: "marquee 18s linear infinite",
            }}
          >
            {[0, 1].map((copy) => (
              <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ ...F.display, fontSize: "clamp(13px, 4vw, 20px)", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                    <span style={{ ...F.display, fontSize: "clamp(11px, 3.5vw, 17px)", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                    <span style={{ ...F.display, fontSize: "clamp(13px, 4vw, 20px)", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                    <span style={{ ...F.display, fontSize: "clamp(11px, 3.5vw, 17px)", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ART GALLERY + products strip */}
        <div
          style={{
            position: "absolute",
            left: "55.5vw",
            top: "88.4svh",
            zIndex: 5,
            transform: "scale(2.20) rotate(-0.5deg)",
            transformOrigin: "left top",
            display: "flex",
            alignItems: "flex-end",
            gap: "3vw",
          }}
        >
          <a
            href="/art-gallery"
            style={{
              ...F.display,
              fontSize: "clamp(12px, 3.6vw, 17px)",
              color: C.tinta,
              letterSpacing: "-0.025em",
              textDecoration: "none",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            ART GALLERY
          </a>
          <p
            style={{
              ...F.mono,
              fontSize: "0.38rem",
              color: C.tinta,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.65,
              textAlign: "right",
            }}
          >
            LA FIJA / LA PESADA / LA BRAVA /<br />
            LA SIMPLE / LA HONESTA
          </p>
        </div>

      </section>


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
