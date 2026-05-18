"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

const WARNINGS = [
  "Warning: Esta persona comió Springs (no mentiras).",
  "Warning: Perdón otra vez.",
  "Warning: Puedes quedar así de hot después de comer Springs.",
];

interface Props {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function SensitiveImage({ src, alt = "", style }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      <AnimatePresence>
        {!revealed && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              background: "rgba(26,10,12,0.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8vw",
              padding: "1.5vw",
            }}
          >
            {/* Eye icon con línea */}
            <svg width="2.2vw" height="2.2vw" viewBox="0 0 24 24" fill="none"
              stroke={C.cream} strokeWidth="1.4" strokeLinecap="round"
              style={{ width: "2.2vw", height: "2.2vw", flexShrink: 0 }}
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>

            <span style={{
              ...MONO,
              fontSize: "0.7vw",
              letterSpacing: "0.18em",
              color: C.cream,
              textTransform: "uppercase",
            }}>
              Sensitive content
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35vw", width: "100%" }}>
              {WARNINGS.map((w, i) => (
                <p key={i} style={{
                  margin: 0,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.52vw",
                  color: C.cream,
                  opacity: 0.75,
                  lineHeight: 1.5,
                  textAlign: "center",
                }}>
                  {w}
                </p>
              ))}
            </div>

            <button
              onClick={() => setRevealed(true)}
              style={{
                marginTop: "0.4vw",
                padding: "0.5vw 1.2vw",
                background: "transparent",
                border: `1px solid rgba(242,232,213,0.5)`,
                color: C.cream,
                ...MONO,
                fontSize: "0.45vw",
                letterSpacing: "0.14em",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.borderColor = C.mostaza;
                (e.target as HTMLButtonElement).style.color = C.mostaza;
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.borderColor = "rgba(242,232,213,0.5)";
                (e.target as HTMLButtonElement).style.color = C.cream;
              }}
            >
              Ver de todas formas
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
