"use client";

import { useEffect, useRef, useState } from "react";
import MobileEditorial from "@/components/MobileEditorial";
import MobilePedir from "@/components/MobilePedir";

const DESIGN_W = 1440;
const DESIGN_H = 900;

export default function MobileCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState<number>(0);
  const [viewportH, setViewportH] = useState<number>(0);

  // No-ops: native scroll no necesita pause/resume
  const pauseScroll = () => {};
  const resumeScroll = () => {};

  useEffect(() => {
    const measure = () => {
      setViewportW(window.innerWidth);
      setViewportH(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scrollToStart = () => {
    wrapperRef.current?.scrollTo({ left: 0, behavior: "smooth" });
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
      className="mobile-canvas"
      style={{
        width: "100vw",
        height: "100vh",
        overflowX: "scroll",
        overflowY: "hidden",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        background: "var(--cream)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "100vh",
          width: editorialWidth + viewportW,
        }}
      >
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
