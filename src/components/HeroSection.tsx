"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StickerLayer from "@/components/StickerLayer";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const F = {
  display: { fontFamily: "Anton, sans-serif" } as const,
  mono:    { fontFamily: "JetBrains Mono, monospace" } as const,
};

// Layout:
//
//  ┌─────────────────────────────────────┐
//  │ SPRINGS (mix-blend, z:6)            │  ← absolute, top-left
//  │                                     │
//  │  [foto placeholder 62% derecha]     │  ← absolute right:0
//  │                                     │
//  │  ⊕ Barbosa STDR          [stickers] │  ← absolute bottom
//  ├─────────────────────────────────────┤
//  │  ↗ Jacket / La Fija | JACKETS DIF.. │  ← 52px
//  ├─────────────────────────────────────┤
//  │  SPRINGS < SPRINGS < SPRINGS <      │  ← marquee
//  ├─────────────────────────────────────┤
//  │  ART GALLERY              LA FIJA.. │  ← 44px
//  └─────────────────────────────────────┘

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Line reveal: elementos salen desde abajo de su contenedor overflow:hidden
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hlr-wordmark",  { yPercent: 110, duration: 0.9 })
      .from(".hlr-photo",     { opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hlr-location",  { yPercent: 110, duration: 0.5 }, "-=0.4")
      .from(".hlr-strip",     { y: 16, opacity: 0, duration: 0.4 }, "-=0.3")
      .from(".hlr-marquee",   { opacity: 0, duration: 0.3 }, "-=0.1")
      .from(".hlr-gallery",   { opacity: 0, duration: 0.3 }, "-=0.1")
      .from(".sticker-dados", { opacity: 0, scale: 0.4, rotation:  20, duration: 0.6, ease: "back.out(2)" }, "-=0.4")
      .from(".sticker-jc",    { opacity: 0, scale: 0.4, rotation: -15, duration: 0.6, ease: "back.out(2)" }, "-=0.4");
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        position: "relative",
        height: "100svh",
        background: C.cream,
        overflow: "hidden",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* ── ZONA PRINCIPAL flex:1 ──────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>

        {/* SPRINGS — tipografía estructural, cruza foto */}
        <div style={{ position: "absolute", top: "5vh", left: 20, right: 0, zIndex: 6, overflow: "hidden" }}>
          <h1
            className="hlr-wordmark"
            style={{
              margin: 0,
              ...F.display,
              fontSize: "clamp(58px, 24vw, 112px)",
              color: "white",
              mixBlendMode: "difference",
              lineHeight: 0.88,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            SPRINGS
          </h1>
        </div>

        {/* Foto placeholder — columna derecha, sangra al borde */}
        <div
          className="hlr-photo"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "62%",
            background: "rgba(26,10,12,0.07)",
            borderLeft: "1px solid rgba(26,10,12,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{
            ...F.mono,
            fontSize: "clamp(7px, 2vw, 10px)",
            color: "rgba(26,10,12,0.2)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}>
            FOTO · LA FIJA
          </span>
        </div>

        {/* Ubicación — esquina inferior izquierda */}
        <div style={{ position: "absolute", left: 20, bottom: "3vh", zIndex: 5, overflow: "hidden" }}>
          <div
            className="hlr-location"
            style={{
              ...F.mono,
              fontSize: "clamp(8px, 2.4vw, 11px)",
              letterSpacing: "0.15em",
              color: C.tinta,
              lineHeight: 1.8,
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            ⊕ Barbosa STDR · Colombia<br />EST. 2025
          </div>
        </div>

        {/* ── Sticker circular de marca — rota lentamente, NO arrastrable ── */}
        <div
          style={{
            position: "absolute",
            left: "3vw",
            bottom: "2vh",
            width: "clamp(68px, 21vw, 92px)",
            zIndex: 4,
            animation: "stickerSpin 24s linear infinite",
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <circle cx="100" cy="100" r="97" fill="#6B1419" />
            <defs>
              <path
                id="arc-springs"
                d="M 100,100 m -71,0 a 71,71 0 1,1 142,0 a 71,71 0 1,1 -142,0"
                fill="none"
              />
            </defs>
            <text
              fill="#F2E8D5"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "12px", letterSpacing: "5px" }}
            >
              <textPath href="#arc-springs">
                SPRINGS · BARBOSA · EST 2025 · JACKET ·
              </textPath>
            </text>
            <text
              x="100"
              y="108"
              fill="#F2E8D5"
              textAnchor="middle"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "16px", letterSpacing: "2px" }}
            >
              EST 2025
            </text>
          </svg>
        </div>
      </div>

      {/* ── STRIP: label + subtítulo manuscrito ── 52px ─────────── */}
      <div
        className="hlr-strip"
        style={{
          flexShrink: 0,
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          borderTop: "1px solid rgba(26,10,12,0.1)",
          background: C.cream,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ ...F.display, fontSize: "clamp(12px, 4vw, 16px)", color: C.tinta, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            ↗ Jacket
          </div>
          <div style={{ ...F.display, fontSize: "clamp(12px, 4vw, 16px)", color: C.tinta, lineHeight: 1.15, letterSpacing: "-0.01em", paddingLeft: "1.2em" }}>
            La Fija
          </div>
        </div>
        <div style={{ width: 1, height: 26, background: "rgba(26,10,12,0.15)", flexShrink: 0 }} />
        <div style={{
          flex: 1,
          overflow: "hidden",
          fontFamily: "var(--font-marker), cursive",
          fontSize: "clamp(11px, 3.8vw, 16px)",
          color: C.burgundy,
          lineHeight: 1.1,
          textTransform: "uppercase",
          transform: "rotate(-4deg)",
          transformOrigin: "left center",
          whiteSpace: "nowrap",
        }}>
          JACKETS DIFFERENT BY DEFAULT
        </div>
      </div>

      {/* ── MARQUEE ────────────────────────────────────────────── */}
      <div
        className="hlr-marquee"
        style={{
          flexShrink: 0,
          overflow: "hidden",
          borderTop: `1.5px solid ${C.tinta}`,
          borderBottom: `1.5px solid ${C.tinta}`,
          padding: "5px 0",
          background: C.cream,
        }}
      >
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee 18s linear infinite" }}>
          {[0, 1].map((copy) => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: "clamp(10px, 3.8vw, 15px)", color: C.burgundy, letterSpacing: "0.06em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "clamp(8px, 3vw, 12px)", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>&lt;</span>
                  <span style={{ ...F.display, fontSize: "clamp(10px, 3.8vw, 15px)", color: "transparent", WebkitTextStroke: `1px ${C.burgundy}`, letterSpacing: "0.06em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "clamp(8px, 3vw, 12px)", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>&lt;</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── ART GALLERY — 44px mínimo ──────────────────────────── */}
      <div
        className="hlr-gallery"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          minHeight: 44,
          background: C.cream,
        }}
      >
        <Link href="/art-gallery" style={{
          ...F.display,
          fontSize: "clamp(11px, 3.8vw, 16px)",
          color: C.tinta,
          letterSpacing: "-0.02em",
          textDecoration: "none",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          minHeight: 44,
        }}>
          ART GALLERY
        </Link>
        <p style={{
          ...F.mono,
          fontSize: "clamp(6px, 1.8vw, 9px)",
          color: C.tinta,
          lineHeight: 1.4,
          textTransform: "uppercase",
          margin: 0,
          opacity: 0.45,
          textAlign: "right",
        }}>
          LA FIJA / LA PESADA /<br />LA BRAVA / LA SIMPLE
        </p>
      </div>

      {/* ── STICKERS z:500 ─────────────────────────────────────── */}
      <StickerLayer boundsRef={sectionRef}>

        <div
          className="draggable-sticker sticker-dados"
          style={{
            position: "absolute",
            left: "4vw",
            top: "30vh",
            width: "clamp(56px, 20vw, 82px)",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/prueba-tu-suerte" style={{ display: "block" }}>
            <Image src="/images/miercoles-dados-sticker.png" alt="Miércoles de Dados"
              width={300} height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="20vw"
            />
          </Link>
        </div>

        <div
          className="draggable-sticker sticker-jc"
          style={{
            position: "absolute",
            right: "4vw",
            top: "44vh",
            width: "clamp(52px, 18vw, 74px)",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/springs-jacket-club" style={{ display: "block" }}>
            <Image src="/images/jacket-club-sticker.png" alt="SPRINGS Jacket Club"
              width={300} height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="18vw"
            />
          </Link>
        </div>

      </StickerLayer>

    </section>
  );
}
