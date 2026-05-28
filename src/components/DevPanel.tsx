"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PageConfig, SliderProp, FontProp, ColorProp, ImageProp, AnimationProp } from "@/types/design";
import SliderControl from "@/components/dev/SliderControl";
import FontPicker from "@/components/dev/FontPicker";
import ColorPicker from "@/components/dev/ColorPicker";
import ImagePicker from "@/components/dev/ImagePicker";
import AnimationPicker from "@/components/dev/AnimationPicker";
import TextInput from "@/components/dev/TextInput";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

const PROP_LABELS: Record<string, string> = {
  fontSize: "Tamaño", size: "Tamaño cuadro", left: "Left", top: "Top", bottom: "Bottom",
  width: "Ancho", content: "Texto", fontFamily: "Fuente",
  color: "Color", src: "Imagen", animation: "Animación",
  rotation: "Rotación",
  textOffset: "Posición texto",
  textRadius: "Distancia al globo",
  globeRadius: "Tamaño globo",
  lineHeight: "Espacio líneas",
  gap: "Separación ⊕",
  globeOffsetY: "Altura ⊕",
  globeSize: "Tamaño ⊕",
  height: "Alto",
  opacity: "Opacidad",
  dropStart: "Offset caída (vw antes)",
  scale: "Escala",
  flex: "Proporción",
  right: "Padding derecho",
  letterSpacing: "Esp. letras",
  itemGap: "Esp. entre ítems",
  wordSpacing: "Esp. palabras",
};

interface Props {
  config: PageConfig;
  saved: boolean;
  onUpdate: (zone: string, element: string, propKey: string, value: string | number) => void;
  onSave: () => void;
  onExport: () => void;
  onReset: () => void;
  categoria?: string;
  inlineSidebar?: boolean;
}

