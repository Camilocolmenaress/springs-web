"use client";

import { useState } from "react";
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
  right: "Derecha",
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
}

export default function DevPanel({ config, saved, onUpdate, onSave, onExport, onReset, categoria }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [openZones, setOpenZones] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

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

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        position: "fixed", right: 16, top: "15%",
        zIndex: 9999, width: 280,
        background: C.tinta,
        border: "1px solid rgba(242,232,213,0.15)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        cursor: "grab", userSelect: "none",
        maxHeight: "70vh", display: "flex", flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "9px 12px",
          borderBottom: "1px solid rgba(242,232,213,0.1)",
          background: C.burgundy, cursor: "grab", flexShrink: 0,
        }}
        onClick={() => setCollapsed(v => !v)}
      >
        <span style={{ ...MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: C.cream }}>
          SPRINGS DEV {!saved && "●"}
        </span>
        <span style={{ color: C.cream, fontSize: "0.6rem" }}>{collapsed ? "+" : "-"}</span>
      </div>

      {!collapsed && (
        <>
          {/* Zones */}
          <div style={{ overflowY: "auto", flex: 1, padding: "6px 0" }}>
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
                    padding: "6px 12px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: "1px solid rgba(242,232,213,0.06)",
                  }}
                >
                  <span style={{ ...MONO, fontSize: "0.54rem", letterSpacing: "0.12em", color: C.cream, opacity: 0.8 }}>
                    {openZones[zoneKey] ? "▾" : "▸"} {zone.label.toUpperCase()}
                  </span>
                </div>

                {/* Zone elements */}
                {openZones[zoneKey] && (
                  <div style={{ padding: "8px 12px" }}>
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
          <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(242,232,213,0.1)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: "8px 0",
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
                  flex: 1, padding: "8px 0",
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
