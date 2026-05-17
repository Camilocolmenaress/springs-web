"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export interface DesignValues {
  titleSize: number;       // vw
  potatoWidth: number;     // vw
  potatoLeft: number;      // vw
  potatoBottom: number;    // px
  subtitleSize: number;    // vw
  titleLeft: number;       // vw
  titleTop: number;        // vh
  bodyCopyLeft: number;    // vw
  artGallerySize: number;  // vw
  artGalleryBottom: number;// px
  artGalleryLeft: number;  // vw
}

interface Props {
  values: DesignValues;
  onChange: (key: keyof DesignValues, val: number) => void;
  potatoDragOffset: { x: number; y: number };
}

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const F = { mono: { fontFamily: "JetBrains Mono, monospace" } };

const SLIDERS: Array<{
  key: keyof DesignValues;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = [
  { key: "titleSize",    label: "SPRINGS tamaño",  min: 12, max: 30,  step: 0.5, unit: "vw" },
  { key: "titleLeft",    label: "SPRINGS left",     min: 20, max: 60,  step: 1,   unit: "vw" },
  { key: "titleTop",     label: "SPRINGS top",      min: 5,  max: 35,  step: 1,   unit: "vh" },
  { key: "potatoWidth",  label: "Papa ancho",       min: 30, max: 80,  step: 1,   unit: "vw" },
  { key: "potatoLeft",   label: "Papa left",        min: -15,max: 30,  step: 1,   unit: "vw" },
  { key: "potatoBottom", label: "Papa bottom",      min: 0,  max: 200, step: 5,   unit: "px" },
  { key: "subtitleSize", label: "Subtítulo tamaño", min: 1.5,max: 4.5, step: 0.1, unit: "vw" },
  { key: "bodyCopyLeft",      label: "Texto body left",    min: 30,  max: 60,  step: 1,   unit: "vw" },
  { key: "artGallerySize",   label: "ART GALLERY tamaño", min: 5,   max: 22,  step: 0.5, unit: "vw" },
  { key: "artGalleryBottom", label: "ART GALLERY bottom",  min: 0,   max: 200, step: 5,   unit: "px" },
  { key: "artGalleryLeft",   label: "ART GALLERY left",    min: -20, max: 60,  step: 1,   unit: "vw" },
];

export default function DevPanel({ values, onChange, potatoDragOffset }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const dragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const exportCode = () => {
    const potatoLeftFinal = values.potatoLeft + Math.round(potatoDragOffset.x / 14.4) / 10;
    const potatoBottomFinal = values.potatoBottom - Math.round(potatoDragOffset.y);

    const code = `/* ── VALORES DEV PANEL ── */
potatoWidth:      "${values.potatoWidth}vw"
potatoLeft:       "${potatoLeftFinal.toFixed(1)}vw"
potatoBottom:     "${potatoBottomFinal}px"
titleSize:        "clamp(120px, ${values.titleSize}vw, 340px)"
titleLeft:        "${values.titleLeft}vw"
titleTop:         "${values.titleTop}vh"
subtitleSize:     "clamp(18px, ${values.subtitleSize}vw, 42px)"
bodyCopyLeft:     "${values.bodyCopyLeft}vw"
artGallerySize:   "${values.artGallerySize}vw"
artGalleryBottom: "${values.artGalleryBottom}px"
artGalleryLeft:   "${values.artGalleryLeft}vw"`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const potatoLeftFinal = (values.potatoLeft + potatoDragOffset.x / 14.4).toFixed(1);
  const potatoBottomFinal = Math.round(values.potatoBottom - potatoDragOffset.y);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        position: "fixed", right: 16, top: "30%",
        zIndex: 9999, width: 260,
        background: C.tinta,
        border: `1px solid rgba(242,232,213,0.15)`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "9px 12px",
          borderBottom: `1px solid rgba(242,232,213,0.1)`,
          background: C.burgundy,
          cursor: "grab",
        }}
        onClick={() => setCollapsed(v => !v)}
      >
        <span style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.2em", color: C.cream }}>
          ⚙ SPRINGS DEV
        </span>
        <span style={{ color: C.cream, fontSize: "0.6rem" }}>{collapsed ? "▲" : "▼"}</span>
      </div>

      {!collapsed && (
        <>
          {/* Sliders */}
          <div style={{ padding: "10px 12px" }}>
            {SLIDERS.map(s => (
              <div key={s.key} style={{ marginBottom: 10 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: 3,
                  ...F.mono, fontSize: "0.52rem", letterSpacing: "0.08em",
                }}>
                  <span style={{ color: C.cream, opacity: 0.65 }}>{s.label}</span>
                  <span style={{ color: C.mostaza }}>
                    {s.key === "potatoLeft"
                      ? `${potatoLeftFinal}${s.unit}`
                      : s.key === "potatoBottom"
                      ? `${potatoBottomFinal}${s.unit}`
                      : `${values[s.key]}${s.unit}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step}
                  value={values[s.key]}
                  onChange={e => onChange(s.key, Number(e.target.value))}
                  style={{ width: "100%", accentColor: C.burgundy, cursor: "pointer" }}
                />
              </div>
            ))}
          </div>

          {/* Potato live coords */}
          <div style={{
            margin: "0 12px 10px",
            padding: "8px 10px",
            background: "rgba(242,232,213,0.06)",
            border: `1px solid rgba(242,232,213,0.1)`,
          }}>
            <div style={{ ...F.mono, fontSize: "0.5rem", color: C.cream, opacity: 0.5, letterSpacing: "0.12em", marginBottom: 4 }}>
              PAPA — POSICIÓN ACTUAL
            </div>
            <div style={{ ...F.mono, fontSize: "0.6rem", color: C.mostaza }}>
              left: {potatoLeftFinal}vw
            </div>
            <div style={{ ...F.mono, fontSize: "0.6rem", color: C.mostaza }}>
              bottom: {potatoBottomFinal}px
            </div>
            <div style={{ ...F.mono, fontSize: "0.46rem", color: C.cream, opacity: 0.4, marginTop: 4 }}>
              Arrastra la papa en la página
            </div>
          </div>

          {/* Copy button */}
          <div style={{ padding: "0 12px 12px" }}>
            <button
              onClick={exportCode}
              style={{
                width: "100%", padding: "8px 0",
                background: copied ? "#2a5a2a" : C.burgundy,
                color: C.cream, border: "none",
                ...F.mono, fontSize: "0.58rem", letterSpacing: "0.18em",
                cursor: "pointer", transition: "background 0.2s",
              }}
            >
              {copied ? "✓ COPIADO" : "COPIAR VALORES →"}
            </button>
            <div style={{ ...F.mono, fontSize: "0.44rem", color: C.cream, opacity: 0.35, marginTop: 5, textAlign: "center", lineHeight: 1.5 }}>
              Pega los valores y dile a Claude que los aplique
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
