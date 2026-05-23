"use client";

import Link from "next/link";
import MobileEditorial from "@/components/MobileEditorial";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
};

export default function MobileCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollbarWidth: "none",
        overscrollBehavior: "auto" as const,
        background: C.cream,
      }}
    >
      {/* ── MOBILE NAV — fixed, floats above all sections ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px 0 20px",
          zIndex: 100,
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
          <a
            href="/"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "1.3rem",
              letterSpacing: "0.05em",
              color: C.tinta,
              textDecoration: "none",
            }}
          >
            SPRINGS
          </a>
          <span style={{ color: C.tinta, fontSize: "0.75rem", opacity: 0.6 }}>✦</span>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.38rem",
              letterSpacing: "0.1em",
              color: C.tinta,
              lineHeight: 1.4,
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            BRITISH SOUL<br />COLOMBIAN HEART.
          </div>
        </div>

        <Link
          href="/menu"
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            background: C.burgundy,
            color: C.cream,
            padding: "14px 16px",
            textDecoration: "none",
            pointerEvents: "auto",
            minHeight: 44,
            display: "flex",
            alignItems: "center",
          }}
        >
          PEDIR AHORA ↗
        </Link>
      </div>

      <MobileEditorial />
    </div>
  );
}
