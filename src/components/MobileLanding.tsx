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

// ─── MobileLanding (placeholder) ─────────────────────────────────────────────

export default function MobileLanding() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={scrollRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-tinta font-sans text-cream"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="h-screen flex items-center justify-center">
          <span className="font-display text-4xl text-cream">SPRINGS</span>
        </div>
      </div>
    </MotionConfig>
  );
}
