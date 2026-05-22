"use client";

import Image from "next/image";
import Link from "next/link";

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

        {/* La Fija — covers right side, bottom-anchored */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "-4vw",
            width: "76vw",
            height: "72vh",
            zIndex: 2,
          }}
        >
          <Image
            src="/images/la-fija.png"
            alt="La Fija — Springs Jacket"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="76vw"
          />
        </div>

        {/* SPRINGS title */}
        <div
          style={{
            position: "absolute",
            top: "max(18vh, calc(env(safe-area-inset-top, 0px) + 64px))",
            left: "5vw",
            zIndex: 3,
          }}
        >
          <h1
            style={{
              fontFamily: "Anton, sans-serif",
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
            left: "5vw",
            top: "36vh",
            zIndex: 5,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.85rem",
              color: C.tinta,
              opacity: 0.55,
              lineHeight: 1,
            }}
          >
            ⊕
          </span>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              color: C.tinta,
              lineHeight: 1.6,
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            Barbosa STDR – COLOMBIA<br />EST. 2025
          </div>
        </div>

        {/* Globe sticker — wireframe SVG, CSS spin */}
        <div
          style={{
            position: "absolute",
            left: "5vw",
            top: "46vh",
            zIndex: 10,
            width: "16vw",
            height: "16vw",
            background: "rgba(26,10,12,0.88)",
            border: "1px solid rgba(242,232,213,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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

        {/* Jacket Club sticker — PNG image, top-right */}
        <div
          style={{
            position: "absolute",
            top: "max(64px, calc(env(safe-area-inset-top, 0px) + 62px))",
            right: "2vw",
            width: "30vw",
            aspectRatio: "1 / 1",
            zIndex: 21,
          }}
        >
          <Image
            src="/images/jacket-club-sticker.png"
            alt="SPRINGS Jacket Club"
            fill
            priority
            style={{ objectFit: "contain" }}
            sizes="30vw"
          />
        </div>

        {/* Subtitle — Caveat Brush, burgundy, rotated */}
        <div
          style={{
            position: "absolute",
            left: "5vw",
            bottom: "34vh",
            zIndex: 5,
            transform: "rotate(-2deg)",
            transformOrigin: "left center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-marker), cursive",
              fontSize: "clamp(18px, 5vw, 26px)",
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
            left: "5vw",
            bottom: "28vh",
            width: "44vw",
            zIndex: 5,
            transform: "rotate(-2.5deg)",
            transformOrigin: "left center",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: 14 }}>
            <Image
              src="/images/underline-stroke.png"
              alt=""
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              sizes="44vw"
            />
          </div>
        </div>

        {/* Body copy — ↗ Jacket / La Fija */}
        <div
          style={{
            position: "absolute",
            left: "5vw",
            bottom: "20vh",
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(18px, 5.5vw, 26px)",
              color: C.tinta,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
              <svg
                width="0.7em"
                height="0.7em"
                viewBox="0 0 24 24"
                fill="none"
                style={{ flexShrink: 0, marginBottom: "0.1em" }}
              >
                <line x1="21" y1="21" x2="3" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="3,11 3,3 11,3" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Jacket
            </div>
            <div style={{ paddingLeft: "calc(0.7em + 0.3em)" }}>La Fija</div>
          </div>
        </div>

        {/* Miércoles Dados sticker — PNG image, bottom-right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: "16vh",
            width: "32vw",
            aspectRatio: "1 / 1",
            zIndex: 22,
            clipPath: "inset(12% 22%)",
            transform: "rotate(-12deg)",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src="/images/miercoles-dados-sticker.png"
              alt="Miércoles de Dados"
              fill
              style={{ objectFit: "contain" }}
              sizes="32vw"
            />
          </div>
        </div>

        {/* Marquee tape — SPRINGS < SPRINGS < */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "10vh",
            overflow: "hidden",
            zIndex: 6,
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
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(14px, 4.5vw, 22px)", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(12px, 3.8vw, 18px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>{"<"}</span>
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(14px, 4.5vw, 22px)", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: "clamp(12px, 3.8vw, 18px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>{"<"}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ART GALLERY link + Menu list — bottom strip */}
        <div
          style={{
            position: "absolute",
            left: "5vw",
            right: "5vw",
            bottom: "3vh",
            zIndex: 5,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "3vw",
          }}
        >
          <a
            href="/art-gallery"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(13px, 3.8vw, 18px)",
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
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.4rem",
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


      {/* ══ SECTION 2 — PRODUCTOS ══ */}
      <section style={{ background: C.cream, padding: "48px 0 40px" }}>

        <div style={{ padding: "0 5vw", marginBottom: 24 }}>
          <h2 style={{
            ...F.display,
            fontSize: "clamp(40px, 13vw, 64px)",
            color: C.tinta,
            margin: 0,
            letterSpacing: "-0.005em",
            textTransform: "uppercase",
          }}>
            LA CARTA
          </h2>
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
