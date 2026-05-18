"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import { motion, useInView } from "framer-motion";
import DragSticker from "@/components/DragSticker";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import MobileCanvas from "@/components/MobileCanvas";

const DESKTOP_BREAKPOINT = 1024;


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


export default function Home() {
  const isDesktop = useIsDesktop();
  const { config, editMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("home");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [titleHovered, setTitleHovered] = useState(false);
  const [artGalleryHovered, setArtGalleryHovered] = useState(false);
  const [jacketClubHovered, setJacketClubHovered] = useState(false);
  const router = useRouter();

  const hero = config.zones.hero?.elements;
  const d = {
    titleSize:    (hero?.title?.props?.fontSize as { value: number })?.value ?? 19.5,
    titleLeft:    (hero?.title?.props?.left as { value: number })?.value ?? 42,
    titleTop:     (hero?.title?.props?.top as { value: number })?.value ?? 15,
    potatoWidth:  (hero?.image?.props?.width as { value: number })?.value ?? 48,
    potatoLeft:   (hero?.image?.props?.left as { value: number })?.value ?? -4.2,
    potatoBottom: (hero?.image?.props?.bottom as { value: number })?.value ?? 195,
    subtitleText:     (hero?.subtitle?.props?.content as string) ?? "JACKETS DIFFERENT BY DEFAULT",
    subtitleSize:     (hero?.subtitle?.props?.fontSize as { value: number })?.value ?? 3,
    subtitleLeft:     (hero?.subtitle?.props?.left as { value: number })?.value ?? 42,
    subtitleBottom:   (hero?.subtitle?.props?.bottom as { value: number })?.value ?? 30,
    subtitleRotation: (hero?.subtitle?.props?.rotation as { value: number })?.value ?? -2,
    globeStickerLeft:   (hero?.globeSticker?.props?.left as { value: number })?.value ?? 28,
    globeStickerTop:    (hero?.globeSticker?.props?.top as { value: number })?.value ?? 28,
    globeStickerSize:   (hero?.globeSticker?.props?.width as { value: number })?.value ?? 8,
    globeTextOffset:    (hero?.globeSticker?.props?.textOffset as { value: number })?.value ?? 0,
    globeTextRadius:    (hero?.globeSticker?.props?.textRadius as { value: number })?.value ?? 46,
    globeFontSize:      (hero?.globeSticker?.props?.fontSize as { value: number })?.value ?? 7.5,
    globeRadius:        (hero?.globeSticker?.props?.globeRadius as { value: number })?.value ?? 22,
    locationLeft:       (hero?.location?.props?.left as { value: number })?.value ?? 33,
    locationTop:        (hero?.location?.props?.top as { value: number })?.value ?? 36,
    locationFontSize:   (hero?.location?.props?.fontSize as { value: number })?.value ?? 0.54,
    locationLineHeight: (hero?.location?.props?.lineHeight as { value: number })?.value ?? 1.6,
    locationGap:        (hero?.location?.props?.gap as { value: number })?.value ?? 8,
    locationGlobeOffY:  (hero?.location?.props?.globeOffsetY as { value: number })?.value ?? 0,
    locationGlobeSize:  (hero?.location?.props?.globeSize as { value: number })?.value ?? 0.9,
    menuListSize:   (hero?.menuList?.props?.fontSize as { value: number })?.value ?? 0.65,
    menuListLeft:   (hero?.menuList?.props?.left as { value: number })?.value ?? 2,
    menuListBottom: (hero?.menuList?.props?.bottom as { value: number })?.value ?? 6,
    menuListWidth:  (hero?.menuList?.props?.width as { value: number })?.value ?? 28,
    jacketClubLeft:  (hero?.jacketClub?.props?.left as { value: number })?.value ?? 3,
    jacketClubTop:   (hero?.jacketClub?.props?.top as { value: number })?.value ?? 10,
    jacketClubWidth: (hero?.jacketClub?.props?.width as { value: number })?.value ?? 12,
    underlineWidth:    (hero?.underline?.props?.width as { value: number })?.value ?? 25,
    underlineLeft:     (hero?.underline?.props?.left as { value: number })?.value ?? 59,
    underlineBottom:   (hero?.underline?.props?.bottom as { value: number })?.value ?? 40,
    underlineRotation: (hero?.underline?.props?.rotation as { value: number })?.value ?? -2.5,
    bodyCopyLeft:   (hero?.bodyCopy?.props?.left as { value: number })?.value ?? 38,
    bodyCopyBottom: (hero?.bodyCopy?.props?.bottom as { value: number })?.value ?? 12,
    bodyCopySize:   (hero?.bodyCopy?.props?.fontSize as { value: number })?.value ?? 3.2,
    artGallerySize:   (hero?.artGallery?.props?.fontSize as { value: number })?.value ?? 7,
    artGalleryBottom: (hero?.artGallery?.props?.bottom as { value: number })?.value ?? 120,
    artGalleryLeft:   (hero?.artGallery?.props?.left as { value: number })?.value ?? 2,
    heroImage:    (hero?.image?.props?.src as { value: string })?.value ?? "/images/la-fija.png",
    miercolesDadosWidth:    (hero?.miercolesDados?.props?.width as { value: number })?.value ?? 13,
    miercolesDadosLeft:     (hero?.miercolesDados?.props?.left as { value: number })?.value ?? 3,
    miercolesDadosBottom:   (hero?.miercolesDados?.props?.bottom as { value: number })?.value ?? 10,
    miercolesDadosRotation: (hero?.miercolesDados?.props?.rotation as { value: number })?.value ?? -14,
  };

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
        background: "transparent",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" style={{ ...F.display, fontSize: "1.9rem", letterSpacing: "0.05em", color: C.burgundy, textDecoration: "none" }}>SPRINGS</a>
          <span style={{ color: C.tinta, fontSize: "0.85rem" }}>✦</span>
          <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.tinta, lineHeight: 1.4, textTransform: "uppercase", opacity: 0.6 }}>
            BRITISH SOUL<br />FOR HUNGRY PEOPLE.
          </div>
        </div>
        <div />
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
        background: "transparent",
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
        <div style={{ display: "flex", gap: 28 }}>
          {([
            { label: "CARTA",    href: "/menu" },
            { label: "JACKETS",  href: "/menu" },
            { label: "LOADED",   href: "/menu" },
            { label: "NOSOTROS", href: "#"     },
            { label: "EL CLUB",  href: "#"     },
          ] as { label: string; href: string }[]).map(item => (
            <a key={item.label} href={item.href} style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: C.tinta, textDecoration: "none", opacity: 0.65 }}>
              {item.label}
            </a>
          ))}
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
            src={d.heroImage}
            alt="SPRINGS Jacket"
            drag={editMode}
            dragMomentum={false}
            style={{
              position: "absolute",
              left: `${d.potatoLeft}vw`,
              bottom: `${d.potatoBottom}px`,
              width: `${d.potatoWidth}vw`,
              height: "auto",
              zIndex: 2,
              cursor: editMode ? "grab" : "default",
              outline: editMode ? "2px dashed rgba(197,135,31,0.6)" : "none",
            }}
          />

          {/* ART GALLERY — efecto cubo real con preserve-3d (mismo patrón que SPRINGS) */}
          <div style={{
            position: "absolute", left: `${d.artGalleryLeft}vw`, bottom: d.artGalleryBottom,
            zIndex: 1,
          }}>
            <div
              onMouseEnter={() => setArtGalleryHovered(true)}
              onMouseLeave={() => setArtGalleryHovered(false)}
              style={{
                perspective: "2500px",
                fontSize: `clamp(40px, ${d.artGallerySize}vw, 400px)`,
                lineHeight: 1,
                cursor: "default",
                width: "fit-content",
                clipPath: "inset(0 -800px)",
              }}
            >
              <motion.div
                animate={artGalleryHovered ? { rotateX: -90 } : { rotateX: 0 }}
                transition={{ type: "tween", duration: 0.45, ease: [0.45, 0, 0.55, 1] }}
                style={{
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 50% -0.5em",
                }}
              >
                {/* Cara FRONT */}
                <h2
                  style={{
                    ...F.display,
                    fontSize: "1em",
                    color: C.tinta,
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                    margin: 0,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    position: "relative",
                    backfaceVisibility: "hidden",
                  }}
                >
                  ART GALLERY
                </h2>

                {/* Cara TOP */}
                <h2
                  style={{
                    ...F.display,
                    fontSize: "1em",
                    color: C.tinta,
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                    margin: 0,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: "translateY(-50%) translateZ(-0.5em) rotateX(90deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  ART GALLERY
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Listado de productos — debajo de ART GALLERY */}
          <div style={{
            position: "absolute",
            left: `${d.menuListLeft}vw`,
            bottom: `${d.menuListBottom}vh`,
            width: `${d.menuListWidth}vw`,
            zIndex: 2,
          }}>
            <p style={{
              ...F.mono,
              fontSize: `clamp(9px, ${d.menuListSize}vw, 18px)`,
              color: C.tinta,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              wordSpacing: "-0.15em",
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.75,
            }}>
              LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA / LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
            </p>
          </div>


          {/* Globe + ubicación */}
          <div style={{ position: "absolute", left: `${d.locationLeft}vw`, top: `${d.locationTop}vh`, zIndex: 5, display: "flex", alignItems: "flex-start", gap: d.locationGap }}>
            <span style={{ ...F.mono, fontSize: `${d.locationGlobeSize}rem`, color: C.tinta, opacity: 0.55, lineHeight: 1, marginTop: d.locationGlobeOffY }}>⊕</span>
            <div style={{ ...F.mono, fontSize: `${d.locationFontSize}rem`, letterSpacing: "0.18em", color: C.tinta, lineHeight: d.locationLineHeight, textTransform: "uppercase", opacity: 0.7 }}>
              Barbosa STDR – COLOMBIA<br />EST. 2025
            </div>
          </div>

          {/* SPRINGS — cubo real con preserve-3d. Las dos caras son parte de UNA
              estructura 3D rígida (front + top del cubo). El wrapper rota -90° y
              ambas caras viajan juntas, manteniendo siempre la arista compartida. */}
          <div style={{ position: "absolute", left: `${d.titleLeft}vw`, top: `${d.titleTop}vh`, zIndex: 3 }}>
            <div
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
              style={{
                perspective: "2500px",
                fontSize: `clamp(120px, ${d.titleSize}vw, 340px)`,
                lineHeight: 1,
                cursor: "default",
                width: "fit-content",
                clipPath: "inset(0 -800px)",
              }}
            >
              {/* Wrapper cubo: preserve-3d, pivot en el CENTRO del cubo (0.5em atrás)
                  para que la rotación sea como un cubo rodando hacia adelante. */}
              <motion.div
                animate={titleHovered ? { rotateX: -90 } : { rotateX: 0 }}
                transition={{ type: "tween", duration: 0.45, ease: [0.45, 0, 0.55, 1] }}
                style={{
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 50% -0.5em",
                }}
              >
                {/* Cara FRONT — en flujo, define el tamaño del wrapper.
                    backface-visibility: hidden la oculta cuando rota -90° (la cara queda
                    mirando hacia abajo y el espectador ve el reverso, que se oculta). */}
                <h1
                  style={{
                    ...F.display,
                    fontSize: "1em",
                    color: C.tinta,
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    position: "relative",
                    backfaceVisibility: "hidden",
                  }}
                >
                  SPRINGS
                  <span style={{ position: "absolute", top: "30%", right: "22%", fontSize: "0.12em", color: C.tinta, opacity: 0.9 }}>✦</span>
                </h1>

                {/* Cara TOP — acostada horizontalmente arriba del front.
                    Transform: rotateX(+90) la pone con la SUPERFICIE DEL TEXTO mirando
                    hacia ARRIBA (no abajo). Luego translateZ(-0.5em) la mueve hacia atrás
                    (a la profundidad del cubo) y translateY(-50%) la sube al borde superior.
                    Resultado: acostada en el plano y=0, extendiéndose en -Z, texto facing UP.
                    Al rotar el wrapper -90°, queda al frente con el texto orientado correcto. */}
                <h1
                  style={{
                    ...F.display,
                    fontSize: "1em",
                    color: C.tinta,
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: "translateY(-50%) translateZ(-0.5em) rotateX(90deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  SPRINGS
                  <span style={{ position: "absolute", top: "30%", right: "22%", fontSize: "0.12em", color: C.tinta, opacity: 0.9 }}>✦</span>
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Subtítulo handmade — tipografía marker + trazo sketchy.
              Posición independiente controlable desde el DevPanel
              (left, bottom, fontSize, rotation). */}
          {/* Subtítulo handmade */}
          <div style={{
            position: "absolute",
            left: `${d.subtitleLeft}vw`,
            bottom: `${d.subtitleBottom}vh`,
            transform: `rotate(${d.subtitleRotation}deg)`,
            transformOrigin: "left center",
            zIndex: 5,
            width: "fit-content",
          }}>
            <div style={{
              fontFamily: "var(--font-marker), cursive",
              fontSize: `clamp(20px, ${d.subtitleSize}vw, 96px)`,
              color: C.burgundy,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {d.subtitleText}
            </div>
          </div>

          {/* Trazo de pincel — PNG con fondo transparente */}
          <img
            src="/images/underline-stroke.png"
            alt=""
            style={{
              position: "absolute",
              left: `${d.underlineLeft}vw`,
              bottom: `${d.underlineBottom}vh`,
              width: `${d.underlineWidth}vw`,
              height: "auto",
              transform: `rotate(${d.underlineRotation}deg)`,
              transformOrigin: "left center",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />

          {/* Body copy */}
          <div style={{ position: "absolute", left: `${d.bodyCopyLeft}vw`, bottom: `${d.bodyCopyBottom}vh`, zIndex: 5 }}>
            <div style={{ ...F.display, fontSize: `clamp(20px, ${d.bodyCopySize}vw, 72px)`, color: C.tinta, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
                <svg width="0.7em" height="0.7em" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginBottom: "0.1em" }}>
                  <line x1="21" y1="21" x2="3" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round"/>
                  <polyline points="3,11 3,3 11,3" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Jacket
              </div>
              <div style={{ paddingLeft: "calc(0.7em + 0.3em)" }}>La Fija</div>
            </div>
          </div>

          {/* + símbolo top-right */}
          <span style={{ position: "absolute", left: "97vw", top: "42vh", ...F.display, fontSize: "1.8rem", color: C.tinta, opacity: 0.4, zIndex: 5 }}>+</span>

          {/* ─── STICKERS ────────────────────────────────── */}

          {/* 1. SPRINGS Jacket Club — sticker imagen, drag + hover swap + link */}
          <motion.img
            src={jacketClubHovered ? "/images/jacket-club-sticker-hover.png" : "/images/jacket-club-sticker.png"}
            alt="SPRINGS Jacket Club"
            drag
            dragTransition={{ power: 0.8, timeConstant: 350 }}
            onDragStart={pauseScroll}
            onDragEnd={resumeScroll}
            whileDrag={{ scale: 1.03 }}
            onHoverStart={() => setJacketClubHovered(true)}
            onHoverEnd={() => setJacketClubHovered(false)}
            onTap={() => router.push("/springs-jacket-club")}
            style={{
              position: "absolute",
              left: `${d.jacketClubLeft}vw`,
              top: `${d.jacketClubTop}vh`,
              width: `${d.jacketClubWidth}vw`,
              height: "auto",
              zIndex: 20,
              cursor: jacketClubHovered ? "pointer" : "grab",
            }}
          />

          {/* 2. FOR THE MOST CHIMBA PEOPLE — círculo con globo */}
          <DragSticker rotate={-5} idleRotateRange={3} idleDuration={8}
            onDragStart={pauseScroll} onDragEnd={resumeScroll}
            style={{
              position: "absolute", left: `${d.globeStickerLeft}vw`, top: `${d.globeStickerTop}vh`, zIndex: 1,
              width: `${d.globeStickerSize}vw`, height: `${d.globeStickerSize}vw`,
              background: C.cream,
              boxShadow: `0 0 0 5px ${C.cream}, 0 0 0 7px ${C.tinta}`,
              clipPath: "circle(50%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 110 110" width="100%" height="100%">
              {/* Globo con más líneas — radio dinámico */}
              {(() => {
                const gr = d.globeRadius;
                return (
                  <>
                    <circle cx="55" cy="55" r={gr} fill="none" stroke={C.tinta} strokeWidth="1.2" opacity={0.8}/>
                    <ellipse cx="55" cy="55" rx={+(gr*0.36).toFixed(1)} ry={gr} fill="none" stroke={C.tinta} strokeWidth="0.9" opacity={0.6}/>
                    <ellipse cx="55" cy="55" rx={+(gr*0.77).toFixed(1)} ry={gr} fill="none" stroke={C.tinta} strokeWidth="0.9" opacity={0.5}/>
                    <ellipse cx="55" cy="55" rx={gr} ry={+(gr*0.41).toFixed(1)} fill="none" stroke={C.tinta} strokeWidth="0.9" opacity={0.6}/>
                    <ellipse cx="55" cy="55" rx={gr} ry={+(gr*0.77).toFixed(1)} fill="none" stroke={C.tinta} strokeWidth="0.8" opacity={0.45}/>
                    <line x1={55-gr} y1="55" x2={55+gr} y2="55" stroke={C.tinta} strokeWidth="0.8" opacity={0.45}/>
                    <line x1="55" y1={55-gr} x2="55" y2={55+gr} stroke={C.tinta} strokeWidth="0.8" opacity={0.45}/>
                  </>
                );
              })()}
              {/* Texto — círculo dinámico que empieza en las 7 del reloj */}
              {(() => {
                const r = d.globeTextRadius;
                const sx = +(55 - r * 0.5).toFixed(1);
                const sy = +(55 + r * 0.866).toFixed(1);
                const dy = +(r * 1.732).toFixed(1);
                return (
                  <>
                    <path id="hot-circle" fill="none" d={`M${sx},${sy} a${r},${r} 0 0,1 ${r},${-dy} a${r},${r} 0 0,1 ${-r},${dy}`}/>
                    <text fontFamily="JetBrains Mono, monospace" fontSize={d.globeFontSize} letterSpacing="1.0" fill={C.tinta} fillOpacity={0.8}>
                      <textPath href="#hot-circle" startOffset={`${d.globeTextOffset}%`}>FOR THE MOST CHIMBA PEOPLE ✦ </textPath>
                    </text>
                  </>
                );
              })()}
            </svg>
          </DragSticker>

          {/* 9. MIÉRCOLES DE DADOS */}
          <motion.img
            src="/images/miercoles-dados-sticker.png"
            alt="Miércoles de Dados"
            drag
            dragTransition={{ power: 0.8, timeConstant: 350 }}
            onDragStart={pauseScroll}
            onDragEnd={resumeScroll}
            whileDrag={{ scale: 1.03 }}
            style={{
              position: "absolute",
              left: `${d.miercolesDadosLeft}vw`,
              bottom: `${d.miercolesDadosBottom}vh`,
              width: `${d.miercolesDadosWidth}vw`,
              height: "auto",
              zIndex: 22,
              cursor: "grab",
              transform: `rotate(${d.miercolesDadosRotation}deg)`,
            }}
          />


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
          config={config}
          saved={saved}
          onUpdate={updateProp}
          onSave={save}
          onExport={exportValues}
          onReset={reset}
        />
      )}
    </>
  );
}
