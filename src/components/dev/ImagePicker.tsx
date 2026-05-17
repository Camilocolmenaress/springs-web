"use client";

import { useState, useEffect } from "react";
import type { ImageProp } from "@/types/design";

const C = { cream: "#F2E8D5", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

interface Props {
  label: string;
  prop: ImageProp;
  onChange: (value: string) => void;
}

export default function ImagePicker({ label, prop, onChange }: Props) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/dev/images")
      .then(r => r.json())
      .then(d => setImages(d.images || []))
      .catch(() => setImages([]));
  }, []);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...MONO, fontSize: "0.52rem", color: C.cream, opacity: 0.65, letterSpacing: "0.08em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {images.map(src => (
          <button
            key={src}
            onClick={() => onChange(src)}
            style={{
              width: "100%", aspectRatio: "1", padding: 0, cursor: "pointer",
              border: prop.value === src ? "2px solid #C5871F" : "1px solid rgba(242,232,213,0.15)",
              background: "rgba(242,232,213,0.06)", overflow: "hidden",
            }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
