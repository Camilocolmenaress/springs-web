"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import MobileEditorial from "@/components/MobileEditorial";
import MobilePedir from "@/components/MobilePedir";

const DESIGN_W = 1440;
const DESIGN_H = 900;

export default function MobileCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [viewportW, setViewportW] = useState<number>(0);
  const [viewportH, setViewportH] = useState<number>(0);

  const pauseScroll = () => lenisRef.current?.stop();
  const resumeScroll = () => lenisRef.current?.start();

  // Medir viewport y actualizar al rotar / resize
  useEffect(() => {
    const measure = () => {
      setViewportW(window.innerWidth);
      setViewportH(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Lock body para que Lenis controle el scroll
  useEffect(() => {
    const prevBody = document.body.style.cssText;
    const prevHtml = document.documentElement.style.cssText;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    return () => {
      document.body.style.cssText = prevBody;
      document.documentElement.style.cssText = prevHtml;
    };
  }, []);

  // Inicializar Lenis horizontal una vez tengamos viewport
  useEffect(() => {
    if (!viewportW) return;
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
  }, [viewportW]);

  const scrollToStart = () => {
    lenisRef.current?.scrollTo(0, { duration: 1.6 });
  };

  if (!viewportW) {
    return <div style={{ width: "100vw", height: "100vh", background: "#F2E8D5" }} />;
  }

  const scale = viewportW / DESIGN_W;
  const editorialWidth = 3 * DESIGN_W * scale;
  const editorialHeight = DESIGN_H * scale;
  const verticalPad = Math.max(0, (viewportH - editorialHeight) / 2);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--cream)",
        position: "relative",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "100vh",
          width: editorialWidth + viewportW,
        }}
      >
        {/* Letterbox vertical para editorial */}
        <div
          style={{
            flexShrink: 0,
            width: editorialWidth,
            height: "100vh",
            position: "relative",
            background: "var(--cream)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: verticalPad,
              left: 0,
              width: editorialWidth,
              height: editorialHeight,
            }}
          >
            <div
              style={{
                width: 3 * DESIGN_W,
                height: DESIGN_H,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              <MobileEditorial pauseScroll={pauseScroll} resumeScroll={resumeScroll} />
            </div>
          </div>
        </div>

        <MobilePedir onBack={scrollToStart} />
      </div>
    </div>
  );
}
