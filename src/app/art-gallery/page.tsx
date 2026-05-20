"use client";

import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import Link from "next/link";

const BG = "#0A0806";
const C = {
  cream:   "#F2E8D5",
  burgundy:"#6B1419",
  mostaza: "#C5871F",
  dim:     "rgba(242,232,213,0.4)",
  faint:   "rgba(242,232,213,0.1)",
  fainter: "rgba(242,232,213,0.06)",
};
const F = {
  display: { fontFamily: "Anton, sans-serif" }    as const,
  sans:    { fontFamily: "Inter, sans-serif" }     as const,
  mono:    { fontFamily: "JetBrains Mono, monospace" } as const,
};

const SIDEBAR_W = 168;
const NAV_H     = 52;
const FOOTER_H  = 46;

const EXHIBITS = [
  {
    id: "001", name: "LA FIJA",    subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    ingredients: ["POLLO DESMECHADO.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "UNA COMBINACIÓN TAN SIMPLE COMO PODEROSA,\nTAN DIRECTA COMO INOLVIDABLE.",
    tagline: "THE ORIGINAL. THE REASON.",
    origin: "BARBOSA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "68°C",
    quote: "NO ES SOLO COMIDA.\nES UN PLAN.",
    price: "32,900",
  },
  {
    id: "002", name: "LA PESADA",  subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    ingredients: ["CARNE DESMECHADA.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "PARA LOS QUE NO SE QUEDAN CON HAMBRE.\nLA VERSIÓN SIN CONCESIONES.",
    tagline: "HEAVY. INTENTIONAL.",
    origin: "BARBOSA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "68°C",
    quote: "NADA SOBRA.\nNADA FALTA.",
    price: "35,900",
  },
  {
    id: "003", name: "LA BRAVA",   subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    ingredients: ["CHORIZO SANTANDEREANO.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "EL SABOR QUE AQUÍ NUNCA SE NEGOCIA.\nEL CHORIZO QUE MANDA.",
    tagline: "BORN IN SANTANDER.",
    origin: "BARBOSA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "70°C",
    quote: "CARÁCTER SIN\nPEDIR PERMISO.",
    price: "34,900",
  },
  {
    id: "004", name: "LA SIMPLE",  subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    ingredients: ["CARNE MOLIDA SAZONADA.", "HOGAO ARTESANAL.", "QUESO COSTEÑO FUNDIDO.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "SIN RODEOS, SIN EXCESOS.\nLO ESENCIAL EJECUTADO PERFECTO.",
    tagline: "SIMPLE IS THE STATEMENT.",
    origin: "BARBOSA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "68°C",
    quote: "LO SIMPLE\nES LO HONESTO.",
    price: "28,900",
  },
  {
    id: "005", name: "LA HONESTA", subtitle: "LOADED JACKET", year: "2025",
    img: "/images/la-fija-exhibit.png",
    ingredients: ["QUESO COSTEÑO DOBLE.", "HOGAO DOBLE.", "AGUACATE.", "PAPAS GAJO CRUJIENTES.", "FUSE SAUCE."],
    description: "SIN CARNE, CON TODO.\nLA QUE DEMUESTRA QUE NO NECESITAS MÁS.",
    tagline: "HONEST BY DESIGN.",
    origin: "BARBOSA, COLOMBIA", created: "SPRINGS CREW", category: "COMFORT FOOD", temp: "66°C",
    quote: "SIN MENTIRAS.\nSIN CARNE.",
    price: "28,900",
  },
];

export default function ArtGallery() {
  const [idx, setIdx]     = useState(0);
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const contentRef        = useRef<HTMLDivElement>(null);
  const lenisRef          = useRef<Lenis | null>(null);
  const ex                = EXHIBITS[idx];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      const panelW = wrapper.clientWidth;
      const newIdx = Math.min(
        Math.max(Math.round(lenis.scroll / panelW), 0),
        EXHIBITS.length - 1
      );
      setIdx(newIdx);
    });

    let raf: number;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  const goTo = (i: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !lenisRef.current) return;
    lenisRef.current.scrollTo(i * wrapper.clientWidth, { duration: 1.2 });
  };

  return (
    <main style={{ background: BG, height: "100vh", overflow: "hidden", color: C.cream }}>

      {/* ── NAV — solo logo + CTA ─────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: NAV_H, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        background: "rgba(10,8,6,0.96)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${C.fainter}`,
      }}>
        <Link href="/" style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.05em", color: C.cream, textDecoration: "none" }}>
          SPRINGS
        </Link>
        <Link href="/menu" style={{
          ...F.display, fontSize: "0.7rem", letterSpacing: "0.12em",
          background: C.burgundy, color: C.cream, padding: "10px 20px",
          textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
        }}>
          PEDIR AHORA <span>↗</span>
        </Link>
      </div>

      {/* ── SIDEBAR FIJO ─────────────────────────────────── */}
      <aside style={{
        position: "fixed",
        left: 0, top: NAV_H, bottom: FOOTER_H, width: SIDEBAR_W,
        zIndex: 100,
        borderRight: `1px solid ${C.faint}`,
        padding: "32px 18px 24px",
        display: "flex", flexDirection: "column",
        background: BG,
        overflow: "hidden",
      }}>
        {/* Globe */}
        <div style={{
          width: 44, height: 44, border: `1px solid ${C.faint}`,
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 22,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="1.2" style={{ width: 24, height: 24 }}>
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </div>

        {/* Exhibit number */}
        <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.2em", color: C.dim, marginBottom: 2 }}>EXHIBIT</div>
        <div style={{ ...F.display, fontSize: "3.8rem", color: C.burgundy, lineHeight: 1, marginBottom: 14 }}>
          {ex.id}
        </div>

        <div style={{ width: 24, height: "1px", background: C.faint, marginBottom: 14 }} />

        <div style={{ marginBottom: 4 }}>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.14em", color: C.cream }}>JACKET SERIES</div>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.14em", color: C.dim }}>{ex.year}</div>
        </div>

        <div style={{ width: 24, height: "1px", background: C.fainter, margin: "14px 0" }} />

        <div style={{ marginBottom: 4 }}>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.1em", color: C.cream }}>BARBOSA</div>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.1em", color: C.dim }}>COLOMBIA</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ ...F.mono, fontSize: "0.39rem", color: "rgba(242,232,213,0.25)" }}>7.0631° N</div>
          <div style={{ ...F.mono, fontSize: "0.39rem", color: "rgba(242,232,213,0.25)" }}>73.0859° W</div>
        </div>

        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.burgundy, marginBottom: 16 }} />

        {/* Exhibit list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EXHIBITS.map((e, i) => (
            <button key={e.id} onClick={() => goTo(i)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7, padding: 0,
            }}>
              <span style={{ ...F.mono, fontSize: "0.39rem", color: i === idx ? C.burgundy : "rgba(242,232,213,0.22)" }}>
                {e.id}
              </span>
              <span style={{ ...F.mono, fontSize: "0.39rem", letterSpacing: "0.06em", color: i === idx ? C.cream : "rgba(242,232,213,0.25)" }}>
                {e.name}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {EXHIBITS.map((_, i) => (
              <div key={i} style={{
                height: 2,
                flex: 1,
                background: i === idx ? C.cream : "rgba(242,232,213,0.15)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <div style={{ ...F.mono, fontSize: "0.38rem", color: "rgba(242,232,213,0.28)", marginTop: 4 }}>
            {idx + 1} / {EXHIBITS.length}
          </div>
        </div>
      </aside>

      {/* ── LENIS WRAPPER ────────────────────────────────── */}
      <div
        ref={wrapperRef}
        style={{
          position: "fixed",
          left: SIDEBAR_W,
          top: NAV_H,
          right: 0,
          bottom: FOOTER_H,
          overflow: "hidden",
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "flex",
            height: "100%",
            width: `calc((100vw - ${SIDEBAR_W}px) * ${EXHIBITS.length})`,
          }}
        >
          {EXHIBITS.map((exhibit) => (
            <div
              key={exhibit.id}
              style={{
                width: `calc(100vw - ${SIDEBAR_W}px)`,
                height: "100%",
                flexShrink: 0,
                display: "grid",
                gridTemplateColumns: "1fr 380px",
                borderRight: `1px solid ${C.fainter}`,
              }}
            >
              {/* ── Photo ── */}
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={exhibit.img}
                  alt={exhibit.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
                />

                {/* Vignette bottom */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
                  background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
                  pointerEvents: "none",
                }} />

                {/* Museum plaque */}
                <div style={{
                  position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)",
                  border: "1px solid rgba(242,232,213,0.25)",
                  padding: "12px 28px", textAlign: "center",
                  background: "rgba(10,8,6,0.7)", backdropFilter: "blur(6px)",
                  whiteSpace: "nowrap",
                }}>
                  <div style={{ ...F.display, fontSize: "1rem", letterSpacing: "0.14em", color: C.cream }}>
                    {exhibit.name}
                  </div>
                  <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.2em", color: C.dim, marginTop: 3 }}>
                    {exhibit.subtitle}
                  </div>
                  <div style={{ ...F.mono, fontSize: "0.38rem", letterSpacing: "0.14em", color: "rgba(242,232,213,0.28)", marginTop: 2 }}>
                    {exhibit.year}
                  </div>
                </div>
              </div>

              {/* ── Info panel ── */}
              <div style={{
                borderLeft: `1px solid ${C.faint}`,
                padding: "32px 22px 24px",
                overflowY: "auto",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.22em", color: C.mostaza, marginBottom: 6 }}>
                  SPRINGS ART GALLERY
                </div>

                <h2 style={{ ...F.display, fontSize: "clamp(2.4rem, 4vw, 4.5rem)", color: C.cream, lineHeight: 0.95, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
                  {exhibit.name}
                </h2>

                <div style={{ ...F.mono, fontSize: "0.48rem", letterSpacing: "0.18em", color: C.mostaza, marginBottom: 14 }}>
                  {exhibit.subtitle} +
                </div>

                <div style={{ height: "1px", background: C.faint, marginBottom: 14, width: "80%" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                  {exhibit.ingredients.map(ing => (
                    <div key={ing} style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.09em", color: C.cream }}>
                      {ing}
                    </div>
                  ))}
                </div>

                <p style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.06em", color: C.dim, lineHeight: 1.7, margin: "0 0 10px", whiteSpace: "pre-line" }}>
                  {exhibit.description}
                </p>

                <div style={{ ...F.mono, fontSize: "0.46rem", letterSpacing: "0.1em", color: C.burgundy, marginBottom: 16 }}>
                  {exhibit.tagline}
                </div>

                {/* Specs */}
                <div style={{
                  border: `1px solid ${C.faint}`, padding: "12px 14px",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 6px",
                  marginBottom: 16,
                }}>
                  {[
                    { label: "ORIGIN",      val: exhibit.origin   },
                    { label: "CREATED",     val: exhibit.created  },
                    { label: "CATEGORY",    val: exhibit.category },
                    { label: "TEMPERATURE", val: exhibit.temp     },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ ...F.mono, fontSize: "0.37rem", letterSpacing: "0.14em", color: "rgba(242,232,213,0.28)", marginBottom: 2 }}>
                        {item.label}
                      </div>
                      <div style={{ ...F.mono, fontSize: "0.43rem", letterSpacing: "0.07em", color: C.cream }}>
                        {item.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: "auto" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ ...F.sans, fontSize: "1.4rem", color: C.cream, lineHeight: 0.8, display: "block", marginBottom: 3 }}>"</span>
                    <p style={{ ...F.sans, fontSize: "0.58rem", fontWeight: 500, color: C.cream, lineHeight: 1.5, margin: "0 0 5px", whiteSpace: "pre-line" }}>
                      {exhibit.quote}
                    </p>
                    <div style={{ ...F.sans, fontSize: "0.5rem", fontStyle: "italic", color: C.dim }}>Springs Crew</div>
                  </div>
                  <div style={{ ...F.mono, fontSize: "0.38rem", letterSpacing: "0.07em", color: "rgba(242,232,213,0.22)", lineHeight: 1.7, textAlign: "right", flexShrink: 0 }}>
                    SPRINGS<br />ART GALLERY<br />{exhibit.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: FOOTER_H, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        background: "rgba(10,8,6,0.96)",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${C.fainter}`,
      }}>
        <div style={{ display: "flex", gap: 18 }}>
          {["INSTAGRAM", "TIKTOK", "SPOTIFY"].map(s => (
            <span key={s} style={{ ...F.mono, fontSize: "0.41rem", letterSpacing: "0.1em", color: "rgba(242,232,213,0.26)", cursor: "pointer" }}>{s}</span>
          ))}
        </div>

        <div style={{ ...F.mono, fontSize: "0.38rem", letterSpacing: "0.1em", color: "rgba(242,232,213,0.16)" }}>
          SPRINGS © 2025 ©
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "CARTA",       href: "/menu"        },
            { label: "ART GALLERY", href: "/art-gallery", active: true },
            { label: "NOSOTROS",    href: "#"             },
            { label: "EL CLUB",     href: "#"             },
            { label: "FAQS",        href: "#"             },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              ...F.mono, fontSize: "0.43rem", letterSpacing: "0.1em",
              color: item.active ? C.cream : "rgba(242,232,213,0.3)",
              textDecoration: "none",
              borderBottom: item.active ? `1px solid ${C.cream}` : "none",
              paddingBottom: item.active ? 2 : 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div>
            <div style={{ ...F.mono, fontSize: "0.37rem", letterSpacing: "0.1em", color: "rgba(242,232,213,0.32)" }}>SPRINGS RADIO</div>
            <div style={{ ...F.mono, fontSize: "0.5rem", color: C.cream }}>103.7 FM</div>
          </div>
          <div style={{
            width: 24, height: 24, border: `1px solid rgba(242,232,213,0.25)`,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <span style={{ color: C.cream, fontSize: "0.5rem", paddingLeft: 2 }}>▶</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
