"use client";

import Link from "next/link";
import Menu from "@/components/Menu";

export default function MenuPage() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflowY: "auto", background: "var(--cream)", position: "relative" }}>
      <Link
        href="/"
        aria-label="Volver al home"
        style={{
          position: "fixed",
          top: "max(16px, env(safe-area-inset-top, 16px))",
          left: 16,
          zIndex: 50,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "var(--cream)",
          color: "var(--tinta)",
          border: "1px solid var(--tinta)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textDecoration: "none",
          mixBlendMode: "multiply",
        }}
      >
        <span aria-hidden>←</span> VOLVER
      </Link>
      <Menu onAgregar={(p) => console.log("AGREGAR", p.nombre)} />
    </main>
  );
}