export default function DevPanel({ config, saved, onUpdate, onSave, onExport, onReset, categoria, inlineSidebar }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [openZones, setOpenZones] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const toggleZone = (key: string) => {
    setOpenZones(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    onExport();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  const sidebarStyle = {
    position: "relative" as const,
    height: "100%", width: "100%",
    background: C.tinta,
    borderLeft: "1px solid rgba(242,232,213,0.12)",
    display: "flex", flexDirection: "column" as const,
    overflow: "hidden",
  };

  const mobileStyle = {
    position: "fixed" as const,
    bottom: 0, left: 0, right: 0,
    zIndex: 99999, width: "100%",
    background: C.tinta,
    border: "1px solid rgba(242,232,213,0.15)",
    borderBottom: "none",
    boxShadow: "0 -8px 32px rgba(0,0,0,0.7)",
    cursor: "default", userSelect: "none" as const,
    maxHeight: collapsed ? "44px" : "72vh",
    display: "flex", flexDirection: "column" as const,
    transition: "max-height 0.3s ease",
  };

  const desktopStyle = {
    position: "fixed" as const, right: 16, top: "15%",
    zIndex: 9999, width: 280,
    background: C.tinta,
    border: "1px solid rgba(242,232,213,0.15)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
    cursor: "grab", userSelect: "none" as const,
    maxHeight: "70vh", display: "flex", flexDirection: "column" as const,
  };

  const containerStyle = inlineSidebar ? sidebarStyle : (isMobile ? mobileStyle : desktopStyle);

  return (
    <motion.div
      drag={!inlineSidebar && !isMobile}
      dragMomentum={false}
      style={containerStyle}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: isMobile ? "12px 16px" : "9px 12px",
          borderBottom: "1px solid rgba(242,232,213,0.1)",
          background: C.burgundy, cursor: isMobile ? "pointer" : "grab", flexShrink: 0,
          minHeight: isMobile ? 44 : "auto",
        }}
        onClick={() => !inlineSidebar && setCollapsed(v => !v)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isMobile && !inlineSidebar && (
            <div style={{
              width: 32, height: 3, background: "rgba(242,232,213,0.35)",
              position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
            }} />
          )}
          <span style={{ ...MONO, fontSize: isMobile ? "0.62rem" : "0.58rem", letterSpacing: "0.2em", color: C.cream }}>
            SPRINGS DEV {!saved && "●"}
          </span>
        </div>
        <span style={{ color: C.cream, fontSize: isMobile ? "0.8rem" : "0.6rem" }}>
          {collapsed ? "↑" : "↓"}
        </span>
      </div>

      {(!collapsed || inlineSidebar) && (
        <>
          {/* Zones */}
          <div style={{ overflowY: "auto", flex: 1, padding: "6px 0", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
            {Object.entries(config.zones).filter(([zoneKey]) =>
              zoneKey === "arrows" ||
              !categoria ||
              zoneKey.startsWith(`${categoria}_`)
            ).map(([zoneKey, zone]) => (
              <div key={zoneKey}>
                {/* Zone header */}
                <div
                  onClick={() => toggleZone(zoneKey)}
                  style={{
                    padding: isMobile ? "10px 16px" : "6px 12px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: "1px solid rgba(242,232,213,0.06)",
                    minHeight: isMobile ? 40 : "auto",
                  }}
                >
                  <span style={{ ...MONO, fontSize: "0.54rem", letterSpacing: "0.12em", color: C.cream, opacity: 0.8 }}>
                    {openZones[zoneKey] ? "▾" : "▸"} {zone.label.toUpperCase()}
                  </span>
                </div>

                {/* Zone elements */}
                {openZones[zoneKey] && (
                  <div style={{ padding: isMobile ? "10px 16px" : "8px 12px" }}>
                    {Object.entries(zone.elements).map(([elemKey, elem]) => (
                      <div key={elemKey} style={{
                        marginBottom: 14,
                        padding: "8px",
                        background: "rgba(242,232,213,0.04)",
                        border: "1px solid rgba(242,232,213,0.08)",
                      }}>
                        <div style={{
                          ...MONO, fontSize: "0.5rem", letterSpacing: "0.15em",
                          color: C.mostaza, marginBottom: 8, textTransform: "uppercase",
                        }}>
                          {elemKey}
                        </div>

                        {Object.entries(elem.props).map(([propKey, prop]) => {
                          const label = PROP_LABELS[propKey] || propKey;

                          if (typeof prop === "string") {
                            return (
                              <TextInput
                                key={propKey}
                                label={label}
                                value={prop}
                                onChange={v => onUpdate(zoneKey, elemKey, propKey, v)}
                                multiline={prop.includes("\n")}
                              />
                            );
                          }

                          if ("unit" in prop) {
                            return (
                              <SliderControl
                                key={propKey}
                                label={label}
                                prop={prop as SliderProp}
                                onChange={v => onUpdate(zoneKey, elemKey, propKey, v)}
                              />
                            );
                          }

                          if ("folder" in prop) {
                            return (
                              <ImagePicker
                                key={propKey}
                                label={label}
                                prop={prop as ImageProp}
                                onChange={v => onUpdate(zoneKey, elemKey, propKey, v)}
                              />
                            );
                          }

                          if ("options" in prop && "value" in prop) {
                            const p = prop as FontProp | ColorProp | AnimationProp;
                            if (["display", "sans", "mono"].includes(p.value as string)) {
                              return <FontPicker key={propKey} label={label} prop={p as FontProp} onChange={v => onUpdate(zoneKey, elemKey, propKey, v)} />;
                            }
                            if (["burgundy", "cream", "tinta", "mostaza"].includes(p.value as string)) {
                              return <ColorPicker key={propKey} label={label} prop={p as ColorProp} onChange={v => onUpdate(zoneKey, elemKey, propKey, v)} />;
                            }
                            if (["none", "fade-up", "fade-in", "slide-left", "scale-in"].includes(p.value as string)) {
                              return <AnimationPicker key={propKey} label={label} prop={p as AnimationProp} onChange={v => onUpdate(zoneKey, elemKey, propKey, v)} />;
                            }
                          }

                          return null;
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ padding: isMobile ? "10px 16px" : "8px 12px", borderTop: "1px solid rgba(242,232,213,0.1)", flexShrink: 0, paddingBottom: isMobile ? "max(10px, env(safe-area-inset-bottom, 10px))" : "8px" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: isMobile ? "12px 0" : "8px 0",
                  background: saving ? C.mostaza : saved ? "rgba(242,232,213,0.1)" : C.burgundy,
                  color: C.cream, border: "none",
                  ...MONO, fontSize: "0.54rem", letterSpacing: "0.14em", cursor: "pointer",
                }}
              >
                {saving ? "..." : saved ? "GUARDADO" : "GUARDAR"}
              </button>
              <button
                onClick={handleExport}
                style={{
                  flex: 1, padding: isMobile ? "12px 0" : "8px 0",
                  background: copied ? "#2a5a2a" : "rgba(242,232,213,0.1)",
                  color: C.cream, border: "none",
                  ...MONO, fontSize: "0.54rem", letterSpacing: "0.14em", cursor: "pointer",
                }}
              >
                {copied ? "COPIADO" : "COPIAR"}
              </button>
            </div>
            <button
              onClick={onReset}
              style={{
                width: "100%", padding: "6px 0",
                background: "transparent", color: C.cream, opacity: 0.4,
                border: "1px solid rgba(242,232,213,0.1)",
                ...MONO, fontSize: "0.48rem", letterSpacing: "0.14em", cursor: "pointer",
              }}
            >
              RESET
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
