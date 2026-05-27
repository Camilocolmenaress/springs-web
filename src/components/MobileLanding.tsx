"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

// Qué texto mostrar en cada tramo del scrub (por progreso de frame 0→1)
interface Chapter { from: number; label: string; sub: string | null; }

const CHAPTERS: Chapter[] = [
  { from: 0.00, label: "LA BASE.",          sub: "Mantequilla y queso en la pulpa." },
  { from: 0.20, label: "POLLO DESMECHADO.", sub: null },
  { from: 0.42, label: "HOGAO.",            sub: null },
  { from: 0.63, label: "QUESO COSTEÑO.",   sub: null },
  { from: 0.82, label: "LA FUSE.",          sub: "Tartara con ají." },
  { from: 0.95, label: "LA FIJA.",          sub: "32,900" },
];

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
  .gsap-hidden { visibility: hidden; }

  .s-grain {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 50;
    opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23g)"/></svg>');
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
  const ox = (cw - sw) / 2;
  const oy = (ch - sh) / 2;
  ctx.drawImage(img, ox, oy, sw, sh);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MobileLanding() {
  // Scroll container
  const wrapRef  = useRef<HTMLDivElement>(null);

  // Sección 1 — hero smoke
  // (sin ref adicional, sólo necesita el ctx de GSAP)

  // Sección 2 — assembly scrub
  const outerRef = useRef<HTMLDivElement>(null); // da el scroll distance
  const sceneRef = useRef<HTMLDivElement>(null); // sticky panel
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const titleTopRef    = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const chapterRef     = useRef<HTMLDivElement>(null);
  const chapterLabelRef = useRef<HTMLSpanElement>(null);
  const chapterSubRef   = useRef<HTMLSpanElement>(null);

  // Frame buffer
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const lastDrawnRef = useRef<number>(-1);

  const [framesReady, setFramesReady] = useState(false);

  // ── Carga de frames ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const loadOne = (i: number) => {
      const img = new window.Image();
      if (i < 6) (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
      if (i === 0) {
        img.onload = () => {
          if (cancelled) return;
          const canvas = canvasRef.current;
          const scene  = sceneRef.current;
          if (canvas && scene) {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width  = scene.offsetWidth  * dpr;
            canvas.height = scene.offsetHeight * dpr;
            const ctx = canvas.getContext("2d");
            if (ctx) drawCover(ctx, img, canvas.width, canvas.height);
            lastDrawnRef.current = 0;
          }
          setFramesReady(true);
        };
      }
      img.src = frameUrl(i);
      images[i] = img;
    };

    const INITIAL = Math.min(24, FRAME_COUNT);
    for (let i = 0; i < INITIAL; i++) loadOne(i);

    let cursor = INITIAL;
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

  // ── Render frame (cover crop) ────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const images = imagesRef.current;
    const isLoaded = (i: number) => !!(images[i]?.complete && images[i]?.naturalWidth);
    let useIdx = index;
    if (!isLoaded(useIdx)) {
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (useIdx - d >= 0 && isLoaded(useIdx - d)) { useIdx = useIdx - d; break; }
        if (useIdx + d < FRAME_COUNT && isLoaded(useIdx + d)) { useIdx = useIdx + d; break; }
      }
    }
    if (lastDrawnRef.current === useIdx) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !images[useIdx]) return;
    drawCover(ctx, images[useIdx], canvas.width, canvas.height);
    lastDrawnRef.current = useIdx;
  }, []);

  // ── Actualizar capítulo (DOM directo — evita re-render en RAF) ────────────
  const updateChapter = useCallback((frameProgress: number) => {
    let chapter = CHAPTERS[0];
    for (const ch of CHAPTERS) {
      if (frameProgress >= ch.from) chapter = ch;
    }
    if (chapterLabelRef.current && chapterLabelRef.current.textContent !== chapter.label) {
      chapterLabelRef.current.textContent = chapter.label;
      if (chapterSubRef.current) {
        chapterSubRef.current.textContent = chapter.sub ?? "";
        chapterSubRef.current.style.display = chapter.sub ? "block" : "none";
      }
    }
  }, []);

  // ── Hero intro (sin scroll, al cargar) ───────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([".s-hero-line"], { autoAlpha: 0, y: 80, filter: "blur(20px)" });
      gsap.timeline({ delay: 0.2 })
        .to(".s-hero-line-1", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.7, ease: "expo.out" })
        .to(".s-hero-line-2", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.7, ease: "expo.out" }, "-=1.1");
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  // ── Assembly scrub (esperamos frames) ────────────────────────────────────
  useEffect(() => {
    if (!framesReady) return;
    const wrap  = wrapRef.current;
    const outer = outerRef.current;
    if (!wrap || !outer) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({ scroller: wrap });

      // Estado inicial
      gsap.set(cardRef.current,        { scale: 0.82, transformOrigin: "50% 50%" });
      gsap.set(chapterRef.current,     { autoAlpha: 0, y: 24 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   0.5,
          onUpdate: (self) => {
            const p = self.progress;
            // Los frames se "reproducen" entre el 15% y el 88% del scroll
            const fp = gsap.utils.clamp(0, 1, (p - 0.15) / 0.73);
            const idx = Math.min(FRAME_COUNT - 1, Math.floor(fp * FRAME_COUNT));
            drawFrame(idx);
            updateChapter(fp);
          },
        },
      });

      // 0–15%: card hace zoom, título se va, chapter aparece
      master.to(cardRef.current,    { scale: 1, ease: "power2.out", duration: 0.15 }, 0);
      master.to(titleTopRef.current,    { x: "-55vw", letterSpacing: "0.02em", autoAlpha: 0, ease: "power2.inOut", duration: 0.15 }, 0);
      master.to(titleBottomRef.current, { x:  "55vw", letterSpacing: "0.02em", autoAlpha: 0, ease: "power2.inOut", duration: 0.15 }, 0);
      master.to(chapterRef.current, { autoAlpha: 1, y: 0, ease: "expo.out", duration: 0.10 }, 0.12);

      // 88–100%: fade out todo (la CTA está debajo)
      master.to(cardRef.current,    { autoAlpha: 0, ease: "power2.in", duration: 0.10 }, 0.88);
      master.to(chapterRef.current, { autoAlpha: 0, duration: 0.08 }, 0.90);
    }, wrapRef);

    return () => ctx.revert();
  }, [framesReady, drawFrame, updateChapter]);

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Scroll container */}
      <div
        ref={wrapRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-tinta font-sans"
      >

        {/* ── Sección 1: Hero smoke ──────────────────────────────────────── */}
        <div className="relative w-full bg-tinta" style={{ height: "100svh" }}>
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <SmokeBackground smokeColor="#6B1419" />
          </div>
          <div className="s-grain" aria-hidden="true" />
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 pointer-events-none">
            <span className="font-mono text-[9px] text-cream/25 uppercase tracking-[4px] mb-4">
              Bucaramanga · Colombia
            </span>
            <span className="s-hero-line s-hero-line-1 gsap-hidden font-display text-[72px] leading-[0.82] text-cream">
              JACKET
            </span>
            <span className="s-hero-line s-hero-line-2 gsap-hidden font-display text-[72px] leading-[0.82] text-mostaza">
              DE AUTOR.
            </span>
          </div>
          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <span className="font-mono text-[8px] text-cream/30 uppercase tracking-[3px]">SCROLL</span>
            <div className="w-px h-8 bg-gradient-to-b from-cream/30 to-transparent" />
          </div>
        </div>

        {/* ── Sección 2: Assembly scrub ──────────────────────────────────── */}
        <div
          ref={outerRef}
          style={{ height: "calc(100svh + 5200px)" }}
        >
          <div
            ref={sceneRef}
            className="sticky top-0 w-full bg-tinta overflow-hidden"
            style={{ height: "100svh" }}
          >
            {/* Card con canvas — ocupa toda la escena, escala desde 0.82 */}
            <div
              ref={cardRef}
              className="absolute inset-0 will-change-transform overflow-hidden"
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
                  background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
                }}
              />
              {/* Gradiente inferior para legibilidad del texto */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(26,10,12,0.85) 0%, transparent 100%)" }}
              />
            </div>

            {/* Título (se va al hacer scroll) */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-2">
              <h2
                ref={titleTopRef}
                className="font-display text-cream uppercase"
                style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}
              >
                JACKET
              </h2>
              <h2
                ref={titleBottomRef}
                className="font-display text-mostaza uppercase"
                style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}
              >
                DE AUTOR.
              </h2>
            </div>

            {/* Chapter label — aparece durante el scrub */}
            <div
              ref={chapterRef}
              className="absolute bottom-10 left-8 z-20 pointer-events-none"
            >
              <span
                ref={chapterLabelRef}
                className="font-display text-[46px] leading-[0.85] text-cream uppercase block"
              >
                LA BASE.
              </span>
              <span
                ref={chapterSubRef}
                className="font-mono text-[9px] text-mostaza uppercase tracking-[3px] mt-2"
                style={{ display: "block" }}
              >
                Mantequilla y queso en la pulpa.
              </span>
            </div>

          </div>
        </div>

        {/* ── Sección 3: CTA ────────────────────────────────────────────── */}
        <div
          className="relative w-full flex flex-col justify-center px-8"
          style={{ height: "100svh", background: "#6B1419" }}
        >
          <span className="font-mono text-[9px] text-mostaza uppercase tracking-[3px] mb-8">
            SPRINGS — BUCARAMANGA
          </span>
          <div className="flex flex-col mb-6">
            <span className="font-display text-[72px] leading-[0.82] text-cream">PEDIR</span>
            <span className="font-display text-[72px] leading-[0.82] text-mostaza">AHORA.</span>
          </div>
          <p className="font-sans text-cream/45 text-sm leading-relaxed mb-8 max-w-[270px]">
            Jackets de autor a domicilio.
            <br />Cabecera · Cañaveral · Sotomayor.
          </p>
          <a href="/menu" className="s-btn">IR A PEDIR</a>
          <span className="font-mono text-[8px] text-cream/20 uppercase tracking-[3px] mt-5">
            30–45 MIN · ENTREGA A DOMICILIO
          </span>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
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
