"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

const WARNING = "Warning: Puedes quedar así de hot después de comer Springs.";

// Imagen natural: 447×558 (portrait). Tras rotar -90°: 558×447 (landscape).
// Inner wrapper portrait dentro del contenedor landscape:
const INNER_W_PCT = (447 / 558) * 100; // 80.11%
const INNER_H_PCT = (558 / 447) * 100; // 124.83%

interface Props {
  src: string;
  fontSize?: number;
  opacity?: number; // 0–100
}

export default function SensitiveImage({ src, fontSize = 1.1, opacity = 60 }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Wrapper rotado: caja portrait que tras rotar -90° llena exactamente el contenedor landscape */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${INNER_W_PCT}%`,
        height: `${INNER_H_PCT}%`,
        transform: "translate(-50%, -50%) rotate(-90deg)",
        transformOrigin: "center",
      }}>
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <AnimatePresence>
        {!revealed ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              background: `rgba(26,10,12,${opacity / 100})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: `${fontSize * 1}vw`,
              padding: `${fontSize * 1.2}vw`,
            }}
          >
            {/* Ojo + título pegados */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${fontSize * 0.05}vw` }}>
              <svg viewBox="0 0 24 24" fill="none"
                stroke={C.cream} strokeWidth="1.4" strokeLinecap="round"
                style={{ width: `${fontSize * 2.8}vw`, height: `${fontSize * 2.8}vw`, flexShrink: 0 }}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="3" x2="21" y2="21" />
              </svg>
              <span style={{
                ...MONO,
                fontSize: `${fontSize * 1.05}vw`,
                letterSpacing: "0.2em",
                color: C.cream,
                textTransform: "uppercase",
              }}>
                Sensitive content
              </span>
            </div>

            <p style={{
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: `${fontSize * 1.35}vw`,
              color: C.cream,
              lineHeight: 1.4,
              textAlign: "center",
              fontWeight: 500,
            }}>
              {WARNING}
            </p>

            <button
              onClick={() => setRevealed(true)}
              style={{
                marginTop: `${fontSize * 0.3}vw`,
                padding: `${fontSize * 0.5}vw ${fontSize * 1.3}vw`,
                background: "transparent",
                border: `1px solid rgba(242,232,213,0.5)`,
                color: C.cream,
                ...MONO,
                fontSize: `${fontSize * 0.6}vw`,
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
        ) : (
          <motion.button
            key="recensor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={() => setRevealed(false)}
            style={{
              position: "absolute",
              bottom: `${fontSize * 0.8}vw`,
              left: "50%",
              transform: "translateX(-50%)",
              padding: `${fontSize * 0.4}vw ${fontSize * 1}vw`,
              background: "rgba(26,10,12,0.7)",
              border: `1px solid rgba(242,232,213,0.3)`,
              color: C.cream,
              ...MONO,
              fontSize: `${fontSize * 0.55}vw`,
              letterSpacing: "0.12em",
              cursor: "pointer",
              textTransform: "uppercase",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              whiteSpace: "nowrap",
            }}
          >
            Volver a tapar
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
