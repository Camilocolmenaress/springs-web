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

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".hero-wordmark",      { opacity: 0, y: -16, duration: 0.6 })
      .from(".hero-potato",        { opacity: 0, scale: 1.04, duration: 0.6 }, "-=0.3")
      .from(".hero-location",      { opacity: 0, y: 10,  duration: 0.4 }, "-=0.2")
      .from(".hero-editorial",     { opacity: 0, y: 16,  duration: 0.5 }, "-=0.2")
      .from(".hero-marquee",       { opacity: 0, duration: 0.3 }, "-=0.1")
      .from(".hero-gallery-strip", { opacity: 0, duration: 0.3 }, "-=0.05")
      .from(".sticker-dados",      { opacity: 0, scale: 0.5, rotation:  15, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
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

      {/* ═══════════════════════════════════════════════════════════
          WORDMARK — z:6 sobre la papa, mix-blend-mode:difference
          El wordmark está encima de todo y se "mezcla" con lo que
          hay debajo: aparece oscuro sobre cream, se invierte sobre
          la imagen de la papa (efecto editorial).
      ═══════════════════════════════════════════════════════════ */}
      <h1
        className="hero-wordmark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 6,
          margin: 0,
          padding: "3.5vh 4vw 0",
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

      {/* ═══════════════════════════════════════════════════════════
          BLOQUE IMAGEN — flex row, 54vh de alto
          Columna izquierda (38%): metadata
          Columna derecha (62%): papa, ocupa todo el bloque
      ═══════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", height: "54vh", flexShrink: 0 }}>

        {/* Columna metadata — alineada al fondo */}
        <div
          style={{
            flex: "0 0 38%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 0 3vh 4vw",
          }}
        >
          <div
            className="hero-location"
            style={{
              ...F.mono,
              fontSize: "clamp(9px, 2.8vw, 12px)",
              letterSpacing: "0.14em",
              color: C.tinta,
              lineHeight: 1.8,
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            ⊕ Barbosa<br />STDR · CO<br />EST. 2025
          </div>
        </div>

        {/* Papa — fill de su columna */}
        <div
          className="hero-potato"
          style={{ flex: "0 0 62%", position: "relative", overflow: "hidden" }}
        >
          <Image
            src="/images/la-fija.png"
            alt="La Fija — Springs Jacket"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "50% 25%" }}
            sizes="62vw"
          />
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          BLOQUE EDITORIAL — ocupa el espacio restante
          Label producto | línea | subtítulo manuscrito
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="hero-editorial"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 4vw",
          gap: "3vw",
          borderTop: `1px solid rgba(26,10,12,0.12)`,
          overflow: "hidden",
        }}
      >
        {/* Label */}
        <div style={{
          flexShrink: 0,
          ...F.display,
          fontSize: "clamp(14px, 5vw, 22px)",
          color: C.tinta,
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          ↗ Jacket<br />
          <span style={{ paddingLeft: "1.05em" }}>La Fija</span>
        </div>

        {/* Separador */}
        <div style={{
          width: 1,
          height: "38%",
          background: `rgba(26,10,12,0.18)`,
          flexShrink: 0,
        }} />

        {/* Subtítulo manuscrito */}
        <div style={{
          flex: 1,
          fontFamily: "var(--font-marker), cursive",
          fontSize: "clamp(13px, 4.5vw, 20px)",
          color: C.burgundy,
          lineHeight: 1.3,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          transform: "rotate(-5deg)",
          transformOrigin: "left center",
        }}>
          JACKETS<br />DIFFERENT<br />BY DEFAULT
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE — borde superior e inferior tipo cinta
      ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
          ART GALLERY — fila inferior, touch target 44px
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="hero-gallery-strip"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4vw",
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

      {/* ═══════════════════════════════════════════════════════════
          STICKER LAYER — z:500, arrastrables
          Dados: columna izquierda, zona media de la imagen
          JC: columna derecha, zona inferior de la imagen
      ═══════════════════════════════════════════════════════════ */}
      <StickerLayer boundsRef={sectionRef}>

        <div
          className="draggable-sticker sticker-dados"
          style={{
            position: "absolute",
            left: "3vw",
            top: "28vh",
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
            top: "38vh",
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
