"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  AnimatePresence,
  MotionConfig,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── ClipRevealText ───────────────────────────────────────────────────────────
// Animación de clip: el children sube desde dentro de un contenedor overflow:hidden.
// isVisible:true  → translateY 100%→0%, opacity 0→1 (spring)
// isVisible:false → estado inicial, no anima hacia atrás

interface ClipRevealTextProps {
  children: React.ReactNode;
  isVisible: boolean;
  delay?: number;
  className?: string;
}

function ClipRevealText({ children, isVisible, delay = 0, className = "" }: ClipRevealTextProps) {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        className={className}
        initial={{ y: "100%", opacity: 0 }}
        animate={isVisible ? { y: "0%", opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── useScrollProgress ────────────────────────────────────────────────────────
// Devuelve scrollYProgress (0→1) del targetRef relativo al scrollContainerRef.
// offset ["start start", "end end"]:
//   0 = top del target alineado con top del container
//   1 = bottom del target alineado con bottom del container

function useScrollProgress(
  targetRef: React.RefObject<HTMLDivElement | null>,
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: scrollContainerRef,
    offset: ["start start", "end end"],
  });
  return scrollYProgress;
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
// Ken Burns en imagen (scale 1.0→1.08, loop 20s).
// Navbar: SPRINGS desde izquierda, PEDIR AHORA desde derecha.
// Título: dos líneas con stagger x:-40→0.
// Al scrollear: título hace parallax y:0→-30px.

interface HeroSectionProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

function HeroSection({ scrollContainerRef }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    container: scrollContainerRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div
      ref={heroRef}
      className="relative w-full bg-burgundy flex flex-col justify-between border-b border-mostaza overflow-hidden"
      style={{ height: "100svh" }}
    >
      {/* Ken Burns image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="/images/hero-jacket.jpg"
          alt="La Fija — Jacket de autor"
          className="w-full h-full object-cover opacity-90"
          animate={{ scale: 1.08 }}
          initial={{ scale: 1.0 }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-transparent to-transparent" />
      </div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
        <motion.span
          className="font-display text-2xl leading-none text-cream tracking-[0.06em]"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0 }}
        >
          SPRINGS
        </motion.span>
        <motion.a
          href="/menu"
          className="bg-mostaza text-tinta font-sans font-medium text-sm px-4 py-2 uppercase tracking-wide"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          PEDIR AHORA
        </motion.a>
      </div>

      {/* Título con parallax */}
      <motion.div
        className="relative z-10 p-6 flex flex-col justify-end h-full pb-12"
        style={{ y: titleY }}
      >
        <div className="flex flex-col mb-16 -ml-2">
          <motion.span
            className="font-display text-[56px] leading-[0.8] text-cream block"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          >
            CARNE &amp;
          </motion.span>
          <motion.span
            className="font-display text-[64px] leading-[0.8] text-cream -ml-4 whitespace-nowrap block"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          >
            QUESO
          </motion.span>
        </div>
        <div className="flex justify-between items-end w-full">
          <img
            src="/images/wax-seal.png"
            alt="Springs — Jacket de Autor · Colombia"
            className="w-24 h-24 object-cover rotate-12"
          />
          <div className="font-mono text-cream text-[10px] text-right uppercase tracking-widest">
            ↖ LA FIJA /<br />CARNE OREADA
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── PinnedIngredients ────────────────────────────────────────────────────────
// Contenedor: 300svh de alto.
// Panel interno: sticky top:0, 100svh.
// useScroll mapea progress 0→1 sobre los 300svh.
// Umbrales: 0–0.33 = ingrediente 0, 0.33–0.66 = ingrediente 1, 0.66–1 = ingrediente 2.
// AnimatePresence mode="wait" hace la transición entre ingredientes.

const INGREDIENTS = [
  { label: "CARNE\nOREADA.", bg: "#1A0A0C", color: "#F2E8D5", index: "01" },
  { label: "HOGAO.", bg: "#6B1419", color: "#F2E8D5", index: "02" },
  { label: "QUESO\nCOSTEÑO.", bg: "#F2E8D5", color: "#1A0A0C", index: "03" },
] as const;

interface PinnedIngredientsProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

function PinnedIngredients({ scrollContainerRef }: PinnedIngredientsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollProgress(containerRef, scrollContainerRef);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) setActiveIndex(0);
    else if (latest < 0.66) setActiveIndex(1);
    else setActiveIndex(2);
  });

  const ingredient = INGREDIENTS[activeIndex as 0 | 1 | 2];

  return (
    <div
      ref={containerRef}
      className="relative border-b border-mostaza"
      style={{ height: "300svh" }}
    >
      <motion.div
        className="sticky top-0 w-full flex flex-col items-center justify-center"
        style={{ height: "100svh" }}
        animate={{ backgroundColor: ingredient.bg }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="flex flex-col items-center justify-center gap-6 w-full px-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, transition: { duration: 0.35, ease: "easeIn" } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <span
              className="font-mono text-[10px] tracking-[4px] uppercase"
              style={{ color: "#C5871F" }}
            >
              {ingredient.index} / 03
            </span>
            <div
              className="font-display text-[72px] leading-[0.85] text-center whitespace-pre-line"
              style={{ color: ingredient.color }}
            >
              {ingredient.label}
            </div>
            <div className="w-8 h-px" style={{ backgroundColor: "#C5871F" }} />
          </motion.div>
        </AnimatePresence>

        {/* Dots de progreso */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {INGREDIENTS.map((_, i) => (
            <div
              key={i}
              className="h-[2px] transition-all duration-300"
              style={{
                width: i === activeIndex ? "20px" : "8px",
                backgroundColor: i === activeIndex ? "#C5871F" : "#F2E8D530",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── PinnedManifesto ──────────────────────────────────────────────────────────
// Contenedor: 200svh de alto.
// Panel interno: sticky top:0, 100svh, fondo burgundy.
// 4 líneas que se revelan con ClipRevealText a medida que scrollYProgress avanza.
// Umbrales: línea N visible cuando scrollYProgress >= MANIFESTO_THRESHOLDS[N].

const MANIFESTO_LINES: Array<{ text: string; className: string }> = [
  {
    text: "BIEN",
    className: "font-display text-[72px] leading-[0.85] text-cream",
  },
  {
    text: "HECHA.",
    className: "font-display text-[72px] leading-[0.85] text-cream",
  },
  {
    text: "Bucaramanga ya tenía suficientes hamburguesas iguales.",
    className: "font-sans italic text-sm text-cream max-w-[85%] leading-[1.6]",
  },
  {
    text: "Springs nace porque pedir comida también es respeto propio.",
    className: "font-sans italic text-sm text-cream max-w-[85%] leading-[1.6]",
  },
];

// threshold[0]=0.0: "BIEN" aparece en el momento de entrar a la sección (spec explícita)
const MANIFESTO_THRESHOLDS: readonly number[] = [0.0, 0.25, 0.5, 0.75];

interface PinnedManifestoProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

function PinnedManifesto({ scrollContainerRef }: PinnedManifestoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollProgress(containerRef, scrollContainerRef);
  const [visibleCount, setVisibleCount] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const count = MANIFESTO_THRESHOLDS.filter((t) => latest >= t).length;
    setVisibleCount(count);
  });

  return (
    <div
      ref={containerRef}
      className="relative border-b border-mostaza"
      style={{ height: "200svh" }}
    >
      <div
        className="sticky top-0 w-full bg-burgundy overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* Fondo: imagen con baja opacidad */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-jacket.jpg"
            alt=""
            aria-hidden={true}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-burgundy/60" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 p-6 flex flex-col justify-center h-full gap-4">
          <span className="font-mono text-[10px] text-mostaza tracking-[3px] uppercase mb-4">
            MANIFIESTO
          </span>
          {MANIFESTO_LINES.map((line, i) => (
            <ClipRevealText
              key={i}
              isVisible={visibleCount > i}
              className={line.className}
            >
              {line.text}
            </ClipRevealText>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CTASection ───────────────────────────────────────────────────────────────
// Scroll-reveal normal. useInView dispara cuando entra al 20% del viewport.
// Imagen packaging fade-in → título clip reveal → botón spring bounce → trust bar.

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="w-full bg-burgundy border-b border-mostaza flex flex-col">
      <motion.div
        className="w-full overflow-hidden"
        style={{ height: "300px" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <img
          src="/images/packaging-bag.png"
          alt="Springs — packaging"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="p-6 flex flex-col gap-6 bg-burgundy">
        <div className="flex flex-col">
          <ClipRevealText
            isVisible={inView}
            delay={0.2}
            className="font-display text-[68px] leading-[0.8] text-cream block"
          >
            PEDÍ
          </ClipRevealText>
          <ClipRevealText
            isVisible={inView}
            delay={0.4}
            className="font-display text-[68px] leading-[0.8] text-cream block"
          >
            AHORA.
          </ClipRevealText>
        </div>

        <motion.a
          href="/menu"
          className="w-full bg-mostaza text-tinta font-display text-[32px] h-16 flex items-center justify-center uppercase tracking-wider"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
        >
          IR A PEDIR
        </motion.a>

        <motion.div
          className="w-full text-center border-t border-mostaza/30 pt-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
        >
          <span className="font-mono text-[10px] text-cream tracking-widest uppercase">
            30–45 MIN · CABECERA · CAÑAVERAL · SOTOMAYOR
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="w-full bg-tinta p-8 flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="font-display text-[48px] text-cream tracking-[0.06em] leading-none">
          SPRINGS
        </span>
        <span className="font-sans italic text-base text-cream">Jacket de autor.</span>
      </div>
      <div className="w-full h-px bg-mostaza my-4" />
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
      <div className="mt-12 w-full text-center">
        <span className="font-mono text-[9px] text-cream/50 uppercase tracking-widest">
          © 2026 SPRINGS · SYS.VER 1.0 // BGA-COL
        </span>
      </div>
    </footer>
  );
}

// ─── MobileLanding ────────────────────────────────────────────────────────────

export default function MobileLanding() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={scrollRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-tinta font-sans text-cream"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <HeroSection scrollContainerRef={scrollRef} />
        <PinnedIngredients scrollContainerRef={scrollRef} />
        <PinnedManifesto scrollContainerRef={scrollRef} />
        <CTASection />
        <Footer />
      </div>
    </MotionConfig>
  );
}
