"use client";

import { useRef } from "react";
import MobileEditorial from "@/components/MobileEditorial";
import MobilePedir from "@/components/MobilePedir";

export default function MobileCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const scrollToStart = () => {
    wrapperRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={wrapperRef}
      className="mobile-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowX: "scroll",
        overflowY: "hidden",
        scrollbarWidth: "none",
        touchAction: "pan-x",
        background: "var(--cream)",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "400vw",
          alignItems: "stretch",
        }}
      >
        <MobileEditorial />
        <MobilePedir onBack={scrollToStart} />
      </div>
    </div>
  );
}
