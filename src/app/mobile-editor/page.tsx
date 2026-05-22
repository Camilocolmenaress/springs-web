"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import Image from "next/image";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

// ─── Draggable element wrapper ───────────────────────────────────────────────

interface DragItemProps {
  id: string;
  label: string;
  color: string;
  initialX: number;
  initialY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPos: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  zIndex?: number;
}

function DragItem({ id, label, color, initialX, initialY, containerRef, onPos, children, zIndex = 10 }: DragItemProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const off1 = x.on("change", (v: number) => onPos(id, initialX + v, initialY + y.get()));
    const off2 = y.on("change", (v: number) => onPos(id, initialX + x.get(), initialY + v));
    return () => { off1(); off2(); };
  }, [id, initialX, initialY, onPos, x, y]);

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      style={{
        position: "absolute",
        left: initialX,
        top: initialY,
        x,
        y,
        zIndex,
        cursor: "grab",
        touchAction: "none",
      }}
      whileDrag={{ zIndex: 99, cursor: "grabbing" }}
    >
      {/* Drag handle label */}
      <div style={{
        position: "absolute",
        top: -18,
        left: 0,
        background: color,
        color: "#fff",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.45rem",
        letterSpacing: "0.1em",
        padding: "2px 5px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 100,
      }}>
        {label}
      </div>
      {/* Colored drag border */}
      <div style={{ outline: `1.5px dashed ${color}`, outlineOffset: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Main editor ─────────────────────────────────────────────────────────────

const SECTION_W = 375;
const SECTION_H = 812;

// Initial positions (px) matching current MobileEditorial.tsx
// computed for a 375×812 screen with safeAreaTop ≈ 44px
const SAFE = 44;
const INIT: Record<string, { initialX: number; initialY: number; label: string; color: string; z: number }> = {
  springs:   { initialX: 19,  initialY: SAFE + 68,              label: "SPRINGS",               color: C.burgundy, z: 3  },
  location:  { initialX: 19,  initialY: SAFE + 68 + 88,         label: "⊕ Ubicación",           color: C.mostaza,  z: 5  },
  globe:     { initialX: 19,  initialY: SAFE + 68 + 142,        label: "Globo SVG",             color: C.tinta,    z: 10 },
  jcSticker: { initialX: 240, initialY: SAFE + 62,              label: "Jacket Club sticker",   color: C.burgundy, z: 21 },
  label:     { initialX: 19,  initialY: Math.round(SECTION_H * 0.44), label: "↗ Jacket / La Fija",   color: C.tinta,    z: 5  },
  subtitle:  { initialX: 19,  initialY: Math.round(SECTION_H * 0.58) + 10, label: "JACKETS DIFFERENT…",color: C.burgundy, z: 5  },
  underline: { initialX: 19,  initialY: Math.round(SECTION_H * 0.58) + 44, label: "Subrayado",         color: C.burgundy, z: 5  },
  sensitive: { initialX: 19,  initialY: Math.round(SECTION_H * 0.58) + 68, label: "Sensitive Content",  color: "#666",     z: 8  },
  dados:     { initialX: 263, initialY: Math.round(SECTION_H * 0.52) + 12, label: "Dados sticker",      color: C.mostaza,  z: 22 },
};

export default function MobileEditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(Object.entries(INIT).map(([id, v]) => [id, { x: v.initialX, y: v.initialY }]))
  );
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handlePos = useCallback((id: string, px: number, py: number) => {
    setPositions(prev => ({ ...prev, [id]: { x: Math.round(px), y: Math.round(py) } }));
  }, []);

  const generateCode = useCallback(() => {
    const lines = Object.entries(positions).map(([id, { x, y }]) => {
      const leftVw  = ((x / SECTION_W) * 100).toFixed(1);
      const topSvh  = ((y / SECTION_H) * 100).toFixed(1);
      const label   = INIT[id]?.label ?? id;
      return `// ${label}\nleft: "${leftVw}vw",  top: "${topSvh}svh"`;
    });
    return lines.join("\n\n");
  }, [positions]);

  const copyPositions = async () => {
    const code = generateCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setShowCode(true);
    }
  };

  return (
    <div style={{
      background: C.tinta,
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
    }}>

      {/* ── Header ── */}
      <div style={{
        width: "100%",
        maxWidth: SECTION_W,
        padding: "12px 16px 10px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.52rem",
        letterSpacing: "0.14em",
        color: C.mostaza,
        textTransform: "uppercase",
        borderBottom: `1px solid rgba(242,232,213,0.1)`,
      }}>
        SPRINGS / MOBILE HERO EDITOR — arrastra los elementos
      </div>

      {/* ── Hero canvas ── */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: SECTION_W,
          height: SECTION_H,
          background: C.cream,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >

        {/* ── Static: potato (full width, not draggable) ── */}
        <div style={{ position: "absolute", top: 0, right: -15, width: 307, height: Math.round(SECTION_H * 0.58), zIndex: 4 }}>
          <Image src="/images/la-fija.png" alt="La Fija" fill priority
            style={{ objectFit: "cover", objectPosition: "center top" }} sizes="82vw" />
          <div style={{
            position: "absolute", bottom: 4, right: 4,
            background: "rgba(26,10,12,0.7)",
            color: C.cream, fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.38rem", padding: "2px 5px", pointerEvents: "none",
          }}>
            PAPA — estática
          </div>
        </div>

        {/* ── Static: marquee ── */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 52, zIndex: 6,
          borderTop: `1.5px solid ${C.tinta}`, borderBottom: `1.5px solid ${C.tinta}`,
          padding: "5px 0", background: C.cream, overflow: "hidden",
        }}>
          <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee 18s linear infinite" }}>
            {[0, 1].map(c => (
              <span key={c}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i}>
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: 13, color: C.burgundy, margin: "0 4px" }}>SPRINGS</span>
                    <span style={{ fontFamily: "Anton, sans-serif", fontSize: 11, color: C.burgundy, margin: "0 4px" }}>{"<"}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── Static: bottom strip ── */}
        <div style={{
          position: "absolute", left: 19, right: 19, bottom: 10, zIndex: 5,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <span style={{ fontFamily: "Anton, sans-serif", fontSize: 12, color: C.tinta }}>ART GALLERY</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.32rem", color: C.tinta, opacity: 0.6, textAlign: "right" }}>
            LA FIJA / LA PESADA<br />LA BRAVA / LA SIMPLE
          </span>
        </div>

        {/* ── Draggable elements ── */}

        {/* SPRINGS title */}
        <DragItem id="springs" {...INIT.springs} containerRef={containerRef} onPos={handlePos}>
          <h1 style={{
            fontFamily: "Anton, sans-serif", fontSize: 75, color: C.tinta,
            lineHeight: 0.88, margin: 0, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            SPRINGS
          </h1>
        </DragItem>

        {/* Location */}
        <DragItem id="location" {...INIT.location} containerRef={containerRef} onPos={handlePos}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: C.tinta, opacity: 0.5 }}>⊕</span>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.46rem", letterSpacing: "0.18em", color: C.tinta, lineHeight: 1.6, textTransform: "uppercase", opacity: 0.65 }}>
              Barbosa STDR – COLOMBIA<br />EST. 2025
            </div>
          </div>
        </DragItem>

        {/* Globe */}
        <DragItem id="globe" {...INIT.globe} containerRef={containerRef} onPos={handlePos}>
          <div style={{
            width: 52, height: 52,
            background: "rgba(26,10,12,0.88)", border: "1px solid rgba(242,232,213,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(242,232,213,0.45)" strokeWidth="1.2" width="55%" height="55%">
              <circle cx="12" cy="12" r="10" />
              <g style={{ animation: "globeSpin 12s linear infinite", transformBox: "fill-box", transformOrigin: "center" }}>
                <ellipse cx="12" cy="12" rx="4" ry="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </g>
            </svg>
          </div>
        </DragItem>

        {/* Jacket Club sticker */}
        <DragItem id="jcSticker" {...INIT.jcSticker} containerRef={containerRef} onPos={handlePos} zIndex={21}>
          <div style={{ width: 105, height: 105, position: "relative" }}>
            <Image src="/images/jacket-club-sticker.png" alt="Jacket Club" fill style={{ objectFit: "contain" }} sizes="28vw" />
          </div>
        </DragItem>

        {/* Label ↗ Jacket / La Fija */}
        <DragItem id="label" {...INIT.label} containerRef={containerRef} onPos={handlePos}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: 17, color: C.tinta, lineHeight: 1.15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="21" x2="21" y2="3" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" />
                <polyline points="13,3 21,3 21,11" fill="none" stroke={C.tinta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Jacket
            </div>
            <div style={{ paddingLeft: 16 }}>La Fija</div>
          </div>
        </DragItem>

        {/* Subtitle */}
        <DragItem id="subtitle" {...INIT.subtitle} containerRef={containerRef} onPos={handlePos}>
          <div style={{
            fontFamily: "var(--font-marker), cursive",
            fontSize: 17, color: C.burgundy, lineHeight: 1,
            letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap",
            transform: "rotate(-2deg)", transformOrigin: "left center",
          }}>
            JACKETS DIFFERENT BY DEFAULT
          </div>
        </DragItem>

        {/* Underline stroke */}
        <DragItem id="underline" {...INIT.underline} containerRef={containerRef} onPos={handlePos}>
          <div style={{ position: "relative", width: 187, height: 11, transform: "rotate(-2.5deg)" }}>
            <Image src="/images/underline-stroke.png" alt="" fill
              style={{ objectFit: "contain", objectPosition: "left center" }} sizes="50vw" />
          </div>
        </DragItem>

        {/* Sensitive Content */}
        <DragItem id="sensitive" {...INIT.sensitive} containerRef={containerRef} onPos={handlePos} zIndex={8}>
          <div style={{
            width: 172, height: 138,
            background: "rgba(26,10,12,0.82)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 6, padding: 10,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.4" width={28} height={28}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" /><line x1="3" y1="3" x2="21" y2="21" />
            </svg>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.42rem", letterSpacing: "0.2em", color: C.cream, textTransform: "uppercase" }}>
              SENSITIVE CONTENT
            </span>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: C.cream, textAlign: "center", lineHeight: 1.3, opacity: 0.8 }}>
              Puedes quedar así de hot<br />después de comer Springs.
            </p>
            <div style={{ marginTop: 4, padding: "3px 8px", border: "1px solid rgba(242,232,213,0.4)", color: C.cream, fontFamily: "JetBrains Mono, monospace", fontSize: "0.38rem", letterSpacing: "0.12em" }}>
              VER DE TODAS FORMAS
            </div>
          </div>
        </DragItem>

        {/* Dados sticker */}
        <DragItem id="dados" {...INIT.dados} containerRef={containerRef} onPos={handlePos} zIndex={22}>
          <div style={{ width: 97, height: 97, position: "relative" }}>
            <Image src="/images/miercoles-dados-sticker.png" alt="Dados" fill style={{ objectFit: "contain" }} sizes="26vw" />
          </div>
        </DragItem>

      </div>

      {/* ── Positions panel ── */}
      <div style={{
        width: "100%",
        maxWidth: SECTION_W,
        background: "#111",
        padding: "16px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.08em",
        color: "#aaa",
      }}>
        <div style={{ color: C.mostaza, marginBottom: 12, fontSize: "0.55rem", letterSpacing: "0.14em" }}>
          POSICIONES ACTUALES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(positions).map(([id, { x, y }]) => {
            const leftVw  = ((x / SECTION_W) * 100).toFixed(1);
            const topSvh  = ((y / SECTION_H) * 100).toFixed(1);
            return (
              <div key={id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: 4 }}>
                <span style={{ color: INIT[id]?.color ?? "#fff" }}>{INIT[id]?.label ?? id}</span>
                <span style={{ color: "#fff" }}>left:{leftVw}vw  top:{topSvh}svh</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={copyPositions}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "16px",
            background: copied ? C.burgundy : C.mostaza,
            color: C.tinta,
            fontFamily: "Anton, sans-serif",
            fontSize: "1rem",
            letterSpacing: "0.1em",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "background 0.2s",
          }}
        >
          {copied ? "¡COPIADO! ✓" : "COPIAR POSICIONES"}
        </button>

        {showCode && (
          <textarea
            readOnly
            value={generateCode()}
            style={{
              marginTop: 12, width: "100%", height: 220,
              background: "#0a0a0a", color: C.mostaza,
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.45rem",
              border: "1px solid #333", padding: 10, resize: "none",
            }}
          />
        )}
      </div>

    </div>
  );
}
