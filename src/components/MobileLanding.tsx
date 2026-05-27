"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Config ────────────────────────────────────────────────────────────────────

const FRAME_COUNT = 120;
const frameUrl = (i: number) =>
  `/images/frames/la-fija-${String(i + 1).padStart(3, "0")}.jpg`;

interface Chapter { from: number; label: string; sub: string | null }
const CHAPTERS: Chapter[] = [
  { from: 0.00, label: "LA PAPA.",          sub: "Piel carbonizada." },
  { from: 0.10, label: "LA BASE.",          sub: "Mantequilla y queso en la pulpa." },
  { from: 0.26, label: "POLLO DESMECHADO.", sub: null },
  { from: 0.43, label: "HOGAO.",            sub: null },
  { from: 0.60, label: "QUESO COSTEÑO.",   sub: null },
  { from: 0.76, label: "LA FUSE.",          sub: "Tartara con ají." },
  { from: 0.88, label: "LA FIJA.",          sub: "32,900" },
];

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
  .gsap-hidden { visibility: hidden; }

  .s-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 5;
    opacity: 0.045; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23g)"/></svg>');
  }

  .s-btn {
    background: #C5871F; color: #1A0A0C;
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 56px;
    font-family: var(--font-display); font-size: 24px;
    text-transform: uppercase; letter-spacing: 0.08em;
    text-decoration: none;
    transition: transform 0.32s cubic-bezier(0.25,1,0.5,1), box-shadow 0.32s ease;
  }
  .s-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(197,135,31,0.38);
  }
  .s-btn:active { transform: translateY(0); }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = img.naturalWidth  * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MobileLanding() {
  // Scroll container
  const wrapRef  = useRef<HTMLDivElement>(null);
  // Scroll distance provider
  const outerRef = useRef<HTMLDivElement>(null);
  // Sticky scene — everything lives here
  const sceneRef = useRef<HTMLDivElement>(null);

  // Layers (z-order: smoke < canvas < titles < chapter < cta)
  const smokeRef        = useRef<HTMLDivElement>(null);
  const cardRef         = useRef<HTMLDivElement>(null);     // canvas wrapper + scale
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const titleTopRef     = useRef<HTMLHeadingElement>(null);
  const titleBottomRef  = useRef<HTMLHeadingElement>(null);
  const chapterRef      = useRef<HTMLDivElement>(null);
  const chapterLabelRef = useRef<HTMLSpanElement>(null);
  const chapterSubRef   = useRef<HTMLSpanElement>(null);
  const ctaRef          = useRef<HTMLDivElement>(null);

  // Frame buffer
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const lastDrawnRef = useRef<number>(-1);

  // ── Carga de frames ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const loadOne = (i: number) => {
      const img = new window.Image();
      if (i < 8) (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
      if (i === 0) {
        img.onload = () => {
          if (cancelled) return;
          const canvas = canvasRef.current;
          const scene  = sceneRef.current;
          if (canvas && scene) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width  = scene.offsetWidth  * dpr;
            canvas.height = scene.offsetHeight * dpr;
            const ctx2 = canvas.getContext("2d");
            if (ctx2) {
              ctx2.imageSmoothingEnabled = true;
              ctx2.imageSmoothingQuality = "high";
              drawCover(ctx2, img, canvas.width, canvas.height);
            }
            lastDrawnRef.current = 0;
          }
        };
      }
      img.src = frameUrl(i);
      images[i] = img;
    };

    const INIT = Math.min(24, FRAME_COUNT);
    for (let i = 0; i < INIT; i++) loadOne(i);

    let cursor = INIT;
    const loadBatch = () => {
      if (cancelled) return;
      const end = Math.min(FRAME_COUNT, cursor + 24);
      for (let i = cursor; i < end; i++) loadOne(i);
      cursor = end;
      if (cursor < FRAME_COUNT) setTimeout(loadBatch, 120);
    };
    setTimeout(loadBatch, 250);

    return () => { cancelled = true; };
  }, []);

  // ── Render frame ────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const images = imagesRef.current;
    const ok = (i: number) => !!(images[i]?.complete && images[i]?.naturalWidth);
    let idx = index;
    if (!ok(idx)) {
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (idx - d >= 0 && ok(idx - d)) { idx = idx - d; break; }
        if (idx + d < FRAME_COUNT && ok(idx + d)) { idx = idx + d; break; }
      }
    }
    if (lastDrawnRef.current === idx) return;
    const ctx2 = canvas.getContext("2d");
    if (!ctx2 || !images[idx]) return;
    drawCover(ctx2, images[idx], canvas.width, canvas.height);
    lastDrawnRef.current = idx;
  }, []);

  // ── Actualizar capítulo sin re-render React ──────────────────────────────
  const updateChapter = useCallback((fp: number) => {
    let ch = CHAPTERS[0];
    for (const c of CHAPTERS) { if (fp >= c.from) ch = c; }
    if (!chapterLabelRef.current) return;
    if (chapterLabelRef.current.textContent === ch.label) return;
    chapterLabelRef.current.textContent = ch.label;
    if (chapterSubRef.current) {
      chapterSubRef.current.textContent = ch.sub ?? "";
      chapterSubRef.current.style.display = ch.sub ? "block" : "none";
    }
  }, []);

  // ── Intro + scroll — UN SOLO TIMELINE ───────────────────────────────────
  useEffect(() => {
    const wrap  = wrapRef.current;
    const outer = outerRef.current;
    if (!wrap || !outer) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({ scroller: wrap });

      // ── Estados iniciales ──
      gsap.set([".s-hero-line"], { autoAlpha: 0, y: 60, filter: "blur(16px)" });
      gsap.set(cardRef.current,    { scale: 0.82, transformOrigin: "50% 50%", autoAlpha: 0 });
      gsap.set(chapterRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(ctaRef.current,     { autoAlpha: 0 });

      // ── Hero intro (time-based, al cargar) ──
      gsap.timeline({ delay: 0.25 })
        .to(".s-hero-line-1", {
          autoAlpha: 1, y: 0, filter: "blur(0px)",
          duration: 1.6, ease: "expo.out",
        })
        .to(".s-hero-line-2", {
          autoAlpha: 1, y: 0, filter: "blur(0px)",
          duration: 1.6, ease: "expo.out",
        }, "-=1.0");

      // ── Scroll timeline — experiencia continua ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   0.6,
          onUpdate: (self) => {
            const p = self.progress;
            // Frames se reproducen entre 18% y 92%
            if (p >= 0.18) {
              const fp  = gsap.utils.clamp(0, 1, (p - 0.18) / 0.74);
              const idx = Math.min(FRAME_COUNT - 1, Math.floor(fp * FRAME_COUNT));
              drawFrame(idx);
              updateChapter(fp);
            }
          },
        },
      });

      // 0–10%: humo se desvanece, canvas aparece
      tl.to(smokeRef.current, { autoAlpha: 0, duration: 0.10 }, 0);
      tl.to(cardRef.current,  { autoAlpha: 1, duration: 0.10 }, 0);

      // 10–18%: texto sale (Ferrari-style), card hace zoom
      tl.to(titleTopRef.current, {
        x: "-55vw", letterSpacing: "0.02em", autoAlpha: 0,
        ease: "power2.inOut", duration: 0.08,
      }, 0.10);
      tl.to(titleBottomRef.current, {
        x:  "55vw", letterSpacing: "0.02em", autoAlpha: 0,
        ease: "power2.inOut", duration: 0.08,
      }, 0.10);
      tl.to(cardRef.current, {
        scale: 1, ease: "power2.out", duration: 0.08,
      }, 0.10);
      // Chapter label aparece
      tl.to(chapterRef.current, {
        autoAlpha: 1, y: 0, ease: "expo.out", duration: 0.06,
      }, 0.16);

      // 80–90%: chapter se va, CTA entra sobre el último frame
      tl.to(chapterRef.current, { autoAlpha: 0, duration: 0.04 }, 0.80);
      tl.to(ctaRef.current,     { autoAlpha: 1, ease: "expo.out", duration: 0.10 }, 0.82);

    }, wrapRef);

    return () => ctx.revert();
  }, [drawFrame, updateChapter]);

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Scroll container */}
      <div
        ref={wrapRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-tinta font-sans"
      >

        {/* ── Outer: provee 7000px de scroll distance ────────────────────── */}
        <div
          ref={outerRef}
          style={{ height: "calc(100svh + 7000px)" }}
        >
          {/* ── Escena sticky — TODO vive aquí ──────────────────────────── */}
          <div
            ref={sceneRef}
            className="sticky top-0 w-full overflow-hidden bg-tinta"
            style={{ height: "100svh" }}
          >

            {/* Capa 0 — Humo WebGL (fondo inicial) */}
            <div ref={smokeRef} className="absolute inset-0 z-0" aria-hidden="true">
              <SmokeBackground smokeColor="#6B1419" />
            </div>

            {/* Grain — siempre visible */}
            <div className="s-grain" aria-hidden="true" />

            {/* Capa 1 — Canvas de frames (fondo del scrub) */}
            <div
              ref={cardRef}
              className="absolute inset-0 z-10 will-change-transform overflow-hidden"
              style={{ visibility: "hidden" }}
            >
              <canvas
                ref={canvasRef}
                aria-hidden
                className="absolute inset-0 w-full h-full"
              />
              {/* Vignette */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.60) 100%)",
                }}
              />
              {/* Gradiente inferior — legibilidad de textos */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                  height: "45%",
                  background:
                    "linear-gradient(to top, rgba(26,10,12,0.90) 0%, rgba(26,10,12,0.30) 60%, transparent 100%)",
                }}
              />
            </div>

            {/* Capa 2 — Títulos hero (salen al hacer scroll) */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 pointer-events-none">
              <span className="font-mono text-[9px] text-cream/25 uppercase tracking-[4px] mb-4">
                Bucaramanga · Colombia
              </span>
              <h1
                ref={titleTopRef}
                className="s-hero-line s-hero-line-1 gsap-hidden font-display text-[72px] leading-[0.82] text-cream"
              >
                JACKET
              </h1>
              <h1
                ref={titleBottomRef}
                className="s-hero-line s-hero-line-2 gsap-hidden font-display text-[72px] leading-[0.82] text-mostaza"
              >
                DE AUTOR.
              </h1>
            </div>

            {/* Capa 3 — Chapter labels (durante el scrub) */}
            <div
              ref={chapterRef}
              className="absolute bottom-10 left-8 z-30 pointer-events-none"
            >
              <span
                ref={chapterLabelRef}
                className="font-display text-[46px] leading-[0.85] text-cream uppercase block"
              >
                LA PAPA.
              </span>
              <span
                ref={chapterSubRef}
                className="font-mono text-[9px] text-mostaza uppercase tracking-[3px] mt-2 block"
              >
                Piel carbonizada.
              </span>
            </div>

            {/* Capa 4 — CTA (sobre el último frame) */}
            <div
              ref={ctaRef}
              className="absolute inset-x-0 bottom-0 z-40 px-8 pt-20 pb-12"
              style={{
                visibility: "hidden",
                background:
                  "linear-gradient(to top, #1A0A0C 0%, rgba(26,10,12,0.92) 40%, rgba(26,10,12,0.6) 70%, transparent 100%)",
              }}
            >
              <span className="font-mono text-[9px] text-mostaza uppercase tracking-[3px] mb-6 block">
                SPRINGS — BUCARAMANGA
              </span>
              <div className="flex flex-col mb-5">
                <span className="font-display text-[68px] leading-[0.82] text-cream">
                  PEDIR
                </span>
                <span className="font-display text-[68px] leading-[0.82] text-mostaza">
                  AHORA.
                </span>
              </div>
              <p className="font-sans text-cream/50 text-sm leading-relaxed mb-7 max-w-[260px]">
                Jackets de autor a domicilio.
                <br />Cabecera · Cañaveral · Sotomayor.
              </p>
              <a href="/menu" className="s-btn">IR A PEDIR</a>
              <span className="font-mono text-[8px] text-cream/25 uppercase tracking-[3px] mt-4 block">
                30–45 MIN · ENTREGA A DOMICILIO
              </span>
            </div>

            {/* Scroll hint (visible antes de hacer scroll) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
              <span className="font-mono text-[8px] text-cream/30 uppercase tracking-[3px]">
                SCROLL
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-cream/30 to-transparent" />
            </div>

          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="w-full bg-tinta p-8 flex flex-col items-center gap-6 relative z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="font-display text-[48px] text-cream tracking-[0.06em] leading-none">
              SPRINGS
            </span>
            <span className="font-sans italic text-base text-cream/70">
              Jacket de autor.
            </span>
          </div>
          <div className="w-full h-px bg-mostaza/40" />
          <div className="flex flex-col items-center gap-4 w-full">
            <a
              href="/menu"
              className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors"
            >
              MENÚ [VER]
            </a>
            <a
              href="#"
              className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors"
            >
              EDITORIAL [LEER]
            </a>
            <a
              href="#"
              className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors"
            >
              MANIFIESTO [SABER]
            </a>
          </div>
          <span className="font-mono text-[9px] text-cream/40 uppercase tracking-widest mt-8">
            © 2026 SPRINGS · SYS.VER 1.0 // BGA-COL
          </span>
        </footer>

      </div>
    </>
  );
}
