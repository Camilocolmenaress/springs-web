"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";

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

// Constante de espaciado — se usa en TODAS las secciones
const PAD = 20;

const JACKETS = [
  { name: "LA FIJA",    price: "32,900", sub: "Pollo desmechado",      featured: true  },
  { name: "LA PESADA",  price: "35,900", sub: "Carne desmechada",      featured: false },
  { name: "LA BRAVA",   price: "34,900", sub: "Chorizo santandereano", featured: false },
  { name: "LA SIMPLE",  price: "28,900", sub: "Carne molida",          featured: false },
  { name: "LA HONESTA", price: "28,900", sub: "Sin carne",             featured: false },
];

const MARQUEE_PRODUCTOS =
  "LA FIJA · 32,900 · LA PESADA · 35,900 · LA BRAVA · 34,900 · LA SIMPLE · 28,900 · LA HONESTA · 28,900 · ";

// Placeholder genérico: reemplazar con <Image> cuando haya foto
function FotoPlaceholder({ label, aspectRatio = "3/4", bg = "rgba(26,10,12,0.05)", border = "rgba(26,10,12,0.1)" }: {
  label: string;
  aspectRatio?: string;
  bg?: string;
  border?: string;
}) {
  return (
    <div style={{
      width: "100%",
      aspectRatio,
      background: bg,
      border: `1px solid ${border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <span style={{
        ...F.mono,
        fontSize: "clamp(7px, 2vw, 10px)",
        color: border,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        filter: "opacity(0.6)",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function MobileEditorial() {
  return (
    <div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════ */}
      <HeroSection />


      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — ART GALLERY
          Arquitectura: header tipográfico + carrusel horizontal + CTA
          Fondo cream — contraste con sección 1 (también cream) via borde
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream, borderTop: `2px solid ${C.tinta}`, padding: `48px 0 40px` }}>

        {/* Header */}
        <div style={{ padding: `0 ${PAD}px`, marginBottom: 24 }}>
          <Link href="/art-gallery" style={{ textDecoration: "none" }}>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(40px, 13vw, 64px)",
              color: C.tinta,
              margin: 0,
              letterSpacing: "-0.015em",
              textTransform: "uppercase",
              lineHeight: 0.92,
            }}>
              ART GALLERY
              <span style={{
                display: "inline-block",
                marginLeft: "0.2em",
                color: C.burgundy,
                animation: "cursorBlink 1s step-start infinite",
              }}>|</span>
            </h2>
          </Link>
          <div style={{
            ...F.mono,
            fontSize: "clamp(8px, 2.4vw, 11px)",
            color: C.tinta,
            opacity: 0.4,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 10,
          }}>
            5 JACKETS · DESDE 28,900
          </div>
        </div>

        {/* Carrusel */}
        <div style={{
          display: "flex",
          gap: "4vw",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingLeft: PAD,
          paddingRight: PAD,
        }}>
          {JACKETS.map((p) => (
            <div
              key={p.name}
              style={{ flexShrink: 0, width: "68vw", scrollSnapAlign: "start" }}
            >
              {/* Foto placeholder — proporción 3:4 */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
                <FotoPlaceholder label={`FOTO · ${p.name}`} aspectRatio="3/4" />
                {p.featured && (
                  <div style={{
                    position: "absolute",
                    top: 12,
                    left: 0,
                    background: C.mostaza,
                    padding: "5px 10px",
                    zIndex: 2,
                  }}>
                    <span style={{
                      ...F.mono,
                      fontSize: "clamp(7px, 2vw, 9px)",
                      letterSpacing: "0.2em",
                      color: C.tinta,
                      textTransform: "uppercase",
                    }}>
                      EMPIECE POR ESTA
                    </span>
                  </div>
                )}
              </div>

              {/* Info producto */}
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <div>
                  <div style={{
                    ...F.display,
                    fontSize: "clamp(14px, 5vw, 20px)",
                    letterSpacing: "0.04em",
                    color: C.tinta,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}>
                    {p.name}
                  </div>
                  <div style={{
                    ...F.sans,
                    fontSize: "clamp(10px, 3vw, 13px)",
                    color: C.tinta,
                    opacity: 0.45,
                    marginTop: 4,
                  }}>
                    {p.sub}
                  </div>
                </div>
                <div style={{
                  ...F.mono,
                  fontSize: "clamp(12px, 4vw, 17px)",
                  color: C.tinta,
                  flexShrink: 0,
                }}>
                  {p.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: `28px ${PAD}px 0` }}>
          <Link href="/menu" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...F.display,
            fontSize: "clamp(13px, 4.5vw, 18px)",
            letterSpacing: "0.08em",
            color: C.cream,
            background: C.burgundy,
            padding: `0 ${PAD}px`,
            textDecoration: "none",
            textTransform: "uppercase",
            minHeight: 56,
          }}>
            VER MENÚ COMPLETO
            <span style={{ ...F.mono, fontSize: "clamp(10px, 3vw, 14px)" }}>→</span>
          </Link>
        </div>

      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — CULTURA
          Arquitectura: eyebrow + título grande + foto full-bleed
                        + strip precio/descripción + marquee productos
          Fondo burgundy — rompe con cream de sección 2
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.burgundy, overflow: "hidden" }}>

        {/* Eyebrow + título */}
        <div style={{ padding: `48px ${PAD}px 28px` }}>
          <div style={{
            ...F.mono,
            fontSize: "clamp(9px, 2.8vw, 12px)",
            letterSpacing: "0.22em",
            color: C.mostaza,
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            BUCARAMANGA · BGA
          </div>
          <div style={{
            ...F.display,
            fontSize: "clamp(52px, 17vw, 88px)",
            color: C.cream,
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}>
            THIS<br />IS<br />SPRINGS.
          </div>
        </div>

        {/* Foto placeholder — full-bleed sin márgenes laterales */}
        <div style={{
          height: "54vw",
          background: "rgba(242,232,213,0.05)",
          borderTop: "1px solid rgba(242,232,213,0.12)",
          borderBottom: "1px solid rgba(242,232,213,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            ...F.mono,
            fontSize: "clamp(7px, 2vw, 10px)",
            color: "rgba(242,232,213,0.25)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            FOTO · PRODUCTO EN CONTEXTO
          </span>
        </div>

        {/* Strip: precio ancla + descripción */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: `24px ${PAD}px`,
          gap: 16,
        }}>
          <div>
            <div style={{
              ...F.mono,
              fontSize: "clamp(8px, 2.4vw, 11px)",
              letterSpacing: "0.2em",
              color: C.mostaza,
              textTransform: "uppercase",
              marginBottom: 6,
            }}>
              DESDE
            </div>
            <div style={{
              ...F.display,
              fontSize: "clamp(32px, 11vw, 52px)",
              color: C.cream,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}>
              28,900
            </div>
          </div>
          <div style={{ textAlign: "right", maxWidth: "50%" }}>
            <div style={{
              ...F.sans,
              fontSize: "clamp(10px, 3vw, 13px)",
              color: C.cream,
              opacity: 0.65,
              lineHeight: 1.65,
              fontStyle: "italic",
            }}>
              Dark kitchen.<br />Sin local físico.<br />La papa va a usted.
            </div>
          </div>
        </div>

        {/* Marquee — productos y precios reales */}
        <div style={{
          overflow: "hidden",
          borderTop: "1px solid rgba(242,232,213,0.12)",
          padding: "10px 0",
        }}>
          <div style={{
            display: "flex",
            width: "max-content",
            animation: "marquee 22s linear infinite",
          }}>
            {[0, 1].map((copy) => (
              <span key={copy} style={{
                ...F.mono,
                fontSize: "clamp(9px, 2.8vw, 12px)",
                letterSpacing: "0.2em",
                color: C.cream,
                opacity: 0.5,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                paddingRight: "6vw",
              }}>
                {MARQUEE_PRODUCTOS}
              </span>
            ))}
          </div>
        </div>

      </section>


      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — PEDIR YA
          Arquitectura: foto combo con precio superpuesto
                        + eyebrow + título + CTAs jerarquizados
                        + info strip
          Fondo tinta — contrasta con burgundy de sección 3
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.tinta }}>

        {/* Foto combo + precio superpuesto */}
        <div style={{
          position: "relative",
          height: "44vw",
          background: "rgba(242,232,213,0.04)",
          borderBottom: "1px solid rgba(242,232,213,0.08)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            ...F.mono,
            fontSize: "clamp(7px, 2vw, 10px)",
            color: "rgba(242,232,213,0.18)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            FOTO · COMBO PARA DOS
          </span>

          {/* Precio superpuesto — esquina derecha */}
          <div style={{
            position: "absolute",
            top: "50%",
            right: PAD,
            transform: "translateY(-50%)",
            textAlign: "right",
          }}>
            <div style={{
              ...F.mono,
              fontSize: "clamp(8px, 2.4vw, 11px)",
              letterSpacing: "0.2em",
              color: C.mostaza,
              textTransform: "uppercase",
              marginBottom: 4,
            }}>
              PARA DOS · AHORRA 9,900
            </div>
            <div style={{
              ...F.display,
              fontSize: "clamp(36px, 12vw, 56px)",
              color: C.cream,
              lineHeight: 0.88,
              letterSpacing: "-0.025em",
            }}>
              69,900
            </div>
          </div>
        </div>

        {/* Eyebrow + título */}
        <div style={{ padding: `32px ${PAD}px 0` }}>
          <div style={{
            ...F.mono,
            fontSize: "clamp(9px, 2.8vw, 11px)",
            letterSpacing: "0.22em",
            color: C.mostaza,
            textTransform: "uppercase",
            marginBottom: 12,
          }}>
            ↗ SIN EXCUSAS · ESTO ES SPRINGS
          </div>
          <h2 style={{
            ...F.display,
            fontSize: "clamp(56px, 22vw, 110px)",
            lineHeight: 0.88,
            margin: "0 0 32px",
            letterSpacing: "-0.025em",
            textTransform: "uppercase",
            color: C.cream,
          }}>
            PEDIR<br />YA.
          </h2>
        </div>

        {/* CTAs — PEDIDO DIRECTO primero, cero border-radius */}
        <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Primario — e-commerce propio */}
          <Link href="/menu" style={{
            ...F.display,
            fontSize: "clamp(13px, 4.8vw, 19px)",
            letterSpacing: "0.06em",
            color: C.tinta,
            background: C.cream,
            padding: `0 ${PAD}px`,
            textDecoration: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "uppercase",
            minHeight: 56,
          }}>
            PEDIDO DIRECTO
            <span style={{ ...F.mono, fontSize: "clamp(8px, 2.4vw, 11px)", opacity: 0.55 }}>SIN INTERMEDIARIOS →</span>
          </Link>

          {/* Secundario — Rappi */}
          <a href="#" style={{
            ...F.display,
            fontSize: "clamp(13px, 4.8vw, 19px)",
            letterSpacing: "0.06em",
            color: C.cream,
            background: "transparent",
            border: "1px solid rgba(242,232,213,0.18)",
            padding: `0 ${PAD}px`,
            textDecoration: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "uppercase",
            minHeight: 52,
          }}>
            RAPPI <span>→</span>
          </a>

          {/* Secundario — DiDi Food */}
          <a href="#" style={{
            ...F.display,
            fontSize: "clamp(13px, 4.8vw, 19px)",
            letterSpacing: "0.06em",
            color: C.cream,
            background: "transparent",
            border: "1px solid rgba(242,232,213,0.18)",
            padding: `0 ${PAD}px`,
            textDecoration: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "uppercase",
            minHeight: 52,
          }}>
            DIDI FOOD <span>→</span>
          </a>
        </div>

        {/* Info strip */}
        <div style={{
          padding: `40px ${PAD}px`,
          paddingBottom: "max(40px, env(safe-area-inset-bottom, 40px))",
          display: "flex",
          flexDirection: "column",
        }}>
          {([
            { label: "Horario",           val: "12PM — 9PM",       sub: "Lunes a domingo"                        },
            { label: "Zona",              val: "BUCARAMANGA",       sub: "Cabecera · Cañaveral · Sotomayor"       },
            { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · ahorra 9,900"  },
          ] as const).map((item) => (
            <div key={item.label} style={{ borderTop: "1px solid rgba(242,232,213,0.08)", padding: "14px 0" }}>
              <div style={{
                ...F.mono,
                fontSize: "clamp(7px, 2vw, 10px)",
                letterSpacing: "0.22em",
                color: C.mostaza,
                textTransform: "uppercase",
                marginBottom: 4,
              }}>
                {item.label}
              </div>
              <div style={{
                ...F.display,
                fontSize: "clamp(14px, 5vw, 20px)",
                letterSpacing: "0.04em",
                color: C.cream,
              }}>
                {item.val}
              </div>
              <div style={{
                ...F.sans,
                fontSize: "clamp(10px, 3vw, 13px)",
                color: C.cream,
                opacity: 0.4,
                marginTop: 2,
              }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
