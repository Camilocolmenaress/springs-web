"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StickerLayer from "@/components/StickerLayer";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" } as const,
  sans:    { fontFamily: "Inter, sans-serif" } as const,
  mono:    { fontFamily: "JetBrains Mono, monospace" } as const,
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".hero-wordmark",    { opacity: 0, y: 30,  duration: 0.6, ease: "back.out(1.7)" })
      .from(".hero-potato",      { opacity: 0, scale: 0.95, duration: 0.5 }, "-=0.3")
      .from(".hero-location",    { opacity: 0, y: 15,  duration: 0.4 }, "-=0.2")
      .from(".hero-label",       { opacity: 0, x: -20, duration: 0.4 }, "-=0.2")
      .from(".hero-subtitle",    { opacity: 0, y: 15, rotation: -12, duration: 0.5, ease: "back.out(1.4)" }, "-=0.1")
      .from(".hero-underline",   { opacity: 0, scaleX: 0, duration: 0.3 }, "-=0.1")
      .from(".hero-marquee",     { opacity: 0, y: 10,  duration: 0.3 }, "-=0.05")
      .from(".hero-gallery-strip",{ opacity: 0, y: 10, duration: 0.3 }, "-=0.05")
      .from(".sticker-dados",    { opacity: 0, scale: 0.5, rotation:  15, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
      .from(".sticker-jc",       { opacity: 0, scale: 0.5, rotation: -10, duration: 0.5, ease: "back.out(2)" }, "-=0.3");
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
      }}
    >

      {/* ── ZONA 1: Imagen + wordmark (0–58vh) ─────────────────────── */}

      {/* Papa — ancho en vw para no depender del alto del dispositivo */}
      <div
        className="hero-potato"
        style={{
          position: "absolute",
          right: "-2vw",
          top: "2vh",
          width: "60vw",
          height: "58vh",
          zIndex: 4,
        }}
      >
        <Image
          src="/images/la-fija.png"
          alt="La Fija — Springs Jacket"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="60vw"
        />
      </div>

      {/* SPRINGS wordmark — mix-blend-mode cruza la papa */}
      <h1
        className="hero-wordmark"
        style={{
          position: "absolute",
          left: "3vw",
          top: "5vh",
          zIndex: 3,
          ...F.display,
          fontSize: "16vw",
          color: "white",
          mixBlendMode: "difference",
          lineHeight: 0.88,
          letterSpacing: "-0.01em",
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        SPRINGS
      </h1>

      {/* ── ZONA 2: Metadata izquierda (20–50vh) ────────────────────── */}

      {/* Ubicación */}
      <div
        className="hero-location"
        style={{
          position: "absolute",
          left: "3vw",
          top: "20vh",
          zIndex: 5,
        }}
      >
        <div style={{
          ...F.mono,
          fontSize: "2.8vw",
          letterSpacing: "0.14em",
          color: C.tinta,
          lineHeight: 1.7,
          textTransform: "uppercase",
          opacity: 0.65,
        }}>
          ⊕ Barbosa STDR – Colombia<br />EST. 2025
        </div>
      </div>

      {/* ── ZONA 3: Label + stickers + subtítulo (58–80vh) ──────────── */}

      {/* Label producto */}
      <div
        className="hero-label"
        style={{
          position: "absolute",
          left: "3vw",
          top: "60vh",
          zIndex: 5,
        }}
      >
        <div style={{
          ...F.display,
          fontSize: "4.5vw",
          color: C.tinta,
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
            <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <line x1="3" y1="21" x2="21" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" />
              <polyline points="13,3 21,3 21,11" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Jacket
          </div>
          <div style={{ paddingLeft: "calc(0.8em + 0.3em)" }}>La Fija</div>
        </div>
      </div>

      {/* Subtítulo manuscrito — lado derecho */}
      <div
        className="hero-subtitle"
        style={{
          position: "absolute",
          left: "26vw",
          top: "64vh",
          width: "65vw",
          zIndex: 5,
          transform: "rotate(-8deg)",
          transformOrigin: "left center",
        }}
      >
        <div style={{
          fontFamily: "var(--font-marker), cursive",
          fontSize: "4.8vw",
          color: C.burgundy,
          lineHeight: 1.25,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}>
          JACKETS DIFFERENT BY DEFAULT
        </div>
      </div>

      {/* Trazo underline */}
      <div
        className="hero-underline"
        style={{
          position: "absolute",
          left: "36vw",
          top: "73vh",
          width: "40vw",
          zIndex: 5,
          transform: "rotate(-2deg)",
          transformOrigin: "left center",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "2vw" }}>
          <Image
            src="/images/underline-stroke.png"
            alt=""
            fill
            style={{ objectFit: "contain", objectPosition: "left center" }}
            sizes="40vw"
          />
        </div>
      </div>

      {/* ── ZONA 4: Marquee + footer (80–100vh) ─────────────────────── */}

      {/* Marquee tape */}
      <div
        className="hero-marquee"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "82vh",
          overflow: "hidden",
          zIndex: 6,
          borderTop:    `1.5px solid ${C.tinta}`,
          borderBottom: `1.5px solid ${C.tinta}`,
          padding: "5px 0",
          background: C.cream,
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          animation: "marquee 18s linear infinite",
        }}>
          {[0, 1].map((copy) => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ ...F.display, fontSize: "4vw", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "3.2vw", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                  <span style={{ ...F.display, fontSize: "4vw", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "3.2vw", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ART GALLERY strip */}
      <div
        className="hero-gallery-strip"
        style={{
          position: "absolute",
          left: "3vw",
          right: "3vw",
          top: "90vh",
          zIndex: 5,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2vw",
        }}
      >
        <Link
          href="/art-gallery"
          style={{
            ...F.display,
            fontSize: "4vw",
            color: C.tinta,
            letterSpacing: "-0.025em",
            textDecoration: "none",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ART GALLERY
        </Link>
        <p style={{
          ...F.mono,
          fontSize: "2vw",
          color: C.tinta,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          textTransform: "uppercase",
          margin: 0,
          opacity: 0.65,
          textAlign: "right",
        }}>
          LA FIJA / LA PESADA / LA BRAVA /<br />
          LA SIMPLE / LA HONESTA
        </p>
      </div>

      {/* ── STICKER LAYER (z-500, sobre todo) ───────────────────────── */}
      <StickerLayer boundsRef={sectionRef}>

        {/* Dados — zona media izquierda, sobre la papa */}
        <div
          className="draggable-sticker sticker-dados"
          style={{
            position: "absolute",
            left: "3vw",
            top: "32vh",
            width: "26vw",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/prueba-tu-suerte" style={{ display: "block" }}>
            <Image
              src="/images/miercoles-dados-sticker.png"
              alt="Miércoles de Dados"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="26vw"
            />
          </Link>
        </div>

        {/* JC — zona baja izquierda, junto al label */}
        <div
          className="draggable-sticker sticker-jc"
          style={{
            position: "absolute",
            left: "3vw",
            top: "68vh",
            width: "22vw",
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Link href="/springs-jacket-club" style={{ display: "block" }}>
            <Image
              src="/images/jacket-club-sticker.png"
              alt="SPRINGS Jacket Club"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              sizes="22vw"
            />
          </Link>
        </div>

      </StickerLayer>

    </section>
  );
}
