"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Estilos inyectados ───────────────────────────────────────────────────────
// gsap-hidden: previene FOUC antes de que GSAP tome control.
// s-card:      sombra profunda, sin border-radius (regla de marca).
// s-chip:      glass badge con borde mostaza.
// s-btn:       CTA mostaza con hover lift.

const CSS = `
  .gsap-hidden { visibility: hidden; }

  .s-grain {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 50;
    opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23g)"/></svg>');
  }

  .s-card {
    background: #1A0A0C;
    box-shadow:
      0 80px 140px -20px rgba(0,0,0,0.98),
      0 40px 60px -20px rgba(0,0,0,0.75),
      inset 0 1px 0 rgba(242,232,213,0.04);
  }

  .s-chip {
    background: rgba(26,10,12,0.88);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(197,135,31,0.28);
    box-shadow: 0 16px 32px rgba(0,0,0,0.65), inset 0 1px 0 rgba(197,135,31,0.08);
  }

  .s-btn {
    background: #C5871F;
    color: #1A0A0C;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 56px;
    font-family: var(--font-display);
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-decoration: none;
    transition: transform 0.32s cubic-bezier(0.25,1,0.5,1), box-shadow 0.32s ease;
  }
  .s-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(197,135,31,0.38), 0 4px 10px rgba(197,135,31,0.2);
  }
  .s-btn:active { transform: translateY(0); }
`;

// ─── MobileLanding ────────────────────────────────────────────────────────────

