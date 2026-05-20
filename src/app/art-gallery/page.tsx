"use client";

import { useState } from "react";
import Link from "next/link";

const BG  = "#0A0806";
const C = {
  cream:    "#F2E8D5",
  burgundy: "#6B1419",
  mostaza:  "#C5871F",
  dim:      "rgba(242,232,213,0.4)",
  faint:    "rgba(242,232,213,0.12)",
  fainter:  "rgba(242,232,213,0.06)",
};
const F = {
  display: { fontFamily: "Anton, sans-serif" } as const,
  sans:    { fontFamily: "Inter, sans-serif" } as const,
  mono:    { fontFamily: "JetBrains Mono, monospace" } as const,
};

const EXHIBITS = [
  {
    id: "001",
    name: "LA FIJA",
    subtitle: "LOADED JACKET",
    year: "2025",
    img: "/images/la-fija-exhibit.png",
    thumbs: ["/images/la-fija.png", "/images/sensitive-hero.png", "/images/jacket-2.png"],
    ingredients: [
      "POLLO DESMECHADO.",
      "HOGAO ARTESANAL.",
      "QUESO COSTEÑO FUNDIDO.",
      "PAPAS GAJO CRUJIENTES.",
      "FUSE SAUCE.",
    ],
    description:
      "UNA COMBINACIÓN TAN SIMPLE COMO PODEROSA,\nTAN DIRECTA COMO INOLVIDABLE.",
    tagline: "THE ORIGINAL. THE REASON.",
    origin: "BARBOSA, COLOMBIA",
    created: "SPRINGS CREW",
    category: "COMFORT FOOD",
    temp: "68°C",
    quote: "NO ES SOLO COMIDA.\nES UN PLAN.",
    price: "32,900",
  },
  {
    id: "002",
    name: "LA PESADA",
    subtitle: "LOADED JACKET",
    year: "2025",
    img: "/images/la-pesada.png",
    thumbs: ["/images/la-pesada.png", "/images/jacket-2.png", "/images/la-fija.png"],
    ingredients: [
      "CARNE DESMECHADA.",
      "HOGAO ARTESANAL.",
      "QUESO COSTEÑO FUNDIDO.",
      "PAPAS GAJO CRUJIENTES.",
      "FUSE SAUCE.",
    ],
    description:
      "PARA LOS QUE NO SE QUEDAN CON HAMBRE.\nLA VERSIÓN SIN CONCESIONES.",
    tagline: "HEAVY. INTENTIONAL.",
    origin: "BARBOSA, COLOMBIA",
    created: "SPRINGS CREW",
    category: "COMFORT FOOD",
    temp: "68°C",
    quote: "NADA SOBRA.\nNADA FALTA.",
    price: "35,900",
  },
  {
    id: "003",
    name: "LA BRAVA",
    subtitle: "LOADED JACKET",
    year: "2025",
    img: "/images/la-brava.png",
    thumbs: ["/images/la-brava.png", "/images/jacket-2.png", "/images/la-pesada.png"],
    ingredients: [
      "CHORIZO SANTANDEREANO.",
      "HOGAO ARTESANAL.",
      "QUESO COSTEÑO FUNDIDO.",
      "PAPAS GAJO CRUJIENTES.",
      "FUSE SAUCE.",
    ],
    description:
      "EL SABOR QUE AQUÍ NUNCA SE NEGOCIA.\nEL CHORIZO QUE MANDA.",
    tagline: "BORN IN SANTANDER.",
    origin: "BARBOSA, COLOMBIA",
    created: "SPRINGS CREW",
    category: "COMFORT FOOD",
    temp: "70°C",
    quote: "CARÁCTER SIN\nPEDIR PERMISO.",
    price: "34,900",
  },
  {
    id: "004",
    name: "LA SIMPLE",
    subtitle: "LOADED JACKET",
    year: "2025",
    img: "/images/la-simple.png",
    thumbs: ["/images/la-simple.png", "/images/la-fija.png", "/images/la-brava.png"],
    ingredients: [
      "CARNE MOLIDA SAZONADA.",
      "HOGAO ARTESANAL.",
      "QUESO COSTEÑO FUNDIDO.",
      "PAPAS GAJO CRUJIENTES.",
      "FUSE SAUCE.",
    ],
    description:
      "SIN RODEOS, SIN EXCESOS.\nLO ESENCIAL EJECUTADO PERFECTO.",
    tagline: "SIMPLE IS THE STATEMENT.",
    origin: "BARBOSA, COLOMBIA",
    created: "SPRINGS CREW",
    category: "COMFORT FOOD",
    temp: "68°C",
    quote: "LO SIMPLE\nES LO HONESTO.",
    price: "28,900",
  },
  {
    id: "005",
    name: "LA HONESTA",
    subtitle: "LOADED JACKET",
    year: "2025",
    img: "/images/la-honesta.png",
    thumbs: ["/images/la-honesta.png", "/images/la-simple.png", "/images/la-brava.png"],
    ingredients: [
      "QUESO COSTEÑO DOBLE.",
      "HOGAO DOBLE.",
      "AGUACATE.",
      "PAPAS GAJO CRUJIENTES.",
      "FUSE SAUCE.",
    ],
    description:
      "SIN CARNE, CON TODO.\nLA QUE DEMUESTRA QUE NO NECESITAS MÁS.",
    tagline: "HONEST BY DESIGN.",
    origin: "BARBOSA, COLOMBIA",
    created: "SPRINGS CREW",
    category: "COMFORT FOOD",
    temp: "66°C",
    quote: "SIN MENTIRAS.\nSIN CARNE.",
    price: "28,900",
  },
];

