"use client";

import { useState } from "react";

const IPHONE_W = 393;
const IPHONE_H = 852;
const FRAME_W = IPHONE_W + 18;
const FRAME_H = IPHONE_H + 18;
const RADIUS = 54;

export default function PreviewPage() {
  const [route, setRoute] = useState("/menu");

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #f7eddb 0%, #e9dcc1 60%, #d4c5a4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 24,
        boxSizing: "border-box",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      <Toolbar route={route} setRoute={setRoute} />
      <DevicePreview route={route} />
      <Caption />
    </main>
  );
}

function Toolbar({ route, setRoute }: { route: string; setRoute: (r: string) => void }) {
  const routes = [
    { label: "MENÚ", value: "/menu" },
    { label: "HOME", value: "/" },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-jetbrains-mono), monospace",
      }}
    >
      <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#1A0A0C", opacity: 0.55 }}>
        iPhone 14 Pro · 393 × 852
      </span>
      <span style={{ opacity: 0.3 }}>·</span>
      {routes.map((r) => {
        const active = route === r.value;
        return (
          <button
            key={r.value}
            onClick={() => setRoute(r.value)}
            style={{
              fontFamily: "inherit",
              fontSize: 11,
              letterSpacing: "0.2em",
              padding: "6px 12px",
              background: active ? "#1A0A0C" : "transparent",
              color: active ? "#F2E8D5" : "#1A0A0C",
              border: "1px solid #1A0A0C",
              cursor: "pointer",
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

function DevicePreview({ route }: { route: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: FRAME_W,
        height: FRAME_H,
        maxHeight: "calc(100vh - 140px)",
        aspectRatio: `${FRAME_W} / ${FRAME_H}`,
      }}
    >
      <DeviceFrame route={route} />
    </div>
  );
}

function DeviceFrame({ route }: { route: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(160deg, #2b2b2f 0%, #1a1a1d 45%, #0e0e10 100%)",
        padding: 9,
        boxSizing: "border-box",
        clipPath: `inset(0 round ${RADIUS}px)`,
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.35), 0 8px 18px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Botones laterales */}
      <span style={sideButton({ left: -2, top: 110, h: 30 })} />
      <span style={sideButton({ left: -2, top: 170, h: 60 })} />
      <span style={sideButton({ left: -2, top: 250, h: 60 })} />
      <span style={sideButton({ right: -2, top: 160, h: 90 })} />

      {/* Pantalla */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#000",
          clipPath: `inset(0 round ${RADIUS - 8}px)`,
          overflow: "hidden",
        }}
      >
        <iframe
          key={route}
          src={route}
          title="Springs preview"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
            background: "var(--cream)",
          }}
        />

        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: "50%",
            transform: "translateX(-50%)",
            width: 124,
            height: 35,
            background: "#000",
            clipPath: "inset(0 round 18px)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Hora */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 28,
            color: "#fff",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 13,
            fontWeight: 600,
            zIndex: 11,
            pointerEvents: "none",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          9:41
        </div>

        {/* Status icons */}
        <div
          style={{
            position: "absolute",
            top: 17,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 5,
            zIndex: 11,
            pointerEvents: "none",
            color: "#fff",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.05em",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          <span>5G</span>
          <span
            style={{
              display: "inline-block",
              width: 22,
              height: 11,
              border: "1px solid #fff",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 1,
                background: "#fff",
              }}
            />
          </span>
        </div>

        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 134,
            height: 5,
            background: "rgba(255,255,255,0.75)",
            zIndex: 10,
            pointerEvents: "none",
            mixBlendMode: "difference",
          }}
        />
      </div>
    </div>
  );
}

function sideButton({
  left,
  right,
  top,
  h,
}: {
  left?: number;
  right?: number;
  top: number;
  h: number;
}): React.CSSProperties {
  return {
    position: "absolute",
    width: 3,
    height: h,
    top,
    left: left ?? undefined,
    right: right ?? undefined,
    background: "linear-gradient(90deg, #050505 0%, #2a2a2f 100%)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
  };
}

function Caption() {
  return (
    <p
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#1A0A0C",
        opacity: 0.4,
        margin: 0,
      }}
    >
      Preview interactivo — clic en las flechas o cards laterales.
    </p>
  );
}
