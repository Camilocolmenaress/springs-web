"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StickerLayer from "@/components/StickerLayer";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C" };
const F = {
  display: { fontFamily: "Anton, sans-serif" } as const,
  mono:    { fontFamily: "JetBrains Mono, monospace" } as const,
};

// ─── Layout:
//
//  ┌────────────────────────────────┐
//  │  SPRINGS (mix-blend-mode)      │  ← z:6, absolute dentro de .photo
//  │                                │
//  │     foto pa­pa  (fill)          │  ← flex:1, toma todo el espacio
//  │                                │
//  │  ⊕ Barbosa STDR  [stickers]    │  ← absolute dentro de .photo
//  ├────────────────────────────────┤
//  │  ↗ Jacket · La Fija  |subtitle │  ← 52px fijo
//  ├────────────────────────────────┤
//  │  SPRINGS < SPRINGS < SPRINGS   │  ← marquee, auto
//  ├────────────────────────────────┤
//  │  ART GALLERY        LA FIJA.. │  ← 44px fijo
//  └────────────────────────────────┘

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".hero-wordmark",      { opacity: 0, y: -12, duration: 0.6 })
      .from(".hero-photo",         { opacity: 0, scale: 1.03, duration: 0.7 }, "-=0.4")
      .from(".hero-location",      { opacity: 0, y: 8, duration: 0.4 }, "-=0.2")
      .from(".hero-strip",         { opacity: 0, y: 10, duration: 0.4 }, "-=0.2")
      .from(".hero-marquee",       { opacity: 0, duration: 0.3 }, "-=0.1")
      .from(".hero-gallery-strip", { opacity: 0, duration: 0.3 }, "-=0.05")
      .from(".sticker-dados",      { opacity: 0, scale: 0.5, rotation:  15, duration: 0.5, ease: "back.out(2)" }, "-=0.3")
      .from(".sticker-jc",         { opacity: 0, scale: 0.5, rotation: -10, duration: 0.5, ease: "back.out(2)" }, "-=0.3");
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        position: "relative",
        height: "100vh",
        background: C.cream,
        overflow: "hidden",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* ══════════════════════════════════════════════════════════
          ZONA FOTO — flex:1 (ocupa todo lo que sobra)
          La imagen llena el contenedor.
          SPRINGS y el texto de ubicación flotan encima.
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hero-photo"
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Imagen */}
        <Image
          src="/images/la-fija.png"
          alt="La Fija — Springs Jacket"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
          sizes="100vw"
        />

        {/* SPRINGS — encima de la foto (z:6), mix-blend-mode:difference */}
        <h1
          className="hero-wordmark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            margin: 0,
            padding: "14px 16px 0",
            zIndex: 6,
            ...F.display,
            fontSize: "clamp(44px, 18vw, 88px)",
            color: "white",
            mixBlendMode: "difference",
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          SPRINGS
        </h1>

        {/* Ubicación — esquina inferior izquierda de la foto */}
        <div
          className="hero-location"
          style={{
            position: "absolute",
            bottom: 14,
            left: 16,
            zIndex: 5,
            ...F.mono,
            fontSize: "clamp(9px, 2.8vw, 12px)",
            letterSpacing: "0.14em",
            color: C.cream,
            lineHeight: 1.75,
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          ⊕ Barbosa STDR · Colombia<br />EST. 2025
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STRIP EDITORIAL — 52px fijo
          Label producto a la izquierda, subtítulo a la derecha.
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hero-strip"
        style={{
          flexShrink: 0,
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          borderTop: `1px solid rgba(26,10,12,0.12)`,
        }}
      >
        {/* Label */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{
            ...F.display,
            fontSize: "clamp(13px, 4.5vw, 18px)",
            color: C.tinta,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}>
            ↗ Jacket
          </div>
          <div style={{
            ...F.display,
            fontSize: "clamp(13px, 4.5vw, 18px)",
            color: C.tinta,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            paddingLeft: "1.2em",
          }}>
            La Fija
          </div>
        </div>

        {/* Separador */}
        <div style={{
          width: 1,
          height: 28,
          background: "rgba(26,10,12,0.15)",
          flexShrink: 0,
        }} />

        {/* Subtítulo manuscrito */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          fontFamily: "var(--font-marker), cursive",
          fontSize: "clamp(12px, 4vw, 17px)",
          color: C.burgundy,
          lineHeight: 1.1,
          textTransform: "uppercase",
          transform: "rotate(-4deg)",
          transformOrigin: "left center",
        }}>
          JACKETS DIFFERENT BY DEFAULT
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MARQUEE — cinta corrida
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hero-marquee"
        style={{
          flexShrink: 0,
          overflow: "hidden",
          borderTop:    `1.5px solid ${C.tinta}`,
          borderBottom: `1.5px solid ${C.tinta}`,
          padding: "6px 0",
          background: C.cream,
        }}
      >
        <div style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 18s linear infinite",
        }}>
          {[0, 1].map((copy) => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: "clamp(11px, 4vw, 16px)", color: C.burgundy, letterSpacing: "0.06em", lineHeight: 1 }}>
                    SPRINGS
                  </span>
                  <span style={{ fontSize: "clamp(9px, 3vw, 13px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>
                    &lt;
                  </span>
                  <span style={{ ...F.display, fontSize: "clamp(11px, 4vw, 16px)", color: "transparent", WebkitTextStroke: `1px ${C.burgundy}`, letterSpacing: "0.06em", lineHeight: 1 }}>
                    SPRINGS
                  </span>
                  <span style={{ fontSize: "clamp(9px, 3vw, 13px)", color: C.burgundy, margin: "0 0.6em", lineHeight: 1 }}>
                    &lt;
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ART GALLERY — 44px mínimo, touch target correcto
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hero-gallery-strip"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          minHeight: 44,
        }}
      >
        <Link
          href="/art-gallery"
          style={{
            ...F.display,
            fontSize: "clamp(12px, 4vw, 18px)",
            color: C.tinta,
            letterSpacing: "-0.02em",
            textDecoration: "none",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            minHeight: 44,
          }}
        >
          ART GALLERY
        </Link>
        <p style={{
          ...F.mono,
          fontSize: "clamp(7px, 2vw, 10px)",
          color: C.tinta,
          lineHeight: 1.4,
          textTransform: "uppercase",
          margin: 0,
          opacity: 0.55,
          textAlign: "right",
        }}>
          LA FIJA / LA PESADA /<br />LA BRAVA / LA SIMPLE
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STICKER LAYER — z:500, arrastrables
          Posiciones relativas a la sección (= zona foto aprox).
          Dados: izquierda media · JC: derecha media-baja
      ══════════════════════════════════════════════════════════ */}
      <StickerLayer boundsRef={sectionRef}>

        <div
          className="draggable-sticker sticker-dados"
          style={{
            position: "absolute",
            left: "4vw",
            top: "32vh",
            width: "clamp(60px, 22vw, 90px)",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/prueba-tu-suerte" style={{ display: "block" }}>
            <Image
              src="/images/miercoles-dados-sticker.png"
              alt="Miércoles de Dados"
              width={300} height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="22vw"
            />
          </Link>
        </div>

        <div
          className="draggable-sticker sticker-jc"
          style={{
            position: "absolute",
            right: "4vw",
            top: "48vh",
            width: "clamp(55px, 20vw, 82px)",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/springs-jacket-club" style={{ display: "block" }}>
            <Image
              src="/images/jacket-club-sticker.png"
              alt="SPRINGS Jacket Club"
              width={300} height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="20vw"
            />
          </Link>
        </div>

      </StickerLayer>

    </section>
  );
}