const NAV = [
  { label: "MENÚ",        href: "/menu"        },
  { label: "NOSOTROS",    href: "#"             },
  { label: "ART GALLERY", href: "/art-gallery", active: true },
  { label: "EL CLUB",     href: "#"             },
  { label: "DELIVERY",    href: "#"             },
  { label: "CONTACTO",    href: "#"             },
];

export default function ArtGallery() {
  const [idx, setIdx] = useState(0);
  const ex = EXHIBITS[idx];

  return (
    <main style={{ background: BG, minHeight: "100vh", color: C.cream, display: "flex", flexDirection: "column" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 56, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,8,6,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.fainter}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" style={{ ...F.display, fontSize: "1.4rem", letterSpacing: "0.05em", color: C.cream, textDecoration: "none" }}>
            SPRINGS
          </Link>
          <span style={{ color: C.cream, fontSize: "0.75rem" }}>+</span>
          <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.1em", color: C.cream, lineHeight: 1.5, textTransform: "uppercase", opacity: 0.45 }}>
            BRITISH SOUL<br />COLOMBIAN HEART.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href} style={{
              ...F.mono,
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: item.active ? C.cream : C.dim,
              textDecoration: "none",
              borderBottom: item.active ? `1px solid ${C.cream}` : "none",
              paddingBottom: item.active ? 2 : 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/menu" style={{
          ...F.display,
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          background: C.burgundy,
          color: C.cream,
          padding: "11px 22px",
          textDecoration: "none",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          PEDIR AHORA <span style={{ fontSize: "0.85rem" }}>↗</span>
        </Link>
      </nav>

      {/* ── MAIN GRID ────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "168px 1fr 440px",
        marginTop: 56,
        flex: 1,
        height: "calc(100vh - 56px - 48px)",
      }}>

        {/* ── LEFT SIDEBAR ───────────────────────────── */}
        <aside style={{
          borderRight: `1px solid ${C.faint}`,
          padding: "36px 20px 28px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Globe sticker */}
          <div style={{
            width: 52, height: 52, border: `1px solid ${C.faint}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 28,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="1.2" style={{ width: 28, height: 28 }}>
              <circle cx="12" cy="12" r="10" />
              <ellipse cx="12" cy="12" rx="4" ry="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </div>

          {/* Exhibit number */}
          <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.2em", color: C.dim, marginBottom: 4 }}>
            EXHIBIT
          </div>
          <div style={{ ...F.display, fontSize: "4rem", color: C.burgundy, lineHeight: 1, marginBottom: 16 }}>
            {ex.id}
          </div>

          <div style={{ width: 28, height: "1px", background: C.faint, marginBottom: 16 }} />

          <div style={{ marginBottom: 4 }}>
            <div style={{ ...F.mono, fontSize: "0.47rem", letterSpacing: "0.14em", color: C.cream }}>JACKET SERIES</div>
            <div style={{ ...F.mono, fontSize: "0.47rem", letterSpacing: "0.14em", color: C.dim }}>{ex.year}</div>
          </div>

          <div style={{ width: 28, height: "1px", background: C.fainter, margin: "16px 0" }} />

          <div style={{ marginBottom: 6 }}>
            <div style={{ ...F.mono, fontSize: "0.47rem", letterSpacing: "0.12em", color: C.cream }}>BARBOSA</div>
            <div style={{ ...F.mono, fontSize: "0.47rem", letterSpacing: "0.12em", color: C.dim }}>COLOMBIA</div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...F.mono, fontSize: "0.42rem", color: "rgba(242,232,213,0.28)" }}>7.0631° N</div>
            <div style={{ ...F.mono, fontSize: "0.42rem", color: "rgba(242,232,213,0.28)" }}>73.0859° W</div>
          </div>

          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.burgundy, marginBottom: 18 }} />

          {/* Exhibit list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {EXHIBITS.map((e, i) => (
              <button key={e.id} onClick={() => setIdx(i)} style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: 0,
              }}>
                <span style={{ ...F.mono, fontSize: "0.42rem", color: i === idx ? C.burgundy : "rgba(242,232,213,0.25)" }}>
                  {e.id}
                </span>
                <span style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.06em", color: i === idx ? C.cream : "rgba(242,232,213,0.28)" }}>
                  {e.name}
                </span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: "auto", ...F.mono, fontSize: "0.7rem", color: "rgba(242,232,213,0.2)", lineHeight: 1 }}>
            ↓
          </div>
        </aside>

        {/* ── CENTER HERO ────────────────────────────── */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            key={ex.img}
            src={ex.img}
            alt={ex.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "center 25%",
              display: "block",
            }}
          />

          {/* Museum plaque */}
          <div style={{
            position: "absolute", bottom: 72, left: "50%", transform: "translateX(-50%)",
            border: `1px solid rgba(242,232,213,0.28)`,
            padding: "14px 32px",
            textAlign: "center",
            background: "rgba(10,8,6,0.65)",
            backdropFilter: "blur(6px)",
            whiteSpace: "nowrap",
          }}>
            <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.12em", color: C.cream }}>
              {ex.name}
            </div>
            <div style={{ ...F.mono, fontSize: "0.45rem", letterSpacing: "0.22em", color: C.dim, marginTop: 4 }}>
              {ex.subtitle}
            </div>
            <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.15em", color: "rgba(242,232,213,0.3)", marginTop: 2 }}>
              {ex.year}
            </div>
          </div>

          {/* Velvet rope decorative line */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 48,
            background: `linear-gradient(to top, ${BG}, transparent)`,
          }} />
        </div>

        {/* ── RIGHT PANEL ────────────────────────────── */}
        <div style={{
          borderLeft: `1px solid ${C.faint}`,
          display: "grid",
          gridTemplateColumns: "1fr 160px",
          overflow: "hidden",
        }}>

          {/* Info column */}
          <div style={{
            padding: "36px 20px 28px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            borderRight: `1px solid ${C.fainter}`,
          }}>
            <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.22em", color: C.mostaza, marginBottom: 8 }}>
              SPRINGS ART GALLERY
            </div>

            <h1 style={{ ...F.display, fontSize: "clamp(2.8rem, 4.5vw, 4.8rem)", color: C.cream, lineHeight: 0.95, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
              {ex.name}
            </h1>

            <div style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.2em", color: C.mostaza, marginBottom: 14 }}>
              {ex.subtitle} +
            </div>

            <div style={{ height: "1px", background: C.faint, marginBottom: 16, width: "75%" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
              {ex.ingredients.map(ing => (
                <div key={ing} style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.1em", color: C.cream }}>
                  {ing}
                </div>
              ))}
            </div>

            <p style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.07em", color: C.dim, lineHeight: 1.7, margin: "0 0 10px", whiteSpace: "pre-line" }}>
              {ex.description}
            </p>

            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.12em", color: C.burgundy, marginBottom: 18 }}>
              {ex.tagline}
            </div>

            {/* Specs card */}
            <div style={{
              border: `1px solid ${C.faint}`,
              padding: "14px 16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 8px",
              marginBottom: 18,
            }}>
              {[
                { label: "ORIGIN",      val: ex.origin   },
                { label: "CREATED",     val: ex.created  },
                { label: "CATEGORY",    val: ex.category },
                { label: "TEMPERATURE", val: ex.temp     },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ ...F.mono, fontSize: "0.4rem", letterSpacing: "0.14em", color: "rgba(242,232,213,0.3)", marginBottom: 3 }}>
                    {item.label}
                  </div>
                  <div style={{ ...F.mono, fontSize: "0.47rem", letterSpacing: "0.08em", color: C.cream }}>
                    {item.val}
                  </div>
                </div>
              ))}

              {/* Globe icon in card */}
              <div style={{ gridColumn: "2", gridRow: "1 / span 2", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(242,232,213,0.2)" strokeWidth="1" style={{ width: 22, height: 22 }}>
                  <circle cx="12" cy="12" r="10" />
                  <ellipse cx="12" cy="12" rx="4" ry="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
              </div>
            </div>

            {/* Quote + barcode */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <span style={{ ...F.sans, fontSize: "1.6rem", color: C.cream, lineHeight: 0.8, display: "block", marginBottom: 4 }}>"</span>
                <p style={{ ...F.sans, fontSize: "0.6rem", fontWeight: 500, color: C.cream, lineHeight: 1.5, margin: "0 0 6px", whiteSpace: "pre-line" }}>
                  {ex.quote}
                </p>
                <div style={{ ...F.sans, fontSize: "0.52rem", fontStyle: "italic", color: C.dim }}>
                  Springs Crew
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.08em", color: "rgba(242,232,213,0.25)", lineHeight: 1.7 }}>
                  ↯↯<br />SPRINGS<br />ART GALLERY<br />{ex.id}
                </div>
              </div>
            </div>
          </div>

          {/* Photo column */}
          <div style={{ display: "flex", flexDirection: "column", padding: "36px 16px 28px 16px", gap: 6, overflow: "hidden" }}>
            {/* Large top photo */}
            <div style={{ flex: 2, overflow: "hidden" }}>
              <img
                src={ex.thumbs[0]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            {/* Two smaller photos */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ overflow: "hidden" }}>
                <img
                  src={ex.thumbs[1]}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ overflow: "hidden" }}>
                <img
                  src={ex.thumbs[2]}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.faint}`,
        height: 48,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 20 }}>
          {["INSTAGRAM", "TIKTOK", "SPOTIFY"].map(s => (
            <span key={s} style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.1em", color: "rgba(242,232,213,0.28)", cursor: "pointer" }}>
              {s}
            </span>
          ))}
        </div>

        <div style={{ ...F.mono, fontSize: "0.4rem", letterSpacing: "0.1em", color: "rgba(242,232,213,0.18)" }}>
          SPRINGS © 2025 ©
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {[
            { label: "CARTA",       href: "/menu"        },
            { label: "ART GALLERY", href: "/art-gallery", active: true },
            { label: "NOSOTROS",    href: "#"             },
            { label: "EL CLUB",     href: "#"             },
            { label: "FAQS",        href: "#"             },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              ...F.mono,
              fontSize: "0.47rem",
              letterSpacing: "0.1em",
              color: item.active ? C.cream : "rgba(242,232,213,0.32)",
              textDecoration: "none",
              borderBottom: item.active ? `1px solid ${C.cream}` : "none",
              paddingBottom: item.active ? 2 : 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>
            <div style={{ ...F.mono, fontSize: "0.4rem", letterSpacing: "0.1em", color: "rgba(242,232,213,0.35)" }}>SPRINGS RADIO</div>
            <div style={{ ...F.mono, fontSize: "0.52rem", color: C.cream }}>103.7 FM</div>
          </div>
          <div style={{
            width: 26, height: 26,
            border: `1px solid rgba(242,232,213,0.28)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <span style={{ color: C.cream, fontSize: "0.55rem", paddingLeft: 2 }}>▶</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
