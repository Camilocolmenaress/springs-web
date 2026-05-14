"use client";

import Link from "next/link";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans: { fontFamily: "Inter, sans-serif" },
  mono: { fontFamily: "JetBrains Mono, monospace" },
};

type Props = {
  onBack?: () => void;
};

export default function MobilePedir({ onBack }: Props) {
  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        background: C.burgundy,
        color: C.cream,
        display: "flex",
        flexDirection: "column",
        padding: "max(20px, env(safe-area-inset-top, 20px)) 24px max(20px, env(safe-area-inset-bottom, 20px))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: `1px solid ${C.cream}`,
          color: C.cream,
          padding: "8px 14px",
          ...F.mono,
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        ← VOLVER
      </button>

      <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginTop: 18 }}>
        ↗ SIN EXCUSAS · ESTO ES SPRINGS
      </div>

      <h2
        style={{
          ...F.display,
          fontSize: "clamp(60px, 22vw, 110px)",
          lineHeight: 0.88,
          margin: "10px 0 0",
          letterSpacing: "-0.005em",
          textTransform: "uppercase",
          color: C.cream,
        }}
      >
        PEDIR<br />YA.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
        <a
          href="#"
          style={{
            ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
            color: C.tinta, background: C.cream,
            padding: "18px 22px", textDecoration: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            minHeight: 56,
          }}
        >
          RAPPI <span>→</span>
        </a>
        <a
          href="#"
          style={{
            ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
            color: C.cream, background: "transparent",
            border: `1px solid ${C.cream}`,
            padding: "18px 22px", textDecoration: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            minHeight: 56,
          }}
        >
          UBER EATS <span>→</span>
        </a>
        <Link
          href="/menu"
          style={{
            ...F.display, fontSize: "1.1rem", letterSpacing: "0.12em",
            color: C.mostaza, background: "transparent",
            border: `1px solid ${C.mostaza}`,
            padding: "18px 22px", textDecoration: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            minHeight: 56,
          }}
        >
          PEDIDO DIRECTO <span>→</span>
        </Link>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Horario", val: "12PM — 9PM", sub: "Lunes a domingo" },
          { label: "Zona", val: "BUCARAMANGA", sub: "Cabecera · Cañaveral · Sotomayor" },
          { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · ahorrás 9,900" },
        ].map((i) => (
          <div key={i.label} style={{ borderTop: `1px solid rgba(242,232,213,0.15)`, paddingTop: 10 }}>
            <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: 2 }}>{i.label}</div>
            <div style={{ ...F.display, fontSize: "1.05rem", letterSpacing: "0.05em", color: C.cream }}>{i.val}</div>
            <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.55, marginTop: 1 }}>{i.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
