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
  const jacketClubDragged = useRef(false);
  const [miercolesDadosHovered, setMiercolesDadosHovered] = useState(false);
  const miercolesDadosDragged = useRef(false);
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
    marqueeSize:  (hero?.marquee?.props?.fontSize as { value: number })?.value ?? 2.4,
    marqueeTop:   (hero?.marquee?.props?.top as { value: number })?.value ?? 68,
    marqueeLeft:  (hero?.marquee?.props?.left as { value: number })?.value ?? 44,
    footerMenuSize:          (hero?.footerMenu?.props?.fontSize      as { value: number })?.value ?? 0.78,
    footerMenuBottom:        (hero?.footerMenu?.props?.bottom        as { value: number })?.value ?? 12,
    footerMenuRight:         (hero?.footerMenu?.props?.right         as { value: number })?.value ?? 32,
    footerMenuLetterSpacing: (hero?.footerMenu?.props?.letterSpacing as { value: number })?.value ?? 0.04,
    footerMenuItemGap:       (hero?.footerMenu?.props?.itemGap       as { value: number })?.value ?? 36,
    footerMenuWordSpacing:   (hero?.footerMenu?.props?.wordSpacing   as { value: number })?.value ?? 0,
    barcodeHeight:  (hero?.barcode?.props?.height as { value: number })?.value ?? 32,
    barcodeWidth:   (hero?.barcode?.props?.width as { value: number })?.value ?? 160,
    barcodeLeft:    (hero?.barcode?.props?.left as { value: number })?.value ?? 0,
    barcodeOpacity: (hero?.barcode?.props?.opacity as { value: number })?.value ?? 75,
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
            BRITISH SOUL<br />COLOMBIAN HEART.
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
        <div style={{
          display: "flex", gap: d.footerMenuItemGap,
          position: "fixed", bottom: d.footerMenuBottom, right: d.footerMenuRight,
          zIndex: 101,
        }}>
          {([
            { label: "CARTA",       href: "/menu"                },
            { label: "ART GALLERY", href: "#"                    },
            { label: "NOSOTROS",    href: "#"                    },
            { label: "EL CLUB",     href: "/springs-jacket-club" },
            { label: "FAQS",        href: "#"                    },
          ] as { label: string; href: string }[]).map(item => (
            <motion.a
              key={item.label}
              href={item.href}
              initial="rest"
              whileHover="hover"
              style={{ ...F.mono, fontSize: `${d.footerMenuSize}rem`, letterSpacing: `${d.footerMenuLetterSpacing}em`, wordSpacing: `${d.footerMenuWordSpacing}px`, textDecoration: "none", fontWeight: 600, position: "relative", display: "inline-block" }}
            >
              <motion.span
                variants={{ rest: { color: C.tinta }, hover: { color: C.burgundy } }}
                transition={{ duration: 0.2 }}
                style={{ display: "block" }}
              >
                {item.label}
              </motion.span>
              <motion.span
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "block", height: 1.5,
                  background: C.burgundy,
                  transformOrigin: "left center",
                  position: "absolute", bottom: -2, left: 0, right: 0,
                }}
              />
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── BARCODE FIXED ── */}
      <img
        src="/images/barcode-springs.png"
        alt="SPRINGS 2024"
        style={{
          position: "fixed", bottom: 4, left: `${d.barcodeLeft}vw`,
          height: d.barcodeHeight, width: d.barcodeWidth,
          objectFit: "contain", opacity: d.barcodeOpacity / 100,
          zIndex: 101, pointerEvents: "none",
        }}
      />

      {/* ── WRAPPER LENIS ── */}
      <div ref={wrapperRef} style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.cream }}>
        {/* ── CANVAS CONTINUO 270vw ── */}
        <div ref={contentRef} style={{ position: "relative", width: "270vw", height: "100vh" }}>

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

          {/* ─── MARQUEE TAPE ─── */}
          <div style={{
            position: "absolute",
            left: `${d.marqueeLeft}vw`,
            top: `${d.marqueeTop}vh`,
            width: `${270 - d.marqueeLeft}vw`,
            overflow: "hidden",
            zIndex: 6,
            borderTop: `1.5px solid ${C.tinta}`,
            borderBottom: `1.5px solid ${C.tinta}`,
            padding: "6px 0",
            background: C.cream,
          }}>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
            >
              {[0, 1].map(copy => (
                <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                      {/* Sólido */}
                      <span style={{
                        ...F.display,
                        fontSize: `clamp(18px, ${d.marqueeSize}vw, 60px)`,
                        color: C.burgundy,
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                      }}>SPRINGS</span>
                      <span style={{
                        ...F.display,
                        fontSize: `clamp(16px, ${d.marqueeSize * 0.8}vw, 52px)`,
                        color: C.burgundy,
                        WebkitTextStroke: `2px ${C.burgundy}`,
                        margin: "0 0.75em",
                        lineHeight: 1,
                      }}>&lt;</span>
                      {/* Outline */}
                      <span style={{
                        ...F.display,
                        fontSize: `clamp(18px, ${d.marqueeSize}vw, 60px)`,
                        color: "transparent",
                        WebkitTextStroke: `1.5px ${C.burgundy}`,
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                      }}>SPRINGS</span>
                      <span style={{
                        ...F.display,
                        fontSize: `clamp(16px, ${d.marqueeSize * 0.8}vw, 52px)`,
                        color: C.burgundy,
                        WebkitTextStroke: `2px ${C.burgundy}`,
                        margin: "0 0.75em",
                        lineHeight: 1,
                      }}>&lt;</span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.div>
          </div>

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
            onPointerDown={() => { jacketClubDragged.current = false; }}
            onDragStart={() => { jacketClubDragged.current = true; pauseScroll(); }}
            onDragEnd={resumeScroll}
            whileDrag={{ scale: 1.03 }}
            onHoverStart={() => setJacketClubHovered(true)}
            onHoverEnd={() => setJacketClubHovered(false)}
            onTap={() => { if (!jacketClubDragged.current) router.push("/springs-jacket-club"); }}
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
            src={miercolesDadosHovered ? "/images/miercoles-dados-sticker-hover.png" : "/images/miercoles-dados-sticker.png"}
            alt="Miércoles de Dados"
            drag
            dragTransition={{ power: 0.8, timeConstant: 350 }}
            onPointerDown={() => { miercolesDadosDragged.current = false; }}
            onDragStart={() => { miercolesDadosDragged.current = true; pauseScroll(); }}
            onDragEnd={resumeScroll}
            whileDrag={{ scale: 1.03 }}
            onHoverStart={() => setMiercolesDadosHovered(true)}
            onHoverEnd={() => setMiercolesDadosHovered(false)}
            onTap={() => { if (!miercolesDadosDragged.current) router.push("/prueba-tu-suerte"); }}
            style={{
              position: "absolute",
              left: `${d.miercolesDadosLeft}vw`,
              bottom: `${d.miercolesDadosBottom}vh`,
              width: `${d.miercolesDadosWidth}vw`,
              height: "auto",
              zIndex: 22,
              cursor: miercolesDadosHovered ? "pointer" : "grab",
              transform: `rotate(${d.miercolesDadosRotation}deg)`,
              clipPath: "inset(12% 22%)",
            }}
          />


          {/* ═══════════════════════════════════════
              ZONA 2 — PEDIR YA (100 → 220vw)
          ═══════════════════════════════════════ */}

          {/* Fondo burgundy panel pedir */}
          <div style={{
            position: "absolute", left: "150vw", top: 0,
            width: "120vw", height: "100vh",
            background: C.burgundy, zIndex: 1,
          }} />

          {/* PEDIR YA gigante */}
          <Reveal style={{ position: "absolute", left: "158vw", top: "20vh", zIndex: 3, whiteSpace: "nowrap" }}>
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

          <Reveal delay={0.1} style={{ position: "absolute", left: "158vw", top: "12vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase" }}>
              ↗ SIN EXCUSAS · ESTO ES SPRINGS
            </div>
          </Reveal>

          {/* Apps */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "160vw", bottom: "16vh", zIndex: 5, width: "26vw" }}>
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
          <Reveal delay={0.3} style={{ position: "absolute", left: "194vw", bottom: "16vh", zIndex: 5, width: "30vw" }}>
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
