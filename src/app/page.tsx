"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import { motion, useInView } from "framer-motion";
import DragSticker from "@/components/DragSticker";
import DevPanel, { type DesignValues } from "@/components/DevPanel";
import MobileCanvas from "@/components/MobileCanvas";

const DESKTOP_BREAKPOINT = 1024;

function useEditMode() {
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    setEditMode(new URLSearchParams(window.location.search).get("edit") === "1");
  }, []);
  return editMode;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

// Helper: elemento que aparece al entrar al viewport
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

const DEFAULT_DESIGN: DesignValues = {
  titleSize:        19.5,
  titleLeft:        42,
  titleTop:         15,
  potatoWidth:      48,
  potatoLeft:       -4.2,
  potatoBottom:     195,
  subtitleSize:     2.3,
  bodyCopyLeft:     54,
  artGallerySize:   14,
  artGalleryBottom: 44,
  artGalleryLeft:   1,
};

export default function Home() {
  const isDesktop = useIsDesktop();
  const editMode = useEditMode();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [design, setDesign] = useState<DesignValues>(DEFAULT_DESIGN);
  const [potatoDrag, setPotatoDrag] = useState({ x: 0, y: 0 });

  const setVal = useCallback(
    (key: keyof DesignValues, val: number) => setDesign(d => ({ ...d, [key]: val })),
    [],
  );

  const pauseScroll = () => lenisRef.current?.stop();
  const resumeScroll = () => lenisRef.current?.start();

  useEffect(() => {
    if (isDesktop !== true) return;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isDesktop]);

  // Default a mobile mientras detectamos viewport (mobile-first).
  // Switcheamos a canvas desktop solo si confirmamos ancho >= 1024.
  if (isDesktop !== true) {
    return <MobileCanvas />;
  }

  // Estilos base
  const F = {
    display: { fontFamily: "Anton, sans-serif" },
    sans:    { fontFamily: "Inter, sans-serif" },
    mono:    { fontFamily: "JetBrains Mono, monospace" },
  };
  const C = {
    burgundy: "#6B1419",
    cream: "#F2E8D5",
    tinta: "#1A0A0C",
    mostaza: "#C5871F",
  };

  return (
    <>
      {/* ── NAV TOP FIJO ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 64,
        background: C.cream,
        borderBottom: `1px solid rgba(26,10,12,0.12)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.18em", color: C.tinta, textDecoration: "none" }}>SPRINGS</a>
          <span style={{ color: C.tinta, fontSize: "0.85rem" }}>✦</span>
          <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.tinta, lineHeight: 1.4, textTransform: "uppercase", opacity: 0.6 }}>
            BRITISH SOUL<br />FOR HUNGRY PEOPLE.
          </div>
        </div>
        <ul style={{ display: "flex", gap: 34, listStyle: "none", margin: 0, padding: 0 }}>
          {([
            { label: "CARTA",    href: "/menu" },
            { label: "JACKETS",  href: "/menu" },
            { label: "LOADED",   href: "/menu" },
            { label: "NOSOTROS", href: "#"     },
            { label: "EL CLUB",  href: "#"     },
          ] as { label: string; href: string }[]).map(item => (
            <li key={item.label}>
              <a href={item.href} style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.2em", color: C.tinta, textDecoration: "none", opacity: 0.7 }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/menu" style={{
          ...F.display, fontSize: "0.82rem", letterSpacing: "0.14em",
          background: C.burgundy, color: C.cream,
          padding: "16px 26px", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          PEDIR AHORA <span>↗</span>
        </a>
      </nav>

      {/* ── FOOTER BAR FIJO ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 40,
        background: C.cream,
        borderTop: `1px solid rgba(26,10,12,0.1)`,
      }}>
        <div style={{ display: "flex", gap: 22 }}>
          {["INSTAGRAM", "TIKTOK", "SPOTIFY"].map(s => (
            <a key={s} href="#" style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: C.tinta, textDecoration: "none", opacity: 0.6 }}>{s}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          {[2,1,3,1,1,2,1,3,2,1,1,2,3,1,2,1,1,3,2,1,1,2,1,2].map((w, i) => (
            <div key={i} style={{ width: w * 2, height: 18, background: i % 2 === 0 ? C.tinta : "transparent" }} />
          ))}
          <span style={{ ...F.mono, fontSize: "0.42rem", color: C.tinta, opacity: 0.5, marginLeft: 6 }}>SPRINGS · 2024 ©</span>
        </div>
        <div style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: C.tinta, opacity: 0.65 }}>
          LA JACKET ES EL PRODUCTO HOY. ✦
        </div>
      </div>

      {/* ── WRAPPER LENIS ── */}
      <div ref={wrapperRef} style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.cream }}>
        {/* ── CANVAS CONTINUO 500vw ── */}
        <div ref={contentRef} style={{ position: "relative", width: "500vw", height: "100vh" }}>

          {/* ═══════════════════════════════════════
              ZONA 1 — HERO (0 → 100vw)
          ═══════════════════════════════════════ */}

          {/* Papa hero — izquierda desde abajo */}
          <motion.img
            src="/images/la-fija.png"
            alt="SPRINGS Jacket"
            drag={editMode}
            dragMomentum={false}
            onDrag={(_, info) => setPotatoDrag({ x: info.offset.x, y: info.offset.y })}
            onDragEnd={(_, info) => setPotatoDrag({ x: info.offset.x, y: info.offset.y })}
            style={{
              position: "absolute",
              left: `${design.potatoLeft}vw`,
              bottom: `${design.potatoBottom}px`,
              width: `${design.potatoWidth}vw`,
              height: "calc(100vh - 104px)",
              objectFit: "contain", objectPosition: "bottom left",
              zIndex: 2,
              cursor: editMode ? "grab" : "default",
              outline: editMode ? "2px dashed rgba(197,135,31,0.6)" : "none",
            }}
          />

          {/* ART GALLERY — texto masivo debajo de la papa */}
          <div style={{
            position: "absolute", left: `${design.artGalleryLeft}vw`, bottom: design.artGalleryBottom,
            width: "100vw", zIndex: 1,
            overflow: "hidden", pointerEvents: "none",
            display: "flex", alignItems: "baseline", gap: "2vw",
          }}>
            <div style={{
              ...F.mono, fontSize: "0.55rem", letterSpacing: "0.2em",
              color: C.tinta, opacity: 0.45, whiteSpace: "nowrap",
              display: "flex", flexDirection: "column", gap: 3,
              paddingBottom: 6,
            }}>
              <span>S24 ↗</span>
              <span style={{ fontSize: "0.45rem", opacity: 0.7 }}>SPRINGS</span>
            </div>
            <h2 style={{
              ...F.display,
              fontSize: `clamp(40px, ${design.artGallerySize}vw, 280px)`,
              color: C.tinta, lineHeight: 0.88,
              margin: 0, letterSpacing: "-0.025em",
              textTransform: "uppercase", whiteSpace: "nowrap",
            }}>
              ART GALLERY
            </h2>
          </div>

          {/* Sello circular "HECHA PARA LOS DE VERDAD" */}
          <svg
            viewBox="0 0 130 130" width="120" height="120"
            style={{ position: "absolute", left: "-1vw", top: "37vh", zIndex: 5 }}
          >
            <circle cx="65" cy="65" r="58" fill="none" stroke={C.tinta} strokeWidth="1.2" opacity={0.5} />
            <circle cx="65" cy="65" r="50" fill="none" stroke={C.tinta} strokeWidth="0.5" opacity={0.25} />
            <path id="stamp-path" fill="none" d="M65,65 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="2.5" fill={C.tinta} fillOpacity={0.7}>
              <textPath href="#stamp-path">★ HECHA PARA LOS DE VERDAD ★ </textPath>
            </text>
            <text x="44" y="52" fontFamily="sans-serif" fontSize="8" fill={C.tinta} fillOpacity={0.5}>★</text>
            <text x="76" y="52" fontFamily="sans-serif" fontSize="8" fill={C.tinta} fillOpacity={0.5}>★</text>
            {/* Icono linterna */}
            <rect x="60" y="86" width="10" height="4" fill={C.tinta} opacity={0.55}/>
            <rect x="57" y="68" width="16" height="18" fill="none" stroke={C.tinta} strokeWidth="1.4" opacity={0.55}/>
            <path d="M61 68 L61 62 Q65 57 69 62 L69 68" fill="none" stroke={C.tinta} strokeWidth="1.3" opacity={0.55}/>
            <rect x="59" y="70" width="12" height="12" fill={C.mostaza} opacity={0.15}/>
            <line x1="57" y1="68" x2="73" y2="68" stroke={C.tinta} strokeWidth="1.2" opacity={0.55}/>
            <line x1="57" y1="86" x2="73" y2="86" stroke={C.tinta} strokeWidth="1.2" opacity={0.55}/>
          </svg>

          {/* Globe + ubicación */}
          <div style={{ position: "absolute", left: "33vw", top: "36vh", zIndex: 5, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ ...F.mono, fontSize: "0.9rem", color: C.tinta, opacity: 0.55, lineHeight: 1 }}>⊕</span>
            <div style={{ ...F.mono, fontSize: "0.54rem", letterSpacing: "0.18em", color: C.tinta, lineHeight: 1.6, textTransform: "uppercase", opacity: 0.7 }}>
              BGA – COLOMBIA<br />EST. 2024
            </div>
          </div>

          {/* SPRINGS — título masivo */}
          <div style={{ position: "absolute", left: `${design.titleLeft}vw`, top: `${design.titleTop}vh`, zIndex: 3 }}>
            <h1 style={{
              ...F.display,
              fontSize: `clamp(120px, ${design.titleSize}vw, 340px)`,
              color: C.tinta, lineHeight: 0.85,
              letterSpacing: "-0.01em", margin: 0,
              textTransform: "uppercase", position: "relative",
              whiteSpace: "nowrap",
            }}>
              SPRINGS
              <span style={{ position: "absolute", top: "30%", right: "22%", fontSize: "0.12em", color: C.tinta, opacity: 0.9 }}>✦</span>
            </h1>
            {/* Subtítulo — Playfair Display Italic + brush underline SVG */}
            <div style={{ position: "relative", width: "fit-content", marginTop: 6 }}>
              <div style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontStyle: "italic", fontWeight: 800,
                fontSize: `clamp(18px, ${design.subtitleSize}vw, 42px)`,
                color: C.burgundy, letterSpacing: "0.02em",
                textTransform: "uppercase", lineHeight: 1,
                paddingBottom: 10,
              }}>
                Jackets That Hit Different.
              </div>
              {/* Brush stroke underline */}
              <svg viewBox="0 0 520 14" preserveAspectRatio="none"
                style={{ position: "absolute", bottom: -2, left: 0, width: "100%", height: 14 }}
              >
                <path
                  d="M4,10 C60,5 120,13 180,8 C240,3 300,12 360,7 C420,2 470,11 516,7"
                  fill="none" stroke={C.burgundy} strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  opacity={0.85}
                />
              </svg>
            </div>
          </div>

          {/* Body copy */}
          <div style={{ position: "absolute", left: `${design.bodyCopyLeft}vw`, bottom: "12vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.68rem", letterSpacing: "0.14em", color: C.tinta, lineHeight: 2.1, textTransform: "uppercase", opacity: 0.85 }}>
              NO ES SOLO COMIDA.<br />
              ES UN PLAN.<br />
              ES UN LUGAR.<br />
              ES SPRINGS.
            </div>
            <span style={{ ...F.mono, fontSize: "0.8rem", color: C.tinta, opacity: 0.3, display: "block", marginTop: 14 }}>✦</span>
          </div>

          {/* + símbolo top-right */}
          <span style={{ position: "absolute", left: "97vw", top: "42vh", ...F.display, fontSize: "1.8rem", color: C.tinta, opacity: 0.4, zIndex: 5 }}>+</span>

          {/* ─── STICKERS ────────────────────────────────── */}

          {/* 1. SPRINGS Jacket Club */}
          <DragSticker rotate={-8} idleRotateRange={2} idleDuration={7}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "3vw", top: "10vh", zIndex: 20,
              background: C.burgundy, padding: "14px 16px", textAlign: "center",
              boxShadow: `0 0 0 5px ${C.cream}, 0 0 0 7px ${C.tinta}`,
              width: "12vw",
            }}
          >
            <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.06em", lineHeight: 1, color: C.cream }}>SPRINGS</div>
            <div style={{ ...F.sans, fontSize: "0.78rem", fontStyle: "italic", fontWeight: 700, lineHeight: 1, marginTop: 2, color: C.cream }}>Jacket Club</div>
            <div style={{ ...F.mono, fontSize: "0.43rem", letterSpacing: "0.08em", marginTop: 8, lineHeight: 1.55, textTransform: "uppercase", color: C.cream, opacity: 0.85 }}>
              ESTO ES ALGO ASÍ<br />COMO QUE TE PAGAMOS<br />POR COMER SPRINGS
            </div>
            <div style={{ marginTop: 10, background: C.tinta, color: C.cream, padding: "5px 16px", display: "inline-flex", alignItems: "center", gap: 6, ...F.display, fontSize: "0.62rem", letterSpacing: "0.18em" }}>
              ENTRAR <span style={{ fontSize: "0.55rem" }}>✦</span>
            </div>
          </DragSticker>

          {/* 2. FOR THE HOTTEST PEOPLE — círculo con globo */}
          <DragSticker rotate={-5} idleRotateRange={3} idleDuration={8}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "28vw", top: "28vh", zIndex: 1,
              width: "8vw", height: "8vw",
              background: C.cream,
              boxShadow: `0 0 0 5px ${C.cream}, 0 0 0 7px ${C.tinta}`,
              clipPath: "circle(50%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 110 110" width="100%" height="100%">
              <circle cx="55" cy="55" r="22" fill="none" stroke={C.tinta} strokeWidth="1.2" opacity={0.8}/>
              <ellipse cx="55" cy="55" rx="12" ry="22" fill="none" stroke={C.tinta} strokeWidth="1.1" opacity={0.6}/>
              <ellipse cx="55" cy="55" rx="22" ry="8" fill="none" stroke={C.tinta} strokeWidth="1" opacity={0.6}/>
              <line x1="33" y1="55" x2="77" y2="55" stroke={C.tinta} strokeWidth="0.8" opacity={0.45}/>
              <line x1="55" y1="33" x2="55" y2="77" stroke={C.tinta} strokeWidth="0.8" opacity={0.45}/>
              <path id="hot-circle" fill="none" d="M55,55 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/>
              <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="2.2" fill={C.tinta} fillOpacity={0.8}>
                <textPath href="#hot-circle">FOR THE HOTTEST PEOPLE ✦ </textPath>
              </text>
            </svg>
          </DragSticker>

          {/* 3. SPRINGS™ [UNVRS] */}
          <DragSticker rotate={3} idleRotateRange={2.5} idleDuration={6}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "57vw", top: "9vh", zIndex: 20,
              padding: "20px 16px 10px", textAlign: "center",
              background: "#EDEAE4",
              boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px rgba(26,10,12,0.35)`,
              maxWidth: "13vw",
            }}
          >
            {/* Tape strip */}
            <div style={{
              position: "absolute", top: -7, left: "50%",
              transform: "translateX(-50%)",
              width: "55%", height: 14,
              background: "rgba(200,195,182,0.65)",
              border: "0.5px solid rgba(150,145,130,0.35)",
            }} />
            <div style={{ ...F.display, fontSize: "0.9rem", letterSpacing: "0.04em", color: C.tinta }}>SPRINGS™ [UNVRS]</div>
            <div style={{ ...F.mono, fontSize: "0.41rem", letterSpacing: "0.14em", color: C.tinta, marginTop: 4, textTransform: "uppercase", lineHeight: 1.55, opacity: 0.7 }}>
              SPRINGS (SPACE) JACKET CLUB X BGA<br />LIMITED EDITION
            </div>
          </DragSticker>

          {/* 4. RÓBALA */}
          <DragSticker rotate={6} idleRotateRange={2} idleDuration={5}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "90vw", top: "10vh", zIndex: 20,
              background: C.mostaza, padding: "14px 18px",
              boxShadow: `0 0 0 5px ${C.cream}, 0 0 0 7px ${C.tinta}`,
              width: "11vw",
            }}
          >
            <div style={{ ...F.display, fontSize: "1.65rem", letterSpacing: "0.03em", lineHeight: 1, color: C.tinta }}>RÓBALA</div>
            <div style={{ ...F.mono, fontSize: "0.43rem", letterSpacing: "0.1em", marginTop: 6, lineHeight: 1.55, textTransform: "uppercase", color: C.tinta, opacity: 0.85 }}>
              BONO ESCONDIDO<br />EN LA CIUDAD
            </div>
            <div style={{ marginTop: 8, background: C.tinta, color: C.mostaza, padding: "4px 10px", display: "inline-block", ...F.mono, fontSize: "0.5rem", letterSpacing: "0.18em" }}>
              STORIES →
            </div>
          </DragSticker>

          {/* 5. Dark sticker — foto letrero SPRINGS iluminado */}
          <DragSticker rotate={2} idleRotateRange={1.5} idleDuration={8}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "82vw", top: "45vh", zIndex: 20,
              width: "10vw",
              background: C.tinta,
              boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px ${C.tinta}`,
              overflow: "visible",
            }}
          >
            {/* Tape strip */}
            <div style={{
              position: "absolute", top: -7, left: "50%",
              transform: "translateX(-50%)",
              width: "42%", height: 13,
              background: "rgba(200,195,182,0.55)",
              border: "0.5px solid rgba(150,145,130,0.3)",
            }} />
            {/* Foto oscura */}
            <div style={{
              padding: "20px 14px 16px",
              background: "radial-gradient(ellipse at 45% 40%, #2a0a0c 0%, #080206 100%)",
              minHeight: "10vw",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 50% 55%, rgba(107,20,25,0.4) 0%, transparent 68%)",
              }} />
              <div style={{
                ...F.display, fontSize: "clamp(13px, 1.5vw, 20px)",
                color: C.burgundy, letterSpacing: "0.1em", lineHeight: 1,
                textShadow: `0 0 10px ${C.burgundy}, 0 0 20px rgba(107,20,25,0.7)`,
                position: "relative", zIndex: 1,
              }}>
                SPRINGS
              </div>
            </div>
            {/* S/2025 rotado en borde derecho */}
            <div style={{
              position: "absolute", right: -16, top: "50%",
              transform: "translateY(-50%) rotate(90deg)",
              ...F.mono, fontSize: "0.36rem", letterSpacing: "0.22em",
              color: C.cream, opacity: 0.4, whiteSpace: "nowrap",
            }}>
              S/2025
            </div>
          </DragSticker>

          {/* 6. AQUÍ TAMBIÉN NOS TOMAMOS EN SERIO LA PAPA */}
          <DragSticker rotate={4} idleRotateRange={2} idleDuration={6}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "73vw", top: "34vh", zIndex: 15,
              background: C.tinta, padding: "14px 16px",
              boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px ${C.tinta}`,
              width: "10vw",
            }}
          >
            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.cream, lineHeight: 1.65, textTransform: "uppercase", marginBottom: 8 }}>
              AQUÍ TAMBIÉN<br />NOS TOMAMOS<br />EN SERIO<br />LA PAPA
            </div>
            <span style={{ color: C.mostaza, fontSize: "0.85rem" }}>✦</span>
          </DragSticker>

          {/* 7. TU PLAN YA ESTÁ EN LA PUERTA */}
          <div style={{
            position: "absolute", left: "73vw", bottom: "8vh", zIndex: 8,
            width: "11vw", padding: "16px 18px",
            background: C.cream,
            boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px rgba(26,10,12,0.25)`,
          }}>
            <div style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.12em", color: C.tinta, lineHeight: 1.65, textTransform: "uppercase", marginBottom: 12 }}>
              TU PLAN<br />YA ESTÁ<br />EN LA PUERTA.
            </div>
            <svg viewBox="0 0 32 44" width={28} height={38} style={{ display: "block", margin: "0 auto", opacity: 0.5 }}>
              <rect x="12" y="38" width="8" height="4" fill={C.tinta}/>
              <rect x="9" y="18" width="14" height="20" fill="none" stroke={C.tinta} strokeWidth="1.5"/>
              <path d="M13 18 L13 12 Q16 8 19 12 L19 18" fill="none" stroke={C.tinta} strokeWidth="1.4"/>
              <rect x="11" y="20" width="10" height="14" fill={C.mostaza} opacity={0.3}/>
              <line x1="9" y1="18" x2="23" y2="18" stroke={C.tinta} strokeWidth="1.2"/>
              <line x1="9" y1="38" x2="23" y2="38" stroke={C.tinta} strokeWidth="1.2"/>
            </svg>
          </div>

          {/* 8. DELIVERY EN TODA BGA */}
          <div style={{
            position: "absolute", left: "86vw", bottom: "8vh", zIndex: 8,
            width: "12vw", padding: "18px 20px",
            background: C.burgundy,
            boxShadow: `0 0 0 4px ${C.cream}, 0 0 0 5.5px ${C.tinta}`,
          }}>
            <div style={{ ...F.display, fontSize: "clamp(18px, 1.8vw, 28px)", letterSpacing: "0.04em", color: C.cream, lineHeight: 1, marginBottom: 6 }}>DELIVERY</div>
            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.14em", color: C.cream, textTransform: "uppercase", marginBottom: 14, opacity: 0.8 }}>EN TODA BGA.</div>
            <a href="/menu" style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.16em", color: C.cream, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              VER MÁS <span>↗</span>
            </a>
          </div>

          {/* 9. MIÉRCOLES DE DADOS */}
          <DragSticker rotate={-14} idleRotateRange={3} idleDuration={6}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "3vw", bottom: "10vh", zIndex: 22,
              background: C.cream, color: C.tinta,
              padding: "12px 16px", textAlign: "center",
              boxShadow: `0 0 0 5px ${C.cream}, 0 0 0 7px ${C.tinta}`,
            }}
          >
            <div style={{ ...F.display, fontSize: "1.0rem", letterSpacing: "0.05em", lineHeight: 1 }}>MIÉRCOLES</div>
            <div style={{ ...F.sans, fontSize: "0.82rem", fontStyle: "italic", fontWeight: 700, lineHeight: 1, marginTop: 2 }}>de Dados</div>
            <div style={{
              margin: "8px auto 0", width: 32, height: 32,
              background: C.tinta, color: C.cream,
              ...F.display, fontSize: "1.3rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>6</div>
            <div style={{ ...F.mono, fontSize: "0.43rem", letterSpacing: "0.12em", marginTop: 5, textTransform: "uppercase", opacity: 0.65 }}>
              SACA 6 = GRATIS
            </div>
          </DragSticker>


          {/* ═══════════════════════════════════════
              ZONA 2 — JACKETS GRID (100 → 220vw)
          ═══════════════════════════════════════ */}

          {/* Foto editorial 1 — modelo con gafas */}
          <Reveal style={{ position: "absolute", left: "108vw", top: "22vh", zIndex: 4 }}>
            <div style={{
              width: "20vw", height: "60vh",
              background: `linear-gradient(160deg, ${C.burgundy} 0%, #4A0E12 100%)`,
              display: "flex", alignItems: "flex-end", padding: "16px",
            }}>
              <div>
                <div style={{ ...F.display, fontSize: "0.9rem", color: C.cream, letterSpacing: "0.08em" }}>LA FIJA</div>
                <div style={{ ...F.mono, fontSize: "0.7rem", color: C.mostaza, fontWeight: 600 }}>32,900</div>
              </div>
            </div>
          </Reveal>

          {/* Foto editorial 2 — packshot */}
          <Reveal delay={0.1} style={{ position: "absolute", left: "131vw", top: "18vh", zIndex: 4 }}>
            <div style={{
              width: "16vw", height: "52vh",
              background: `linear-gradient(180deg, #3a1818 0%, ${C.tinta} 100%)`,
              border: `2px solid ${C.cream}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px",
              position: "relative",
            }}>
              <div style={{
                ...F.display, fontSize: "clamp(28px, 3vw, 48px)",
                color: C.cream, letterSpacing: "0.02em",
                textAlign: "center", lineHeight: 0.95,
              }}>
                ESTO<br />ES<br />SPRINGS
              </div>
              <div style={{ position: "absolute", bottom: "14px", left: "16px", ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.mostaza }}>LA PESADA</div>
              <div style={{ position: "absolute", bottom: "14px", right: "16px", ...F.mono, fontSize: "0.6rem", color: C.mostaza, fontWeight: 600 }}>35,900</div>
            </div>
          </Reveal>

          {/* Foto editorial 3 — packaging */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "150vw", top: "26vh", zIndex: 4 }}>
            <div style={{
              width: "18vw", height: "56vh",
              background: C.tinta,
              backgroundImage: `repeating-linear-gradient(45deg, ${C.burgundy} 0px, ${C.burgundy} 24px, ${C.tinta} 24px, ${C.tinta} 48px)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ ...F.display, fontSize: "2.4rem", color: C.cream, letterSpacing: "0.04em", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
                SPRINGS
              </div>
            </div>
          </Reveal>

          {/* Sticker holográfico MUY RICA — draggable */}
          <DragSticker
            rotate={-4}
            idleRotateRange={4}
            idleDuration={5}
            onDragStart={pauseScroll}
            onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "127vw", top: "15vh", zIndex: 25,
              width: "60px", height: "60px",
              background: "linear-gradient(135deg, #c0e0ff 0%, #ffd0e0 50%, #e0e0ff 100%)",
              border: `1.5px solid ${C.tinta}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.tinta, textAlign: "center" }}>SPRINGS<br />MUY RICA</span>
          </DragSticker>

          {/* Sticker DROP — papa de temporada — draggable */}
          <DragSticker
            rotate={9}
            idleRotateRange={3}
            idleDuration={5.5}
            onDragStart={pauseScroll}
            onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: "164vw", top: "10vh", zIndex: 25,
              background: C.tinta, color: C.mostaza,
              padding: "10px 18px",
              border: `2px solid ${C.mostaza}`,
              textAlign: "center",
            }}
          >
            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", opacity: 0.7, marginBottom: "2px" }}>W25 · DROP</div>
            <div style={{ ...F.display, fontSize: "1.6rem", letterSpacing: "0.04em", color: C.cream, lineHeight: 1 }}>SOLO 20</div>
            <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.14em", marginTop: "4px" }}>POR NOCHE</div>
          </DragSticker>

          {/* "TE DAMOS LO TUYO" continuación */}
          <Reveal delay={0.1} style={{ position: "absolute", left: "172vw", top: "20vh", zIndex: 5 }}>
            <div style={{ ...F.sans, fontSize: "0.78rem", color: C.tinta, fontStyle: "italic" }}>TE DAMOS LO TUYO</div>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, marginTop: "3px" }}>@SPRINGS.COL</div>
          </Reveal>

          {/* QR + Daily Dose */}
          <Reveal style={{ position: "absolute", left: "172vw", top: "32vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.tinta, textTransform: "uppercase", marginBottom: "8px", maxWidth: "120px", lineHeight: 1.3 }}>
              DAILY DOSE<br />OF SPRINGS HERE
            </div>
            <div style={{
              width: "84px", height: "84px",
              background: C.tinta,
              backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 4px, ${C.cream} 4px, ${C.cream} 6px), repeating-linear-gradient(90deg, transparent 0px, transparent 4px, ${C.cream} 4px, ${C.cream} 6px)`,
              border: `2px solid ${C.tinta}`,
            }} />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ ...F.display, fontSize: "1rem", color: C.tinta }}>↗</span>
              <span style={{ width: "16px", height: "16px", border: `1.5px solid ${C.tinta}`, borderRadius: "50%" }} />
            </div>
          </Reveal>

          {/* Big black rectangle (como Vicio) */}
          <div style={{
            position: "absolute", left: "192vw", top: "12vh", zIndex: 3,
            width: "16vw", height: "32vh",
            background: C.tinta,
          }} />

          {/* Lista de Jackets en columna a la derecha */}
          <Reveal delay={0.3} style={{ position: "absolute", left: "108vw", bottom: "10vh", zIndex: 6, maxWidth: "90vw" }}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.8, textTransform: "uppercase", opacity: 0.55 }}>
              LA FIJA · POLLO DESMECHADO · 32,900 / LA PESADA · CARNE DESMECHADA · 35,900 /<br />
              LA BRAVA · CHORIZO SANTANDEREANO · 34,900 / LA SIMPLE · CARNE MOLIDA · 28,900 /<br />
              LA HONESTA · SIN CARNE · 28,900 /
            </div>
          </Reveal>


          {/* ═══════════════════════════════════════
              ZONA 3 — ABOUT / LOADED (220 → 380vw)
          ═══════════════════════════════════════ */}

          {/* Logo 3D placeholder — chrome SPRINGS */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute", left: "225vw", top: "18vh", zIndex: 4,
              width: "26vw", height: "32vh",
              background: `radial-gradient(ellipse at 30% 30%, #e8b8b8 0%, ${C.burgundy} 40%, ${C.tinta} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{
              ...F.display, fontSize: "clamp(60px, 7vw, 130px)",
              color: C.cream, letterSpacing: "0.02em",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
              fontStyle: "italic",
            }}>
              Springs
            </div>
            <span style={{ position: "absolute", top: "12%", right: "12%", color: C.cream, fontSize: "1.2rem", opacity: 0.8 }}>✦</span>
          </motion.div>

          {/* Foto packaging trio */}
          <Reveal style={{ position: "absolute", left: "256vw", top: "30vh", zIndex: 5 }}>
            <div style={{
              width: "18vw", height: "44vh",
              background: `repeating-linear-gradient(45deg, ${C.burgundy} 0, ${C.burgundy} 18px, ${C.tinta} 18px, ${C.tinta} 36px)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ ...F.display, fontSize: "2rem", color: C.cream, letterSpacing: "0.04em" }}>SPRINGS</div>
            </div>
          </Reveal>

          {/* Sneakers / brand artifact */}
          <Reveal delay={0.1} style={{ position: "absolute", left: "276vw", top: "12vh", zIndex: 4 }}>
            <div style={{
              width: "14vw", height: "36vh",
              background: `linear-gradient(180deg, ${C.tinta} 0%, #2a1010 100%)`,
              display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px",
            }}>
              <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.cream, opacity: 0.5, textTransform: "uppercase", marginBottom: "4px" }}>
                ▮▮▮▮ ▮▮ ▮▮▮ ▮▮▮▮
              </div>
              <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, fontStyle: "italic" }}>
                Y BUCARAMANGA<br />NOS DIÓ LO NUESTRO
              </div>
            </div>
          </Reveal>

          {/* FAQS rotada */}
          <div style={{
            position: "absolute", left: "292vw", top: "16vh", zIndex: 5,
            transform: "rotate(-90deg)", transformOrigin: "left top",
          }}>
            <div style={{ ...F.display, fontSize: "clamp(40px, 5vw, 80px)", color: C.tinta, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ ...F.mono, fontSize: "0.5em", opacity: 0.4 }}>↗</span> FAQS
            </div>
          </div>

          {/* Foto especial — La Brava */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "298vw", top: "12vh", zIndex: 4 }}>
            <div style={{
              width: "14vw", height: "32vh",
              backgroundImage: "url('/images/jacket-placeholder.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
            }}>
              <div style={{ ...F.display, fontSize: "1.6rem", color: C.cream, letterSpacing: "0.04em", textAlign: "center" }}>LA<br />BRAVA</div>
            </div>
          </Reveal>

          {/* ABOUT US gigante */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "236vw", bottom: "20vh", zIndex: 3, whiteSpace: "nowrap" }}>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(100px, 16vw, 280px)",
              color: C.tinta, lineHeight: 0.85,
              letterSpacing: "-0.005em", margin: 0,
              textTransform: "uppercase",
            }}>
              ABOUT US
            </h2>
          </Reveal>

          {/* Banner SPRINGS JACKET CLUB */}
          <Reveal delay={0.3} style={{ position: "absolute", left: "234vw", bottom: "10vh", zIndex: 4 }}>
            <div style={{
              display: "flex", alignItems: "stretch",
              background: C.cream,
              border: `2px solid ${C.tinta}`,
              transform: "skewX(-4deg)",
            }}>
              <div style={{ background: C.burgundy, padding: "10px 18px", display: "flex", alignItems: "center" }}>
                <span style={{ ...F.display, fontSize: "1rem", color: C.cream, letterSpacing: "0.1em" }}>SPRINGS™ — JACKET CLUB —</span>
              </div>
              <div style={{ padding: "10px 18px", display: "flex", alignItems: "center" }}>
                <span style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase" }}>
                  NO BULLSHIT JACKETS. JUST INGREDIENTES SANTANDEREANOS Y MÁS CALITÉ.
                </span>
              </div>
              <div style={{ background: C.burgundy, padding: "10px 18px", display: "flex", alignItems: "center" }}>
                <span style={{ ...F.display, fontSize: "1rem", color: C.cream, letterSpacing: "0.1em" }}>— ESTO ES SPRINGS —</span>
              </div>
            </div>
          </Reveal>

          {/* "FAST, GOOD & LOUD" */}
          <div style={{ position: "absolute", left: "266vw", bottom: "4vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase", lineHeight: 1.4 }}>
              FAST, GOOD &amp; LOUD<br />ESTO ES SPRINGS.
            </div>
          </div>

          {/* Burger detail bleeding al final */}
          <div style={{
            position: "absolute", left: "315vw", bottom: "12vh", zIndex: 4,
            width: "28vw", height: "64vh",
            backgroundImage: "url('/images/jacket-placeholder.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "ellipse(48% 50% at 50% 50%)",
          }} />

          <Reveal delay={0.2} style={{ position: "absolute", left: "318vw", top: "16vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase" }}>BUCARAMANGA · BGA</div>
            <div style={{ ...F.display, fontSize: "clamp(40px, 5vw, 96px)", color: C.tinta, marginTop: "12px", lineHeight: 0.9, textTransform: "uppercase" }}>
              SOLO<br />DELIVERY.
            </div>
            <div style={{ ...F.sans, fontSize: "0.85rem", fontStyle: "italic", color: C.tinta, opacity: 0.5, marginTop: "12px", maxWidth: "240px" }}>
              Dark kitchen. Sin local físico.<br />La papa va a vos, no al revés.
            </div>
          </Reveal>


          {/* ═══════════════════════════════════════
              ZONA 4 — PEDIR YA (380 → 500vw)
          ═══════════════════════════════════════ */}

          {/* Fondo burgundy panel pedir */}
          <div style={{
            position: "absolute", left: "380vw", top: 0,
            width: "120vw", height: "100vh",
            background: C.burgundy, zIndex: 1,
          }} />

          {/* PEDIR YA gigante */}
          <Reveal style={{ position: "absolute", left: "388vw", top: "20vh", zIndex: 3, whiteSpace: "nowrap" }}>
            <h2 id="pedir" style={{
              ...F.display,
              fontSize: "clamp(120px, 18vw, 320px)",
              color: C.cream, lineHeight: 0.85,
              margin: 0, letterSpacing: "-0.005em",
              textTransform: "uppercase",
            }}>
              PEDIR YA.
            </h2>
          </Reveal>

          <Reveal delay={0.1} style={{ position: "absolute", left: "388vw", top: "12vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase" }}>
              ↗ SIN EXCUSAS · ESTO ES SPRINGS
            </div>
          </Reveal>

          {/* Apps */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "390vw", bottom: "16vh", zIndex: 5, width: "26vw" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="#" style={{
                ...F.display, fontSize: "1rem", letterSpacing: "0.12em",
                color: C.tinta, background: C.cream,
                padding: "16px 24px", textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                RAPPI <span>→</span>
              </a>
              <a href="#" style={{
                ...F.display, fontSize: "1rem", letterSpacing: "0.12em",
                color: C.cream, background: "transparent",
                border: `1px solid ${C.cream}`, opacity: 0.9,
                padding: "16px 24px", textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                UBER EATS <span>→</span>
              </a>
              <a href="/menu" style={{
                ...F.display, fontSize: "1rem", letterSpacing: "0.12em",
                color: C.mostaza, background: "transparent",
                border: `1px solid ${C.mostaza}`,
                padding: "16px 24px", textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                PEDIDO DIRECTO <span>→</span>
              </a>
            </div>
          </Reveal>

          {/* Info derecha */}
          <Reveal delay={0.3} style={{ position: "absolute", left: "424vw", bottom: "16vh", zIndex: 5, width: "30vw" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {[
                { label: "Horario", val: "12PM — 9PM", sub: "Lunes a domingo" },
                { label: "Zona", val: "BUCARAMANGA", sub: "Cabecera · Cañaveral · Sotomayor" },
                { label: "Síguenos", val: "@SPRINGS.COL", sub: "Instagram · TikTok" },
                { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · Ahorra 9,900" },
              ].map((i) => (
                <div key={i.label} style={{ background: "rgba(242,232,213,0.06)", padding: "16px 22px", borderBottom: `1px solid rgba(242,232,213,0.06)` }}>
                  <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: "4px" }}>{i.label}</div>
                  <div style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.05em", color: C.cream }}>{i.val}</div>
                  <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.4, marginTop: "2px" }}>{i.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* "BUCARAMANGA" fantasma */}
          <div style={{
            position: "absolute", left: "470vw", top: "50%", transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "left center", whiteSpace: "nowrap", zIndex: 2,
            ...F.display, fontSize: "clamp(40px, 5vw, 100px)", color: C.cream, opacity: 0.07,
          }}>
            DIFFERENT BY DEFAULT.
          </div>

        </div>
      </div>

      {/* ── DEV PANEL — solo visible en ?edit=1 ── */}
      {editMode && (
        <DevPanel
          values={design}
          onChange={setVal}
          potatoDragOffset={potatoDrag}
        />
      )}
    </>
  );
}