export default function MobileLanding() {
  const wrapRef  = useRef<HTMLDivElement>(null); // scroll container
  const sceneRef = useRef<HTMLDivElement>(null); // pinned scene

  useEffect(() => {
    const wrap  = wrapRef.current;
    const scene = sceneRef.current;
    if (!wrap || !scene) return;

    const vh = window.innerHeight;

    const ctx = gsap.context(() => {
      // Usar el div fixed como scroller, no el window
      ScrollTrigger.defaults({ scroller: wrap });

      // ── Estados iniciales ──────────────────────────────────────────────────
      gsap.set([".s-hero-line"], { autoAlpha: 0, y: 80, filter: "blur(20px)" });
      gsap.set(".s-card",        { y: vh + 280, autoAlpha: 1 });
      gsap.set([".s-img", ".s-info", ".s-wordmark", ".s-chip", ".s-cta"], { autoAlpha: 0 });

      // ── Intro (al cargar, sin scroll) ──────────────────────────────────────
      gsap.timeline({ delay: 0.2 })
        .to(".s-hero-line-1", {
          autoAlpha: 1, y: 0, filter: "blur(0px)",
          duration: 1.7, ease: "expo.out",
        })
        .to(".s-hero-line-2", {
          autoAlpha: 1, y: 0, filter: "blur(0px)",
          duration: 1.7, ease: "expo.out",
        }, "-=1.1");

      // ── Timeline cinematográfico scroll-pinned ─────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start:  "top top",
          end:    "+=5800",
          pin:    true,
          scrub:  1.2,
          anticipatePin: 1,
        },
      });

      tl
        // Acto 1: tarjeta sube, hero se desvanece
        .to(".s-hero-wrap", {
          scale: 1.1, filter: "blur(18px)", opacity: 0.1, duration: 2,
        }, 0)
        .to(".s-card", {
          y: 0, ease: "power3.inOut", duration: 2,
        }, 0)

        // Acto 2: tarjeta se abre a pantalla completa
        .to(".s-card", {
          width: "100%", height: "100%", ease: "power3.inOut", duration: 1.6,
        })

        // Acto 3: producto se revela dentro de la tarjeta
        .fromTo(".s-img",
          { scale: 1.1, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: "power3.out", duration: 2.2 },
          "-=0.7")
        .fromTo(".s-info",
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: "expo.out", duration: 1.6 },
          "-=1.8")
        .fromTo(".s-wordmark",
          { y: -20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: "expo.out", duration: 1.4 },
          "<")
        .fromTo(".s-chip",
          { y: 36, autoAlpha: 0, scale: 0.9 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.2, ease: "back.out(1.2)", duration: 1.3 },
          "-=1.0")

        // Pausa
        .to({}, { duration: 2.8 })

        // Acto 4: transición a CTA
        .to([".s-img", ".s-info", ".s-wordmark", ".s-chip"], {
          scale: 0.93, y: -28, autoAlpha: 0, duration: 1, ease: "power2.in", stagger: 0.04,
        })
        .to(".s-hero-wrap", { autoAlpha: 0, duration: 0.4 }, "<")
        .to(".s-card", {
          width: "90vw", height: "86svh", ease: "expo.inOut", duration: 1.7,
        }, "cta")
        .fromTo(".s-cta",
          { autoAlpha: 0, scale: 0.88, filter: "blur(28px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "expo.out", duration: 1.7 },
          "cta+=0.15")

        // Acto 5: tarjeta sale
        .to({}, { duration: 2 })
        .to(".s-card", {
          y: -(vh + 280), ease: "power2.in", duration: 1.3,
        });

    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Scroll container ───────────────────────────────────────────────── */}
      <div
        ref={wrapRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-tinta font-sans"
      >
        {/* ── Escena pinned ──────────────────────────────────────────────── */}
        <div
          ref={sceneRef}
          className="relative w-full"
          style={{ height: "100svh" }}
        >
          <div className="s-grain" aria-hidden="true" />

          {/* Capa 1: Hero text */}
          <div className="s-hero-wrap absolute inset-0 z-10 flex flex-col justify-center px-8 pointer-events-none">
            <span className="s-hero-line s-hero-line-1 gsap-hidden font-display text-[72px] leading-[0.82] text-cream">
              JACKET
            </span>
            <span className="s-hero-line s-hero-line-2 gsap-hidden font-display text-[72px] leading-[0.82] text-mostaza">
              DE AUTOR.
            </span>
            <span className="font-mono text-[9px] text-cream/25 uppercase tracking-[4px] mt-6">
              Bucaramanga · Colombia
            </span>
          </div>

          {/* Capa 2: Tarjeta */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ perspective: "1200px" }}
          >
            <div
              className="s-card gsap-hidden relative overflow-hidden pointer-events-auto"
              style={{ width: "90vw", height: "86svh" }}
            >
              {/* Foto del producto */}
              <div className="s-img gsap-hidden absolute inset-0">
                <img
                  src="/images/hero-jacket.jpg"
                  alt="La Fija — Jacket de autor Springs"
                  className="w-full h-full object-cover"
                />
                {/* Vignette para legibilidad */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, #1A0A0C 0%, rgba(26,10,12,0.55) 35%, transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(26,10,12,0.6) 0%, transparent 55%)",
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Info del producto — abajo izquierda */}
              <div className="s-info gsap-hidden absolute bottom-0 left-0 z-10 p-8 flex flex-col">
                <span className="font-mono text-[9px] text-mostaza tracking-[4px] uppercase mb-3">
                  01 — LA FIJA
                </span>
                <h2 className="font-display text-[58px] leading-[0.82] text-cream mb-3">
                  CARNE<br />OREADA.
                </h2>
                <p className="font-sans text-cream/45 text-xs leading-relaxed mb-5 max-w-[210px]">
                  Pollo desmechado. Hogao. Queso costeño.
                </p>
                <span className="font-mono text-2xl text-mostaza">32,900</span>
              </div>

              {/* Wordmark — arriba derecha */}
              <div className="s-wordmark gsap-hidden absolute top-0 right-0 z-10 p-8 flex flex-col items-end gap-1">
                <span className="font-display text-[11px] tracking-[0.4em] text-cream/18 uppercase">
                  SPRINGS
                </span>
                <span className="font-mono text-[8px] text-cream/12 tracking-widest uppercase">
                  DARK KITCHEN
                </span>
              </div>

              {/* Chips de ingredientes */}
              <div className="s-chip gsap-hidden absolute top-14 left-8 z-20 px-4 py-2">
                <span className="font-mono text-[9px] text-mostaza uppercase tracking-widest">
                  CARNE OREADA
                </span>
              </div>
              <div className="s-chip gsap-hidden absolute top-[38%] right-8 z-20 px-4 py-2">
                <span className="font-mono text-[9px] text-mostaza uppercase tracking-widest">
                  HOGAO
                </span>
              </div>
              <div className="s-chip gsap-hidden absolute bottom-[28%] left-8 z-20 px-4 py-2">
                <span className="font-mono text-[9px] text-mostaza uppercase tracking-widest">
                  QUESO COSTEÑO
                </span>
              </div>

              {/* CTA — se revela en acto 4 */}
              <div
                className="s-cta gsap-hidden absolute inset-0 z-30 flex flex-col justify-center px-8 pointer-events-auto"
                style={{ background: "#6B1419" }}
              >
                <span className="font-mono text-[9px] text-mostaza uppercase tracking-[3px] mb-8">
                  SPRINGS — BUCARAMANGA
                </span>
                <div className="flex flex-col mb-6">
                  <span className="font-display text-[72px] leading-[0.82] text-cream">
                    PEDIR
                  </span>
                  <span className="font-display text-[72px] leading-[0.82] text-mostaza">
                    AHORA.
                  </span>
                </div>
                <p className="font-sans text-cream/45 text-sm leading-relaxed mb-8 max-w-[270px]">
                  Jackets de autor a domicilio.
                  <br />Cabecera · Cañaveral · Sotomayor.
                </p>
                <a href="/menu" className="s-btn">
                  IR A PEDIR
                </a>
                <span className="font-mono text-[8px] text-cream/20 uppercase tracking-[3px] mt-5">
                  30–45 MIN · ENTREGA A DOMICILIO
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="w-full bg-tinta p-8 flex flex-col items-center gap-6 relative z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="font-display text-[48px] text-cream tracking-[0.06em] leading-none">
              SPRINGS
            </span>
            <span className="font-sans italic text-base text-cream">Jacket de autor.</span>
          </div>
          <div className="w-full h-px bg-mostaza" />
          <div className="flex flex-col items-center gap-4 w-full">
            <a href="/menu" className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors">
              MENÚ [VER]
            </a>
            <a href="#" className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors">
              EDITORIAL [LEER]
            </a>
            <a href="#" className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors">
              MANIFIESTO [SABER]
            </a>
          </div>
          <span className="font-mono text-[9px] text-cream/50 uppercase tracking-widest mt-8">
            © 2026 SPRINGS · SYS.VER 1.0 // BGA-COL
          </span>
        </footer>

      </div>
    </>
  );
}
