"use client";

import { useEffect, useRef } from "react";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import DevPanel from "@/components/DevPanel";

export default function MobileHomeEditor() {
  const { config, saved, updateProp, save, reset, exportValues } = useDesignConfig("home-mobile");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // push config al iframe en cada cambio de slider
  useEffect(() => {
    const send = () =>
      iframeRef.current?.contentWindow?.postMessage(
        { type: "SPRINGS_CONFIG", config },
        "*"
      );
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (iframe.contentDocument?.readyState === "complete") { send(); }
    else { iframe.addEventListener("load", send, { once: true }); }
  }, [config]);

  async function handleSave() {
    await save();
    iframeRef.current?.contentWindow?.location.reload();
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0d0d0d", display: "flex", overflow: "hidden" }}>

      {/* Left: iframe móvil */}
      <div style={{ flexShrink: 0, overflowY: "auto", paddingBottom: 24 }}>
        {/* Barra de preview */}
        <div style={{
          width: 390, height: 20, background: "#1a1a1a",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.42rem",
          letterSpacing: "0.2em", color: "rgba(242,232,213,0.3)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          390 × 844 — MOBILE PREVIEW
        </div>
        <iframe
          ref={iframeRef}
          src="/mobile-preview"
          style={{
            display: "block",
            width: 390, height: 844,
            border: "none",
            outline: "1px solid rgba(242,232,213,0.12)",
          }}
          title="Mobile home preview"
        />
      </div>

      {/* Right: DevPanel */}
      <DevPanel
        config={config}
        saved={saved}
        onUpdate={updateProp}
        onSave={handleSave}
        onExport={exportValues}
        onReset={reset}
        startLeft={406}
      />
    </div>
  );
}
