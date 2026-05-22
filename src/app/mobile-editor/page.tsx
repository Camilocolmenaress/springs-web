"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import Image from "next/image";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

// ─── Sticker element: drag + pinch-to-scale + rotate ─────────────────────────

interface StickerState { x: number; y: number; scale: number; rotate: number }

interface StickerProps {
  id: string;
  label: string;
  color: string;
  init: StickerState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onUpdate: (id: string, s: StickerState) => void;
  children: React.ReactNode;
  zIndex?: number;
}

function Sticker({ id, label, color, init, containerRef, onUpdate, children, zIndex = 10 }: StickerProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const notify = useCallback(() => {
    onUpdate(id, {
      x:      init.x + mx.get(),
      y:      init.y + my.get(),
      scale:  1,
      rotate: 0,
    });
  }, [id, init.x, init.y, mx, my, onUpdate]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      style={{
        position: "absolute",
        left: init.x,
        top:  init.y,
        x: mx,
        y: my,
        zIndex,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        transformOrigin: "center center",
        cursor: "grab",
      }}
      onDrag={() => notify()}
    >
      {/* Label badge */}
      <div style={{
        position: "absolute",
        top: -18,
        left: 0,
        background: color,
        color: "#fff",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.42rem",
        letterSpacing: "0.1em",
        padding: "2px 5px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 1000,
      }}>
        {label}
      </div>
      {/* Colored outline */}
      <div style={{ outline: `1.5px dashed ${color}`, outlineOffset: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_W = 375;
const SECTION_H = 812;
const SAFE = 44;

const INIT: Record<string, { init: StickerState; label: string; color: string; z: number }> = {
  potato:    { init: { x: 68,  y: 0,                              scale: 1, rotate: 0  }, label: "La Fija (papa)",       color: "#8B5E3C",  z: 4  },
  springs:   { init: { x: 19,  y: SAFE + 68,                      scale: 1, rotate: 0  }, label: "SPRINGS",              color: C.burgundy, z: 3  },
  location:  { init: { x: 19,  y: SAFE + 68 + 88,                 scale: 1, rotate: 0  }, label: "⊕ Ubicación",          color: C.mostaza,  z: 5  },
  globe:     { init: { x: 19,  y: SAFE + 68 + 142,                scale: 1, rotate: 0  }, label: "Globo",                color: C.tinta,    z: 10 },
  jcSticker: { init: { x: 240, y: SAFE + 62,                      scale: 1, rotate: -8 }, label: "Jacket Club sticker",  color: C.burgundy, z: 21 },
  label:     { init: { x: 19,  y: Math.round(SECTION_H * 0.44),   scale: 1, rotate: 0  }, label: "↗ Jacket / La Fija",  color: C.tinta,    z: 5  },
  subtitle:  { init: { x: 19,  y: Math.round(SECTION_H * 0.58)+10,scale: 1, rotate: -2 }, label: "JACKETS DIFFERENT…",  color: C.burgundy, z: 5  },
  underline: { init: { x: 19,  y: Math.round(SECTION_H * 0.58)+44,scale: 1, rotate:-2.5}, label: "Subrayado",            color: C.burgundy, z: 5  },
  sensitive: { init: { x: 19,  y: Math.round(SECTION_H * 0.58)+68,scale: 1, rotate: 0  }, label: "Sensitive Content",   color: "#666",     z: 8  },
  dados:     { init: { x: 263, y: Math.round(SECTION_H * 0.52)+12,scale: 1, rotate: 12 }, label: "Dados sticker",       color: C.mostaza,  z: 22 },
  marquee:   { init: { x: 0,   y: SECTION_H - 82,                 scale: 1, rotate: 0  }, label: "Marquee tape",        color: "#555",     z: 6  },
  strip:     { init: { x: 19,  y: SECTION_H - 30,                 scale: 1, rotate: 0  }, label: "ART GALLERY strip",   color: "#555",     z: 5  },
};

// ─── Main editor ─────────────────────────────────────────────────────────────

export default function MobileEditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [states, setStates] = useState<Record<string, StickerState>>(() =>
    Object.fromEntries(Object.entries(INIT).map(([id, v]) => [id, { ...v.init }]))
  );
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleUpdate = useCallback((id: string, s: StickerState) => {
    setStates(prev => ({ ...prev, [id]: s }));
  }, []);

  const generateCode = useCallback(() => {
    const lines = Object.entries(states).map(([id, { x, y, scale, rotate }]) => {
      const leftVw  = ((x / SECTION_W) * 100).toFixed(1);
      const topSvh  = ((y / SECTION_H) * 100).toFixed(1);
      const label   = INIT[id]?.label ?? id;
      return `// ${label}\nleft:"${leftVw}vw" top:"${topSvh}svh" scale:${scale.toFixed(2)} rotate:${rotate.toFixed(1)}deg`;
    });
    return lines.join("\n\n");
  }, [states]);

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

      {/* ── Floating copy button — always visible ── */}
      <div style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        {showCode && (
          <textarea
            readOnly
            value={generateCode()}
            onClick={e => (e.target as HTMLTextAreaElement).select()}
            style={{
              width: 340, height: 160,
              background: "rgba(10,10,10,0.97)", color: C.mostaza,
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.42rem",
              border: `1px solid ${C.mostaza}`, padding: 10, resize: "none",
              boxSizing: "border-box",
            }}
          />
        )}
        <button
          onClick={copyPositions}
          style={{
            padding: "14px 32px",
            background: copied ? C.burgundy : C.mostaza,
            color: C.tinta,
            fontFamily: "Anton, sans-serif",
            fontSize: "1rem",
            letterSpacing: "0.12em",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "¡COPIADO! ✓" : "COPIAR POSICIONES"}
        </button>
      </div>

      {/* ── Header ── */}
      <div style={{
        width: "100%",
        maxWidth: SECTION_W,
        padding: "12px 16px 10px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.48rem",
        letterSpacing: "0.12em",
        color: C.mostaza,
        textTransform: "uppercase",
        borderBottom: `1px solid rgba(242,232,213,0.1)`,
        lineHeight: 1.6,
      }}>
        SPRINGS HERO EDITOR<br />
        <span style={{ color: "rgba(242,232,213,0.4)", fontSize: "0.42rem" }}>
          1 dedo = mover · 2 dedos = escalar / rotar
        </span>
      </div>

      {/* ── Hero canvas ── */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: SECTION_W,
          height: SECTION_H,
          background: C.cream,
          flexShrink: 0,
          overflow: "visible",   // allow scaled elements to bleed out temporarily
        }}
      >
        {/* Clip frame */}
        <div style={{
          position: "absolute", inset: 0,
          outline: `2px solid ${C.mostaza}`,
          pointerEvents: "none", zIndex: 999,
        }} />

        {/* La Fija (papa) */}
        <Sticker id="potato" {...INIT.potato} containerRef={containerRef} onUpdate={handleUpdate}>
          <div style={{ width: 307, height: Math.round(SECTION_H * 0.58), position: "relative" }}>
            <Image src="/images/la-fija.png" alt="La Fija" fill priority
              style={{ objectFit: "cover", objectPosition: "center top" }} sizes="82vw" />
          </div>
        </Sticker>

        {/* SPRINGS title */}
        <Sticker id="springs" {...INIT.springs} containerRef={containerRef} onUpdate={handleUpdate}>
          <h1 style={{
            fontFamily: "Anton, sans-serif", fontSize: 75, color: C.tinta,
            lineHeight: 0.88, margin: 0, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            SPRINGS
          </h1>
        </Sticker>

        {/* Location */}
        <Sticker id="location" {...INIT.location} containerRef={containerRef} onUpdate={handleUpdate}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: C.tinta, opacity: 0.5 }}>⊕</span>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.46rem", letterSpacing: "0.18em", color: C.tinta, lineHeight: 1.6, textTransform: "uppercase", opacity: 0.65 }}>
              Barbosa STDR – COLOMBIA<br />EST. 2025
            </div>
          </div>
        </Sticker>

        {/* Globe */}
        <Sticker id="globe" {...INIT.globe} containerRef={containerRef} onUpdate={handleUpdate}>
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
        </Sticker>

        {/* Jacket Club sticker */}
        <Sticker id="jcSticker" {...INIT.jcSticker} containerRef={containerRef} onUpdate={handleUpdate} zIndex={21}>
          <div style={{ width: 105, height: 105, position: "relative" }}>
            <Image src="/images/jacket-club-sticker.png" alt="Jacket Club" fill style={{ objectFit: "contain" }} sizes="28vw" />
          </div>
        </Sticker>

        {/* Label ↗ Jacket / La Fija */}
        <Sticker id="label" {...INIT.label} containerRef={containerRef} onUpdate={handleUpdate}>
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
        </Sticker>

        {/* Subtitle */}
        <Sticker id="subtitle" {...INIT.subtitle} containerRef={containerRef} onUpdate={handleUpdate}>
          <div style={{
            fontFamily: "var(--font-marker), cursive",
            fontSize: 17, color: C.burgundy, lineHeight: 1,
            letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            JACKETS DIFFERENT BY DEFAULT
          </div>
        </Sticker>

        {/* Underline stroke */}
        <Sticker id="underline" {...INIT.underline} containerRef={containerRef} onUpdate={handleUpdate}>
          <div style={{ position: "relative", width: 187, height: 11 }}>
            <Image src="/images/underline-stroke.png" alt="" fill style={{ objectFit: "contain", objectPosition: "left center" }} sizes="50vw" />
          </div>
        </Sticker>

        {/* Sensitive Content */}
        <Sticker id="sensitive" {...INIT.sensitive} containerRef={containerRef} onUpdate={handleUpdate} zIndex={8}>
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
        </Sticker>

        {/* Dados sticker */}
        <Sticker id="dados" {...INIT.dados} containerRef={containerRef} onUpdate={handleUpdate} zIndex={22}>
          <div style={{ width: 97, height: 97, position: "relative" }}>
            <Image src="/images/miercoles-dados-sticker.png" alt="Dados" fill style={{ objectFit: "contain" }} sizes="26vw" />
          </div>
        </Sticker>

        {/* Marquee */}
        <Sticker id="marquee" {...INIT.marquee} containerRef={containerRef} onUpdate={handleUpdate} zIndex={6}>
          <div style={{
            width: SECTION_W,
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
        </Sticker>

        {/* ART GALLERY strip */}
        <Sticker id="strip" {...INIT.strip} containerRef={containerRef} onUpdate={handleUpdate} zIndex={5}>
          <div style={{ width: SECTION_W - 38, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontFamily: "Anton, sans-serif", fontSize: 12, color: C.tinta }}>ART GALLERY</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.32rem", color: C.tinta, opacity: 0.6, textAlign: "right" }}>
              LA FIJA / LA PESADA<br />LA BRAVA / LA SIMPLE
            </span>
          </div>
        </Sticker>

      </div>

      {/* ── Positions panel ── */}
      <div style={{
        width: "100%",
        maxWidth: SECTION_W,
        background: "#111",
        padding: "16px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.45rem",
        letterSpacing: "0.08em",
        color: "#aaa",
      }}>
        <div style={{ color: C.mostaza, marginBottom: 12, fontSize: "0.52rem", letterSpacing: "0.14em" }}>
          POSICIONES ACTUALES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(states).map(([id, { x, y, scale, rotate }]) => {
            const leftVw = ((x / SECTION_W) * 100).toFixed(1);
            const topSvh = ((y / SECTION_H) * 100).toFixed(1);
            return (
              <div key={id} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, borderBottom: "1px solid #222", paddingBottom: 4 }}>
                <span style={{ color: INIT[id]?.color ?? "#fff", minWidth: 120 }}>{INIT[id]?.label ?? id}</span>
                <span style={{ color: "#fff" }}>
                  {leftVw}vw · {topSvh}svh · ×{scale.toFixed(1)} · {rotate.toFixed(0)}°
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ height: 80 }} />{/* spacer so content doesn't hide behind floating button */}
      </div>

    </div>
  );
}
