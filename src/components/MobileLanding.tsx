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
  targetRef: React.RefObject<HTMLDivElement>,
  scrollContainerRef: React.RefObject<HTMLDivElement>
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
      </div>
    </MotionConfig>
  );
}
