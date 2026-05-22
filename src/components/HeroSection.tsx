"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StickerLayer from "@/components/StickerLayer";
import SensitiveImage from "@/components/SensitiveImage";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" } as const,
  sans: { fontFamily: "Inter, sans-serif" } as const,
  mono: { fontFamily: "JetBrains Mono, monospace" } as const,
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".hero-wordmark", { opacity: 0, y: 30, duration: 0.6, ease: "back.out(1.7)" })
      .from(".hero-potato", { opacity: 0, scale: 0.95, duration: 0.5 }, "-=0.3")
      .from(".hero-location", { opacity: 0, y: 15, duration: 0.4 }, "-=0.2")
      .from(".hero-globe", { opacity: 0, scale: 0.8, duration: 0.4 }, "-=0.15")
      .from(".hero-label", { opacity: 0, x: -20, duration: 0.4 }, "-=0.1")
      .from(".hero-subtitle", { opacity: 0, y: 15, rotation: -12, duration: 0.5, ease: "back.out(1.4)" }, "-=0.1")
      .from(".hero-underline", { opacity: 0, scaleX: 0, duration: 0.3 }, "-=0.1")
      .from(".hero-sensitive", { opacity: 0, scale: 0.9, duration: 0.4 }, "-=0.1")
      .from(".hero-marquee", { opacity: 0, y: 10, duration: 0.3 }, "-=0.05")
      .from(".hero-gallery-strip", { opacity: 0, y: 10, duration: 0.3 }, "-=0.05")
      .from(".sticker-dados", { opacity: 0, scale: 0.5, rotation: 15, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
      .from(".sticker-jc", { opacity: 0, scale: 0.5, rotation: -10, duration: 0.5, ease: "back.out(2)" }, "-=0.3");

    // Globe spin (continuous)
    gsap.to(".hero-globe-inner", {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
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

      {/* ── SPRINGS wordmark ── */}
      <h1
        className="hero-wordmark"
        style={{
          position: "absolute",
          left: "2vh",
          top: "8vh",
          zIndex: 3,
          ...F.display,
          fontSize: "min(11vh, 16vw)",
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

      {/* ── Papa (La Fija) ── */}
      <div
        className="hero-potato"
        style={{
          position: "absolute",
          right: "-2vh",
          top: 0,
          width: "min(45vh, 68vw)",
          height: "55vh",
          zIndex: 4,
        }}
      >
        <Image
          src="/images/la-fija.png"
          alt="La Fija — Springs Jacket"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="(max-width: 768px) 60vw, 45vh"
        />
      </div>

      {/* ── Location ── */}
      <div
        className="hero-location"
        style={{
          position: "absolute",
          left: "2vh",
          top: "20vh",
          zIndex: 5,
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        <span style={{ ...F.mono, fontSize: "0.78rem", color: C.tinta, opacity: 0.5, lineHeight: 1 }}>
          ⊕
        </span>
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

      {/* ── Globe ── */}
      <div
        className="hero-globe"
        style={{
          position: "absolute",
          left: "2vh",
          top: "28vh",
          zIndex: 5,
          width: "7vh",
          height: "7vh",
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
          <g className="hero-globe-inner" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </g>
        </svg>
      </div>

      {/* ── Label ── */}
      <div
        className="hero-label"
        style={{
          position: "absolute",
          left: "2vh",
          top: "56vh",
          zIndex: 5,
        }}
      >
        <div
          style={{
            ...F.display,
            fontSize: "2.2vh",
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

      {/* ── Subtitle ── */}
      <div
        className="hero-subtitle"
        style={{
          position: "absolute",
          left: "28vw",
          top: "63vh",
          zIndex: 5,
          transform: "rotate(-8deg)",
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-marker), cursive",
            fontSize: "2.4vh",
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

      {/* ── Underline stroke ── */}
      <div
        className="hero-underline"
        style={{
          position: "absolute",
          left: "40vw",
          top: "70vh",
          width: "min(25vh, 38vw)",
          zIndex: 5,
          transform: "rotate(-2deg)",
          transformOrigin: "left center",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "1.4vh" }}>
          <Image
            src="/images/underline-stroke.png"
            alt=""
            fill
            style={{ objectFit: "contain", objectPosition: "left center" }}
            sizes="25vh"
          />
        </div>
      </div>

      {/* ── SensitiveImage ── */}
      <div
        className="hero-sensitive"
        style={{
          position: "absolute",
          left: "38vw",
          top: "66vh",
          width: "min(22vh, 36vw)",
          aspectRatio: "1402 / 1122",
          zIndex: 8,
        }}
      >
        <SensitiveImage src="/images/sensitive-hero.png" fontSize={3.2} opacity={65} />
      </div>

      {/* ── Marquee tape ── */}
      <div
        className="hero-marquee"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "80vh",
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
                  <span style={{ ...F.display, fontSize: "2.2vh", color: C.burgundy, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "1.8vh", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                  <span style={{ ...F.display, fontSize: "2.2vh", color: "transparent", WebkitTextStroke: `1.5px ${C.burgundy}`, letterSpacing: "0.04em", lineHeight: 1 }}>SPRINGS</span>
                  <span style={{ ...F.display, fontSize: "1.8vh", color: C.burgundy, margin: "0 0.5em", lineHeight: 1 }}>{"<"}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── ART GALLERY strip ── */}
      <div
        className="hero-gallery-strip"
        style={{
          position: "absolute",
          left: "2vh",
          right: "2vh",
          top: "88vh",
          zIndex: 5,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2vh",
        }}
      >
        <Link
          href="/art-gallery"
          style={{
            ...F.display,
            fontSize: "1.8vh",
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
        <p
          style={{
            ...F.mono,
            fontSize: "0.9vh",
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

      {/* ── STICKER LAYER ── */}
      <StickerLayer boundsRef={sectionRef}>

        {/* Dados sticker */}
        <div
          className="draggable-sticker sticker-dados"
          style={{
            position: "absolute",
            left: "1vh",
            top: "35vh",
            width: "min(18vh, 28vw)",
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
              sizes="18vh"
            />
          </Link>
        </div>

        {/* JC sticker */}
        <div
          className="draggable-sticker sticker-jc"
          style={{
            position: "absolute",
            left: "2vh",
            top: "64vh",
            width: "min(16vh, 26vw)",
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
              sizes="16vh"
            />
          </Link>
        </div>

      </StickerLayer>

    </section>
  );
}
