"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import { motion, useInView, useMotionValue, useTransform, useSpring, animate as animateValue } from "framer-motion";
import DragSticker from "@/components/DragSticker";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import MobileCanvas from "@/components/MobileCanvas";
import SensitiveImage from "@/components/SensitiveImage";

const DESKTOP_BREAKPOINT = 1024;

// Easing suave para slides
const EASE = [0.22, 1, 0.36, 1] as const;

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

  // ─── Scroll-driven packaging ───
  const scrollXMV = useMotionValue(0);

  // Canvas 560vw. lenis.scroll en px. vw = window.innerWidth (p.ej. 1440px).
  // 1vw en CSS = vw/100 px. Canvas = 560 × vw/100 = 8064px (no 806,400px).
  // Max scroll = 8064 - 1440 = 6624px.
  //
  // Fórmula: el producto entra al viewport cuando scroll = (leftVW/100 - 1) × vw
  //   bag  left 102.5vw → entra en scroll = 0.025 × vw  ≈  36px
  //   cup  left 129.5vw → entra en scroll = 0.295 × vw  ≈ 425px
  //   box  left 139.5vw → entra en scroll = 0.395 × vw  ≈ 569px
  //
  // Animación sube desde y=vh*0.55 → 0 (producto visible durante todo el recorrido).
  // Stagger natural: cada uno empieza al entrar al viewport.
  const bagY = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const p = Math.max(0, Math.min(1, (s - vw * 0.025) / (vw * 1.8)));
    return Math.pow(1 - p, 3) * vh * 0.55;
  });
  const bagOpacity = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(0, Math.min(1, (s - vw * 0.025) / (vw * 0.65)));
  });

  const cupY = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const p = Math.max(0, Math.min(1, (s - vw * 0.295) / (vw * 1.8)));
    return Math.pow(1 - p, 3) * vh * 0.55;
  });
  const cupOpacity = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(0, Math.min(1, (s - vw * 0.295) / (vw * 0.65)));
  });

  const boxY = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const p = Math.max(0, Math.min(1, (s - vw * 0.395) / (vw * 1.8)));
    return Math.pow(1 - p, 3) * vh * 0.55;
  });
  const boxOpacity = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(0, Math.min(1, (s - vw * 0.395) / (vw * 0.65)));
  });

  const textXBase = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const p = Math.max(0, Math.min(1, (s - vw * 0.35) / (vw * 0.38)));
    const e = 1 - Math.pow(1 - p, 3);
    return (1 - e) * vw * 0.32;
  });
  const textX = useSpring(textXBase, { stiffness: 140, damping: 22 });
  const textOpacity = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(0, Math.min(1, (s - vw * 0.32) / (vw * 0.18)));
  });

  // Brazo: entrada spring (1200→0) + scroll drift (24vw→0). Suma de ambos.
  const handArmEntrance = useMotionValue(1200);
  const handArmScrollPart = useTransform(scrollXMV, (s) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(0, vw * 0.24 - s);
  });
  const handArmX = useTransform(
    [handArmEntrance, handArmScrollPart] as const,
    (values: number[]) => values[0] + values[1]
  );

  const FONT_MAP: Record<string, string> = {
    display: "Anton, sans-serif",
    sans: "Inter, sans-serif",
    mono: "JetBrains Mono, monospace",
    marker: "var(--font-marker), cursive",
  };
  const COLOR_MAP: Record<string, string> = {
    burgundy: "#6B1419",
    cream: "#F2E8D5",
    tinta: "#1A0A0C",
    mostaza: "#C5871F",
  };
  const fontCSS = (key: string) => FONT_MAP[key] ?? FONT_MAP.display;
  const colorHex = (key: string) => COLOR_MAP[key] ?? COLOR_MAP.tinta;

  const hero = config.zones.hero?.elements;
  const pack = config.zones.packaging?.elements;
  const cult = config.zones.culture?.elements;
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
    titleFont:    fontCSS((hero?.title?.props?.fontFamily as { value: string })?.value ?? "display"),
    titleColor:   colorHex((hero?.title?.props?.color as { value: string })?.value ?? "tinta"),
    subtitleFont: fontCSS((hero?.subtitle?.props?.fontFamily as { value: string })?.value ?? "marker"),
    subtitleColor:colorHex((hero?.subtitle?.props?.color as { value: string })?.value ?? "burgundy"),
    bodyCopyColor:colorHex((hero?.bodyCopy?.props?.color as { value: string })?.value ?? "tinta"),
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
    handArmSrc:    (hero?.handArm?.props?.src as { value: string })?.value ?? "/images/hero-arm.png",
    handArmWidth:  (hero?.handArm?.props?.width as { value: number })?.value ?? 48,
    handArmLeft:   (hero?.handArm?.props?.left as { value: number })?.value ?? 50,
    handArmBottom: (hero?.handArm?.props?.bottom as { value: number })?.value ?? 10,
    sensitiveSrc:      (hero?.sensitiveImage?.props?.src as { value: string })?.value ?? "/images/sensitive-hero.png",
    sensitiveLeft:     (hero?.sensitiveImage?.props?.left as { value: number })?.value ?? 36,
    sensitiveBottom:   (hero?.sensitiveImage?.props?.bottom as { value: number })?.value ?? 18,
    sensitiveSize:     (hero?.sensitiveImage?.props?.size as { value: number })?.value ?? 32,
    sensitiveRotation: (hero?.sensitiveImage?.props?.rotation as { value: number })?.value ?? -4,
    sensitiveFontSize: (hero?.sensitiveImage?.props?.fontSize as { value: number })?.value ?? 1.1,
    sensitiveOpacity:  (hero?.sensitiveImage?.props?.opacity as { value: number })?.value ?? 60,
    bgSpringsLeft:     (pack?.bgSprings?.props?.left as { value: number })?.value ?? 106,
    bgSpringsTop:      (pack?.bgSprings?.props?.top as { value: number })?.value ?? 50,
    bgSpringsSize:     (pack?.bgSprings?.props?.fontSize as { value: number })?.value ?? 14,
    bgSpringsOpacity:  (pack?.bgSprings?.props?.opacity as { value: number })?.value ?? 3.5,
    bgSpringsRotation: (pack?.bgSprings?.props?.rotation as { value: number })?.value ?? 90,
    taglineLeft:       (pack?.tagline?.props?.left as { value: number })?.value ?? 148.5,
    taglineTop:        (pack?.tagline?.props?.top as { value: number })?.value ?? 49,
    taglineSize:       (pack?.tagline?.props?.fontSize as { value: number })?.value ?? 6.5,
    boxSrc:            (pack?.box?.props?.src as { value: string })?.value ?? "/images/packaging-box.png",
    boxLeft:           (pack?.box?.props?.left as { value: number })?.value ?? 139.5,
    boxTop:            (pack?.box?.props?.top as { value: number })?.value ?? 3.5,
    boxWidth:          (pack?.box?.props?.width as { value: number })?.value ?? 22,
    boxRotation:       (pack?.box?.props?.rotation as { value: number })?.value ?? -29,
    bagSrc:            (pack?.bag?.props?.src as { value: string })?.value ?? "/images/packaging-bag.png",
    bagLeft:           (pack?.bag?.props?.left as { value: number })?.value ?? 102.5,
    bagTop:            (pack?.bag?.props?.top as { value: number })?.value ?? 1,
    bagWidth:          (pack?.bag?.props?.width as { value: number })?.value ?? 36,
    bagRotation:       (pack?.bag?.props?.rotation as { value: number })?.value ?? 0,
    cupSrc:            (pack?.cup?.props?.src as { value: string })?.value ?? "/images/packaging-cup.png",
    cupLeft:           (pack?.cup?.props?.left as { value: number })?.value ?? 129.5,
    cupTop:            (pack?.cup?.props?.top as { value: number })?.value ?? 16,
    cupWidth:          (pack?.cup?.props?.width as { value: number })?.value ?? 18,
    cupRotation:       (pack?.cup?.props?.rotation as { value: number })?.value ?? 0,
    dropStart:         (pack?.dropAnim?.props?.dropStart as { value: number })?.value ?? 2,
    culturePanelLeft:  (cult?.panel?.props?.left as { value: number })?.value ?? 300,
    culturePanelWidth: (cult?.panel?.props?.width as { value: number })?.value ?? 130,
    cultureHashtag:    (cult?.hashtag?.props?.content as string) ?? "#SPRINGSCLUB",
    cultureHashtagLeft:(cult?.hashtag?.props?.left as { value: number })?.value ?? 360,
    cultureHashtagTop: (cult?.hashtag?.props?.top as { value: number })?.value ?? 11,
    cultureHashtagSize:(cult?.hashtag?.props?.fontSize as { value: number })?.value ?? 0.85,
    cultureThisIs:     (cult?.thisIs?.props?.content as string) ?? "THIS IS",
    cultureThisIsLeft: (cult?.thisIs?.props?.left as { value: number })?.value ?? 308,
    cultureThisIsTop:  (cult?.thisIs?.props?.top as { value: number })?.value ?? 14,
    cultureThisIsSize: (cult?.thisIs?.props?.fontSize as { value: number })?.value ?? 7.5,
    cultureOurCulture: (cult?.ourCulture?.props?.content as string) ?? "OUR CULTURE",
    cultureOurLeft:    (cult?.ourCulture?.props?.left as { value: number })?.value ?? 308,
    cultureOurTop:     (cult?.ourCulture?.props?.top as { value: number })?.value ?? 32,
    cultureOurSize:    (cult?.ourCulture?.props?.fontSize as { value: number })?.value ?? 9.5,
    cultureDesc:       (cult?.description?.props?.content as string) ?? "MÚSICA. CALLE. HUMOR.\nAMIGOS. PLANES.\nNOCHES QUE SÍ CUENTAN.\nESTO ES SPRINGS.",
    cultureDescLeft:   (cult?.description?.props?.left as { value: number })?.value ?? 308,
    cultureDescTop:    (cult?.description?.props?.top as { value: number })?.value ?? 68,
    cultureDescSize:   (cult?.description?.props?.fontSize as { value: number })?.value ?? 0.85,
    cultureImgSrc:     (cult?.image?.props?.src as { value: string })?.value ?? "/images/culture-night.jpg",
    cultureImgLeft:    (cult?.image?.props?.left as { value: number })?.value ?? 360,
    cultureImgTop:     (cult?.image?.props?.top as { value: number })?.value ?? 0,
    cultureImgWidth:   (cult?.image?.props?.width as { value: number })?.value ?? 70,
    cultureImgHeight:  (cult?.image?.props?.height as { value: number })?.value ?? 100,
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

    lenis.on("scroll", () => {
      scrollXMV.set(lenis.scroll);
    });

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

  useEffect(() => {
    const t = setTimeout(() => {
      animateValue(handArmEntrance, 0, { type: "spring", stiffness: 130, damping: 22, mass: 1.2 });
    }, 200);
    return () => clearTimeout(t);
  }, [handArmEntrance]);


  if (isDesktop !== true) {
    return <MobileCanvas />;
  }

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
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", height: 64,
          background: "transparent",
        }}
      >
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
      </motion.nav>

      {/* ── FOOTER BAR FIJO ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", height: 40,
          background: "transparent",
        }}
      >
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
      </motion.div>

      {/* ── BARCODE FIXED ── */}
      <motion.img
        src="/images/barcode-springs.png"
        alt="SPRINGS 2024"
        initial={{ opacity: 0 }}
        animate={{ opacity: d.barcodeOpacity / 100 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        style={{
          position: "fixed", bottom: 4, left: `${d.barcodeLeft}vw`,
          height: d.barcodeHeight, width: d.barcodeWidth,
          objectFit: "contain",
          zIndex: 101, pointerEvents: "none",
        }}
      />

      {/* ── WRAPPER LENIS ── */}
      <div ref={wrapperRef} style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.cream }}>
        {/* ── CANVAS CONTINUO 560vw ── */}
        <div ref={contentRef} style={{ position: "relative", width: "560vw", height: "100vh" }}>

          {/* ═══════════════════════════════════════
              ZONA 1 — HERO (0 → 100vw)
          ═══════════════════════════════════════ */}

          {/* Papa hero — sube desde abajo */}
          <motion.img
            src={d.heroImage}
            alt="SPRINGS Jacket"
            drag={editMode}
            dragMomentum={false}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
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

          {/* ART GALLERY — entra desde la izquierda */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.5 }}
            style={{ position: "absolute", left: `${d.artGalleryLeft}vw`, bottom: d.artGalleryBottom, zIndex: 1 }}
          >
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
          </motion.div>

          {/* Listado de productos — entra desde la izquierda con delay */}
          <motion.div
            initial={{ x: -35, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
            style={{
              position: "absolute",
              left: `${d.menuListLeft}vw`,
              bottom: `${d.menuListBottom}vh`,
              width: `${d.menuListWidth}vw`,
              zIndex: 2,
            }}
          >
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
          </motion.div>


          {/* Globe + ubicación — fade + sube */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.45 }}
            style={{ position: "absolute", left: `${d.locationLeft}vw`, top: `${d.locationTop}vh`, zIndex: 5, display: "flex", alignItems: "flex-start", gap: d.locationGap }}
          >
            <span style={{ ...F.mono, fontSize: `${d.locationGlobeSize}rem`, color: C.tinta, opacity: 0.55, lineHeight: 1, marginTop: d.locationGlobeOffY }}>⊕</span>
            <div style={{ ...F.mono, fontSize: `${d.locationFontSize}rem`, letterSpacing: "0.18em", color: C.tinta, lineHeight: d.locationLineHeight, textTransform: "uppercase", opacity: 0.7 }}>
              Barbosa STDR – COLOMBIA<br />EST. 2025
            </div>
          </motion.div>

          {/* SPRINGS — cae desde arriba */}
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
            style={{ position: "absolute", left: `${d.titleLeft}vw`, top: `${d.titleTop}vh`, zIndex: 3 }}
          >
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
              <motion.div
                animate={titleHovered ? { rotateX: -90 } : { rotateX: 0 }}
                transition={{ type: "tween", duration: 0.45, ease: [0.45, 0, 0.55, 1] }}
                style={{
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 50% -0.5em",
                }}
              >
                <h1
                  style={{
                    fontFamily: d.titleFont,
                    fontSize: "1em",
                    color: d.titleColor,
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

                <h1
                  style={{
                    fontFamily: d.titleFont,
                    fontSize: "1em",
                    color: d.titleColor,
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
          </motion.div>

          {/* Subtítulo — desliza desde la derecha con rotación */}
          <motion.div
            initial={{ x: 60, opacity: 0, rotate: d.subtitleRotation - 8 }}
            animate={{ x: 0, opacity: 1, rotate: d.subtitleRotation }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
            style={{
              position: "absolute",
              left: `${d.subtitleLeft}vw`,
              bottom: `${d.subtitleBottom}vh`,
              transformOrigin: "left center",
              zIndex: 5,
              width: "fit-content",
            }}
          >
            <div style={{
              fontFamily: d.subtitleFont,
              fontSize: `clamp(20px, ${d.subtitleSize}vw, 96px)`,
              color: d.subtitleColor,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {d.subtitleText}
            </div>
          </motion.div>

          {/* Trazo de pincel — desliza desde la derecha */}
          <motion.img
            src="/images/underline-stroke.png"
            alt=""
            initial={{ x: 50, opacity: 0, rotate: d.underlineRotation + 6 }}
            animate={{ x: 0, opacity: 1, rotate: d.underlineRotation }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            style={{
              position: "absolute",
              left: `${d.underlineLeft}vw`,
              bottom: `${d.underlineBottom}vh`,
              width: `${d.underlineWidth}vw`,
              height: "auto",
              transformOrigin: "left center",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />

          {/* ─── MARQUEE TAPE — sube desde abajo ─── */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.7 }}
            style={{
              position: "absolute",
              left: `${d.marqueeLeft}vw`,
              top: `${d.marqueeTop}vh`,
              width: `${400 - d.marqueeLeft}vw`,
              overflow: "hidden",
              zIndex: 6,
              borderTop: `1.5px solid ${C.tinta}`,
              borderBottom: `1.5px solid ${C.tinta}`,
              padding: "6px 0",
              background: C.cream,
            }}
          >
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
            >
              {[0, 1].map(copy => (
                <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
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
          </motion.div>

          {/* Body copy — fade + sube */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.6 }}
            style={{ position: "absolute", left: `${d.bodyCopyLeft}vw`, bottom: `${d.bodyCopyBottom}vh`, zIndex: 5 }}
          >
            <div style={{ ...F.display, fontSize: `clamp(20px, ${d.bodyCopySize}vw, 72px)`, color: d.bodyCopyColor, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
                <svg width="0.7em" height="0.7em" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginBottom: "0.1em" }}>
                  <line x1="21" y1="21" x2="3" y2="3" stroke={d.bodyCopyColor} strokeWidth="4.5" strokeLinecap="round"/>
                  <polyline points="3,11 3,3 11,3" fill="none" stroke={d.bodyCopyColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Jacket
              </div>
              <div style={{ paddingLeft: "calc(0.7em + 0.3em)" }}>La Fija</div>
            </div>
          </motion.div>

          {/* + símbolo — fade in */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            style={{ position: "absolute", left: "97vw", top: "42vh", ...F.display, fontSize: "1.8rem", color: C.tinta, zIndex: 5 }}
          >+</motion.span>

          {/* ─── STICKERS ────────────────────────────────── */}

          {/* 1. SPRINGS Jacket Club — sticker slam */}
          <motion.img
            src={jacketClubHovered ? "/images/jacket-club-sticker-hover.png" : "/images/jacket-club-sticker.png"}
            alt="SPRINGS Jacket Club"
            drag
            dragTransition={{ power: 0.8, timeConstant: 350 }}
            onPointerDown={() => { jacketClubDragged.current = false; }}
            onDragStart={() => { jacketClubDragged.current = true; pauseScroll(); }}
            onDragEnd={resumeScroll}
            whileDrag={{ scale: 1.06 }}
            onHoverStart={() => setJacketClubHovered(true)}
            onHoverEnd={() => setJacketClubHovered(false)}
            onTap={() => { if (!jacketClubDragged.current) router.push("/springs-jacket-club"); }}
            initial={{ scale: 0, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1.1 }}
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

          {/* 2. FOR THE MOST CHIMBA PEOPLE — sticker slam con spring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 20, delay: 0.9 }}
            style={{
              position: "absolute",
              left: `${d.globeStickerLeft}vw`,
              top: `${d.globeStickerTop}vh`,
              zIndex: 1,
              width: `${d.globeStickerSize}vw`,
              height: `${d.globeStickerSize}vw`,
            }}
          >
            <DragSticker rotate={-5} idleRotateRange={3} idleDuration={8}
              onDragStart={pauseScroll} onDragEnd={resumeScroll}
              style={{
                width: `${d.globeStickerSize}vw`, height: `${d.globeStickerSize}vw`,
                background: C.cream,
                boxShadow: `0 0 0 5px ${C.cream}, 0 0 0 7px ${C.tinta}`,
                clipPath: "circle(50%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 110 110" width="100%" height="100%">
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
          </motion.div>

          {/* 9. MIÉRCOLES DE DADOS — sticker slam con más spin */}
          <motion.img
            src={miercolesDadosHovered ? "/images/miercoles-dados-sticker-hover.png" : "/images/miercoles-dados-sticker.png"}
            alt="Miércoles de Dados"
            drag
            dragTransition={{ power: 0.8, timeConstant: 350 }}
            onPointerDown={() => { miercolesDadosDragged.current = false; }}
            onDragStart={() => { miercolesDadosDragged.current = true; pauseScroll(); }}
            onDragEnd={resumeScroll}
            whileDrag={{ scale: 1.06 }}
            onHoverStart={() => setMiercolesDadosHovered(true)}
            onHoverEnd={() => setMiercolesDadosHovered(false)}
            onTap={() => { if (!miercolesDadosDragged.current) router.push("/prueba-tu-suerte"); }}
            initial={{ scale: 0, opacity: 0, rotate: d.miercolesDadosRotation + 35 }}
            animate={{ scale: 1, opacity: 1, rotate: d.miercolesDadosRotation }}
            transition={{ type: "spring", stiffness: 340, damping: 16, delay: 1.3 }}
            style={{
              position: "absolute",
              left: `${d.miercolesDadosLeft}vw`,
              bottom: `${d.miercolesDadosBottom}vh`,
              width: `${d.miercolesDadosWidth}vw`,
              height: "auto",
              zIndex: 22,
              cursor: miercolesDadosHovered ? "pointer" : "grab",
              clipPath: "inset(12% 22%)",
            }}
          />


          {/* ─── SENSITIVE IMAGE — centro del hero ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              position: "absolute",
              left: `${d.sensitiveLeft}vw`,
              bottom: `${d.sensitiveBottom}vh`,
              width: `${d.sensitiveSize}vw`,
              aspectRatio: "1402 / 1122",
              rotate: d.sensitiveRotation,
              zIndex: 10,
            }}
          >
            <SensitiveImage src={d.sensitiveSrc} fontSize={d.sensitiveFontSize} opacity={d.sensitiveOpacity} />
          </motion.div>

          {/* ─── BRAZO HERO — fixed, entra desde derecha al scrollear, ancla al quedar completo ─── */}
          <motion.img
            src={d.handArmSrc}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              position: "fixed",
              right: 0,
              bottom: `${d.handArmBottom}vh`,
              width: `${d.handArmWidth}vw`,
              height: "auto",
              x: handArmX,
              zIndex: 9500,
              pointerEvents: "none",
              filter: "drop-shadow(0 20px 48px rgba(26,10,12,0.14))",
            }}
          />

          {/* ═══════════════════════════════════════
              ZONA 1.5 — EMPAQUE (100 → 300vw)
          ═══════════════════════════════════════ */}

          {/* Texto fondo muy suave */}
          <div style={{
            position: "absolute", left: `${d.bgSpringsLeft}vw`, top: `${d.bgSpringsTop}vh`,
            transform: `translateY(-50%) rotate(${d.bgSpringsRotation}deg)`,
            transformOrigin: "left center",
            ...F.display, fontSize: `${d.bgSpringsSize}vw`,
            color: C.tinta, opacity: d.bgSpringsOpacity / 100,
            letterSpacing: "-0.02em", whiteSpace: "nowrap",
            zIndex: 1, pointerEvents: "none", userSelect: "none",
          }}>
            SPRINGS
          </div>

          {/* Tagline — desliza desde la derecha */}
          <motion.div
            style={{
              position: "absolute", left: `${d.taglineLeft}vw`, top: `${d.taglineTop}vh`,
              x: textX, opacity: textOpacity,
              zIndex: 5, pointerEvents: "none",
            }}
          >
            <div style={{
              ...F.display,
              fontSize: `${d.taglineSize}vw`,
              color: C.burgundy, lineHeight: 0.88,
              letterSpacing: "-0.02em", textTransform: "uppercase",
            }}>
              DIFFERENT<br />BY DEFAULT.
            </div>
            <div style={{
              ...F.mono, fontSize: "0.55rem", letterSpacing: "0.22em",
              color: C.tinta, opacity: 0.4, marginTop: "2em",
              textTransform: "uppercase",
            }}>
              BUCARAMANGA · EST. 2025
            </div>
          </motion.div>

          {/* Empaque — Caja */}
          <motion.div
            style={{
              position: "absolute",
              left: `${d.boxLeft}vw`, top: `${d.boxTop}vh`,
              width: `${d.boxWidth}vw`,
              zIndex: 14,
              y: boxY,
              opacity: boxOpacity,
              rotate: d.boxRotation,
              transformOrigin: "center center",
              pointerEvents: "none",
            }}
          >
            <img
              src={d.boxSrc}
              alt=""
              style={{ width: "100%", height: "auto", display: "block",
                filter: "drop-shadow(0 28px 52px rgba(26,10,12,0.20))" }}
            />
          </motion.div>

          {/* Empaque — Bolsa */}
          <motion.div
            style={{
              position: "absolute",
              left: `${d.bagLeft}vw`, top: `${d.bagTop}vh`,
              width: `${d.bagWidth}vw`,
              zIndex: 14,
              y: bagY,
              opacity: bagOpacity,
              rotate: d.bagRotation,
              transformOrigin: "center center",
              pointerEvents: "none",
            }}
          >
            <img
              src={d.bagSrc}
              alt=""
              style={{ width: "100%", height: "auto", display: "block",
                filter: "drop-shadow(0 32px 60px rgba(26,10,12,0.18))" }}
            />
          </motion.div>

          {/* Empaque — Vaso */}
          <motion.div
            style={{
              position: "absolute",
              left: `${d.cupLeft}vw`, top: `${d.cupTop}vh`,
              width: `${d.cupWidth}vw`,
              zIndex: 14,
              y: cupY,
              opacity: cupOpacity,
              rotate: d.cupRotation,
              transformOrigin: "center center",
              pointerEvents: "none",
            }}
          >
            <img
              src={d.cupSrc}
              alt=""
              style={{ width: "100%", height: "auto", display: "block",
                filter: "drop-shadow(0 24px 44px rgba(26,10,12,0.22))" }}
            />
          </motion.div>

          {/* ═══════════════════════════════════════
              ZONA 1.7 — CULTURA (300 → 430vw)
          ═══════════════════════════════════════ */}

          {/* Panel dark culture */}
          <div style={{
            position: "absolute", left: `${d.culturePanelLeft}vw`, top: 0,
            width: `${d.culturePanelWidth}vw`, height: "100vh",
            background: C.tinta, zIndex: 1,
          }} />

          {/* Imagen lado derecho */}
          <div style={{
            position: "absolute", left: `${d.cultureImgLeft}vw`, top: `${d.cultureImgTop}vh`,
            width: `${d.cultureImgWidth}vw`, height: `${d.cultureImgHeight}vh`,
            backgroundImage: `url(${d.cultureImgSrc}), linear-gradient(135deg, #0d0507 0%, #2a1a1d 60%, #3a2520 100%)`,
            backgroundSize: "cover", backgroundPosition: "center",
            zIndex: 2,
          }} />

          {/* Overlay degradado sutil sobre imagen para legibilidad */}
          <div style={{
            position: "absolute", left: `${d.cultureImgLeft}vw`, top: `${d.cultureImgTop}vh`,
            width: `${d.cultureImgWidth}vw`, height: `${d.cultureImgHeight}vh`,
            background: `linear-gradient(90deg, ${C.tinta} 0%, transparent 25%, transparent 100%)`,
            zIndex: 3, pointerEvents: "none",
          }} />

          {/* Hashtag */}
          <div style={{
            position: "absolute", left: `${d.cultureHashtagLeft}vw`, top: `${d.cultureHashtagTop}vh`,
            ...F.mono, fontSize: `${d.cultureHashtagSize}vw`,
            letterSpacing: "0.18em", color: C.cream, opacity: 0.85,
            textTransform: "uppercase", zIndex: 5,
          }}>
            {d.cultureHashtag}
          </div>

          {/* THIS IS (stroke) */}
          <div style={{
            position: "absolute", left: `${d.cultureThisIsLeft}vw`, top: `${d.cultureThisIsTop}vh`,
            ...F.display, fontSize: `${d.cultureThisIsSize}vw`,
            lineHeight: 0.9, letterSpacing: "-0.01em",
            color: "transparent",
            WebkitTextStroke: `1.5px ${C.cream}`,
            textTransform: "uppercase", zIndex: 5, whiteSpace: "nowrap",
          }}>
            {d.cultureThisIs}
          </div>

          {/* OUR CULTURE (solid) */}
          <div style={{
            position: "absolute", left: `${d.cultureOurLeft}vw`, top: `${d.cultureOurTop}vh`,
            ...F.display, fontSize: `${d.cultureOurSize}vw`,
            lineHeight: 0.9, letterSpacing: "-0.015em",
            color: C.cream,
            textTransform: "uppercase", zIndex: 5, whiteSpace: "nowrap",
          }}>
            {d.cultureOurCulture}
          </div>

          {/* Description */}
          <div style={{
            position: "absolute", left: `${d.cultureDescLeft}vw`, top: `${d.cultureDescTop}vh`,
            ...F.mono, fontSize: `${d.cultureDescSize}vw`,
            letterSpacing: "0.14em", color: C.cream, opacity: 0.75,
            lineHeight: 1.7, textTransform: "uppercase", zIndex: 5,
            whiteSpace: "pre-line",
          }}>
            {d.cultureDesc}
          </div>

          {/* ═══════════════════════════════════════
              ZONA 2 — PEDIR YA (430 → 560vw)
          ═══════════════════════════════════════ */}

          {/* Fondo burgundy panel pedir */}
          <div style={{
            position: "absolute", left: "430vw", top: 0,
            width: "120vw", height: "100vh",
            background: C.burgundy, zIndex: 1,
          }} />

          {/* PEDIR YA gigante */}
          <Reveal style={{ position: "absolute", left: "438vw", top: "20vh", zIndex: 3, whiteSpace: "nowrap" }}>
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

          <Reveal delay={0.1} style={{ position: "absolute", left: "438vw", top: "12vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase" }}>
              ↗ SIN EXCUSAS · ESTO ES SPRINGS
            </div>
          </Reveal>

          {/* Apps */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "440vw", bottom: "16vh", zIndex: 5, width: "26vw" }}>
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
          <Reveal delay={0.3} style={{ position: "absolute", left: "474vw", bottom: "16vh", zIndex: 5, width: "30vw" }}>
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

          {/* "DIFFERENT BY DEFAULT" fantasma */}
          <div style={{
            position: "absolute", left: "600vw", top: "50%", transform: "translateY(-50%) rotate(-90deg)",
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
